const input = 'subscriptions.opml';
const output = 'podcasts.html';
const title = 'Mark’s podcasts';
const scheme = 'podcasts';
const style = `
	body {
		font-family: Helvetica, Arial, sans-serif;
		width: 700px;
		margin: 50px auto;
	}
	h2 {
		margin-top: 60px;
	}`;


/* * * * * * * * * * * * * * * * * * * * * * * * *
 *   Ne pas le edit le file beyonde this point   *
 *      UNLESS ye know what ye are doing;        *
 *              and in that case:                *
 *                have at it,                    *
 *            ye blessed munter    ༼ つ ◕_◕ ༽つ   *
 * * * * * * * * * * * * * * * * * * * * * * * * */

const fs = require('fs');
const xml2json = require('xml2json');
const request = require('request');

try { fs.unlinkSync(output); } catch (e) {}

var podcasts = [];
var totalPodcasts;

function writePodcastsFile (podcasts) {

	let stream = fs.createWriteStream(output, {flags:'a'});
	stream.write(`<!DOCTYPE html><html><head><meta charset="utf-8">\n<title>${title}</title>\n<style>${style}</style>\n</head>\n\n<body>\n\n<h1>${title} (${totalPodcasts})</h1>\n\n`);
	stream.on('finish', function () {
		fs.appendFileSync(output, '</body></html>');
	});

	podcasts.sort(function(pa, pb) {
		let a = pa.title.toLowerCase();
		let b = pb.title.toLowerCase();
		if (a < b) { return -1; }
		if (a > b) { return 1; }
		return 0;
	});

	for (let i = 0, x = podcasts.length; i<x; i++) {
		let podcast = podcasts[i];
		let linkHTML = (podcast.link)
			? `<p>Website: <a href="${podcast.link}" target="_blank">${podcast.link}</a></p>`
			: '';
		let count = i + 1;
		let description = podcast.description;
			description = description.replace(/<\/?(?:p|br)>/g, ' ');
			description = description.replace(/\s+/g, ' ');
		let subscribeURL = podcast.rssURL.replace(/https?:\/\//, scheme+'://');
		stream.write(`
			<h2>${count}. ${podcast.title}</h2>
			<p>${description}</p>
			${linkHTML}
			<p>Subscribe: <a href="${subscribeURL}" target="_blank">${subscribeURL}</a></p>
		`);
	}

	stream.end();

}

fs.readFile(input, function(err, data) {

	let json = xml2json.toJson(data, { object: true });
	let count = 0;
	totalPodcasts = json.opml.body.outline.length;

	for (outline of json.opml.body.outline) {
		let rssURL = outline.xmlUrl;
		request(rssURL, function(err, res, data) {
			try {
				let json = xml2json.toJson(data, { object: true });
				if (json.rss) {
					podcasts.push({
						title : json.rss.channel.title,
						description : json.rss.channel.description,
						rssURL : rssURL,
						link : json.rss.channel.link
					});
					if (++count == totalPodcasts) {
						writePodcastsFile(podcasts);
					}
				}
			} catch (error) {
				console.log('fucked up: ' + rssURL);
				console.log(error);
			}
		});
	}
});

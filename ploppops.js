const input = 'subscriptions.opml';
const output = 'podcasts.html';
const title = "Mark’s podcasts";
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

var stream = fs.createWriteStream(output, {flags:'a'});
stream.on('finish', function () {
	fs.appendFileSync(output, '</body></html>');
});

fs.readFile(input, function(err, data) {
	var json = xml2json.toJson(data, { object: true });
	let count = 0;
	let end = json.opml.body.outline.length;

	stream.write(`<!DOCTYPE html><html><head><meta charset="utf-8">\n<title>${title}</title>\n<style>${style}</style>\n</head>\n\n<body>\n\n<h1>${title} (${end})</h1>\n\n`);

	for (outline of json.opml.body.outline) {
		let rssURL = outline.xmlUrl;
		let podcast = { rssURL: rssURL };
		request(rssURL, function(err, res, data) {
			try {
				var json = xml2json.toJson(data, { object: true });
				if (json.rss) {
					let subscribeURL = rssURL.replace(/https?:\/\//, scheme+'://');
					let description = json.rss.channel.description;
						description = description.replace(/<\/?(?:p|br)>/g, ' ');
						description = description.replace(/\s+/g, ' ');
					let link = json.rss.channel.link;
					let output = `<h2>${++count}. ${json.rss.channel.title}</h2>\n`;
						output += `<p>${description}</p>\n`;
						if (link) {
							output += `<p>Website: <a href="${link}" target="_blank">${link}</a>\n`;
						}
						output += `<p>Subscribe: <a href="${subscribeURL}" target="_blank">${subscribeURL}</a></p>\n\n`;
					stream.write(output);
					if (count == end) {
						stream.end();
					}
				}
			} catch (error) {
				console.log('fucked up: ' + rssURL);
				console.log(error);
			}
		});
	}
});

// stream.write('</body></html>');

const input = 'overcast.opml';
const podcastsOutput = 'podcasts.html';
const categoiresOutput = 'categoires.html';
const title = 'Mark’s podcasts';
const scheme = 'podcast';
const style = ``;


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

try { fs.unlinkSync(podcastsOutput); } catch (e) {}
try { fs.unlinkSync(categoiresOutput); } catch (e) {}

var podcasts = [];

var totalPodcasts;

function writePodcastsFile (podcasts) {

	let podcastsStream = fs.createWriteStream(podcastsOutput, {flags:'a'});
	podcastsStream.write(`<!DOCTYPE html>
	<html>
	<head>
		<meta charset="utf-8">
		<title>${title}</title>
		<style>${style}</style>
	</head>
	<body>
	<h1>${title} (${totalPodcasts})</h1>`);
	podcastsStream.on('finish', function () {
		fs.appendFileSync(podcastsOutput, '</body></html>');
	});

	let categoiresStream = fs.createWriteStream(categoiresOutput, {flags:'a'});
	categoiresStream.write(`<!DOCTYPE html>
	<html><head><meta charset="utf-8">
		<title>${title} pour la categoire</title>
		<style>${style}</style>
		<link href="stile.css" rel="stylesheet">
	</head>\n
	<body class="pour-la-categoire">\n
	<h1>${title} pour la categoire</h1>

	<section id="VoiçoireLeCategoire">
		<p>Please shovoire le categoire up this textboire (shovoire each categoire on its own line, s’il voire ploire).</p>
		<p class="from">
			<textarea rows="5" id=""></textarea>
			<button>➽</button>
		</p>
	</section>

	<section id="LeCategoireTabloire">
		<table>
			<thead>
				<tr>
					<th>Favourite?</th>
					<th colspan="2">Podcast</th>
					<th class="checkbox-cell categoire-cell"></th>
				</tr>
			</thead>
			<tbody>
		`);
	categoiresStream.on('finish', function () {
		let script = '<script src="jamblascrimpt.js"></script>'
		fs.appendFileSync(categoiresOutput, `\n\t\t\t</tbody>\n\t\t</table>\n\t</section>\n\n\t${script}\n\n\t</body>\n</html>`);
	});

	for (let podcast of podcasts) {
		let linkHTML = (podcast.link)
			? `<p>Website: <a href="${podcast.link}" target="_blank">${podcast.link}</a></p>`
			: '';
		let description = podcast.description;
			description = description.replace(/<\/?(?:p|br)>/g, ' ');
			description = description.replace(/\s+/g, ' ');
		let subscribeURL = podcast.rssURL.replace(/https?:\/\//, scheme+'://');
		let id = 'podcast-' + podcast.title.replace(/[^a-z]+/ig, '');

		podcastsStream.write(`
			<div>
				<h2>${podcast.title}</h2>
				<img src="${podcast.image}" alt="">
				<p>${description}</p>
				<footer>
					${linkHTML}
					<p>Subscribe: <a href="${subscribeURL}" target="_blank">${subscribeURL}</a></p>
				</footer>
			</div>
		`);

		categoiresStream.write(`
				<tr>
					<td class="checkbox-cell"><input type="checkbox" id="favorite-${id}"><label for="favorite-${id}"></label></td>
					<td><img src="${podcast.image}" alt=""></td>
					<th>${podcast.title}</th>
					<td class="checkbox-cell categoire-cell"><input type="checkbox" id="categoire-${id}"><label for="categoire-${id}"></label></td>
				</tr>
		`);

	}

	podcastsStream.end();
	categoiresStream.end();

}

function ovalue (obj) {
	var base = obj;
	if (typeof base == 'object' && base !== null) {
		for (var i=1, x=arguments.length; i<x; i++) {
			if (typeof base[arguments[i]] == 'object' && base[arguments[i]] !== null) {
				base = base[arguments[i]];
			} else {
				base = base[arguments[i--]];
				break;
			}
		}
	}
	return base;
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
					delete json.rss.channel.item;

					let title = json.rss.channel.title;

					let imageURL = ovalue(json, 'rss', 'channel', 'itunes:image', 'href');
					if (!imageURL || title.includes('Pep Talks')) {
						imageURL = ovalue(json, 'rss', 'channel', 'image', 'url');
					}

					podcasts.push({
						title : title,
						description : json.rss.channel.description,
						image: imageURL,
						rssURL : rssURL,
						link : json.rss.channel.link
					});

					if (++count == totalPodcasts) {
						for (let podcast of podcasts) {
							podcasts.sort(function(pa, pb) {
								let a = pa.title.toLowerCase();
								let b = pb.title.toLowerCase();
								if (a < b) { return -1; }
								if (a > b) { return 1; }
								return 0;
							});
						}
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

// yusful https://ios.gadgethacks.com/news/always-updated-list-ios-app-url-scheme-names-0184033/

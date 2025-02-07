const input = 'overcast.opml';
const title = 'Mark’s podcasts';
const scheme = 'podcast';
const style = ``;

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *  *   *    *     *
 *        ༼ つ ◕_◕ ༽つ   Ne pas le edit le file beyonde this point                *             *
 *                   unless ye know what ye are doing;                   *        *    *
 *                              and in that case:                  *           *           *
 *                                    have at it,                                  *
 *                                         ye blessed munter        *        *              *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *     *        *       */

const common = require('./common.js');

const fs = require('fs');
const xml2json = require('xml2json');
const request = require('request');

const podcastsJSONOutput = 'podcasts.json';
const podcastsHTMLOutput = 'podcasts.html';
const chooseCategoiresHTMLOutput = 'choose_categoires.html';
const categoiresJSONOutput = 'categoires.json';
const categoiresHTMLOutput = 'categoires.html';

try { fs.unlinkSync(podcastsJSONOutput); } catch (e) {}
try { fs.unlinkSync(podcastsHTMLOutput); } catch (e) {}
try { fs.unlinkSync(chooseCategoiresHTMLOutput); } catch (e) {}
try { fs.unlinkSync(categoiresJSONOutput); } catch (e) {}
try { fs.unlinkSync(categoiresHTMLOutput); } catch (e) {}

var podcasts = [];
var totalPodcasts;

function prepPodcastForHTML (podcast) {
	podcast.website = (podcast.htmlURL)
		? `<p>Website: <a href="${podcast.htmlURL}" target="_blank">${podcast.htmlURL}</a></p>`
		: '';
	podcast.description = podcast.description.replace(/<\/?(?:p|br)>/g, ' ');
	podcast.description = podcast.description.replace(/\s+/g, ' ');
	podcast.subscribeURL = podcast.rssURL.replace(/https?:\/\//, scheme+'://');
	podcast.id = 'podcast-' + podcast.title.replace(/[^a-z]+/ig, '');
	return podcast;
}

function writePodcastsJSON (podcast) {
	fs.writeFile(
		podcastsJSONOutput,
		JSON.stringify(podcast, null, "\t"),
		err => { err && console.log(err); }
	);
}

function writePodcastsHTML (podcasts, style) {
	let podcastsStream = fs.createWriteStream(podcastsHTMLOutput, {flags:'a'});
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
		fs.appendFileSync(podcastsHTMLOutput, '</body></html>');
	});
	for (let podcast of podcasts) {
		podcast = prepPodcastForHTML(podcast);
		podcastsStream.write(`
			<div>
				<h2>${podcast.title}</h2>
				<img src="${podcast.image}" alt="">
				<p>${podcast.description}</p>
				<footer>
					${podcast.linkHTML}
					<p>Subscribe: <a href="${podcast.subscribeURL}" target="_blank">${podcast.subscribeURL}</a></p>
				</footer>
			</div>
		`);
	}
	podcastsStream.end();
}

function writeChooseCategoiresHTML(podcasts, style) {
	let categoiresStream = fs.createWriteStream(chooseCategoiresHTMLOutput, {flags:'a'});
	categoiresStream.write(`<!DOCTYPE html>
	<html><head><meta charset="utf-8">
		<title>${title}: pour la categoire</title>
		<style>${style}</style>
	</head>\n
	<body class="pour-la-categoire">\n
	<h1>${title} — <i>pour la categoire</i></h1>

	<section id="VoiçoireLeCategoire">
		<p>Please shovoire toutes les categoires up this textboire (shovoire each categoire up its own line, s’il voire ploire).</p>
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
					<td class="buttons-cell">
						<button>JSON</button>
						<button>HTML</button>
					</td>
				</tr>
			</thead>
			<tbody>
		`);
	categoiresStream.on('finish', function () {
		let script = '<script src="FileSaver.js"></script><script src="common.js"></script><script src="jamblascrimpt.js"></script>'
		fs.appendFileSync(chooseCategoiresHTMLOutput, `\n\t\t\t</tbody>\n\t\t</table>\n\t</section>\n\n\t${script}\n\n\t</body>\n</html>`);
	});
	for (let podcast of podcasts) {
		podcast = prepPodcastForHTML(podcast);
		categoiresStream.write(`
				<tr data-rssURL="${common.escapeHTML(podcast.rssURL)}"
					data-htmlURL="${common.escapeHTML(podcast.htmlURL || '')}"
					data-description="${common.escapeHTML(podcast.description)}">
					<td class="checkbox-cell">
						<input type="checkbox" id="favorite-${podcast.id}" class="favorite-input">
						<label for="favorite-${podcast.id}"></label>
					</td>
					<td><img src="${podcast.image}" alt=""></td>
					<th>
						<div>
							<p>${podcast.title}</p>
							<p><textarea></textarea></p>
						</div>
					</th>
					<td class="checkbox-cell categoire-cell">
						<input type="checkbox" id="categoire-${podcast.id}" class="categoire-input">
						<label for="categoire-${podcast.id}" value=""></label>
					</td>
				</tr>
		`);
	}
	categoiresStream.end();
}

fs.readFile('stile.css', 'utf8', (err, style) => {

	fs.readFile(input, (err, data) => {

		if (err) {
			console.log(err);
			return;
		}

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

						let imageURL = common.ovalue(json, 'rss', 'channel', 'itunes:image', 'href');
						if (!imageURL || title.includes('Pep Talks')) {
							imageURL = common.ovalue(json, 'rss', 'channel', 'image', 'url');
						}

						podcasts.push({
							title : title,
							description : json.rss.channel.description,
							image: imageURL,
							rssURL : rssURL,
							htmlURL : json.rss.channel.link
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
							writePodcastsJSON(podcasts);
							writePodcastsHTML(podcasts, style);
							writeChooseCategoiresHTML(podcasts, style);
						}

					}
				} catch (error) {
					console.log('fucked up: ' + rssURL);
					console.log(error);
				}
			});
		}

	});

});

// yusful https://ios.gadgethacks.com/news/always-updated-list-ios-app-url-scheme-names-0184033/

const input = 'subscriptions.opml';
const output = 'podcasts.txt';
const title = "Mark's podcasts";
const scheme = 'itms';

// Ne pas le edit le file beyond this point, unless ye know what ye are doing, and then have at it, ye blesséd munter

const fs = require('fs');
const xml2json = require('xml2json');
const request = require('ajax-request');

fs.unlinkSync(output);

var stream = fs.createWriteStream(output, {flags:'a'});
stream.write(title + "\n\n");

fs.readFile(input, function(err, data) {
	var json = xml2json.toJson(data, { object: true });
	let count = 0;
	for (outline of json.opml.body.outline) {
		let rssURL = outline.xmlUrl;
		let podcast = {
			rssURL: rssURL
		};
		request(rssURL, function(err, res, data) {
			try {
				var json = xml2json.toJson(data, { object: true });
				if (json.rss) {
					let description = json.rss.channel.description;
					description = description.replace(/<\/?(?:p|br)>/g, ' ');
					description = description.replace(/\s+/g, ' ')
					let output = ++count + '. ' + json.rss.channel.title + "\n";
					output += description + "\n";
					output += "Website: " + json.rss.channel.link + "\n";
					output += "Subscribe: " scheme + ":" + rssURL + "\n";
					output += "========================================================\n\n";
					stream.write(output);
				}
			} catch (error) {}
		});
	}
});

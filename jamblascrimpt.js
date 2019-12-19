q('#VoiçoireLeCategoire button').addEventListener ('click', function () {
	let voiçoireLeCategoire = qid('VoiçoireLeCategoire');
	let laCategoireTabloire = qid('LeCategoireTabloire');

	let tousLesCategoiresBatardes = q('textarea', voiçoireLeCategoire).value.trim().split(/[\n\r]+/);
	tousLesCategoiresBatardes = tousLesCategoiresBatardes.filter( categoire => !/^\s*$/.test(categoire) );
	tousLesCategoiresBatardes = tousLesCategoiresBatardes.filter( (value, i, array) => array.indexOf(value) === i );

	if (tousLesCategoiresBatardes.length) {

		let buttonsCell = q('.buttons-cell')

		let tousLesCategoires = {};
		for (let batarde of tousLesCategoiresBatardes) {
			let id = 'categoire_' + batarde.replace(/[^a-z]/ig, '');
			tousLesCategoires[id] = batarde.trim();
		}

		let thead = q('thead tr');
		let th = q('th.categoire-cell').cloneNode(true);
		q('th.categoire-cell').remove();

		for (let id in tousLesCategoires) {
			let newTh = th.cloneNode(true);
			newTh.textContent = tousLesCategoires[id];
			thead.insertBefore(newTh, buttonsCell);
		}

		for (let tr of qq('tbody tr')) {
			let td = q('td.categoire-cell', tr).cloneNode(true);
			q('td.categoire-cell', tr).remove();
			for (let id in tousLesCategoires) {
				let newTd = td.cloneNode(true);
				let label = q('label', newTd);
				let input = q('input', newTd);
				label.setAttribute('for', label.getAttribute('for')+`_${id}`);
				input.id += `_${id}`;
				input.value = tousLesCategoires[id];
				tr.appendChild(newTd);
			}
		}

		voiçoireLeCategoire.style.display = 'none';
		laCategoireTabloire.style.display = 'block';

		for (let bewton of qq('.buttons-cell button')) {
			bewton.addEventListener ('click', function () {
				let podcasts = collectPodcastData();
				if (this.textContent == 'JSON') {
					saveAs(new File(
						[JSON.stringify(podcasts, null, '\t')],
						'podcasts.json',
						{ type: 'application/json;charset=utf-8' }
					));
				} else {
					saveAs(new File(
						[writePodcastsHTML(podcasts)],
						'podcasts.html',
						{ type: 'text/html;charset=utf-8' }
					));
				}
			});
		}

	}

});

function writePodcastsHTML(podcasts) {

	var rows = '';

	for (let podcast of podcasts) {
		let favoriteClass = (podcast.favorite) ? 'favorite' : '';
		rows += `<tr data-rssURL="${escapeAttribute(podcast.rssURL)}"
			data-htmlURL="${escapeAttribute(podcast.htmlURL || '')}"
			data-description="${escapeAttribute(podcast.description)}">
			<td><img src="${podcast.image}" alt=""></td>
			<th>${podcast.title}</th>
			<td class="checkbox-cell categoire-cell">
				<input type="checkbox" id="categoire-${podcast.id}" class="categoire-input">
				<label for="categoire-${podcast.id}" value=""></label>
			</td>
		</tr>`;
		rows += `<tr>
			<td><input type="checkbox"></td>
			<td><img src="${podcast.image}" alt=""></td>
			<td>
				<h2>${escapeAttribute(podcast.title)}</h2>
				<p>${escapeAttribute(podcast.description)}</p>
				<p>${escapeAttribute(podcast.comment)}</p>
			</td>
			<td>
				<a href="${escapeAttribute(podcast.htmlURL)}">Visit website</a>
				<a href="${escapeAttribute(podcast.rssURL)}">Subscribe on Apple Podcasts</p>
			</td>
		</tr>`;
	}



	var podcastHTML = `<!DOCTYPE html>
	<html><head><meta charset="utf-8">
		<title>${title}: pour la categoire</title>
		<style>${style}</style>
		<link href="stile.css" rel="stylesheet">
	</head>

	<body class="pour-la-categoire">

	<h1>${title} — <i>pour la categoire</i></h1>

	<section id="LeCategoireTabloire">
		<table>
			<thead>
				<tr>
					<th colspan="2">Podcast</th>
					<th class="checkbox-cell categoire-cell"></th>
				</tr>
			</thead>
			<tbody>
				${rows}
			</tbody>
		</table>
	</section>

	</body>
	</html>`;
}

function collectPodcastData () {
	var podcasts = [];
	for (let tr of qq('tbody tr')) {
		let podcast = {
			favorite : q('.favorite-input', tr).checked,
			imageURL : q('img', tr).src,
			title : q('th', tr).textContent.trim(),
			categoires : [],
			rssURL : tr.dataset.rssurl,
			htmlURL : tr.dataset.htmlurl,
			description : tr.dataset.description,
			// comment : q('textarea', tr).value
		};
		for (let checker of qq('.categoire-input', tr)) {
			checker.checked && podcast.categoires.push(checker.value);
		}
		podcasts.push(podcast);
	}
	return podcasts;
}

function qid (id) {
	return document.getElementById(id);
}

function q (selector, context = document) {
	return context.querySelector(selector);
}

function qq (selector, context = document) {
	return context.querySelectorAll(selector);
}

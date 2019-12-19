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
                collectPodcastData();
                // if (this.textContent == 'JSON') {
            });
        }

    }

});

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
            description : tr.dataset.description
        };

        for (let checker of qq('.categoire-input', tr)) {
            checker.checked && podcast.categoires.push(checker.value);
        }

        console.log(podcast);

    }
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

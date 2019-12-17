q('#VoiçoireLeCategoire button').addEventListener ('click', function () {
    let voiçoireLeCategoire = qid('VoiçoireLeCategoire');
    let laCategoireTabloire = qid('LeCategoireTabloire');

    let tousLesCategoiresBatardes = q('textarea', voiçoireLeCategoire).value.trim().split(/[\n\r]+/);
    tousLesCategoiresBatardes = tousLesCategoiresBatardes.filter( c => {
        return !/^\s*$/.test(c);
    });

    if (tousLesCategoiresBatardes.length) {

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
            thead.appendChild(newTh);
        }

        for (let tr of qq('tbody tr')) {
            let td = q('td.categoire-cell', tr).cloneNode(true);
            q('td.categoire-cell', tr).remove();
            for (let id in tousLesCategoires) {
                let newTd = td.cloneNode(true);
                let label = q('label', newTd);
                label.setAttribute('for', label.getAttribute('for')+`_${id}`);
                q('input', newTd).id += `_${id}`;
                tr.appendChild(newTd);
            }
        }

        voiçoireLeCategoire.style.display = 'none';
        laCategoireTabloire.style.display = 'block';
    }
});

function qid (id) {
    return document.getElementById(id);
}

function q (selector, context = document) {
    return context.querySelector(selector);
}

function qq (selector, context = document) {
    return context.querySelectorAll(selector);
}

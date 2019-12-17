# Human Readable OPML

A littel node script what taketh thine OPML file and rendereth it unto an human readable HTML file. It goeth through each subscription and it pulleth the title, description and website from the feed URL, and createth a nice littel HTML file what thou canst share with thy friends and enemies, thy loved ones, and with the authorities as thou pleasest or howsoever thou be required by law, so help us all.

Installation followeth the normal malarkey: `npm install`. Then munst thou run the file like so: `node ploppops.js`.

If thou wishest to make edits to these parameters herein, **thou munst be a good goat** and edit the file for thine own needs. Things what thou mayest want to change are below. These do appear at the top of the JS file as constants.

- `input` — the subscriptions file name, a relative filepath, in OPML format; the default be `subscriptions.opml`
- `output` — the HTML file, a relative filepath, where the human readable list shall be made to exist; the default be `podcasts.html`
- `title` — the title which appeareth at the top of the file; the default be `Mark's podcasts`, which thou mayest wish to change to thine own name, or a titelle of thine own choosing
- `scheme` — the littel piece of text, a "tag" if thou wilst, what specifieth in which app to open the podcast, e.g. `itms`, `podcasts`; the default be `itms` or something, I am yet to decide; and lo, mark thou this point welle: this mayeth go away since this whole business seemeth to be the darkest shenanigans (yea, even unto the end of time) and it mayeth prove more expedient to be rid of the entire filthy enterprise.
- `style` — here be CSS to make thine HTML full betterer for the gentler eye

## Categoire

Included in this littel repositoire is the abilitoire to put your podcasts into what categoire what seem appropriate to you. This is a nice littel HTML page which does the business quite good. You should be awoire that I have created it with whimsy and silliness and written it in a language called Frunch, so any copy on it is basically complete nonsense. If you don't like this, I quite invite you to change your mind.

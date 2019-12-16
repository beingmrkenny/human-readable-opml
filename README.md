# Human Readable OPML

A littel node script what taketh thine OPML file and rendereth it unto a human readable text file. It goeth through each subscription and pulleth the title, description and website from the feed URL, and createth a nice littel text file what thou canst share with thy friends and loved ones as thou pleasest.

Installation followeth the normal malarkey: `npm install`. Then munst thou run the file like, so `node ploppops.js`.

If thou wishest to make edits to some parameters, **thou munst be a good goat** and edit the file for thine own needs. Things what thou mayest want to change are below. These appear at the top of the file as constants.

- `input` — the subscriptions file name, in OPML format; the default be `subscriptions.opml`
- `output` — the text file where the human readable list be made manifest; the default be `podcasts.txt`
- `title` — the title which appeareth at the top of the file; the default be `Mark's podcasts`, which thou mayest wish to change to thine own name, or a titel of thine own choosing
- `scheme` — the littel piece of text, a "tag" if thou wilst, what specifieth in which app to open the podcast, e.g. `itms`, `podcasts`; the default be `itms` or something, I am yet to decide; and lo, mark thou this point well: this mayeth go away since this whole business seemeth to be of the darkest shenanigans (yea, even unto the end of time) and it mayeth prove more expedient to be rid of the entire filthy enterprise.

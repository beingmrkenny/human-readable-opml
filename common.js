function escapeHTML (string) {
	const entityMap = {
		'&' : '&amp;',
		'<' : '&lt;',
		'>' : '&gt;',
		' ' : '&#32;',
		'!' : '&#33;',
		'"' : '&#34;',
		'$' : '&#36;',
		'%' : '&#37;',
		"'" : '&#39;',
		'(' : '&#40;',
		')' : '&#41;',
		'+' : '&#43;',
		'/' : '&#47;',
		'=' : '&#61;',
		'@' : '&#64;',
		'[' : '&#91;',
		']' : '&#93;',
		'`' : '&#96;',
		'{' : '&#123;',
		'}' : '&#125;',
	};
	return String(string).replace(/[[&<> !"$%'()+/=@`{}]|]/g, s => entityMap[s] );
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

if (typeof exports === 'object') {
	module.exports.escapeHTML = escapeHTML;
	module.exports.ovalue = ovalue;
	registeredInModuleLoader = true;
}

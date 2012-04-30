/**
 * Handle the Regular Expression for Javascript
 *
 * @author Georg Limbach <georf@dev.mgvmedia.com>
 *
 * @class ParserJavascript
 * @constructor
 * @param {Function} config The config RegularExpression object
 * @param {String} text Text to parse
 * @param {String} expression Regular expression
 * @param {String} flags Flags to use
 * @param {Function} callback Callback function for data result
 */
function ParserJavascript(config, text, expression, flags, callback) {

	this._config = config;
	this._text = text;
	this._expression = expression;
	this._flags = flags;
	this._callback = callback;

  this._escapeString = function (text) {
    return text.replace(/'/g, "\\'").replace(/\\/g, "\\\\");
  };



	// catch javascript exceptions from parser
	try {
		// check flags
		var flags = "", global = false;
		for (var i = 0; i < this._flags.length; i++) {
			switch (this._flags[i]) {
			case "g":
				flags += "g";
				global = true;
				break;
			case "m":
				flags += "m";
				break;
			case "i":
				flags += "i";
				break;
			}
		}

		// generate regular expression object
		var regex = new RegExp(this._expression, flags);

		var match, matches = [];

		while ((match = regex.exec(this._text)) != null) {

			matches[matches.length] = {
				text: match[0],
				index: match.index,
				subexpressions: match
			};

			// only one loop if not global search or an empty result
			if (!global || match[0] == '') break;
		}

		callback( {
			"parser": "javascript",
			"regularExpression": this._expression,
			"flags": this._flags,
			"matchText": this._text,
			"error": false,
			"matchings": matches,
			"programming":
				"var match = '" + this._escapeString(this._text) + "';\n" +
				"var regex = new RegExp('" + this._escapeString(this._expression) + "', '" + flags + "');\n" +
				"while ((match = regex.exec(text)) != null) {\n" +
				"  alert(match[0]);\n" +
				"}\n"
		});
	} catch (e) {
		callback( {
			"parser": "javascript",
			"regularExpression": this._expression,
			"flags": this._flags,
			"matchText": this._text,
			"error": e.message,
			"matchings": [],
			"progamming": "",
		});
	}
}

/**
 * Handle the Regular Expression for Server roundtrips
 *
 * @author Georg Limbach <georf@dev.mgvmedia.com>
 *
 * @class ParserAjax
 * @constructor
 * @param {Function} config The config RegularExpression object
 * @param {String} text Text to parse
 * @param {String} expression Regular expression
 * @param {String} flags Flags to use
 * @param {Function} callback Callback function for data result
 */
function ParserAjax(config, text, expression, flags, callback) {
	this._URL = 'parser/parser.php';


	this._config = config;
	this._text = text;
	this._expression = expression;
	this._flags = flags;
	this._callback = callback;


	// post to server parser
	$.post(this._URL, {
			json: $.toJSON({
				"parser": this._config.getName(),
				"regularExpression": this._expression,
				"flags": this._flags,
				"matchText": this._text
			})
		}, callback, "json");
}

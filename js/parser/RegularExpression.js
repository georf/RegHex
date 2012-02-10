/**
 * Handle Regular Expression for config
 *
 * @author Georg Limbach <georf@dev.mgvmedia.com>
 *
 * @class RegularExpression
 * @constructor
 * @param {String} name Parser name
 * @param {String} flags Allowed flags
 * @param {String[]} urls Array of info urls
 * @param {Function} parser function to parse
 */
function RegularExpression(name, flags, urls, parser) {

	/**
	 * Name of the parser
	 * @type String
	 */
	this._name = name;

	/**
	 * Allowed flags
	 * @type String
	 */
	this._flags = flags;

	/**
	 * Information urls
	 * @type String[]
	 */
	this._urls = urls;

	/**
	 * Regular expression to parse
	 * @type String
	 */
	this._expression = '';

	/**
	 * Set flags
	 * @param String
	 */
	this._setFlags = [];

	/**
	 * Function for parse
	 * @param Function
	 */
	this._parser = parser;


	/**
	 * Returns the name
	 * @returns {String} name
	 */
	this.getName = function() {
		return this._name;
	}

	/**
	 * Returns the allowed flags
	 * @returns {String} flags
	 */
	this.getFlags = function() {
		return this._flags;
	}

	/**
	 * Returns information urls
	 * @returns {String[]} urls
	 */
	this.getUrls = function() {
		return this._urls;
	}


	/**
	 * Sets a new regular expression
	 * @param {String} expression e.g. "[a-z]+"
	 * @returns this
	 */
	this.setRegularExpression = function (expression) {
		this._expression = expression;
		return this;
	};

	/**
	 * Sets the expression flags
	 * @param {String[]} flags e.g. ["i","g"]
	 * @returns this
	 */
	this.setFlags = function (flags) {
		this._setFlags = flags;
		return this;
	};

	/**
	 * Parse a text and return result to callback
	 * @param {String} text text to parse
	 * @param {Function} callback Callback for result
	 * @returns this
	 */
	this.parse  = function (text, callback) {

		// check in cache for value
		var cache = RegularExpressionCache.getValue(
			text,
			this._expression,
			this._setFlags,
			this._name
		);

		if (typeof cache != 'boolean') {
			console.debug('Callback (from cache)', cache);
			callback(cache);
			return this;
		}

		// otherwise call parser
		new parser(this, text, this._expression, this._setFlags, function(data) {
			console.debug('Callback (live parsed)', data);

			// error handling
			if (!data || typeof data.error == "undefined") {
				return;
			}

			// add value to cache
			RegularExpressionCache.addValue(data);

			// call original callback
			callback(data);
		});
		return this;
	};
}

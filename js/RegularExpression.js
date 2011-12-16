/**
 * Handle the Regular Expression Parser and the matching cache
 *
 * @author Georg Limbach <georf@dev.mgvmedia.com>
 */
function RegularExpression() {
	this.expression = '';
	this.options = new Array();
	this.parser = 'javascript';


	/**
	 * Sets a new regular expression
	 * @param String e.g. "[a-z]+"
	 * @return this
	 */
	this.setRegularExpression = function (expression) {
		this.expression = expression;
		return this;
	};

	/**
	 * Sets the expression options
	 * @param String[] e.g. ["i","g"]
	 * @param this
	 */
	this.setOptions = function (options) {
		this.options = options;
		return this;
	};

	/**
	 * Sets the parser type
	 * @param String e.g. "javascript"
	 * @param this
	 */
	this.setParser = function (parser) {
		this.parser = parser;
		return this;
	};

	/**
	 * Parse a text and return result to callback
	 * @param String text to parse
	 * @param Function Callback
	 * @return this
	 */
	this.parse  = function (text, callback) {
		// check in cache
		var cache = RegularExpressionCache.getValue(
			text,
			this.expression,
			this.options,
			this.parser
		);

		if (typeof cache != 'boolean') {
			console.debug('Callback (from cache)', cache);
			callback(cache);
			return this;
		}


		var parser = new RegularExpressionParser(this.parser);
		parser.parse(text, this.expression, this.options, function(data) {
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

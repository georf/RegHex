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
	}

	/**
	 * Sets the expression options
	 * @param String[] e.g. ["i","g"]
	 * @param this
	 */
	this.setOptions = function (options) {
		this.options = options;
		return this;
	}

	/**
	 * Sets the parser type
	 * @param String e.g. "javascript"
	 * @param this
	 */
	this.setParser = function (parser) {
		this.parser = parser;
		return this;
	}

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

			// add value to cache
			RegularExpressionCache.addValue(data);

			// call original callback
			callback(data);
		});
		return this;
	}
}


/**
 * A implementation of a cache with maximum number of elements
 *
 * Internal it's a simple queue and a array.
 *
 * @author Georg Limbach <georf@dev.mgvmedia.com>
 */
var RegularExpressionCache = new function() {
	this.MAX_ELEMENTS = 100;


	/**
	 * The cache is a associative array like this:
	 * [ "javascript" =>
	 *     [
	 *         "[a-z]" => Object,
	 *         "[a-z]+" => Object
	 *     ]
	 * ]
	 */
	this.cache = new Array();

	/**
	 * Count all elements in the tree
	 */
	this.counter = 0;

	/**
	 * Every element has a pointer to his successor
	 */
	this.next = null;
	this.last = null;

	/**
	 * Checks the cache for a value
	 * @param String
	 * @param String
	 * @param String[]
	 * @param String
	 * @return Boolean or Object
	 */
	this.getValue = function (text, expression, options, parser) {
		if (typeof this.cache[parser] == 'undefined' || typeof this.cache[parser][expression] == 'undefined') {
			return false;
		} else {
			var opt = this.hashOptions(options);

			for (var i = 0; i < this.cache[parser][expression].length; i++) {
				var current = this.cache[parser][expression][i];
				if (current.matchText == text && current.optionsHash == opt) {
					return current;
				}
			}
			return false;
		}
	}

	/**
	 * Adds a value to cache
	 * @param Object
	 */
	this.addValue = function (data) {
		var parser = data.parser;
		var expression = data.regularExpression;
		data.optionsHash = this.hashOptions(data.options);

		// check for structur
		if (typeof this.cache[parser] == 'undefined') {
			this.cache[parser] = new Array();
		}

		if (typeof this.cache[parser][expression] == 'undefined') {
			this.cache[parser][expression] = new Array();
		}


		// update pointers

		// if it's the first element
		if (this.next == null) {
			this.next = data;
		} else {
			this.last.next = data;
		}
		this.last = data;

		// insert new element
		var pointer = this.cache[parser][expression].length;
		this.cache[parser][expression][pointer] = data;
		this.counter++;

		// clean cache
		this.cleanUp();
	}

	/**
	 * Clean up the cache
	 *
	 * Check for to many elements and delete the oldest ones. After
	 * that rebuild the search tree.
	 *
	 * Call this method periodly or in idyll time.
	 */
	this.cleanUp = function () {
		while (this.counter > this.MAX_ELEMENTS) {
			var data = this.next;
			var parser = data.parser;
			var expression = data.regularExpression;

			// search in the tree for the element
			for (var i = 0; i < this.cache[parser][expression].length; i++) {
				if (this.cache[parser][expression][i] == data) {

					// delete this element in array
					this.cache[parser][expression].splice(i, 1);

					break;
				}
			}

			// delete array if its empty
			if (this.cache[parser][expression].length == 0) {
				delete(this.cache[parser][expression]);
			}

			this.next = data.next;
			this.counter--;
		}
	}


	/**
	 * generate a hash value for the reg. exp. options
	 * @param String[] e.g. ["i","g"]
	 * @return String e.g. "gi"
	 */
	this.hashOptions = function (options) {
		options.sort();
		var ret = '';
		for (var i = 0; i < options.length; i++) {
			ret += options[i];
		}
		return ret;
	}
}

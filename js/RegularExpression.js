/**
 * Handle the Regular Expression Parser and the matching cache
 *
 * @author Georg Limbach <georf@dev.mgvmedia.com>
 */
function RegularExpression() {
}


var RegularExpressionCache = function() {
	this.MAX_ELEMENTS = 100;

	this.cache = new Array();
	this.counter = 0;


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

			for (var i = 0; i < this.cache[parser][expression].elements.length; i++) {
				var current = this.cache[parser][expression].elements[i];
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
		var opt = this.hashOptions(data.options);

		if (typeof this.cache[parser] == 'undefined') {
			this.cache[parser] = new Array();
		}

		if (typeof this.cache[parser][expression] == 'undefined') {
			this.cache[parser][expression] = {
				pointer: -1,
				elements: new Array()
			};
		}

		var newPointer = this.cache[parser][expression].pointer + 1;

		if (this.counter >= this.MAX_ELEMENTS) {
			newPointer = newPointer % (this.cache[parser][expression].elements.length + 1);
		}

		this.cache[parser][expression].pointer = newPointer;
		this.cache[parser][expression].elements[newPointer] = data;
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
	}
}

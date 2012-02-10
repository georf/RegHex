/**
 * A implementation of a cache with maximum number of elements
 *
 * Internal it's a simple queue and a array.
 *
 * @author Georg Limbach <georf@dev.mgvmedia.com>
 * @class
 * @constructor
 */
var RegularExpressionCache = new function() {
	this._MAX_ELEMENTS = 100;


	/**
	 * The cache is a associative array like this:
	 * [ "javascript" =>
	 *     [
	 *         "[a-z]" => Object,
	 *         "[a-z]+" => Object
	 *     ]
	 * ]
	 * @type Object
	 */
	this._cache = {};

	/**
	 * Count all elements in the tree
	 * @type number
	 */
	this._counter = 0;

	/**
	 * Every element has a pointer to his successor
	 * @type Object
	 */
	this._next = null;
	this._last = null;


	/**
	 * Checks the cache for a value
	 * @param {String} text
	 * @param {String} expression
	 * @param {String[]} flags
	 * @param {String} parser
	 * @returns {boolean|Object}
	 */
	this.getValue = function (text, expression, flags, parser) {

		if (typeof this._cache[parser] == 'undefined' || typeof this._cache[parser][expression] == 'undefined') {

			return false;

		} else {
			var opt = this._hashFlags(flags);

			for (var i = 0; i < this._cache[parser][expression].length; i++) {
				var current = this._cache[parser][expression][i];
				if (current.matchText == text && current.flagsHash == opt) {
					return current;
				}
			}
			return false;
		}
	}

	/**
	 * Adds a value to cache
	 * @param {Object} data
	 */
	this.addValue = function (data) {
		var parser = data.parser;
		var expression = data.regularExpression;

		data.flagsHash = this._hashFlags(data.flags);

		// check for structur
		if (typeof this._cache[parser] == 'undefined') {
			this._cache[parser] = {}
		}

		if (typeof this._cache[parser][expression] == 'undefined') {
			this._cache[parser][expression] = []
		}


		// update pointers

		// if it's the first element
		if (this._next == null) {
			this._next = data;
		} else {
			this._last._next = data;
		}
		this._last = data;

		// insert new element
		var pointer = this._cache[parser][expression].length;
		this._cache[parser][expression][pointer] = data;
		this._counter++;

		// clean cache
		this._cleanUp();
	}

	/**
	 * Clean up the cache
	 *
	 * Check for to many elements and delete the oldest ones. After
	 * that rebuild the search tree.
	 *
	 * Call this method periodly or in idyll time.
	 */
	this._cleanUp = function () {
		while (this._counter > this._MAX_ELEMENTS) {
			var data = this._next;
			var parser = data.parser;
			var expression = data.regularExpression;

			// search in the tree for the element
			for (var i = 0; i < this._cache[parser][expression].length; i++) {
				if (this._cache[parser][expression][i] == data) {

					// delete this element in array
					this._cache[parser][expression].splice(i, 1);

					break;
				}
			}

			// delete array if its empty
			if (this._cache[parser][expression].length == 0) {
				delete(this._cache[parser][expression]);
			}

			this._next = data._next;
			this._counter--;
		}
	}


	/**
	 * generate a hash value for the reg. exp. flags
	 * @param {String[]} flags e.g. ["i","g"]
	 * @returns {String} e.g. "gi"
	 */
	this._hashFlags = function (flags) {
		flags.sort();
		var ret = '';
		for (var i = 0; i < flags.length; i++) {
			ret += flags[i];
		}
		return ret;
	}
}

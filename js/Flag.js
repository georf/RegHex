/**
 * @author Georg Limbach <georf@dev.mgvmedia.com>
 * @constructor
 * @param {String} flag e.g. "i"
 * @param {String} description
 */
function Flag(flag, description, flagname) {

	if (typeof flagname == 'undefined') {
		flagname = flag;
	}

	this._li = $(
			'<li><label for="option-' +
				flag +
			'"><input type="checkbox" name="option-' +
				flag +
			'" id="option-' +
				flag +
			'" class="parser-option"><strong>' +
				flagname +
			'</strong>' +
				description +
			'</label></li>');

	/**
	 * Returns a jquery li html object for this flag
	 * @return {jQuery}
	 */
	this.getLi = function() {
		return this._li;
	}
}

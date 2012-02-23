/**
 * @author Georg Limbach <georf@dev.mgvmedia.com>
 * @constructor
 */
function UICodeSnip() {

	/**
	 * Update the code block
	 * @param {String} code
	 */
	this.update = function(code) {
		var cb = $('#codeblock');
		cb.val(code);
		cb.show();
	}
}

/**
 * Generates one help step
 * It sets a message
 *
 * @author Georg Limbach <georf@dev.mgvmedia.com>
 *
 * @constructor
 */
function SetMessageStep(message) {
	var div = $('#help-current-task');

	/**
	 * run method
	 * @type Function
	 */
	this.run = function() {
		div.html(message);
	};

	/**
	 * time for this step
	 * @type int
	 */
	this.time = 100;
}

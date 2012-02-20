/**
 * Generates one help step
 * It moves the message
 *
 * @author Georg Limbach <georf@dev.mgvmedia.com>
 *
 * @constructor
 * @param {String} toElement jquery selector string for element to move
 * @param {int} position position to move: 1 = top, 2 = right, 3 = bottom, 4 = left
 * @param {int} [time] default is 1000
 */
function MoveMessageStep(toElement, position, time) {
	var div = $('#help-current-task'), $this = this;

	if (typeof time == 'undefined') {
		time = 1000;
	}

	this._toElement = toElement;
	this._position = position;

	/**
	 * run method
	 * @type Function
	 */
	this.run = function() {
		var toElement = $($this._toElement);

		var offset = toElement.offset();
		var left = offset.left;
		var top = offset.top;

		switch ($this._position) {
			case 1:
				top -= div.height() + 20;
				break;

			case 2:
				left += toElement.width() + 50;
				break;

			case 3:
				top += toElement.height() + 20;
				break;

			case 4:
				left -= div.width() + 50;
				break;
		}

		div.animate({
			'left': Math.round(left),
			'top': Math.round(top)
		}, Math.round($this.time*0.9));
	};

	/**
	 * time for this step
	 * @type int
	 */
	this.time = time;
}

/**
 * Handle a match text
 *
 * @author Georg Limbach <georf@dev.mgvmedia.com>
 */
function MatchText() {


	this.text = "";

	/**
	 * Sets the current text
	 *
	 * @param string
	 * @return boolean true is value changed
	 */
	this.setText = function (text) {
		var ret = (text != this.text);
		this.text = text;
		return ret;
	}

	/**
	 * Implements the Observer pattern
	 *
	 * @param UIMatchField
	 */
	this.notify = function (matchTextField) {

		// set new value
		if (!this.setText(matchTextField.getText())) {

			// value not changed
			return;
		}

		// TODO: implementation
	}
}

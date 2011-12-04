/**
 * Handle a match text
 *
 * @author Georg Limbach <georf@dev.mgvmedia.com>
 *
 * @param UIMatchField observer
 */
function MatchText(observer) {

	this.observer = observer;
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

		return RegHex.getRegularExpression().parse(this.text);
	}
}

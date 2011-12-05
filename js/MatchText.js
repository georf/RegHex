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
	 * @return this
	 */
	this.setText = function (text) {
		this.text = text;
		return this;
	}

	/**
	 * Implements the Observer pattern
	 *
	 * @param UIMatchField
	 * @return this;
	 */
	this.notify = function (matchTextField) {

		// set new value
		this.setText(matchTextField.getText());

		// parse expression
		RegHex.getRegularExpression().parse(this.text, function(data) {
			matchTextField.notify(data);
		});

		return this;
	}
}

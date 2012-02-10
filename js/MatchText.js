/**
 * Handle a match text
 *
 * @author Georg Limbach <georf@dev.mgvmedia.com>
 *
 * @constructor
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
	};

	/**
	 * Implements the Observer pattern
	 *
	 * @param UIMatchField
	 * @return this;
	 */
	this.notify = function (matchTextField, errorCallback, responseCallback) {

		if (typeof matchTextField == 'undefined') {
			matchTextField = this.observer;
		}

		// set new value
		this.setText(matchTextField.getText());

		// parse expression
		RegHex.getRegularExpression().parse(this.text, function(data) {
			if (typeof data.error != 'boolean') {
				errorCallback(data.error);
			}
			matchTextField.notify(data);
			responseCallback(data);
		});

		return this;
	};

	/**
	 * Set all pointer counts to zero
	 */
	this.finalize = function () {
		for(var key in this) {
			if (typeof this[key] != 'function') {
				delete(this[key]);
			}
		}
	};
}

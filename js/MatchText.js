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
  this._responseCallback = function(){};

  /**
   * Sets the default response callback
   * @param {Function}
   */
  this.setResponseCallback = function (callback) {
    this._responseCallback = callback;
  };

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
   * Returns the current text
   * @returns {String}
   */
  this.getText = function () {
    return this.text;
  };

	/**
	 * Implements the Observer pattern
	 *
	 * @param UIMatchField
	 * @return this;
	 */
	this.notify = function (matchTextField, errorCallback, responseCallback) {
    var self = this;

		if (typeof matchTextField == 'undefined') {
			matchTextField = this.observer;
    }

    if (typeof errorCallback == 'undefined') {
      errorCallback = function(value) {};
    }

    if (typeof responseCallback == 'undefined') {
      responseCallbackI = this._responseCallback;
    } else {
      responseCallbackI = function (value) {
        self._responseCallback(value);
        responseCallback(value);
      }
    }

		// set new value
		this.setText(matchTextField.getText());

		// parse expression
		RegHex.getRegularExpression().parse(this.text, function(data) {
			if (typeof data.error != 'boolean') {
				errorCallback(data.error);
			}
			matchTextField.notify(data);
			responseCallbackI(data);
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

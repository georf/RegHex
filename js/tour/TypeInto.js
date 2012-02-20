/**
 * A helper for real time typing
 *
 * @author Georg Limbach <georf@dev.mgvmedia.com>
 *
 *
 * @constructor
 * @param {jQuery} area Textarea to write into
 * @param {String} val Value to type
 * @param {int} millisec Milliseconds between keys
 */
function TypeInto(area, val, millisec) {
	var $this = this;

	/**
	 * Textarea to write into
	 * @type jQuery
	 */
	this._area = area;

	/**
	 * Value to type
	 * @type String
	 */
	this._val = val;

	/**
	 * Milliseconds between keys
	 * @type int
	 */
	this._millisec = millisec;

	/**
	 * Counter for steps
	 * @type int
	 */
	this._step = 0;

	/**
	 * Type one key
	 */
	this._typeKey = function() {
		$this._area.val($this._val.substring(0, $this._step));
		$this._area.trigger('keyup');

		if ($this._step < $this._val.length) {
			$this._step++;
			setTimeout($this._typeKey, $this._millisec);
		}
	};

	// begin to type
	this._typeKey();
}

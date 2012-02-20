/**
 * Generate a live help
 *
 * @author Georg Limbach <georf@dev.mgvmedia.com>
 *
 * @constructor
 */

function Help() {
	var $this = this,
		darkRoom = $('<div>press escape to exit tour</div>');

	darkRoom.attr('id', 'darkRoom').appendTo('body');
	this.lastTimeout = null;

	this.close = function() {
		$this.breakSteps();
		darkRoom.remove();
	};


	this.steps = new Array(
		new Step('Welcome to the help tour', function() {
		}, 5000),

		new MoveStep('Select your parser language', '#parser-type', 100, $('#parser-type')),

		new Step('Select your parser language', function() {
			// let it blink 3 times
			$('#parser-type').focus()
			.fadeOut(500).fadeIn(500)
			.fadeOut(500).fadeIn(500)
			.fadeOut(500).fadeIn(500);
		}, 7500, $('#parser-type')),

		new Step('', function() {
		}, 500),

		new MoveStep('Type your first match text', '#matchtext', 1500, $('.matchtext-block:nth-child(1)')),

		new Step('Type your first match text', function() {
		}, 2000, $('.matchtext-block:nth-child(1)')),

		new Step('Type your first match text', function() {

			// add a match text
			new TypeInto($('#matchtext').focus(), 'abb', 500);
		}, 7000, $('.matchtext-block:nth-child(1)')),

		new Step('', function() {
		}, 1000),


		new MoveStep('Create a new match text field with the plus button', '#add-matchtext', 3000, $('#add-matchtext')),

		new Step('Create a new match text field with the plus button', function() {
			// let plus blink 3 times
			$('#add-matchtext').focus()
			.fadeOut(500).fadeIn(500)
			.fadeOut(500).fadeIn(500)
			.fadeOut(500).fadeIn(500, function() {

				$('#add-matchtext').click();
			});
		}, 4500, $('#add-matchtext')),

		new MoveStep('Type your second match text', '.matchtext-block:nth-child(2)', 2000, $('.matchtext-block:nth-child(2)')),

		new Step('Type your second match text', function() {
			// add a match text
			new TypeInto($('#newid' + (matchingBlockId-1)).focus(), 'test abc ade', 300);
		}, 10000, function() { return $('.matchtext-block:nth-child(2)'); }),

		new Step('', function() {
		}, 100),

		new Step('Type your regular expression', function() {
			// add a regular expression
			$('#regex').focus();
			new TypeInto($('#regex'), 'a([a-z]+)', 300);
		}, 10000, $('#regex')),

		new Step('See at your match text. The green part is matching.', function() {
		}, 10000, function() { return $('.matchtext-block'); }),

		new MoveStep('Now we want to see the groups. Click at subexpression.', '.navigate-match-section:first', 500, function() {return $('.matchtext-block:nth-child(1)'); }),

		new Step('Now we want to see the groups. Click at subexpression.', function() {
			// let plus blink 3 times
			$('.navigate-match-section:first .match-more-info a').focus()
			.fadeOut(300).fadeIn(300)
			.fadeOut(300).fadeIn(300)
			.fadeOut(300).fadeIn(300, function() {
				$('.navigate-match-section:first .match-more-info a').click();
			});

		}, 15000, function() { return $('.navigate-match-section:first, .more-information.overlay.group');}),

		new Step('Try it yourself!', function() {
		}, 5000),

		// last step!
		new Step('', function() {
			$('#help-current-task').hide();
		}, 100)
	);

	this.runSteps = function() {
		$('#help-current-task').html('').show();
		var time = 0;

		for ( var i = 0; i < $this.steps.length; i++) {

			$this.steps[i].timeoutId = setTimeout($this.steps[i].run, time);
			time += $this.steps[i].time;
			$this.steps[i].timeoutId = setTimeout($this.steps[i].terminate, time-5);
		}
	};

	this.breakSteps = function() {
		var time = 0;
		for ( var i = 0; i < $this.steps.length; i++) {
			if ($this.steps[i].timeoutId != null) {
				clearTimeout($this.steps[i].timeoutId);
				$this.steps[i].timeoutId = null;
				$this.steps[i].terminate();
			}
		}
	};

	// initiation
	$this.runSteps();

	// bind esc for close
	$(document).keyup(function(e) {
		if (e.keyCode == 27) {
			$this.close();
		}
	});


}

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

/**
 * @constructor
 */
function Step(message, callback, time, hElements) {
	var $this = this;

	this.callback = callback;
	this.time = time;
	this.message = message;
	this.highlightedElements = hElements;

	this.timeoutId = null;

	this.run = function() {
		$('#help-current-task').html($this.message);
		$this.highlight();

		$this.callback();
	};

	this.terminate = function() {
		$this.lowlight();

		$this.timeoutId = null;
	};

	this.highlight = function() {
		if (typeof $this.highlightedElements == 'function') {
			$this.highlightedElements = $this.highlightedElements();
		}

		if (typeof $this.highlightedElements != 'undefined') {
			$this.highlightedElements.css({position: 'relative', 'z-index': '999'});
		}
	};

	this.lowlight = function() {
		if (typeof $this.highlightedElements == 'function') {
			$this.highlightedElements = $this.highlightedElements();
		}

		if (typeof $this.highlightedElements != 'undefined') {
			$this.highlightedElements.css('z-index', 1);
		}
	};
}


/**
 * @constructor
 */
function MoveStep(message, toElement, time, hElements) {
	var $this = this;

	this.toElement = toElement;
	this.time = time;
	this.message = message;
	this.highlightedElements = hElements;

	this.timeoutId = null;

	this.run = function() {

		var offset = $($this.toElement).offset();
		var width = $('#help-current-task').width()+50;

		$('#help-current-task').html($this.message).animate({
			'left': Math.round(offset.left-width),
			'top': Math.round(offset.top)
		}, Math.round($this.time*0.8));
		$this.highlight();
	};

	this.terminate = function() {
		$this.lowlight();

		$this.timeoutId = null;
	};

	this.highlight = function() {
		if (typeof $this.highlightedElements == 'function') {
			$this.highlightedElements = $this.highlightedElements();
		}

		if (typeof $this.highlightedElements != 'undefined') {
			$this.highlightedElements.css({position: 'relative', 'z-index': '999'});
		}
	};

	this.lowlight = function() {
		if (typeof $this.highlightedElements == 'function') {
			$this.highlightedElements = $this.highlightedElements();
		}

		if (typeof $this.highlightedElements != 'undefined') {
			$this.highlightedElements.css('z-index', 1);
		}
	};
}

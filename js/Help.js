/**
 * Generate a live help
 *
 * @author Georg Limbach <georf@dev.mgvmedia.com>
 *
 * @constructor
 */

function Help() {
	var $this = this,
		darkRoom = $('<div>press escape to exit tour</div>'),
		reghex = '<span class="appname">reg<strong>[h]?</strong>ex</span>';

	darkRoom.attr('id', 'darkRoom').appendTo('body');
	this.lastTimeout = null;

	this.close = function() {
		$this.breakSteps();
		darkRoom.remove();
	};


	this.steps = new Array(
		new Step('Welcome to the '+reghex+' tour', function() {
		}, 5000),

		new MoveStep('Select the language you want to use', '#parser-type', 100, $('#parser-type')),

		new Step('Select the language you want to use', function() {
			// let it blink 3 times
			$('#parser-type').focus()
			.fadeOut(500).fadeIn(500)
			.fadeOut(500).fadeIn(500)
			.fadeOut(500).fadeIn(500);
		}, 7500, $('#parser-type')),

		new Step('', function() {
		}, 500),

		new MoveStep('Write an example text to be matched by your regular expression', '#matchtext', 1500, $('.matchtext-block:nth-child(1)')),

		new Step('Write an example text to be matched by your regular expression', function() {
		}, 2000, $('.matchtext-block:nth-child(1)')),

		new Step('Write an example text to be matched by your regular expression', function() {

			// add a match text
			new TypeInto($('#matchtext').focus(), 'abb', 500);
		}, 7000, $('.matchtext-block:nth-child(1)')),

		new Step('', function() {
		}, 1000),


		new MoveStep('Add another example area to match a different text', '#add-matchtext', 3000, $('#add-matchtext')),

		new Step('Add another example area to match a different text', function() {
			// let plus blink 3 times
			$('#add-matchtext').focus()
			.fadeOut(500).fadeIn(500)
			.fadeOut(500).fadeIn(500)
			.fadeOut(500).fadeIn(500, function() {

				$('#add-matchtext').click();
			});
		}, 4500, $('#add-matchtext')),

		new MoveStep('Now you can fill in another example to be matched', '.matchtext-block:nth-child(2)', 2000, $('.matchtext-block:nth-child(2)')),

		new Step('Now you can fill in another example to be matched', function() {
			// add a match text
			new TypeInto($('#newid' + (matchingBlockId-1)).focus(), 'test abc ade', 300);
		}, 10000, function() { return $('.matchtext-block:nth-child(2)'); }),

		new Step('', function() {
		}, 100),

		new Step('Here you can enter your regular expression', function() {
			// add a regular expression
			$('#regex').focus();
			new TypeInto($('#regex'), 'a([a-z]+)', 300);
		}, 10000, $('#regex')),

		new Step('Look at your sample text: the green background highlights the matched text', function() {
		}, 10000, function() { return $('.matchtext-block'); }),

		//~ new MoveStep('Subexpression show all the parts of the matched text', '.navigate-match-section:first', 500, function() {return $('.matchtext-block:nth-child(1)'); }),
//~ 
		//~ new Step('Subexpression show all the parts of the matched text', function() {
			//~ // let plus blink 3 times
			//~ $('.navigate-match-section:first .match-more-info a').focus()
			//~ .fadeOut(300).fadeIn(300)
			//~ .fadeOut(300).fadeIn(300)
			//~ .fadeOut(300).fadeIn(300, function() {
				//~ $('.navigate-match-section:first .match-more-info a').click();
			//~ });
//~ 
		//~ }, 15000, function() { return $('.navigate-match-section:first, .more-information.overlay.group');}),

		new Step('Now it\'s your turn, give it a try!', function() {
		}, 5000),

		// last step!
		new Step('', function() {
			$('#help-current-task').hide();
			location.reload();
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
			//~ $this.close();
			location.reload();
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

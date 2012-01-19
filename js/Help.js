/**
 * Generate a live help
 *
 * @author Georg Limbach <georf@dev.mgvmedia.com>
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

		new Step('Select your parser language', function() {
			// let it blink 3 times
			$('#parser-type').focus()
			.fadeOut(500).fadeIn(500)
			.fadeOut(500).fadeIn(500)
			.fadeOut(500).fadeIn(500);
		}, 5000, $('#parser-type')),

		new Step('', function() {
		}, 100),

		new Step('Type your first match text', function() {

			// add a match text
			new TypeInto($('#matchtext').focus(), 'abb', 500);
		}, 5000, $('.matchtext-block:nth-child(1)')),

		new Step('', function() {
		}, 100),

		new Step('Create a new match text field with the plus button', function() {
			// let plus blink 3 times
			$('#add-matchtext').focus()
			.fadeOut(500).fadeIn(500)
			.fadeOut(500).fadeIn(500)
			.fadeOut(500).fadeIn(500, function() {

				$('#add-matchtext').click();
			});
		}, 4500, $('#add-matchtext')),

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

		new Step('Now we want to see the groups. Click at subexpression.', function() {
			// let plus blink 3 times
			$('#matchtext-div .match-more-info a').focus()
			.fadeOut(300).fadeIn(300)
			.fadeOut(300).fadeIn(300)
			.fadeOut(300).fadeIn(300, function() {
				$('#matchtext-div .match-more-info a').click();
			});

		}, 15000),

		new Step('', function() {
		}, 100),

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

function TypeInto(area, val, millisec) {
	var $this = this;
	this.area = area;
	this.val = val;
	this.millisec = millisec;

	this.step = 0;

	this.typeKey = function() {
		$this.area.val($this.val.substring(0, $this.step));
		$this.area.trigger('keyup');

		if ($this.step < $this.val.length) {
			$this.step++;
			setTimeout($this.typeKey, $this.millisec);
		}
	};

	this.typeKey();
}

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
		if (typeof $this.highlightedElements != 'undefined') {
			$this.highlightedElements.css('z-index', 1);
		}
	};
}

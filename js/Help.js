/**
 * Generate a live help
 *
 * @author Georg Limbach <georf@dev.mgvmedia.com>
 */

function Help() {
	var $this = this,
		darkRoom = $('<div> </div>');
	darkRoom.attr('id', 'darkRoom').appendTo('body');
	this.lastTimeout = null;



	this.close = function() {

		$this.breakSteps();

		$('#help-content').hide();
		$('#help-box').show();
		darkRoom.remove();

	};


	this.steps = new Array(
		new Step('Welcome to the help tour', function() {
			$('#help-start').hide();

			$('#help-content').addClass("deactive");
		}, 5000),

		new Step('Select your parser language', function() {

			$('#help-step1').addClass("active");

			// let it blink 3 times
			$('#parser-type').focus()
			.fadeOut(500).fadeIn(500)
			.fadeOut(500).fadeIn(500)
			.fadeOut(500).fadeIn(500);
		}, 5000),

		new Step('', function() {
			$('#help-step1').removeClass("active");
		}, 100),

		new Step('Type your first match text', function() {
			$('#help-step2').addClass("active");

			// add a match text
			new TypeInto($('#matchtext').focus(), 'abb', 500);
		}, 5000),

		new Step('', function() {
			$('#help-step2').removeClass("active");
		}, 100),

		new Step('Create a new match text field with the plus button', function() {
			$('#help-step3').addClass("active");

			// let plus blink 3 times
			$('#add-matchtext').focus()
			.fadeOut(500).fadeIn(500)
			.fadeOut(500).fadeIn(500)
			.fadeOut(500).fadeIn(500, function() {

				$('#add-matchtext').click();
			});
		}, 4500),

		new Step('Type your second match text', function() {
			// add a match text
			new TypeInto($('#newid' + (matchingBlockId-1)).focus(), 'test abc ade', 300);
		}, 10000),

		new Step('', function() {
			$('#help-step3').removeClass("active");
		}, 100),

		new Step('Type your regular expression', function() {

			$('#help-step4').addClass("active");

			// add a regular expression
			$('#regex').focus();
			new TypeInto($('#regex'), 'a([a-z]+)', 300);
		}, 10000),

		new Step('See at your match text. The green part is matching.', function() {
			$('#help-step4').removeClass("active");
		}, 10000),

		new Step('Now we want to see the groups. Click at subexpression.', function() {
			$('#help-step5').addClass("active");

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
			$('#help-content').removeClass("deactive");
			$('#help-start').show();
			$('#help-current-task').hide();
		}, 100)
	);

	this.runSteps = function() {
		$('#help-current-task').html('').show();
		var time = 0;

		for ( var i = 0; i < $this.steps.length; i++) {

			$this.steps[i].timeoutId = setTimeout($this.steps[i].run, time);
			time += $this.steps[i].time;
		}
	};

	this.breakSteps = function() {
		var time = 0;
		for ( var i = 0; i < $this.steps.length; i++) {
			if ($this.steps[i].timeoutId != null) {
				clearTimeout($this.steps[i].timeoutId);
				$this.steps[i].timeoutId = null;
			}
		}
	};

	// initiation
	$('#help-box').hide();

	$('#help-close').unbind().click($this.close);
	$('#help-start').click($this.runSteps);
	$('#help-start').show();

	$('#help-content').show();
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

function Step(message, callback, time) {
	var $this = this;

	this.callback = callback;
	this.time = time;
	this.message = message;

	this.timeoutId = null;

	this.run = function() {
		$('#help-current-task').html($this.message);

		$this.callback();

		$this.timeoutId = null;
	};
}

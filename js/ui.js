/**
 * Reghex UI Package
 *
 * @author Sebastian Gaul <sebastian@dev.mgvmedia.com>
 * @author Georg Limbach <georf@dev.mgvmedia.com>
 */

var matchingBlockId = 1;

$(function() {
	// Register existing match text fields
	$('.matchtext-block').each(function() {
		new UIMatchText($(this), false);
	});

	// Create and register a message service
	RegHex.registerMessageService(new UIMessageService());

	// Bundle options into an array
	var bundleOptions = function() {
		var options = [];
		$('#option-i,#option-d,#option-m,#option-s,#option-g').each(function(i, el) {
			if ($(el).is(':checked')) {
				options.push($(el).attr('name').substr(7));
			}
		});
		return options;
	};

	// Trigger regex change whenever an option changes
	$('#regex-options input[type="checkbox"]').change(function() {
		$('#regex').trigger('keyup');
	});

	// Notify if regular expression changes
	$('#regex').bind('keyup blur input cut paste', function() {
		RegHex.updateRegularExpression($(this).val(), bundleOptions());
	});

	$('#add-matchtext').click(function() {

		// generate new id
			var newid = matchingBlockId++;

			// clone block
			var block = $('#matching-blocks').find('.matchtext-block').first()
					.clone();
			block.find('label').html('&nbsp;').attr('for', 'newid' + newid);
			block.find('.textarea').text('').attr('id', 'newid' + newid);
			block.find('.matchtext-div').html('&nbsp;');

			// handle events with object
			new UIMatchText(block, true);
		});

	var parserType = $('#parser-type');

	// Add parsers to select field
	for ( var i = 0; i < config.parsers.length; i++) {
		parserType.append($('<option value="' + config.parsers[i].name + '">'
				+ config.parsers[i].name + '</option>'));
	}

	// bind parser type to RegHex
	parserType.change(function() {
		RegHex.changeParserType($('#parser-type').val());
	});

	// update first time
	$('#regex').trigger('keyup');


	// bind Help class to link
	$('#help-box').click(function() {
		new Help();
	});
});

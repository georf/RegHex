/**
 * Reghex UI Package
 *
 * @author Sebastian Gaul <sebastian@dev.mgvmedia.com>
 * @author Georg Limbach <georf@dev.mgvmedia.com>
 */

var matchingBlockId = 1;

$(function() {
	// reset textarea and checkboxes(for firefox)
	$('textarea').val('');

	// Register existing match text fields
	$('.matchtext-block').each(function() {
		new UIMatchText($(this), false);
	});

	// Create and register a message service
	RegHex.registerMessageService(new UIMessageService());

	// Create and register a code block service
	var codeSnip = new UICodeSnip();
	RegHex.registerCodeSnip(codeSnip);

	// Bundle flags into an array
	var bundleFlags = function() {
		var flags = [];
		$('.parser-option').each(function(i, el) {
			if ($(el).is(':checked')) {
				flags.push($(el).attr('name').substr(7));
			}
		});
		return flags;
	};

	// Notify if regular expression changes
	$('#regex').bind('keyup blur input cut paste', function() {
		RegHex.updateRegularExpression($(this).val(), bundleFlags());
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
		parserType.append($('<option value="' + config.parsers[i].getName() + '">'
				+ config.parsers[i].getName() + '</option>'));
	}

	// bind parser type to RegHex
	parserType.change(function() {
		// update regex
		RegHex.changeParserType($('#parser-type').val());

		// update about window
		$('.current-parser-name').text($('#parser-type').val());

		// delete old flags
		$('#regex-options').html('');

		// enable usefull options
		var o = RegHex.getRegularExpression().getFlags();
		for (var i = 0; i < o.length; i++) {
			$('#regex-options').append(o[i].getLi());
		}

		// Trigger regex change whenever an option changes
		$('#regex-options input[type="checkbox"]').change(function() {
			$('#regex').trigger('keyup');
		});

		// set new info link
		var l = RegHex.getRegularExpression().getUrls();
		var ul = '';
		for ( var i = 0; i < l.length; i++) {
			ul += '<li><a href="' + l[i][0] + '">' + l[i][1] + '</a></li>';
		}
		if (ul != '') {
			$('#additional-parser-info').html('<ul>' + ul + '</ul>');
		} else {
			$('#additional-parser-info').html(ul);
		}

		codeSnip.update('');

		// trigger a new parse event
		$('#regex').keyup();

    // update uri hash
    window.location.hash = '#p-' + $('#parser-type').val();

	});

	// trigger first change
	parserType.change();

	// update first time
	$('#regex').trigger('keyup');


	// bind Help class to link
	$('#help-box').click(function() {
		new Help();
	});

  // parser type from uri
  var hash = window.location.hash,
    match;
  if (match = hash.match(/^#p-(.+)$/)) {
    var correct = false;
    for ( var i = 0; i < config.parsers.length; i++) {
      if (config.parsers[i].getName() == match[1]) {
        correct = true;
        break;
      }
    }
    if (correct) {
      parserType.find('option').each(function() {
        var self = $(this);
        if (self.val() == match[1]) {
          self.attr('selected', true);
        } else {
          self.removeAttr('selected');
        }
      });
      parserType.change();
    }
  }
});

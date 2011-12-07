/**
 * Reghex UI Package
 *
 * @author Sebastian Gaul <sebastian@dev.mgvmedia.com>
 * @author Georg Limbach <georf@dev.mgvmedia.com>
 */

var matchingBlockId = 1;

/**
 * Registers a new Match Text Field
 * @param jQuery Selection
 * @return UIMatchText
 */
function registerMatchTextField(newMatchTextField) {
	var $this = newMatchTextField;

	var uiMatchText = new UIMatchText($this);

	// Register the new MatchTextField
	var matchText = RegHex.addMatchText(uiMatchText, $this.text());

	// Tell the registered match text about changes
	$this.bind('change keyup', function() {
		matchText.notify(uiMatchText);
	});

	return uiMatchText;
}

$(function() {

	// Register existing match text fields
	$('.matchtext').each(function() {
		registerMatchTextField($(this));
	});

	// Create and register a message service
	RegHex.registerMessageService(new UIMessageService);

	// Notify if regular expression changes
	$('#regex').bind('keyup blur input cut paste', function() {
		RegHex.updateRegularExpression($(this).val(), []); // TODO Options
	});


	// Old code here... ================================================


	$('#add-matchtext').click(function(){

		// generate new id
		var newid = matchingBlockId++;

		var block = $('#matching-blocks').find('.matchtext-block').first().clone();
		block.find('label').html('&nbsp;').attr('for', 'newid' + newid);
		block.find('.textarea').val('').attr('id', 'newid' + newid);
		block.find('.matchtext-div').html('&nbsp;');

		// Add to RegHex
		var uiMatchText = registerMatchTextField(block.find('.textarea'));

		var btn = $('<button type="button" class="arrow-button"/>');
		btn.text('-');
		btn.attr('title', 'remove field');
		btn.click(function() { uiMatchText.remove() });
		block.find('.navigate-match-section').prepend('&nbsp;').prepend(btn);
		block.hide();
		$('#matching-blocks').append(block);
		block.slideDown();
	});

	//~ $('.matchtext-div').live('click focus', function(){
		//~ $(this).hide().parent().find('.matchtext').show(0, function(){
			//~ $(this).focus();
		//~ });
	//~ });

	$('#option-i').bind('change', function() {
		RegHex.update();
	});
	$('#option-m').bind('change', function() {
		RegHex.update();
	});
	$('#option-s').bind('change', function() {
		RegHex.update();
	});
	$('#option-g').bind('change', function() {
		RegHex.update();
	});

});


var RegHexUI = new function() {
	this.regexError = function (message) {
		if (typeof message == 'undefined') {
			$('#regex-error').slideUp(function() {
				$(this).html('');
			});
		} else {
			$('#regex-error').html(message);
			$('#regex-error').slideDown();
		}
	}
}

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
	RegHex.registerMessageService(new UIMessageService);

	// Notify if regular expression changes
	$('#regex').bind('keyup blur input cut paste', function() {
		RegHex.updateRegularExpression($(this).val(), []); // TODO Options
	});


	// Old code here... ================================================


	$('#add-matchtext').click(function(){

		// generate new id
		var newid = matchingBlockId++;

		// clone block
		var block = $('#matching-blocks').find('.matchtext-block').first().clone();
		block.find('label').html('&nbsp;').attr('for', 'newid' + newid);
		block.find('.textarea').text('').attr('id', 'newid' + newid);
		block.find('.matchtext-div').html('&nbsp;');

		// handle events with object
		new UIMatchText(block, true);
	});

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

// autoscroll for both div (only testing)
// we need this for every matching div
$(".textarea").scroll(function () {
        $(".matchtext-div").scrollTop($(".textarea").scrollTop());
        $(".matchtext-div").scrollLeft($(".textarea").scrollLeft());
    });



});

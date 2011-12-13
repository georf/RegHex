/**
 * 
 * @author Georg Limbach <georf@dev.mgvmedia.com>
 * @param jQuery
 *            selection - the matchtext block
 * @param boolean
 *            create "delete" button
 */
function UIMatchText(block, deleteButton) {
	var $this = this;

	// set pointer to special areas
	this.jBlock = block;
	this.jTextarea = block.find('.textarea');
	this.jMatchtextDiv = block.find('.matchtext-div');
	this.jMatchInfo = block.find('.match-info');
	this.jNextMatch = block.find('.next-match');
	this.jPreviousMatch = block.find('.previous-match');
	this.jMatchMoreInfo = block.find('.match-more-info');
	this.jMoreInformation = block.find('.more-information');
	this.jMoreInformationContent = this.jMoreInformation.find('.more-information-content');

	// hide boxes
	this.jMatchMoreInfo.hide();
	this.jMoreInformation.hide();
	
	// generate model
	var matchText = RegHex.addMatchText(this, this.jTextarea.val());

	// Tell the registered match text about changes
	this.jTextarea.bind('change keyup paste cut', function() {
		matchText.notify();
	});

	// get scroll events
	this.jTextarea.scroll(function() {
		$this.updateScrollPosition();
	});

	this.cursorPosition = 0;
	this.charCount = 0;

	this.response = null;
	this.selectedMatch = 0;
	this.moreInformationOpen = false;
	
	this.notify = function(response) {

		// its the same text?
		if (this.jTextarea.val() == response.matchText) {

			// is it a new response?
			if (this.response != response) {

				// set new response
				this.response = response;

				// set match to 0
				this.selectedMatch = 0;

				// update all information
				this.update();
			}
		}
	};

	/**
	 * Highlight the matches in the textarea
	 * 
	 * @return this
	 */
	this.highlight = function() {

		// on error highlight nothing
		if (!this.response || this.response.error) {
			this.jMatchtextDiv.html('');

			// otherwise highlight selected part
		} else {

			var text = this.response.matchText;
			var output = "";

			// no matches
			if (this.response.matchings.length == 0) {

				// all unmatching
				output = '<span class="unmatched">' + this.escapeHtml(text) + '</span>';

			} else {

				var length = this.response.matchings[this.selectedMatch].text.length;
				var pos = this.response.matchings[this.selectedMatch].index;

				if (length <= 0) {
					output = '<span class="unmatched">' + this.escapeHtml(text) + '</span>';
				} else {

					if (pos != 0) {
						output += '<span class="unmatched">' + this
								.escapeHtml(text.substring(0, pos)) + '</span>';
					}

					output += '<span class="matched">' + this.escapeHtml(text
							.substring(pos, pos + length)) + '</span>';

					if (text.length != pos + length) {
						output += '<span class="unmatched">' + this
								.escapeHtml(text.substring(pos + length)) + '</span>';
					}
				}
			}

			// add a no-break space if last char is a new line
			if (text.length != 0 && text.substring(text.length - 1) == "\n") {
				output += '<span>&nbsp;</span>';
			}

			// set spans to background area
			this.jMatchtextDiv.html(output);
		}

		return this;
	};

	/**
	 * Escape special chars
	 * 
	 * @param String
	 *            text to escape
	 * @return String escaped text
	 */
	this.escapeHtml = function(text) {
		text = this.replaceAll(text, '<', '&lt;');
		text = this.replaceAll(text, '>', '&gt;');
		text = this.replaceAll(text, '\n', '<br>');
		return text;
	};

	/**
	 * Replaces each substring of the value that matches the given string with
	 * the given replacement.
	 * 
	 * @param String
	 *            value
	 * @param String
	 *            search for
	 * @param String
	 *            replace with
	 * @return String new text
	 */
	this.replaceAll = function(value, find, replace) {
		while (value.indexOf(find) != -1) {
			value = value.replace(find, replace);
		}
		return value;
	};

	this.getText = function() {
		return this.jTextarea.val();
	};

	/**
	 * Updates the infobox
	 * 
	 * Sets button dis/enabled and update text
	 */
	this.updateInfobox = function() {
		
		if (this.moreInformationOpen) {
			this.jMatchMoreInfo.slideUp();
        } else {
        	this.jMoreInformation.slideUp();
        }

		// if its no valid response or if no matchings
		if (!this.response || this.response.error
				|| this.response.matchings.length == 0) {
			this.jMatchInfo.html('no matches');
			this.jNextMatch.attr('disabled', 'disabled');
			this.jPreviousMatch.attr('disabled', 'disabled');
			
			this.jMatchMoreInfo.slideUp();
			this.jMoreInformation.slideUp();

			// valid matchings
		} else {
			this.jMatchInfo.html('match ' + (this.selectedMatch + 1) + ' of '
					+ this.response.matchings.length);
			
			var results = this.response.matchings[this.selectedMatch].subexpressions;

			if (results.length <= 0) {
				this.jMoreInformationContent.html('no subexpressions given.');
			} else {

				var output = 'subexpressions <small>(expression parts in brackets)</small>:<ul>';
				for ( var i = 0; i < results.length; i++) {
					output += '<li>$' + i + ' = ' + results[i] + '</li>';
				}
				output += '</ul>';

				this.jMoreInformationContent.html(output);
			}

			// disable/enable match buttons
			if (this.selectedMatch == 0 || this.response.error) {
				this.jPreviousMatch.attr('disabled', 'disabled');
			} else {
				this.jPreviousMatch.removeAttr('disabled');
			}

			if (this.selectedMatch >= this.response.matchings.length - 1
					|| this.response.error) {
				this.jNextMatch.attr('disabled', 'disabled');
			} else {
				this.jNextMatch.removeAttr('disabled');
			}
			
			// show more information
			if (this.moreInformationOpen) {
				this.jMoreInformation.slideDown();
			} else {
				this.jMatchMoreInfo.slideDown();
			}
		}
	};

	/**
	 * Updates all information in and around the textbox
	 * 
	 * @return this
	 */
	this.update = function() {
		// update highlighting
		this.highlight();

		// update infobox
		this.updateInfobox();

		// update scroll position
		this.updateScrollPosition();

		return this;
	};

	/**
	 * Scroll the background div to the correct position
	 * 
	 * @return this
	 */
	this.updateScrollPosition = function() {
		this.jMatchtextDiv.scrollTop(this.jTextarea.scrollTop());
		this.jMatchtextDiv.scrollLeft(this.jTextarea.scrollLeft());

		return this;
	};

	/**
	 * Select next match if possible
	 * 
	 * @return this
	 */
	this.nextMatch = function() {
		if (this.response
				&& this.selectedMatch < this.response.matchings.length - 1) {
			this.selectedMatch++;
		}
		this.update();

		return this;
	};

	/**
	 * Select previous match if possible
	 * 
	 * @return this
	 */
	this.previousMatch = function() {
		if (this.selectedMatch > 0) {
			this.selectedMatch--;
		}
		this.update();

		return this;
	};

	/**
	 * Open and close the information box
	 * 
	 * @param boolean
	 *            open == true
	 * @return this
	 */
	this.moreInformation = function(open) {
		if (this.moreInformationOpen != open) {
			this.moreInformationOpen = open;
			this.update();
		}
		return this;
	};

	// set button handler
	this.jNextMatch.click(function() {
		$this.nextMatch();
	});
	this.jPreviousMatch.click(function() {
		$this.previousMatch();
	});

	this.jMatchMoreInfo.find('a').click(function() {
		$this.moreInformation(true);
		return false;
	});
	this.jMoreInformation.find('.less-information').click(function() {
		$this.moreInformation(false);
		return false;
	});

	// update all informations after first creation
	this.update();
	
	if (deleteButton) {

		// generate delete button
		var btn = $('<button type="button" class="arrow-button"/>');
		btn.text('-');
		btn.attr('title', 'remove field');
		btn.click(function() {
			block.slideUp(function() {
				// remove from RegHex
					RegHex.removeMatchText(matchText);
					$(this).remove();
				});
		});

		// add to block
		this.jBlock.find('.navigate-match-section').prepend('&nbsp;').prepend(
				btn);
		this.jBlock.hide();
		$('#matching-blocks').append(this.jBlock);
		this.jBlock.show();
	}
}

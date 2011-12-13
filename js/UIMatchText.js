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
	this.block = block;
	this.area = block.find('.textarea');
	this.highlightArea = block.find('.matchtext-div');
	this.infoBox = block.find('.match-info');
	this.next = block.find('.next-match');
	this.previous = block.find('.previous-match');

	// generate model
	var matchText = RegHex.addMatchText(this, this.area.val());

	// Tell the registered match text about changes
	this.area.bind('change keyup paste cut', function() {
		matchText.notify();
	});
	
	// get scroll events
	this.area.scroll(function() {
		$this.updateScrollPosition();
	});

	if (deleteButton) {

		// generate delete button
		var btn = $('<button type="button" class="arrow-button"/>');
		btn.text('-');
		btn.attr('title', 'remove field');
		btn.click(function() {
			block.slideUp(function() {
				// remove from RegHex
					RegHex.removeMatchText($(this).find('.textarea'));
					$(this).remove();
				});
		});

		// add to block
		this.block.find('.navigate-match-section').prepend('&nbsp;').prepend(
				btn);
		this.block.hide();
		$('#matching-blocks').append(this.block);
		this.block.show();
	}

	this.cursorPosition = 0;
	this.charCount = 0;

	this.response = null;
	this.selectedMatch = 0;

	this.notify = function(response) {

		// its the same text?
		if (this.area.val() == response.matchText) {

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
			this.highlightArea.html('');

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
			this.highlightArea.html(output);
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
		return this.area.val();
	};

	this.getObject = function() {
		return this.area;
	};
	
	/**
	 * Updates the infobox
	 *
	 * Sets button dis/enabled and update text
	 */
	this.updateInfobox = function() {

		// if its no valid response or if no matchings
		if (!this.response || this.response.error || this.response.matchings.length == 0) {
			this.infoBox.html('no matches');
			this.next.attr('disabled', 'disabled');
			this.previous.attr('disabled', 'disabled');

			// valid matchings
		} else {
			this.infoBox.html('match ' + (this.selectedMatch + 1) + ' of '
					+ this.response.matchings.length);

			// disable/enable match buttons
			if (this.selectedMatch == 0 || this.response.error) {
				this.previous.attr('disabled', 'disabled');
			} else {
				this.previous.removeAttr('disabled');
			}

			if (this.selectedMatch >= this.response.matchings.length - 1
					|| this.response.error) {
				this.next.attr('disabled', 'disabled');
			} else {
				this.next.removeAttr('disabled');
			}
		}
	};

	this.getmoreInformation = function() {
		this.updateMatches();

		if (this.error || this.matches.length == 0) {
			return '';
		}

		var results = this.matches[this.currentMatching].results;

		if (results.length <= 0) {
			return 'no subexpressions given.';
		}

		var output = 'subexpressions <small>(expression parts in brackets)</small>:<ul>';
		for ( var i = 0; i < results.length; i++) {
			output += '<li>$' + i + ' = ' + results[i] + '</li>';
		}
		output += '</ul>';

		return output;
	}

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
		this.highlightArea.scrollTop(this.area.scrollTop());
		this.highlightArea.scrollLeft(this.area.scrollLeft());
		
		return this;
	}
	
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
	}

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
	}

	/**
	 * Open and close the information box
	 * 
	 * @param boolean
	 *            open == true
	 * @return this
	 */
	this.moreInformation = function(open) {
		// TODO
		return this;
	}

	// set button handler
	this.next.click(function() {
		$this.nextMatch()
	});
	this.previous.click(function() {
		$this.previousMatch();
	});
	/*
	 * this.block.find('.match-more-info').find('a').click(function() {
	 * RegHex.getMatchingBlock($(this).closest('.matchtext-block')).moreInfo();
	 * return false; }); this.block.find('.less-information').click(function() {
	 * RegHex.getMatchingBlock($(this).closest('.matchtext-block')).lessInfo();
	 * return false; });
	 */

	this.update();
}

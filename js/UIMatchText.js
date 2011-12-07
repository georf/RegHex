/**
 *
 * @author Georg Limbach <georf@dev.mgvmedia.com>
 * @param jQuery selection - the matchtext block
 * @param boolean create "delete" button
 */
function UIMatchText(block, deleteButton) {
	var $this = this;

	// set pointer to special areas
	this.block = block;
	this.area = block.find('.textarea');
	this.infoBox = block.find('.match-info');
	this.next = block.find('.next-match');
	this.previous = block.find('.previous-match');

	// generate model
	var matchText = RegHex.addMatchText(this, this.area.text());

	// Tell the registered match text about changes
	this.area.bind('change keyup paste cut', function() {
		matchText.notify();
	});

	if (deleteButton) {

		// generate delete button
		var btn = $('<button type="button" class="arrow-button"/>');
		btn.text('-');
		btn.attr('title', 'remove field');
		btn.click(function() {
			$(this).closest('.matchtext-block').slideUp(function() {
				// remove from RegHex
				RegHex.removeMatchText($(this).find('.textarea'));
				$(this).remove();
			});
		});

		// add to block
		this.block.find('.navigate-match-section').prepend('&nbsp;').prepend(btn);
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
		if (this.area.text() == response.matchText) {

			// is it a new response?
			if (this.response != response) {

				// set new response
				this.response = response;

				// set match to 0
				this.selectedMatch = 0;

				// highlight the value by selected part
				this.highlight();

				// update the info box
				this.updateInfobox();
			}
		}
	}

	this.highlight = function() {
//TODO caching
		var div = document.getElementById (this.area.attr('id'));

		this.cursorPosition = this.getCursorPosition();
		this.charCount = 0;

console.debug("cursor", this.cursorPosition);

		// clean html
		this.makeFlat(div);

		// get selected position
		var offsetStart = null, offsetEnd = null;

		if (this.response.matchings.length > 0) {

			offsetStart = this.response.matchings[this.selectedMatch].index;
			offsetEnd = offsetStart + this.response.matchings[this.selectedMatch].text.length;

			for (var i = offsetStart; i < offsetEnd; i++) {
				this.charCount = i;
				this.createHighlightSpan(div.childNodes[i]);
			}
		}
	}

	this.createHighlightSpan = function (textNode) {
		var span = document.createElement('span');
		span.className = 'matched';
		span.appendChild(document.createTextNode(textNode.data));
		this.insert(textNode.parentNode, span, textNode);

		textNode.parentNode.removeChild(textNode);
	}


	this.makeFlat = function (element) {

		var children = new Array();
		for (var i = 0; i < element.childNodes.length; i++) {
			children[i] = element.childNodes[i];
		}

		for (var i = 0; i < children.length; i++) {
			while (children[i].hasChildNodes()) {
				var node = this.getFirstTextNode(children[i].childNodes[0]);
				if (node != null) {
					this.insertSeparately(element, node, children[i]);
				}
			}
			if (children[i].nodeType != 3) {
				console.debug("remove empty element", children[i]);
				element.removeChild(children[i]);
			} else if (children[i].data.length != 1) {
				this.insertSeparately(element, children[i], children[i]);
				console.debug("remove long text element", children[i]);
				element.removeChild(children[i]);
			}

		}
	}

	this.getFirstTextNode = function (element) {

		if (element.nodeType == 3) {
			element.parentNode.removeChild(element);
			return element;
		}

		if (element.childNodes.length == 0) {
			console.debug("remove empty", element);
			element.parentNode.removeChild(element);
			return null;
		}

		return this.getFirstTextNode(element.childNodes[0]);
	}

	this.insertSeparately = function (element, node, child) {
		if (!node.data || node.data.length == 0) {
			return;
		}

		if (node.data.length == 1) {
			this.insert(element, node, child);
			return;
		}

		for (var i = 0; i < node.data.length; i++) {
			this.insertSeparately(element, document.createTextNode(node.data.substr(i, 1)), child);
		}
	}

	this.insert = function (element, node, child) {
		if (this.cursorPosition > this.charCount) {
			element.insertBefore(node, child);
		} else {
			if (child.nextSibling) {
				element.insertBefore(node, child.nextSibling);
			} else {
				element.appendChild(node);
			}
		}
		this.charCount ++;
	}

	this.getText = function() {
			return this.area.text();
	};

	this.getObject = function() {
			return this.area;
	}

	this.getCursorPosition = function() {
		var cursorPos = null;
		if (window.getSelection) {
			var selObj = window.getSelection();
			var selRange = selObj.getRangeAt(0);
			var list = selObj.anchorNode.parentNode.childNodes;
			for (var i = 0; i < list.length; i++) {
				if (list[i] == selObj.anchorNode) {
					cursorPos = i;
					break;
				}
			}
			if (cursorPos == null) {
				cursorPos = -1;
			}
			cursorPos += selObj.anchorOffset;
		} else if (document.selection) {
			var range = document.selection.createRange();
			var bookmark = range.getBookmark();
			cursorPos = bookmark.charCodeAt(2) - 11; /* Undocumented function [3] */
		}
		return cursorPos;
	}

	this.updateInfobox = function() {
		if (this.response.error) {
			this.infoBox.html('');
		} else if (this.response.matchings.length == 0) {
			this.infoBox.html('no matches');
		} else {
			this.infoBox.html('match ' + (this.selectedMatch+1) + ' of ' + this.response.matchings.length);
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
        for (var i=0; i<results.length; i++) {
            output += '<li>$'+i+' = ' + results[i] + '</li>';
        }
        output += '</ul>';

        return output;
    }

	this.update = function() {
		console.log('update');
		this.highlight();
	}

	this.nextMatch = function() {
		if (this.response && this.selectedMatch < this.response.matchings.length - 1) {
			this.selectedMatch++;
		}
		this.update();
	}

	this.previousMatch = function() {
		if (this.selectedMatch > 0) {
			this.selectedMatch--;
		}
		this.update();
	}

	// set button handler
	this.next.click(function () {
		$this.nextMatch()
	});
	this.previous.click(function () {
		$this.previousMatch();
	});
	/*
	this.block.find('.match-more-info').find('a').click(function() {
		RegHex.getMatchingBlock($(this).closest('.matchtext-block')).moreInfo();
		return false;
	});
	this.block.find('.less-information').click(function() {
		RegHex.getMatchingBlock($(this).closest('.matchtext-block')).lessInfo();
		return false;
	});*/
}

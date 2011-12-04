/* Author:
    Georg Limbach <georf@dev.mgvmedia.com>
*/


$.fn.equals = function(compareTo) {
    if (!compareTo || this.length != compareTo.length) {
        return false;
    }
    for (var i = 0; i < this.length; ++i) {
        if (this[i] !== compareTo[i]) {
            return false;
        }
    }
    return true;
};

/**
 * Dispatches tasks and provides Reghex's component objects
 *
 * @author Georg Limbach <georf@dev.mgvmedia.com>
 * @author Sebastian Gaul <sebastian@dev.mgvmedia.com>
 */
var RegHex = new function () {

	/**
	 * Creates a new match text and registers a specified observer
	 * @param UIMatchText
	 * @param string
	 * @return MatchText  The created MatchText object
	 */
	this.addMatchText = function(observer, initialText) {
		// TODO Implement
		return null;
	}

	/**
	 * Registers a message service which accepts and handles messages
	 * @param UIMessageService
	 */
	this.registerMessageService = function(messageService) {
		// TODO Implement
	}

	/**
	 * Updates the reg. exp., e.g. after the user changed the related field
	 * @param string  e.g. "ab*c"
	 * @param string[]  e.g. ["i", "x", "s"]
	 */
	this.updateRegularExpression = function(expression, options) {
		// TODO Implement
	}

	/**
	 * Updates the reg. exp. parser.
	 * @param string e.g. "parser-javascript"
	 */
	this.updateRegularExpressionParser = function(parser) {
		// TODO Implement
	}

	// old code...
    this.addMatchingBlock = function(block) {
        log('add block', block);
        this.matchingBlocks[this.matchingBlocks.length] = new MatchingBlock(block);
    }

    this.removeMatchingBlock = function(block) {
        log('remove block');
        var temp = new Array();
        for (var i = 0; i < this.matchingBlocks.length; i++) {
            if (!this.matchingBlocks[i].equals(block)) {
                temp[temp.length] = this.matchingBlocks[i];
            }
        }
        this.matchingBlocks = temp;
    }

    this.getOptions = function() {
        var option = '';

        if ($('#option-i').attr('checked')) {
            option += 'i';
        }

        if ($('#option-m').attr('checked')) {
            option += 'm';
        }

        if ($('#option-s').attr('checked')) {
            option += 's';
        }

        if ($('#option-g').attr('checked')) {
            option += 'g';
        }

        return option;
    }



    this.getMatchingBlock = function(block) {
        for (var i = 0; i < this.matchingBlocks.length; i++) {
            if (this.matchingBlocks[i].equals(block)) {
                return this.matchingBlocks[i];
            }
        }
        return null;
    }


    this.update = function() {
        if (this.regex.val() != this.lastRegExpValue || this.getOptions() != this.lastOptions) {

            this.lastRegExpValue = this.regex.val();
            this.lastOptions = this.getOptions();

            // check for syntax error
            try {
                new RegExp(this.lastRegExpValue, this.lastOptions);
            } catch (e) {
                UI.regexError(e.message);

                for (var i = 0; i < this.matchingBlocks.length; i++) {
                    this.matchingBlocks[i].noMatch();
                }

                return;
            }
            UI.regexError();

            for (var i = 0; i < this.matchingBlocks.length; i++) {
                this.matchingBlocks[i].update();
            }
        }
    }

    this.getRegExp = function() {
        return this.regex.val();
    }

    this.regex = $('#regex');
    this.lastRegExpValue = this.getRegExp();
    this.lastOptions = this.getOptions();
    log(this.lastOptions);

    this.matchingBlocks = new Array();

}




function MatchingBlock(block) {

    // save jquery object
    this.block = block;

    // pointer to matching and selection
    this.currentMatching = null;
    this.currentSelection = null;

    // more information
    this.moreInformation = false;

    // save last search
    this.matches = null;
    this.lastRegExp = null;
    this.lastText = null;
    this.lastOptions = null;
    this.error = false;

    this.equals = function(block) {
        return this.block.equals(block);
    }

    this.nextMatch = function() {
        log(this);
        if (this.currentMatching < this.matches.length - 1) {
            this.currentMatching++;
        }
        this.update();
    }

    this.previousMatch = function() {
        if (this.currentMatching > 0) {
            this.currentMatching--;
        }
        this.update();
    }

    this.noMatch = function() {
        this.error = true;
        this.update();
    }


    this.updateMatches = function() {

        if (this.lastRegExp == RegHex.getRegExp() && this.lastText == this.block.find('.textarea').val() && this.lastOptions == RegHex.getOptions()) {

            // nothing changed
            return this;
        }

        try {
            // set new values
            this.lastRegExp = RegHex.getRegExp();
            this.lastText = this.block.find('.textarea').val();
            this.lastOptions = RegHex.getOptions();
            this.error = false;

            this.currentMatching = 0;
            this.currentSelection = null;
            this.matches = new Array();

            var matchingText = null;
            var matchingAbsIndex = -1;
            var matchingRegExp = new RegExp('(' + this.lastRegExp + ')', this.lastOptions);
            var matchingIndex = 0;
            var origRegExp = new RegExp(this.lastRegExp, this.lastOptions);
            var currentIndex = 0;
            var currentText;
            var currentResult = new Array();

            for (var absIndex = 0; absIndex < this.lastText.length; absIndex++) {
                // generate shorter value
                currentText = this.lastText.substring(absIndex);

                // test for a match
                if (!matchingRegExp.test(currentText)) {
                    break;
                }

                // is it a new one?
                currentIndex = currentText.search(matchingRegExp);
                if (currentIndex + absIndex == matchingAbsIndex) {
                    continue;
                }

                // get the current matching text
                matchingText = matchingRegExp.exec(currentText);
                if (matchingText == null || matchingText.length < 1) {
                    continue;
                }
                matchingText = matchingText[0];

                // set the absolute index of this matching
                matchingAbsIndex = currentIndex + absIndex;

                // get current selected parts
                currentResult = origRegExp.exec(currentText);

                if (currentResult.length == 1) {
                    var t1 = new RegExp('[^\\\\]\\(');
                    var t2 = new RegExp('^\\(');
                    if (!t1.test(this.lastRegExp) && !t2.test(this.lastRegExp)) {
                        currentResult = new Array();
                    }
                }

                this.matches[matchingIndex] = new Object();
                this.matches[matchingIndex].text = matchingText;
                this.matches[matchingIndex].absIndex = matchingAbsIndex;
                this.matches[matchingIndex].results = currentResult;

                // this is the next matching
                matchingIndex++;
            }

            return this;
        } catch (e) {
            this.error = true;
        }
        return this;
    }


    this.getHighlightedHtml = function() {
        this.updateMatches();

        var text = this.block.find('.textarea').text();

        if (this.error) {
            return text;
        }


        if (this.matches.length == 0) {
            // no matches
            return '<span class="unmatched">' + this.escapeHtml(text) + '</span>';
        }

        var length = this.matches[this.currentMatching].text.length;
        var pos = this.matches[this.currentMatching].absIndex;

        if (length <= 0) {
            return '<span class="unmatched">' + this.escapeHtml(text) + '</span>';
        }

        var output = '';

        if (pos != 0) {
            output += '<span class="unmatched">' + this.escapeHtml(text.substring(0, pos)) + '</span>';
        }

        output += '<span class="matched">' + this.escapeHtml(text.substring(pos, pos + length)) + '</span>';

        if (text.length != pos + length) {
            output += '<span class="unmatched">' + this.escapeHtml(text.substring(pos + length)) + '</span>';
        }

        return output;
    }

    this.updateInfo = function() {
        var help = this.block.find('.match-info');

        var moreInfo;
        if (this.moreInformation) {
            moreInfo = this.block.find('.more-information');
            this.block.find('.match-more-info').slideUp();
        } else {
            moreInfo = this.block.find('.match-more-info');
            this.block.find('.more-information').slideUp();
        }

        if (this.error) {
            help.html('');
            moreInfo.slideUp();
        } else if (this.matches.length == 0) {
            help.html('no matches');
            moreInfo.slideUp();
        } else {
            help.html('match ' + (this.currentMatching+1) + ' of ' + this.matches.length);
            moreInfo.slideDown();
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
        // change highlighted text
        this.block.find('.matchtext-div').html(this.getHighlightedHtml());
        console.debug(this.getHighlightedHtml());

        // change more informations
        this.block.find('.more-information-content').html(this.getmoreInformation());

        // disable/enable match buttons
        if (this.currentMatching == 0 || this.error) {
            this.block.find('.previous-match').attr('disabled', 'disabled');
        } else {
            this.block.find('.previous-match').removeAttr('disabled');
        }

        if (this.currentMatching >= this.matches.length -1 || this.error) {
            this.block.find('.next-match').attr('disabled', 'disabled');
        } else {
            this.block.find('.next-match').removeAttr('disabled');
        }

        this.updateInfo();
    }


    this.moreInfo = function() {
        this.moreInformation = true;
        this.updateInfo();
    }
    this.lessInfo = function() {
        this.moreInformation = false;
        this.updateInfo();
    }

    this.replaceAll = function(value, find, replace) {
        while (value.indexOf(find) != -1) {
            value = value.replace(find, replace);
        }
        return value;
    }

    this.escapeHtml = function(text) {
        text = this.replaceAll(text, '<', '&lt;');
        text = this.replaceAll(text, '>', '&gt;');
        text = this.replaceAll(text, '\n', '<br>');
        return text;
    }


    // add event handler
    this.block.find('.textarea').bind('keyup blur input cut paste', function() {
        RegHex.getMatchingBlock($(this).closest('.matchtext-block')).update()
    });

    // add click handler
    this.block.find('.next-match').click(function() {
        RegHex.getMatchingBlock($(this).closest('.matchtext-block')).nextMatch();
    });
    this.block.find('.previous-match').click(function() {
        RegHex.getMatchingBlock($(this).closest('.matchtext-block')).previousMatch();
    });
    this.block.find('.match-more-info').find('a').click(function() {
        RegHex.getMatchingBlock($(this).closest('.matchtext-block')).moreInfo();
        return false;
    });
    this.block.find('.less-information').click(function() {
        RegHex.getMatchingBlock($(this).closest('.matchtext-block')).lessInfo();
        return false;
    });

    // first update
    this.update();

}


$(function () {
	$('#ajax-testing').find('button').click(function() {
		var text = $('#test-text').val();
		var expression = $('#test-expression').val();
		var parserType = $('input:radio[name=parser-type]:checked').val();
		var parser = new RegularExpressionParser(parserType);
		parser.parse(text, expression, [], function(data) {
			$('#ajax-testing').find('div').text($.toJSON(data));
			console.log(data);
		});
	});
});

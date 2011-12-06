/**
 *
 * @author Georg Limbach <georf@dev.mgvmedia.com>
 */
function UIMatchText(jQueryObject) {
	this.$this = jQueryObject;

	this.highlightCommand = 'backColor';
	try {
		if (document.queryCommandEnabled ('hiliteColor')) {
			this.highlightCommand = 'hiliteColor';
		}
	}
	catch (e) {}

	this.lastResponse = null;

	this.notify = function(response) {

		// its the same text?
		if (this.$this.text() == response.matchText) {

			// TODO check for new response
			this.lastResponse = response;

			// highlight the value by selected part
			this.highlight();
		}

		//this.$this.html(response.matchText);
	}

	this.highlight = function() {
		var div = document.getElementById (this.$this.attr('id'));

		if (document.createRange) {     // all browsers, except IE before version 9
			var textNode = div.firstChild;      // the text node inside the div
			if (textNode.data.length > 1) {
				var rangeObj = document.createRange ();
					// aligns the range to the second character
				rangeObj.setStart (textNode, 1);
				rangeObj.setEnd (textNode, 2);



				document.execCommand (this.highlightCommand, rangeObj, '#ff0000');
			}
		}
            else {      // Internet Explorer before version 9
                var rangeObj = document.body.createTextRange ();
                rangeObj.moveToElementText (div);
                    // aligns the range to the second character
                rangeObj.moveStart ("character", 1);
                rangeObj.collapse (true);
                rangeObj.moveEnd ("character", 1);

                    // deletes the character
                rangeObj.select ();
				rangeObj.execCommand (this.highlightCommand, false, '#ff0000');
            }

		return;
		var text = this.lastResponse.matchText;
		var help = this.help();
		/*

        if (this.error) {
            return text;
        }*/


        if (this.lastResponse.matchings.length == 0) {
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

	this.getText = function() {
			return this.$this.text();
	};

	this.getObject = function() {
			return this.$this;
	}
}

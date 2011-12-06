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
	this.selected = 0;

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
		this.removeChildren(div);


		// get selected position
		var offsetStart = null, offsetEnd = null;

		if (this.lastResponse.matchings.length > 0) {
			offsetStart = this.lastResponse.matchings[this.selected].index;
			offsetEnd = offsetStart + this.lastResponse.matchings[this.selected].text.length;
		}

		// all browsers, except IE before version 9
		if (document.createRange) {

			var rangeObj = document.createRange();

			// first delete all background colors
			rangeObj.selectNodeContents(div);

			document.execCommand ('removeFormat', false, null);

			// highlight selected part
			if (offsetStart != null) {
				rangeObj = document.createRange();
				rangeObj.setStart (div.firstChild, offsetStart);
				rangeObj.setEnd (div.firstChild, offsetEnd);

				document.execCommand (this.highlightCommand, false, '#ff0000');
			}
		}
            else {      // Internet Explorer before version 9
            //TODO
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


	this.removeChildren = function (element, internal) {
		console.debug(element);

		// this is a text node
		if (element.nodeType == 3 && typeof internal != 'undefined') {
			return;
		}

		// this is a element with only one child
		// e.g. <span>text</span>
		if (element.childNodes.length == 1 && typeof internal != 'undefined') {
			var child = element.firstChild;
			var parent = element.parentNode;
			parent.insertBefore(child, parent);
			parent.removeChild(element);

			this.removeChildren(child, true);

			return;
		}

		// this is a element without a child
		// e.g. <br/>
		if (element.childNodes.length == 0 && typeof internal != 'undefined') {
			var parent = element.parentNode;
			parent.removeChild(element, true);

			return;
		}

		for (var i = 0; i < element.childNodes.length; i++) {
			this.removeChildren(element.childNodes[i], true);
		}
	}


	this.getText = function() {
			return this.$this.text();
	};

	this.getObject = function() {
			return this.$this;
	}
}

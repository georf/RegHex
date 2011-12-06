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
		this.makeFlat(div);


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
					element.insertBefore(node, children[i]);
				}
			}
			if (children[i].nodeType != 3) {
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
			element.parentNode.removeChild(element);
			return null;
		}

		return this.getFirstTextNode(element.childNodes[0]);
	}


	this.getText = function() {
			return this.$this.text();
	};

	this.getObject = function() {
			return this.$this;
	}
}

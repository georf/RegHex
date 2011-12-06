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

		// clean html
		this.makeFlat(div);

		// get selected position
		var offsetStart = null, offsetEnd = null;

		if (this.lastResponse.matchings.length > 0) {

			offsetStart = this.lastResponse.matchings[this.selected].index;
			offsetEnd = offsetStart + this.lastResponse.matchings[this.selected].text.length;

			for (var i = offsetStart; i < offsetEnd; i++) {
				this.createHighlightSpan(div.childNodes[i]);
			}
		}
	}

	this.createHighlightSpan = function (textNode) {
		var span = document.createElement('span');
		span.className = 'matched';
		span.appendChild(document.createTextNode(textNode.data));
		textNode.parentNode.insertBefore(span, textNode);
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
					this.insertBeforeSeparately(element, node, children[i]);
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

	this.insertBeforeSeparately = function (element, node, child) {
		if (!node.data || node.data.length == 0) {
			return;
		}

		if (node.data.length == 1) {
			element.insertBefore(node, child);
			return;
		}

		for (var i = 0; i < node.data.length; i++) {
			this.insertBeforeSeparately(element, document.createTextNode(node.data.substr(i, 1)), child);
		}
	}

	this.getText = function() {
			return this.$this.text();
	};

	this.getObject = function() {
			return this.$this;
	}
}

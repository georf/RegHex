/**
 * Dispatches tasks and provides Reghex's component objects
 *
 * @author Georg Limbach <georf@dev.mgvmedia.com>
 * @author Sebastian Gaul <sebastian@dev.mgvmedia.com>
 */
var RegHex = new function() {

	this.matchTexts = new Array();
	this.messageService = { notify: function(d) {console.dir(d);} };

	/**
	 * Creates a new match text and registers a specified observer
	 *
	 * @param UIMatchText
	 * @param string
	 * @return MatchText The created MatchText object
	 */
	this.addMatchText = function(observer, initialText) {
		// create object
		var matchText = new MatchText(observer);

		// set text
		matchText.setText(initialText);

		// add to list
		this.matchTexts[this.matchTexts.length] = matchText;

		return matchText;
	};

	/**
	 * Remove a match text
	 *
	 * @param MatchText
	 *            to remove
	 * @return this
	 */
	this.removeMatchText = function(matchText) {
		for ( var i = 0; i < this.matchTexts.length; i++) {
			if (this.matchTexts[i] == matchText) {
				var current = this.matchTexts[i];

				// remove from array
				this.matchTexts.splice(i, 1);

				// delete internal
				current.finalize();
				break;
			}
		}
		return this;
	};

	/**
	 * Registers a message service which accepts and handles messages
	 *
	 * @param UIMessageService
	 */
	this.registerMessageService = function(messageService) {
		this.messageService = messageService;
	};

	/**
	 * Updates the reg. exp., e.g. after the user changed the related field
	 *
	 * @param string
	 *            e.g. "ab*c"
	 * @param string[]
	 *            e.g. ["i", "x", "s"]
	 */
	this.updateRegularExpression = function(expression, options) {
		// set new expression
		this.regularExpression.setRegularExpression(expression);

		// set new options
		this.regularExpression.setOptions(options);

		// update match texts
		this.updateMatchTexts();
	};

	/**
	 * Updates the reg. exp. parser.
	 *
	 * @param string
	 *            e.g. "parser-javascript"
	 */
	this.updateRegularExpressionParser = function(parser) {
		// set new parser
		this.regularExpression.setParser(parser);

		// update match texts
		this.updateMatchTexts();
	};

	/**
	 * Update all match texts
	 *
	 * @return this
	 */
	this.updateMatchTexts = function() {
		var that = this,
			errorOccured = false;
		for ( var i = 0; i < this.matchTexts.length; i++) {
			this.matchTexts[i].notify(this.matchTexts[i].observer,
				function(error) {
					that.messageService.notify(error);
					errorOccured = true;
				});
		}
		// Notify message service that parsing was successful, so it
		// can hide previous error messages
		if (!errorOccured) {
			this.messageService.notify();
		}
		return this;
	};

	/**
	 * Returns the RegularExpression object
	 *
	 * @return RegularExpression
	 */
	this.getRegularExpression = function() {
		return this.regularExpression;
	};


	this.changeParserType = function(parserType) {

		// set new parser type
		this.regularExpression.setParser(parserType);

		// update match texts
		this.updateMatchTexts();
	}

	/**
	 * Constructor creates a RegularExpression object
	 */

	this.regularExpression = new RegularExpression();
};

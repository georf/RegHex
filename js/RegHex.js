/**
 * Dispatches tasks and provides Reghex's component objects
 *
 * @author Georg Limbach <georf@dev.mgvmedia.com>
 * @author Sebastian Gaul <sebastian@dev.mgvmedia.com>
 *
 * @class
 */
var RegHex = new function() {

	/**
	 * Pointer to select regular expression
	 * @type RegularExpression
	 */
	this._regularExpression;

	/**
	 * Array of MatchText
	 * @type MatchText[]
	 */
	this._matchTexts = [];


	/**
	 * Object for message service
	 *
	 * Initialitation with console
	 * @type Object
	 */
	this._messageService = { notify: function(d) {console.dir(d);} };


	/**
	 * Creates a new match text and registers a specified observer
	 *
	 * @param {UIMatchText} observer
	 * @param {String} initialText
	 * @returns {MatchText} The created MatchText object
	 */
	this.addMatchText = function(observer, initialText) {
		// create object
		var matchText = new MatchText(observer);

		// set text
		matchText.setText(initialText);

		// add to list
		this._matchTexts[this._matchTexts.length] = matchText;

		return matchText;
	};


	/**
	 * Remove a match text
	 *
	 * @param {MatchText} matchText to remove
	 * @return this
	 */
	this.removeMatchText = function(matchText) {
		for ( var i = 0; i < this._matchTexts.length; i++) {
			if (this._matchTexts[i] == matchText) {
				var current = this._matchTexts[i];

				// remove from array
				this._matchTexts.splice(i, 1);

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
	 * @param {UIMessageService} messageService
	 */
	this.registerMessageService = function(messageService) {
		this._messageService = messageService;
	};

	/**
	 * Updates the reg. exp., e.g. after the user changed the related field
	 *
	 * @param {String} expression e.g. "ab*c"
	 * @param {String[]} flags e.g. ["i", "x", "s"]
	 */
	this.updateRegularExpression = function(expression, flags) {
		// set new expression
		this._regularExpression.setRegularExpression(expression);

		// set new flags
		this._regularExpression.setFlags(flags);

		// update match texts
		this._updateMatchTexts();
	};


	/**
	 * Update all match texts
	 */
	this._updateMatchTexts = function() {
		var that = this,
			errorOccured = false;
		for ( var i = 0; i < this._matchTexts.length; i++) {
			this._matchTexts[i].notify(this._matchTexts[i].observer,
				function(error) {
					that._messageService.notify(error);
					errorOccured = true;
				});
		}
		// Notify message service that parsing was successful, so it
		// can hide previous error messages
		if (!errorOccured) {
			this._messageService.notify();
		}
	};


	/**
	 * Returns the RegularExpression object
	 *
	 * @return RegularExpression
	 */
	this.getRegularExpression = function() {
		return this._regularExpression;
	};


	/**
	 * Change the parser type e.g. the user select a other parser
	 *
	 * The method search the object for the new parser and set is as
	 * current regular expression object.
	 *
	 * @param {String} parserType
	 */
	this.changeParserType = function(parserType) {

		// search config in array
		for (var i = 0; i < config.parsers.length; i++) {
			if (config.parsers[i].getName() == parserType) {
				this._regularExpression = config.parsers[i];
			}
		}

		// update match texts
		this._updateMatchTexts();
	};
};

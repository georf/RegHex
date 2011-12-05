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
}

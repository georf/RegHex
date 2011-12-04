/**
 *
 */

function RegularExpressionParser (parser) {
	this.url = 'parser/parser.php';


	this.parser = parser;


	this.parse = function (matchingText, expression, options, callback) {

		switch (parser) {
		case 'javascript':
			this.javascriptParser(matchingText, expression, options, callback);
			break;

		default:
			this.ajaxParser(matchingText, expression, options, callback, parser);
			break;
		}
	}


	this.ajaxParser = function (matchingText, expression, options, callback, parser) {

		// post to server parser
		$.post(this.url, {
			json: $.toJSON({
				"parser": parser,
				"regularExpression": expression,
				"options": options,
				"matchText": matchingText
			})
		}, callback, "json");
	}

	this.javascriptParser = function (matchingText, expression, options, callback) {
		try {
			// generate options
			var flags = "";
			for (var i = 0; i < options.length; i++) {
				switch (options[i]) {
				case "g":
					flags += "g";
					break;
				case "m":
					flags += "m";
					break;
				case "i":
					flags += "i";
					break;
				}
			}

			var originalExpression = new RegExp(expression, flags);
			var matchingExpression = new RegExp('(' + expression + ')', flags);

			var lastMatchingIndex = -1;
			var matches = new Array();

			for (var index = 0; index < matchingText.length; index++) {
				var currentText = matchingText.substring(index);

				// test for a match
				if (!matchingExpression.test(currentText)) {
					break;
				}

				// is it a new one?
				var currentIndex = currentText.search(matchingExpression);
				if (currentIndex + index == lastMatchingIndex) {
					continue;
				}

				// get the current matching text
				var matching = matchingExpression.exec(currentText);
				if (matching == null || matching.length < 1) {
					continue;
				}
				matching = matching[0];

				// set the absolute index of this matching
				lastMatchingIndex = currentIndex + index;

				// get current selected parts
				var currentResult = originalExpression.exec(currentText);

				matches[matches.length] = {
					text: matching,
					index: lastMatchingIndex,
					subexpressions: currentResult
				};
			}

			callback( {
				"parser": "javascript",
				"regularExpression": expression,
				"options": options,
				"matchText": matchingText,
				"error": false,
				"matchings": matches
			});
		} catch (e) {
			callback( {
				"parser": "javascript",
				"regularExpression": expression,
				"options": options,
				"matchText": matchingText,
				"error": e.message,
				"matchings": []
			});
		}
	}
}

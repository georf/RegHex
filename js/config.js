/**
 * Config for RegHex
 *
 * @author Georg Limbach <georf@dev.mgvmedia.com>
 *
 *
 */

var config = {
	parsers : [
		new RegularExpression(
			'javascript',
			'gmi',
			[ 'https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/RegExp' ],
			ParserJavascript
		), new RegularExpression(
			'sun-java',
			'dimsux',
			[ 'http://docs.oracle.com/javase/1.4.2/docs/api/java/util/regex/Pattern.html' ],
			ParserAjax
		), new RegularExpression(
			'php',
			'imsxu',
			[ "http://www.php.net/manual/en/reference.pcre.pattern.modifiers.php", "http://www.regular-expressions.info/php.html" ],
			ParserAjax
		)
	]
};

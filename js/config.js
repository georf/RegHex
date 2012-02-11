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
			[ ['https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/RegExp', 'Mozilla Javascript Reference'] ],
			ParserJavascript
		), new RegularExpression(
			'sun-java',
			'dimsux',
			[ ['http://docs.oracle.com/javase/1.4.2/docs/api/java/util/regex/Pattern.html', 'Oracle Java Reference'] ],
			ParserAjax
		), new RegularExpression(
			'php',
			'imsxug',
			[ ['http://www.php.net/manual/en/reference.pcre.pattern.modifiers.php', 'PHP Reference'], ['http://www.regular-expressions.info/php.html', 'Usage information'] ],
			ParserAjax
		)
	]
};

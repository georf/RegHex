/**
 * Config for RegHex
 * 
 * @author Georg Limbach <georf@dev.mgvmedia.com>
 * 
 * 
 */

var config = {
	parsers : [
			{
				name : "javascript",
				options : "gmi",
				client : true,
				infoUrl : [ "https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/RegExp" ]
			},
			{
				name : "sun-java",
				options : "dimsux",
				client : false,
				infoUrl : [ "http://docs.oracle.com/javase/1.4.2/docs/api/java/util/regex/Pattern.html" ]
			},
			{
				name : "php",
				options : "imsxu",
				client : false,
				infoUrl : [ "http://www.php.net/manual/en/reference.pcre.pattern.modifiers.php", "http://www.regular-expressions.info/php.html" ]
			} ]
};
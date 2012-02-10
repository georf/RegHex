import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.regex.PatternSyntaxException;

import org.apache.commons.lang3.StringEscapeUtils;

import json.JSONArray;
import json.JSONException;
import json.JSONObject;
import json.JSONTokener;

/**
 * This class parser accept a json input string. It's defined at the wiki page
 * {@link https://github.com/georf/RegHex/wiki/json-exchange-format}. Output is
 * already defined there.
 * 
 * @author Georg Limbach <georf@dev.mgvmedia.com>
 */
public class Parser {

	/**
	 * Use this main method for reading from stdin and create a parser object.
	 * 
	 * @param args
	 *            not used
	 */
	public static void main(String[] args) {

		try {
			BufferedReader in = new BufferedReader(new InputStreamReader(
					System.in));
			String line;
			StringBuffer text = new StringBuffer();
			while ((line = in.readLine()) != null) {
				text.append(line);
			}
			in.close();

			// create parser instance
			new Parser(text.toString());
		} catch (IOException e) {

			// send error
			simpleError(e.getMessage(), e);
		}
	}

	/**
	 * Parser parse a JSON object and compile the regular expression.
	 * 
	 * It print a new JSON object with the result to stdout.
	 * 
	 * @param text
	 *            JSON object as string
	 */
	public Parser(String text) {

		try {

			// create a json object from string
			JSONObject input = new JSONObject(new JSONTokener(text));

			// generate program snip
			StringBuffer programming = new StringBuffer(
					"Matcher m = Pattern.compile(\""
							+ StringEscapeUtils.escapeJava(input
									.getString("regularExpression")) + "\", ");

			try {
				// compute options
				int flags = 0;

				StringBuffer pFlags = new StringBuffer();

				JSONArray options = input.getJSONArray("flags");
				for (int i = 0; i < options.length(); i++) {

					if (options.getString(i).equals("d")) {
						flags = flags | Pattern.UNIX_LINES;
						pFlags.append("Pattern.UNIX_LINES | ");

					} else if (options.getString(i).equals("i")) {
						flags = flags | Pattern.CASE_INSENSITIVE;
						pFlags.append("Pattern.CASE_INSENSITIVE | ");

					} else if (options.getString(i).equals("m")) {
						flags = flags | Pattern.MULTILINE;
						pFlags.append("Pattern.MULTILINE | ");

					} else if (options.getString(i).equals("s")) {
						flags = flags | Pattern.DOTALL;
						pFlags.append("Pattern.DOTALL | ");

					} else if (options.getString(i).equals("u")) {
						flags = flags | Pattern.UNICODE_CASE;
						pFlags.append("Pattern.UNICODE_CASE | ");

					} else if (options.getString(i).equals("x")) {
						flags = flags | Pattern.COMMENTS;
						pFlags.append("Pattern.COMMENTS | ");

					}
				}

				if (pFlags.length() != 0) {
					programming
							.append(pFlags.substring(0, pFlags.length() - 3));
				} else {
					programming.append("0");
				}
				programming.append(");\nwhile(m.find()) {");
				input.put("programming", programming);

				String matchText = input.getString("matchText");

				// compile regex
				Pattern regex = Pattern.compile(input
						.getString("regularExpression"), flags);

				// output array
				JSONArray matchings = new JSONArray();

				Matcher matching = regex.matcher(matchText);
				while (matching.find()) {
					JSONObject current = new JSONObject();
					current.put("text", matching.group());

					current.put("index", matching.start());

					JSONArray subexpressions = new JSONArray();
					for (int n = 0; n <= matching.groupCount(); n++) {
						subexpressions.put(n, matching.group(n));
					}
					current.put("subexpressions", subexpressions);
					matchings.put(current);

				}

				input.put("matchings", matchings);
				input.put("error", false);
			} catch (PatternSyntaxException e) {
				input.put("error", e.getMessage());
			}

			// send json
			System.out.println(input);

		} catch (JSONException e) {

			// send error
			simpleError(e.getMessage(), e);
		}
	}

	/**
	 * Send a simple error in json format
	 * 
	 * <pre>
	 * {
	 *   "error":"input text"
	 * }
	 * </pre>
	 * 
	 * @param text
	 *            input text
	 * @param e
	 *            Exception for stack trace
	 */
	public static void simpleError(String text, Exception e) {
		StringBuffer trace = new StringBuffer("");
		if (e != null) {
			trace.append(",\"trace\":[");
			StackTraceElement[] stack = e.getStackTrace();
			for (int i = 0; i < stack.length; i++) {
				trace.append(JSONObject.quote(stack[i].toString()));
				if (i != stack.length - 1) {
					trace.append(",");
				}
			}
			trace.append("]");
		}
		System.out
				.println("{\"error\":" + JSONObject.quote(text) + trace + "}");
	}
}

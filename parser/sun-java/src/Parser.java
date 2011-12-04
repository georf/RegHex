import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.regex.PatternSyntaxException;

import json.JSONArray;
import json.JSONException;
import json.JSONObject;
import json.JSONTokener;

/**
 * 
 * @author Georg Limbach <georf@dev.mgvmedia.com>
 * 
 */
public class Parser {

	/**
	 * @param args
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

			new Parser(text.toString());
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
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

			try {
				// compute options
				int flags = 0;
				JSONArray options = input.getJSONArray("options");
				for (int i = 0; i < options.length(); i++) {
					if (options.getString(i).equals("d")) {
						flags = flags | Pattern.UNIX_LINES;
					} else if (options.getString(i).equals("i")) {
						flags = flags | Pattern.CASE_INSENSITIVE;
					} else if (options.getString(i).equals("m")) {
						flags = flags | Pattern.MULTILINE;
					} else if (options.getString(i).equals("s")) {
						flags = flags | Pattern.DOTALL;
					} else if (options.getString(i).equals("u")) {
						flags = flags | Pattern.UNICODE_CASE;
					} else if (options.getString(i).equals("x")) {
						flags = flags | Pattern.COMMENTS;
					}
				}

				// compile regex
				Pattern regex = Pattern.compile(input
						.getString("regularExpression"), flags);

				Matcher matching = regex.matcher(input.getString("matchText"));

				JSONArray matchings = new JSONArray();
				while (matching.find()) {
					JSONObject current = new JSONObject();
					current.put("text", matching.group());

					// todo index
					current.put("index", JSONObject.NULL);

					JSONArray subexpressions = new JSONArray();
					for (int i = 0; i <= matching.groupCount(); i++) {
						JSONObject currentSubexpression = new JSONObject();
						currentSubexpression.put("text", matching.group(i))
								.put("index", JSONObject.NULL);
						subexpressions.put(i, currentSubexpression);
					}
					current.put("subexpressions", subexpressions);
					matchings.put(current);
				}

				input.put("matchings", matchings);
				input.put("error", false);
			} catch (PatternSyntaxException e) {
				input.put("error", e.getMessage());
			}
			System.out.println(input);
		} catch (JSONException e) {
			try {
				JSONObject error = new JSONObject();
				error.put("error", e.getMessage());
				System.out.println(error);
			} catch (JSONException e1) {
				e1.printStackTrace();
			}

		}
	}
}

<?php

class InternParser {
	public static function run($jsonInput) {

		$input = json_decode($jsonInput);

		// check valid input
		$valid = array(
			'parser' => '',
			'regularExpression' => '',
			'flags' => array(),
			'matchText' => 'bluab'
		);

		foreach ($valid as $key=>$value) {
			if (!isset($input->$key)) {
				self::error($key.' not set', $input);
			} elseif (is_string($value) && !is_string($input->$key) || is_array($value) && !is_array($input->$key)) {
				self::error($key.' has not a correct format', $input);
			}
		}


		$output = $input;
		$output->debug = array();


		// set new values
		$regexp = $input->regularExpression;
		$text = $input->matchText;

		// error checking
		if (preg_match('|\s|', $regexp)) {
			self::error('Whitespaces in regex are not allowed', $input);
		}

		if (preg_match('|\s|', $text)) {
			self::error('Whitespaces in url are not allowed', $input);
		}



		$output->error = false;

		// check flags
		$flags = '';
		$pFlags = '';

		$not = false;

		foreach ($input->flags as $flag) {
			switch ($flag) {
				case 'i':
					$flags .= 'i';
					$pFlags .= 'NC';
					break;

				case 'N':
					$not = true;
					break;
			}
		}
		if ($pFlags !== '') {
			$pFlags = '[' . $pFlags. ']';
		}


		$escapeRegexp = str_replace('/', '\/', $regexp);
		$fullRegexp = '/'.$escapeRegexp.'/'.$flags;

		$output->matchings = array();
		$output->programming = '';


		$output->programming =
			'RewriteRule '.($not?'!':'').$regexp.' /replaceUrl.php?with=$1&groups=$2 '.$pFlags;

		if (preg_match($fullRegexp, $text, $result)) {
			$output->matchings[0] = (object) array();
			$output->matchings[0]->text = $result[0];
			$output->matchings[0]->subexpressions = $result;
			$output->matchings[0]->index = strpos($text, $result[0]);
		} else {
			$output->error = self::checkError();

			if ($output->error === false) {
				$output->matchings[0] = (object) array();
				$output->matchings[0]->text = $text;
				$output->matchings[0]->subexpressions = array();
				$output->matchings[0]->index = 0;
			}
		}


		die(json_encode($output));
	}

	private static function checkError() {
		switch (preg_last_error()) {
			case PREG_INTERNAL_ERROR:
				return PREG_INTERNAL_ERROR.': PREG_INTERNAL_ERROR';
				break;

			case PREG_BACKTRACK_LIMIT_ERROR:
				return PREG_BACKTRACK_LIMIT_ERROR.': PREG_BACKTRACK_LIMIT_ERROR';
				break;

			case PREG_RECURSION_LIMIT_ERROR:
				return PREG_RECURSION_LIMIT_ERROR.': PREG_RECURSION_LIMIT_ERROR';
				break;

			case PREG_BAD_UTF8_ERROR:
				return PREG_BAD_UTF8_ERROR.': PREG_BAD_UTF8_ERROR';
				break;

			case PREG_BAD_UTF8_OFFSET_ERROR:
				return PREG_BAD_UTF8_OFFSET_ERROR.': PREG_BAD_UTF8_OFFSET_ERROR';
				break;
		}
		return false;
	}

	private static function error($text, $input) {
		$input->error = $text;
		die(json_encode($input));
	}
}


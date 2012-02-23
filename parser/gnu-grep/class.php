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

		// write to file
		$filenameRegex = getTmpPath();
		file_put_contents($filenameRegex, $input->regularExpression);
		$filenameMatch = getTmpPath();
		file_put_contents($filenameMatch, $input->matchText);

		$textLines = explode("\n", $input->matchText);

		$output = $input;
		$output->debug = array();

		$output->error = false;

		// check flags
		$flags = '';
		foreach ($input->flags as $flag) {
			switch ($flag) {
				case 'E':
				case 'F':
				case 'i':
				case 'v':
				case 'w':
				case 'x':
					$flags .= $flag;
					break;
			}
		}

		if ($flags !== '') {
			$flags = ' -'.$flags;
		}



		$output->matchings = array();
		$output->programming = 'grep'.$flags.' -e '.escapeshellarg($input->regularExpression).' /path/to/file';

		ob_start();
		$filenameError = getTmpPath();
		passthru('grep'.$flags.' -f '.$filenameRegex.' '.$filenameMatch.' 2>'.$filenameError, $returnValue);
		$matching = ob_get_contents();
		ob_end_clean();

		if ($returnValue == 2) {
			$output->error = file_get_contents($filenameError);
		}

		$matchingLines = explode("\n", $matching);

		$max = sizeof($textLines);
		$current = 0;
		$linesMax = sizeof($matchingLines);
		$index = 0;

		for ($i = 0; $i < $max; $i++) {
			if ($textLines[$i] == $matchingLines[$current]) {

				$match = (object) array();

				$match->text = $textLines[$i];
				$match->index = $index;
				$match->subexpressions = array();
				$output->matchings[$current] = $match;
				++$current;
			}
			$index += strlen($textLines[$i])+1;
		}

		die(json_encode($output));
	}

	private static function error($text, $input) {
		$input->error = $text;
		die(json_encode($input));
	}
}


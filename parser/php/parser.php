#!/usr/bin/php
<?php

$jsonInput = file_get_contents('php://stdin');

$input = json_decode($jsonInput);

$output = $input;
$output->debug = array();


// set new values
$regexp = $input->regularExpression;
$text = $input->matchText;

$output->error = false;


	$options = implode($input->options);

$escapeRegexp = str_replace('/', '\/', $regexp);
$fullRegexp = '/'.$escapeRegexp.'/'.$options;
$matchingRegexp = '/('.$escapeRegexp.')/'.$options;

if (!preg_match($fullRegexp, $text)) {
	switch (preg_last_error()) {
	case PREG_INTERNAL_ERROR:
		$output->error = PREG_INTERNAL_ERROR.': PREG_INTERNAL_ERROR';
		break;

	case PREG_BACKTRACK_LIMIT_ERROR:
		$output->error = PREG_BACKTRACK_LIMIT_ERROR.': PREG_BACKTRACK_LIMIT_ERROR';
		break;

	case PREG_RECURSION_LIMIT_ERROR:
		$output->error = PREG_RECURSION_LIMIT_ERROR.': PREG_RECURSION_LIMIT_ERROR';
		break;

	case PREG_BAD_UTF8_ERROR:
		$output->error = PREG_BAD_UTF8_ERROR.': PREG_BAD_UTF8_ERROR';
		break;

	case PREG_BAD_UTF8_OFFSET_ERROR:
		$output->error = PREG_BAD_UTF8_OFFSET_ERROR.': PREG_BAD_UTF8_OFFSET_ERROR';
		break;
}
}

if ($output->error !== false) {
	die(json_encode($output));
}

$matchingAbsIndex = -1;
$matchings = array();

for ($absIndex = 0; $absIndex < strlen($text); $absIndex++) {
	$currentText = substr($text, $absIndex);

	if (preg_match($matchingRegexp, $currentText, $subexpressions)) {

		// get the absolute index of this matching
		$matchingIndex = strpos($currentText, $subexpressions[0]);
		if ($matchingIndex + $absIndex == $matchingAbsIndex) {
			// this matching is in the list
			continue;
		}

		$matchingText = $subexpressions[0];

		// set the absolute index of this matching
		$matchingAbsIndex = $matchingIndex + $absIndex;

		// get current subexpressions
		$currentSubexpressions = array();
		for ($i = 2; $i < count($subexpressions); $i++) {
			$currentSubexpressions[] = $subexpressions[$i];
		}

		$match = (object) array();
		$match->text = $matchingText;
		$match->index = $matchingAbsIndex;
		$match->subexpressions = $currentSubexpressions;

		$matchings[] = $match;
	}
}

$output->matchings = $matchings;

echo json_encode($output);

<?php
error_reporting(E_ALL);


if (isset($_POST['json'])) {
	$input = json_decode($_POST['json']);

	$vz = opendir(__DIR__);
	while ($dir = readdir($vz)) {
		if ($dir == $input->parser && is_dir(__DIR__.'/'.$dir) && is_file(__DIR__.'/'.$dir.'/class.php')) {
			include_once(__DIR__.'/'.$dir.'/class.php');
			break;
		}
	}
	closedir($vz);

	if (!class_exists('Parser')) {
		$input->error = 'Parser not exists';
		echo json_encode($input);
		exit();
	}

	$cmd = Parser::getCmdLine();

	$tmpFilename = '/tmp/parserregexp';
	do {
		$hash = md5(rand());
	} while(is_file($tmpFilename.$hash));

	$tmpFilename .= $hash;

	file_put_contents($tmpFilename, $_POST['json']);

	passthru($cmd .' < '.$tmpFilename);
	exit();
}

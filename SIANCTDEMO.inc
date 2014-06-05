<?php

// Demo of Sidora Analysis API for CameraTrap
// file: SIANCTDEMO.inc
// author: Gert Schmeltz Pedersen gertsp45@gmail.com

class SIANCTDEMO {

  function SIANCTDEMO() {
  }

  function sianctdemoGetFile($file='') {
		global $user;
	 	$datestamp = date('Y-m-d H:i:s');
 		$logdatestamp = date('Y-m-d');
		$logfp = fopen('/tmp/sianctdemo-' . $logdatestamp . '.log', 'a');
		fwrite($logfp, "\n\n[$datestamp] $user->name / sianctdemoGetFile / $file");
	$filePath = drupal_get_path('module', 'sianctdemo') . '/' . $file;
		fwrite($logfp, "\n\n[$datestamp] $user->name / sianctdemoGetFile / $filePath \n\n");
	$fp = fopen($filePath, 'r') or exit("Unable to open file!");
	$lineno = 0;
	while(!feof($fp)) {
		$line = fgets($fp);
		$lineno++;
		print $line;
			if ($lineno<20) {
				fwrite($logfp, $line);
			}
			if ($lineno==20) {
				fwrite($logfp, '...
				');
			}
	}
		fclose($logfp);
	fclose($fp);
	module_invoke_all('exit');
	exit();
  }

  function sianctdemoGetProjectStructure() {
		global $user;
	 	$datestamp = date('Y-m-d H:i:s');
 		$logdatestamp = date('Y-m-d');
		$logfp = fopen('/tmp/sianctdemo-' . $logdatestamp . '.log', 'a');
		fwrite($logfp, "\n\n[$datestamp] $user->name sianctdemoGetProjectStructure");
    $sianctUrl = variable_get('sianctdemo_block_sianct', 'noSianisUrl');
    $sianctUserPass = variable_get('sianctdemo_block_sianct_userpass', 'noSianisdemoUserOfSianis:Pass');
	$params = 'sianctProjectStructureToHtml.xslt';
	$command = 'curl --silent -u '. $sianctUserPass . ' "' . $sianctUrl . '/sianctGetProjectStructure/' . $params . '" 2>&1';
		fwrite($logfp, "\n[$datestamp] $user->name command: $command");
	$curlResult = shell_exec($command);
	 	$datestamp = date('Y-m-d H:i:s');
//		fwrite($logfp, "\n[$datestamp] $user->name curlResult: $curlResult");
	    $sianctdemoGetProjectStructureCount = substr_count($curlResult, 'sianctdemoObstableClicked');
		fwrite($logfp, "\n[$datestamp] $user->name sianctdemoGetProjectStructureCount: $sianctdemoGetProjectStructureCount observation tables");
		fclose($logfp);
	print $curlResult;
	module_invoke_all('exit');
	exit();
  }

  function sianctdemoGetSpecies($obstablePids) {
		global $user;
	 	$datestamp = date('Y-m-d H:i:s');
 		$logdatestamp = date('Y-m-d');
		$logfp = fopen('/tmp/sianctdemo-' . $logdatestamp . '.log', 'a');
		fwrite($logfp, "\n\n[$datestamp] $user->name sianctdemoGetSpecies: obstablePids= $obstablePids");
    $sianctUrl = variable_get('sianctdemo_block_sianct', 'noSianisUrl');
    $sianctUserPass = variable_get('sianctdemo_block_sianct_userpass', 'noSianisdemoUserOfSianis:Pass');
	$command = 'curl --silent -u '. $sianctUserPass . ' -X POST -d "pids=' . $obstablePids . '" "' . $sianctUrl . '/sianctGetSpecies" 2>&1';
		fwrite($logfp, "\n[$datestamp] $user->name command: $command");
	$curlResult = shell_exec($command);
	 	$datestamp = date('Y-m-d H:i:s');
	 	$logString = substr($curlResult,0,500);
		fwrite($logfp, "\n[$datestamp] $user->name curlResult: $logString");
		fclose($logfp);
	print $curlResult;
	module_invoke_all('exit');
	exit();
  }

  function sianctdemoSelectObstables($query) {
		global $user;
	 	$datestamp = date('Y-m-d H:i:s');
 		$logdatestamp = date('Y-m-d');
		$logfp = fopen('/tmp/sianctdemo-' . $logdatestamp . '.log', 'a');
		fwrite($logfp, "\n\n[$datestamp] $user->name sianctdemoSelectObstables: $query");
    $sianctUrl = variable_get('sianctdemo_block_sianct', 'noSianisUrl');
    $sianctUserPass = variable_get('sianctdemo_block_sianct_userpass', 'noSianisdemoUserOfSianis:Pass');
	$command = 'curl --silent -u '. $sianctUserPass . ' "' . $sianctUrl . '/sianctSelectObstables/' . urlencode($query) . '" 2>&1';
		fwrite($logfp, "\n[$datestamp] $user->name command: $command");
	$curlResult = shell_exec($command);
	 	$datestamp = date('Y-m-d H:i:s');
	 	$logString = substr($curlResult,0,600);
		fwrite($logfp, "\n[$datestamp] $user->name curlResult: $logString");
		fclose($logfp);
	print $curlResult;
	module_invoke_all('exit');
	exit();
  }
}

?>

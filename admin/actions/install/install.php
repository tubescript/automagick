<?
session_start();
$config_contents=file_get_contents("config.txt");

$_POST['pass']=urldecode($_POST['pass']);

if(!preg_match("/[a-zA-Z0-9\-\_]/i",$_POST['host'])){
	die('{"success":false,"message":"\'Database Hostname/\' only accepts alphanumeric characters and - _"}');
} else if(!preg_match("/[a-zA-Z0-9\-\_]/i",$_POST['user'])){
	die('{"success":false,"message":"\'Database User/\' only accepts alphanumeric characters and - _"}');
} else if(!preg_match("/[a-zA-Z0-9\-\_]/i",$_POST['name'])){
	die('{"success":false,"message":"\'Database Name/\' only accepts alphanumeric characters and - _"}');
}

$aSearches=array("{*host*}", "{*user*}", "{*pass*}", "{*name*}");
$aReplacements=array(str_replace("'","\'",$_POST['host']), str_replace("'","\'",$_POST['user']), str_replace("'","\'",$_POST['pass']), str_replace("'","\'",$_POST['name']));
$config_contents=str_replace($aSearches,$aReplacements,$config_contents);

/* if(!get_magic_quotes_gpc()){
	die('{"success":false,"message":"php.ini\'s <b>get_magic_quotes_gpc</b> must be set to On."}');
} */

if(!is_writable("../../../includes/")){
	@chmod("../../../includes/",0777);
}
if(!is_writable("../../../includes/")){
	die('{"success":false,"message":"\'includes/\' folder is not writable.<br>CHOMD it to 777 for this installation."}');
} else {
	$file=fopen("../../../includes/config.php","w+");
	fwrite($file,$config_contents);
	fclose($file);
}
@chmod("../../../includes/",0755);

if(file_exists("../../../includes/config.php")){
	
	// Test mysql_connection.
	$link = @mysql_connect($_POST['host'],$_POST['user'],$_POST['pass']) or $error=1;
	if(!$error){
		mysql_select_db($_POST['name']) or $error=1;
		if(!$error){
			$installing=1;
			include_once("../../../includes/config.php");
			include_once("../../../includes/functions.php");
			include_once("sql.php");
			$installing=0;
			die('{"success":true}');
		} else {
			@unlink("../../../includes/config.php");
			die('{"success":false,"message":"<b>Database Name Error:</b><br>'.str_replace("'","\'",mysql_error()).'"}');
		}
		mysql_close($link);
	} else {
		@unlink("../../../includes/config.php");
		die('{"success":false,"message":"<b>Database Data Error:</b><br>'.str_replace("'","\'",mysql_error()).'"}');
	}
} else {
	echo '{"success":false,"message":"<b>Installation Failed.</b><br>It seems includes/ folder is not writable."}';
}
<?
require_once("libs/smarty/Smarty.class.php"); 

// Initialize Smarty configuration.
$smarty =new Smarty; 
$smarty->template_dir 	= "templates/".$aSettings['template_name']."/"; 
if($is_mobile){
	$smarty->compile_dir 	= "libs/smarty/templates_c/mobile/"; 
} else {
	$smarty->compile_dir 	= "libs/smarty/templates_c/".$aSettings['template_name']."/";
}
if(!file_exists($smarty->compile_dir)) @mkdir($smarty->compile_dir,0755,true);
if(!is_writable($smarty->compile_dir)) @chmod($smarty->compile_dir,0777);

$smarty->config_dir 	= "libs/smarty/configs/";
$smarty->cache_dir 		= "libs/smarty/cache/";
$smarty->debugging  	= $debugging ? $debugging : false;
$smarty->caching 		= $caching ? $caching : false;
$smarty->cache_lifetime = $aSettings['template_cache_lifetime'] ? $aSettings['template_cache_lifetime']*60 : 3600; // In Seconds
$smarty->compile_check	= $compile_check ? $compile_check : true;
$smarty->force_compile	= $force_compile ? $force_compile :false;
?>
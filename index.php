<?php
session_start(); // Session Start
header('Cache-Control: no-cache, must-revalidate, max-age=0');
$st=microtime(1);

// Obtention of variables from GET
// -------------------------------
$module=$_GET['module'] ? strip_tags($_GET['module']) : "home";
$template=$_GET['template'] ? strip_tags($_GET['template']) : "" ;
if(!$template) $template=$_GET['template_name'] ? strip_tags($_GET['template_name']) : "" ;
$style_name=$_GET['style_name'] ? strip_tags($_GET['style_name']) : "" ;
$tubepro_style=$_GET['tubepro_style'] ? strip_tags($_GET['tubepro_style']) : "tubepro";
if(!preg_match("@^[a-z0-9\-_\.]+$@i",$template)) $template="";
if(!preg_match("@^[a-z0-9\-_\.]+$@i",$style_name)) $style_name="";
if(!preg_match("@^[a-z0-9\-_\.]+$@i",$tubepro_style)) $tubepro_style="";

if(!preg_match("/[a-z_]/i",$module)) $module="home";

if($_POST['tag']) $_GET['tag']=$_POST['tag'];
$tag=strip_tags(stripslashes($_GET['tag']));
if(!preg_match("/[a-zA-Z0-9_\s]/i",$tag)) $tag="";

// Inclusions
if(file_exists("includes/config.php") and filesize("includes/config.php")>0){
	include_once("includes/config.php"); 		// Inclusion of the config file. (BD connection is opened here).
} else {
	if(file_exists("admin/modules/install.php")){
		header("Location: admin/index.php?module=install");
	} else {
		die("No config file. Please, Reinstall.");
	}
}
include_once("includes/functions.php"); // Inclusion of the functions file.

if(!$ip) $ip=$_SERVER['REMOTE_ADDR'];
if(!$host) $host=preg_replace("_https?://|^www\.|https?://www\._","",$_SERVER['HTTP_HOST']);

$force_mobile=$_GET['force_mobile'] ? 1 : ($aSettings['force_mobile'] ? 1 : 0);
$is_mobile= $force_mobile ? $force_mobile : ($aSettings['mobile_enabled'] ? is_mobile() : 0);
$ts=time();

// Getting map info.
$aLanguages=getMap("languages");
$installed_languages=0;
foreach($aLanguages as $lang_id=>$aLang){
	if($aLang['default']) $default_language=$lang_id;
	if($aLang['installed']) $installed_languages++;
}
if(!$_SESSION['group_id']){
	$aGroupsMap=getMap("category_groups","id",null,null,"name","ASC");
	foreach($aGroupsMap as $key=>$aGroup){
		if($aGroup['status']==1){
			$default_group=$key;
			break;	
		} else {
			$default_group=1;
		}
	}
}

if( (!$_SESSION['group_id'] or $_SESSION['group_id']!=$_POST['group_id']) and $_POST['group_id']){
	$_SESSION['group_id']=(int) $_POST['group_id'];
} else {
	if(!$_SESSION['group_id']) $_SESSION['group_id']=$default_group;
}

if( (!$_SESSION['language'] or $_SESSION['language']!=$_GET['language']) and $_GET['language']){
	$_SESSION['language']=(int) $_GET['language'];
	$_SESSION['tags_cloud']=array();
} else {
	if(!$_SESSION['language']) $_SESSION['language']=$default_language;
}
$onlymod=$_POST['onlymod'] ? $_POST['onlymod'] : $_GET['onlymod'];


if($is_mobile){
	if($_GET['mobile_template_name']) $aSettings['mobile_template_name']=$_GET['mobile_template_name'];
	if($_GET['mobile_style_name']) $aSettings['mobile_style_name']=$_GET['mobile_style_name'];
	if($_GET['mobile_header_bgcolor']) $aSettings['mobile_header_bgcolor']=$_GET['mobile_header_bgcolor'];
	if($_GET['mobile_bar_bgcolor']) $aSettings['mobile_bar_bgcolor']=$_GET['mobile_bar_bgcolor'];
	if($_GET['mobile_body_bgcolor']) $aSettings['mobile_body_bgcolor']=$_GET['mobile_body_bgcolor'];
	if($_GET['mobile_font_color']) $aSettings['mobile_font_color']=$_GET['mobile_font_color'];
	if($_GET['mobile_font_color_2']) $aSettings['mobile_font_color_2']=$_GET['mobile_font_color_2'];
	if($_GET['mobile_menu_links_color']) $aSettings['mobile_menu_links_color']=$_GET['mobile_menu_links_color'];
	if($_GET['mobile_links_color']) $aSettings['mobile_links_color']=$_GET['mobile_links_color'];
	if($_GET['mobile_item_bgcolor']) $aSettings['mobile_item_bgcolor']=$_GET['mobile_item_bgcolor'];
	if($_GET['mobile_item_border']) $aSettings['mobile_item_border']=$_GET['mobile_item_border'];
	if($_GET['mobile_thumb_border_color']) $aSettings['mobile_thumb_border_color']=$_GET['mobile_thumb_border_color'];
	
	if(!$module || $module=="home") $module="videos";
	$aSettings['template_name']=$aSettings['mobile_template_name'] ? $aSettings['mobile_template_name'] : "mobile_default";
}

// Tags cloud functionality
if(!isset($_SESSION['search_tags'])) $_SESSION['search_tags']=array();
if($aSettings['tags_cloud_enabled'] and !$is_mobile){
	if(trim($tag) && !in_array($tag,$_SESSION['search_tags']) && !in_array($tag,(trim($aSettings['tags_cloud_forbidden_keywords']) ? explode(",",$aSettings['tags_cloud_forbidden_keywords']) : array())) ){
		$_SESSION['search_tags'][]=$tag;
		if(!preg_match("/bot/i",$_SERVER['HTTP_USER_AGENT'])){
			mysql_query("INSERT INTO search_tags (tag,lang_id,date)
						VALUES ('".mysql_real_escape_string(strtolower(trim(strip_tags($tag))))."','".$_SESSION['language']."','$ts')
						ON DUPLICATE KEY UPDATE tag_count = tag_count+1;");
		}
	}
	
	if(!$aSettings['tags_cloud_duration']) $aSettings['tags_cloud_duration']=5;
	if(!$_SESSION['tags_cloud'] or $_SESSION['tags_cloud_ts']<$ts-$aSettings['tags_cloud_duration']*60){
		$_SESSION['tags_cloud']=array();
		$_SESSION['tags_cloud_ts']=$ts;
		$_SESSION['total_tags']=0;
		$tags_limit = $aSettings['tags_cloud_limit'] ? $aSettings['tags_cloud_limit'] : 30;
		$tags_cloud_query="SELECT tag, tag_count FROM search_tags WHERE lang_id='".$_SESSION['language']."' GROUP BY tag ORDER BY RAND() LIMIT $tags_limit";
	

		$fetched_result=getMemcache(md5($query));
		if(!$fetched_result or count($fetched_result)==0){
			$tags_cloud_result=mysql_query($tags_cloud_query);
			while($row=mysql_fetch_assoc($tags_cloud_result)){
				$fetched_result[]=$row;
			}
			mysql_free_result($tags_cloud_result);
			setMemcache(md5($query),$fetched_result,$aSettings['memcache_expires']);
		}
		
		if($fetched_result && count($fetched_result)>0){
			$total_tags=0;
			foreach($fetched_result as $row){
				$_SESSION['tags_cloud'][$row['tag']]=$row['tag_count'];
				$_SESSION['total_tags']+=$row['tag_count'];
			}
			$min_count=min($_SESSION['tags_cloud']);
			$spread = max($_SESSION['tags_cloud']) - $min_count;
			if($spread<=0) $spread = 1;
			$font_spread = ($aSettings['tags_cloud_largest_font'] ? $aSettings['tags_cloud_largest_font'] : 26) - ($aSettings['tags_cloud_smallest_font'] ? $aSettings['tags_cloud_smallest_font'] : 8);
			if($font_spread<0) $font_spread = 1;
			$font_step = $font_spread / $spread;
		
			foreach($_SESSION['tags_cloud'] as $tag_key=>$count){
				$tag_size=(10 + ($count-$min_count) * $font_step);
				if($tag_size>60) $tag_size=60;
				$_SESSION['tags_cloud'][$tag_key]=$tag_size;
			}
			shuffle_assoc($_SESSION['tags_cloud']);
		}
	}
}

// --------------------------------


if($style_name) $aSettings['style_name']=$style_name;
if($tubepro_style) $aSettings['tubepro_style']=$tubepro_style;
if($template) $aSettings['template_name']=$template;

$force_compile=(int) $_GET['force_compile'];
$compile_check=true;
if($_SESSION['user_logged']){
	$caching=false;
} else {
	$header_cache_string=$module.$_GET['id'].$_GET['premium'].$_SESSION['language'].$_SESSION['group_id'].$tag.$_GET['categ_id'].$aSettings['template_name'];
	$header_cache_id = md5($header_cache_string);
	
	$caching=$aSettings['template_caching'];
	$cache_string="";
	foreach($_GET as $key=>$value) $cache_string.=$key."_".$value."&";
	foreach($_POST as $key=>$value) $cache_string.=$key."_".$value."&";
	foreach($_SESSION as $key=>$value){
		if(preg_match("/language|group_id/i",$key)){
			$cache_string.=$key."_".$value."&";
		}
	}
	$cache_string.="template_name=".$aSettings['template_name'];
	$cache_id = md5($cache_string);
}

include_once("includes/smarty.config.php");	// Inclusion of the templates engine (smarty) configuration file.
// -------------------------------
// Inclusion of the primary module.

$array_groups=getGroups();
$aCategoriesMap=getMap("categories","id",null,null,"name","ASC");
$aChannelsMap=getMap("channels","id",null,null,"name","ASC");

// Sorting Categories by Name.
/* if(!empty($aCategoriesMap)){
	foreach ($aCategoriesMap as $key => $row) $aCategoryName[$key]  = $row['name'];
	array_multisort($aCategoryName, SORT_ASC, SORT_STRING, $aCategoriesMap);
} */

$videos_count=mysql_query("SELECT VC.category_id, COUNT(VC.video_id) as videos_count FROM videos_categories VC INNER JOIN videos V ON VC.video_id=V.id WHERE V.status=1 GROUP BY category_id");
while($row=mysql_fetch_assoc($videos_count)){
	if($aCategoriesMap[$row['category_id']] && $aCategoriesMap[$row['category_id']]['status']==1){
		$aCategoriesMap[$row['category_id']]['videos_count']=$row['videos_count'];
	}
}

$active_groups=0;
if(!empty($array_groups)){
	foreach($array_groups as $g_id=>$categs){
		if($categs[0]){
			if($categs[0]['group_status']==1) $active_groups++;
			foreach($categs as $aCat){
				$aCategoriesMap[$aCat['category_id']]['group_id']=$g_id;
				$aCategoriesMap[$aCat['category_id']]['group_status']=$aCat['group_status'];
			}
		}
	}
}

if($_SESSION['language']!=$default_language){
	// Category Translations
	$result=mysql_query("SELECT category_id, name FROM category_translations WHERE lang_id='".$_SESSION['language']."'");
	if(mysql_num_rows($result)>0){
		while($row=mysql_fetch_assoc($result)){
			$aCategTranslationsMap[$row['category_id']]=$row['name'];
		}
	}
	
	foreach($aCategoriesMap as $category_id=>$aCateg){
		if(trim($aCategTranslationsMap[$category_id]['name'])){
			$aCategoriesMap[$category_id]['name']=$aCategTranslationsMap[$category_id];
		}
	}
}


// Zombaio Payment Buttons Replace.
$aSearches=array(
	'{*site_id*}',
	'{*user_id*}',
	'{*user_name*}',
	'{*user_password*}',
	'{*lang_code*}',
	'{*pricing_id*}',
	'{*template*}',
);
for($i=1; $i<=5; $i++){
	$aReplaces=array(
		$aSettings['zombaio_site_id'],
		($_SESSION['user_logged'] ? $_SESSION['user']['id'] : ""),
		($_SESSION['user_logged'] ? $_SESSION['user']['username'] : ""),
		($_SESSION['user_logged'] ? $aLabels['your_account_password'] : ""),
		$aLanguages[$_SESSION['language']]['code'],
		$aSettings['zombaio_option_pricing_id_'.$i],
		$aSettings['template_name'],
	);
	$aLabels[$_SESSION['language']]['zombaio_option_button_'.$i]=str_replace($aSearches,$aReplaces,$aLabels[1]['zombaio_option_button_'.$i]);
}

// CCBill Payment Buttons Replace.
for($i=1; $i<=5; $i++){
	$sExtraFields=
		($_SESSION['user_logged'] ? '<input type="hidden" name="user_id" value="'.$_SESSION['user']['id'].'">' : "").
		($_SESSION['user_logged'] ? '<input type="hidden" name="email" value="'.$_SESSION['user']['email'].'">' : "").
		($_SESSION['user_logged'] ? '<input type="hidden" name="username" value="'.$_SESSION['user']['username'].'">' : "").
		($_SESSION['user_logged'] ? '<input type="hidden" name="password" value="'.$aLabels[$_SESSION['language']]['your_account_password'].'">' : "").
		'<input type="hidden" name="ccbill_ts" value="'.$ts.'">'.
		'<input type="hidden" name="ccbill_sk" value="'.sha1($aSettings['ccbill_securuty_key'].$ts).'">';
		
		
	$aLabels[$_SESSION['language']]['ccbill_option_button_'.$i]=str_replace("</form>",$sExtraFields."</form>",$aLabels[1]['ccbill_option_button_'.$i]);
}

$aLabels=$aLabels[$_SESSION['language']];
$smarty->assign("aLabels",$aLabels);

// Getting User's favourite videos (if logged in)
// ----------------------------------------------
$array_favorites=array();
if($_SESSION['user_logged']){
	$user_premium=0;
	if($ts>$_SESSION['user']['premium_from_date'] && $ts<$_SESSION['user']['premium_to_date']){
		$user_premium=1;
	}

	$fav_result=mysql_query("SELECT video_id FROM users_favorited WHERE user_id='".$_SESSION['user']['id']."'");
	if(mysql_num_rows($fav_result)>0){
		while($row=mysql_fetch_assoc($fav_result)){
			$array_favorites[]=$row['video_id'];
		}
	}
}

if(function_exists("mb_substr")){
	$mb_available=1;
} else {
	$mb_available=0;	
}

$browse_link="browse";
if(!$smarty->is_cached($module.'.html',$cache_id) || $module=="video") {
	if(file_exists("modules/$module.php")) include("modules/$module.php");
	// Check if exists a .js file for the module
	$load_js=file_exists("js/modules/$module.js") ? 1 : 0;
}

if(!$title_string){
	$title_string=$aSettings['home_title'];
}

// Assign general variables to smarty engine.
// -----------------------------------------
$smarty->assign("array_groups",$array_groups);
$smarty->assign("array_categories",$aCategoriesMap);
$smarty->assign("array_channels",$aChannelsMap);
$smarty->assign("group_id",$_SESSION['group_id']);
$smarty->assign("active_groups",$active_groups);
$smarty->assign("mb_available",$mb_available);
$smarty->assign("tag",$tag);
$smarty->assign("onlymod",$onlymod);
$smarty->assign("array_favorites",$array_favorites);
$smarty->assign("browse_link",$browse_link);
$smarty->assign("order",1);
$smarty->assign("cache_id",$cache_id);
$smarty->assign("tags_min_count",$min_count);
$smarty->assign("user_premium",$user_premium);

$smarty->assign("ts",$ts);
$smarty->assign("sk",sha1($ts+$aSettings['license_number']));
$smarty->assign("module",$module);
$smarty->assign("load_js",$load_js);
$smarty->assign("template", $template ? $template : $aSettings['template_name']);
$smarty->assign("base_url",$aSettings['installation_url']);
$smarty->assign("aSettings",$aSettings);
$smarty->assign("aLanguages",$aLanguages);
$smarty->assign("language",$_SESSION['language']);
$smarty->assign("default_language",$default_language);
$smarty->assign("is_mobile",$is_mobile);
$smarty->assign("title_string",$title_string);
$smarty->assign("installed_languages",$installed_languages);
$smarty->assign("sLabelsJSON",json_encode($aLabels));

// -----------------------------------------
// Print the contents
if(!$onlymod) $smarty->display("header.html",$header_cache_id);
$smarty->display($module.".html",$cache_id);
if(!$onlymod) $smarty->display("footer.html",$header_cache_id);


$show_branding=1;
if($show_branding==1){
	if(!$onlymod) echo "<center>Powered By <b><a href=\"http://www.automagick.com/\" target=\"_blank\">Automagick Tube Script</a></b></center><br><br>";
}

if(!$onlymod && $_GET['getstats']==1){
	$et=microtime(1);
	echo "Page Loaded in: ".round(($et-$st),2)." sec., with ".memory_get_usage()/1024/1024 ." mb of memory used.";
}

<?
ini_set("max_execution_time",600);
@session_start();
@include_once("../includes/config.php");
@include_once("../includes/functions.php");
ini_set("memory_limit","64M");
$sitemap_filename="sitemap";

$sitemap_start='<?xml version="1.0" encoding="UTF-8"?>
	<urlset
		xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
		xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
		xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
		http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">';


/* if(@file_exists("../sitemap.xml") and (time()-filemtime("../sitemap.xml")<86400) ){
	echo @file_get_contents("../sitemap.xml");
} else { */
	// Getting map info.
	$ts=time();
	$aLanguages=getMap("languages");
	$installed_languages=0;
	foreach($aLanguages as $lang_id=>$aLang){
		if($aLang['default']) $default_language=$lang_id;
		if($aLang['installed']) $installed_languages++;
	}

	if($_GET['language'] and (!$_SESSION['language'] or $_SESSION['language']!=$_GET['language'])){
		$_SESSION['language']=(int) $_GET['language'];
	} else {
		if(!$_SESSION['language']) $_SESSION['language']=$default_language;
	}
	$aLabels=$aLabels[$_SESSION['language']];

	$aCategoriesMap=getMap("categories");
	$aChannelsMap=getMap("channels");
	$aUsersMap=getMap("users");
	$urls=0;
	if($aSettings['sitemap_status']==1){
		$limit=$_GET['limit'] ? (int) $_GET['limit'] : 49990;
		$lang=$aLanguages[$_SESSION['language']]['code'] ? $aLanguages[$_SESSION['language']]['code'] : "en";

		ob_start();
		echo $sitemap_start;
		echo'
		<url>
			<loc>'.$aSettings['installation_url'].'</loc>
			<changefreq>'.($aSettings['sitemap_frequency'] ? $aSettings['sitemap_frequency'] : 'daily').'</changefreq>
			<priority>1.00</priority>
		</url>
		<url>
			<loc>'.$aSettings['installation_url'].'browse/</loc>
			<changefreq>'.($aSettings['sitemap_frequency'] ? $aSettings['sitemap_frequency'] : 'daily').'</changefreq>
			<priority>1.00</priority>
		</url>
		<url>
			<loc>'.$aSettings['installation_url'].'premium/</loc>
			<changefreq>'.($aSettings['sitemap_frequency'] ? $aSettings['sitemap_frequency'] : 'daily').'</changefreq>
			<priority>1.00</priority>
		</url>
		<url>
			<loc>'.$aSettings['installation_url'].'categories.html</loc>
			<changefreq>'.($aSettings['sitemap_frequency'] ? $aSettings['sitemap_frequency'] : 'daily').'</changefreq>
			<priority>1.00</priority>
		</url>';
		
			// CATEGORIES
			foreach($aCategoriesMap as $categ_id=>$aCateg){
				if($aCateg['status']==1){
					echo '
		<url>
			<loc>'.$aSettings['installation_url'].'categ/'.$categ_id.'/'.preg_replace("/[ \<\>\#\?\%\&\/\"\']+/","-",$aCateg['name']).'</loc>
			<changefreq>'.($aSettings['sitemap_frequency'] ? $aSettings['sitemap_frequency'] : 'daily').'</changefreq>
			<priority>1.00</priority>
		</url>';
				}
			}
			unset($aCategoriesMap);
			// CHANNELS
			foreach($aChannelsMap as $channel_id=>$aChannel){
				if($aChannel['status']==1){
					echo '
		<url>
			<loc>'.$aSettings['installation_url'].'channel/'.$channel_id.'/'.preg_replace("/[ \<\>\#\?\%\&\/\"\']+/","-",$aChannel['name']).'</loc>
			<changefreq>'.($aSettings['sitemap_frequency'] ? $aSettings['sitemap_frequency'] : 'daily').'</changefreq>
			<priority>1.00</priority>
		</url>';
				}
			}
			unset($aChannelsMap);
			// USERS
			foreach($aUsersMap as $user_id=>$aUser){
				if($aUser['status']==1){
					echo '
		<url>
			<loc>'.$aSettings['installation_url'].'profile/'.$user_id.'/'.preg_replace("/[ \<\>\#\?\%\&\/\"\']+/","-",$aUser['username']).'</loc>
			<changefreq>'.($aSettings['sitemap_frequency'] ? $aSettings['sitemap_frequency'] : 'daily').'</changefreq>
			<priority>1.00</priority>
		</url>';
				}
			}
			unset($aUsersMap);
			echo '
	</urlset>';
		@file_put_contents("../sitemap.xml",ob_get_contents());
		ob_clean();
		//	@exec('zip -jo ../sitemap.zip ../sitemap.xml', $output, $return_code);
		// ob_flush();
		
		
		// Now, we create new sitemaps fof the videos.
		echo $sitemap_start;
		
		// VIDEOS
			$result=mysql_query("SELECT V.id, V.title
				FROM
					videos V
				LEFT JOIN videos_categories VC ON V.id=VC.video_id
				LEFT JOIN categories C ON VC.category_id=C.id
				LEFT JOIN categories_groups CG ON VC.category_id=CG.category_id
				LEFT JOIN category_groups G ON CG.group_id=G.id
				LEFT JOIN users U ON V.user_id=U.id
				WHERE
					V.status=1
				AND V.reported<10
				AND (
					(V.activation_date=0 AND V.deactivation_date=0)
					OR ($ts BETWEEN V.activation_date AND V.deactivation_date)
					OR (V.activation_date=0 AND V.deactivation_date>$ts)
					OR (V.activation_date<$ts AND V.deactivation_date=0)
				)
				AND (C.status=1 OR CG.category_id IS NULL)
				AND (G.status=1 OR CG.group_id IS NULL)
				AND (U.status=1 OR U.id IS NULL)
				GROUP BY V.id
			ORDER BY V.id DESC") or die(mysql_error());
			
			$videos_count=0;
			$sitemap_count=1;
			while($aVideo=mysql_fetch_assoc($result)){
					if($_SESSION['language']==1 or !trim($aVideo['translations'][$_SESSION['language']]['title'])){
					$link=$aSettings['installation_url']."video/".$aVideo['id']."/".preg_replace("|[ \<\>\#\?\%\&\/\"\']|","-",$aVideo['title']);
				} else {
					$link=$aSettings['installation_url']."video/".$aVideo['id']."/".preg_replace("|[ \<\>\#\?\%\&\/\"\']|","-",$aVideo['translations'][$_SESSION['language']]['title']);
				}			
				echo '
				<url>
					<loc>'.$link.'</loc>
					<changefreq>'.($aSettings['sitemap_videos_frequency'] ? $aSettings['sitemap_videos_frequency'] : 'daily').'</changefreq>
					<priority>0.80</priority>
				</url>';
				if($videos_count>=$limit){
									echo '
	</urlset>';
					@file_put_contents("../sitemap_".$sitemap_count.".xml",ob_get_contents());
					ob_clean();
					$sitemap_count++;
					$videos_count=0;
				}
				$videos_count++;
			}
			echo '
	</urlset>';
			@file_put_contents("../sitemap_".$sitemap_count.".xml",ob_get_contents());
			ob_end_clean();
			mysql_free_result($result);
	}
// }
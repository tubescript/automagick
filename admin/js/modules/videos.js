var images_cache=[];
var slider_cache=[];
var adjustments_cache=[];

var reseted=0;
var create_allowed=0;
var brightness_slider=null;
var contrast_slider=null;
var sharpness_slider=null;
var cropper=null;
var slider="";

var thumb_uploads=[];

function VideoPreview(id){
	ExecAjax("actions/videos/get_video_info.php","id="+id,"$('img_preview_"+id+"').src='images/loading.gif';","","EvalVideoPreview(transport.responseText,'"+id+"');","",true);
}

function EvalVideoPreview(response,id){
	$('img_preview_'+id).src='images/icons/videos.png'
	oResponse=response.evalJSON();
	if(oResponse.success==true){
		var aVideo=oResponse.aVideo;
		
		aVideo.player_code=aVideo.player_code.replace(/{\*player_width\*}/g,'480');
		aVideo.player_code=aVideo.player_code.replace(/{\*player_height\*}/g,'360');
		
		if(aVideo.tags) aVideo.tags=aVideo.tags.split(",").join(", ");
		
		$('preview_id').value=aVideo.id;
		for(key in aVideo){
			if($('preview_'+key)) $('preview_'+key).innerHTML=aVideo[key];
		}

		if(aVideo.thumbs[0].match(/^thumbs\//)) aVideo.thumbs[0]="../"+aVideo.thumbs[0];
		$('preview_thumbnails').innerHTML='<img src="'+aVideo.thumbs[0]+'" width="164" height="124" id="preview_thumbnail" onmouseover="StartThumbRotation(\'preview_thumbnail\',\''+aVideo.id+'\');" onmouseout="StopThumbRotation(\'preview_thumbnail\',\''+aVideo.id+'\');">';
		
		if(aVideo.premium==1){
			$('preview_premium_layer').show();
			$('preview_nofile_layer').style.top='32px';
			$('preview_hosted_layer').style.top='32px';
			$('preview_hotlinked_layer').style.top='32px';
			$('preview_embedded_layer').style.top='32px';
			$('preview_rtmp_layer').style.top='32px';
		} else {
			$('preview_premium_layer').hide();
			$('preview_nofile_layer').style.top='5px';
			$('preview_hosted_layer').style.top='5px';
			$('preview_hotlinked_layer').style.top='5px';
			$('preview_embedded_layer').style.top='5px';
			$('preview_rtmp_layer').style.top='5px';
		}
		
		if(aVideo.embed_code){
			$('preview_nofile_layer').hide();
			$('preview_hotlinked_layer').hide();
			$('preview_hosted_layer').hide();
			$('preview_rtmp_layer').show();
			$('preview_embedded_layer').show();			
		} else if(aVideo.file){
			$('preview_nofile_layer').hide();
			if(aVideo.rtmp_server>0){
				$('preview_hotlinked_layer').hide();
				$('preview_nofile_layer').hide();
				$('preview_hosted_layer').hide();
				$('preview_embedded_layer').hide();
				$('preview_rtmp_layer').show();				
			} else {
				if(aVideo.file.match(/^videos\//) ){
					$('preview_nofile_layer').hide();
					$('preview_hotlinked_layer').hide();
					$('preview_embedded_layer').hide();
					$('preview_rtmp_layer').hide();
					$('preview_hosted_layer').show();
				} else {
					$('preview_nofile_layer').hide();
					$('preview_hosted_layer').hide();
					$('preview_embedded_layer').hide();
					$('preview_rtmp_layer').hide();
					$('preview_hotlinked_layer').show();
				}
			}
		} else {
			$('preview_hosted_layer').hide();
			$('preview_hotlinked_layer').hide();
			$('preview_embedded_layer').hide();
			$('preview_rtmp_layer').hide();
			$('preview_nofile_layer').show();
		}
		
		if(aVideo.m4v_file!=''){
			$('preview_m4v_ok_layer').show();
		} else {
			$('preview_m4v_ok_layer').hide();
		}
		
		if(aVideo.mp4_file!=''){
			$('preview_mp4_ok_layer').show();
			if(aVideo.m4v_file!=''){
				$('preview_mp4_ok_layer').style.top='18px';
			} else {
				$('preview_mp4_ok_layer').style.top='5px';
			}
		} else {
			$('preview_mp4_ok_layer').hide();
		}
		
		if(aVideo['star_image']){
			$('preview_stars_img').src='images/stars/star_image_big_'+aVideo['star_image']+'.png';
		}
		
		$('preview_cron_tasks').innerHTML='';
		if(aVideo['cron_status']!=""){
			var aCronTasks=aVideo['cron_status'].split(",");
			
			var cron_tasks_string="";
			var failed_cron_tasks_string="";
			for(i=0;i<aCronTasks.length;i++){
				switch(aCronTasks[i]){
					case "1": cron_tasks_string+=' - Video file download/conversion pending<br class="br">'; break;
					case "2": cron_tasks_string+=' - Preview image download pending<br class="br">'; break;
					case "3": cron_tasks_string+=' - Thumbnails download pending<br class="br">'; break;
					case "4": cron_tasks_string+=' - Random image preview extraction  pending<br class="br">'; break;
					case "5": cron_tasks_string+=' - Thumbnails secuence extraction pending<br class="br">'; break;
					case "6": cron_tasks_string+=' - Video Duration Extraction<br class="br">'; break;
					case "7": cron_tasks_string+=' - Video file conversion to M4V pending<br class="br">'; break;
					case "9": cron_tasks_string+=' - Video file conversion to MP4 pending<br class="br">'; break;
					case "8": cron_tasks_string+=' - Translate Video Title and Description<br class="br">'; break;
					case "A": cron_tasks_string+=' - Move to Any Active Streaming Server pending<br class="br">'; break;
					case "-1": failed_cron_tasks_string+=' - Video file download/conversion Failed<br class="br">'; break;
					case "-2": failed_cron_tasks_string+=' - Preview image download Failed<br class="br">'; break;
					case "-3": failed_cron_tasks_string+=' - Thumbnails download Failed<br class="br">'; break;
					case "-4": failed_cron_tasks_string+=' - Random image preview extraction Failed<br class="br">'; break;
					case "-5": failed_cron_tasks_string+=' - Thumbnails Secuence Extraction Failed<br class="br">'; break;
					case "-6": failed_cron_tasks_string+=' - Video Duration Extraction Failed<br class="br">'; break;
					case "-7": failed_cron_tasks_string+=' - Video file conversion to M4V<br class="br">'; break;
					case "-9": failed_cron_tasks_string+=' - Video file conversion to MP4<br class="br">'; break;
					case "-8": failed_cron_tasks_string+=' - Translate Video Title and Description<br class="br">'; break;
					case "-A": failed_cron_tasks_string+=' - Move to Any Active Streaming Server failed<br class="br">'; break;
				}
			}
			if(cron_tasks_string!=""){
				$('preview_cron_tasks').innerHTML="<br>".cron_tasks_string;
				if(failed_cron_tasks_string!=""){
					$('preview_cron_tasks').innerHTML+='<br class="br"><b>Failed Cron Tasks:</b><br class="br">'+failed_cron_tasks_string;
				}
			} else {
				$('preview_cron_tasks').innerHTML="No pending Tasks";
			}
		}
		
		$('preview_warnings').innerHTML='';
		var warnings_html="";
		if(aVideo.warnings.missing_player){
			warnings_html=warnings_html+'<div class="option_button"><a href="javascript:void(0);" rel="'+aVideo.warnings.missing_player+'" id="preview_layer_missing_player_warning"><img src="images/icons/warning_video.png"></a></div>&nbsp;&nbsp;';
		}
		if(aVideo.warnings.reported_video){
			warnings_html=warnings_html+'<div class="option_button"><a href="javascript:void(0);" rel="'+aVideo.warnings.reported_video+'" id="preview_layer_reported_video_warning" onclick="GetReportedReasons(\''+aVideo.id+'\');"><img src="images/icons/warning_report.png" id="reported_video_icon_preview"></a></div>&nbsp;&nbsp;';
		}
		if(aVideo.warnings.missing_preview){
			warnings_html=warnings_html+'<div class="option_button"><a href="javascript:void(0);" rel="'+aVideo.warnings.missing_preview+'" id="preview_layer_missing_preview_warning"><img src="images/icons/warning_thumbs.png"></a></div>&nbsp;&nbsp;';
		}
		if(aVideo.warnings.less_thumbs){
			warnings_html=warnings_html+'<div class="option_button"><a href="javascript:void(0);" rel="'+aVideo.warnings.less_thumbs+'" id="preview_layer_less_thumbs_warning"><img src="images/icons/warning_thumbs.png"></a></div>&nbsp;&nbsp;';
		}			
		if(aVideo.warnings.no_description){
			warnings_html=warnings_html+'<div class="option_button"><a href="javascript:void(0);" rel="'+aVideo.warnings.no_description+'" id="preview_layer_no_description_warning"><img src="images/icons/warning_langs.png"></a></div>&nbsp;&nbsp;';
		}			
		if(aVideo.warnings.less_translations){
			warnings_html=warnings_html+'<div class="option_button"><a href="javascript:void(0);" rel="'+aVideo.warnings.less_translations+'" id="preview_layer_less_translations_warning"><img src="images/icons/warning_langs.png"></a></div>&nbsp;&nbsp;';
		}			
		$('preview_warnings').innerHTML=warnings_html;
		if($('preview_layer_missing_player_warning')) ReTip('preview_layer_missing_player_warning');
		if($('preview_layer_reported_video_warning')) ReTip('preview_layer_reported_video_warning');
		if($('preview_layer_missing_preview_warning')) ReTip('preview_layer_missing_preview_warning');
		if($('preview_layer_less_thumbs_warning')) ReTip('preview_layer_less_thumbs_warning');
		if($('preview_layer_no_description_warning')) ReTip('preview_layer_no_description_warning');
		if($('preview_layer_less_translations_warning')) ReTip('preview_layer_less_translations_warning');
		
		OpenLayer('preview_layer');
	} else {
		alertBox('Error Message','icons/error.gif',oResponse.message,300);
	}
}

function VideoSimplePreview(id){
	ExecAjax("actions/videos/get_video_info.php","id="+id,"$('edit_simple_preview_video_icon').src='images/loading.gif';","","EvalVideoSimplePreview(transport.responseText,'"+id+"');","",true);	
}

function EvalVideoSimplePreview(response,id){
	$('edit_simple_preview_video_icon').src='images/icons/videos.png'
	oResponse=response.evalJSON();
	if(oResponse.success==true){
		var aVideo=oResponse.aVideo;
		if(aVideo.file!="" || aVideo.embed_code!=""){
			aVideo.player_code=aVideo.player_code.replace(/480/g,"240").replace(/360/g,"180");
			for(key in aVideo){
				if($('simple_preview_'+key)) $('simple_preview_'+key).innerHTML=aVideo[key];
			}
			OpenLayer('simple_preview_layer');
		} else {
			alertBox('Error Message','icons/error.gif',"<b>Video File does not exist</b><br>Click 'Edit' button to add a video.",300);
		}
		
	} else {
		alertBox('Error Message','icons/error.gif',oResponse.message,300);
	}
}

function GetSourcesVideos(){
	var x=confirm("Are you sure you want to get sources' videos now?\r\nThis action will execute the same as if the cron job for videos runs.\r\nRemember that this will follow the configuration saved in sources module.");
	if(x) ExecAjax("../magick/sources_cron.php","","$('get_sources_icon').src='images/loading.gif';","","EvalGetSourcesVideos(transport.responseText);","POST",true);
}

function EvalGetSourcesVideos(response){
	$('get_sources_icon').src='images/icons/am_star.png';
	if(!response){
		alertBox('Information','icons/info.png','It seems there is no videos to grab.<br>Check the configuration of the Sources.',450);
	} else {
		alertBox('Information','icons/info.png',response,450);
	}
}

function SetVideoStatus(id,status){
	ExecAjax("actions/videos/set_video_status.php","ids=["+id+"]&status="+status,"$('img_status_"+id+"').src='images/loading.gif';","","EvalSetVideoStatus(transport.responseText,'"+id+"','"+status+"');","POST",true);
}

function EvalSetVideoStatus(response,id,status){
	oResponse=response.evalJSON();
	if(oResponse.success==true){
		if(status==0){
			$('video_status_option_'+id).innerHTML='<img id="img_status_'+id+'" src="images/icons/inactive.png" onmouseover="this.src=\'images/icons/go.png\';" onmouseout="this.src=\'images/icons/inactive.png\';" onclick="SetVideoStatus('+id+',1);">';
			$('title_'+id).className="red";
			$('thumb_td_'+id).className="thumb_error";
			
		} else {
			$('video_status_option_'+id).innerHTML='<img id="img_status_'+id+'" src="images/icons/active.png" onmouseover="this.src=\'images/icons/stop.png\';" onmouseout="this.src=\'images/icons/active.png\';" onclick="SetVideoStatus('+id+',0);">';
			$('title_'+id).className="link";
			$('thumb_td_'+id).className="thumb";
		}
	} else {
		alertBox('Error Message','icons/error.gif',oResponse.message,300);
	}	
}
	
function DeleteVideo(id){
	var x=confirm("Are you sure you want to delete this video?");
	if(x) ExecAjax("actions/videos/delete_video.php","ids=["+id+"]","$('img_delete_"+id+"').src='images/loading.gif';","","EvalDeleteVideo(transport.responseText,'"+id+"');","POST",true);
}

function EvalDeleteVideo(response,id){
	oResponse=response.evalJSON();
	if(oResponse.success==true){
		$('div_options_'+id).innerHTML="";
		var video_title=$('title_'+id).innerHTML;
		$('title_td_'+id).innerHTML="<b>"+video_title+"</b>";
		$('title_td_'+id).className="red";
		$('title_td_'+id).style.fontStyle="italic";
		var thumb_src=$('thumb_'+id).src;
		$('thumb_td_'+id).style.background='url('+thumb_src+')';
		$('thumb_td_'+id).innerHTML="<img src='images/deleted_image.png' border='0' style='border:1px solid #333333;'>";
	} else {
		alertBox('Error Message','icons/error.gif',oResponse.message,150);
		$('img_delete_'+id).src='images/icons/delete.png';
	}
}

function MassDelete(source){
	var x=confirm("Are you sure you want to mass delete the videos?");
	if(x)  ExecAjax("actions/videos/mass_delete.php","source="+source,"$('md_loading').show();","","EvalMassDelete(transport.responseText,'"+source+"');","",true);
}

function EvalMassDelete(response,source){
	$('md_loading').hide();
	oResponse=response.evalJSON();
	if(oResponse.success==true){
		alertBox('Error Message','icons/success.png',oResponse.message,400);
	} else {
		alertBox('Error Message','icons/error.gif',oResponse.message,300);
	}		
}

function SetStatusDate(id,date,type){
	ExecAjax("actions/videos/set_status_date.php","id="+id+"&date="+date+"&type="+type,"$('"+type+"_date_img_"+id+"').src='images/loading.gif';","","EvalSetStatusDate(transport.responseText,'"+id+"','"+date+"','"+type+"');","",true);
}

function EvalSetStatusDate(response,id,date,type){
	oResponse=response.evalJSON();
	if(oResponse.success==true){
		$(type+'_date_img_'+id).src="images/icons/calendar_"+type+".png";
		$(type+'_date_tip_'+id).rel="Select "+type+" Date for this video (or leave empty)<br>Current Value: "+date;
		ReTip(type+'_date_tip_'+id);
	} else {
		alertBox('Error Message','icons/error.gif',oResponse.message,150);
	}	
}

function ResetStats(id){
	var x=confirm("Are you sure you want to Reset the Stats of this video?\r\nyou will also delete the times it was reported.");
	if(x) ExecAjax("actions/videos/reset_stats.php","ids=["+id+"]","$('img_recycle_"+id+"').src='images/loading.gif';","","EvalResetStats(transport.responseText,'"+id+"');","POST",true);
}

function EvalResetStats(response,id){
	oResponse=response.evalJSON();
	if(oResponse.success==true){
		$('img_recycle_'+id).src="images/icons/success.png";
		setTimeout("$('img_recycle_"+id+"').src='images/icons/recycle.png'",2000);
	} else {
		$('img_recycle_'+id).src="images/icons/recycle.png";
		alertBox('Error Message','icons/error.gif',oResponse.message,300);
	}
}


function CheckVideo(id){
	if(!id){
		id="";
		var x=confirm("Are you sure you want to check ALL videos?\r\nThis may take several minutes.");
	} else {
		var x=true;	
	}
	if(x) ExecAjax("actions/videos/check_video.php","ids=["+id+"]","if($('img_check_"+id+"')) $('img_check_"+id+"').src='images/loading.gif';","","EvalCheckVideo(transport.responseText,'"+id+"');","POST",true);
}

function EvalCheckVideo(response,id){
	oResponse=response.evalJSON();
	if(oResponse.success==true){
		if(!id){
			alertBox('Check Results','icons/success.png',oResponse.message,500);
		} else {
			$('img_check_'+id).src="images/icons/success.png";
			if(oResponse.message) alertBox('Notice','icons/success.png',oResponse.message,500);
			setTimeout("$('img_check_"+id+"').src='images/icons/check.png'",2000);
		}
	} else {
		if(!id){
			alertBox('Error Message','icons/error.gif',oResponse.message,500);	
		} else {
			$('img_check_'+id).src="images/icons/check.png";
			alertBox('Error Message','icons/error.gif',oResponse.message,500);
		}
	}	
}

function SmartRecategorize(id){
	if($('sr_mode').value==0){
		if(id.match(/g_[0-9]+$/)){
			var group_id=id.replace("g_","");
			var categ_id='';
			var id='';
		} else if(id.match(/_c_/)){
			var temp=id.split("_c_");
			var group_id=temp[0].replace("g_","");
			var categ_id=temp[1];
			var id='';
		} else {
			var group_id='';
			var categ_id='';
		}
		ExecAjax("actions/videos/smart_categorize.php","ids=["+id+"]&categ_id="+categ_id+"&group_id="+group_id,"$('img_sr_button').src='images/loading.gif'; if('"+id+"'!=''){$('img_recategorize_"+id+"').src='images/loading.gif';}","","EvalSmartRecategorize(transport.responseText);","",true);
	} else {
		var ids=[];
		$$('.video_cb').each(function(element){
			if(element.checked){
				ids.push(element.value);
			}
		});
		ExecAjax("actions/videos/smart_categorize.php","ids="+ids.toJSON(),"","","EvalSmartRecategorize(transport.responseText);","",true);
	}
}

function EvalSmartRecategorize(response){
	$('img_sr_button').src="images/icons/recategorize.png";
	oResponse=response.evalJSON();
	ids=oResponse.ids;
	if(oResponse.success==true){
		if(ids.length==1){
			$('img_recategorize_'+ids[0]).src="images/icons/success.png";
			setTimeout("$('img_recategorize_"+ids[0]+"').src='images/icons/recategorize.png'",2000);
		}
		if(oResponse.message) alertBox('Notice','icons/success.png',oResponse.message,500);
	} else {
		if(ids && ids.length==1){
			$('img_recategorize_'+ids[0]).src="images/icons/recategorize.png";
		}
		alertBox('Error Message','icons/error.gif',oResponse.message,500);
	}	
}

function ActionOnSelected(value){
	if(!value){
		value=$('selected_action').value;
	}

	var aIds=[];
	$$('.video_cb').each(function(element){
		if(element && element.checked==true) aIds.push(parseInt(element.value));
	});

	var x=false;
	if(aIds.length>0 && value!=""){
		switch(value){
			case "1":
				x=confirm("Are you sure you want to Activate the Selected Videos?");
				if(x){
					ExecAjax("actions/videos/set_video_status.php","ids="+aIds.toJSON()+"&status=1","","","EvalActionOnSelected(transport.responseText,'"+value+"');","POST",true);
				}
			break;
			case "2":
				x=confirm("Are you sure you want to Deactivate the Selected Videos?");
				if(x){
					ExecAjax("actions/videos/set_video_status.php","ids="+aIds.toJSON()+"&status=0","","","EvalActionOnSelected(transport.responseText,'"+value+"');","POST",true);
				}
			break;
			case "3":
				x=confirm("Are you sure you want to Delete the Selected Videos?");
				if(x){
					ExecAjax("actions/videos/delete_video.php","ids="+aIds.toJSON(),"","","EvalActionOnSelected(transport.responseText,'"+value+"');","POST",true);
				}
			break;
			case "4":
			break;
			case "5":
			break;
			case "6":
				x=confirm("Are you sure you want to Check for Broken Videos on the Selected Videos?\r\nThis may take several minutes.");
				if(x){
					ExecAjax("actions/videos/check_video.php","ids="+aIds.toJSON(),"","","EvalActionOnSelected(transport.responseText,'"+value+"');","POST",true);
				}
			break;
			case "7":
				x=confirm("Are you sure you want to Reset Stats for the Selected Videos?");
				if(x){
					ExecAjax("actions/videos/reset_stats.php","ids="+aIds.toJSON(),"","","EvalActionOnSelected(transport.responseText,'"+value+"');","POST",true);
				}
			break;
			case "8":
				$('sr_videos_from_categ').hide();
				$('sr_videos_from_selection').show();
				OpenLayer('smart_recategorize_layer');				
				
				var cb_amount=aIds.length;

				$('sr_videos_from_selection_amount').innerHTML=cb_amount + " videos.";
				$('sr_mode').value=1;
			break;
			case "9":
				x=confirm("Are you sure you want to Auto-Capture an Image Preview for the Selected Videos?\r\nThis may take several minutes, specially if the video is not hosted locally.");
				if(x){
					ExecAjax("actions/videos/capture_frame.php","video_ids="+aIds.toJSON()+"&random=1&autosave=1&from_selected=1","OpenLayer('main_loading');","","EvalActionOnSelected(transport.responseText,'"+value+"');","",true,"");
				}
			break;
			case "10":
				x=confirm("Are you sure you want to Auto-Generate Thumnail Secuence for the Selected Videos?\r\nThis may take several minutes, specially if the video is not hosted locally.");
				if(x){
					ExecAjax("actions/videos/capture_frame.php","video_ids="+aIds.toJSON()+"&random=1&mode=thumbs&autosave=1&from_selected=1","OpenLayer('main_loading');","","EvalActionOnSelected(transport.responseText,'"+value+"');","",true,"");
				}
			break;
			case "11":
				x=confirm("Are you sure you want to Run the Taks Cron job for the Selected Videos?\r\nThis will attept to run only the pending actions for each video.\r\nIt might take several minutes, depending on the amount fo videos and it's pending actions.");
				if(x){
					ExecAjax("../magick/tasks_cron.php","ids="+aIds.toJSON(),"$('run_cron_tasks_icon').src='images/loading.gif';","","$('run_cron_tasks_icon').src='images/icons/cron_tasks_run.png'; EvalActionOnSelected(transport.responseText,'"+value+"');","POST",true);
				}
			break;
			case "12":
				$('tasks_cron_ids').value=aIds.toJSON();
				OpenLayer("tasks_cron_layer");
			break;
			case "13":
				x=confirm("This action will attempt to translate the selected videos titles and descriptions\r\nfrom the current default language to all the other languages.\r\nThis will overwrite the existing translations, if any!\r\nDo you want to continue?");
				if(x){
					ExecAjax("actions/videos/autotranslate.php","ids="+aIds.toJSON(),"","","EvalActionOnSelected(transport.responseText,'"+value+"');","POST",true);
				}
			break;
		}
		if(x) $('selected_action_loading_img').show();
	}
}

function EvalActionOnSelected(response,value){
	$('selected_action_loading_img').hide();
	if(value!="11") oResponse=response.evalJSON();
	switch(value){
		case "1":
			if(oResponse.ids && oResponse.ids.length>0){
				aIds=oResponse.ids;
				for(i=0; i<aIds.length; i++){
					$('video_status_option_'+aIds[i]).innerHTML='<img id="img_status_'+aIds[i]+'" src="images/icons/active.png" onmouseover="this.src=\'images/icons/stop.png\';" onmouseout="this.src=\'images/icons/active.png\';" onclick="SetVideoStatus('+aIds[i]+',0);">';
					$('title_'+aIds[i]).className="link";
					$('thumb_td_'+aIds[i]).className="thumb";
				}
			}
		break;
		case "2":
			if(oResponse.ids && oResponse.ids.length>0){
				aIds=oResponse.ids;
				for(i=0; i<aIds.length; i++){
					$('video_status_option_'+aIds[i]).innerHTML='<img id="img_status_'+aIds[i]+'" src="images/icons/inactive.png" onmouseover="this.src=\'images/icons/go.png\';" onmouseout="this.src=\'images/icons/inactive.png\';" onclick="SetVideoStatus('+aIds[i]+',1);">';
					$('title_'+aIds[i]).className="red";
					$('thumb_td_'+aIds[i]).className="thumb_error";
				}
			}
		break;
		case "3":
			if(oResponse.ids && oResponse.ids.length>0){
				aIds=oResponse.ids;
				for(i=0; i<aIds.length; i++){
					EvalDeleteVideo('{"success":true}',aIds[i]);
				}
			}
		break;
		
		case "6":
			if(oResponse.success==true){
				alertBox('Check Results','icons/success.png',oResponse.message,500);
			} else {
				alertBox('Error Message','icons/error.gif',oResponse.message,500);	
			}
		break;
		case "7":
			if(oResponse.success==true){
				alertBox('Notice','icons/success.png',oResponse.message,400);
			} else {
				alertBox('Error Message','icons/error.gif',oResponse.message,400);	
			}
		break;
		case "9":
			CloseLayer('main_loading');
			if(oResponse.success==true){
				alertBox('Result','icons/success.png',oResponse.message,500);
				aIds=oResponse.ids;
				for(i=0; i<aIds.length; i++){
					thumbs_cache[aIds[i]]="";
				}
			} else {
				alertBox('Error Message','icons/error.gif',oResponse.message,500);	
			}
		break;
		case "10":
			CloseLayer('main_loading');
			if(oResponse.success==true){
				alertBox('Result','icons/success.png',oResponse.message,500);
				aIds=oResponse.ids;
				for(i=0; i<aIds.length; i++){
					thumbs_cache[aIds[i]]="";
				}
			} else {
				alertBox('Error Message','icons/error.gif',oResponse.message,500);	
			}
		break;
		case "11":
			CloseLayer('main_loading');
			alertBox('Information','icons/info.png',"<b>Tasks Cronjob finished for the selected videos.</b> Refresh the page.<br>You may check the results in the Tasks Cron Log viewer, <a href=\"javascript:void(0);\" onclick=\"OpenTasksLog();\">here</a>.",500);
		break;
		case "13":
			CloseLayer('main_loading');
			if(oResponse.success==true){
				alertBox('Result','icons/success.png',oResponse.message,500);
			} else {
				alertBox('Error Message','icons/error.gif',oResponse.message,500);	
			}
		break;
	}
}


function CheckUncheck(){
	var checked=$('check_uncheck_all').checked;
	$$('.video_cb').each(function(element){
		element.checked=checked;
	});
}


function OpenEditLayer(id,mode){
	$('edit_form').reset();
	$('edit_id').value='';
	$('refresh_on_close').value='';
	EditFormHideMessages();
	
	CancelEditVideoFileOptions();
	CancelEditVideoPreviewOptions();
	CancelEditVideoThumbsOptions();
		
	SwitchTinyTab('edit_video',1);
	$('edit_video_translations_div').hide();
	$('edit_video_media_div').hide();
	$('edit_video_basic_info_div').show();
	
	if(mode=="add"){
		$('edit_layer_title').innerHTML="Add New Video";
		$('edit_player_id_row').show();
		$('edit_video_protect_layer').show();
		$('edit_player_id').disabled=false;
		
		OpenLayer('edit_layer');
	} else {
		$('edit_layer_title').innerHTML="Edit Video";
		ExecAjax("actions/videos/get_video_info.php","id="+id,"$('edit_video_"+id+"').src='images/loading.gif'; OpenLayer('main_loading');","","CloseLayer('main_loading'); EvalOpenEdit(transport.responseText,'"+id+"');","",true);
	}
}

function EvalOpenEdit(response,id){
	$('edit_video_'+id).src='images/icons/edit.png'
	oResponse=response.evalJSON();
	if(oResponse.success==true){
		var aVideo=oResponse.aVideo;
		
		if(!aVideo.duration_hours) aVideo.duration_hours=0;
		if(!aVideo.duration_mins) aVideo.duration_mins=0;
		if(!aVideo.duration_hours) aVideo.duration_hours=0;
		
		if(!aVideo.views) aVideo.views=0;
		if(!aVideo.favorited) aVideo.favorited=0;
		if(!aVideo.ranking) aVideo.ranking=0;
		if(!aVideo.voted) aVideo.voted=0;
		
		if(aVideo.activation_date==0) aVideo.activation_date_formated="";
		if(aVideo.deactivation_date==0) aVideo.deactivation_date_formated="";
		
		for(key in aVideo){
			if($('edit_'+key)){
				if($('edit_'+key).type=="checkbox"){
					$('edit_'+key).checked=(aVideo[key]==0 ? false :true );
				} else {
					$('edit_'+key).value=aVideo[key];
				}
			}
		}
		
		if(aVideo.player_editable==1){
			$('edit_player_id_row').show();
			$('edit_player_id').disabled=false;
			$('edit_player_id').value=aVideo.player_id;
		} else {
			$('edit_player_id_row').hide();
			$('edit_player_id').disabled=true;
		}	
		
		if(aVideo.categories){
			aVideo.aCategories=aVideo.categories.split(",");
			if(aVideo.aCategories.length>0){
				for(var i=0; i<$('edit_categories').options.length; i++){
					element=$('edit_categories').options[i];
					for(j=0; j<aVideo.aCategories.length; j++){
					  	if(element.value==aVideo.aCategories[j] && element.value!=""){
					  		element.selected=true;
					  		break;
						} else {
							element.selected=false;
						}
					}
				}
			}
		} else {
			for(var i=0; i<$('edit_categories').options.length; i++){
				$('edit_categories').options[i].selected=false;
			}	
		}
		
		if(aVideo.channels){
			aVideo.aChannels=aVideo.channels.split(",");
			if(aVideo.aChannels.length>0){
				for(var i=0; i<$('edit_channels').options.length; i++){
					element=$('edit_channels').options[i];
					for(j=0; j<aVideo.aChannels.length; j++){
					  	if(element.value==aVideo.aChannels[j] && element.value!=""){
					  		element.selected=true;
					  		break;
						} else {
							element.selected=false;
						}
					}
				}
			}
		} else {
			for(var i=0; i<$('edit_channels').options.length; i++){
				$('edit_channels').options[i].selected=false;
			}
		}

		if(aVideo.translations){
			for(i in aVideo.translations){
				if($('edit_title_translation_'+i)) $('edit_title_translation_'+i).value=aVideo.translations[i].title;
				if($('edit_description_translation_'+i)) $('edit_description_translation_'+i).value=aVideo.translations[i].description;
			}
		}
		
		if(aVideo.embed_code!="" || aVideo.player_id>1){
			aVideo.file_method='Embedded Video';
		} else if(aVideo.file!=""){
			if(aVideo.rtmp_server>0){
				aVideo.file_method='RTMP Hosted Video';
			} else {
				if(aVideo.file.match(/^videos\//)){
					aVideo.file_method='Hosted Video';
				} else {
					aVideo.file_method='Hotlinked Video';
				}
			}
		} else {
			aVideo.file_method='';	
		}
			
		if(aVideo.file!="" || aVideo.embed_code!=""){
			$('edit_video_file_editing_row').hide();
			$('edit_video_file_exists_row').show();			
			$('edit_simple_preview_video_link').rel='<b>Video File Exists</b><br>Click to preview.';
			$('edit_simple_preview_video_link').className="";
			$('edit_video_file_info').removeClassName("disabled");
			$('edit_video_file_info').rel='<b>Method:</b> '+aVideo.file_method;
			if(aVideo.file_method!='' && aVideo.file_method!='Embeded Video') $('edit_video_file_info').rel+='<br><b>File Location:</b> '+aVideo.file;			
		} else {
			$('edit_video_file_exists_row').hide();
			$('edit_video_file_editing_row').show();
			$('edit_simple_preview_video_link').rel='<b>No Video File.</b><br>Edit to Add.';
			$('edit_simple_preview_video_link').className="disabled";
			$('edit_video_file_info').addClassName("disabled");
			$('edit_video_file_info').rel='<b>No Info Available.</b>';
			
		}
		ReTip('edit_simple_preview_video_link');
		ReTip('edit_video_file_info');
		
		if(aVideo.m4v_file!=''){
			$('edit_m4v_ok_image').rel=aVideo.m4v_file;
			ReTip('edit_m4v_ok_image');
			$('edit_m4v_ok_image').show();
		} else {
			$('edit_m4v_ok_image').hide();
		}
		
		if(aVideo.mp4_file!=''){
			$('edit_mp4_ok_image').rel=aVideo.mp4_file;
			ReTip('edit_mp4_ok_image');
			$('edit_mp4_ok_image').show();
		} else {
			$('edit_mp4_ok_image').hide();
		}
		
		if(aVideo.preview_img!=""){
			if(aVideo.preview_img.match(/^previews\//)){
				aVideo.preview_method='Hosted Image';
			} else {
				aVideo.preview_method='Hotlinked Image';
			}
			$('edit_image_preview_info').rel='<b>Method:</b> '+aVideo.preview_method+'<br><b>Image Location:</b> '+aVideo.preview_img;
			$('edit_image_preview_info').removeClassName('disabled');
			
			$('edit_video_preview_editing_row').hide();
			$('edit_video_preview_exists_row').show();
			
			
			var preview_img=aVideo.preview_img;
			if(preview_img.match(/^previews\//)) preview_img = "../"+preview_img;
			$('edit_preview_image_link').rel='<img src="'+preview_img+'">';
			$('edit_preview_image_link').className="";
		} else {
			$('edit_image_preview_info').rel='<b>No Info Available</b>';
			$('edit_image_preview_info').addClassName('disabled');
			
			$('edit_video_preview_exists_row').hide();
			$('edit_video_preview_editing_row').show();
			$('edit_preview_image_link').rel='<b>No Preview Image.</b><br>Edit to Add.';
			$('edit_preview_image_link').className="disabled";
		}
		ReTip('edit_preview_image_link');
		ReTip('edit_image_preview_info');
		
		if(aVideo.thumbs!="" && aVideo.thumbs.length>0){
			for(i=0; i<aVideo.thumbs.length; i++){
				if(aVideo.thumbs[i].match(/^thumbs\//)){
					aVideo.thumb_method_hosted=1;
				} else {
					aVideo.thumb_method_hotlinked=1;
				}
			}
			if(aVideo.thumb_method_hotlinked==1 && aVideo.thumb_method_hosted==1){
				aVideo.thumb_method="Mixed: Hosted & Hotlinked";
			} else if(aVideo.thumb_method_hosted==1){
				aVideo.thumb_method="Hosted";
			} else if(aVideo.thumb_method_hotlinked==1){				
				aVideo.thumb_method="Hotlinked";
			} else {
				aVideo.thumb_method='';
			}
			
			$('edit_thumbs_info').rel='<b>Method:</b> '+aVideo.thumb_method;
			$('edit_thumbs_info').rel+='<br><b>Amount:</b> '+aVideo.thumbs.length+' of '+aSettings.thumbs_amount;
			$('edit_thumbs_info').removeClassName('disabled');
			
			$('edit_video_thumbs_editing_row').hide();
			$('edit_video_thumbs_exists_row').show();
			
			UpdateThumbsTip(aVideo.thumbs);
		} else {
			$('edit_thumbs_info').rel='<b>No Info Available</b>';
			$('edit_thumbs_info').addClassName('disabled');
			
			$('edit_video_thumbs_exists_row').hide();
			$('edit_video_thumbs_editing_row').show();
			$('edit_thumbs_link').rel='<b>No Thumbnails.</b><br>Edit to Add.';
			$('edit_thumbs_link').className="disabled";
		}
		ReTip('edit_thumbs_link');
		ReTip('edit_thumbs_info');
		
		$('edit_video_success_msg_media').hide();
	
		SwitchEditVideoMethod(0); // Don't show the rows.
		SwitchEditPreviewMethod(0); // Don't show the rows.
		SwitchEditThumbsMethod(0); // Don't show the rows.
		
		$('edit_video_protect_layer').hide();
			
		OpenLayer('edit_layer');
	} else {
		alertBox('Error Message','icons/error.gif',oResponse.message,300);
	}
}

function AddEditVideo(){
	var error=0;
	var f=$('edit_form');
	
	EditFormHideMessages();
	
	// Validations.
	if(f.edit_title.value==""){
		if($('edit_title_error_span')){
			$('edit_title').style.border='1px solid #CC0000';
			OpenLayer('edit_title_error_span');
			error=1;
		}
	}
	
	/* if(f.edit_categories.value==""){
		if($('edit_categories_error_span')){
			$('edit_categories').style.border='1px solid #CC0000';
			OpenLayer('edit_categories_error_span');
			error=1;
		}
	} */
	
	if(f.edit_player_id.disabled==false){
		if(f.edit_player_id.value==""){
			$('edit_player_id').style.border='1px solid #CC0000';
			OpenLayer('edit_player_id_error_span');
			error=1;
		}
	}
	
	if(!error){
		var vars=f.serialize();
		vars=vars.replace(/^edit_/g,"");
		vars=vars.replace(/&edit_/g,"&");
		
		ExecAjax("actions/videos/edit_video.php",vars,"","$('edit_video_save_icon').src='images/loading.gif'; $('edit_video_save_icon_2').src='images/loading.gif';","EvalAddEditVideo(transport.responseText);","",true,"");
	}
}

function EvalAddEditVideo(response){
	$('refresh_on_close').value='1';
	$('edit_video_save_icon').src='images/icons/save.png';
	$('edit_video_save_icon_2').src='images/icons/save.png';
	
	oResponse=response.evalJSON();
	if(oResponse.success==true){
		OpenLayer('edit_video_success_msg');
		OpenLayer('edit_video_success_msg_2');
		
		if(oResponse.mode=="add"){
			$('edit_id').value=oResponse.id;
			$('edit_video_protect_layer').hide();
			$('edit_layer_title').innerHTML="Edit Video";
			
			$('edit_layer_reset_add_link').show();
			$('edit_layer_reset_add_link_2').show();
		} else {
			$('edit_layer_reset_add_link').hide();
			$('edit_layer_reset_add_link_2').hide();
		}
	} else {
		alertBox('Error Message','icons/error.gif',oResponse.message,300);
	}	
	
}

function EditFormHideMessages(){
	var f=$('edit_form');
	// Reset all error messages.
	$('edit_video_success_msg').hide();
	$('edit_video_success_msg_2').hide();
	$('edit_video_translations_success_msg').hide();
	$('edit_video_translations_success_msg_2').hide();
	$('edit_video_success_msg_media').hide();
	
	f.getElements().each(function(element){
		if($(element.id+'_error_span')){
			element.style.border='1px solid #999999';
			$(element.id+'_error_span').hide();
		}
	});	
}

function EditVideoTranslations(){
	var id=$('edit_id').value;
	EditFormHideMessages();

	if(id){
		var vars=$('edit_form').serialize();
		vars=vars.replace(/^edit_/g,"");
		vars=vars.replace(/&edit_/g,"&");
		ExecAjax("actions/videos/edit_video_translations.php",vars,"","$('edit_video_translations_save_icon').src='images/loading.gif'; $('edit_video_translations_save_icon_2').src='images/loading.gif';","EvalEditVideoTranslations(transport.responseText);","",true,"");
	} else {
		alertBox('Error Message','icons/error.gif',"<b>Cannot save translations.</b><br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Add basic video info first.",350);	
	}
}

function EvalEditVideoTranslations(response){
	$('edit_video_translations_save_icon').src='images/icons/save.png';
	$('edit_video_translations_save_icon_2').src='images/icons/save.png';

	oResponse=response.evalJSON();
	if(oResponse.success==true){
		$('refresh_on_close').value='1';
		OpenLayer('edit_video_translations_success_msg');
		OpenLayer('edit_video_translations_success_msg_2');
		
		if(oResponse.mode=="add"){
			$('edit_id').value=oResponse.new_id;
			$('edit_video_protect_layer').hide();
		}
	} else {
		alertBox('Error Message','icons/error.gif',oResponse.message,350);
	}	
	
}

function CheckDurationSpinner(v,type){
	if(parseInt(v)>59){
		if(type=="secs"){
			$('edit_duration_mins').value=parseInt($('edit_duration_mins').value)+1;
			$('edit_duration_secs').value=0;
		} else {
			$('edit_duration_hours').value=parseInt($('edit_duration_hours').value)+1;
			$('edit_duration_mins').value=0;
		}
	} else if(parseInt(v)<0){
		if(type=="secs"){
			$('edit_duration_mins').value=parseInt($('edit_duration_mins').value)-1;
			if($('edit_duration_mins').value<0) $('edit_duration_mins').value=0;
			$('edit_duration_secs').value=59;
		} else {
			$('edit_duration_hours').value=parseInt($('edit_duration_hours').value)-1;
			if($('edit_duration_hours').value<0) $('edit_duration_hours').value=0;
			$('edit_duration_mins').value=59;
		}
	}
}

function ShowEditVideoFileOptions(){
	SwitchEditVideoMethod(0);
	$('edit_video_method_select').value=0;
	$('edit_video_file_name').value='';
	$('edit_video_file_exists_row').hide();
	$('edit_video_file_editing_row').show();
}

function CancelEditVideoFileOptions(){
	SwitchEditVideoMethod(0);
	$('edit_video_file_editing_row').hide();
	$('edit_video_file_exists_row').show();
	CancelVideoFileUpload();
	CancelVideoFileDownload();
	CancelVideoHotlink();
}

function SwitchEditVideoMethod(method){
	switch(method){
		case "1": // Upload
			$('edit_video_method_download').hide();
			$('edit_video_method_hotlink').hide();
			$('edit_video_method_upload').show();
			CancelVideoFileUpload();
		break;
		case "2": // Download
			$('edit_video_method_upload').hide();
			$('edit_video_method_hotlink').hide();
			$('edit_video_method_download').show();
			CancelVideoFileDownload();
		break;
		case "3": // Hotlink
			$('edit_video_method_upload').hide();
			$('edit_video_method_download').hide();
			$('edit_video_method_hotlink').show();
			CancelVideoHotlink();
		break;
		default:
			$('edit_video_method_upload').hide();
			$('edit_video_method_download').hide();
			$('edit_video_method_hotlink').hide();
		break;
	}	
}

function SubmitVideoUploadForm(){
	// Validating file type (allowing only FLV, WMV, AVI, MP4, MPG and MPEG.)
	var file=$('edit_video_file_name').value;
	if(file){
		var ext=file.substr(file.length - 4).replace(".","").toLowerCase();
		
		if(ext=="flv" || ext=="wmv" || ext=="avi" || ext=="mpg" || ext=="mpeg" || ext=="mp4" || ext=="m4v"){
			$('edit_video_file_upload_button_img').src="images/loading.gif";
			$('edit_video_file_upload_button_text').innerHTML="Uploading...";
			$('edit_video_file_upload_cancel').show();
			$('edit_video_file_upload_form').submit();
		} else {
			alertBox('Error Message','icons/error.gif','<b>Invalid file format.</b><br>Only FLV, AVI, MPG, MPEG, WMV, MP4 and M4V formats allowed.',400);	
		}
	}
}

function CancelVideoFileUpload(){
	$('video_upload_iframe').src='about:blank';
	$('edit_video_file_upload_cancel').hide();
	$('edit_video_file_upload_button_img').src="images/icons/upload.png";
	$('edit_video_file_upload_button_text').innerHTML="Browse...";
	
	$('save_uploaded_video_disabled').show();
	$('save_uploaded_video').hide();
	$('edit_video_file_name_uploaded').value='';
}

function FileUploadedOk(filename){
	$('edit_video_file_name_uploaded').value=filename;
	$('edit_video_file_name').value='';
	$('edit_video_file_upload_button_img').src='images/icons/success.png';
	$('edit_video_file_upload_button_text').innerHTML='Uploaded!';
	$('edit_video_file_upload_cancel').hide();
	
	$('save_uploaded_video_link').rel="Save the uploaded video: <b>"+filename+"</b><br><b>Warning:</b> you won't be able to restore the old video.";
	ReTip('save_uploaded_video_link');
	
	setTimeout("$('edit_video_file_upload_button_img').src='images/icons/upload.png';",4000);
	setTimeout("$('edit_video_file_upload_button_text').innerHTML='Browse...';",4000);
	
	$('save_uploaded_video_disabled').hide();
	$('save_uploaded_video').show();
}

function SaveVideoUploadedFile(){
	var x=confirm("Are you sure you want to save the uploaded video?\r\nYou won't be able to reverse this action."); // \r\n\r\nMP4 videos will replace any existing FLV if 'Priorize MP4 Conversion' is checked.
	
	if(x){
		var video_id=$('edit_id').value;
		var filename=$('edit_video_file_name_uploaded').value;
		
		if(filename==""){
			alertBox('Error Message','icons/error.gif','<b>Cannot save Video.</b><br>Upload a file first.',300);	
		} else {
			if(video_id){
				ExecAjax("actions/videos/save_uploaded_video.php","video_id="+video_id+"&filename="+escape(filename),"","$('save_uploaded_video_icon').src='images/loading.gif';","EvalSaveVideoUploadedFile(transport.responseText);","",true,"");
			}
		}
	}
}

function EvalSaveVideoUploadedFile(response){
	oResponse=response.evalJSON();
	if(oResponse.success==true){
		$('save_uploaded_video_icon').src='images/icons/success.png';
		setTimeout("$('save_uploaded_video_icon').src='images/icons/save.png';",2000);
		setTimeout("CancelEditVideoFileOptions();",2000);
		
		if(oResponse.ext=="m4v"){
			$('edit_m4v_ok_image').rel="Uploaded";
			ReTip('edit_m4v_ok_image');
			$('edit_m4v_ok_image').show();
		}
		
		if(oResponse.ext=="mp4"){
			$('edit_mp4_ok_image').rel="Uploaded";
			ReTip('edit_mp4_ok_image');
			$('edit_mp4_ok_image').show();
		}
		
		$('edit_video_success_msg_media').innerHTML="Video successfuly saved";
		OpenLayer('edit_video_success_msg_media');
		
		$('edit_simple_preview_video_link').rel='<b>Video File Exists</b><br>Click to preview.';
		$('edit_simple_preview_video_link').className="";
		ReTip('edit_simple_preview_video_link');		
	} else {
		$('save_uploaded_video_icon').src='images/icons/save.png';
		alertBox('Error Message','icons/error.gif',oResponse.message,400);
	}
}


function CancelVideoFileDownload(){	
	$('save_downloaded_video').hide();
	$('save_downloaded_video_disabled').show();
	$('edit_downloaded_video_button').hide();
	$('edit_downloaded_video_button_disabled').show();
	$('edit_video_file_name_downloaded').value="";
}


function CheckEnableDownloadButton(value,type){
	if(value!=""){
		$('edit_downloaded_'+type+'_button_disabled').hide();
		$('edit_downloaded_'+type+'_button').show();
	} else {
		$('edit_downloaded_'+type+'_button').hide();	
		$('edit_downloaded_'+type+'_button_disabled').show();
	}
}

function CheckEnableHotlinkButton(value,type){
	if(value!=""){
		$('edit_hotlinked_'+type+'_button_disabled').hide();
		$('edit_hotlinked_'+type+'_button').show();
	} else {
		$('edit_hotlinked_'+type+'_button').hide();	
		$('edit_hotlinked_'+type+'_button_disabled').show();
	}
}

function DownloadVideo(){
	var url=$('edit_video_file_name_downloaded').value;
	var ext=url.substr(url.length - 4).replace(".","").toLowerCase();
	
	if(url==""){
		alertBox('Error Message','icons/error.gif','<b>Cannot download Video.</b><br>Provide an URL of the video you want to download.',300);	
	} else if(!url.match(/^https?:\/\//i)) {
		alertBox('Error Message','icons/error.gif','<b>Cannot download Video.</b><br>URL of the video is invalid. It should be a complete URL, pointing to the file.',450);
	} else if(ext!="flv" && ext!="wmv" && ext!="avi" && ext!="mpg" && ext!="mpeg" && ext!="mp4" && ext!="m4v"){
		alertBox('Error Message','icons/error.gif','<b>Invalid file format.</b><br>Only FLV, WMV, AVI, MP4, M4V, MPG and MPEG formats allowed.',400);	
	} else {
		ExecAjax("actions/videos/video_download.php","url="+escape(url),"$('edit_download_video_icon').src='images/loading.gif';","","EvalDownloadVideo(transport.responseText);","",true,"",90); // Timout 1200 seconds (20 mins).
	}
}

function EvalDownloadVideo(response){
	oResponse=response.evalJSON();
	if(oResponse.success==true){
		$('edit_download_video_icon').src='images/icons/success.png';
		setTimeout("$('edit_download_video_icon').src='images/icons/download.png';",4000);
		
		$('save_downloaded_video_link').rel="Save the uploaded video: <b>"+oResponse.filename+"</b><br><b>Warning:</b> you won't be able to restore the old video.";
		ReTip('save_downloaded_video_link');

		$('save_downloaded_video_disabled').hide();
		$('save_downloaded_video').show();
	} else {
		$('edit_download_video_icon').src='images/icons/download.png';
		alertBox('Error Message','icons/error.gif',oResponse.message,500);
	}
}

function SaveVideoDownloadedFile(){
	var x=confirm("Are you sure you want to save the downloaded video? You won't be able to reverse this action");
	
	if(x){
		var video_id=$('edit_id').value;
		var filename=$('edit_video_file_name_downloaded').value;
		
		if(filename==""){
			alertBox('Error Message','icons/error.gif','<b>Cannot save Video.</b><br>Download a file first.',300);	
		} else {
			if(video_id){
				ExecAjax("actions/videos/save_uploaded_video.php","video_id="+video_id+"&filename="+escape(filename),"","$('save_downloaded_video_icon').src='images/loading.gif';","EvalSaveVideoDownloadedFile(transport.responseText);","",true,"");
			}
		}
	}
}

function EvalSaveVideoDownloadedFile(response){
	oResponse=response.evalJSON();
	if(oResponse.success==true){
		$('save_downloaded_video_icon').src='images/icons/success.png';
		setTimeout("$('save_downloaded_video_icon').src='images/icons/save.png';",2000);
		setTimeout("CancelEditVideoFileOptions();",2000);
		
		if(oResponse.ext=="m4v"){
			$('edit_m4v_ok_image').rel="Uploaded";
			ReTip('edit_m4v_ok_image');
			$('edit_m4v_ok_image').show();
		}
		
		if(oResponse.ext=="mp4"){
			$('edit_mp4_ok_image').rel="Uploaded";
			ReTip('edit_mp4_ok_image');
			$('edit_mp4_ok_image').show();
		}
		
		$('edit_video_success_msg_media').innerHTML="Video successfuly saved";
		OpenLayer('edit_video_success_msg_media');
		
		$('edit_simple_preview_video_link').rel='<b>Video File Exists</b><br>Click to preview.';
		$('edit_simple_preview_video_link').className="";
		ReTip('edit_simple_preview_video_link');
	} else {
		$('save_downloaded_video_icon').src='images/icons/save.png';
		alertBox('Error Message','icons/error.gif',oResponse.message,400);
	}
}


function CancelVideoHotlink(){
	$('edit_video_file_name_hotlink').value="";
	$('save_hotlinked_video').hide();
	$('save_hotlinked_video_disabled').show();
}

function CheckEnableSaveButton(value,type){
	if(value!=""){
		$('save_hotlinked_'+type+'_disabled').hide();
		$('save_hotlinked_'+type).show();
	} else {
		$('save_hotlinked_'+type).hide();
		$('save_hotlinked_'+type+'_disabled').show();
	}
}

function SaveVideoHotlinked(){
	var video_id=$('edit_id').value;
	var filename=$('edit_video_file_name_hotlink').value;
	var ext=filename.substr(filename.length - 4).replace(".","").toLowerCase();
	
	if(filename.match(/^https?:\/\//i) && (ext=="flv" || ext=="m4v" || ext=="mp4")){
		ExecAjax("actions/videos/update_video_file.php","video_id="+video_id+"&filename="+escape(filename),"","$('save_hotlinked_video_icon').src='images/loading.gif';","EvalSaveVideoHotlinked(transport.responseText);","",true,"");
	} else {
		$('save_hotlinked_video').hide();
		$('save_hotlinked_video_disabled').show();
		alertBox('Error Message','icons/error.gif','<b>Cannot save Video.</b><br>Make sure the file points to a valid url and the format of the video is FLV.',450);
	}
}

function EvalSaveVideoHotlinked(response){
	oResponse=response.evalJSON();
	if(oResponse.success==true){
		$('save_hotlinked_video_icon').src='images/icons/success.png';
		setTimeout("$('save_hotlinked_video_icon').src='images/icons/save.png';",2000);
		setTimeout("CancelEditVideoFileOptions();",2000);
		
		if(oResponse.ext=="m4v"){
			$('edit_m4v_ok_image').rel="Uploaded";
			ReTip('edit_m4v_ok_image');
			$('edit_m4v_ok_image').show();
		}
		
		if(oResponse.ext=="mp4"){
			$('edit_mp4_ok_image').rel="Uploaded";
			ReTip('edit_mp4_ok_image');
			$('edit_mp4_ok_image').show();
		}
		
		$('edit_video_success_msg_media').innerHTML="Video successfuly saved";
		OpenLayer('edit_video_success_msg_media');
		
		$('edit_simple_preview_video_link').rel='<b>Video File Exists</b><br>Click to preview.';
		$('edit_simple_preview_video_link').className="";
		ReTip('edit_simple_preview_video_link');
	} else {
		$('save_hotlinked_video_icon').src='images/icons/save.png';
		alertBox('Error Message','icons/error.gif',oResponse.message,400);
	}	
}


function ShowEditVideoPreviewOptions(){
	SwitchEditPreviewMethod(0);
	$('edit_video_preview_method_select').value=0;
	$('edit_video_preview_exists_row').hide();
	$('edit_video_preview_editing_row').show();
}


function CancelEditVideoPreviewOptions(){
	$('edit_video_preview_editing_row').hide();
	$('edit_video_preview_exists_row').show();
	SwitchEditPreviewMethod(0);
}

function SwitchEditPreviewMethod(method){
	switch(method){
		case "1": // Upload
			$('edit_preview_method_download').hide();
			$('edit_preview_method_hotlink').hide();
			$('edit_preview_method_capture').hide();
			
			CancelPreviewUpload();
			$('edit_preview_method_upload').show();			
		break;
		case "2": // Download
			$('edit_preview_method_upload').hide();
			$('edit_preview_method_hotlink').hide();
			$('edit_preview_method_capture').hide();
			
			CancelPreviewDownload();
			$('edit_preview_method_download').show();			
		break;
		case "3": // Hotlink
			$('edit_preview_method_upload').hide();
			$('edit_preview_method_download').hide();
			$('edit_preview_method_capture').hide();
			
			CancelPreviewHotlink();
			$('edit_preview_method_hotlink').show();			
		break;
		case "4": // Hotlink
			$('edit_preview_method_upload').hide();
			$('edit_preview_method_download').hide();
			$('edit_preview_method_hotlink').hide();
			
			CancelPreviewCapture();
			$('edit_preview_method_capture').show();			
		break;
		default:
			$('edit_preview_method_upload').hide();
			$('edit_preview_method_download').hide();
			$('edit_preview_method_hotlink').hide();
			$('edit_preview_method_capture').hide();
		break;
	}
}

function CancelPreviewUpload(){
	$('save_uploaded_preview').hide();
	$('save_uploaded_preview_disabled').show();
	$('edit_video_preview_name_uploaded').value='';
}

function CancelPreviewDownload(){
	$('edit_downloaded_preview_button').hide();
	$('edit_downloaded_preview_button_disabled').show();
	
	$('save_downloaded_preview').hide();
	$('save_downloaded_preview_disabled').show();
}

function CancelPreviewHotlink(){
	$('edit_video_preview_name_hotlink').value='';
	$('save_hotlinked_preview').hide();
	$('save_hotlinked_preview_disabled').show();
}

function CancelPreviewCapture(){
	$('edit_captured_preview_button').hide();
	$('edit_captured_preview_button_disabled').show();
	$('edit_video_preview_name_captured').value="";
		
	$('save_captured_preview').hide();
	$('save_captured_preview_disabled').show();
}

function SubmitPreviewUploadForm(){
	// Validating file type (allowing only JPG, GIF and PNG.)
	var file=$('edit_video_preview_name').value;
	if(file){
		var ext=file.substr(file.length - 4).replace(".","").toLowerCase();
		if(ext=="jpg" || ext=="png" || ext=="gif"){
			$('edit_video_preview_upload_button_img').src="images/loading.gif";
			$('edit_video_preview_upload_button_text').innerHTML="Uploading...";
			$('edit_video_preview_upload_form').submit();
		} else {
			alertBox('Error Message','icons/error.gif','<b>Invalid file format.</b><br>Only JPG, PNG and GIF formats allowed.',400);	
		}
	}
}

function PreviewUploadedOk(filename){
	$('edit_video_preview_name_uploaded').value=filename;
	$('edit_video_preview_name').value='';
	$('edit_video_preview_upload_button_img').src='images/icons/success.png';
	$('edit_video_preview_upload_button_text').innerHTML='Uploaded!';
		
	$('save_uploaded_preview_link').rel="Save the uploaded preview image: <b>"+filename+"</b><br><b>Warning:</b> you won't be able to restore the old one.";
	ReTip('save_uploaded_preview_link');
	
	setTimeout("$('edit_video_preview_upload_button_img').src='images/icons/upload.png';",4000);
	setTimeout("$('edit_video_preview_upload_button_text').innerHTML='Browse...';",4000);
	
	$('save_uploaded_preview_disabled').hide();
	$('save_uploaded_preview').show();
}

function SaveVideoUploadedPreview(){
	var x=confirm("Are you sure you want to save the uploaded Preview Image? You won't be able to reverse this action");
	if(x){
		var video_id=$('edit_id').value;
		var filename=$('edit_video_preview_name_uploaded').value;
		
		if(filename==""){
			alertBox('Error Message','icons/error.gif','<b>Cannot save Preview Image.</b><br>Upload a file first.',300);	
		} else {
			if(video_id){
				ExecAjax("actions/videos/save_uploaded_preview.php","video_id="+video_id+"&filename="+escape(filename),"","$('save_uploaded_preview_icon').src='images/loading.gif';","EvalSaveVideoUploadedPreview(transport.responseText);","",true,"");
			}
		}
	}
}

function EvalSaveVideoUploadedPreview(response){
	oResponse=response.evalJSON();
	if(oResponse.success==true){
		$('save_uploaded_preview_icon').src='images/icons/success.png';
		setTimeout("$('save_uploaded_preview_icon').src='images/icons/save.png';",2000);
		setTimeout("CancelEditVideoPreviewOptions();",2000);
		
		$('edit_video_success_msg_media').innerHTML="Image successfuly saved";
		OpenLayer('edit_video_success_msg_media');
		
		$('edit_preview_image_link').rel='<img src="../previews/'+oResponse.filename+'">';
		$('edit_preview_image_link').className="";	
		ReTip('edit_preview_image_link');		
	} else {
		$('save_uploaded_preview_icon').src='images/icons/save.png';
		alertBox('Error Message','icons/error.gif',oResponse.message,400);
	}
}

function DeletePreviewImage(){
	var x=confirm("Are you sure you want to Delete the Preview Image? You won't be able to reverse this action.");
	if(x){
		var video_id=$('edit_id').value;		
		if(video_id){
			ExecAjax("actions/videos/delete_preview.php","video_id="+video_id,"$('edit_delete_preview_icon').src='images/loading.gif';","","EvalDeletePreviewImage(transport.responseText);","",true,"");
		}
	}
}

function EvalDeletePreviewImage(response){
	oResponse=response.evalJSON();
	if(oResponse.success==true){
		$('edit_delete_preview_icon').src='images/icons/success.png';
		setTimeout("$('edit_delete_preview_icon').src='images/icons/delete.png';",3000);
		
		$('edit_preview_image_link').rel='<b>No Preview Image.</b><br>Edit to Add.';
		$('edit_preview_image_link').className="disabled";
		ReTip('edit_preview_image_link');
		
		$('edit_video_success_msg_media').hide();
	} else {
		$('edit_delete_preview_icon').src='images/icons/delete.png';
		alertBox('Error Message','icons/error.gif',oResponse.message,400);
	}
}


function DownloadPreview(){
	var url=$('edit_video_preview_name_downloaded').value;
	var ext=url.substr(url.length - 4).replace(".","").toLowerCase();
	
	if(url==""){
		alertBox('Error Message','icons/error.gif','<b>Cannot download Preview Image.</b><br>Provide an URL of the image you want to download.',300);	
	} else if(!url.match(/^https?:\/\//i)) {
		alertBox('Error Message','icons/error.gif','<b>Cannot download Preview Image.</b><br>URL of the video is invalid. It should be a complete URL, pointing to the file.',450);
	} else if(ext!="jpg" && ext!="gif" && ext!="png"){
		alertBox('Error Message','icons/error.gif','<b>Invalid file format.</b><br>Only JPG, GIF and PNG formats allowed.',400);	
	} else {
		ExecAjax("actions/videos/preview_download.php","url="+escape(url),"$('edit_download_preview_icon').src='images/loading.gif';","","EvalDownloadPreview(transport.responseText);","",true,"",60); // Timout 60 seconds (1 min).
	}
}

function EvalDownloadPreview(response){
	oResponse=response.evalJSON();
	if(oResponse.success==true){
		$('edit_download_preview_icon').src='images/icons/success.png';
		setTimeout("$('edit_download_preview_icon').src='images/icons/download.png';",4000);
		
		$('save_downloaded_preview_link').rel="Save the uploaded preview image: <b>"+oResponse.filename+"</b><br><b>Warning:</b> you won't be able to restore the old image.";
		ReTip('save_downloaded_preview_link');

		$('save_downloaded_preview_disabled').hide();
		$('save_downloaded_preview').show();
	} else {
		$('edit_download_preview_icon').src='images/icons/download.png';
		alertBox('Error Message','icons/error.gif',oResponse.message,500);
	}
}

function SaveDownloadedPreview(){
	var x=confirm("Are you sure you want to save the Preview Image? You won't be able to reverse this action");
	if(x){
		var video_id=$('edit_id').value;
		var filename=$('edit_video_preview_name_downloaded').value;
		
		if(filename==""){
			alertBox('Error Message','icons/error.gif','<b>Cannot save Preview Image.</b><br>Download a file first.',300);	
		} else {
			if(video_id){
				ExecAjax("actions/videos/save_uploaded_preview.php","video_id="+video_id+"&filename="+escape(filename),"$('save_downloaded_video_icon').src='images/loading.gif';","","EvalSaveDownloadedPreview(transport.responseText);","",true,"");
			}
		}
	}
}

function EvalSaveDownloadedPreview(response){
	oResponse=response.evalJSON();
	if(oResponse.success==true){
		$('save_downloaded_preview_icon').src='images/icons/success.png';
		setTimeout("$('save_downloaded_preview_icon').src='images/icons/save.png';",2000);
		setTimeout("CancelEditVideoPreviewOptions();",2000);
		
		$('edit_video_success_msg_media').innerHTML="Image successfuly saved";
		OpenLayer('edit_video_success_msg_media');
		
		$('edit_preview_image_link').rel='<img src="../previews/'+oResponse.filename+'">';
		$('edit_preview_image_link').className="";
		ReTip('edit_preview_image_link');		
	} else {
		$('save_downloaded_preview_icon').src='images/icons/save.png';
		alertBox('Error Message','icons/error.gif',oResponse.message,400);
	}
}

function SavePreviewHotlinked(){
	var video_id=$('edit_id').value;
	var filename=$('edit_video_preview_name_hotlink').value;
	var ext=filename.substr(filename.length - 4).replace(".","").toLowerCase();
	
	if(filename.match(/^https?:\/\//i) && (ext=="jpg" || ext=="gif" || ext=="png") ){
		ExecAjax("actions/videos/update_video_preview.php","video_id="+video_id+"&filename="+escape(filename),"$('save_hotlinked_preview_icon').src='images/loading.gif';","","EvalSavePreviewHotlinked(transport.responseText);","",true,"");
	} else {
		$('save_hotlinked_video').hide();
		$('save_hotlinked_video_disabled').show();
		alertBox('Error Message','icons/error.gif','<b>Cannot save Video.</b><br>Make sure the file points to a valid url and the format of the image is JPG, GIF or PNG.',450);	
	}
}

function EvalSavePreviewHotlinked(response){
	oResponse=response.evalJSON();
	if(oResponse.success==true){
		$('save_hotlinked_preview_icon').src='images/icons/success.png';
		setTimeout("$('save_hotlinked_preview_icon').src='images/icons/save.png';",2000);
		setTimeout("CancelEditVideoPreviewOptions();",2000);
		
		$('edit_video_success_msg_media').innerHTML="Image successfuly saved";
		OpenLayer('edit_video_success_msg_media');
		
		$('edit_preview_image_link').rel='<img src="'+oResponse.filename+'">';
		$('edit_preview_image_link').className="";
		ReTip('edit_preview_image_link');		
	} else {
		$('save_hotlinked_preview_icon').src='images/icons/save.png';
		alertBox('Error Message','icons/error.gif',oResponse.message,400);
	}	
}

function GetRandomVideoFrame(){
	var video_id=$('edit_id').value;
	ExecAjax("actions/videos/capture_frame.php","video_ids=["+video_id+"]&random=1","$('random_video_frame_icon').src='images/loading.gif';","","EvalGetRandomVideoFrame(transport.responseText);","",true,"");
}

function EvalGetRandomVideoFrame(response){
	oResponse=response.evalJSON();
	if(oResponse.success==true){
		$('random_video_frame_icon').src='images/icons/success.png';
		setTimeout("$('random_video_frame_icon').src='images/icons/video_frame_auto.png';",3000);
		
		$('edit_video_preview_name_captured').value=oResponse.filename;
		$('edit_captured_preview_link').rel='<div style="width:'+oResponse.width+'px;"><img src="'+oResponse.filename+'"></div>';
		$('edit_captured_preview_link').className="";
		ReTip('edit_captured_preview_link');
		
		$('edit_captured_preview_button_disabled').hide();
		$('edit_captured_preview_button').show();
		
		$('save_captured_preview_disabled').hide();
		$('save_captured_preview').show();
	} else {
		$('random_video_frame_icon').src='images/icons/video_frame_auto.png';
		alertBox('Error Message','icons/error.gif',oResponse.message,400);	
	}
}

function SaveCapturedPreview(){
	var video_id=$('edit_id').value;
	var filename=$('edit_video_preview_name_captured').value;
	filename=filename.replace(/\?[0-9]*/i,"");

	if(filename!=""){
		ExecAjax("actions/videos/save_uploaded_preview.php","video_id="+video_id+"&filename="+escape(filename),"$('save_captured_preview_icon').src='images/loading.gif';","","EvalSaveCapturedPreview(transport.responseText);","",true,"");
	} else {
		$('save_captured_preview').hide();
		$('save_captured_preview_disabled').show();
		alertBox('Error Message','icons/error.gif','<b>Cannot save Preview.</b><br>Make sure you have captured a frame from the video.',450);	
	}	
}

function EvalSaveCapturedPreview(response){
	oResponse=response.evalJSON();
	if(oResponse.success==true){
		$('save_captured_preview_icon').src='images/icons/success.png';
		setTimeout("$('save_captured_preview_icon').src='images/icons/save.png';",2000);
		setTimeout("CancelEditVideoPreviewOptions();",2000);
		
		$('edit_video_success_msg_media').innerHTML="Image successfuly saved";
		OpenLayer('edit_video_success_msg_media');
		
		$('edit_preview_image_link').rel='<div style="width:'+$('real_width').value+'px;"><img src="../previews/'+oResponse.filename+'"></div>';
		$('edit_preview_image_link').className="";
		ReTip('edit_preview_image_link');
	} else {
		$('save_captured_preview_icon').src='images/icons/save.png';
		alertBox('Error Message','icons/error.gif',oResponse.message,400);
	}	
}

function OpenFrameSelector(mode){
	var video_id=$('edit_id').value;
	if(mode=="thumbs"){
		var image="capture_video_frame_thumbs_icon"	
	} else {
		var image="capture_video_frame_icon";
	}
	ExecAjax("actions/videos/get_video_ffmpeg_info.php","video_id="+video_id,"$('"+image+"').src='images/loading.gif';","","EvalOpenFrameSelector(transport.responseText,'"+mode+"');","",true,"");	
}

function EvalOpenFrameSelector(response,mode){
	oResponse=response.evalJSON();
	if(oResponse.success==true){
		if(mode=="thumbs"){
			var image="capture_video_frame_thumbs_icon"	
		} else {
			var image="capture_video_frame_icon";
		}
	
		$(image).src='images/icons/video_frame.png';
		
		var video_id=$('edit_id').value;
		var aData={"total_frames":oResponse.total_frames,"total_secs":oResponse.total_secs,"width":oResponse.width,"height":oResponse.height};
		
		aData.total_frames=aData.total_secs*2; // forcing the total frames cause we didn't extract all frames (only 2 per second).
		$('total_frames').innerHTML = aData.total_frames;
		
		// Values of the original width and height of the video.
		$('real_width').value=aData.width;
		$('real_height').value=aData.height;
		
		var time=aData.total_secs;
		var minutes=Math.floor(time/60);
		if(time>60){
			var seconds=time%60;
		} else {
			var seconds=time;	
		}
		if(minutes<10) minutes="0"+minutes;
		if(seconds<10) seconds="0"+seconds;
		var show_time=minutes+":"+seconds;
		$('total_time').innerHTML = show_time;
		
		if(mode=="thumbs"){
			$('frame_editor_save_preview_div').hide();
			$('frame_editor_add_thumb_div').show();
			$('frame_editor_captured_thumbs_preview').innerHTML='';
			$('frame_editor_captured_thumbs_preview').show();
			
			$('frame_editor_captured_thumbs_instructions').show();
			$('frame_editor_captured_thumbs_save_div').show();
		} else {
			$('frame_editor_add_thumb_div').hide();
			$('frame_editor_save_preview_div').show();
			$('frame_editor_captured_thumbs_preview').innerHTML='';
			$('frame_editor_captured_thumbs_preview').hide();
			
			$('frame_editor_captured_thumbs_instructions').hide();
			$('frame_editor_captured_thumbs_save_div').hide();
		}

		$('frame_editor_save_button').hide();
		$('frame_editor_save_button_disabled').show();
		
		$('frame_editor_add_thumb_button').hide();
		$('frame_editor_add_thumb_button_disabled').show();
		
		LoadFrameSelectorSlider(video_id,aData);
		CreateFramePreview(1);
		LoadAdjustmentSliders();
		thumb_uploads=[];

		$('frame_selector_crop_image').checked=false;
		$('frame_editor_crop_button').hide();
		$('frame_editor_crop_button_disabled').show();
		if(cropper) cropper.remove();
		
		$('frame_editor_adjustments_button').hide();
		$('frame_editor_adjustments_button_disabled').show();
	
		$('frame_editor_restore_button').hide();
		$('frame_editor_restore_button_disabled').show();
		
		OpenLayer('frame_selector_layer');
	} else {
		if(mode=="thumbs"){
			var image="capture_video_frame_thumbs_icon"	
		} else {
			var image="capture_video_frame_icon";
		}
		$(image).src='images/icons/video_frame.png';
		alertBox('Error Message','icons/error.gif',oResponse.message,400);
	}
}

function LoadFrameSelectorSlider(id,aData){
	if(!slider_cache[id]) slider_cache[id]=aData;
	
	var array_values=[];	
	for(i=1;i<=aData.total_frames;i++){
		array_values[i]=i;
	}
	
	if(slider==""){
		slider=new Control.Slider('frame_selector_pointer','frame_selector_slider',{
			range:			$R(1,aData.total_frames),
			values:			array_values,
			sliderValue:	1,
			onSlide:		function(v){FrameTime(v,aData.total_frames,aData.total_secs); ThumbnailPreviewReTip(id,v);},
			onChange:		function(v){FrameTime(v,aData.total_frames,aData.total_secs); CreateFramePreview(v,aData.total_frames,aData.total_secs);}
		});
	} else {
		create_allowed=0;
		slider.initialize('frame_selector_pointer','frame_selector_slider',{
			range:			$R(1, aData.total_frames),
			values:			array_values,
			sliderValue:	1,
			onSlide:		function(v){FrameTime(v,aData.total_frames,aData.total_secs); ThumbnailPreviewReTip(id,v); create_allowed=1},
			onChange:		function(v){FrameTime(v,aData.total_frames,aData.total_secs); if(create_allowed==1) CreateFramePreview(v,aData.total_frames,aData.total_secs);}
		});
	}
}

function ThumbnailPreviewReTip(video_id, frame){
	$('frame_selector_slider_thumb_preview').innerHTML='<img src="temp/'+video_id+'_'+frame+'.jpg" height="50">';
}

function LoadAdjustmentSliders(){
	if(!brightness_slider){brightness_slider=new Control.Slider('frame_selector_brightness_pointer','frame_selector_brightness_slider',{range: $R(-100,100), values:[-100,-90,-80,-70,-60,-50,-40,-30,-20,-10,0,10,20,30,40,50,60,70,80,90,100], sliderValue:"0", onSlide: function(v){UpdateSliderValue(1,v)}, onChange:function(v){UpdateSliderValue(1,v); if(reseted==0) ImageAdjustment()} }); }
	if(!contrast_slider){contrast_slider=new Control.Slider('frame_selector_contrast_pointer','frame_selector_contrast_slider',{range: $R(-100,100), values:[-100,-90,-80,-70,-60,-50,-40,-30,-20,-10,0,10,20,30,40,50,60,70,80,90,100], sliderValue:"0", onSlide: function(v){UpdateSliderValue(2,v)}, onChange:function(v){UpdateSliderValue(2,v); if(reseted==0) ImageAdjustment()} });}
	if(!sharpness_slider){sharpness_slider=new Control.Slider('frame_selector_sharpness_pointer','frame_selector_sharpness_slider',{range: $R(-100,100), values:[-100,-90,-80,-70,-60,-50,-40,-30,-20,-10,0,10,20,30,40,50,60,70,80,90,100], sliderValue:"0", onSlide: function(v){UpdateSliderValue(3,v)}, onChange:function(v){UpdateSliderValue(3,v); if(reseted==0) ImageAdjustment()} }); }
	ResetAdjustmentSliders();
}

function ResetAdjustmentSliders(){
	reseted=1;
	setSliderValue(brightness_slider,0);
	setSliderValue(contrast_slider,0);
	setSliderValue(sharpness_slider,0);
	reseted=0;

	$('frame_editor_adjustments_button').hide();
	$('frame_editor_adjustments_button_disabled').show();
}

function setSliderValue(sliderid,value){
	sliderid.setValue(value);
}

function UpdateSliderValue(type,v){
	if(v==0) v="0";
	if(type==1){
		$('brightness_value').innerHTML=v;
	} else if(type==2){
		$('contrast_value').innerHTML=v;
	} else {
		$('sharpness_value').innerHTML=v;
	}
}

function FrameTime(v,total_frames,total_secs){
	$('current_frame').innerHTML = Math.ceil(v);

	var time=Math.ceil(v*total_secs/total_frames);
	var minutes=Math.floor(time/60);
	if(time>60){
		var seconds=time%60;
	} else {
		var seconds=time;	
	}

	if(minutes<10) minutes="0"+minutes;
	if(seconds<10) seconds="0"+seconds;
	
	var show_time=minutes+":"+seconds;
	$('current_time').innerHTML =show_time;
}

function CreateFramePreview(v){
	v_fixed=parseInt(v);
	var id=$('edit_id').value;
	
	if(!images_cache[id]) images_cache[id]=[];
	if(!images_cache[id][v_fixed]){
		ExecAjax("actions/videos/capture_frame.php","video_ids=["+id+"]&random=0&frame="+v_fixed,"$('frame_selector_preview_image').className='disabled';","","EvalCreateFramePreview(transport.responseText,'"+v_fixed+"');","",true,"");
	} else {
		$('frame_selector_preview_image').src=images_cache[id][v_fixed];
		$('frame_selector_original_image').value=images_cache[id][v_fixed];
		$('frame_selector_working_image').value=images_cache[id][v_fixed];
		$('frame_selector_temp_image').value=images_cache[id][v_fixed];
		$('real_width').value=images_cache[id]['width'];
		$('real_height').value=images_cache[id]['height'];
		
		ResetAdjustmentSliders();
		
		$('frame_editor_save_button_disabled').hide();
		$('frame_editor_save_button').show();
		
		$('frame_editor_add_thumb_button_disabled').hide();
		$('frame_editor_add_thumb_button').show();
	}
}

function EvalCreateFramePreview(response,v){
	oResponse=response.evalJSON();
	if(oResponse.success==true){
		var id=$('edit_id').value;
		$('frame_selector_preview_image').src=oResponse.filename;
		$('frame_selector_original_image').value=oResponse.filename;
		$('frame_selector_working_image').value=oResponse.filename;
		$('frame_selector_temp_image').value=oResponse.filename;
		$('frame_selector_preview_image').className='';
		$('real_width').value=oResponse.width;
		$('real_height').value=oResponse.height;
		
		images_cache[id][v]=oResponse.filename;
		images_cache[id]['width']=oResponse.width;
		images_cache[id]['height']=oResponse.height;
		
		ResetAdjustmentSliders();
		
		$('frame_editor_save_button_disabled').hide();
		$('frame_editor_save_button').show();
		
		$('frame_editor_add_thumb_button_disabled').hide();
		$('frame_editor_add_thumb_button').show();
	} else {
		alertBox('Error Message','icons/error.gif',oResponse.message,400);
	}
}

function RestoreOriginal(){
	$('frame_selector_preview_image').src=$('frame_selector_original_image').value;
	$('frame_selector_working_image').value=$('frame_selector_original_image').value;

	$('frame_editor_restore_button').hide();
	$('frame_editor_restore_button_disabled').show();
	
	/* $('frame_editor_save_button').hide();
	$('frame_editor_save_button_disabled').show();
	
	$('frame_editor_add_thumb_button').hide();
	$('frame_editor_add_thumb_button_disabled').show();
	*/
		
	adjustments_cache=[];
	ResetAdjustmentSliders();
}

function LoadCropper(v,w,h){
	if(!cropper) cropper=new Cropper.Img('frame_selector_preview_image', {minWidth:80, minHeight:60, ratioDim:{x:w,y:h},displayOnInit:true,onEndCrop:setDimensions} );
	if(v==true){
		if(cropper) cropper.reset();
		$('frame_editor_crop_button_disabled').hide();
		$('frame_editor_crop_button').show();
	} else {
		if(cropper) cropper.remove();
		$('frame_editor_crop_button').hide();
		$('frame_editor_crop_button_disabled').show();
	}
}

function FinishCropper(){
	if(cropper) cropper.remove();
	cropper="";
	$('frame_selector_crop_image').checked=false;
	$('frame_editor_crop_button').hide();
	$('frame_editor_crop_button_disabled').show();
}

function setDimensions(coords,dimensions){
	$('cropped_x1').value=coords.x1;
	$('cropped_y1').value=coords.y1;
	$('cropped_x2').value=coords.x2;
	$('cropped_y2').value=coords.y2;
	$('cropped_width').value=dimensions.width;
	$('cropped_height').value=dimensions.height;
}

function CropThumb(type){
	var filename=$('frame_selector_working_image').value;
	var x1=$('cropped_x1').value;
	var y1=$('cropped_y1').value;
	var cw=$('cropped_width').value;
	var ch=$('cropped_height').value;
	var rw=$('real_width').value
	var rh=$('real_height').value
	
	if($('frame_selector_crop_image').checked==true){
		ExecAjax("actions/videos/crop_image.php","type="+type+"&filename="+escape(filename)+"&cw="+cw+"&ch="+ch+"&rw="+rw+"&rh="+rh+"&x1="+x1+"&y1="+y1,"$('frame_selector_preview_image').className='disabled';","","EvalCropThumb(transport.responseText)","",true);	
	}
}

function EvalCropThumb(response){
	oResponse=response.evalJSON();
	if(oResponse.success==true){
		$('frame_selector_preview_image').className='';
		$('frame_selector_preview_image').src=oResponse.filename;
		$('frame_selector_working_image').value=oResponse.filename;
		$('frame_selector_temp_image').value=oResponse.filename;
		$('real_width').value=oResponse.width;
		$('real_height').value=oResponse.height;

		if(cropper) cropper.remove();
		$('frame_selector_crop_image').checked=false;
		$('frame_editor_crop_button').hide();
		$('frame_editor_crop_button_disabled').show();
		
		$('frame_editor_save_button_disabled').hide();
		$('frame_editor_save_button').show();		
		
		$('frame_editor_restore_button_disabled').hide();
		$('frame_editor_restore_button').show();		
	
		ResetAdjustmentSliders();
		adjustments_cache=[];
	} else {
		alertBox('Error Message','icons/error.gif',oResponse.message,400);
		$('frame_selector_preview_image').className='';
	}
}

function ImageAdjustment(){
	var id=$('edit_id').value;
	var frame=parseInt($('current_frame').innerHTML);
	var filename=$('frame_selector_working_image').value;
	var b=parseInt($('brightness_value').innerHTML);
	var c=parseInt($('contrast_value').innerHTML);
	var s=parseInt($('sharpness_value').innerHTML);

	if(adjustments_cache[id+'_'+frame+'_'+b+'_'+c+'_'+s]){
		EvalImageAdjustment('{"success":true,"filename":"'+adjustments_cache[id+'_'+frame+'_'+b+'_'+c+'_'+s]+'"}');
	} else {
		ExecAjax("actions/videos/apply_adjustment.php","filename="+escape(filename)+"&id="+id+"&frame="+frame+"&b_value="+b+"&c_value="+c+"&s_value="+s,"$('frame_selector_preview_image').className='disabled';","","EvalImageAdjustment(transport.responseText)","",true);	
	}
}

function EvalImageAdjustment(response){
	oResponse=response.evalJSON();
	if(oResponse.success==true){
		var id=$('edit_id').value;
		var frame=parseInt($('current_frame').innerHTML);
		var b=parseInt($('brightness_value').innerHTML);
		var c=parseInt($('contrast_value').innerHTML);
		var s=parseInt($('sharpness_value').innerHTML);
		
		if(!adjustments_cache[id+'_'+frame+'_'+b+'_'+c+'_'+s]){
			adjustments_cache[id+'_'+frame+'_'+b+'_'+c+'_'+s]=oResponse.filename;
		}
		$('frame_selector_preview_image').className='';
		$('frame_selector_preview_image').src=oResponse.filename;
		$('frame_selector_temp_image').value=oResponse.filename;
		
		$('frame_editor_adjustments_button_disabled').hide();
		$('frame_editor_adjustments_button').show();
	} else {
		alertBox('Error Message','icons/error.gif',oResponse.message,400);
		$('frame_selector_preview_image').className='';
		ResetAdjustmentSliders();
	}
}

function ApplyAdjustments(){
	$('frame_selector_working_image').value=$('frame_selector_temp_image').value;
	
	$('frame_editor_save_button_disabled').hide();
	$('frame_editor_save_button').show();		
	$('frame_editor_restore_button_disabled').hide();
	$('frame_editor_restore_button').show();
	
	ResetAdjustmentSliders();
	adjustments_cache=[];
}

function SaveEditedPreview(){
	var video_id=$('edit_id').value;
	var filename=$('frame_selector_working_image').value;
	// filename=filename.replace(/\?[0-9]*/i,"");

	if(filename!=""){
		$('edit_video_preview_name_captured').value=filename;
		$('edit_captured_preview_link').rel='<div style="width:'+$('real_width').value+'px;"><img src="'+filename+'"></div>';
		$('edit_captured_preview_link').className="";
		ReTip('edit_captured_preview_link');
		
		$('edit_captured_preview_button_disabled').hide();
		$('edit_captured_preview_button').show();
		
		$('save_captured_preview_disabled').hide();
		$('save_captured_preview').show();
		
		CloseLayer('frame_selector_layer');
	} else {
		alertBox('Error Message','icons/error.gif','<b>Cannot use this Preview.</b><br>Make sure you have selected a frame from the video.',450);	
	}	
}




function ShowEditVideoThumbsOptions(){
	SwitchEditThumbsMethod(0);
	$('edit_video_thumbs_method_select').value=0;
	$('edit_video_thumbs_exists_row').hide();
	$('edit_video_thumbs_editing_row').show();
}


function CancelEditVideoThumbsOptions(){
	$('edit_video_thumbs_editing_row').hide();
	$('edit_video_thumbs_exists_row').show();
	SwitchEditThumbsMethod(0);
}

function SwitchEditThumbsMethod(method){
	switch(method){
		case "1": // Upload
			$('edit_thumbs_method_download').hide();
			$('edit_thumbs_method_hotlink').hide();
			$('edit_thumbs_method_capture').hide();
			
			CancelThumbsUpload();
			$('edit_thumbs_method_upload').show();			
		break;
		case "2": // Download
			$('edit_thumbs_method_upload').hide();
			$('edit_thumbs_method_hotlink').hide();
			$('edit_thumbs_method_capture').hide();
			
			CancelThumbsDownload();
			$('edit_thumbs_method_download').show();			
		break;
		case "3": // Hotlink
			$('edit_thumbs_method_upload').hide();
			$('edit_thumbs_method_download').hide();
			$('edit_thumbs_method_capture').hide();
			
			CancelThumbsHotlink();
			$('edit_thumbs_method_hotlink').show();			
		break;
		case "4": // Hotlink
			$('edit_thumbs_method_upload').hide();
			$('edit_thumbs_method_download').hide();
			$('edit_thumbs_method_hotlink').hide();
			
			CancelThumbsCapture();
			$('edit_thumbs_method_capture').show();			
		break;
		default:
			$('edit_thumbs_method_upload').hide();
			$('edit_thumbs_method_download').hide();
			$('edit_thumbs_method_hotlink').hide();
			$('edit_thumbs_method_capture').hide();
		break;
	}
}

function CancelThumbsUpload(){
	$('edit_video_uploaded_thumb_name').value='';
	$('save_uploaded_thumbs').hide();
	$('save_uploaded_thumbs_disabled').show();
	$('edit_video_uploaded_thumbs_preview').innerHTML='';	
	thumb_uploads=[];
}

function CancelThumbsDownload(){
	$('edit_video_thumb_name_downloaded').value='';
	$('edit_downloaded_thumb_button').hide();
	$('edit_downloaded_thumb_button_disabled').show();
	
	$('edit_video_downloaded_thumbs_preview').innerHTML='';	
	
	$('save_downloaded_thumbs').hide();
	$('save_downloaded_thumbs_disabled').show();
	thumb_uploads=[];
}

function CancelThumbsHotlink(){
	$('edit_video_thumb_name_hotlink').value='';
	$('save_hotlinked_thumbs').hide();
	$('save_hotlinked_thumbs_disabled').show();
	
	$('edit_video_hotlinked_thumbs_preview').innerHTML='';
	thumb_uploads=[];
}

function CancelThumbsCapture(){
	$('save_captured_thumbs').hide();
	$('save_captured_thumbs_disabled').show();
	
	$('edit_video_captured_thumbs_preview').innerHTML='';
	thumb_uploads=[];
}

function SubmitThumbsUploadForm(){
	// Validating file type (allowing only JPG, GIF, PNG.)
	var file=$('edit_video_uploaded_thumb_name').value;
	if(file){
		var ext=file.substr(file.length - 4).replace(".","").toLowerCase();
		if(ext=="jpg" || ext=="png" || ext=="gif"){
			$('edit_video_thumbs_upload_button_img').src="images/loading.gif";
			$('edit_video_thumbs_upload_button_text').innerHTML="Uploading...";
			$('edit_video_thumbs_upload_form').submit();
		} else {
			alertBox('Error Message','icons/error.gif','<b>Invalid file format.</b><br>Only JPG, PNG and GIF formats allowed.',400);	
		}
	}
}

function ThumbUploadedOk(filename){
	var video_id=$('edit_id').value;
	$('edit_video_uploaded_thumb').value=filename;
	$('edit_video_uploaded_thumb_name').value='';
	$('edit_video_thumbs_upload_button_img').src='images/icons/success.png';
	$('edit_video_thumbs_upload_button_text').innerHTML='Uploaded!';
	
	setTimeout("$('edit_video_thumbs_upload_button_img').src='images/icons/upload.png';",2000);
	setTimeout("$('edit_video_thumbs_upload_button_text').innerHTML='Browse...';",2000);
	
	if(!thumb_uploads[video_id]) thumb_uploads[video_id]=0;
	thumb_uploads[video_id]=thumb_uploads[video_id]+1;
	
	var newThumb=document.createElement('div');
	newThumb.id="thumb_preview_"+thumb_uploads[video_id]+"_div";
	newThumb.className="option_button left";
	newThumb.innerHTML='<input type="hidden" id="thumb_'+thumb_uploads[video_id]+'" value="'+filename+'" class="thumb_preview"><a href="javascript:void(0);" rel="<img src=temp/'+filename+'><br><b>Click to Delete</b>" id="thumb_preview_'+thumb_uploads[video_id]+'" onclick="DeleteThumbPreview('+thumb_uploads[video_id]+');"><div class="thumb_delete"></div></a>';
	$('edit_video_uploaded_thumbs_preview').appendChild(newThumb);

	ReTip('thumb_preview_'+thumb_uploads[video_id]);
	
	$('save_uploaded_thumbs_disabled').hide();
	$('save_uploaded_thumbs').show();
}

function DeleteThumbPreview(thumb_id){
	var x=confirm("Are you sure you want to delete this uploaded thumbnail?");
	if(x){
		$('thumb_preview_'+thumb_id+'_div').remove();
	}
}

function SaveVideoUploadedThumbs(){
	var video_id=$('edit_id').value;
	
	var thumbs_string="";
	$$('.thumb_preview').each(function(element){
		 thumbs_string=thumbs_string+"&thumbs[]="+element.value;
	});
	if($$('.thumb_preview').length>0){
		ExecAjax("actions/videos/save_uploaded_thumbs.php","video_id="+video_id+thumbs_string,"$('save_uploaded_thumbs_icon').src='images/loading.gif';","","EvalSaveVideoUploadedThumbs(transport.responseText)","",true);	
	} else {
		alertBox('Error Message','icons/error.gif',"Please, add at least one thumbnail.",300);	
	}
}

function EvalSaveVideoUploadedThumbs(response){
	oResponse=response.evalJSON();
	if(oResponse.success==true){
		$('refresh_on_close').value='1';
		$('save_uploaded_thumbs_icon').src='images/icons/success.png';
		setTimeout("$('save_uploaded_thumbs_icon').src='images/icons/success.png';",2000);
		setTimeout("CancelEditVideoThumbsOptions();",2000);
		var video_id=$('edit_id').value;
		thumbs_cache[video_id]="";
		
		$('edit_video_success_msg_media').innerHTML="Images successfuly saved";
		OpenLayer('edit_video_success_msg_media');
		
		UpdateThumbsTip(oResponse.aThumbs);
	} else {
		alertBox('Error Message','icons/error.gif',oResponse.message,400);
	}	
}


function DownloadThumb(){
	var url=$('edit_video_thumb_name_downloaded').value;
	var ext=url.substr(url.length - 4).replace(".","").toLowerCase();
	
	if(url==""){
		alertBox('Error Message','icons/error.gif','<b>Cannot download Image.</b><br>Provide an URL of the image you want to download.',300);	
	} else if(!url.match(/^https?:\/\//i)) {
		alertBox('Error Message','icons/error.gif','<b>Cannot download Image.</b><br>URL of the video is invalid. It should be a complete URL, pointing to the file.',450);
	} else if(ext!="jpg" && ext!="gif" && ext!="png"){
		alertBox('Error Message','icons/error.gif','<b>Invalid file format.</b><br>Only JPG, GIF and PNG formats allowed.',400);
	} else {
		ExecAjax("actions/videos/preview_download.php","url="+escape(url),"$('edit_downloaded_thumb_icon').src='images/loading.gif';","","EvalDownloadThumb(transport.responseText);","",true,"",90); // Timout 90 seconds (1.5 min).
	}
}

function EvalDownloadThumb(response){
	var video_id=$('edit_id').value;
	oResponse=response.evalJSON();
	if(oResponse.success==true){
		$('edit_downloaded_thumb_icon').src='images/icons/success.png';
		setTimeout("$('edit_downloaded_thumb_icon').src='images/icons/download.png';",2000);
		
		if(!thumb_uploads[video_id]) thumb_uploads[video_id]=0;
		thumb_uploads[video_id]=thumb_uploads[video_id]+1;
		
		var newThumb=document.createElement('div');
		newThumb.id="thumb_preview_download_"+thumb_uploads[video_id]+"_div";
		newThumb.className="option_button left";
		newThumb.innerHTML='<input type="hidden" id="thumb_temp_'+thumb_uploads[video_id]+'" value="'+oResponse.filename+'" class="thumb_preview_download"><a href="javascript:void(0);" rel="<img src=temp/'+oResponse.filename+'><br><b>Click to Delete</b>" id="thumb_preview_'+thumb_uploads[video_id]+'" onclick="DeleteThumbPreview(\'download_'+thumb_uploads[video_id]+'\');"><div class="thumb_delete"></div></a>';
		$('edit_video_downloaded_thumbs_preview').appendChild(newThumb);
	
		ReTip('thumb_preview_'+thumb_uploads[video_id]);
	
		$('save_downloaded_thumbs_disabled').hide();
		$('save_downloaded_thumbs').show();
				
	} else {
		$('edit_download_preview_icon').src='images/icons/download.png';
		alertBox('Error Message','icons/error.gif',oResponse.message,500);
	}
}


function SaveDownloadedThumbs(){
	var video_id=$('edit_id').value;
	
	var thumbs_string="";
	$$('.thumb_preview_download').each(function(element){
		 thumbs_string=thumbs_string+"&thumbs[]="+element.value;
	});
	if($$('.thumb_preview_download').length>0){
		ExecAjax("actions/videos/save_uploaded_thumbs.php","video_id="+video_id+thumbs_string,"$('save_downloaded_thumbs_icon').src='images/loading.gif';","","EvalSaveDownloadedThumbs(transport.responseText)","",true);
	} else {
		alertBox('Error Message','icons/error.gif',"Please, add at least one thumbnail.",300);	
	}
}

function EvalSaveDownloadedThumbs(response){
	oResponse=response.evalJSON();
	if(oResponse.success==true){
		$('refresh_on_close').value='1';
		$('save_downloaded_thumbs_icon').src='images/icons/success.png';
		setTimeout("$('save_downloaded_thumbs_icon').src='images/icons/save.png';",2000);
		setTimeout("CancelEditVideoThumbsOptions();",2000);
		var video_id=$('edit_id').value;
		thumbs_cache[video_id]="";
		
		$('edit_video_success_msg_media').innerHTML="Images successfuly saved";
		OpenLayer('edit_video_success_msg_media');
		
		UpdateThumbsTip(oResponse.aThumbs);
	} else {
		alertBox('Error Message','icons/error.gif',oResponse.message,400);
	}	
}



function HotlinkThumb(){
	var video_id=$('edit_id').value;
	var url=$('edit_video_thumb_name_hotlink').value;
	var ext=url.substr(url.length - 4).replace(".","").toLowerCase();
	
	if(url==""){
		alertBox('Error Message','icons/error.gif','<b>Cannot download Image.</b><br>Provide an URL of the image you want to hotlink.',300);	
	} else if(!url.match(/^https?:\/\//i)) {
		alertBox('Error Message','icons/error.gif','<b>Cannot download Image.</b><br>URL of the video is invalid. It should be a complete URL, pointing to the file.',450);
	} else if(ext!="jpg" && ext!="gif" && ext!="png"){
		alertBox('Error Message','icons/error.gif','<b>Invalid file format.</b><br>Only JPG, GIF and PNG formats allowed.',400);
	} else {
		$('edit_hotlinked_thumb_icon').src='images/icons/success.png';
		setTimeout("$('edit_hotlinked_thumb_icon').src='images/icons/remote.png';",2000);
		
		if(!thumb_uploads[video_id]) thumb_uploads[video_id]=0;
		thumb_uploads[video_id]=thumb_uploads[video_id]+1;
		
		var newThumb=document.createElement('div');
		newThumb.id="thumb_preview_hotlink_"+thumb_uploads[video_id]+"_div";
		newThumb.className="option_button left";
		newThumb.innerHTML='<input type="hidden" id="thumb_temp_'+thumb_uploads[video_id]+'" value="'+url+'" class="thumb_preview_hotlink"><a href="javascript:void(0);" rel="<img src='+url+'><br><b>Click to Delete</b>" id="thumb_preview_'+thumb_uploads[video_id]+'" onclick="DeleteThumbPreview(\'hotlink_'+thumb_uploads[video_id]+'\');"><div class="thumb_delete"></div></a>';
		$('edit_video_hotlinked_thumbs_preview').appendChild(newThumb);
	
		ReTip('thumb_preview_'+thumb_uploads[video_id]);
	
		$('save_hotlinked_thumbs_disabled').hide();
		$('save_hotlinked_thumbs').show();
	}
}

function SaveThumbsHotlinked(){
	var video_id=$('edit_id').value;
	
	var thumbs_string="";
	$$('.thumb_preview_hotlink').each(function(element){
		 thumbs_string=thumbs_string+"&thumbs[]="+element.value;
	});
	if($$('.thumb_preview_hotlink').length>0){
		ExecAjax("actions/videos/save_hotlinked_thumbs.php","video_id="+video_id+thumbs_string,"$('save_hotlinked_thumbs_icon').src='images/loading.gif';","","EvalSaveHotlinkedThumbs(transport.responseText)","",true);
	} else {
		alertBox('Error Message','icons/error.gif',"Please, add at least one thumbnail.",300);	
	}
}

function EvalSaveHotlinkedThumbs(response){
	oResponse=response.evalJSON();
	if(oResponse.success==true){
		$('refresh_on_close').value='1';
		$('save_hotlinked_thumbs_icon').src='images/icons/success.png';
		setTimeout("$('save_hotlinked_thumbs_icon').src='images/icons/save.png';",2000);
		setTimeout("CancelEditVideoThumbsOptions();",2000);
		var video_id=$('edit_id').value;
		thumbs_cache[video_id]="";
		
		$('edit_video_success_msg_media').innerHTML="Images successfuly saved";
		OpenLayer('edit_video_success_msg_media');
		
		UpdateThumbsTip(oResponse.aThumbs);
	} else {
		alertBox('Error Message','icons/error.gif',oResponse.message,400);
	}	
}

function AutoGenerateThumbs(id){
	ExecAjax("actions/videos/capture_frame.php","video_ids=["+id+"]&random=1&mode=thumbs&autosave=1","$('autothumb_icon_"+id+"').src='images/loading.gif';","","EvalAutoGenerateThumbs(transport.responseText,'"+id+"');","",true,"");
}

function EvalAutoGenerateThumbs(response,id){
	oResponse=response.evalJSON();
	if(oResponse.success==true){
		$('autothumb_icon_'+id).src='images/icons/success.png';
		setTimeout("$('autothumb_icon_"+id+"').src='images/icons/autothumb.png';",2000);
		if(oResponse.aThumbs){
			for(i in oResponse.aThumbs){
				index=i;
				break;
			}
			$('thumb_'+id).src=oResponse.aThumbs[index];
		} else {
			$('thumb_'+id).src=oResponse.filename;
		}
		thumbs_cache[id]="";
	} else {
		$('autothumb_icon_'+id).src='images/icons/autothumb.png';
		alertBox('Error Message','icons/error.gif',oResponse.message,500);
	}	
}

function GetRandomFramesForThumbs(){
	var video_id=$('edit_id').value;
	ExecAjax("actions/videos/capture_frame.php","video_ids=["+video_id+"]&random=1&mode=thumbs","$('random_video_frame_thumbs_icon').src='images/loading.gif';","","EvalGetRandomFramesForThumbs(transport.responseText);","",true,"");
}


function EvalGetRandomFramesForThumbs(response){
	var video_id=$('edit_id').value;
	
	oResponse=response.evalJSON();
	if(oResponse.success==true){
		$('random_video_frame_thumbs_icon').src='images/icons/success.png';
		setTimeout("$('random_video_frame_thumbs_icon').src='images/icons/video_frame_auto.png';",2000);
	
		if(!oResponse.aThumbs || oResponse.aThumbs.length==0){
			oResponse.aThumbs=[];
			if(oResponse.filename) oResponse.aThumbs[0]=oResponse.filename;
		}
		
		$('edit_video_captured_thumbs_preview').innerHTML='';
		for(thumb in oResponse.aThumbs){
			if(!isNaN(thumb)){
				if(!thumb_uploads[video_id]) thumb_uploads[video_id]=0;
				thumb_uploads[video_id]=thumb_uploads[video_id]+1;
				
				if(oResponse.aThumbs[thumb].match(/^temp\//)) {
					oResponse.aThumbs[thumb]=oResponse.aThumbs[thumb].replace("temp/","");
				}
							
				var newThumb=document.createElement('div');
				newThumb.id="thumb_preview_captured_"+thumb_uploads[video_id]+"_div";
				newThumb.className="option_button left";
				newThumb.innerHTML='<input type="hidden" id="thumb_temp_'+thumb_uploads[video_id]+'" value="'+oResponse.aThumbs[thumb]+'" class="thumb_preview_captured"><a href="javascript:void(0);" rel="<img src=temp/'+oResponse.aThumbs[thumb]+'><br><b>Click to Delete</b>" id="thumb_preview_'+thumb_uploads[video_id]+'" onclick="DeleteThumbPreview(\'captured_'+thumb_uploads[video_id]+'\');"><div class="thumb_delete"></div></a>';
				$('edit_video_captured_thumbs_preview').appendChild(newThumb);
				ReTip('thumb_preview_'+thumb_uploads[video_id]);
			}
		}
		$('save_captured_thumbs_disabled').hide();
		$('save_captured_thumbs').show();
		thumbs_cache[video_id]="";
	} else {
		$('random_video_frame_thumbs_icon').src='images/icons/video_frame_auto.png';
		alertBox('Error Message','icons/error.gif',oResponse.message,400);	
	}	
}


function FrameSelectorAddThumb(){
	var video_id=$('edit_id').value;
	var filename=$('frame_selector_working_image').value.replace(/\?.*$/i, "");
	
	ExecAjax("actions/videos/create_thumb.php","video_id="+video_id+"&filename="+escape(filename),"$('frame_editor_add_thumb_icon').src='images/loading.gif';","","EvalFrameSelectorAddThumb(transport.responseText);","",true,"");
}

function EvalFrameSelectorAddThumb(response){
	var video_id=$('edit_id').value;
	$('frame_editor_add_thumb_icon').src='images/icons/thumb_add.png';

	oResponse=response.evalJSON();
	if(oResponse.success==true){
		if(!thumb_uploads[video_id]){
			thumb_uploads[video_id]=0;
		}
		thumb_uploads[video_id]=thumb_uploads[video_id]+1;
		
		var newThumb=document.createElement('div');
		newThumb.id="thumb_preview_captured_frame_"+thumb_uploads[video_id]+"_div";
		newThumb.className="left";
		newThumb.innerHTML='<input type="hidden" id="thumb_temp_'+thumb_uploads[video_id]+'" value="'+oResponse.filename+'" class="thumb_preview_captured_frame"><a href="javascript:void(0);" onclick="DeleteThumbPreview(\'captured_frame_'+thumb_uploads[video_id]+'\');" rel="<img src=\'images/icons/delete.png\'> Click to Remove" id="thumb_preview_'+thumb_uploads[video_id]+'_link"><img src=temp/'+oResponse.filename+' id="thumb_preview_'+thumb_uploads[video_id]+'" width="70" class="m3 border1"></a>';
		$('frame_editor_captured_thumbs_preview').appendChild(newThumb);
		ReTip('thumb_preview_'+thumb_uploads[video_id]+'_link');
		$('frame_editor_captured_thumbs_save_button_disabled').hide();
		$('frame_editor_captured_thumbs_save_button').show();
	} else {
		alertBox('Error Message','icons/error.gif',oResponse.message,400);
	}
}

function SaveCapturedThumbsFromSelector(){
	var i=0;
	var aThumbs=[];
	if($$('.thumb_preview_captured_frame').length>0){
		$$('.thumb_preview_captured_frame').each(function(element){
			element.value=element.value.replace(/\?.*$/i,"");
			aThumbs[i]=element.value;
			i++;
		});
	}
	
	if(aThumbs.length>0){
		if(aThumbs.length>1){
			var oResponse='{"success":true,"aThumbs":'+aThumbs.toJSON()+'}';
		} else {
			var oResponse='{"success":true,"aThumbs":'+aThumbs.toJSON()+',"filename":"'+aThumbs[0]+'"}';
		}
		EvalGetRandomFramesForThumbs(oResponse);
		CloseLayer('frame_selector_layer');
	} else {
		alertBox('Error Message','icons/error.gif',"Please, create at least one Thumbnail",400);
	}
}

function EvalSaveCapturedThumbsFromSelector(response){
	oResponse=response.evalJSON();
	if(oResponse.success==true){
		$('save_captured_thumbs_icon').src='images/icons/success.png';
		setTimeout("$('save_captured_thumbs_icon').src='images/icons/save.png';",2000);
		setTimeout("CancelEditVideoThumbsOptions();",2000);
		var video_id=$('edit_id').value;
		thumbs_cache[video_id]="";
		
		$('edit_video_success_msg_media').innerHTML="Images successfuly saved";
		OpenLayer('edit_video_success_msg_media');
		
		UpdateThumbsTip(oResponse.aThumbs);
	} else {
		alertBox('Error Message','icons/error.gif',oResponse.message,400);
	}	
}


function SaveCapturedThumbs(){
	var video_id=$('edit_id').value;
	
	var thumbs_string="";
	$$('.thumb_preview_captured').each(function(element){
		element.value=element.value.replace(/\?.*$/i,"");
		thumbs_string=thumbs_string+"&thumbs[]="+element.value;
	});
	if($$('.thumb_preview_captured').length>0){
		ExecAjax("actions/videos/save_uploaded_thumbs.php","video_id="+video_id+thumbs_string,"$('save_captured_thumbs_icon').src='images/loading.gif';","","EvalSaveCapturedThumbs(transport.responseText)","",true);
	} else {
		alertBox('Error Message','icons/error.gif',"Please, add at least one thumbnail.",300);	
	}
}

function EvalSaveCapturedThumbs(response){
	oResponse=response.evalJSON();
	if(oResponse.success==true){
		$('refresh_on_close').value='1';
		$('save_captured_thumbs_icon').src='images/icons/success.png';
		setTimeout("$('save_captured_thumbs_icon').src='images/icons/save.png';",2000);
		setTimeout("CancelEditVideoThumbsOptions();",2000);
		var video_id=$('edit_id').value;
		thumbs_cache[video_id]="";
		
		$('edit_video_success_msg_media').innerHTML="Images successfuly saved";
		OpenLayer('edit_video_success_msg_media');
		
		UpdateThumbsTip(oResponse.aThumbs);
	} else {
		alertBox('Error Message','icons/error.gif',oResponse.message,400);
	}	
}

function UpdateThumbsTip(aThumbs){
	var thumbs_html="";
	aThumbs.each(function(element){
		if(element.match(/^thumbs\//)) {
			element="../"+element;
		} else if(element.match(/^https?:/)){
			// don't edit element.
		} else {
			element="../thumbs/"+element;
		}
		thumbs_html=thumbs_html+'<img src="'+element+'" class="left m3" width="'+Math.round(aSettings.thumb_width/2)+'" height="'+Math.round(aSettings.thumb_height/2)+'">';
	});
	
	$('edit_thumbs_link').rel='<div style="width:auto; max-width:'+((aSettings.thumb_width*2)+40)+'px;">'+thumbs_html+'</div>';
	$('edit_thumbs_link').className="";
	ReTip('edit_thumbs_link');
}


function FlushTemp(){
	ExecAjax("actions/videos/flush_temp_folder.php","","","","","",true,"");
}



// -----------------------------------------------------------
function UpdateVideoInfo(){
	var row_id=$('edit_row_id').value;
	var title=$('edit_title').value;
	var duration=$('edit_duration').value;
	var date=$('edit_date').value;
	var thumb=$('edit_thumb').value;
	var views=$('edit_views').value;
	var rating=$('edit_rating').value;
	var votes=$('edit_votes').value;
	var status=$('edit_status').value;
	
	if(status==1){
		$('status_img_'+row_id).src='images/active.png';
		$('status_img_'+row_id).Title='Video is Active';
	} else {
		$('status_img_'+row_id).src='images/inactive.png';
		$('status_img_'+row_id).Title='Video is Inctive';
	}
	if(title.length>18){
		$('title_'+row_id).innerHTML=title.substr(0,19)+"...";
	} else {
		$('title_'+row_id).innerHTML=title;
	}
	$('title_'+row_id).title=title;
	$('thumb_'+row_id).src=thumb;
	
	var mins = parseInt(duration/60);
	var secs = duration % 60;
	var hours = parseInt(mins/60);
	mins=mins%60;

	if(mins<10) mins="0"+mins;
	if(secs<10) secs="0"+secs;	
	if(hours>0){
		duration=hours+"h "+mins+"min "+secs+"sec";
	} else {
		duration=mins+"min "+secs+"sec";
	}
	
	$('duration_'+row_id).innerHTML=duration;
	$('date_'+row_id).innerHTML=date;
	$('votes_'+row_id).innerHTML=votes;
	
	var star_image;
	if(rating==0){star_image="0";
	}else if(rating<=0.5){star_image="1";
	}else if(rating<=1){star_image="2";
	}else if(rating<=1.5){star_image="3";
	}else if(rating<=2){star_image="4";
	}else if(rating<=2.5){star_image="5";
	}else if(rating<=3){star_image="6";
	}else if(rating<=3.5){star_image="7";
	}else if(rating<=4){star_image="8";
	}else if(rating<=4.5){star_image="9";
	} else {star_image="10";}
	$('star_img_'+row_id).src="images/star_image_"+star_image+".gif";
	$('star_img_'+row_id).title="Rating: "+rating+" of 5";
}

function MassCheck(){
	var x=confirm("Are you sure you want to Mass Check all videos?\r\nIt might take several minutes and all videos will be updated or deleted automatically, depending on the check result.");
	if(x) ExecAjax("../magick/automagick_cron.php","check=1","","","EvalMassCheck(transport.responseText);","",true);
}

function EvalMassCheck(response){
	if(response){
		alertBox('Message','icons/info.png',response,150);
	} else {
		alertBox('Error Message','icons/error.gif','Unknown Error: Videos could not been checkd.',150);
	}
}

function Paginate(page){
	if(!page) page=1;
	
	var status_override=$('status_override').value;
	if($('simplifyed').checked==true){
		var simplifyed=1;
	} else {
		var simplifyed=0;
	}		
	var premium_videos=$('premium_videos').value;
	var special_filter=$('special_filter').value;
	var thumbs_cache=[];
	loadModule("videos","page="+page+"&simplifyed="+simplifyed+"&"+$('filter_options').serialize()+"&status_override="+status_override+"&premium_videos="+premium_videos,"video_contents","ReCalendar(); evalJS(transport.responseText);");
}

function RefreshPlayers(){
	loadModule("flv_players","","flv_players_contents");
}

function PreviewPlayer(id){
	var player_code=$('player_code_'+id).value
	player_code=player_code.replace(/\{\*player_width\*\}/g, "320");
	player_code=player_code.replace(/\{\*player_height\*\}/g, "240");

	var pattern=new RegExp("[\"|'](\./)?players/");
	if(pattern.test(player_code)) player_code=player_code.replace(/players\//g, "../players/");
	$('player_preview_'+id).innerHTML=player_code;
}

function AddPlayer(){
	ExecAjax("actions/videos/add_player.php","","","","EvalAddPlayer(transport.responseText);","",true,"POST");
}

function EvalAddPlayer(response,row_index){
	oResponse=response.evalJSON();
	if(oResponse.success==true){
		RefreshPlayers();
	} else {
		alertBox('Error Message','icons/error.gif',oResponse.message,500);
	}	
}

function SavePlayersConfig(dont_show_confirmation){
	var vars=$('player_settings_form').serialize();
	ExecAjax("actions/videos/set_players.php",vars,"$('player_save_img').src='images/loading.gif';","","EvalSavePlayersConfig(transport.responseText,"+dont_show_confirmation+");","",true,"POST");
}

function EvalSavePlayersConfig(response,dont_show_confirmation){
	$('player_save_img').src='images/download.gif';
	if(!dont_show_confirmation){
		if(response=="OK"){
			$('player_settings_success_msg').innerHTML="Players Settings have been successfuly saved.";
			OpenLayer('player_settings_msg_success');
			setTimeout("CloseLayer('player_settings_msg_success');",5000);
		} else {
			$('player_settings_error_msg').innerHTML="Players Settings could not be saved. CHMOD 'players/' to 777.";
			OpenLayer('player_settings_msg_error');
			setTimeout("CloseLayer('player_settings_msg_error');",7000);
		}
	}
}

function DeletePlayer(id){
	var x=confirm("Are you sure you want to delete this player?");
	if(x){
		ExecAjax("actions/videos/delete_player.php","id="+id,"","","EvalDeletePlayer(transport.responseText);","",true,"POST");
	}
}

function EvalDeletePlayer(response){
	oResponse=response.evalJSON();
	if(oResponse.success==true){
		RefreshPlayers();
	} else {
		alertBox('Error Message','icons/error.gif',oResponse.message,500);
	}
}


function SavePlayer(id){
	var name=$('player_name_'+id).value;
	var code=$('player_code_'+id).value;
	var comments=$('player_comments_'+id).value;
	
	ExecAjax("actions/videos/update_player.php","id="+id+"&name="+escape(name)+"&code="+escape(code)+"&comments="+escape(comments),"$('player_save_icon_"+id+"').src='images/loading.gif';","","EvalSavePlayer(transport.responseText,'"+id+"');","",true,"POST");
}

function EvalSavePlayer(response,id){
	oResponse=response.evalJSON();
	if(oResponse.success==true){
		$('player_save_icon_'+id).src='images/icons/success.png';
		setTimeout("$('player_save_icon_"+id+"').src='images/icons/save.png';",2000);
	} else {
		$('player_save_icon_'+id).src='images/icons/save.png';
		alertBox('Error Message','icons/error.gif',oResponse.message,500);
	}
}

/* function PreviewPlayer(i){
	var player_code=$('player_code_'+i).value
	player_code=player_code.replace(/\{\*player_width\*\}/g, "640");
	player_code=player_code.replace(/\{\*player_height\*\}/g, "480");

	var pattern=new RegExp("[\"|'](\./)?players/");
	if(pattern.test(player_code)) player_code=player_code.replace(/players\//g, "../players/");
	
	$('video_preview').innerHTML=player_code;
	OpenLayer('preview_layer');	
}

*/

var player = null;
function playerReady(thePlayer) {
	player = window.document[thePlayer.id];
	addListeners();
}
		
function addListeners() {
	if (player) { 
		player.addModelListener("STATE", "stateListener");
	} else {
		setTimeout("addListeners()",100);
	}
}


function stateListener(obj) { //IDLE, BUFFERING, PLAYING, PAUSED, COMPLETED
	currentState = obj.newstate; 
	previousState = obj.oldstate; 
	if ((currentState == "COMPLETED")&&(previousState == "PLAYING")) {
		document.getElementById("player_div").style.display='none';
		document.getElementById("ads_div").style.display='block';
	}
}

function ShowPlayer(){
	$('ads_div').hide();
	$('player_div').show();
}

function CalculateCharsCount(id,target,max){
	var amount=$(id).value.length;
	if(amount>max){
		$(id).value=$(id).value.substr(0,max);
		$(id).scrollTop = $(id).scrollHeight
		amount=max;
	}	
	$(target).innerHTML=max-amount;
}

function secsCheck(id){
	var value=$(id).value;
	if(!value.match(/^[0-9]+$/) || value>59){
		value=value.substr(0,value.length-1);
	}
	if(!value.match(/^[0-9]+$/)){
		value="";
	}
	$(id).value=value;
}


function AddNewImportField(){
	new_field=parseInt($('import_layer_fields_count').value)+1;
	$('import_layer_fields_count').value=new_field;
	
	var new_element=document.createElement("select");
	new_element.name='import_layer_fields['+new_field+']';
	new_element.id='import_layer_field_'+new_field;
	new_element.className='input-text left m3';
	new_element.style.width='115px';
	new_element.innerHTML='<option value="">'+new_field+') - Ignore Field - </option>'+
	  '<option value="title">Title</option>'+
	  '<option value="description">Description</option>'+
	  '<option value="category">Category</option>'+
	  '<option value="duration">Duration</option>'+
	  '<option value="thumb">Thumbnail</option>'+
	  '<option value="tags">Tags</option>'+
	  '<option value="preview">Preview Image</option>'+
	  '<option value="embed_code">Embed Code</option>'+
	  '<option value="flv_url">FLV Url</option>'+
	  '<option value="m4v_url">M4V Url</option>'+
	  '<option value="mp4_url">MP4 Url</option>'+
	  '<option value="preroll_img">Pre-roll Image</option>'+
      '<option value="preroll_link">Pre-roll Link</option>'+
      '<option value="postroll_img">Post-roll Image</option>'+
      '<option value="postroll_link">Post-roll Link</option>';
	  
	
	$('import_layer_fields_div').appendChild(new_element);
}

function ClearImportFieldsDiv(){
	$('import_layer_fields_div').innerHTML='';
	$('import_layer_fields_count').value=0;
	AddNewImportField();
}


function CheckCustomSeparatorValue(v){
	if(v=="custom"){
		$('import_layer_custom_separator').value='';
		$('import_layer_custom_separator').show();
	} else {
		$('import_layer_custom_separator').hide();
		$('import_layer_custom_separator').value=v;
	}
}

function CheckImportActivationDateMethod(v){
	switch(v){
		case "0":
			$('import_layer_activation_fixed').hide();
			$('import_layer_activation_progressive_1').hide();
			$('import_layer_activation_progressive_2').hide();
		break;
		case "1":
			$('import_layer_activation_progressive_1').hide();
			$('import_layer_activation_progressive_2').hide();
			$('import_layer_activation_fixed').show();
		break;
		case "2":
			$('import_layer_activation_fixed').hide();
			$('import_layer_activation_progressive_2').hide();
			$('import_layer_activation_progressive_1').show();
		break;
		case "3":
			$('import_layer_activation_fixed').hide();
			$('import_layer_activation_progressive_1').hide();
			$('import_layer_activation_progressive_2').show();
		break;
	}	
}


function ImportVideos(simulate){
	if(!simulate) simulate=0;
	
	if(simulate==1){
		var img='import_layer_simulate_icon';
		$('import_layer_simulate').value=1;
	} else {
		var img='import_layer_import_icon';
		$('import_layer_simulate').value=0;
	}
	$(img).src='images/loading.gif';
	$('import_form').submit();
}

function EvalImportVideos(response){
	$('import_layer_simulate_icon').src='images/icons/simulate.png';
	$('import_layer_import_icon').src='images/icons/import.png';
	
	oResponse=response.evalJSON();
	if(oResponse.success==true){
		alertBox('Import Results','',oResponse.results,600,350);
	} else {
		alertBox('Error Message','icons/error.gif',oResponse.message,400);	
	}	
}

// Thumbs rotation functions
// -------------------------
var thumbs_cache=[];
var thumb_interval='';
var thumb_index=0;
var hover=[];
var ajax_running=0;

function StartThumbRotation(thumb_id,video_id){
	StopThumbRotation(thumb_id,video_id);
	hover[video_id]=1;
	thumb_index=0;
	if(ajax_running==0){
		ajax_running=1;
		if(!thumbs_cache[video_id]){
			thumbs_cache[video_id]="";
			ExecAjax("actions/videos/get_thumbs_list.php","video_id="+video_id,"","","ExecThumbRotation('"+thumb_id+"','"+video_id+"',transport.responseText);","",true,"POST");
		} else {
			ExecThumbRotation(thumb_id,video_id,'{"success":true,"thumbs":'+thumbs_cache[video_id].toJSON()+'}');
		}
	}
}

function ExecThumbRotation(thumb_id,video_id,response){
	oResponse=response.evalJSON();
	ajax_running=0;
	if(oResponse.success==true){
		thumbs_cache[video_id]=oResponse.thumbs;
		
		if(hover[video_id]==1){
			var pics=[];
			for(i=0;i<oResponse.thumbs.length;i++){
				if(oResponse.thumbs[i].match(/^thumbs\//) ) oResponse.thumbs[i]="../"+oResponse.thumbs[i];
				pics[i]= new Image(164,124);
				pics[i].src=oResponse.thumbs[i];
			}
			thumb_interval=setInterval("NextThumb('"+thumb_id+"','"+video_id+"');",500);
		} else {
			StopThumbRotation(thumb_id,video_id);	
		}
	} else {
		thumbs_cache[video_id]='{"success":false,"thumbs":[]}';
	}
}

function NextThumb(thumb_id,video_id){
	if(hover[video_id]==1 && ajax_running==0 && thumbs_cache[video_id]){
		var t=thumbs_cache[video_id];
		if(thumb_index>=t.length-1 || thumb_index==-1){
			thumb_index=0;
		} else {
			thumb_index++;
		}	
		if(t[thumb_index] && $(thumb_id)) $(thumb_id).src=t[thumb_index];
	}
}

function StopThumbRotation(thumb_id,video_id){
	clearInterval(thumb_interval);
	thumb_index=-1;
	NextThumb(thumb_id,video_id);
	hover[video_id]=0;
}

function SelectThumb(checked,id){
	if(checked==true){
		$('thumb_td_'+id).addClassName('thumb_selected');
	} else {
		$('thumb_td_'+id).removeClassName('thumb_selected');
	}
}

function SetCronTasks(additional_functions){
	var json_ids=$('tasks_cron_ids').value;
	var tasks=$('tasks_form').serialize();
	ExecAjax("actions/videos/set_cron_tasks.php","ids="+json_ids+"&"+tasks,"$('set_cron_tasks_icon').src='images/loading.gif';","","EvalSetCronTasks(transport.responseText,'"+additional_functions+"');","",true,"POST");
}

function RunCronTasks(){
	var x=confirm("If you run the selected tasks, you will loose any other task\r\nyou might have saved before for the selected videos.\r\nAre you sure you want to continue?");
	if(x){
		SetCronTasks('ActionOnSelected("11");');
	}
}


function EvalSetCronTasks(response,additional_functions){
	oResponse=response.evalJSON();
	if(oResponse.success==true){
		$('set_cron_tasks_icon').src='images/icons/success.png';
		setTimeout("$('set_cron_tasks_icon').src='images/icons/cron_tasks.png';",3000);
		eval(additional_functions);
	} else {
		$('set_cron_tasks_icon').src='images/icons/cron_tasks.png';
		alertBox('Error Message','icons/error.gif',oResponse.message,400);
	}
}

function SetTranslationsCron(){
	var x=confirm("This action will add a cron task to ALL videos with, at least, one missing translation pair (Title + Description). It will NOT replace existing translations of other languages. Only missing languages.\r\n\r\nDo you want to continue?");
	if(x){
		ExecAjax("actions/videos/set_autotranslations_cron.php","","$('translate_all_icon').src='images/loading.gif';","","EvalSetTranslationsCron(transport.responseText);","",true,"POST");
	}
}

function EvalSetTranslationsCron(response){
	$('translate_all_icon').src='images/icons/translate.gif';
	oResponse=response.evalJSON();
	if(oResponse.success==true){
		alertBox('Result','icons/success.png','The translation task has been added to all videos with pending translations.',450);
	} else {
		alertBox('Error Message','icons/error.gif',oResponse.message,400);
	}	
}

function OpenTasksQueue(){
	ExecAjax("actions/videos/get_tasks_queue_contents.php","","$('tasks_queue_icon').src='images/loading.gif';","","EvalOpenTasksQueue(transport.responseText);","",true,"POST");
}

function EvalOpenTasksQueue(response){
	$('tasks_queue_icon').src='images/icons/cron_tasks.png';
	oResponse=response.evalJSON();
	if(oResponse.success==true){
		alertBox('Tasks Cron Queue','icons/cron_tasks.png',oResponse.contents,550);
	} else {
		alertBox('Error Message','icons/error.gif',oResponse.message,400);
	}		
}

function OpenTasksLog(id){
	if(!id) id='';
	ExecAjax("actions/videos/get_tasks_log_contents.php","id="+id,(id ? "$('tasks_failed_icon_"+id+"').src='images/loading.gif';" : "$('tasks_log_icon').src='images/loading.gif';"),"","EvalOpenTasksLog(transport.responseText,'"+id+"');","",true,"POST");
}

function EvalOpenTasksLog(response,id){
	if(id){
		$('tasks_failed_icon_'+id).src='images/icons/cron_tasks_failed.png';
	} else {
		$('tasks_log_icon').src='images/icons/cron_log.png';
	}
	oResponse=response.evalJSON();
	if(oResponse.success==true){
		alertBox('Tasks Cron Log','icons/cron_log.png',oResponse.contents,700,null,1);
	} else {
		alertBox('Error Message','icons/error.gif',oResponse.message,400);
	}		
}

function GetReportedReasons(id){
	ExecAjax("actions/videos/get_reported_reasons.php","id="+id,"$('reported_video_icon_"+id+"').src='images/loading.gif';","","EvalGetReportedReasons(transport.responseText,'"+id+"');","",true,"POST");
}

function EvalGetReportedReasons(response,id){
	$('reported_video_icon_'+id).src='images/icons/warning_report.png';
	oResponse=response.evalJSON();
	if(oResponse.success==true){
		alertBox('Reported Reasons','icons/warning_report.png','<b>'+oResponse.aReasons+'</b>',500);
	} else {
		alertBox('Error Message','icons/error.gif',oResponse.message,400);
	}			
}

function evalJS(response){
	$$('.evaljs').each(function(element){
		eval(element.innerHTML);
	});
}
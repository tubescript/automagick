function SaveConfig(f){
	var vars=f.serialize();
	ExecAjax("actions/sources/save_config.php",vars,"$('save_icon').src='images/loading.gif';","","EvalSaveConfig(transport.responseText);","",true);
}

function EvalSaveConfig(response){
	oResponse=response.evalJSON();
	if(oResponse.success==true){
		$('save_icon').src='images/icons/success.png'
		setTimeout("$('save_icon').src='images/icons/save.png';",2000);
	} else {
		$('save_icon').src='images/icons/save.png';
		alertBox('Error Message','icons/error.gif',oResponse.message,400);
	}	
}


function GetConfig(){
	ExecAjax("actions/sources/get_config.php","","","","EvalGetConfig(transport.responseText);","",true);
}


function EvalGetConfig(response){
	oResponse=response.evalJSON();
	if(oResponse.success==true){
		var aSources=oResponse.aSources;
		for(source_name in aSources){
			for(field_name in aSources[source_name]){
				field_value=aSources[source_name][field_name]
				if($(source_name+'_'+field_name)){
					if($(source_name+'_'+field_name).readAttribute('type')=="checkbox"){
						$(source_name+'_'+field_name).checked=parseInt(field_value);
					} else {
						$(source_name+'_'+field_name).value=field_value;
					}
				}
			}
			if($(source_name+'_video_mode') && $(source_name+'_video_mode').value==2){
				if($(source_name+'_player_id_row')) $(source_name+'_player_id_row').show();
			} else {
				if($(source_name+'_player_id_row')) $(source_name+'_player_id_row').hide();
			}
		}
	}
	$('sources_save_button_disabled').hide();
	$('sources_save_button').show();
}

function OpenSourcesBrowser(source_name, source_title){
	$('error_msg').hide();
	$('warning_msg').hide();
	$('sources_browser_title').innerHTML=source_title+" Videos";
	GetVideos('list',source_name,1,"","","","");
}

function GetVideos(mode,source,page,categ,tag,lang,amount){
	$('error_msg').hide();
	$('warning_msg').hide();
	if(!page) page= $('page') ? $('page').value : 1;
	if(!categ) categ= $('categ') ? $('categ').value : "";
	if(!tag) tag= $('tag') ? $('tag').value : "";
	if(!lang) lang= $('lang') ? $('lang').value : "";
	if(!amount) amount= $('amount') ? $('amount').value : "";

	var options=$('get_videos_form').serialize();
	options = options.replace(/&page=[0-9]*/,"");
	
	ExecAjax("actions/sources/get_videos.php","mode="+mode+"&source="+source+"&page="+page+"&categ="+escape(categ)+"&tag="+escape(tag)+"&lang="+lang+"&amount="+amount+"&"+options,"OpenLayer('main_loading');","","EvalGetVideos(transport.responseText);","",true);
}

function EvalGetVideos(response){
	CloseLayer('main_loading');
	
	oResponse=response.evalJSON();
	if(oResponse.mode=="list"){		
		$('sources_browser_contents').innerHTML=unescape(oResponse.contents);
		OpenLayer('sources_browser_layer');
		ReTip();
	} else {
		var aIds=oResponse.ids;
		for(i=0; i<aIds.length; i++){
			$('cbsb_'+aIds[i]).checked=false;
			$('cbsb_'+aIds[i]).disabled=true;
			$('div_thumb_'+aIds[i]).className='thumb_added';
			$('sb_title_'+aIds[i]).className='green';
		}
		
		var aErrorIds=oResponse.error_ids;
		for(i=0; i<aErrorIds.length; i++){
			$('div_thumb_'+aErrorIds[i]).className='thumb_error';
		}
				
		if(oResponse.error_msgs.length>0){
			//$('error_msg').innerHTML='<img src="images/icons/error.gif"> Error: ' + oResponse.error_msgs.join("<br>");
			//OpenLayer('error_msg');
			alertBox('Error Message','icons/error.gif',oResponse.error_msgs.join("<br>"),400);
		} 
		
		if(oResponse.warning_msg){
			$('warning_msg').innerHTML='<img src="images/icons/warning.png">' + oResponse.warning_msg;
			OpenLayer('warning_msg');
		}
	}
}



function SelectThumb(checked,id){
	if(checked==true){
		$('div_thumb_'+id).className="thumb_selected";	
	} else {
		$('div_thumb_'+id).className="thumb";
	}
}

function CheckVideoModeValue(v){
	if(v==2){
		$('premium_row').show();
	} else {
		$('premium_row').hide();
		$('premium').checked=false;		
	}
}
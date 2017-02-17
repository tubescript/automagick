function OpenTagsArchiveManager(){
	ExecAjax("actions/settings/get_tags_archive.php","","$('tags_archive_manager_icon').src='images/loading.gif'; $('tags_archive_refresh_icon').src='images/loading.gif';","","EvalOpenTagsArchiveManager(transport.responseText);","",true);
}

function EvalOpenTagsArchiveManager(response){
	oResponse=response.evalJSON();
	if(oResponse.success==true){
		
		if(oResponse.aInactiveTags && oResponse.aInactiveTags.length>0){
			var inactive_tag_options='';
			for(i=0; i<oResponse.aInactiveTags.length; i++){
				oResponse.aInactiveTags[i]=oResponse.aInactiveTags[i].replace(/"/g,'&quot;');
				inactive_tag_options+='<option value="'+oResponse.aInactiveTags[i]+'" id="tags_archive_inactive_tag_'+oResponse.aInactiveTags[i]+'" style="height:16px;">'+oResponse.aInactiveTags[i]+'</option>\r\n';
			}
			$('tags_archive_inactive_tags').innerHTML='';
			$('tags_archive_inactive_tags').innerHTML=inactive_tag_options;
			$('tags_archive_inactive_tags_count').innerHTML=oResponse.aInactiveTags.length;
		} else {
			$('tags_archive_inactive_tags').innerHTML='';
			$('tags_archive_inactive_tags').innerHTML='<option value="" disabled id="tags_archive_inactive_tag_empty" style="color:#888888; height:16px;"> - No Inactive Tags - </option>\r\n';
			$('tags_archive_inactive_tags_count').innerHTML='0';
		}
		
		if(oResponse.aActiveTags && oResponse.aActiveTags.length>0){
			var active_tag_options='';
			for(i=0; i<oResponse.aActiveTags.length; i++){
				oResponse.aActiveTags[i]=oResponse.aActiveTags[i].replace(/"/g,'&quot;');
				active_tag_options+='<option value="'+oResponse.aActiveTags[i]+'" id="tags_archive_active_tag_'+oResponse.aActiveTags[i]+'" style="height:16px;">'+oResponse.aActiveTags[i]+'</option>\r\n';
			}
			$('tags_archive_active_tags').innerHTML='';
			$('tags_archive_active_tags').innerHTML=active_tag_options;
			$('tags_archive_active_tags_count').innerHTML=oResponse.aActiveTags.length;
		} else {
			$('tags_archive_active_tags').innerHTML='';
			$('tags_archive_active_tags').innerHTML='<option value="" disabled id="tags_archive_active_tag_empty" style="color:#888888; height:16px;"> - No Active Tags - </option>\r\n';
			$('tags_archive_active_tags_count').innerHTML=0;
		}
		OpenLayer('tags_archive_layer');
	} else {
		alertBox('Error Message','icons/error.gif',oResponse.message,300);
	}
	$('tags_archive_refresh_icon').src='images/icons/refresh.png';
	$('tags_archive_manager_icon').src='images/icons/archive.png';
}

function ActivateTagsFromArchive(){
	var aTags=$('tags_archive_inactive_tags').getValue();
	if(!aTags || aTags.length==0){
		alertBox('Error Message','icons/error.gif','You must select, at least, one tag from the Inactive Tags list',400);
	} else {
		ExecAjax("actions/settings/set_tags_status.php","status=1&tags="+encodeURIComponent(aTags.join(",")),"$('tags_archive_raquo_icon').src='images/loading.gif';","","EvalActivateTagsFromArchive(transport.responseText);","",true);
	}
}

function EvalActivateTagsFromArchive(response){
	oResponse=response.evalJSON();
	$('tags_archive_raquo_icon').src='images/icons/raquo.png';
	if(oResponse.success==true){
		var new_options='';
		var aTags=$('tags_archive_inactive_tags').getValue();
		for(i=0;i<aTags.length;i++){
			$('tags_archive_inactive_tag_'+aTags[i]).remove();
			aTags[i]=aTags[i].replace(/"/g,'&quot;');
			new_options+='<option value="'+aTags[i]+'" selected id="tags_archive_active_tag_'+aTags[i]+'" style="height:16px;">'+aTags[i]+'</option>\r\n';
		}
		$('tags_archive_active_tags').innerHTML+=new_options;
		ReCountTags();
	} else {
		alertBox('Error Message','icons/error.gif',oResponse.message,300);
	}
}


function DeactivateTagsFromArchive(){
	var aTags=$('tags_archive_active_tags').getValue();
	if(!aTags || aTags.length==0){
		alertBox('Error Message','icons/error.gif','You must select, at least, one tag from the Active Tags list',400);
	} else {
		ExecAjax("actions/settings/set_tags_status.php","status=0&tags="+encodeURIComponent(aTags.join(",")),"$('tags_archive_laquo_icon').src='images/loading.gif';","","EvalDeactivateTagsFromArchive(transport.responseText);","",true);
	}
}

function EvalDeactivateTagsFromArchive(response){
	oResponse=response.evalJSON();
	$('tags_archive_laquo_icon').src='images/icons/laquo.png';
	if(oResponse.success==true){
		var new_options='';
		var aTags=$('tags_archive_active_tags').getValue();
		for(i=0; i<aTags.length; i++){
			$('tags_archive_active_tag_'+aTags[i]).remove();
			aTags[i]=aTags[i].replace(/"/g,'&quot;');
			new_options+='<option value="'+aTags[i]+'" selected id="tags_archive_inactive_tag_'+aTags[i]+'" style="height:16px;">'+aTags[i]+'</option>\r\n';
		}
		$('tags_archive_inactive_tags').innerHTML+=new_options;
		ReCountTags();
	} else {
		alertBox('Error Message','icons/error.gif',oResponse.message,300);
	}
}

function SortCombobox(id) {
	var lb = $(id);
	arrTexts = [];
	
	for(i=0; i<lb.length; i++){
		arrTexts[i] = lb.options[i].text;
	}
	
	arrTexts.sort();
	
	for(i=0; i<lb.length; i++){
		lb.options[i].text = arrTexts[i];
		lb.options[i].value = arrTexts[i];
	}
}

function ReCountTags(){
	if($('tags_archive_inactive_tag_empty')) $('tags_archive_inactive_tag_empty').remove();
	if($('tags_archive_active_tag_empty')) $('tags_archive_active_tag_empty').remove();
	
	var inactive_count=$('tags_archive_inactive_tags').options.length;
	var active_count=$('tags_archive_active_tags').options.length;
	
	if(inactive_count==0) $('tags_archive_inactive_tags').innerHTML='<option value="" disabled id="tags_archive_inactive_tag_empty" style="color:#888888; height:16px;"> - No Inactive Tags - </option>\r\n';
	if(active_count==0) $('tags_archive_active_tags').innerHTML='<option value="" disabled id="tags_archive_active_tag_empty" style="color:#888888; height:16px;"> - No Active Tags - </option>\r\n';
	
	$('tags_archive_inactive_tags_count').innerHTML=inactive_count;
	$('tags_archive_active_tags_count').innerHTML=active_count;
}

function TagsArchiveToggleAll(id,checked){
	for(i=0;i<$(id).options.length;i++){
		if($(id).options[i].value){
			$(id).options[i].selected=checked;
		}
	}
}

function TagsArchiveAddTags(){
	var tags=$('tags_archive_add_tags').value;
	var as_active=$('tags_archive_add_as_active').checked;
	var exclude=$('tags_archive_exclude_amount').value;
	if(tags!=''){
		ExecAjax("actions/settings/tags_archive_add_tags.php","tags="+encodeURIComponent(tags)+"&as_active="+as_active+"&exclude="+exclude,"$('tags_archive_add_tags_icon').src='images/loading.gif';","","EvalTagsArchiveAddTags(transport.responseText);","",true);
	}
}

function EvalTagsArchiveAddTags(response){
	oResponse=response.evalJSON();
	$('tags_archive_add_tags_icon').src='images/icons/little_check.png';
	if(oResponse.success==true){
		$('tags_archive_add_tags_icon').src='images/icons/success.png';
		$('tags_archive_add_tags').value='';
		setTimeout("$('tags_archive_add_tags_icon').src='images/icons/little_check.png';",3000);
		
		if(oResponse.aTags.length>0){
			alertBox('Result','icons/succcess.gif',oResponse.amount+' tags have been added to the archive.',400);
		}		
		OpenTagsArchiveManager();
	} else {
		alertBox('Error Message','icons/error.gif',oResponse.message,300);
	}	
}

function ExtractVideosTags(){
	var x=confirm("This might take some time, depending on the amount\r\nof videos in the database. Continue?");
	if(x){
		ExecAjax("actions/settings/tags_archive_extract_tags.php","","$('tags_archive_extract_icon').src='images/loading.gif';","","EvalExtractVideosTags(transport.responseText);","",true);
	}
}

function EvalExtractVideosTags(response){
	oResponse=response.evalJSON();
	$('tags_archive_extract_icon').src='images/icons/video_extract.png';

	if(oResponse.success==true){
		if(oResponse.aTags.length>0){
			$('tags_archive_add_tags').value=oResponse.aTags.join("\n");
			$('tags_archive_add_tags_div').show();
		} else {
			alertBox('Error Message','icons/error.gif',"No tags could be extracted.",300);	
		}
	} else {
		alertBox('Error Message','icons/error.gif',oResponse.message,300);
	}
}

function DeleteTags(status){
	var x=confirm("Are you sure you want to delete these tags?");
	if(x){
		var aTags=$('tags_archive_'+status+'_tags').getValue();
		ExecAjax("actions/settings/delete_tags_from_archive.php","tags="+encodeURIComponent(aTags.join(",")),"$('tags_archive_delete_icon_"+status+"').src='images/loading.gif';","","EvalDeleteTags(transport.responseText,'"+status+"');","",true);
	}			
}

function EvalDeleteTags(response,status){
	oResponse=response.evalJSON();
	$('tags_archive_delete_icon_'+status).src='images/icons/delete-tiny.png';

	if(oResponse.success==true){
		if(oResponse.aTags.length>0){
			for(i=0; i<oResponse.aTags.length; i++){
				//oResponse.aTags[i]=oResponse.aTags[i].replace(/\\"/g,'"');
				oResponse.aTags[i]=unescape(oResponse.aTags[i]);
				$('tags_archive_'+status+'_tag_'+oResponse.aTags[i]).remove();
				ReCountTags();
			}
		}
	} else {
		alertBox('Error Message','icons/error.gif',oResponse.message,300);		
	}
}
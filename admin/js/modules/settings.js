function SaveSettings(f){
	var vars=f.serialize();
	$$('.checkbox').each(function(element){
		if(element.type=="checkbox" && element.checked==false){
			var name=element.id.replace(/^settings_/,"");
			vars=vars+'&aSettings%5B'+name+'%5D=0';
		}
	});
	ExecAjax("actions/settings/save_settings.php",vars,"$('save_icon').src='images/loading.gif';","","EvalSaveSettings(transport.responseText);","",true);	
}

function EvalSaveSettings(response){
	oResponse=response.evalJSON();
	if(oResponse.success==true){
		DisableUndoButton();
		$('save_icon').src='images/icons/success.png'
		setTimeout("$('save_icon').src='images/icons/save.png';",4000);
	} else {
		$('save_icon').src='images/icons/failure.png'
		setTimeout("$('save_icon').src='images/icons/save.png';",4000);
		alertBox('Error Message','icons/error.gif',oResponse.message,300);
	}	
}

function UndoChanges(){
	ExecAjax("actions/settings/get_settings.php","","$('undo_icon').src='images/loading.gif';","","EvalUndoChanges(transport.responseText);","",true);	
}

function EvalUndoChanges(response){
	$('undo_icon').src='images/icons/undo.png'
	oResponse=response.evalJSON();
	if(oResponse.success==true){
	
		CancelLogoUpload();
	
		var aSettings=oResponse.aSettings;
		var aLabels=oResponse.aLabels;
		for(key in aSettings){
			if($('settings_'+key)){
				if($('settings_'+key).type=="checkbox"){
					$('settings_'+key).checked=parseInt(aSettings[key]);
				} else {
					$('settings_'+key).value=aSettings[key];
				}
			}
		}
		
		for(lang_id in aLabels){
			for(key in aLabels[lang_id]){
				if($('labels_'+lang_id+'_'+key)){
					if($('labels_'+lang_id+'_'+key).type=="checkbox"){
						$('labels_'+lang_id+'_'+key).checked=parseInt(aLabels[lang_id][key]);
					} else {
						$('labels_'+lang_id+'_'+key).value=aLabels[lang_id][key];
					}
				}
			}
		}
		ToggleCells($('settings_comments_allowed').checked,'.comments_property');
		ToggleCells($('settings_rss_status').checked,'.rss_property');
		ToggleCells($('settings_sitemap_status').checked,'.sitemap_property');
		ToggleCells($('settings_video_upload_allowed').checked,'.upload_property');
		ToggleCells($('settings_template_caching').checked,'.caching_property');
		ToggleCells($('settings_default_player_preroll_status').checked,'.preroll_property');
		ToggleCells($('settings_default_player_postroll_status').checked,'.postroll_property');
		ToggleCells($('settings_default_player_straming_method').value==3,'.rtmp_property');
		ToggleCells($('settings_default_player_straming_method').value<3,'.pseudo_property');
		ToggleCells(($('settings_default_player_limit_bw').checked && $('settings_default_player_straming_method').value==2),'.limitbw_property');
		ToggleCells($('settings_paypal_method_status').checked,'.paypal_property');
		ToggleCells($('settings_zombaio_method_status').checked,'.zombaio_property');
		ToggleCells($('settings_ccbill_method_status').checked,'.ccbill_property');
		ToggleCells($('settings_mobile_enabled').checked,'.mobile_property');
		ToggleCells($('settings_tags_cloud_enabled').checked,'.tags_cloud_property');
		ToggleCells($('settings_tags_archive_enabled').checked,'.tags_archive_property');
		ToggleCells($('settings_memcache_enabled').checked,'.memcache_property');
		
		DisableUndoButton();
	} else {
		alertBox('Error Message','icons/error.gif',oResponse.message,500);
	}
}

function EnableUndoButton(){
	$('undo_settings_disabled').hide();
	$('undo_settings_enabled').show();
}

function DisableUndoButton(){
	$('undo_settings_enabled').hide();
	$('undo_settings_disabled').show();
}

function ToggleCells(v,classname){
	if(v==true){
		ShowByClassName(classname);
	} else {
		HideByClassName(classname);
	}	
}

function AddNewLabel(){
	var label_name=$('new_label_name').value;
	var active_id=0;
	$$('.tab_active').each(function(e){
		if(e.id.match("lang_")){
			active_id=e.id.replace("lang_","");
		}
	});
	if(label_name){
		ExecAjax("actions/settings/add_label.php","label_name="+label_name+"&lang_id="+active_id,"$('add_label_icon').src='images/loading.gif';","","EvalAddNewLabel(transport.responseText,'"+label_name+"','"+active_id+"');","",true);
	} else {
		alertBox('Error Message','icons/error.gif','Enter a label name.<br>Only alphanumeric and underscore of hyphen characters.',300);
	}
}

function EvalAddNewLabel(response,label_name,active_id){
	$('add_label_icon').src='images/icons/add.png';
	oResponse=response.evalJSON();
	if(oResponse.success==true){
		var aLanguages=oResponse.aLanguages
		
		var new_element=document.createElement('tr');
		new_element.className='row';
		new_element.addClassName('label_'+label_name);
		
		i=0;
		new_element.insertCell(i).innerHTML='<b>'+label_name+'</b>';
		new_element.cells[i].style.textAlign='right';
		for(lang_id in aLanguages){
			i++;			
			if(active_id==lang_id){
				display='block';
			} else {
				display='none';
			}
			new_element.insertCell(i).innerHTML='<a href="javascript:void(0);"><img src="images/flags/'+aLanguages[lang_id]['code']+'.gif"></a>&nbsp;'+
		      '<textarea name="aLabels['+lang_id+']['+label_name+']" id="labels_'+lang_id+'_'+label_name+'" class="input-text" style="width:300px; height:50px;" onchange="EnableUndoButton();" tabindex="1"></textarea>'+
		      '<a href="javascript:void(0);" class="option_button right pt3 ml5 mr5" style="margin-top:15px;" onclick="DeleteLabel(\''+lang_id+'\',\''+label_name+'\');" rel="<b>Delete Label</b><br>Labels of all the languages will be deleted."><img src="images/icons/delete.png" id="delete_label_icon_'+lang_id+'_'+label_name+'"></a>';
		      
		    new_element.cells[i].className='lang_row lang_id_'+lang_id;
		    new_element.cells[i].style.display=display;
		}
		$('languages_table').insertBefore(new_element, $('languages_table').firstChild);	
		
		ReColorizeRows('.row');
	} else {
		alertBox('Error Message','icons/error.gif',oResponse.message,300);
	}
}


function DeleteLabel(lang_id,label_name){
	var x=confirm("Are you sure you want to delete this label?\r\nLabel will be deleted for all languages.");
	if(x){
		ExecAjax("actions/settings/delete_label.php","label_name="+label_name,"$('delete_label_icon_"+lang_id+"_"+label_name+"').src='images/loading.gif'","","EvalDeleteLabel(transport.responseText,'"+lang_id+"','"+label_name+"');","",true);
	}
}

function EvalDeleteLabel(response,lang_id,label_name){
	$('delete_label_icon_'+lang_id+'_'+label_name).src='images/icons/delete.png';
	oResponse=response.evalJSON();
	if(oResponse.success==true){
		$$('.label_'+label_name).each(function(e){
			if(e) e.remove();
		});
	} else {
		alertBox('Error Message','icons/error.gif',oResponse.message,400);	
	}
}


function SetLanguageStatus(id,status){
	ExecAjax("actions/settings/set_language_status.php","id="+id+"&status="+status,"","","EvalSetLanguageStatus(transport.responseText,'"+id+"','"+status+"');","",true);
}

function EvalSetLanguageStatus(response,id,status){
	oResponse=response.evalJSON();
	if(oResponse.success==true){
		if(status==1){
			$('inactive_status_option_'+id).hide();
			$('active_status_option_'+id).show();
		} else {
			$('active_status_option_'+id).hide();
			$('inactive_status_option_'+id).show();
		}
	} else {
		alertBox('Error Message','icons/error.gif',oResponse.message,400);	
	}	
}

function DeleteLanguage(id){
	var x=confirm("Are you sure you want to uninstall this Language?\r\nAll existing labels will be deleted!");
	if(x){
		ExecAjax("actions/settings/delete_language.php","id="+id,"$('delete_lang_icon_"+id+"').src='images/loading.gif';","","EvalDeleteLanguage(transport.responseText,'"+id+"');","",true);
	}
}

function EvalDeleteLanguage(response,id){
	oResponse=response.evalJSON();
	if(oResponse.success==true){
		$('delete_lang_icon_'+id).src='images/icons/success.png';
		setTimeout("$('save_icon').src='images/icons/save.png';",4000);
		$('language_id_'+id).remove();
		$('lang_'+id).remove();
		
		SwitchTab('lang',1);
		HideByClassName('.lang_div');
		HideByClassName('.lang_row');
		ShowByClassName('.lang_id_1');
		document.cookie='lang_active_tab=1';
	} else {
		$('delete_lang_icon_'+id).src='images/icons/failure.png';
		setTimeout("$('delete_lang_icon_"+id+"').src='images/icons/delete.png';",4000);
		alertBox('Error Message','icons/error.gif',oResponse.message,300);
	}	
}

function SetDefaultLanguage(id){
	if($('default_lang_'+id).disabled==false){
		ExecAjax("actions/settings/set_default_language.php","id="+id,"DisableLangRadios(); $('default_lang_"+id+"').hide(); $('default_lang_loading_"+id+"').show();","","EvalSetDefaultLanguage(transport.responseText,'"+id+"');","",true);
	}
}

function EvalSetDefaultLanguage(response,id){
	EnableLangRadios();
	$('default_lang_loading_'+id).hide();
	$('default_lang_'+id).show();
	
	oResponse=response.evalJSON();
	if(oResponse.success!=true){
		alertBox('Error Message','icons/error.gif',oResponse.message,300);
	}
}

function EnableLangRadios(){
	$$('.lang_radio').each(function(element){
		element.disabled=false;
	});
}

function DisableLangRadios(){
	$$('.lang_radio').each(function(element){
		element.disabled=true;
	});
}

function setLangCodeValue(v){
	var code=v.stripTags().strip().replace('.gif',"");
	$('add_lang_code').value=code;
}


function AddLanguage(){
	var name=$('add_lang_name').value;
	var code=$('add_lang_code').value;
	ExecAjax("actions/settings/add_language.php","name="+name+"&code="+code,"","","EvalAddLanguage(transport.responseText);","",true);		
}

function EvalAddLanguage(response){
	oResponse=response.evalJSON();
	if(oResponse.success==true){	
		CloseLayer('add_language_layer');
		loadModule("settings","","settings_div_4");
	} else {
		alertBox('Error Message','icons/error.gif',oResponse.message,300);		
	}
}

function CheckLicenseStatus(){
	ExecAjax("actions/settings/check_license.php","","$('license_check_icon').src='images/loading.gif';","","EvalCheckLicenseStatus(transport.responseText);","",true);				
}

function EvalCheckLicenseStatus(response){
	$('license_check_icon').src='images/icons/warning.png';
	oResponse=response.evalJSON();
	if(oResponse.success==true){
		$('license_check_button').hide();
		alertBox('Success Message','icons/success.png',oResponse.message,300);
	} else {
		alertBox('Error Message','icons/error.gif',oResponse.message,300);
	}	
}


function ClearCache(){
	ExecAjax("actions/settings/clear_cache.php","","$('clear_cache_icon').src='images/loading.gif';","","EvalClearCache(transport.responseText);","",true);					
}

function EvalClearCache(response){
	oResponse=response.evalJSON();
	if(oResponse.success==true){
		$('clear_cache_icon').src='images/icons/success.png';
		setTimeout("$('clear_cache_icon').src='images/icons/clear.png';",3000);
	} else {
		$('clear_cache_icon').src='images/icons/clear.png';
		alertBox('Error Message','icons/error.gif',oResponse.message,300);
	}			
}

function RefreshMobilePreview(){
	var vars='&mobile_template_name='+$('settings_mobile_template_name').value;
	vars+='&mobile_style_name='+$('settings_mobile_style_name').value;
	vars+='&mobile_header_bgcolor='+$('settings_mobile_header_bgcolor').value;
	vars+='&mobile_bar_bgcolor='+$('settings_mobile_bar_bgcolor').value;
	vars+='&mobile_body_bgcolor='+$('settings_mobile_body_bgcolor').value;
	vars+='&mobile_font_color='+$('settings_mobile_font_color').value;
	vars+='&mobile_font_color_2='+$('settings_mobile_font_color_2').value;
	vars+='&mobile_menu_links_color='+$('settings_mobile_menu_links_color').value;
	vars+='&mobile_links_color='+$('settings_mobile_links_color').value;
	vars+='&mobile_item_bgcolor='+$('settings_mobile_item_bgcolor').value;
	vars+='&mobile_item_border='+$('settings_mobile_item_border').value;
	vars+='&mobile_thumb_border_color='+$('settings_mobile_thumb_border_color').value;
	$('mobile_preview').src=aSettings.installation_url+"index.php?force_mobile=1"+vars;
}

function RefreshTubeProPreview(){
	var aTubeProElements=[];
	for(var i=0; i<$('settings_form').length; i++){
		if($('settings_form')[i].name.match(/aSettings\[tubepro_.*/i)){
			aTubeProElements.push($('settings_form')[i].name+"="+$('settings_form')[i].value);
			//aTubeProElements[$('settings_form')[i].name]=$('settings_form')[i].value;
		}
	}
	var vars=aTubeProElements.join("&");
	
	vars=vars+"&tubepro_logo_is_uploaded="+escape($('tubepro_logo_is_uploaded').value);
	vars=vars+"&tubepro_logo_name_uploaded="+escape($('tubepro_logo_name_uploaded').value);
	vars=vars+"&tubepro_logo_uploaded_width="+$('tubepro_logo_uploaded_width').value;
	vars=vars+"&tubepro_logo_uploaded_height="+$('tubepro_logo_uploaded_height').value;
	
	ExecAjax("actions/settings/tubepro_preview.php",vars,"","","EvalRefreshTubeProPreview(transport.responseText);","",true);
	setTimeout('ExecAjax("actions/settings/clear_cache.php","","","","","",true);',3000);
}

function EvalRefreshTubeProPreview(response){
	oResponse=response.evalJSON();
	if(oResponse.success==true){
		$('tubepro_preview').src=$('settings_form')["aSettings[installation_url]"].value+"index.php?template_name=tubepro&style_name=styles&tubepro_style=temp_styles&force_compile=1";
	} else {
		alertBox('Error Message','icons/error.gif',oResponse.message,300);
	}
}


function FillMobileStyles(){
	var mobile_template_name=$('settings_mobile_template_name').value;
	ExecAjax("actions/settings/get_mobile_styles.php","template_name="+mobile_template_name,"$('mobile_styles_loading').show();","","EvalFillMobileStyles(transport.responseText);","",true);
}

function EvalFillMobileStyles(response){
	$('mobile_styles_loading').hide();
	oResponse=response.evalJSON();
	if(oResponse.success==true){
		$('settings_mobile_style_name').innerHTML=oResponse.options;
	} else {
		alertBox('Error Message','icons/error.gif',oResponse.message,300);
	}
}

function AutoTranslateToggleAll(c){
	$$('.at_checkbox').each(function(element){
		element.checked=c;
	});
}

function AutoTranslate(){
	var selected_languages=0;
	var selected_labels=0;
	var vars='from=1';
	
	// Checking languages for selected
	$$('.at_to_lang_checkbox').each(function(element){
		if(element.checked==true){
			vars+='&to[]='+element.value;
			selected_languages++;
		}
	});
	
	// Checking labels for selected
	$$('.at_checkbox').each(function(element){
		if(element.checked==true){
			var label_name=element.id.replace("at_label_","");
			vars+='&text['+label_name+']='+escape($('labels_1_'+label_name).value);
			selected_labels++;
		}
	});
	
	if(selected_languages==0){
		alertBox('Error Message','icons/error.gif',"You must select, at least, 1 language to translate TO",400);
	} else if(selected_labels==0){
		alertBox('Error Message','icons/error.gif',"You must select, at least, 1 label from the English Labels Tab",450);
	} else {
		ExecAjax("actions/settings/autotranslate.php",vars,"$('autotranslate_icon').src='images/loading.gif';","","EvalAutoTranslate(transport.responseText);","",true);
	}
}

function EvalAutoTranslate(response){
	$('autotranslate_icon').src='images/icons/translate.gif';
	oResponse=response.evalJSON();
	if(oResponse.success==true){
		if(oResponse.translations_count>0){
			for(lang in oResponse.translations){
				for(label in oResponse.translations[lang]){
					var lang_id=$('lang_code_'+lang).value;
					if($('labels_'+lang_id+'_'+label)) $('labels_'+lang_id+'_'+label).value=oResponse.translations[lang][label];
				}
			}
			EnableUndoButton();
		}
		
		if(oResponse.errors_count>0){
			var sErrorMsg='The next labels could not be translated.<br><br>';
			for(lang in oResponse.errors){
				for(label in oResponse.errors[lang]){
					sErrorMsg+='Error Translating <img src="images/flags/'+lang+'.gif"> '+label+':<br>&nbsp;<img src="images/icons/report_subline.gif">&nbsp;<font size="1">'+oResponse.errors[lang][label]+'</font><br>';
				}
			}
			alertBox('Error Messages','icons/error.gif',sErrorMsg,300);
		} else {
			CloseLayer('autotranslate_layer');
		}
	} else {
		alertBox('Error Message','icons/error.gif',oResponse.message,300);
	}		
}

function SetDefaultAutoTranslateLanguage(id){
	ExecAjax("actions/settings/set_default_autotranslate_lang.php","id="+id,"$('autotranslate_icon').src='images/loading.gif';","","EvalSetDefaultAutoTranslateLanguage(transport.responseText);","",true);
}

function EvalSetDefaultAutoTranslateLanguage(response){
	oResponse=response.evalJSON();
	if(oResponse.success!=true){
		alertBox('Error Message','icons/error.gif',oResponse.message,300);
	}	
}

function SubmitLogoUploadForm(){
	// Validating file type (allowing only GIF, JPG and PNG.)
	var file=$('tubepro_logo_file_name').value;
	if(file){
		var ext=file.substr(file.length - 4).replace(".","").toLowerCase();
		
		if(ext=="gif" || ext=="jpg" || ext=="jpeg" || ext=="png"){
			$('tubepro_logo_upload_button_img').src="images/loading.gif";
			$('tubepro_logo_upload_button_text').innerHTML="Uploading...";
			$('tubepro_logo_upload_form').submit();
		} else {
			alertBox('Error Message','icons/error.gif','<b>Invalid file format.</b><br>Only GIF, JPG and PNG formats allowed.',400);
		}
	}
}

function CancelLogoUpload(){
	$('tubepro_logo_upload_iframe').src='about:blank';
	$('tubepro_logo_upload_button_img').src="images/icons/upload.png";
	$('tubepro_logo_upload_button_text').innerHTML="Browse...";
	$('tubepro_logo_name_uploaded').value='';
	$('tubepro_logo_uploaded_width').value='';
	$('tubepro_logo_uploaded_height').value='';
	$('tubepro_logo_is_uploaded').value='0';
}

function LogoUploadedOk(filename, width, height){
	$('tubepro_logo_name_uploaded').value=filename;
	$('tubepro_logo_uploaded_width').value=width;
	$('tubepro_logo_uploaded_height').value=height;
	$('tubepro_logo_file_name').value='';
	$('tubepro_logo_upload_button_img').src='images/icons/success.png';
	$('tubepro_logo_upload_button_text').innerHTML='Uploaded!';
	
	$('tubepro_logo_is_uploaded').value='1';
	EnableUndoButton();

	setTimeout("$('tubepro_logo_upload_button_img').src='images/icons/upload.png';",5000);
	setTimeout("$('tubepro_logo_upload_button_text').innerHTML='Browse...';",5000);
}

function ShowTubeproForm(){
  $('tubepro_logo_upload_form').show();
  $('tubepro_logo_upload_form').clonePosition('tubepro_position_reference',true,true,false,false);
  $('tubepro_logo_upload_form').style.width='auto';
  $('tubepro_logo_upload_form').style.height='auto';
}

function InstallFFMPEG(){
	ExecAjax("actions/settings/install_ffmpeg.php","","$('install_ffmpeg_icon').src='images/loading.gif';","","EvalInstallFFMPEG(transport.responseText);","",true);
}

function EvalInstallFFMPEG(response){
	oResponse=response.evalJSON();
	$('install_ffmpeg_icon').src='images/icons/install.png';
	if(oResponse.success==true){
		if(oResponse.ffmpeg_path) $('settings_ffmpeg_path').value=oResponse.ffmpeg_path;
		if(oResponse.ffmpeg_conversion_command) $('settings_ffmpeg_conversion_command').value=oResponse.ffmpeg_conversion_command;
		if(oResponse.mobile_ffmpeg_mp4_conversion_command) $('settings_mobile_ffmpeg_mp4_conversion_command').value=oResponse.mobile_ffmpeg_mp4_conversion_command;
		$('ffmpeg_not_installed_div').hide();
		$('ffmpeg_installed_div').show();
		alertBox('FFMPEG Installed!','icons/success.png',oResponse.message,300);
	} else {
		alertBox('Error Message','icons/error.gif',oResponse.message,300);
	}
}

function InstallQtfaststart(){
	ExecAjax("actions/settings/install_qtfaststart.php","","$('install_qtfaststart_icon').src='images/loading.gif';","","EvalInstallQtfaststart(transport.responseText);","",true);
}

function EvalInstallQtfaststart(response){
	oResponse=response.evalJSON();
	$('install_qtfaststart_icon').src='images/icons/install.png';
	if(oResponse.success==true){
		if(oResponse.qtfaststart_path) $('settings_qtfaststart_path').value=oResponse.qtfaststart_path;
		$('qtfaststart_not_installed_div').hide();
		$('qtfaststart_installed_div').show();
		alertBox('qtfaststart Installed!','icons/success.png',oResponse.message,300);
	} else {
		alertBox('Error Message','icons/error.gif',oResponse.message,300);
	}
}

function InstallAtomicParsley(){
	ExecAjax("actions/settings/install_atomicparsley.php","","$('install_atomicparsley_icon').src='images/loading.gif';","","EvalInstallAtomicParsley(transport.responseText);","",true);
}

function EvalInstallAtomicParsley(response){
	oResponse=response.evalJSON();
	$('install_atomicparsley_icon').src='images/icons/install.png';
	if(oResponse.success==true){
		if(oResponse.atomicparsley_path) $('settings_atomicparsley_path').value=oResponse.atomicparsley_path;
		$('atomicparsley_not_installed_div').hide();
		$('atomicparsley_installed_div').show();
		alertBox('AtomicParsley Installed!','icons/success.png',oResponse.message,300);
	} else {
		alertBox('Error Message','icons/error.gif',oResponse.message,300);
	}
}
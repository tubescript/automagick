function RefreshTemplates(){
	loadModule("templates","","templates_contents");
}

function InstallTemplate(id,template_name){
	ExecAjax("actions/templates/install_template.php","template="+template_name,"$('install_icon_"+id+"').src='images/loading.gif';","","EvalInstallTemplate(transport.responseText,'"+id+"');","",true);
}

function EvalInstallTemplate(response,id){
	oResponse=response.evalJSON();
	if(oResponse.success==true){
		RefreshTemplates();
	} else {
		alertBox('Error Message','icons/error.gif',oResponse.message,400);	
	}
}

function ActivateTemplate(id,template){
	var x=confirm("Are you sure you want to set this template as default?")
	if(x){
		ExecAjax("actions/templates/activate_template.php","template="+template,"$('activate_icon_"+id+"').src='images/loading.gif';","","EvalActivateTemplate(transport.responseText,'"+id+"');","",true);
	}
}

function EvalActivateTemplate(response,id){
	oResponse=response.evalJSON();
	if(oResponse.success==true){
		RefreshTemplates();
	} else {
		$('activate_icon_'+id).src='images/icons/success.png';
		alertBox('Error Message','icons/error.gif',oResponse.message,400);	
	}
}

function OpenFilesManager(id,template){
	ExecAjax("actions/templates/get_files.php","template="+template,"$('edit_icon_"+id+"').src='images/loading.gif';","","EvalOpenFilesManager(transport.responseText,'"+id+"');","",true);	
}

function EvalOpenFilesManager(response,id){
	oResponse=response.evalJSON();
	$('edit_icon_'+id).src='images/icons/edit.png';
	if(oResponse.success==true){
		var aFiles=oResponse.files;
		
		$('files_template_name').innerHTML=oResponse.template_name;
		
		var html_contents='<tr background="images/menu_bar_red.gif" align="center">' +
	      '<td><a href="javascript:void(0);" class="menu_link">File Name</a></td>' +
     	  '<td><a href="javascript:void(0);" class="menu_link">Size</a></td>' +
     	  '<td><a href="javascript:void(0);" class="menu_link">Last Modified</a></td>' +
     	  '<td><b class="white">Options</b></td>' +
	    '</tr>';
		for(i=0; i<aFiles.length; i++){
			if(i%2==0){
				var bgcolor="#D1D1D1";	
			} else {
				var bgcolor="#C9C9C9";	
			}
			
			if(aFiles[i].delete_allowed==1){
	     	    	var delete_option='<div class="option_button right ml5 pt3"><a href="javascript:void(0);" onclick="DeleteFile('+i+',\''+oResponse.template_name+'\', \''+aFiles[i].name+'\');" rel="Delete this file"><img src="images/icons/delete.png" id="delete_file_icon_'+i+'"></a></div>';
	     	    } else {
	     	    	var delete_option='<div class="option_button right ml5 pt3 disabled"><a href="javascript:void(0);" rel="Can\'t delete this file"><img src="images/icons/delete.png"></a></div>';
	     	    }
			html_contents=html_contents +
			'<tr bgcolor="'+bgcolor+'" id="file_row_'+i+'" class="file_row">' +
		      '<td><img src="images/icons/file.png"> '+aFiles[i].name+'</td>' +
	     	  '<td align="center">'+aFiles[i].size+'kb</td>' +
	     	  '<td align="center">'+aFiles[i].last_modified+'</td>' +
	     	  '<td>' +
	     	  	delete_option +
	     	    '<div class="option_button right ml5 pt3"><a href="javascript:void(0);" onclick="EditFile('+i+',\''+oResponse.template_name+'\', \''+aFiles[i].name+'\');" rel="Edit this file"><img src="images/icons/edit.png" id="edit_file_icon_'+i+'"></a></div>'+
	     	  '</td>' +
	    	'</tr>';
		}
		
		$('files_table').innerHTML=html_contents;
		ReTip();
	    OpenLayer('files_container');
	} else {
		alertBox('Error Message','icons/error.gif',oResponse.message,400);	
	}
}

function EditFile(id, template_name, file_name){
	ExecAjax("actions/templates/read_file.php","template="+template_name+"&file="+file_name,"$('edit_file_icon_"+id+"').src='images/loading.gif';","","EvalEditFile(transport.responseText,'"+id+"');","",true);		
}

function EvalEditFile(response,id){
	$('edit_file_icon_'+id).src='images/icons/edit.png';
	
	oResponse=response.evalJSON();
	if(oResponse.success==true){
		SwitchTinyTab('tab',1);
		$('template_name').value=oResponse.template_name;
		$('file_name').value=oResponse.file_name;
		EditMode();
		$('edit_file_name').innerHTML=oResponse.file_name;
		//template_editor.toggleEditor();
		//template_editor.setCode(unescape(oResponse.file_contents));
		$('template_editor').value=unescape(oResponse.file_contents);
		$('template_editor').disabled=false;
		//template_editor.toggleEditor();
		OpenLayer('edit_template_layer');
	} else {
		alertBox('Error Message','icons/error.gif',oResponse.message,500);
	}
}


function EditMode(){
	$('html_preview').hide();
	$('html_edition').show();
	
	$('editor_mode_button').hide();
	$('preview_mode_button').show();
	
	$('html_preview').innerHTML='';
}

function TempPreview(){
	$('html_preview').innerHTML='<div class="disabled" style="width:700px; height:350px; background:#000000; text-align:center;"><img src="images/loading2.gif" style="margin-top:150px;"><br><br class="br"><b class="white">Loading Preview...<br>Please, wait.</b></div>';
	$('html_edition').hide();
	$('html_preview').show();
	$('preview_mode_button').hide();
	$('editor_mode_button').show();
	
	//var file_code=escape(template_editor.getCode());
	var file_code=escape($('template_editor').value);
	ExecAjax("actions/templates/temp_preview.php","template="+$('template_name').value+"&file="+$('file_name').value+"&file_code="+file_code,"","","EvalTempPreview(transport.responseText);","",true);
}

function EvalTempPreview(response){
	oResponse=response.evalJSON();
	if(oResponse.success==true){
		$('html_preview').innerHTML='<iframe style="width:700px; height:350px; overflow:auto; border:1px solid gray; padding:1px;" src="'+oResponse.iframe_src+'"></iframe>';
	} else {
		alertBox('Error Message','icons/error.gif',oResponse.message,500);
	}
}

function SaveTemplate(){
	//var file_code=escape(template_editor.getCode());
	var file_code=escape($('template_editor').value);
	ExecAjax("actions/templates/save_template.php","template="+$('template_name').value+"&file="+$('file_name').value+"&file_code="+file_code,"$('save_template_icon').src='images/loading.gif';","","EvalSaveTemplate(transport.responseText);","",true);
}


function EvalSaveTemplate(response){
	oResponse=response.evalJSON();
	if(oResponse.success==true){
		$('save_template_icon').src='images/icons/success.png';
		setTimeout("$('save_template_icon').src='images/icons/save.png';",2000);
	} else {
		$('save_template_icon').src='images/icons/save.png';
		alertBox('Error Message','icons/error.gif',oResponse.message,500);
	}	
}

function DeleteFile(id,template_name, file_name){
	var x=confirm('Are you sure you want to delete this file?\r\nYou won\'t be able to undo this action.');
	if(x){
		ExecAjax("actions/templates/delete_template.php","template="+template_name+"&file="+file_name,"$('delete_file_icon_"+id+"').src='images/loading.gif';","","EvalDeleteFile(transport.responseText,'"+id+"');","",true);		
	}
}

function EvalDeleteFile(response,id){
	oResponse=response.evalJSON();
	if(oResponse.success==true){
		$('file_row_'+id).remove();
		ReColorizeRows(".file_row");
	} else {
		$('save_template_icon').src='images/icons/save.png';
		alertBox('Error Message','icons/error.gif',oResponse.message,500);
	}	
}

function DeleteTemp(){
	ExecAjax("actions/templates/delete_temp.php","","","","","",true);
}


function SaveStyle(template_name,style_name){
	if(template_name && style_name){
		ExecAjax("actions/templates/save_style.php","template_name="+template_name+"&style_name="+style_name,"","","EvalSaveStyle(transport.responseText);","",true);
	}
}

function EvalDeleteFile(response,id){
	oResponse=response.evalJSON();
	if(oResponse.success!=true){
		alertBox('Error Message','icons/error.gif',oResponse.message,500);
	}	
}
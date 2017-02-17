var cropper=null;

function Paginate(page){
	if(!page) page=1;
	var order=$('order').value;
	var sort=$('sort').value;
	var amount=$('amount').value;
	var filter_type=$('filter_type').value;
	var filter_value=$('filter_value').value;
	var status=$('status').value;
	var premium_access=$('premium_access').value;
	
	loadModule("users","page="+page+"&order="+order+"&sort="+sort+"&amount="+amount+"&filter_type="+filter_type+"&filter_value="+filter_value+"&status="+status+"&premium_access="+premium_access,"users_contents");
}


function OpenEditUser(id){
	if(id){
		$('mode').value="edit";
		
		$('edit_user_title').innerHTML="Edit User";
		$('edit_button_icon').src="images/icons/edit.png";
		$('edit_button_label').innerHTML="Edit User";
		$('pass_mandatory').hide();
		ExecAjax("actions/users/get_user_info.php","id="+id,"$('edit_icon_"+id+"').src='images/loading.gif';","","EvalOpenEditUser(transport.responseText,'"+id+"');","",true);
	} else {
		$('mode').value="add";
		
		$('edit_user_form').reset();
		$('edit_user_title').innerHTML="Add New User";
		$('edit_button_icon').src="images/icons/add.png";
		$('edit_button_label').innerHTML="Add User";		
		$('pass_mandatory').show();
		
		OpenLayer("edit_user_layer");
	}
}

function EvalOpenEditUser(response,id){
	$('edit_icon_'+id).src='images/icons/edit.png';
	oResponse=response.evalJSON();
	if(oResponse.data) aData=oResponse.data;
	if(oResponse.success==true){
		for(key in aData){
			if($('edit_user_'+key)) $('edit_user_'+key).value=aData[key];
		}
		if(aData.birthdate==0) $('edit_user_birthdate_formated').value="";
		if(aData.premium_from_date==0) $('edit_user_premium_from_date_formated').value="";
		if(aData.premium_to_date==0) $('edit_user_premium_to_date_formated').value="";
		
		OpenLayer("edit_user_layer");
	} else {
		alertBox('Error Message','icons/error.gif',oResponse.message,400);
	}
}


function AddEditUser(){
	var vars=$('edit_user_form').serialize();
	ExecAjax("actions/users/edit_user.php",vars,"$('edit_button_icon').src='images/loading.gif';","","EvalAddEditUser(transport.responseText);","",true);
}

function EvalAddEditUser(response){
	var mode=$('mode').value;
	oResponse=response.evalJSON();
	if(oResponse.success==true){
		$('edit_button_icon').src='images/icons/success.png';
		if(mode=="add"){
			setTimeout("$('edit_button_icon').src='images/icons/add.png';",3000);
			$('edit_user_form').reset();
		} else {
			setTimeout("$('edit_button_icon').src='images/icons/edit.png';",3000);
		}
		Paginate($('page').value);
	} else {
		if(mode=="add"){
			$('edit_button_icon').src='images/icons/add.png';
		} else {
			$('edit_button_icon').src='images/icons/edit.png';
		}
		alertBox('Error Message','icons/error.gif',oResponse.message,400);		
	}
}


function OpenUserProfile(id){
	ExecAjax("actions/users/get_user_info.php","id="+id,"if($('profile_icon_"+id+"')) $('profile_icon_"+id+"').src='images/loading.gif';","","EvalOpenUserProfile(transport.responseText,'"+id+"');","",true);	
}

function EvalOpenUserProfile(response,id){
	if($('profile_icon_'+id)) $('profile_icon_'+id).src='images/icons/info.png';
	
	oResponse=response.evalJSON();
	if(oResponse.data) aData=oResponse.data;
	if(oResponse.success==true){
		for(key in aData){
			if($('profile_'+key)) $('profile_'+key).innerHTML=aData[key];
		}
		
		if(aData.avatar){
			if(aData.avatar.match(/^users\//i)) aData.avatar="../"+aData.avatar;
			$('profile_avatar').innerHTML='<img src="'+aData.avatar+'" width="120" height="120" class="avatar">';
		} else {
			$('profile_avatar').innerHTML='<img src="../users/noavatar.jpg" width="120" height="120" class="avatar">';
		}
		if(aData.date_added==0){
			$('profile_birthdate_formated').innerHTML="Unknown";
		} else {
			var splitted_date=aData.date_added_formated.split(" ");
			$('profile_date_added_formated').innerHTML=splitted_date[0];
		}
		if(aData.birthdate==0){
			$('profile_birthdate_formated').innerHTML="Unknown";
		} else {
			var splitted_date=aData.birthdate_formated.split(" ");
			$('profile_birthdate_formated').innerHTML=splitted_date[0];
		}
		if(aData.country_flag!=""){
			$('profile_country_flag').src='images/flags/'+aData.country_flag+'.gif';
		} else {
			$('profile_country_flag').src='images/flags/0.gif'	;
		}
		
		$('profile_gender_icon').src='images/icons/gender_'+aData.gender+'.png';
		
		if(aData.premium_started){
			var splitted_from_date=aData.premium_from_date_formated.split(" ");
			var splitted_to_date=aData.premium_to_date_formated.split(" ");
			$('profile_premium_access').innerHTML='<img src="images/icons/premium.png"> <b>'+aData.premium_remaining+' Rem.</b><br><b class="ml5">&nbsp;&nbsp;&nbsp;Start: </b>'+splitted_from_date[0]+'<br><b class="ml5">&nbsp;&nbsp;&nbsp;End:</b> '+splitted_to_date[0];
		} else {
			$('profile_premium_access').innerHTML='<b>No Premium Access</b>';
		}

		
		OpenLayer("user_profile_layer");
	} else {
		alertBox('Error Message','icons/error.gif',oResponse.message,400);		
	}
}

function OpenEditAvatar(id){
	$('avatar_user_id').value=id;
	$('user_avatar').value="";
	$('user_avatar_filename').value="";
	
	$('image_crop_fieldset').hide();
	$('image_preview_fieldset').hide();
	$('file_upload_fieldset').show();
	CheckUploadButton('');
	OpenLayer('user_avatar_layer');
}

function AvatarUpload(){
	var file=$('user_avatar').value;
	if(file){
		var ext=file.substr(file.length - 4).replace(".","").toLowerCase();
		
		if(ext=="jpg" || ext=="jpeg" || ext=="gif" || ext=="png"){
			$('avatar_upload_form').submit();	
		} else {
			alertBox('Error Message','icons/error.gif','<b>Invalid file format.</b><br>Only JPG, GIF and PNG formats allowed.',400);	
		}
	}	
}

function EvalAvatarUpload(filename,w,h){
	$('uploaded_avatar').src="";
	$('uploaded_avatar').src="temp/"+filename;
	$('uploaded_avatar').rel="temp/"+filename;
	$('real_width').value=w;
	$('real_height').value=h;
	
	if(w>500){
		var resized_height=h*500/w;
				
		$('uploaded_avatar').style.width='500px';
		$('uploaded_avatar').width='500';
		$('uploaded_avatar').height=Math.round(resized_height);
		$('uploaded_avatar').style.height='auto';
		//$('uploaded_avatar_container').style.width='500px';
		cropper_size=Math.round(resized_height*120/h);
		LoadCropper(cropper_size,cropper_size,500,Math.round(resized_height),w,h);
	} else {
		$('uploaded_avatar').width=w;
		$('uploaded_avatar').height=w;
		//$('uploaded_avatar_container').style.width=w+'px';
		LoadCropper(120,120,w,h,w,h);
	}
	
	$('file_upload_fieldset').hide();
	$('image_crop_fieldset').show();
	$('image_preview_fieldset').show();
}

function DeleteAvatar(id){
	var x=confirm("Are you sure you want to delete the user avatar?");
	var id=$('avatar_user_id').value;
	if(x){
		ExecAjax("actions/users/delete_avatar.php","ids=["+id+"]","$('delete_avatar_icon').src='images/loading.gif';","","EvalDeleteAvatar(transport.responseText,'"+id+"');","",true);
	}
}

function EvalDeleteAvatar(response,id){
	oResponse=response.evalJSON();
	if(oResponse.success==true){
		$('delete_avatar_icon').src='images/icons/success.png';
		setTimeout("$('delete_avatar_icon').src='images/icons/delete-tiny.png';",3000);
		$('avatar_option_'+id).rel="<b>Edit User's Avatar</b><br><div  class='avatar'><img src='../users/noavatar.jpg' width='120' height='120'></div>";
		ReTip('avatar_option_'+id);
	} else {
		$('delete_avatar_icon').src='images/icons/delete-tiny.png';
		alertBox('Error Message','icons/error.gif',oResponse.message,400);
	}		
}

function ResendConfirmationMail(id){
	var x=confirm("Are you sure you want to resend a Confirmation E-mail to this user?");
	if(x){
		ExecAjax("actions/users/send_confirmation_mail.php","ids=["+id+"]","$('resend_mail_icon_"+id+"').src='images/loading.gif';","","EvalResendConfirmationMail(transport.responseText,'"+id+"');","",true);
	}
}

function EvalResendConfirmationMail(response,id){
	oResponse=response.evalJSON();
	if(oResponse.success==true){
		$('resend_mail_icon_'+id).src='images/icons/success.png';
		setTimeout("$('resend_mail_icon_"+id+"').src='images/icons/mail_check.png';",3000);
	} else {
		$('resend_mail_icon_'+id).src='images/icons/mail_check.png';
		alertBox('Error Message','icons/error.gif',unescape(oResponse.message),400);
	}
}

function ActivateUser(id){
	var x=confirm("Are you sure you want to activate this user?");
	if(x){
		ExecAjax("actions/users/set_status.php","ids=["+id+"]&status=1","$('activate_icon_"+id+"').src='images/loading.gif';","","EvalActivateUser(transport.responseText,'"+id+"');","",true);		
	}
}

function EvalActivateUser(response,id){
	$('activate_icon_'+id).src='images/icons/success.png';
	oResponse=response.evalJSON();
	if(oResponse.success==true){
		$('activate_user_option_'+id).hide();
		$('ban_user_option_'+id).show();
		
		$('user_status_'+id).removeClassName('red');
		$('user_status_'+id).removeClassName('green');
		$('user_status_'+id).addClassName('green');
		$('user_status_'+id).innerHTML="Active";
		
		$('user_name_'+id).removeClassName('red');
		$('user_name_'+id).removeClassName('green');
		$('user_name_'+id).addClassName('green');
		$('user_name_'+id).innerHTML=$('user_name_'+id).innerHTML.replace(/^\* | \*$/g,'');
	} else {
		
		alertBox('Error Message','icons/error.gif',oResponse.message,400);
	}	
}

function BanUser(id){
	var x=confirm("Are you sure you want to ban this user?");
	if(x){
		ExecAjax("actions/users/set_status.php","ids=["+id+"]&status=2","$('ban_icon_"+id+"').src='images/loading.gif';","","EvalBanUser(transport.responseText,'"+id+"');","",true);
	}
}

function EvalBanUser(response,id){
	$('ban_icon_'+id).src='images/icons/forbidden.png';
	oResponse=response.evalJSON();
	if(oResponse.success==true){
		$('ban_user_option_'+id).hide();
		$('activate_user_option_'+id).show();
		
		$('user_status_'+id).removeClassName('red');
		$('user_status_'+id).removeClassName('green');
		$('user_status_'+id).addClassName('red');
		$('user_status_'+id).innerHTML="Banned";
		
		$('user_name_'+id).removeClassName('red');
		$('user_name_'+id).removeClassName('green');
		$('user_name_'+id).addClassName('red');
		if(!$('user_name_'+id).innerHTML.match(/^\* /)){
			$('user_name_'+id).innerHTML="* "+$('user_name_'+id).innerHTML+" *";
		}
	} else {
		alertBox('Error Message','icons/error.gif',oResponse.message,400);
	}	
}


function DeleteUser(id){
	var x=confirm("Are you sure you want to Delete this user?\r\nAll his comments and statistics will be deleted as well.");
	if(x){
		ExecAjax("actions/users/delete_user.php","ids=["+id+"]","$('delete_icon_"+id+"').src='images/loading.gif';","","EvalDeleteUser(transport.responseText,'"+id+"');","",true);
	}	
}

function EvalDeleteUser(response,id){
	$('delete_icon_'+id).src='images/icons/delete.png';
	oResponse=response.evalJSON();
	if(oResponse.success==true){
		$('row_'+id).remove();
		ReColorizeRows('.user_row');
	} else {
		alertBox('Error Message','icons/error.gif',oResponse.message,400);
	}	
}


function ActionOnSelected(){
	var value=$('selected_action').value;

	var aIds=[];
	$$('.user_cb').each(function(element){
		if(element && element.checked==true) aIds.push(parseInt(element.value));
	});

	var x=false;
	
	if(aIds.length>0 && value!=""){
		switch(value){
			case "1":
				x=confirm("Are you sure you want to Activate the selected Users?");
				if(x){
					ExecAjax("actions/users/set_status.php","ids="+aIds.toJSON()+"&status=1","","","EvalActionOnSelected(transport.responseText,'"+value+"');","POST",true);
				}
			break;
			case "2":
				x=confirm("Are you sure you want to Ban the selected Users?");
				if(x){
					ExecAjax("actions/users/set_status.php","ids="+aIds.toJSON()+"&status=2","","","EvalActionOnSelected(transport.responseText,'"+value+"');","POST",true);
				}
			break;
			case "3":
				x=confirm("Are you sure you want to Delete the selected Users?\r\nAll their comments and statistics will be deleted as well.");
				if(x){
					ExecAjax("actions/users/delete_user.php","ids="+aIds.toJSON(),"","","EvalActionOnSelected(transport.responseText,'"+value+"');","POST",true);
				}
			break;
			case "4":
				x=confirm("Are you sure you want to Resend a Confirmation E-mail to the selected Users?");
				if(x){
					ExecAjax("actions/users/send_confirmation_mail.php","ids="+aIds.toJSON(),"","","EvalActionOnSelected(transport.responseText,'"+value+"');","POST",true);
				}
			break;
			case "5":
				var recipients="";
				for(i=0; i<aIds.length; i++){
					recipients=recipients + $('user_email_'+aIds[i]).innerHTML + "; ";
				}
				OpenMailForm(recipients,'');
			break;
		}
		if(x) $('selected_action_loading_img').show();
	}
}

function EvalActionOnSelected(response,value){
	$('selected_action_loading_img').hide();
	oResponse=response.evalJSON();
	switch(value){
		case "1":
			if(oResponse.ids && oResponse.ids.length>0){
				aIds=oResponse.ids;
				for(i=0; i<aIds.length; i++){
					EvalActivateUser('{"success":true}',aIds[i]);
				}
			}
		break;
		case "2":
			if(oResponse.ids && oResponse.ids.length>0){
				aIds=oResponse.ids;
				for(i=0; i<aIds.length; i++){
					EvalBanUser('{"success":true}',aIds[i]);
				}
			}
		break;
		case "3":
			if(oResponse.ids && oResponse.ids.length>0){
				aIds=oResponse.ids;
				for(i=0; i<aIds.length; i++){
					EvalDeleteUser('{"success":true}',aIds[i]);
				}
			}
		break;
		case "4":
			if(oResponse.success==true){
				alertBox('Success','icons/success.png',oResponse.message,400);
			} else {
				alertBox('Error Message','icons/error.gif',unescape(oResponse.message),600);	
			}
		break;
	}
}

function CheckUncheck(){
	var checked=$('check_uncheck_all').checked;
	$$('.user_cb').each(function(element){
		element.checked=checked;
	});
}

function CheckUploadButton(v){
	if(v){
		$('avatar_upload_button_disabled').hide();
		$('avatar_upload_button').show();
	} else {
		$('avatar_upload_button').hide();
		$('avatar_upload_button_disabled').show();
	}	
}

function LoadCropper(w,h,fw,fh,ow,oh){
	if(!cropper){
		cropper=new Cropper.ImgWithPreview('uploaded_avatar', {previewWrap:'avatar_preview', previewDim:{x:120,y:120}, minWidth:w, minHeight:h, forcedWidth:fw, forcedHeight:fh, originalWidth:ow, originalHeight:oh, ratioDim:{x:w,y:h},displayOnInit:false, onEndCrop:setDimensions} );
	} else {
		cropper.remove();
		cropper=null;
		LoadCropper(w,h,fw,fh,ow,oh);
	}
}

function setDimensions(coords,dimensions){
	$('cropped_x1').value=coords.x1;
	$('cropped_y1').value=coords.y1;
	$('cropped_x2').value=coords.x2;
	$('cropped_y2').value=coords.y2;
	$('cropped_width').value=dimensions.width;
	$('cropped_height').value=dimensions.height;
}

function CropAvatar(){
	var filename=$('uploaded_avatar').rel;
	var id=$('avatar_user_id').value;
	var x1=$('cropped_x1').value;
	var y1=$('cropped_y1').value;
	var cw=$('cropped_width').value;
	var ch=$('cropped_height').value;
	var rw=$('real_width').value
	var rh=$('real_height').value
	ExecAjax("actions/users/crop_avatar.php","user_id="+id+"&filename="+escape(filename)+"&cw="+cw+"&ch="+ch+"&rw="+rw+"&rh="+rh+"&x1="+x1+"&y1="+y1,"$('save_avatar_icon').src='images/loading.gif';","","EvalCropAvatar(transport.responseText,'"+id+"')","",true);
}

function EvalCropAvatar(response,id){
	$('save_avatar_icon').src='images/icons/save.png';
	oResponse=response.evalJSON();
	if(oResponse.success==true){
		$('avatar_option_'+id).rel="<b>Edit User's Avatar</b><br><div  class='avatar'><img src='"+oResponse.filename+"' width='120' height='120'></div>";
		ReTip('avatar_option_'+id);
		CloseLayer('user_avatar_layer');
	} else {
		alertBox('Error Message','icons/error.gif',oResponse.message,400);
	}
}
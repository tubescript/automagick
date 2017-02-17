var cropper=null;


function OpenEditProfileLayer(id){
	ExecAjax("actions/profile/get_user_info.php","id="+id,"","","EvalGetProfile(transport.responseText);","",true);
}

function EvalGetProfile(response){
	var aResponse=response.evalJSON()
	if(aResponse.success==true){
		var aUser=aResponse.aUser;
		
		for(key in aUser){
			if($('edit_user_'+key)){
				if($('edit_user_'+key).type=="checkbox"){
					$('edit_user_'+key).checked=(aUser[key]==0 ? false :true );
				} else {
					$('edit_user_'+key).value=aUser[key];
				}
			}
		}		
		
		$('edit_profile_layer').show();
	} else{
		alert(aResponse.message);
	}
	
}

function GenerateRandomPassword(id){
	chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
	pass = "";
	for(x=0;x<8;x++)
	{
		i = Math.floor(Math.random() * chars.length);
		pass += chars.charAt(i);
	}
	$(id).value=pass;
}

function EditUserProfile(){
	var f=$('edit_form');
	$('edit_user_success_msg').hide();
	$('edit_user_error_msg').hide();
	var vars=f.serialize();
	ExecAjax("actions/profile/edit_user.php",vars,"","","EvalEditUserProfile(transport.responseText);","",true);
}

function EvalEditUserProfile(response){
	aResponse=response.evalJSON();
	if(aResponse.success==true){
		$('edit_user_success_msg').innerHTML=aResponse.message;
		$('edit_user_success_msg').show();
	} else {
		$('edit_user_error_msg').innerHTML=aResponse.message;
		$('edit_user_error_msg').show();
	}
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

function AvatarUpload(){
	var file=$('user_avatar').value;
	if(file){
		var ext=file.substr(file.length - 4).replace(".","").toLowerCase();
		if(ext=="jpg" || ext=="jpeg" || ext=="gif" || ext=="png"){
			$('avatar_upload_form').submit();
		} else {
			alert(aLabels['file_format_invalid']);
		}
	}	
}


function CancelCropAvatar(){
	$('image_crop_fieldset').hide();
	$('image_preview_fieldset').hide();
	$('file_upload_fieldset').show();
	CheckUploadButton('');
	OpenLayer('user_avatar_layer');
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
		$('uploaded_avatar').height=h;
		//$('uploaded_avatar_container').style.width=w+'px';
		LoadCropper(120,120,w,h,w,h);
	}
	
	$('file_upload_fieldset').hide();
	$('image_crop_fieldset').show();
	$('image_preview_fieldset').show();
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
	var x1=$('cropped_x1').value;
	var y1=$('cropped_y1').value;
	var cw=$('cropped_width').value;
	var ch=$('cropped_height').value;
	var rw=$('real_width').value
	var rh=$('real_height').value
	ExecAjax("actions/profile/crop_avatar.php","filename="+escape(filename)+"&cw="+cw+"&ch="+ch+"&rw="+rw+"&rh="+rh+"&x1="+x1+"&y1="+y1,"","","EvalCropAvatar(transport.responseText)","",true);
}

function EvalCropAvatar(response){
	aResponse=response.evalJSON();
	if(aResponse.success==true){
		$('user_avatar_img').src=aResponse.filename;
		CancelCropAvatar();
	} else {
		alert(aResponse.message);
	}
}

function DeleteVideo(id){
	var x=confirm(aLabels['delete_video_confirm']);
	if(x) ExecAjax("actions/profile/delete_video.php","id="+id,"$('img_delete_"+id+"').src='templates/"+template+"/images/loading.gif';","","EvalDeleteVideo(transport.responseText,'"+id+"');","POST",true);
}

function EvalDeleteVideo(response,id){
	oResponse=response.evalJSON();
	if(oResponse.success==true){
		$('video_'+id).remove();
	} else {
		alert(oResponse.message);
		$('img_delete_'+id).src='templates/'+template+'/images/delete.png';
	}
}
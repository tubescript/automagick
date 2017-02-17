function PaginateComments(page,video_id){
	if(!page) page=1;
	loadModule("comments","page="+page+"&video_id="+video_id,"comments_contents","OpenLayer('comments_layer');");
}

function EnterEditMode(id){
	$('edit_comment_'+id).value=$('comment_text_'+id).innerHTML.strip().replace(/<br>/g,"\r\n");
	$('comment_text_'+id).hide();
	$('edit_comment_'+id).show();

	$('edit_comment_button_'+id).hide();
	$('save_comment_button_'+id).show();
}

function CancelEditMode(id){
	$('edit_comment_'+id).hide();
	$('comment_text_'+id).show();

	$('save_comment_button_'+id).hide();
	$('edit_comment_button_'+id).show();
}

function SaveComment(id){
	if(!$('edit_comment_'+id).value){
		alertBox('Error Message','icons/error.gif',"<b>Comment can't be empty</b>",400);
	} else {
		var comment=escape($('edit_comment_'+id).value)
		ExecAjax("actions/comments/edit_comment.php","id="+id+"&comment="+comment,"$('save_comment_icon_"+id+"').src='images/loading.gif';","","EvalSaveComment(transport.responseText,'"+id+"');","",true);
	}
}

function EvalSaveComment(response,id){
	$('save_comment_icon_'+id).src='images/icons/little_check.png';
	oResponse=response.evalJSON();
	if(oResponse.success==true){
		var replaced=$('edit_comment_'+id).value.replace(/\r\n|\n/g,"<br>");
		$('comment_text_'+id).innerHTML=replaced;
		CancelEditMode(id);
	} else {
		alertBox('Error Message','icons/error.gif',oResponse.message,400);
	}
}

function DeleteComment(id,video_id){
	var x=confirm("Are you sure you want to delete this comment?");
	if(x){
		ExecAjax("actions/comments/delete_comment.php","id="+id,"$('delete_comment_icon_"+id+"').src='images/loading.gif';","","EvalDeleteComment(transport.responseText,'"+id+"','"+video_id+"');","",true);
	}	
}

function EvalDeleteComment(response,id,video_id){
	oResponse=response.evalJSON();
	if(oResponse.success==true){
		PaginateComments($('comments_page').value,video_id);
	} else {
		$('delete_comment_icon_'+id).src='images/icons/delete-tiny.png';
		alertBox('Error Message','icons/error.gif',oResponse.message,400);
	}
}

function SetStatus(id,status){
	if(status==1){
		img='activate_comment_icon_'+id;
	} else {
		img='deactivate_comment_icon_'+id;
	}
	ExecAjax("actions/comments/set_status.php","id="+id+"&status="+status,"$('"+img+"').src='images/loading.gif';","","EvalSetStatus(transport.responseText,'"+id+"','"+status+"');","",true);
}

function EvalSetStatus(response,id,status){
	oResponse=response.evalJSON();
	if(status==1){
		img_id='activate_comment_icon_'+id;
		img="active.png";
	} else {
		img_id='deactivate_comment_icon_'+id;
		img="inactive.png";
	}
	$(img_id).src='images/icons/'+img;
	
	if(oResponse.success==true){
		if(status==1){
			$('activate_comment_button_'+id).hide();
			$('deactivate_comment_button_'+id).show();
			$('comment_fieldset_'+id).removeClassName('border_red');
		} else {
			$('deactivate_comment_button_'+id).hide();
			$('activate_comment_button_'+id).show();
			$('comment_fieldset_'+id).addClassName('border_red');
		}
	} else {
		alertBox('Error Message','icons/error.gif',oResponse.message,400);
	}		
}
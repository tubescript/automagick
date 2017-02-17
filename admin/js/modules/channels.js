function AddChannel(){
	ExecAjax("actions/channels/add_channel.php","","$('add_channel_icon').src='images/loading.gif';","","EvalAddChannel(transport.responseText);","",true);
}

function EvalAddChannel(response){
	$('add_channel_icon').src='images/icons/add.png';
	oResponse=response.evalJSON();
	var channel_id=oResponse.id;
	if(oResponse.success==true){
		var lastChild=$('move_channel_id').childElements();
		Element.insert(lastChild[(lastChild.length-1)],{'after':'<option value="'+channel_id+'" id="channel_option_'+channel_id+'" class="red">New Channel '+channel_id+'</option>'});
		Refresh();
	} else {
		alertBox('Error Message','icons/error.gif',oResponse.message,400);
	}
}

function OpenEditChannel(id){
	$('edit_channel_id').value=id;
	
	ExecAjax("actions/channels/get_channel_info.php","id="+id,"$('edit_channel_img_"+id+"').src='images/loading.gif';","","EvalOpenEditChannel(transport.responseText);","",true);
}

function EvalOpenEditChannel(response){
	var id=$('edit_channel_id').value;
	$('edit_channel_img_'+id).src='images/icons/edit.png';
	
	oResponse=response.evalJSON();
	if(oResponse.success==true){
		aChannelInfo=oResponse.info;
		aChannelInfo['thumb']="";
		if(aChannelInfo){
			for(key in aChannelInfo){
				if($('edit_channel_'+key)){
					$('edit_channel_'+key).value=aChannelInfo[key];
				}
			}
		}
		$('edit_channel_thumb').value="";
		OpenLayer("edit_channel_layer");	
	} else {
		alertBox('Error Message','icons/error.gif',oResponse.message,400);
	}
}


function EditChannel(){
	if(!$('edit_channel_name').value){
		alertBox('Error Message','icons/error.gif',"Name field is mandatory.",300);
	} else {
		$('edit_channel_icon').src='images/loading.gif';
		$('edit_channel_form').submit();
	}
}

function EvalEditChannel(response){
	oResponse=response.evalJSON();
	if(oResponse.success==true){
		$('edit_channel_icon').src='images/icons/success.png';
		setTimeout("$('edit_channel_icon').src='images/icons/edit.png';",2000);
		
		var id=$('edit_channel_id').value;
		var name=$('edit_channel_name').value;
		
		$('channel_option_'+id).innerHTML=name;
		Refresh();
	} else {
		$('edit_channel_icon').src='images/icons/edit.png';
		alertBox('Error Message','icons/error.gif',oResponse.message,400);
	}	
}


function OpenDeleteChannelLayer(id){
	$('channel_delete_id').value=id;
	
	var channels_length=$('move_channel_id').options.length;
	
	for(i=0; i<channels_length; i++){
		if($('move_channel_id').options[i].value!="") $('move_channel_id').options[i].disabled=false;
	}
	if($('channel_option_'+id)){
		$('channel_option_'+id).disabled=true;
	}	
	$('select_channel').selected=true;
	
	OpenLayer('channel_delete_layer');
}

function DeleteChannel(){
	var x=confirm("Delete Confirmation");
	if(x){
		var id=$('channel_delete_id').value;
		var action=$('delete_action').value;
		var channel_id=$('move_channel_id').value;

		ExecAjax("actions/channels/delete_channel.php","id="+id+"&action="+action+"&channel_id="+channel_id,"$('channel_delete_icon').src='images/loading.gif';","","EvalDeleteChannel(transport.responseText);","",true);
	}
}

function EvalDeleteChannel(response){
	var id=$('channel_delete_id').value;
	$('channel_delete_icon').src='images/icons/delete-tiny.png';
	oResponse=response.evalJSON();	
	if(oResponse.success==true){
		$('channel_delete_id').value='';
		CloseLayer('channel_delete_layer');
		$('channel_option_'+id).remove();
		Refresh();
	} else {
		alertBox('Error Message','icons/error.gif',oResponse.message,400);
	}
}



function SetStatus(id,status){
	ExecAjax("actions/channels/set_status.php","id="+id+"&status="+status,"","","EvalSetStatus(transport.responseText,'"+id+"','"+status+"');","",true);
}

function EvalSetStatus(response,id,status){
	oResponse=response.evalJSON();
	if(oResponse.success==true){
		if(status==1){
			$('img_status_channel_'+id).src="images/icons/active.png";
			$('img_status_channel_'+id).onmouseover=function(){this.src='images/icons/stop.png';}
			$('img_status_channel_'+id).onmouseout=function(){this.src='images/icons/active.png';}
			$('img_status_channel_'+id).onclick=function(){SetStatus(id,0);}
			$('channel_label_'+id).removeClassName('red');
			$('channel_thumb_'+id).className='thumb';				
			$('channel_option_'+id).removeClassName('red');
		} else {
			$('img_status_channel_'+id).src="images/icons/inactive.png";
			$('img_status_channel_'+id).onmouseover=function(){this.src='images/icons/go.png';}
			$('img_status_channel_'+id).onmouseout=function(){this.src='images/icons/inactive.png';}
			$('img_status_channel_'+id).onclick=function(){SetStatus(id,1);}
			$('channel_label_'+id).addClassName('red');
			$('channel_thumb_'+id).className='thumb_error';
			$('channel_option_'+id).addClassName('red');
		}
	} else {
		alertBox('Error Message','icons/error.gif',oResponse.message,400);	
	}	
}


function appendOptionLast(id,group_id){
	var elOptNew = document.createElement('option');
	elOptNew.text = 'New Group';
	elOptNew.value = id;
	elOptNew.id = 'gd_option_'+id;
	var elSel = document.getElementById('gd_group_id');
	
	try {
		elSel.add(elOptNew, null); // standards compliant; doesn't work in IE
	} catch(ex) {
		elSel.add(elOptNew); // IE only
	}
}

function Refresh(){
	loadModule("channels",'','channels_divs_container');
}
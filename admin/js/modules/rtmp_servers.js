function OpenRTMPServersManager(){
	RefreshRTMPServers();
}

function RefreshRTMPServers(){
	ExecAjax("index.php?module=rtmp_servers","onlymod=1","if($('rtmp_servers_refresh_icon')){$('rtmp_servers_refresh_icon').src='images/loading.gif';}","","EvalRefreshRTMPServers(transport.responseText);","",true);
}

function EvalRefreshRTMPServers(response){
	if($('rtmp_servers_refresh_icon')){$('rtmp_servers_refresh_icon').src='images/icons/refresh.png';}
	if(response){
		$('rtmp_servers_contents').innerHTML=response;
		OpenLayer('rtmp_servers_layer');
		ReSpinner();
		ReColorizeRows('.server_row');
		$$('.retip').each(function(el){
			ReTip(el);
		});
		
		$$('.readonly_checkbox').each(function(el){
			el.onclick=function(){
				return readOnlyCheckBox();
			}
		});
	}	
}

var server_info=[];

function EnableServerEditMode(id){

	SaveTempData(id);
	
	$('server_status_option_'+id).hide();
	$('edit_server_option_'+id).hide();
	$('undo_server_option_'+id).show();
	$('save_server_option_'+id).show();
	$('spinner_buttons_'+id).show();
	
	$$('.edition_'+id).each(function(el){
		if(el.type=="checkbox"){
			el.removeClassName('disabled');
			el.onclick='';
		} else {
			el.style.border='';
			el.style.margin='0px';
			el.style.background='';
			el.readOnly=false;
		}
		
	});	
}

function DisableServerEditMode(id){
	$('undo_server_option_'+id).hide();
	$('save_server_option_'+id).hide();
	$('spinner_buttons_'+id).hide();
	$('server_status_option_'+id).show();
	$('edit_server_option_'+id).show();
	
	$$('.edition_'+id).each(function(el){
		if(el.type=="checkbox"){
			el.addClassName('disabled');
			el.onclick=function(){
				return readOnlyCheckBox();
			}
		} else {
			el.style.border='0px';
			el.style.margin='1px';
			el.style.background='transparent';
			el.readOnly=true;
		}
	});
}

function SaveTempData(id){
	server_info['server']=$('server_server_'+id).value;
	server_info['host']=$('server_host_'+id).value;
	server_info['port']=$('server_port_'+id).value;
	server_info['user']=$('server_user_'+id).value;
	server_info['pass']=$('server_pass_'+id).value;
	server_info['remove_ext']=$('server_remove_ext_'+id).checked;
	server_info['add_mp4']=$('server_add_mp4_'+id).checked;
}

function RestoreTempData(id){
	$('server_server_'+id).value=server_info['server'];
	$('server_host_'+id).value=server_info['host'];
	$('server_port_'+id).value=server_info['port'];
	$('server_user_'+id).value=server_info['user'];
	$('server_pass_'+id).value=server_info['pass'];
	$('server_remove_ext_'+id).checked=server_info['remove_ext'];
	$('server_add_mp4_'+id).checked=server_info['add_mp4'];
}

function ClearTempData(){
	server_info=[];
}

function UndoServerEditMode(id){
	RestoreTempData(id);
	DisableServerEditMode(id);
}

function SaveServerInfo(id){
	var server=$('server_server_'+id).value;
	var host=$('server_host_'+id).value;
	var port=$('server_port_'+id).value;
	var user=$('server_user_'+id).value;
	var pass=$('server_pass_'+id).value;
	var remove_ext=$('server_remove_ext_'+id).checked ? 1 : 0;
	var add_mp4=$('server_add_mp4_'+id).checked ? 1 : 0;
	
	ExecAjax("actions/settings/save_rtmp_server.php","id="+id+"&server="+escape(server)+"&host="+escape(host)+"&port="+escape(port)+"&user="+escape(user)+"&pass="+escape(pass)+"&remove_ext="+remove_ext+"&add_mp4="+add_mp4,"$('save_server_icon_"+id+"').src='images/loading.gif';","","EvalSaveServerInfo(transport.responseText,'"+id+"');","",true);
}

function EvalSaveServerInfo(response,id){
	oResponse=response.evalJSON();
	if(oResponse.success==true){
		SaveTempData(id);
		$('save_server_icon_'+id).src='images/icons/success.png';
		setTimeout("DisableServerEditMode('"+id+"'); ClearTempData(); $('save_server_icon_"+id+"').src='images/icons/save.png';",1500);
	} else {
		alertBox('Error Message','icons/error.gif',oResponse.message,300);
	}		
}

function readOnlyCheckBox(){
	return false;
}

function AddRTMPServer(){
	ExecAjax("actions/settings/add_rtmp_server.php","","$('rtmp_servers_add_icon').src='images/loading.gif';","","EvalAddRTMPServer(transport.responseText);","",true);	
}

function EvalAddRTMPServer(response){
	oResponse=response.evalJSON();
	if(oResponse.success==true){
		RefreshRTMPServers();
	} else {
		alertBox('Error Message','icons/error.gif',oResponse.message,300);
	}
}


function DeleteRTMPServer(id){
	var x=confirm("Are you sure you want to delete this RTMP Server?\r\nAll videos hosted on this server will be played using pseudostreaming.\r\nIt is recommended to deactivate only. Delete only if you know you don't have videos on this server.");
	if(x){
		ExecAjax("actions/settings/delete_rtmp_server.php","id="+id,"$('delete_server_icon_"+id+"').src='images/loading.gif';","","EvalDeleteRTMPServer(transport.responseText,'"+id+"');","",true);	
	}
}

function EvalDeleteRTMPServer(response,id){
	oResponse=response.evalJSON();
	if(oResponse.success==true){
		$('server_row_'+id).remove();
		ReColorizeRows('.server_row');
	} else {
		alertBox('Error Message','icons/error.gif',oResponse.message,300);
	}
}


function SetServerStatus(id,status){
	ExecAjax("actions/settings/set_server_status.php","id="+id+"&status="+status,"$('status_server_icon_"+id+"').src='images/loading.gif';","","EvalSetServerStatus(transport.responseText,'"+id+"','"+status+"');","",true);
}

function EvalSetServerStatus(response,id,status){
	oResponse=response.evalJSON();
	if(oResponse.success==true){
		if(status==0){
			$('status_server_icon_'+id).src='images/icons/inactive.png';
			$('status_server_icon_'+id).onmouseover=function(){$('status_server_icon_'+id).src='images/icons/go.png';};
			$('status_server_icon_'+id).onmouseout=function(){$('status_server_icon_'+id).src='images/icons/inactive.png';};
			$('status_server_icon_'+id).onclick=function(){SetServerStatus(id,1);};
		} else {
			$('status_server_icon_'+id).src='images/icons/active.png';
			$('status_server_icon_'+id).onmouseover=function(){$('status_server_icon_'+id).src='images/icons/stop.png';};
			$('status_server_icon_'+id).onmouseout=function(){$('status_server_icon_'+id).src='images/icons/active.png';};
			$('status_server_icon_'+id).onclick=function(){SetServerStatus(id,0);};
		}
	} else {
		alertBox('Error Message','icons/error.gif',oResponse.message,300);
	}	
}

function OpenRTMPInstructions(){
	alertBox('RTMP Servers Instructions','icons/help.png',$('rtmp_instructions_contents').innerHTML,700);
}
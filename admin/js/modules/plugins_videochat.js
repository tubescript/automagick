function SaveConfig(){
	var vars=$('videochat_form').serialize();
	ExecAjax("actions/plugins_videochat/save_config.php",vars,"$('save_icon').src='images/loading.gif';","","EvalSaveConfig(transport.responseText);","",true);
}

function EvalSaveConfig(response){
	oResponse=response.evalJSON();
	if(oResponse.success==true){
		$('save_icon').src='images/icons/success.png';
		setTimeout("$('save_icon').src='images/icons/save.png';",2000);
	} else {
		$('save_icon').src='images/icons/save.png';
		alertBox('Migration Error','icons/error.gif',oResponse.message,450);
	}		
}

function UpdatePreviewIframe(){
	$('preview_iframe').src='http://ads.sexier.com/BannerV1.ashx?template='+$('plugin_videochat_template_id').value+'&wid='+$('plugin_videochat_wid').value+'&LinkID='+$('plugin_videochat_program').value+'&promocode=BCODE82A48667_00000&QueryID='+$('plugin_videochat_category').value+'&cid=8';
}
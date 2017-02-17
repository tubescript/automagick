function InstallUpdates(current_version, update_key){
	$('log_window').innerHTML='';
	AddLog("<b>Updates Installation Started...</b>");
	$('updates_iframe').src="actions/updates/install_updates.php?current_version="+current_version+"&update_key="+update_key;
	OpenLayer("log_layer");
	$('update_button').addClassName('disabled');
	$('update_button').onclick="";
	$('view_log_button').show();
}

function AddLog(string, not_lb){
	var lb = (!not_lb) ? "<br>" : "";
	$('log_window').innerHTML=$('log_window').innerHTML + string + lb;
}
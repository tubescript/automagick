function AnalyzeData(){
	$('msg_error').hide();
	
	var host=$('database_host').value;
	var user=$('database_user').value;
	var pass=$('database_pass').value;
	var name=$('database_name').value;
	var installation_url=$('installation_url').value;
	
	if($('import_categories').checked){
		var import_categories=1;
	} else {
		var import_categories=0;
	}
	if($('only_active').checked){
		var only_active=1;
	} else {
		var only_active=0;
	}

	if(!host || !user || !pass || !name || !installation_url){
		$('error_msg').innerHTML="Complete All fields";
		OpenLayer('msg_error');
	} else {		
		ExecAjax("actions/migration/analyze.php","host="+host+"&user="+user+"&pass="+pass+"&name="+name+"&installation_url="+installation_url+"&import_categories="+import_categories+"&only_active="+only_active,"$('analyze_button').hide(); $('analyze_button_disabled').show();","","EvalAnalyzeData(transport.responseText);","",true);		
	}
}

function EvalAnalyzeData(response){
	$('analyze_button_disabled').hide();
	$('analyze_button').show();
	
	oResponse=response.evalJSON();
	if(oResponse.success==true){
		alertBox('Analysis Result','icons/info.png',oResponse.message,450);
	} else {
		$('error_msg').innerHTML=oResponse.message;
		OpenLayer('msg_error');
	}	
}


function MigrateData(){
	$('msg_error').hide();
	var vars=$('migration_form').serialize();
	
	var host=$('database_host').value;
	var user=$('database_user').value;
	var pass=$('database_pass').value;
	var name=$('database_name').value;
	var installation_url=$('installation_url').value;

	if($('only_active').checked){
		var only_active=1;
	} else {
		var only_active=0;
	}
	if($('use_old_ids').checked){
		var use_old_ids=1;
	} else {
		var use_old_ids=0;
	}

	if(!host || !user || !pass || !name || !installation_url){
		CloseLayer("alertbox");
		$('error_msg').innerHTML="Complete All fields to proceed with migration.";
		OpenLayer('msg_error');
	} else {		
		ExecAjax("actions/migration/migrate.php","host="+host+"&user="+user+"&pass="+pass+"&name="+name+"&installation_url="+installation_url+"&only_active="+only_active+"&use_old_ids="+use_old_ids+"&"+vars,"$('migrate_button').hide(); $('migrate_button_disabled').show();","","EvalMigrateData(transport.responseText);","",true);
	}
}

function EvalMigrateData(response){
	$('migrate_button_disabled').hide();
	$('migrate_button').show();
	
	oResponse=response.evalJSON();
	if(oResponse.success==true){
		alertBox('Migration Report','icons/info.png',oResponse.message,450);
	} else {
		alertBox('Migration Error','icons/error.gif',oResponse.message,450);
	}	
}
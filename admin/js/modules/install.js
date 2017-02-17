function RunInstall(){
	$('error_div').hide();
	$('success_div').hide();
	
	var host=$('database_host').value;
	var user=$('database_user').value;
	var pass=$('database_pass').value;
	var name=$('database_name').value;
	var license_number=$('license_number').value;
	
	if(!host || !user || !pass || !name || !license_number){
		$('error_msg').innerHTML="All fields are required.";
		OpenLayer('error_div');
	} else if(pass.match("'")){
		$('error_msg').innerHTML="Database Password cannot contain single quotes (').";
		OpenLayer('error_div');
	} else {
		$('install_button').hide();
		$('install_button_disabled').show(); 
		ExecAjax("actions/install/install.php","host="+host+"&user="+user+"&pass="+escape(pass)+"&name="+name+"&license_number="+license_number,"$('install_icon').src='images/loading.gif';","","EvalRunInstall(transport.responseText);","",true);
	}
}

function EvalRunInstall(response){
	$('install_icon').src='images/icons/install.png';
	oResponse=response.evalJSON();
	if(oResponse.success==true){
		OpenLayer('success_div');
	} else {
		$('error_msg').innerHTML=oResponse.message;
		OpenLayer('error_div');

		$('install_button_disabled').hide(); 
		$('install_button').show();
	}	
}
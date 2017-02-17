function Login(){
	$('msg_error').hide();	
	var error_msg="";
	var user=$('login_form').user.value;
	var pass=$('login_form').pass.value;

	if(!user || !pass){
		$('error_msg').innerHTML="Complete Username and Password Fields";
		OpenLayer('msg_error');
		setTimeout("CloseLayer('msg_error');",3000);
	} else {
		ExecAjax("actions/login.php","user="+user+"&pass="+pass,"$('img_loading').show();","","$('img_loading').hide(); LoginEval(transport.responseText);","",true);		
	}
}

function LoginEval(response){
	if(response=="OK"){
		window.location.reload();
	} else {
		$('error_msg').innerHTML="Bad User/Pass Combination";
		OpenLayer('msg_error');
		setTimeout("CloseLayer('msg_error');",3000);
	}	
}
// General Functions
function ExecAjax(url,parameters,func_create,func_success,func_complete,func_error,async,method,timeout){
	var rand = Math.round(Math.random() * 99999);
	parameters=rand+"&"+parameters;
	
	if(async!=true){async=false;}else{async=true;}
	if(!method){method="POST";}
	if(!timeout){timeout=60;}
	var result = new String();
	var objetoAjax = new Ajax.Request(
		url,
		{
			method: method, 
			requestTimeout: timeout,
			encoding: 'UTF-8',
			parameters: parameters, 
			onCreate : function(){if(func_create) eval(func_create);},
			onSuccess : function(){if(func_success) eval(func_success);},
			onComplete: function(transport){
				//alert("Ajax Result: "+transport.responseText);
				eval(func_complete);
			},
			onFailure:  function(){
				if(func_error==null){
					alert("Error: Action has not been executed correctly.");
				} else {
					eval(func_error);
				}
			},
			asynchronous : async
		});
	return result;
}

function OpenLayer(div_id){
	$(div_id).show();
	
}
function CloseLayer(div_id){
	$(div_id).hide();
}

function FavAddVideo(video_id,update){
	ExecAjax("actions/fav_status.php","video_id="+video_id+"&status=1","","","EvalFavStatus(transport.responseText,'"+video_id+"',1);","",true,"POST",60);
}

function FavRemoveVideo(video_id,update){
	ExecAjax("actions/fav_status.php","video_id="+video_id+"&status=0","","","EvalFavStatus(transport.responseText,'"+video_id+"',0);","",true,"POST",60);
}

function EvalFavStatus(response,video_id,status){
	var aResponse=response.evalJSON()
	if(aResponse.success==true){
		if(status==1){
			if($('favstar_off_'+video_id)) $('favstar_off_'+video_id).hide();
			if($('favstar_on_'+video_id)) $('favstar_on_'+video_id).show();
		} else {
			if($('favstar_on_'+video_id)) $('favstar_on_'+video_id).hide();
			if($('favstar_off_'+video_id)) $('favstar_off_'+video_id).show();
		}		
	} else {
		alert(aResponse.message);
	}	
}

function SwitchTab(group,tab){
	var regexp=new RegExp("^"+group+"_");
	$$('.tab_info').each(function(element){
		if(regexp.test(element.id)){
			element.removeClassName('tab_upload');
		}
	});
	$(group+'_'+tab).addClassName('tab_upload');
}

function HideByClassName(classname){
	var aElements=$$(classname);
	aElements.each(function(element){
		element.hide();
	});
}

function ShowByClassName(classname){
	var aElements=$$(classname);
	aElements.each(function(element){
		element.show();
	});
}

function readCookie(name) {
	var nameEQ = name + "=";
	var ca = document.cookie.split(';');
	for(var i=0;i < ca.length;i++) {
		var c = ca[i];
		while (c.charAt(0)==' ') c = c.substring(1,c.length);
		if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
	}
	return null;
}


function UserLogin(){
	$('login_error_msg').hide();
	var user=$('login_form').user_login.value;
	var pass=$('login_form').pass_login.value;
	if(!user){
		$('login_error_msg').innerHTML=aLabels['username_required'];
		$('login_error_msg').show();
	} else if(!pass){
		$('login_error_msg').innerHTML=aLabels['password_required'];
		$('login_error_msg').show();
	} else {
		ExecAjax("actions/login.php","user="+user+"&pass="+pass,"","","EvalUserLogin(transport.responseText);","",true,"POST",60);
	}
}

function EvalUserLogin(response){
	var aResponse=response.evalJSON()
	if(aResponse.success==true){
		window.location.reload();
	} else{
		$('login_error_msg').innerHTML=aResponse.message;
		$('login_error_msg').show();
	}	
}

function SendRecoverEmail(email){
	$('forgot_error_msg').hide();
	$('forgot_success_msg').hide();
	if(!email){
		$('forgot_error_msg').innerHTML=aLabels['email_required'];
		$('forgot_error_msg').show();
	} else {
		ExecAjax("actions/recover_password.php","email="+email,"","","EvalRecoverEmail(transport.responseText);","",true,"POST",60);
	}
}

function EvalRecoverEmail(response){
	var aResponse=response.evalJSON()
	if(aResponse.success==true){
		$('forgot_success_msg').innerHTML=aResponse.message;
		$('forgot_success_msg').show();
		$('user_email').value='';
	} else{
		$('forgot_error_msg').innerHTML=aResponse.message;
		$('forgot_error_msg').show();
	}		
}

function UserRegister(f){
	$('register_error_msg').hide();
	$('register_success_msg').hide();
	var f=$('register_form');
	
	var user=f.user.value;
	var pass=f.pass.value;
	var email=f.email.value;
	
	if(!user){
		$('register_error_msg').innerHTML=aLabels['username_required'];
		$('register_error_msg').show();
	} else if(!pass){
		$('register_error_msg').innerHTML=aLabels['password_required'];
		$('register_error_msg').show();
	} else if(!email){
		$('register_error_msg').innerHTML=aLabels['email_required'];
		$('register_error_msg').show();
	} else if(!email.match(/\b[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}\b/)){
		$('register_error_msg').innerHTML=aLabels['email_missmatch'];
		$('register_error_msg').show();
	} else {
		ExecAjax("actions/register.php","user="+user+"&pass="+pass+"&email="+email,"","","EvalUserRegister(transport.responseText);","",true,"POST",60);
	}
}

function EvalUserRegister(response){
	var aResponse=response.evalJSON()
	if(aResponse.success==true){
		$('register_error_msg').hide();
		$('register_success_msg').show();
	} else {
		$('register_success_msg').hide();
		$('register_error_msg').innerHTML=aResponse.message;
		$('register_error_msg').show();
	}
}

function loadModule(module,vars,div_id,aditional_functions) {
	if(!aditional_functions) aditional_functions="";
	ExecAjax("index.php?module="+module,"onlymod=1&"+vars,"","","$('"+div_id+"').innerHTML=transport.responseText; "+aditional_functions,"",true);
}

function DisbleUploadButton(){
	$('upload_button').hide();
	$('upload_button_disabled').show();
	$('upload_loading').show();	
}

function EnableUploadButton(){
	$('upload_button_disabled').hide();
	$('upload_button').show();
	$('upload_loading').hide();	
}

function EvalVideoUpload(){
	EnableUploadButton();
	$('upload_form').reset();
	$('upload_success').show();
}

/* File Input stylizer functions */
if (!window.SI) { var SI = {}; };
SI.Files =
{
	htmlClass : 'SI-FILES-STYLIZED',
	fileClass : 'file',
	wrapClass : 'cabinet',
	
	fini : false,
	able : false,
	init : function()
	{
		this.fini = true;
		
		var ie = 0 //@cc_on + @_jscript_version
		if (window.opera || (ie && ie < 5.5) || !document.getElementsByTagName) { return; } // no support for opacity or the DOM
		this.able = true;
		
		var html = document.getElementsByTagName('html')[0];
		html.className += (html.className != '' ? ' ' : '') + this.htmlClass;
	},
	
	stylize : function(elem)
	{
		if (!this.fini) { this.init(); };
		if (!this.able) { return; };
		
		elem.parentNode.file = elem;
		elem.parentNode.onmousemove = function(e)
		{
			if (typeof e == 'undefined') e = window.event;
			if (typeof e.pageY == 'undefined' &&  typeof e.clientX == 'number' && document.documentElement)
			{
				e.pageX = e.clientX + document.documentElement.scrollLeft;
				e.pageY = e.clientY + document.documentElement.scrollTop;
			};

			var ox = oy = 0;
			var elem = this;
			if (elem.offsetParent)
			{
				ox = elem.offsetLeft;
				oy = elem.offsetTop;
				while (elem = elem.offsetParent)
				{
					ox += elem.offsetLeft;
					oy += elem.offsetTop;
				};
			};

			var x = e.pageX - ox;
			var y = e.pageY - oy;
			var w = this.file.offsetWidth;
			var h = this.file.offsetHeight;

			this.file.style.top		= y - (h / 2)  + 'px';
			this.file.style.left	= x - (w - 30) + 'px';
		};
	},
	
	stylizeById : function(id)
	{
		this.stylize(document.getElementById(id));
	},
	
	stylizeAll : function()
	{
		if (!this.fini) { this.init(); };
		if (!this.able) { return; };
		
		var inputs = document.getElementsByTagName('input');
		for (var i = 0; i < inputs.length; i++)
		{
			var input = inputs[i];
			if (input.type == 'file' && input.className.indexOf(this.fileClass) != -1 && input.parentNode.className.indexOf(this.wrapClass) != -1)
			{
				this.stylize(input);
			};
		};
	}
};
SI.Files.stylizeAll();


// Thumbs rotation functions
// -------------------------
var thumbs_cache=[];
var thumb_interval='';
var thumb_index=0;
var hover=[];
var ajax_running=0;


function StartThumbRotation(thumb_id,video_id){
	StopThumbRotation(thumb_id,video_id);
	hover[video_id]=1;
	thumb_index=0;
	if(ajax_running==0){
		if(!thumbs_cache[video_id]){
			ajax_running=1;
			thumbs_cache[video_id]="";
			ExecAjax("actions/video/get_thumbs_list.php","video_id="+video_id,"","","ExecThumbRotation('"+thumb_id+"','"+video_id+"',transport.responseText);","",true,"POST");
		} else {
			ExecThumbRotation(thumb_id,video_id,'{"success":true,"thumbs":'+thumbs_cache[video_id].toJSON()+'}');
		}
	}
}

function ExecThumbRotation(thumb_id,video_id,response){
	oResponse=response.evalJSON();
	ajax_running=0;
	if(oResponse.success==true){
		thumbs_cache[video_id]=oResponse.thumbs;
		
		if(hover[video_id]==1){
			var pics=[];
			for(i=0;i<oResponse.thumbs.length;i++){
				pics[i]= new Image(164,124);
		     	pics[i].src=oResponse.thumbs[i];
			}
			thumb_interval=setInterval("NextThumb('"+thumb_id+"','"+video_id+"');",500);
		} else {
			StopThumbRotation(thumb_id,video_id);	
		}
	} else {
		thumbs_cache[video_id]='{"success":false}';
	}
}

function NextThumb(thumb_id,video_id){
	if(hover[video_id]==1 && ajax_running==0 && thumbs_cache[video_id]){
		var t=thumbs_cache[video_id];
		
		if(thumb_index>=t.length-1 || thumb_index==-1){
			thumb_index=0;
		} else {
			thumb_index++;
		}	
		if(t[thumb_index] && $(thumb_id)) $(thumb_id).src=t[thumb_index];
	}
}

function StopThumbRotation(thumb_id,video_id){
	clearInterval(thumb_interval);
	thumb_index=-1;
	NextThumb(thumb_id,video_id);
	hover[video_id]=0;
}

function ValidateUpload(){
	$('upload_success').hide();
	DisbleUploadButton();
	var f=$('upload_form');
	if(f.upload_title.value && f.upload_description.value && f.upload_tags.value && f.upload_file.value && f.upload_categories.getValue().length>0){
		$('upload_form').submit();
	} else {
		EnableUploadButton();
		alert(aLabels['all_fields_required']);
		return false;
	}
}
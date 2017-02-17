var MouseX="";
var MouseY="";

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
	new Effect.Appear(div_id, {duration: 0.15});
	
}
function CloseLayer(div_id){
	new Effect.Fade(div_id, {duration: 0.15});
}

function ToggleLayer(div_id){
	if($(div_id).visible()){
		new Effect.BlindUp(div_id, {duration: 0.15});
		new Effect.Fade(div_id, {duration: 0.15});
	} else {
		new Effect.BlindDown(div_id, {duration: 0.15});
		new Effect.Appear(div_id, {duration: 0.15});
	}	
}

function TogglePull(div_id,img_id,type){
	if($(div_id).visible()){
		new Effect.BlindUp(div_id, {duration: 0.2});
		if(type==2){
			setTimeout("$('"+img_id+"').src='images/pull_down2.png';",200);
		} else {
			setTimeout("$('"+img_id+"').src='images/pull_down.png';",200);
		}
	} else {
		new Effect.BlindDown(div_id, {duration: 0.2});
		if(type==2){
			setTimeout("$('"+img_id+"').src='images/pull_up2.png';",200);
		} else {
			setTimeout("$('"+img_id+"').src='images/pull_up.png';",200);
		}
	}	
}

function ToggleFold(div_id,cookie_name,img_div1,img_div2){
	if($(div_id).visible()){
		new Effect.BlindUp(div_id, 	{duration: 0.1});
		if(cookie_name) document.cookie =cookie_name+'=1; expires=Fri, 28 Aug 2026 20:47:11 UTC; path=/'
		if(img_div1 && img_div2){
			$(img_div1).hide();
			$(img_div2).show();
		}
	} else {
		new Effect.BlindDown(div_id, {duration: 0.1});
		if(cookie_name) document.cookie =cookie_name+'=0; expires=Fri, 28 Aug 2026 20:47:11 UTC; path=/'
		if(img_div1 && img_div2){
			$(img_div2).hide();
			$(img_div1).show();
		}
	}	
}

function ToggleSelectAll(checked,classname){
	if(checked==true){
		$$(classname).each(function(element){
			if(element.disabled==false){
				element.checked=false;
				element.click();
			}
		});
	} else {
		$$(classname).each(function(element){
			if(element.disabled==false){
				element.checked=true;
				element.click();
			}
		});
	}
}

function MoreLess(id){
	if(!$(id).visible()){
		$(id+'_moreless').src="images/less.gif"
	} else {
		$(id+'_moreless').src="images/more.gif"
	}
}

function ShowModalMessage(div_id){
	new Effect.BlindDown(div_id, {duration: 0.15});
}

function HideModalMessage(div_id){
	new Effect.BlindUp(div_id, {duration: 0.15});
}

function SetMessage(id,msg){
	$(id).innerHTML=msg;
}

function SwitchTab(group,tab){
	var regexp=new RegExp("^"+group+"_");
	$$('.tab_active').each(function(element){
		if(regexp.test(element.id)){
			element.removeClassName('tab_active');
			element.addClassName('tab');
		}
	});
	$(group+'_'+tab).removeClassName('tab');
	$(group+'_'+tab).addClassName('tab_active');
}

function SwitchTinyTab(group,tab){
	var regexp=new RegExp("^"+group+"_");
	$$('.tinytab_active').each(function(element){
		if(regexp.test(element.id)){
			element.className='tinytab';
		}
	});
	$(group+'_'+tab).className="tinytab_active";
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

function GenerateRandomPassword(id){
	chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890{}[],;:-_+*$&%@";
	pass = "";
	for(x=0;x<12;x++)
	{
		i = Math.floor(Math.random() * chars.length);
		pass += chars.charAt(i);
	}
	$(id).value=pass;
}

function toClipBoard(text2copy) {
  if (window.clipboardData) {
    window.clipboardData.setData("Text",text2copy);
  } else {
    var flashcopier = 'flashcopier';
    if(!document.getElementById(flashcopier)) {
      var divholder = document.createElement('div');
      divholder.id = flashcopier;
      document.body.appendChild(divholder);
    }
    document.getElementById(flashcopier).innerHTML = '';
    var divinfo = '<embed src="images/_clipboard.swf" FlashVars="clipboard='+escape(text2copy)+'" width="0" height="0" type="application/x-shockwave-flash"></embed>';
    document.getElementById(flashcopier).innerHTML = divinfo;
  }
}

function loadModule(module,vars,div_id,aditional_functions) {
	if(!aditional_functions) aditional_functions="";
	ExecAjax("index.php?module="+module,"onlymod=1&"+vars,"OpenLayer('main_loading');","","$('"+div_id+"').innerHTML=transport.responseText; CloseLayer('main_loading'); ReTip(); "+aditional_functions,"",true);
}

function getMouseCoordinates(e){
	MouseX = Event.pointerX(e);
	MouseY = Event.pointerY(e); 
}

function ReTip(id){
	var aElements=[];
	if(id){
		aElements[0]=$(id);
	} else {
		aElements=$$('a[rel]');
	} 
	
	var aOptions=[];
	aElements.each(function(element){
	  
		if(element.rel.isJSON()){
			aTip=element.rel.evalJSON();
			
			var title=aTip.title ? aTip.title : '<img src="images/icons/help.png"> Help';
			var stem=aTip.stem ? aTip.stem : 'bottomMiddle';
			var hook_target=aTip.hook_target ? aTip.hook_target : 'topMiddle';
			var hook_tip=aTip.hook_tip ? aTip.hook_tip : 'bottomMiddle';
			var width=aTip.width ? aTip.width : 'auto';
			
			if(title){
				new Tip(element, aTip.value, {
			    	style: 'automagick',
			    	className: 'automagick',
			    	title: title,
			    	border: 1,
			    	borderColor:'#000000',
			    	radius: 1,
			    	stem: stem,
			    	hook:{target:hook_target, tip:hook_tip, mouse:true},
			    	width:width
				});
			} else {
				new Tip(element, aTip.value, {
			    	style: 'automagick',
			    	className: 'automagick2',
			    	border: 1,
			    	borderColor:'#000000',
			    	radius: 1,
			    	stem: stem,
			    	hook:{target:hook_target, tip:hook_tip, mouse:true},
			    	width:width
				});
			}
		} else {
			aOptions=element.rel.split("||"); // value||stem||target||tip_hook
			if(!aOptions[0] || aOptions[0]=='null' || aOptions[0]=='') aOptions[0]=element.rel;
			if(!aOptions[1]) aOptions[1]="bottomMiddle";
			if(!aOptions[2]) aOptions[2]="topMiddle";
			if(!aOptions[3]) aOptions[3]="bottomMiddle";
			
			if(!title) title='<img src="images/icons/help.png"> Help';

			new Tip(element, aOptions[0], {
		    	style: 'automagick',
		    	className: 'automagick2',
		    	border: 1,
		    	borderColor:'#000000',
		    	radius: 1,
		    	stem:aOptions[1],
		    	hook:{target: aOptions[2], tip: aOptions[3], mouse:true},
		    	width:'auto'
			});
		}
	});
}

function ReDraggables(classname){
	$$(classname).each(function(element){
		new Draggable(element, {
			scroll: window,
			handle:'draggable_handle',
			revert: true
		});	
	});
}

function ReColorizeRows(classname){
	var i=0;
	$$(classname).each(function(element){
		if(i%2==0){
			var bgcolor="#D1D1D1";
		} else {
			var bgcolor="#C9C9C9";
		}
		element.style.backgroundColor=bgcolor;
		i++;
	});
}

function ReCalendar(id){
	var aElements=[];
	if(id){
		aElements[0]=$(id);
	} else {
		aElements=$$('.recalendar');
	}
	
	aElements.each(function(el){
		var name=el.id.replace("_"+el.value,"");
		Calendar.setup({inputField: name+"_input_"+el.value, button: name+"_img_"+el.value,ifFormat:"%Y-%m-%d", align: "Tr"});
	});
}

function ReSpinner(id){
	var aElements=[];
	if(id){
		aElements[0]=$(id);
	} else {
		aElements=$$('.respinner');
	}
	
	aElements.each(function(el){
		var id=el.id.match(/_[0-9]+$/);
		id=id[0].replace("_","");
		var name=el.id.replace(/_[0-9]+$/,"");
		new SpinnerControl(name+'_'+id, name+'_'+id+'_up', name+'_'+id+'_down', {interval:1, min:0});
	});
}

function alertBox(title,image,message,width,height,overflow_y){
	if(!width) width=300;
	if(!height) height=350;
	$('alertbox_message').style.width=width+'px';
	$('alertbox_title').innerHTML=title;
	if(image) $('alertbox_image').innerHTML='<img src="images/'+image+'" border="0" align="absmiddle">';
	if(overflow_y){
		$('alertbox_message').style.overflowY='auto';
		$('alertbox_message').style.whiteSpace='nowrap';
	}
	$('alertbox_message').innerHTML=message;
	$('alertbox').show();
}


function OpenMailForm(recipient,subject){
	$('mailform_success_msg').hide();
	
	if(!recipient) recipient='';
	if(!subject) subject='';
	$('mailform_to').value=recipient;
	$('mailform_subject').value=subject;
	$('mailform_message').value="";
	tinyMCE.getInstanceById('mailform_message').getBody().innerHTML = ""
	
	OpenLayer('mailform');
}

function CloseMailForm(){
	var x=confirm("Are you sure you want to close this window?\r\nAll changes will be lost and the message will not be sent.");
	if(x){
		CloseLayer('mailform');
	}
}

function SendMail(){
	tinyMCE.triggerSave();
	
	var recipient=$('mailform_to').value;
	var subject=$('mailform_subject').value;
	var message=$('mailform_message').value;
	
	var error=false;
	if(!recipient){
		error="<b>Add at least, 1 recipient.</b>";
	} else if(!subject){
		error="<b>Subject is required.</b>";
	} else if(!message){
		error="<b>Message can't be empty.</b>";
	}
	if(error){
		alertBox('Error Message','icons/error.gif',error,400);
	} else {
		ExecAjax("actions/sendmail.php","recipient="+escape(recipient)+"&subject="+escape(subject)+"&message="+escape(message),"$('sendmail_icon').src='images/loading.gif';","","EvalSendMail(transport.responseText);","",true);
	}
}

function EvalSendMail(response){
	$('sendmail_icon').src='images/icons/mail_tiny.png';
	oResponse=response.evalJSON();
	if(oResponse.success==true){
		OpenLayer('mailform_success_msg');
	} else {
		alertBox('Error Message','icons/error.gif',unescape(oResponse.message),400);
	}	
}



function moveTo(container, element){
	Position.prepare();
	container_y = Position.cumulativeOffset($(container))[1]
	element_y = Position.cumulativeOffset($(element))[1]
	new Effect.Scroll(container, {x:0, y:(element_y-container_y)});
	return false;
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
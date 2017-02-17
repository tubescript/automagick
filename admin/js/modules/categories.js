var categories_cached=[];

function SwitchGroupTab(group_id,refresh){
	SwitchTab('group',group_id);
	HideByClassName('.categs_div');
	$('current_group').value=group_id;
	if(!categories_cached[group_id] || refresh==1){
		ExecAjax("actions/categories/get_group_categs.php","id="+group_id,"$('refresh_icon').src='images/loading.gif';","","EvalGetGroupCategs(transport.responseText);","",true);
	} else {
		$('categs_div_'+group_id).show();
	}
}

function EvalGetGroupCategs(response){
	$('refresh_icon').src='images/icons/refresh.png';
	oResponse=response.evalJSON();
	var group_id=oResponse.group_id;
	var aCategories=oResponse.categories;
	
	categories_cached[group_id]=1;
	
	if(oResponse.success==true){
		 //contents=contents + '<table align="center" cellpadding="4" cellspacing="4">';
		 
		var contents="";
		if(aCategories && aCategories.length>0){
			for(i=0; i<aCategories.length; i++){
				var thumbnail=aCategories[i].thumb ? aCategories[i].thumb : "../thumbs/nothumb.jpg";
				if(thumbnail.match(/^thumbs\//)){
					thumbnail="../"+thumbnail;
				}
				
				if(aCategories[i].status==0){
					var status_color='class="red";';
					var thumb_class="thumb_error";
					var status_img='<img id="img_status_categ_'+aCategories[i].id+'" src="images/icons/inactive.png" onmouseover="this.src=\'images/icons/go.png\';" onmouseout="this.src=\'images/icons/inactive.png\';" onclick="SetStatus(\'categ\','+aCategories[i].id+',1);" style="margin-right:5px;">';
				} else {
					var status_color='';
					var thumb_class="thumb";
					var status_img='<img id="img_status_categ_'+aCategories[i].id+'" src="images/icons/active.png"  onmouseover="this.src=\'images/icons/stop.png\';" onmouseout="this.src=\'images/icons/active.png\';" onclick="SetStatus(\'categ\','+aCategories[i].id+',0);" style="margin-right:5px;">';
				}
				
				if(aCategories[i].forward_to!=0){
					forward_code='<div style="float:left; padding-top:2px;"><a href="javascript:void(0);" rel="<b>Category forwarded to:</b><br>'+aCategories[i].forward_to_group+' - '+aCategories[i].forward_to_categ+'"><img src="images/icons/categ_forwarded.png"></a></div>';
				} else {
					forward_code='';	
				}

				contents=contents + 
					//'<td>' +
					  '<fieldset class="fieldset2 draggable2 left" id="categ_'+aCategories[i].id+'" style="width:190px; margin:8px;"><div class="bottom" style="padding:10px;">' + 
					    '<div class="left">' + status_img + '<b '+status_color+' id="categ_label_'+aCategories[i].id+'">'+aCategories[i].name+'</b></div>' +
					    '<div class="right" style="margin-top:3px;"><a class="draggable_handle" rel="Drag this category into any of the groups<br>above to move it or copy it (holding Ctrl key)."><img src="images/icons/categ_drag.png"></a></div><br><br class="br">' +
					    '<div class="'+thumb_class+'" id="categ_thumb_'+aCategories[i].id+'"><img src="'+thumbnail+'" width="164" height="124"></div>' +
					    '<br class="br" stlye="clear:both;">' +
					    '<b>' + aCategories[i].videos_count + ' Videos</b>' +
					    '<br class="br">' +
					    forward_code +
					    '<div class="option_button" style="float:right; padding-top:3px;"><a href="javascript:void(0);" onclick="OpenDeleteCategLayer('+aCategories[i].id+');" rel="<b>Delete Category</b>"><img src="images/icons/delete.png" id="delete_categ_img_'+aCategories[i].id+'"></a></div>' +
					    '<div class="option_button" style="float:right; padding-top:3px;  margin-right:3px;"><a href="javascript:void(0);" onclick="OpenEditCateg('+aCategories[i].id+');" rel="<b>Edit Category</b>"><img src="images/icons/edit.png" id="edit_categ_img_'+aCategories[i].id+'"></a></div>' +
					    '<br class="br">' +
					  '</div></fieldset>';
					//'</td>';
				
				//if((i+1)%4==0) contents=contents + '</tr><tr>';
			}
			//contents=contents + '</table>';
			
		} else {
			var contents="";
		}
		
		$('categs_div_'+group_id).innerHTML=contents;		
		$('categs_div_'+group_id).show();
		ReTip();
		ReDraggables('.draggable2');
	} else {
		alertBox('Error Message','icons/error.gif',oResponse.message,400);
	}
}

function AddCateg(){
	var group_id=$('current_group').value;
	if(group_id){
		ExecAjax("actions/categories/add_category.php","group_id="+group_id,"$('add_categ_icon').src='images/loading.gif';","","EvalAddCateg(transport.responseText,'"+group_id+"');","",true);
	} else {
		alertBox('Error Message','icons/error.gif',"Select a Group first",300);	
	}
}

function EvalAddCateg(response,group_id){
	$('add_categ_icon').src='images/icons/add.png';
	oResponse=response.evalJSON();
	var categ_id=oResponse.id;
	if(oResponse.success==true){
		SwitchGroupTab(group_id,1);		
		Element.insert($('group_option_'+group_id),{'after':'<option value="'+categ_id+'" id="cd_option_'+categ_id+'" class="red">&nbsp;&nbsp;&nbsp;&nbsp;New Category '+categ_id+'</option>'});
		Element.insert($('edit_group_option_'+group_id),{'after':'<option value="'+categ_id+'" id="edit_cd_option_'+categ_id+'" class="red">&nbsp;&nbsp;&nbsp;&nbsp;New Category '+categ_id+'</option>'});
	} else {
		alertBox('Error Message','icons/error.gif',oResponse.message,400);
	}
}

function MoveCateg(categ_id,old_group_id, group_id,copy){
	if(old_group_id==group_id){
		alertBox('Error Message','icons/error.gif',"The category is already in this group. No need to move it.",400);
	} else {
		if(copy){
			var action="COPY";
			var additional="\r\nThis action is the same as creating a new category with the same properties in this group.\r\nNo videos are being moved.";
		} else {
			var action="MOVE";	
			var additional="";
		}
		x=confirm("Are you sure you want to "+ action +" the category to this group?"+additional);
		if(x){
			ExecAjax("actions/categories/move_categ.php","categ_id="+categ_id+"&old_group_id="+old_group_id+"&group_id="+group_id+"&copy="+copy,"","","EvalMoveCateg(transport.responseText,'"+categ_id+"','"+old_group_id+"','"+group_id+"','"+copy+"');","",true);
		}
	}
}

function EvalMoveCateg(response,categ_id,old_group_id,group_id,copy){
	oResponse=response.evalJSON();
	
	if(oResponse.success==true){
		if(copy==false){
			$('categ_'+categ_id).hide();
		} else {
			SwitchGroupTab(old_group_id,1);
		}
	} else {
		alertBox('Error Message','icons/error.gif',oResponse.message,400);
	}
}

function OpenEditCateg(id){
	$('edit_categ_id').value=id;
	
	ExecAjax("actions/categories/get_categ_info.php","id="+id,"$('edit_categ_img_"+id+"').src='images/loading.gif';","","EvalOpenEditCateg(transport.responseText);","",true);
}

function EvalOpenEditCateg(response){
	var id=$('edit_categ_id').value;
	$('edit_categ_img_'+id).src='images/icons/edit.png';
	
	oResponse=response.evalJSON();
	if(oResponse.success==true){
		aCategInfo=oResponse.info;
		aCategInfo['thumb']="";
		for(key in aCategInfo){
			if($('edit_categ_'+key)){
				$('edit_categ_'+key).value=aCategInfo[key];
			}
		}
		$('edit_categ_thumb').value="";
		OpenLayer("edit_category_layer");	
	} else {
		alertBox('Error Message','icons/error.gif',oResponse.message,400);
	}
}


function EditCateg(){
	if(!$('edit_categ_name').value){
		alertBox('Error Message','icons/error.gif',"Name field is mandatory.",300);
	} else {
		$('edit_categ_icon').src='images/loading.gif';
		$('edit_categ_group_id').value=$('current_group').value;
		$('edit_categ_form').submit();
	}
}

function EvalEditCateg(response){
	oResponse=response.evalJSON();
	if(oResponse.success==true){
		$('edit_categ_icon').src='images/icons/success.png';
		setTimeout("$('edit_categ_icon').src='images/icons/edit.png';",2000);
		SwitchGroupTab($('current_group').value,1);
		
		var id=$('edit_categ_id').value;
		var name=$('edit_categ_name').value;
		$('cd_option_'+id).innerHTML=name;
		$('edit_cd_option_'+id).innerHTML=name;
	} else {
		$('edit_categ_icon').src='images/icons/edit.png';
		alertBox('Error Message','icons/error.gif',oResponse.message,400);
	}	
}


function OpenDeleteCategLayer(id){
	$('categ_delete_id').value=id;
	
	var categs_length=$('cd_categ_id').options.length;
	
	for(i=0; i<categs_length; i++){
		if($('cd_categ_id').options[i].value!="") $('cd_categ_id').options[i].disabled=false;
		//$('cd_categ_id').options[i].style.color='#000000';
	}
	if($('cd_option_'+id)){
		//$('cd_option_'+id).style.color='#999999';
		$('cd_option_'+id).disabled=true;
	}	
	$('select_categ').selected=true;
	
	OpenLayer('categ_delete_layer');
}

function DeleteCategory(){
	var x=confirm("Delete Confirmation");
	if(x){
		var id=$('categ_delete_id').value;
		
		if(id!=1){
			var action=$('cd_categ_action').value;
			var categ_id=$('cd_categ_id').value;
	
			ExecAjax("actions/categories/delete_category.php","id="+id+"&action="+action+"&categ_id="+categ_id,"$('gd_delete_icon').src='images/loading.gif';","","EvalDeleteCategory(transport.responseText);","",true);
		} else {
			alertBox('Error Message','icons/error.gif',"You can't delete this category.",400);
		}
	}
}

function EvalDeleteCategory(response){
	var id=$('categ_delete_id').value;
	$('gd_delete_icon').src='images/icons/delete-tiny.png';
	oResponse=response.evalJSON();	
	if(oResponse.success==true){
		
		
		$('categ_delete_id').value=''; CloseLayer('categ_delete_layer');
		
		$('categ_'+id).remove();
		$('cd_option_'+id).remove();
		$('edit_cd_option_'+id).remove();
	} else {
		alertBox('Error Message','icons/error.gif',oResponse.message,400);
	}
}



function AddGroup(){
	ExecAjax("actions/categories/add_group.php","","$('gd_add_icon').src='images/loading.gif';","","EvalAddGroup(transport.responseText);","",true);
}


function EvalAddGroup(response){
	$('gd_add_icon').src="images/icons/add-tiny.png";
	
	oResponse=response.evalJSON();
	if(oResponse.success==true){
		var group_id=oResponse.id;
		
		var newTab=document.createElement('td');
		newTab.id='group_'+group_id;
		newTab.className='tab';
		newTab.style.whiteSpace='nowrap';
		newTab.style.paddingLeft='3px';
		newTab.style.paddingRight='16px';
		newTab.innerHTML='<div style="float:left; margin-top:4px; margin-right:2px;">' +
          '<img id="img_status_group_'+group_id+'" src="images/icons/inactive_tiny.png" onmouseover="this.src=\'images/icons/go_tiny.png\';" onmouseout="this.src=\'images/icons/inactive_tiny.png\';" onclick="SetStatus(\'group\','+group_id+',1);">' +
      	'</div>' + 
      	'<div style="float:left; margin-right:15px;" onclick="SwitchGroupTab('+group_id+');" id="group_label_div_'+group_id+'"><a href="javascript:void(0);" rel="Double Click to Edit Name" ondblclick="ShowNameEditor('+group_id+',$(\'group_label_'+group_id+'\').innerHTML);" id="group_label_link_'+group_id+'"><b id="group_label_'+group_id+'" class="red" style="margin:1px;">New Group</b></a></div>'+
	    '<div style="float:left; margin-right:15px; margin-top:4px; display:none;" onclick="SwitchGroupTab('+group_id+');" id="group_label_editor_'+group_id+'">'+
	      '<span id="group_label_hidden_value_'+group_id+'" style="display:none;"></span>'+
	      '<input type="text" class="tab_transparent" id="group_label_new_value_'+group_id+'" onkeyup="FixTextWidth('+group_id+'); checkKeyPress(event,'+group_id+');">'+
	      '<a href="javascript:void(0);" onclick="EditGroupName('+group_id+');" rel="Save"><img src="images/icons/little_check.png" onmouseover="this.src=\'images/icons/little_check_on.png\';" onmouseout="this.src=\'images/icons/little_check.png\';"></a>'+
	      '<a href="javascript:void(0);" onclick="RemoveNameEditor('+group_id+');" rel="Cancel"><img src="images/icons/close_big.png" onmouseover="this.src=\'images/icons/close_big_on.png\';" onmouseout="this.src=\'images/icons/close_big.png\';"></a>'+
	    '</div>'+
        '<div style="text-align:right; margin:5px;"><a href="javascript:void(0);" onclick="OpenDeleteGroupLayer('+group_id+');" rel="<b>Delete this Group.</b><br>Categories can be moved or deleted."><img src="images/icons/close.png" onmouseover="this.src=\'images/icons/close_on.png\';" onmouseout="this.src=\'images/icons/close.png\';"></a></div>';
        $('categories_tab_container').appendChild(newTab);
		
        Droppables.add('group_'+group_id, {
			accept: 'draggable2',
			hoverclass: 'tab_hover',
			onDrop: function(dragged, dropped, event) {
				var categ_id=parseInt(dragged.id.replace("categ_",""));
				var old_group_id=$('current_group').value;
				var group_id=parseInt(dropped.id.replace("group_",""));
				var copy=event.ctrlKey;
				MoveCateg(categ_id,old_group_id,group_id,copy);
			}
		});
	
		var newDiv=document.createElement('div');
		newDiv.id='categs_div_'+group_id;
		newDiv.className='categs_div';
		newDiv.style.display='none';
		newDiv.innerHTML='';
		$('categories_divs_container').appendChild(newDiv);
		appendOptionLast(group_id);
		
		ReTip('group_label_link_'+group_id);
		
		SwitchGroupTab(group_id)
	} else {
		alertBox('Error Message','icons/error.gif',oResponse.message,400);
	}	
		
}

function OpenDeleteGroupLayer(id){
	$('group_delete_id').value=id;
	

	var groups_length=$('gd_group_id').options.length;
	
	for(i=0; i<groups_length; i++){
		$('gd_group_id').options[i].disabled=false;
		//$('gd_group_id').options[i].style.color='#000000';
	}
	
	//$('gd_option_'+id).style.color='#999999';
	$('gd_option_'+id).disabled=true;
	
	OpenLayer('group_delete_layer');
}

function DeleteGroup(){
	var x=confirm("Delete Confirmation");
	if(x){
		var id=$('group_delete_id').value;
		
		if(id!=1){
			var action=$('gd_group_action').value;
			var group_id=$('gd_group_id').value;
			
			ExecAjax("actions/categories/delete_group.php","id="+id+"&action="+action+"&group_id="+group_id,"$('gd_delete_icon').src='images/loading.gif';","","EvalDeleteGroup(transport.responseText);","",true);
		} else {
			alertBox('Error Message','icons/error.gif',"You can't delete this group.\r\nYou can only rename it.",400);
		}
	}
}

function EvalDeleteGroup(response){
	var id=$('group_delete_id').value;
	oResponse=response.evalJSON();
	if(oResponse.success==true){
		$('gd_delete_icon').src='images/icons/delete-tiny.png';
		
		$('group_delete_id').value=''; CloseLayer('group_delete_layer');
		
		$('group_'+id).remove();
		$('gd_option_'+id).remove();
		$('categs_div_'+id).remove();
				
		SwitchGroupTab(1);		
	} else {
		$('gd_delete_icon').src='images/icons/close.png';
		alertBox('Error Message','icons/error.gif',oResponse.message,400);
	}	
}

function SetStatus(type,id,status){
	ExecAjax("actions/categories/set_status.php","type="+type+"&id="+id+"&status="+status,"","","EvalSetStatus(transport.responseText,'"+id+"','"+type+"','"+status+"');","",true);
}

function EvalSetStatus(response,id,type,status){
	oResponse=response.evalJSON();
	if(oResponse.success==true){
		if(type=='group'){
			if(status==1){
				$('img_status_group_'+id).src="images/icons/active_tiny.png";
				$('img_status_group_'+id).onmouseover=function(){this.src='images/icons/stop_tiny.png';}
				$('img_status_group_'+id).onmouseout=function(){this.src='images/icons/active_tiny.png';}
				$('img_status_group_'+id).onclick=function(){SetStatus('group',id,0);}
				$('group_label_'+id).removeClassName('red');
				$('gd_option_'+id).removeClassName('red');
				$('edit_group_option_'+id).removeClassName('red');
				$('group_option_'+id).removeClassName('red');
			} else {
				$('img_status_group_'+id).src="images/icons/inactive_tiny.png";
				$('img_status_group_'+id).onmouseover=function(){this.src='images/icons/go_tiny.png';}
				$('img_status_group_'+id).onmouseout=function(){this.src='images/icons/inactive_tiny.png';}
				$('img_status_group_'+id).onclick=function(){SetStatus('group',id,1);}
				$('group_label_'+id).addClassName('red');
				$('gd_option_'+id).addClassName('red');
				$('edit_group_option_'+id).addClassName('red');
				$('group_option_'+id).addClassName('red');
			}
		} else {
			if(status==1){
				$('img_status_categ_'+id).src="images/icons/active.png";
				$('img_status_categ_'+id).onmouseover=function(){this.src='images/icons/stop.png';}
				$('img_status_categ_'+id).onmouseout=function(){this.src='images/icons/active.png';}
				$('img_status_categ_'+id).onclick=function(){SetStatus('categ',id,0);}
				$('categ_label_'+id).removeClassName('red');
				$('categ_thumb_'+id).className='thumb';				
				$('cd_option_'+id).removeClassName('red');
				$('edit_cd_option_'+id).removeClassName('red');
			} else {
				$('img_status_categ_'+id).src="images/icons/inactive.png";
				$('img_status_categ_'+id).onmouseover=function(){this.src='images/icons/go.png';}
				$('img_status_categ_'+id).onmouseout=function(){this.src='images/icons/inactive.png';}
				$('img_status_categ_'+id).onclick=function(){SetStatus('categ',id,1);}
				$('categ_label_'+id).addClassName('red');
				$('categ_thumb_'+id).className='thumb_error';
				$('cd_option_'+id).addClassName('red');
				$('edit_cd_option_'+id).addClassName('red');
			}
		}
	} else {
		alertBox('Error Message','icons/error.gif',oResponse.message,400);	
	}	
}


function ShowNameEditor(id,value){
	$('group_label_div_'+id).hide();
	$('group_label_editor_'+id).show();
	$('group_label_new_value_'+id).focus();
	$('group_label_new_value_'+id).value=value;
	FixTextWidth(id);
}

function RemoveNameEditor(id){
	$('group_label_editor_'+id).hide();
	$('group_label_div_'+id).show();
}

function EditGroupName(id){
	var name=$('group_label_new_value_'+id).value;
	
	if(!name){
		alertBox('Error Message','icons/error.gif','Value cannot be emtpy.',400);
	} else {
		ExecAjax("actions/categories/edit_group_name.php","id="+id+"&name="+name,"","","$('gd_option_"+id+"').innerHTML='"+name+"'; $('group_option_"+id+"').innerHTML='"+name+"'; $('edit_group_option_"+id+"').innerHTML='"+name+"';","",true);
		$('group_label_'+id).innerHTML=name;
		RemoveNameEditor(id);
	}
}


function checkKeyPress(e,id){
	if(e && e.which>-1){ // Mozilla
        characterCode = e.which 
        if(characterCode==0 && e.type=="keypress") characterCode=2;
    } else {
        e = event
        characterCode = e.keyCode // IE
    }    
    
    var value=$('group_label_editor_'+id).value;    
	if(characterCode==27){ // escape
		RemoveNameEditor(id);
	} else if(characterCode==13 || characterCode==0 || characterCode==1){
		EditGroupName(id);
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

function FixTextWidth(id){
	$('group_label_hidden_value_'+id).innerHTML=$('group_label_new_value_'+id).value;
	var oDimensions= $('group_label_hidden_value_'+id).getDimensions();
	$('group_label_new_value_'+id).style.width=(oDimensions.width+10)+'px';
	$('group_label_new_value_'+id).value=$('group_label_new_value_'+id).value;
}
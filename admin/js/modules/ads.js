var sliders=[];
var spinners=[];
var sliders_loading=0;

function Refresh(){
	loadModule("ads","","ads_contents","LoadSliders();");
}


function AddSpot(){
	ExecAjax("actions/ads/add_spot.php","","$('add_spot_icon').src='images/loading.gif';","","EvalAddSpot(transport.responseText);","",true);
}

function EvalAddSpot(response){
	$('add_spot_icon').src='images/icons/add.png';
	oResponse=response.evalJSON();
	if(oResponse.success==true){
		var id=oResponse.id;
		appendOptionLast(id,'New Spot');
		Refresh();
		setTimeout("Effect.ScrollTo('spots_bottom', { duration:'0.2'});",500);
	} else {
		alertBox('Error Message','icons/error.gif',oResponse.message,400);
	}	
}

function OpenEditSpot(id){
	ExecAjax("actions/ads/get_spot_info.php","id="+id,"$('edit_spot_icon_"+id+"').src='images/loading.gif';","","EvalOpenEditSpot(transport.responseText,'"+id+"');","",true);
}

function EvalOpenEditSpot(response,id){
	$('edit_spot_icon_'+id).src="images/icons/edit-tiny.png";
	oResponse=response.evalJSON();
	if(oResponse.success==true){
		var aData=oResponse.data;
		if(aData){
			for(key in aData){
				if($('edit_spot_'+key)){
					$('edit_spot_'+key).value=aData[key];
				}
			}
		}
		OpenLayer('edit_spot_layer');
	} else {
		alertBox('Error Message','icons/error.gif',oResponse.message,400);
	}
}

function EditSpot(){
	if(!$('edit_spot_name').value.strip()){
		alertBox('Error Message','icons/error.gif',"<b>Spot name is mandatory</b>",400);
	} else {
		var vars=$('edit_spot_form').serialize();
		ExecAjax("actions/ads/edit_spot.php",vars,"$('save_spot_icon').src='images/loading.gif';","","EvalEditSpot(transport.responseText);","",true);
	}	
}

function EvalEditSpot(response){
	var id=$('edit_spot_id').value;
	oResponse=response.evalJSON();
	if(oResponse.success==true){
		$('save_spot_icon').src='images/icons/success.png';
		setTimeout("$('save_spot_icon').src='images/icons/save.png'",2000);
		$('spot_option_'+id).innerHTML=$('edit_spot_name').value;
		Refresh();
	} else {
		$('save_spot_icon').src='images/icons/save.png';
		alertBox('Error Message','icons/error.gif',oResponse.message,400);
	}			
}


function DeleteSpot(id){
	var x=confirm("Are you sure you want to delete this spot?\r\nAll banners will be deleted as well.");
	if(x){
		ExecAjax("actions/ads/delete_spot.php","id="+id,"$('delete_spot_icon_"+id+"').src='images/loading.gif';","","EvalDeleteSpot(transport.responseText,'"+id+"');","",true);
	}	
}

function EvalDeleteSpot(response,id){
	oResponse=response.evalJSON();
	if(oResponse.success==true){
		$('spot_option_'+id).remove();
		CloseLayer($('spot_'+id));
		setTimeout("$('spot_"+id+"').remove();",300);		
	} else {
		$('delete_spot_icon_'+id).src='images/icons/delete.png';
		alertBox('Error Message','icons/error.gif',oResponse.message,400);
	}	
}


function AddBanner(id){
	ExecAjax("actions/ads/add_banner.php","id="+id,"$('add_banner_icon_"+id+"').src='images/loading.gif';","","EvalAddBanner(transport.responseText,'"+id+"');","",true);
}

function EvalAddBanner(response,id){
	$('add_banner_icon_'+id).src='images/icons/add-tiny.png';
	oResponse=response.evalJSON();
	if(oResponse.success==true){
		Refresh();
	} else {
		alertBox('Error Message','icons/error.gif',oResponse.message,400);
	}	
}

function OpenEditBanner(id){
	ExecAjax("actions/ads/get_banner_info.php","id="+id,"$('edit_banner_icon_"+id+"').src='images/loading.gif';","","EvalOpenEditBanner(transport.responseText,'"+id+"');","",true);
}

function EvalOpenEditBanner(response,id){
	$('edit_banner_icon_'+id).src="images/icons/edit.png";
	oResponse=response.evalJSON();
	if(oResponse.success==true){
		var aData=oResponse.data;
		if(aData){
			if(aData['image'].match(/^banners\//i)) {
				aData['image']='';
				aData['hotlinked_image']='';
				$('image_method').value=1;
				$('method_hotlink').hide();
				$('method_upload').show();				
			} else {
				aData['hotlinked_image']=aData['image'];
				aData['image']='';
				$('image_method').value=2;
				$('method_upload').hide();
				$('method_hotlink').show();				
			}
			for(key in aData){
				if($('edit_banner_'+key)){
					$('edit_banner_'+key).value=aData[key];
				}
			}
		}
		OpenLayer('edit_banner_layer');
	} else {
		alertBox('Error Message','icons/error.gif',oResponse.message,400);
	}
}

function EditBanner(){
	if(!$('edit_banner_name').value.strip()){
		alertBox('Error Message','icons/error.gif',"<b>Banner name is mandatory</b>",400);
	} else if($('image_method').value==2 && !$('edit_banner_hotlinked_image').value.strip() && !$('edit_banner_custom_html').value.strip()){
		alertBox('Error Message','icons/error.gif',"<b>Enter a file to hotlink.</b>",400);
	} else {
		$('save_banner_icon').src='images/loading.gif';
		$('edit_banner_form').submit();
	}
}

function EvalEditBanner(response){
	oResponse=response.evalJSON();
	if(oResponse.success==true){
		$('save_banner_icon').src='images/icons/success.png';
		setTimeout("$('save_banner_icon').src='images/icons/save.png';",2000);
		Refresh();
	} else {
		$('save_banner_icon').src='images/icons/save.png';
		alertBox('Error Message','icons/error.gif',oResponse.message,400);
	}
}

function DeleteBanner(id){
	var x=confirm("Are you sure you want to delete this banner?");
	if(x){
		ExecAjax("actions/ads/delete_banner.php","id="+id,"$('delete_banner_icon_"+id+"').src='images/loading.gif';","","EvalDeleteBanner(transport.responseText,'"+id+"');","",true);
	}
}

function EvalDeleteBanner(response,id){
	$('delete_banner_icon_'+id).src='images/icons/delete.png';
	oResponse=response.evalJSON();
	if(oResponse.success==true){
		spot_id=parseInt($('banner_id_'+id).className.replace("spot_","").replace("_banner",""));
		
		$('banner_'+id).remove();
		ReColorizeRows('.banner_row');
		
		RecalculatePcts(spot_id);
	} else {
		alertBox('Error Message','icons/error.gif',oResponse.message,400);
	}	
}


function PreviewBanner(id){
	ExecAjax("actions/ads/get_banner_info.php","id="+id,"$('preview_banner_icon_"+id+"').src='images/loading.gif';","","EvalPreviewBanner(transport.responseText,'"+id+"');","",true);
}

function EvalPreviewBanner(response,id){
	$('preview_banner_icon_'+id).src='images/icons/view.png';
	oResponse=response.evalJSON();
	if(oResponse.success==true){
		var error=0;
		var aData=oResponse.data;
		if(aData.custom_html!=""){
			var html=aData.custom_html;
		} else if(aData.image){
			if(aData.image.match(/^banners\//)) aData.image="../"+aData.image;
			var html='<a href="'+aData.link+'" target="_blank"><img src="'+aData.image+'" border="0"></a>';
		} else {
			error=1;	
		}
		if(error==1){
			alertBox('Error Message','icons/error.gif',"<b>Banner does not have an image.</b><br>Edit and upload/hotlink one.",400);
		} else {
			$('preview_contents').innerHTML=html;
			$('spot_preview_refresh_icon').hide();
			OpenLayer('preview_layer');
		}
	} else {
		alertBox('Error Message','icons/error.gif',oResponse.message,400);
	}	
}

function PreviewSpot(id){
	$('spot_id').value=id;
	ExecAjax("actions/ads/get_banner_info.php","spot_id="+id,"$('preview_spot_icon_"+id+"').src='images/loading.gif';","","EvalPreviewSpot(transport.responseText,'"+id+"');","",true);
}

function EvalPreviewSpot(response,id){
	$('preview_spot_icon_'+id).src='images/icons/view-tiny.png';
	oResponse=response.evalJSON();
	if(oResponse.success==true){
		var error=0;
		var aData=oResponse.data;
		if(aData.custom_html!=""){
			var html=aData.custom_html;
		} else if(aData.image){
			if(aData.image.match(/^banners\//)) aData.image="../"+aData.image;
			var html='<a href="'+aData.link+'" target="_blank"><img src="'+aData.image+'" border="0"></a>';
		} else {
			error=1;	
		}
		if(error==1){
			alertBox('Error Message','icons/error.gif',"<b>Banner does not have an image.</b><br>Edit and upload/hotlink one.",400);
		} else {
			$('preview_contents').innerHTML=html;
			$('spot_preview_refresh_icon').show();
			OpenLayer('preview_layer');
		}
	} else {
		alertBox('Error Message','icons/error.gif',oResponse.message,400);
	}	
}

function SetStatus(id,type,status){
	ExecAjax("actions/ads/set_status.php","id="+id+"&status="+status,"if('"+type+"'=='spot'){ } else { if('"+status+"'==1){ $('inactive_banner_icon_"+id+"').src='images/loading.gif';} else {$('active_banner_icon_"+id+"').src='images/loading.gif';} }","","EvalSetStatus(transport.responseText,'"+id+"','"+type+"','"+status+"');","",true);
}

function EvalSetStatus(response,id,type,status){
	oResponse=response.evalJSON();
	if(oResponse.success==true){
		if(type=="spot"){
			
		} else {
			if(status==1){
				$('inactive_banner_icon_'+id).src='images/icons/inactive.png';
				$('inactive_status_option_'+id).hide();
				$('active_status_option_'+id).show();
				$('banner_name_'+id).removeClassName('red');
				$('weight_slider_'+id).removeClassName('disabled');
				if(sliders[id]) sliders[id].setEnabled();
				$('spinner_'+id).removeClassName('disabled');
				$('banner_weight_pct_'+id).readonly=false;
				if(spinners[id].isObserved()==false) spinners[id].observe();
			} else {
				$('active_banner_icon_'+id).src='images/icons/active.png';
				$('active_status_option_'+id).hide();
				$('inactive_status_option_'+id).show();
				$('banner_name_'+id).addClassName('red');
				$('weight_slider_'+id).addClassName('disabled');
				if(sliders[id]) sliders[id].setDisabled();
				$('spinner_'+id).addClassName('disabled');
				$('banner_weight_pct_'+id).value="0%";
				$('banner_weight_pct_'+id).readonly=true;
				if(spinners[id].isObserved()==true) spinners[id].stopObserving();
			}
			$('banner_status_'+id).value=status;
			
			spot_id=parseInt($('banner_id_'+id).className.replace("spot_","").replace("_banner",""));
			RecalculatePcts(spot_id);
			SaveWeights(spot_id);
		}
	} else {
		alertBox('Error Message','icons/error.gif',oResponse.message,400);	
	}	
}

function LoadSliders(){
	sliders_loading=1;
	var aSpotIds=[];
	$$('.spot_table').each(function(element){
		aSpotIds.push(element.id.replace("spot_",""));
	});
	
	for(i=0; i<aSpotIds.length; i++){
		$$('.spot_'+aSpotIds[i]+"_banner").each(function(element){
			banner_id=element.value;
			if($('weight_slider_'+banner_id)){
				var slideFunction="RecalculatePcts("+aSpotIds[i]+")";
				var changeFunction="SaveWeights("+aSpotIds[i]+")";
					
				if(!sliders[banner_id]){
					sliders[banner_id]=new Control.Slider('weight_pointer_'+banner_id,'weight_slider_'+banner_id,{
						range:			$R(0.01, 1.99),
						sliderValue:	$('banner_weight_'+banner_id).value,
						onSlide:		function(v){eval(slideFunction)},
						onChange:		function(v){eval(changeFunction)},
					});
				} else {
					create_allowed=0;
					sliders[banner_id].initialize('weight_pointer_'+banner_id,'weight_slider_'+banner_id,{
						range:			$R(0.01, 1.99),
						sliderValue:	$('banner_weight_'+banner_id).value,
						onSlide:		function(v){eval(slideFunction)},
						onChange:		function(v){eval(changeFunction)}
					});
				}
				
				updateFunction="UpdateSliderValue("+aSpotIds[i]+","+banner_id+")";
				spinners[banner_id] = new SpinnerControl('banner_weight_pct_'+banner_id, 'banner_weight_pct_'+banner_id+'_up', 'banner_weight_pct_'+banner_id+'_down', {interval:1, min:0, max: 100, round:2, suffix:'%', afterUpdate:updateFunction});
				
				if($('banner_status_'+banner_id).value==1){
					sliders[banner_id].setEnabled();
					if(spinners[banner_id].isObserved()==false) spinners[banner_id].observe();
				} else {
					sliders[banner_id].setDisabled();
					if(spinners[banner_id].isObserved()==true) spinners[banner_id].stopObserving();
				}
			}
		});
	}
	for(i=0; i<aSpotIds.length; i++){
		RecalculatePcts(aSpotIds[i])
	}
	sliders_loading=0;
}


function RecalculatePcts(spot_id){
	var total_weight=0;
	var active_sliders=0;
	
	$$('.spot_'+spot_id+"_banner").each(function(element){
		if($('banner_status_'+element.value) && $('banner_status_'+element.value).value==1){
			total_weight = total_weight + sliders[element.value].value;
			active_sliders++;
		}
	});
	$$('.spot_'+spot_id+"_banner").each(function(element){
		if($('banner_status_'+element.value)&& $('banner_status_'+element.value).value==1) {
			var new_value=sliders[element.value].value;
			var new_pct_value=new_value*100/total_weight;
			spinners[element.value].setValue(new_pct_value.toFixed(2));
		}
	});
}

function UpdateSliderValue(spot_id, banner_id){
	if(!sliders_loading){
		sliders_loading=1;
		var total_weight=0;
		var active_sliders=0;
		var pct=parseFloat($('banner_weight_pct_'+banner_id).value);
		
		$$('.spot_'+spot_id+"_banner").each(function(element){
			if($('banner_status_'+element.value) && $('banner_status_'+element.value).value==1){
				total_weight = total_weight + sliders[element.value].value;
				active_sliders++;
			}
		});	
		new_value=pct/100*total_weight;
		min_pct=0.5*100/total_weight;
		max_pct=1.5*100/total_weight;
		sliders_loading=0;
		if(pct<min_pct || pct>max_pct){
			v=pct/100*total_weight;
			ChangeWeight(banner_id,spot_id,v);
			sliders[banner_id].setValue(new_value);
		} else {
			sliders[banner_id].setValue(new_value);
		}
		sliders_loading=1;
		RecalculatePcts(spot_id);
		sliders_loading=0;
	}
}

function ChangeWeight(banner_id,spot_id,v){
	if(!sliders_loading){
		sliders_loading=1;
		var total_sliders=$$('.spot_'+spot_id+"_banner").length;
		if(total_sliders>1){
			var total_weight=0;
			$$('.spot_'+spot_id+"_banner").each(function(element){
				total_weight = total_weight + sliders[element.value].value;
			});
			pct=v*100/total_weight;
			
			var diff=sliders[banner_id].value - v;
			var ind_diff=diff/(total_sliders-1);
			
			$$('.spot_'+spot_id+"_banner").each(function(element){
				if(element.value!=banner_id){
					var new_value=sliders[element.value].value + ind_diff;
					/*if(new_value<0.5 || new_value>1.5){
						ChangeWeight(element.value,spot_id,new_value);	
					}*/
					sliders[element.value].setValue(new_value);
					$('banner_weight_'+element.value).value=new_value;
				}
			});
			$('banner_weight_'+banner_id).value=v;
			sliders[banner_id].setValue(new_value);
		}
		sliders_loading=0;
	}
}

function SaveWeights(spot_id){
	if(!sliders_loading){
		var weight_string="";
		$$('.spot_'+spot_id+"_banner").each(function(element){
			weight_string=weight_string+"aWeights["+element.value+"]="+sliders[element.value].value+"&";
		});
		ExecAjax("actions/ads/save_weights.php",weight_string,"","","","",true);
	}
}

function appendOptionLast(id,name){
	var elOptNew = document.createElement('option');
	elOptNew.text = name;
	elOptNew.value = id;
	elOptNew.id = 'spot_option_'+id;
	var elSel = $('edit_banner_spot');
	
	try {
		elSel.add(elOptNew, null); // standards compliant; doesn't work in IE
	} catch(ex) {
		elSel.add(elOptNew); // IE only
	}
}
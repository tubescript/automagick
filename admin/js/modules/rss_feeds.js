function OpenRSSFeedsManager(){
	RefreshRSSFeeds();
}

function RefreshRSSFeeds(){
	ExecAjax("index.php?module=rss_feeds","onlymod=1","if($('rss_feeds_refresh_icon')){$('rss_feeds_refresh_icon').src='images/loading.gif';}","","EvalRefreshRSSFeeds(transport.responseText);","",true);
}

function EvalRefreshRSSFeeds(response){
	if($('rss_feeds_refresh_icon')){$('rss_feeds_refresh_icon').src='images/icons/refresh.png';}
	if(response){
		$('rss_feeds_contents').innerHTML=response;
		OpenLayer('rss_feeds_layer');
		//ReSpinner();
		//ReColorizeRows('.server_row');
		/* $$('.retip').each(function(el){
			ReTip(el);
		}); */
		
		/* $$('.readonly_checkbox').each(function(el){
			el.onclick=function(){
				return readOnlyCheckBox();
			}
		}); */
	}	
}


function OpenAddEditRSSFeed(id){
	if(!id){
		$('rss_feed_add_edit_id').value='';
		$('rss_feed_add_edit_title').innerHTML="Add Feed";
	} else {
		$('rss_feed_add_edit_id').value=id;
		$('rss_feed_add_edit_title').innerHTML="Edit Feed";
	}
	
	$('rss_feed_add_edit_step_2').hide();
	$('rss_feed_add_edit_step_3').hide();
	OpenLayer('rss_feed_add_edit_layer');
	
}


function FetchRssFeed(){
	var feed_url=$('rss_feed_add_edit_url').value;
	var primary_tag=$('rss_feed_add_edit_primary_tag').value;
	ExecAjax("actions/rss_feeds/fetch_rss.php","feed_url="+escape(feed_url)+"&primary_tag="+primary_tag,"$('rss_feed_fetch_icon').src='images/loading.gif';","","EvalFetchRssFeed(transport.responseText);","",true);
}

function EvalFetchRssFeed(response){
	$('rss_feed_fetch_icon').src='images/icons/feed_fetch.png';
	oResponse=response.evalJSON();
	if(oResponse.success==true){

		var tags_options='<option value=""> - Ignore - </option>\r\n';
		for(i=0;i<oResponse.aFields.length;i++){
			tags_options+='<option value="'+oResponse.aFields[i]+'">'+oResponse.aFields[i]+'</option>\r\n';
		}
		
		var aDbFields=['title','description','tags','categories','thumbnails','preview_img','flv_url','embed_code']
		
		$('rss_feed_recognized_tags_contents').innerHTML='';
		$('rss_feed_recognized_tags_separators').innerHTML='';
		for(i=0;i<aDbFields.length;i++){
			$('rss_feed_recognized_tags_contents').innerHTML+=
				'"'+aDbFields[i]+'" field can be found on tag: '+
				'<select name="field_'+aDbFields[i]+'" id="field_'+aDbFields[i]+'" onchange="CheckDuplicateValues(this.id, this.value);" class="rss_feed_tag_select">'+tags_options+'</select><br><br class="br">';
				
			$('rss_feed_recognized_tags_separators').innerHTML+=
				'<input type="text" style="width:40px; height:15px; display:none;" id="field_'+aDbFields[i]+'_separator">'+
				'<a href="javascript:void(0);" style="display:none;" id="field_'+aDbFields[i]+'_separator_tooltip" rel="<b>Separator</b><br>If one tag holds 2 or more of our fields<br>enter the string that will act as separator.<br>Example: &amp;lt;br&amp;gt;"><img src="images/icons/help.png"></a><br><br class="br">';
				
			ReTip('field_'+aDbFields[i]+'_separator_tooltip');
		}
		
		$('rss_feed_add_edit_step_2').show();
		$('rss_feed_add_edit_step_3').show();
	} else {
		if(oResponse.show_primary_tag){
			$('rss_feed_add_edit_primary_tag').show();
		}
		alertBox('Error Message','icons/error.gif',oResponse.message,450);
	}
}

function CheckDuplicateValues(){
	var array_counts=[];
	var array_keys=[];
	$$('.rss_feed_tag_select').each(function(el){
		if(el.value){
			if(!array_counts[el.value]) array_counts[el.value]=0;
			array_counts[el.value]++;
			array_keys[el.value]=0;
		}
	});
	
	
	$$('.rss_feed_tag_select').each(function(el){
		if(el.value && array_counts[el.value]>1 && array_keys[el.value]<array_counts[el.value]-1){
			$(el.id+'_separator').show();
			$(el.id+'_separator_tooltip').show();
			array_keys[el.value]++;
		} else {
			$(el.id+'_separator').hide();
			$(el.id+'_separator_tooltip').hide();
		}
	});
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
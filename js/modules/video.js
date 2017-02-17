rate_disabled=0;
function StarsTo(v){
	if(rate_disabled==0){
		switch(v){
			case 1: $('rate_label').innerHTML=aLabels['rank1']; break;
			case 2: $('rate_label').innerHTML=aLabels['rank2']; break;
			case 3: $('rate_label').innerHTML=aLabels['rank3']; break;
			case 4: $('rate_label').innerHTML=aLabels['rank4']; break;
			case 5: $('rate_label').innerHTML=aLabels['rank5']; break;
		}		
		for(var i=1;i<=5;i++){
			if(i<=v){
				$('star'+i).className='star_on';
			} else {
				$('star'+i).className='star_off';
			}
		}
	}
}

function ResetStars(){
	if(rate_disabled==0){
		$('rate_label').innerHTML=aLabels['rate_video'];
		for(var i=1;i<=5;i++){	
			$('star'+i).removeClassName('star_on');
			$('star'+i).removeClassName('star_off');
		}
	}
}

function Rate(id,value){
	if(rate_disabled==0){
		ExecAjax("actions/video/rate_video.php","id="+id+"&value="+value,"","","EvalRate(transport.responseText);","",true);
	}
}

function EvalRate(response){
	var aResponse=response.evalJSON()
	if(aResponse.success==true){
		$('rate_label').innerHTML=aLabels['thank_you'];
		$('rating_info').title=aResponse['rating_formated'];
	} else{
		$('rate_label').innerHTML=aResponse.message;
	}
	DisableRatingSystem();
}

function DisableRatingSystem(){
	rate_disabled=1;	
}

function PostComment(){
	$('comment_error').hide();
	$('comment_success').hide();
	var video_id=$('comments_video_id').value;
	var comment=$('comment').value;
	if($('recaptcha_challenge_field')){
		var recaptcha_challenge=$('recaptcha_challenge_field').value;
	} else {
		var recaptcha_challenge="";
	}
	if($('recaptcha_response_field')){
		var recaptcha_response=$('recaptcha_response_field').value;
	} else {
		var recaptcha_response="";
	}	
	if(comment.strip()!=""){
		$('comment_button').hide();
		$('comment_button_disabled').show();
		ExecAjax("actions/video/add_comment.php","video_id="+video_id+"&comment="+encodeURIComponent(comment)+"&recaptcha_challenge="+recaptcha_challenge+"&recaptcha_response="+recaptcha_response,"","","EvalPostComment(transport.responseText,'"+video_id+"');","",true);
	} else {
		$('comment_error').innerHTML=aLabels['comment_empty'];
		$('comment_error').show();
	}
}

function EvalPostComment(response,video_id){
	var aResponse=response.evalJSON()
	if(aResponse.success==true){
		PaginateComments(1,video_id);

		$('comment_success').innerHTML=aResponse.message;
		$('comment_success').show();
		$('comment').value='';
		$('recaptcha_response_field').value='';
	} else{
		$('comment_error').innerHTML=aResponse.message;
		$('comment_error').show();

		$('comment_button_disabled').hide();
		$('comment_button').show();
	}
	Recaptcha.reload();
}

function PaginateComments(page,video_id){
	if(!page) page=1;
	loadModule("comments","page="+page+"&id="+video_id,"comments_contents","");
}

function ReportComment(id){
	ExecAjax("actions/video/report_comment.php","id="+id,"","","EvalReportComment(transport.responseText,'"+id+"');","",true);	
}

function EvalReportComment(response,id){
	var aResponse=response.evalJSON()
	if(aResponse.success==true){	
		$('report_label_'+id).innerHTML=aLabels['thank_you'];
	} else {
		$('report_label_'+id).innerHTML=aResponse.message;
	}
}


function LikeComment(id){
	ExecAjax("actions/video/like_comment.php","id="+id,"","","EvalLikeComment(transport.responseText,'"+id+"');","",true);	
}

function EvalLikeComment(response,id){
	var aResponse=response.evalJSON()
	if(aResponse.success==true){	
		$('like_label_'+id).innerHTML=aResponse.new_value + " " + aLabels.times;
	} else {
		$('like_label_'+id).innerHTML=aResponse.message;
	}
}

function DislikeComment(id){
	ExecAjax("actions/video/dislike_comment.php","id="+id,"","","EvalDislikeComment(transport.responseText,'"+id+"');","",true);	
}

function EvalDislikeComment(response,id){
	var aResponse=response.evalJSON()
	if(aResponse.success==true){	
		$('dislike_label_'+id).innerHTML=aResponse.new_value + " " + aLabels.times;
	} else {
		$('dislike_label_'+id).innerHTML=aResponse.message;
	}
}

function OpenPremiumOptions(){
	$('premium_options_layer').show();
}

function ReportVideo(video_id,reason_id){
	$('report_video_message').hide();
	$('report_video_button').hide();
	ExecAjax("actions/video/report_video.php","video_id="+video_id+"&reason_id="+reason_id,"","","EvalReportVideo(transport.responseText);","",true,"POST",60);
}

function EvalReportVideo(response){
	var aResponse=response.evalJSON()
	if(aResponse.success==true){
		$('report_video_message').innerHTML='<b class="green">'+aResponse.message+'</b>';
	} else {
		$('report_video_message').innerHTML='<b class="red">'+aResponse.message+'</b>';
		$('report_video_button').show();
	}
	$('report_video_message').show();
}


function GetRelatedVideos(video_id){
	ExecAjax("actions/video/get_related_videos.php","id="+video_id,"","","EvalGetRelatedVideos(transport.responseText);","",true,"POST",60);
}

function EvalGetRelatedVideos(response){
	$('related_videos_contents').innerHTML='';
	if(response){
		$('related_videos_contents').innerHTML=response;
	}
}

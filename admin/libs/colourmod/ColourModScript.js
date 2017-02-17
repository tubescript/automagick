//	ColourMod v2.2 Plug-N-Play
//  DHTML Dynamic Color Picker/Selector
//	� 2005 ColourMod.com
//	Design/Programming By Stephen Hallgren (www.teevio.net)
//	Produced By The Noah Institute (www.noahinstitute.org)


function pickcolor(cssclass, csselement, csscookie, cssform, link, adjX, adjY) {



	/***********************/
	//Variable Declarations
	/***********************/
	
	//Set Color Arrays
	var adjustment = new Array();
	if (adjX)
		adjustment['x'] = adjX;
	else
		adjustment['x'] = 0;
	if (adjY)
		adjustment['y'] = adjY;
	else
		adjustment['y'] = 0;
	var rgb = new Array();
	var hsv = new Array();
	var hex = new Array();
	var offset = new Array();
	offset['x'] = 10;
	offset['y'] = 10;
	var H,S,V,sliderX,sliderY,dotX,dotY;
	
	//Set Drag Status To False
	var isdrag=false;
	
	//Set browser variables
	var ie=document.all;
	var nn6=document.getElementById&&!document.all;
	var colorselector = "default";
	var scrollLeftOffset = '0';
	var scrollTopOffset = '0';
	var detect = navigator.userAgent.toLowerCase();
	var OS,browser,total,thestring;
	var version = 0;

	document.getElementById('ColourMod').style.display = "block";

	if (document.getElementById("ColourMod").style.left == 0 && document.getElementById("ColourMod").style.top == 0) {
		cmOffsetLeft = document.getElementById('ColourMod').offsetLeft;
		cmOffsetTop = document.getElementById('ColourMod').offsetTop;
	}
	if( link.offsetParent ) {
		for( var posX = 0, posY = 0; link.offsetParent; link = link.offsetParent ) {
			offset['x'] += link.offsetLeft;
			offset['y'] += link.offsetTop;
		}
	} else {
		offset['x'] = link.x;
		offset['y'] = link.y;
	}
	if (self.innerWidth) {
		frameWidth = self.innerWidth;
		frameHeight = self.innerHeight;
	} else if (document.documentElement && document.documentElement.clientWidth) {
		frameWidth = document.documentElement.clientWidth;
		frameHeight = document.documentElement.clientHeight;
	} else if (document.body) {
		frameWidth = document.body.clientWidth;
		frameHeight = document.body.clientHeight;
	} else  { 
		return;
	}
	
	scrollOffset = getScrollXY();

	if (offset['x']+282 + adjustment['x'] > frameWidth+scrollOffset['x']) {
		offset['x'] = frameWidth+scrollOffset['x'] - 282;
	} else if (offset['x'] + adjustment['x'] < scrollOffset['x']) {
		offset['x'] = scrollOffset['x'];
	} else {
		offset['x'] = offset['x'] + adjustment['x'];
	}

	if (offset['y']+220 + adjustment['y'] > frameHeight+scrollOffset['y']) {
		offset['y'] = frameHeight+scrollOffset['y'] - 220;
	} else if (offset['y'] + adjustment['y'] < scrollOffset['y']) {
		offset['y'] = scrollOffset['y'];
	} else {
		offset['y'] = offset['y'] + adjustment['y'];
	}

	
	document.getElementById('ColourMod').style.left = offset['x'] + "px";
	document.getElementById('ColourMod').style.top = offset['y'] + "px";


	/*****************************/
	//Assign Javascript Functions
	/*****************************/

	if (nn6)
		document.getElementById('cmHex').type = "search";	
	
	document.getElementById('cmCloseButton').href="javascript:;";
	document.getElementById('cmCloseButton').onmouseup = closeColourMod;
	document.getElementById('cmHex').onkeyup = hexUpdate;

	
	function closeColourMod() {
		document.getElementById('ColourMod').style.display = "none";
	}

	if (cssform) {
		document.getElementById('cmHex').value = document.getElementById(cssform).value;
		hexUpdate();
	}

	
	/***********************/
	//Global Mouse Events
	/***********************/
	
	
	//Set mouse click functions
	document.getElementById('ColourMod').onmousedown = selectmouse;
	document.onmouseup= unselectmouse;
	
	
	/***********************/
	//Input Functions
	/***********************/
	
	
	function checkIt(string) {
		place = detect.indexOf(string) + 1;
		thestring = string;
		return place;
	}

	function getScrollXY() {
	
		var scrollOffset = new Array();
		if (document.documentElement && document.documentElement.scrollTop)
			// Explorer 6 Strict
		{
			scrollOffset['x'] = document.documentElement.scrollLeft;
			scrollOffset['y'] = document.documentElement.scrollTop;
		}
		else if (document.body) // all other Explorers
		{
			scrollOffset['x'] = document.body.scrollLeft;
			scrollOffset['y'] = document.body.scrollTop;
		}
	
		  return scrollOffset;
	}
	
	
	function selectmouse(e) {
				document.body.style.cursor = 'pointer';
				mouseX = nn6 ? e.clientX : event.clientX;
				mouseY = nn6 ? e.clientY : event.clientY;
				
				scrollOffset = getScrollXY();
				if (!scrollOffset['y'])
					scrollOffset['y'] = 0;
				if (!scrollOffset['x'])
					scrollOffset['x'] = 0;
			//Adjust for positioning
			if (checkIt('safari')) {
				dotX = mouseX - 24 - document.getElementById('ColourMod').offsetLeft;
				dotY = mouseY - 53 - document.getElementById('ColourMod').offsetTop;
				//alert (mouseY+":"+53+":"+document.getElementById('ColourMod').offsetTop+":"+scrollOffset['y']);
				//alert (dotX+":"+dotY);
				sliderX = mouseX - 185 - document.getElementById('ColourMod').offsetLeft;
				sliderY = mouseY - 52 - document.getElementById('ColourMod').offsetTop;
			} else {
				dotX = mouseX - 24 - document.getElementById('ColourMod').offsetLeft + scrollOffset['x'];
				dotY = mouseY - 53 - document.getElementById('ColourMod').offsetTop + scrollOffset['y'];
				//alert (mouseY+":"+53+":"+document.getElementById('ColourMod').offsetTop+":"+scrollOffset['y']);
				//alert (dotX+":"+dotY);
				sliderX = mouseX - 185 - document.getElementById('ColourMod').offsetLeft + scrollOffset['x'];
				sliderY = mouseY - 52 - document.getElementById('ColourMod').offsetTop + scrollOffset['y'];
				}
			//Check to see if mouse is in the selection area
				if (0 <= dotX && dotX <= 150 && 0 <= dotY && dotY <= 150) {
					isdrag = true;
					document.getElementById("cmBlueDot").style.left = dotX + "px";
					document.getElementById("cmBlueDot").style.top = dotY + "px";

					arrowY = replaceString(document.getElementById("cmBlueArrow").style.top,'px','');
							
					H = Math.round(YToH(arrowY));
					S = XToS(dotX);
					V = YToV(dotY);	
					
					document.getElementById("cmHue").value = H;
					
					rgb = HSVToRGB(H,S,V);

					hex = RGBToHex(rgb['red'],rgb['green'],rgb['blue']);

					document.getElementById("cmHex").value = hex;
					
					document.getElementById("cmColorContainer").style.backgroundColor = "#"+hex;
					
					changecss(cssclass,csselement,hex,"hex",csscookie,cssform);

					document.onmousemove = dragSV;
				
				} else if (0 <= sliderX && sliderX <= 35 && 0 <= sliderY && sliderY <= 150) {
					isdrag = true;
					document.getElementById("cmBlueArrow").style.top = dotY + "px";
					
					sliderY = replaceString(document.getElementById("cmBlueArrow").style.top,'px','');
					dotX = replaceString(document.getElementById('cmBlueDot').style.left,'px','');
					dotY = replaceString(document.getElementById('cmBlueDot').style.top,'px','');

					H = YToH(sliderY);				
					S = XToS(dotX);
					V = YToV(dotY);	

					rgb = HSVToRGB(H,'100','100');
					hex = RGBToHex (rgb['red'],rgb['green'],rgb['blue']);
					document.getElementById("cmSatValBg").style.backgroundColor = "#"+hex;
					

					document.getElementById("cmHue").value = H;
				
					rgb = HSVToRGB(H, S, V);

					hex = RGBToHex (rgb['red'],rgb['green'],rgb['blue']);

					document.getElementById("cmHex").value = hex;

					document.getElementById("cmColorContainer").style.backgroundColor = "#"+hex;
					
					changecss(cssclass,csselement,hex,"hex",csscookie,cssform);

					document.onmousemove = dragH;
				} else if (0 <= dotX && dotX <= 150 && dotY < 0) {
					isdrag = true;
					//alert("drag window");
					
						dotX = mouseX - document.getElementById('ColourMod').offsetLeft + scrollOffset['x'];
						dotY = mouseY - document.getElementById('ColourMod').offsetTop + scrollOffset['y'];

					document.onmousemove = dragCM;
				
				}
	}
	
	function unselectmouse(e) {
		isdrag=false;
		document.body.style.cursor = 'auto';
	}
	
	function hexUpdate() {
		hex = document.getElementById('cmHex').value;
		
		if (hex.length == 6) {
			
			changecss(cssclass,csselement,hex,'hex',csscookie,cssform);
			
			rgb = HexToRGB(hex);
			
			hsv = RGBToHSV(rgb['red'],rgb['green'],rgb['blue']);
			
			document.getElementById('cmHue').value = hsv['hue'];
			
			sliderY = HToY(hsv['hue']);
			dotX = SToX(hsv['sat']);
			dotY = VToY(hsv['val']);
			
			document.getElementById("cmBlueArrow").style.top = sliderY + "px";
			document.getElementById("cmBlueDot").style.left = dotX + "px";
			document.getElementById("cmBlueDot").style.top = dotY + "px";

			document.getElementById("cmColorContainer").style.backgroundColor = "#"+hex;

			rgb = HSVToRGB(hsv['hue'],'100','100');
			hex = RGBToHex (rgb['red'],rgb['green'],rgb['blue']);
			
			document.getElementById("cmSatValBg").style.backgroundColor = "#"+hex;
			
		} 
	}

	
	
	/***********************/
	//Default Color Selection
	/***********************/
	
	
	
	function dragSV(e) {
		if (isdrag) {
			mouseX = nn6 ? e.clientX : event.clientX;
			mouseY = nn6 ? e.clientY : event.clientY;
	
			scrollOffset = getScrollXY();
			if (!scrollOffset['y'])
				scrollOffset['y'] = 0;
			if (!scrollOffset['x'])
				scrollOffset['x'] = 0;
			if (checkIt('safari')) {
				xlimit = mouseX - 24 - document.getElementById('ColourMod').offsetLeft;
				ylimit = mouseY - 53 - document.getElementById('ColourMod').offsetTop;
			} else {
				xlimit = mouseX - 24 - document.getElementById('ColourMod').offsetLeft + scrollOffset['x'];
				ylimit = mouseY - 53 - document.getElementById('ColourMod').offsetTop + scrollOffset['y'];
				}

	
			if (xlimit<= 0)
				xlimit = 0;
			else if (xlimit >= 150)
				xlimit = 150;
			if (ylimit<= 0)
				ylimit = 0;
			else if (ylimit >= 150)
				ylimit = 150;
			//alert ('default');
			
			document.getElementById("cmBlueDot").style.left = xlimit + "px";
			document.getElementById("cmBlueDot").style.top = ylimit + "px";			
			
			H = document.getElementById('cmHue').value;
			S = XToS(xlimit);
			V = YToV(ylimit);	
			
			rgb = HSVToRGB(H, S, V);
			hex = RGBToHex (rgb['red'],rgb['green'],rgb['blue']);

			document.getElementById("cmHex").value = hex;

			document.getElementById("cmColorContainer").style.backgroundColor = "#"+hex;
			changecss(cssclass,csselement,hex,"hex",csscookie,cssform);
		}
	}
	
	function dragH(e) {
		if (isdrag) {
			mouseY = nn6 ? e.clientY : event.clientY;
	
			scrollOffset = getScrollXY();
			if (!scrollOffset['y'])
				scrollOffset['y'] = 0;
			if (!scrollOffset['x'])
				scrollOffset['x'] = 0;
	
			if (checkIt('safari')) {
				sliderY = mouseY - 52 - document.getElementById('ColourMod').offsetTop;
			} else {
				sliderY = mouseY - 52 - document.getElementById('ColourMod').offsetTop + scrollOffset['y'];
			}
			
			if (sliderY < 0)
				sliderY = 0;
			if (sliderY > 150)
				sliderY = 150;
				
				document.getElementById("cmBlueArrow").style.top = sliderY + "px";
				H = YToH(sliderY);	
				rgb = HSVToRGB(H,'100','100');
				hex = RGBToHex (rgb['red'],rgb['green'],rgb['blue']);
				document.getElementById("cmSatValBg").style.backgroundColor = "#"+hex;
				
				dotX = replaceString(document.getElementById('cmBlueDot').style.left,'px','');
				dotY = replaceString(document.getElementById('cmBlueDot').style.top,'px','');
				
				S = XToS(dotX);
				V = YToV(dotY);	
				
				rgb = HSVToRGB(H, S, V);
				hex = RGBToHex (rgb['red'],rgb['green'],rgb['blue']);

				document.getElementById("cmHex").value = hex;


				document.getElementById("cmColorContainer").style.backgroundColor = "#"+hex;
				changecss(cssclass,csselement,hex,"hex",csscookie,cssform);
		}
	}
	
	function dragCM(e) {
		if (isdrag) {
			mouseX = nn6 ? e.clientX : event.clientX;
			mouseY = nn6 ? e.clientY : event.clientY;
	
			scrollOffset = getScrollXY();
			if (!scrollOffset['y'])
				scrollOffset['y'] = 0;
			if (!scrollOffset['x'])
				scrollOffset['x'] = 0;
				
			xlimit = mouseX - dotX - cmOffsetLeft + scrollOffset['x'];
			ylimit = mouseY - dotY - cmOffsetTop + scrollOffset['y'];
	
			//document.getElementById("offsetx").value = mouseX+":"+cmOffsetLeft+":"+scrollOffset['x']+":"+xlimit;
			//document.getElementById("offsety").value = mouseY+":"+cmOffsetTop+":"+scrollOffset['y']+":"+ylimit;
		
			document.getElementById("ColourMod").style.left = xlimit + "px";
			document.getElementById("ColourMod").style.top = ylimit + "px";		
		}			
	}
	
	function replaceString (string, find, replace) {
		return string.replace(find,replace);
	}
	
	
	
	
	
	/****************************************/
	//Default Coordinate Conversion Functions
	/****************************************/
	
	
	function XToS (dotX) {
		return (dotX/1.5);
	}
	
	function YToV (dotY) {
		return (100-(dotY/1.5));
	}
	function SToX (S) {
		return S*1.5;
	}
	
	function VToY (V) {
		return (-V+100)*1.5;
	}
	
	function HToY (H) {
		return (H/360)*150;
	
	}
	
	function YToH (sliderY) {
		return (sliderY/150)*360;
	}
	
	
	
	/***************************/
	//Color Conversion Functions
	/***************************/
	
	function HSVToRGB(H, S, V) {
		H = H/360;
		S = S/100;
		V = V/100;
		
		if (S <= 0) {
			V = Math.round(V*255);
			rgb['red'] = V;
			rgb['green'] = V;
			rgb['blue'] = V;
			return rgb;
		} else {
			if (H >= 1.0) {
				H = 0;
			}
			H = 6 * H;
			F = H - Math.floor(H);
			P = Math.round(255 * V * (1.0 - S));
			Q = Math.round(255 * V * (1.0 - (S * F)));
			T = Math.round(255 * V * (1.0 - (S * (1.0 - F))));
			V = Math.round(255 * V);
			switch (Math.floor(H)) {
				 case 0:
					R = V;
					G = T;
					B = P;
					break;
				 case 1:
					R = Q;
					G = V;
					B = P;
					break;
				 case 2:
					R = P;
					G = V;
					B = T;
					break;
				 case 3:
					R = P;
					G = Q;
					B = V;
					break;
				 case 4:
					R = T;
					G = P;
					B = V;
					break;
				 case 5:
					R = V;
					G = P;
					B = Q;
					break;
			}
			rgb['red'] = R;
			rgb['green'] = G;
			rgb['blue'] = B;
			return rgb;
		}
	}
	
	function RGBToHex(R,G,B) {
		return (toHex(R)+toHex(G)+toHex(B));
	}
	
	function toHex(N) {
		if (N==null) 
			return "00";
		N=parseInt(N); 
		if (N==0 || isNaN(N)) 
			return "00";
		N=Math.max(0,N); 
		N=Math.min(N,255); 
		N=Math.round(N);
		return "0123456789ABCDEF".charAt((N-N%16)/16) + "0123456789ABCDEF".charAt(N%16);
	}
	
	
	
	function HexToRGB(H) { 
		hexR = H.substr(0,2);
		rgb['red'] = parseInt((hexR).substring(0,2),16);
		hexG = H.substr(2,2);
		rgb['green'] = parseInt((hexG).substring(0,2),16);
		hexB = H.substr(4,2);
		rgb['blue'] = parseInt((hexB).substring(0,2),16);
		return rgb;
	}
	
	function RGBToHSV (R,G,B) {
		var max = Math.max(R,G,B);
		var min = Math.min(R,G,B);
		var delta = max-min;
		V = Math.round((max / 255) * 100);
		if(max != 0){
			S = Math.round(delta/max * 100);
		}else{
			S = 0;
		}
		
		if(S == 0){
			H = 0;
		}else{
			if(R == max){
				H = (G - B)/delta;
			}else if(G == max){
				H = 2 + (B - R)/delta;
			}else if(B == max){
				H = 4 + (R - G)/delta;
			}
			H = Math.round(H * 60);
			if(H > 360){
				H = 360;
			}
			if(H < 0){
				H += 360;
			}
		}
		hsv['hue'] = H;
		hsv['sat'] = S;
		hsv['val'] = V;
		return hsv;
	}	
}


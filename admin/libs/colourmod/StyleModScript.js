//	StyleMod v2.0
//  DHTML Dynamic CSS Modifier
//	© 2005 StyleMod.com
//	Programming By Stephen Hallgren (www.teevio.net)


///Determine how to read the stylesheet depending upon browser

function checkBrowser () {
	var theRules = new Array();
	if (document.styleSheets[0].cssRules) {
		return "cssRules";
	} else if (document.styleSheets[0].rules || document.all) {
		return "rules";
	} else {
		return;
	}
}

///Set cookie for updating css on page load
function setcsscookie (myclass, element, value, fieldvalue) {
	var date = new Date();
    date.setTime(date.getTime()+(365*24*60*60*1000));
    var expires = "; expires="+date.toGMTString();
    var path = "; path=/";
	if (getCookie(myclass)) {
		var newvalues = "";
		var updated = false;
		var cvalues = getCookie(myclass);
		firstsplit = cvalues.split(",");
		for (var i = 0; i < firstsplit.length; i++) {
			secondsplit = firstsplit[i].split("|");
///Check to see if element is in cookie
			if (secondsplit[0] == element) {
				//Update element value
				newvalues += element + "|" + value + "|" + fieldvalue + ",";
				var updated = true;
			} else if (secondsplit[0] != "") {
				newvalues += firstsplit[i]+",";
			}
		}
///If cookie hasn't been updated, add element and value
		if (updated == false)
				newvalues += element + "|" + value + "|" + fieldvalue + ",";
		document.cookie = myclass+"="+newvalues+expires+path;
	} else {
		document.cookie = myclass+"="+element+"|"+value+"|"+fieldvalue+expires+path;
	}
}

///Find cookie by name
function getCookie(name) {
    var dc = document.cookie;
    var prefix = name + "=";
    var begin = dc.indexOf("; " + prefix);
    if (begin == -1) {
        begin = dc.indexOf(prefix);
        if (begin != 0) return null;
    } else {
        begin += 2;
    }
    var end = document.cookie.indexOf(";", begin);
    if (end == -1) {
        end = dc.length;
    }
    return unescape(dc.substring(begin + prefix.length, end));
}

function deleteCookies () {
	var date = new Date();
    date.setTime(date.getTime());
    var expires = "; expires="+date.toGMTString();
    var path = "; path=/";
	var theRules = checkBrowser ();
	for (var j = 0; j < document.styleSheets.length; j++) {
	
		for (var i = 0; i < document.styleSheets[j].theRules.length; i++) {
			var myclass = theRules[i].selectorText.toLowerCase();
	///Convert Safari #ids into proper format
			newclass = myclass.replace(/\*\[id\"([^\"]*)\"\]/g, "\#$1");
			if (getCookie(newclass)) {
				document.cookie = newclass + "="+""+" "+expires+path;
			}
		}
	
	}
}


///Updates CSS Based upon any cookies set that match up with the style sheet classes
function cookiecss () {
	var theRules = checkBrowser ();
	for (var k = 0; k < document.styleSheets.length; k++) {
	
		for (var i = 0; i < document.styleSheets[j].theRules.length; i++) {
			var myclass = theRules[i].selectorText.toLowerCase();
	///Convert Safari #ids into proper format
			newclass = myclass.replace(/\*\[id\"([^\"]*)\"\]/g, "\#$1");
			if (getCookie(newclass)) {
				var cvalue = getCookie(newclass);
				firstsplit = cvalue.split(",");
				for (var j = 0; j < firstsplit.length; j++) {
					secondsplit = firstsplit[j].split("|");
					if (secondsplit[0] != "") {
	///Update CSS from Cookie data
						theRules[i].style[secondsplit[0]] = secondsplit[1];
						if (document.getElementById(secondsplit[2])) {
							hex = secondsplit[1].replace(/\#/,'');
							document.getElementById(secondsplit[2]).value = hex;
						}
					}
				}
			}
		}
	}
}

function changecss (classes,elements,values,modifiers,cookie,fields) {
	var element,value,modifier,classvalue,fieldvalue;
	var elementsplit = elements.split(";");
	var classsplit = classes.split(";");
	var valuesplit = values.split(";");
	var modifiersplit = modifiers.split(";");
	var fieldsplit = fields.split(";");
	var lastelement = "0";
	var lastclass = "0";
	var lastvalue = "0";
	var lastmodifier = "0";
	var lastfield = "0";
	var value;
	var splitlength = Math.max(elementsplit.length,classsplit.length,valuesplit.length,modifiersplit.length,fieldsplit.length)
	for (var i = 0; i < splitlength; i++) {
		if (elementsplit[i]) {
			element = elementsplit[i];
			lastelement = i;
		} else {
			element = elementsplit[0];
		}
		if (valuesplit[i]) {
			value = valuesplit[i];
			lastvalue = i;
		} else {
			value = valuesplit[lastvalue];
		}
		if (modifiersplit[i]) {
			modifier = modifiersplit[i];
			lastmodifier = i;
		} else {
			modifier = modifiersplit[lastmodifier];
		}
		if (classsplit[i]) {
			classvalue = classsplit[i];
			lastclass = i;
		} else {
			classvalue = classsplit[lastclass];
		}
		if (fieldsplit[i]) {
			fieldvalue = fieldsplit[i];
			lastfield = i;
		} else {
			fieldvalue = fieldsplit[lastfield];
		}
		if (modifier == "hex") {
			if (value.length == 3) {
				value = value + value;
			}  else if (value.length == 2) {
				value = value+value+value;
			} else if (value.length != 6) {
				value = "";
			}
		}
		changecsssplit(classvalue,element,value,modifier,cookie,fieldvalue);
	}
}


///Change CSS with a specific value given
function changecsssplit(myclass,element,value,modifier,cookie,fieldvalue) {
	if (fieldvalue)
		document.getElementById(fieldvalue).value = value;
	if (modifier != "hex") {
		value = value + modifier;
	} else {
		if (value != "")
			value = "#"+value;
	}
	myclass = myclass.toLowerCase();
///Convert class to accomodate for Safari
	var safariclass = myclass.replace(/\#([\w\-]+)/g, "*[id\"$1\"]");
	for (var j = 0; j < document.styleSheets.length; j++) {
		var theRules = checkBrowser ();
		theRules =  document.styleSheets[j][theRules];
	//alert (theRules);
		for (var i = 0; i < theRules.length; i++) {
			if (theRules[i].selectorText.toLowerCase() == myclass || theRules[i].selectorText.toLowerCase() == safariclass) {
				theRules[i].style[element] = value;
				if (cookie)
					setcsscookie (myclass, element, value, fieldvalue);
			}
		}
	}
}

///Change CSS with values specified in the cases below
function updatecss (myclass, element, value) {
	myclass = myclass.toLowerCase();
///Convert class to accomodate for Safari
	var safariclass = myclass.replace(/\#([\w\-]+)/g, "*[id\"$1\"]");
	var theRules = checkBrowser ();
	for (var j = 0; j < document.styleSheets.length; j++) {
	
		for (var i = 0; i < document.styleSheets[j].theRules.length; i++) {
			if (theRules[i].selectorText.toLowerCase() == myclass || theRules[i].selectorText.toLowerCase() == safariclass) {
				var currentValue = theRules[i].style[element];
				var m = currentValue.match(/^(.*?)([\d]+)(.*)$/);
	
				if (m) {
					switch (value) {
						case "smaller":
							m[2]--;
						break;
				
						case "bigger":
							m[2]++;
						break;
					}
	
				var newValue = m[1] + m[2] + m[3];
				theRules[i].style[element] = newValue;
				setcsscookie (myclass,element, newValue);
				} else {
					alert ('failed');
				}
			}
		}
	}
}



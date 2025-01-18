/*Copyright (c) 2001 Internal Revenue Service
The US Government possesses the unlimited rights throughout the world for
Government purposes to publish, translate, reproduce, deliver, perform, and 
dispose of the technical data, computer software, or computer firmware 
contained herein; and to authorize others to do so.
*/

var CONTEXT_ROOT = "/modiein";

 function warnuser()
 {
 	var startTimer = new Date();
 	 	
 	if (confirm("Your session will expire in 5 minutes. If you do not click OK within 5 minutes, any information you have entered will be lost and you will need to restart your application."))
	{
		var endTimer = new Date();
		
		if ((endTimer.getTime() - startTimer.getTime()) <= (60000 * 5))
		{
			document.images("renewSession").src = CONTEXT_ROOT + "/IndividualEINClientServlet?action=RenewSessionAction&amp;nocache=" + Math.random();
			setTimeout('warnuser()', 60000 * 10);
		}
		else
		{
			document.location = CONTEXT_ROOT + "/IndividualEINClientServlet?action=ExpireSessionAction&amp;nocache=" + Math.random();
		}
	}
	else
	{
		var endTimer = new Date();

		if ((endTimer.getTime() - startTimer.getTime()) > (60000 * 5))
		{
			document.location = CONTEXT_ROOT + "/IndividualEINClientServlet?action=ExpireSessionAction&amp;nocache=" + Math.random();
		}
	}	
 }


// Focus on a field

function placeCursor(theForm)
{
/*
	for (i=0; i<theForm.length; i++)
	{ //find the next field that isn't a hidden field, and focus it
		if (theForm.elements[i].type!='hidden')
		{						
			theForm.elements[i].focus();
			break;
		}
	}
*/	
	eval("document." + theForm + ".elements[0].focus()");	
}

function setJsFlag(theForm)
{
	document.form1.jstest.value=1;
	alert(document.form1.jstest.value);
}

// NumericOnly and Autocomplete

function numericOnly(f,allow,msg,numToCheck) 
{	
	var badChar=false;
	var allowRE = null;
	var stdRE = null;
		
	stdRE = new RegExp("[0-9]");
	if (allow != '') 
	{
		allowRE = new RegExp("["+allow+"]");
	}		
	if (numToCheck == 'all')
	{
		numToCheck = f.value.length;
	}		
	for (i=0; i<numToCheck; i++) 
	{
		if (f.value.charAt(i).search(stdRE)==-1) 
		{
			if (allowRE == null) 
			{
				badChar=true;
			} 
			else if (f.value.charAt(i).search(allowRE)==-1) 
			{
				badChar=true;
			}
			if (badChar) 
			{
				if (i>0)
				{
					f.value=f.value.substr(0,i)+f.value.substr(i+1);
				}
				else
				{
					f.value=f.value.substr(i+1);
				}
			}
		}
	}
	if (msg && badChar)
	{
		if (allowRE == null)
		{
			alert("No punctuation allowed, numeric characters only.");
		}		
		else
		{
			alert("Only numeric characters or one of '"+allow+"' are allowed.");
			//  f.focus();
		}		
	}		
}

function autoTAB(theForm, theField) 
{
	//10-13-2023: Get TAB keyCode for error checking. 
	var evt = (evt) ? evt : ((event) ? event : null); 
	
	var errors = document.getElementsByClassName("validation_error_text");
	if (theField.value.length == theField.maxLength)
	{
		for (i=0; i<theForm.length; i++)
		{
			if (theForm.elements[i] == theField)
			{
				for (j=i+1; j<theForm.length; j++)
				{ //find the next field that isn't a hiddne field, and focus it
					if (theForm.elements[j].type!='hidden')
					{
						//6-7-2019: George Shoa, Fix 508 issue. If form contains error, TAB will advanced to wrong next field. 
						//If error, stop autocomplete and set focus to previous field.
						if (errors.length>0 || evt.keyCode === 9  ){//9 is TAB
							//getElementById("Phone1Id").focus();
							theForm.elements[j-1].focus();
						}
						else
						{
							theForm.elements[j].focus();
						}
						
						break;
					}
				}
				break;
			}
		}
	}
}

// Delete default text

function deleteText(theField)
{
	if (theField.value == 'Year' || theField.value == '0')
	{
		theField.value="";
	}
}

// Warning Messages for Bulk 


function cancelRequest()
{
	choice = confirm("This request will be discarded.\n\nClick OK to discard and Cancel to return.");
	return choice;
}

function cancelVerification()  //TODO:  Remove after uses have been renamed
{
	choice = confirm("Any changes you have made will be discarded.\n\nClick OK to confirm");
	return choice;
}  
  
function cancelChanges()
{
	choice = confirm("Any changes you have made will be discarded.\n\nClick OK to discard and Cancel to return.");
	return choice;
}  

function confirmStartEin()
{
	choice = confirm("Are you sure you want to start a new application?\n\nAny information you have entered will be lost.");
	return choice;
} 
function confirmGoBack()
{
	choice = confirm("Any changes you have made will be discarded.\n\nClick OK to discard and Cancel to return.");
	return choice;
} 
function confirmExit()
{
	choice = confirm("Are you sure you want to exit this application?\n\nAny information you have entered will be lost.");
	return choice;
} 
function confirmDelete()
{
	choice = confirm("Are you sure you want to delete this request?\n\nClick OK to delete and Cancel to return.");
	return choice;
}  

function confirmLeavePage()
{
	choice = confirm("Are you sure you want to navigate away from this page?\n\nAny information you have entered will be lost.\n\nClick OK to navigate away and Cancel to return.");
	return choice;
}  

function confirmLogout()
{
	choice = confirm("Are you sure you want to log out?\n\nAny requests you have entered but not yet submitted will be lost.\n\nClick OK to log out and Cancel to return.");
	return choice;
}  

function selectRadioButton(i)
{
	choice = document.form1.radioPrincipalService[i].checked=true;
	return choice;
} 

function openHelpWindowForKeyword(keyword) 
{
  	var browserString= null;
  	var locationString= null;
	var platform = navigator.platform.toLowerCase();
	var browser = navigator.appName;
	var browserVersion = navigator.appVersion;

	locationString = CONTEXT_ROOT + "/individual/help/keyword.jsp?keyword="+escape(keyword);
	browserString = "status=yes,menubar=no,toolbar=no,resizable=yes,scrollbars=yes,location=no,width=500,height=300,top=25,left=25";
	helpWindow=window.open(locationString, "help_popup", browserString);
	helpWindow.focus();
	return false;
}

function openHelpWindowForQuestion(question) 
{
  	var browserString= null;
  	var locationString= null;
	var platform = navigator.platform.toLowerCase();
	var browser = navigator.appName;
	var browserVersion = navigator.appVersion;

	locationString = CONTEXT_ROOT + "/individual/help/keyword.jsp?question="+escape(question);
	browserString= "status=yes,menubar=no,toolbar=no,resizable=yes,scrollbars=yes,location=no,width=500,height=400,top=25,left=25";
	helpWindow=window.open(locationString, "help_popup", browserString);
	helpWindow.focus();
	return false;
}

function openHelpTOCWindow(helpFile)
{
  	var browserString= null;
  	var locationString= null;
	var platform = navigator.platform.toLowerCase();
	var browser = navigator.appName;
	var browserVersion = navigator.appVersion;

	locationString=helpFile;
	browserString= "status=yes,menubar=no,toolbar=no,resizable=yes,scrollbars=yes,location=no,width=800,height=600,top=25,left=25";
	helpWindow=window.open(locationString, "help_popup", browserString);
	helpWindow.focus();
	return false;
}

function openHelpLinkWindow(url)
{
  	var browserString= null;
  	var locationString= null;
	var platform = navigator.platform.toLowerCase();
	var browser = navigator.appName;
	var browserVersion = navigator.appVersion;

	locationString=url;
	browserString= "status=yes,menubar=no,toolbar=no,resizable=yes,scrollbars=yes,location=no,width=900,height=800,top=25,left=25";
	helpWindow=window.open(locationString, "help_popup", browserString);
	helpWindow.focus();
	return false;
}

function openPDFNoticeWindow(location)
{
  	var browserString= null;
  	var locationString= null;
	var platform = navigator.platform.toLowerCase();
	var browser = navigator.appName;
	var browserVersion = navigator.appVersion;

	locationString=location;
	browserString= "status=yes,menubar=yes,toolbar=no,resizable=yes,scrollbars=yes,location=no,width=800,height=600,top=25,left=25";
	pdfWindow=window.open(locationString, "pdf_popup", browserString);
	pdfWindow.focus();
	return false;
}


//this will display internal IRS windows such as privacy policy and requirements
function openWindowForInternalSite(siteId) 
{
	var secondaryWindow = null;
	var locationString = CONTEXT_ROOT + "/IndividualEINClientServlet?action=LinkAction&linkfollowed=true&linkid="+siteId;
	var browserString = "width=800,height=500,onclick=close,toolbar=yes,location=top,directories=no,status=no,menubar=yes,scrollbars=yes,resizable=yes";
	
	if (secondaryWindow == null || secondaryWindow.closed) 
	{
		secondaryWindow=window.open(locationString, "irs_site", browserString);
	}
	else {
		secondaryWindow.close();
		secondaryWindow.location=locationString;
	}
	secondaryWindow.focus();
	return false;
}

function openWindowForExternalSite(siteId) 
{
  	var browserString= null;
  	var locationString= null;
	var platform = navigator.platform.toLowerCase();
	var browser = navigator.appName;
	var browserVersion = navigator.appVersion;

	locationString = CONTEXT_ROOT + "/common/linkcontrol.jsp?linkid="+escape(siteId);
	browserString = "status=yes,menubar=no,toolbar=no,resizable=yes,scrollbars=yes,location=yes,width=720,height=500,top=25,left=25";
	helpWindow=window.open(locationString, "external_site", browserString);
	helpWindow.focus();
	return false;
}
function openWindowForExternalUrl(siteUrl) 
{
  	var browserString= null;
  	var locationString= null;
	var platform = navigator.platform.toLowerCase();
	var browser = navigator.appName;
	var browserVersion = navigator.appVersion;

	locationString = CONTEXT_ROOT + "/common/linkcontrol.jsp?linkurl="+escape(siteUrl);
	browserString = "status=yes,menubar=no,toolbar=no,resizable=yes,scrollbars=yes,location=yes,width=720,height=500,top=25,left=25";
	helpWindow=window.open(locationString, "external_site", browserString);
	helpWindow.focus();
	return false;
}

function setFocus(){
	document.getElementsById("456");
}

function errorCheck(){
	window.onload=function(){
		var errors = document.getElementsByClassName("validation_error_text");
		var topBody = document.getElementsByClassName("body");
		if (errors.length>0){
			// if errors, set focus to top to allow JAWS to read error messages.
			//errors[0].style.backgroundColor = "yellow";
			//errors[0].focus();
			//topBody[0].style.backgroundColor = "yellow";
			topBody[0].focus();
		}
		
	}
}

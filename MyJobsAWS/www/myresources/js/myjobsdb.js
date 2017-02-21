

var w = null;
var objtype="";
var objid="";
var objshorttext="";
var objaddress="";
var objswerk="";
var currentlySyncing=false
var SAPServerPrefix="";
var SAPServerSuffix="";

var parTrace= "ON";
var syncDetsSet=false;
var demoDataLoaded=0;
var syncTransactionalDetsUpdated=false;
var syncReferenceDetsUpdated=false;
var syncUploadDetsUpdated=false;
var syncStatusType=sap.m.ButtonType.Accept;
var xmlDoc="";
var sqlMyJobsDocs;
var assetStatements=[];
var allAssetCalls=[]
function sendFormData(fname,orderno,opno,notifno){

	var c040="NA"
		var d040=""
		var c060="NA"
		var d060=""
		var c100="NA"
		var d100=""
var 	formalsampletaken = ""
var 	upstreamsenttolab= ""
var 	ptofdiscsenttolab= ""
var 	downstream1senttolab= ""
var 	downstream2senttolab= ""
var 	downstream3senttolab= ""
		console.log("sendForm="+fname+orderno)

user=localStorage.getItem("MobileUser")
empid=localStorage.getItem("EmployeeID")

			var sqlstatement="SELECT * from myformsresponses where orderno = '"+orderno+"' and opno ='"+opno+"' and formname ='"+fname+"'"
			console.log(sqlstatement)
			html5sql.process(sqlstatement,
					function(transaction, results, rowsArray){
					  if(rowsArray.length>0){
						console.log("form record found="+rowsArray.length)
						jsonstr=$.parseJSON(unescape(rowsArray[0].contents))
						console.log("1:"+jsonstr.length)
						console.log(jsonstr[0].workorder)
						console.log("x:"+jsonstr[0]["workorder"])




						if(fname=="CustomerFeedback"){
							if(jsonstr[0].reason.length>0){
								c040="LT"
								d040=jsonstr[0].reason
							}
							if(jsonstr[0].cause.length>0){
								c060="LT"
								d060=jsonstr[0].cause
							}
							if(jsonstr[0].ppmdetails.length>0){
								c100="LT"
								d100=jsonstr[0].ppmdetails
							}
							params="&RECNO="+rowsArray[0].id+"&NOTIF_TYPE=ZC&USER="+user+"&ORDER_ID="+orderno+"&NOTIF_NO="+notifno+
							"&MAIN_WORK_CTR="+selectedJobArray["orderworkcentre"]+"&PLANT="+selectedJobArray["orderplant"]+"&USER_STATUS_H="+opno+
							"&ACT_CODEGRP_1=CUST010&ACT_CODE_1="+jsonstr[0].spokentoV.substring(0,1)+"&ACT_TEXT_1="+jsonstr[0].spokentoV+
							"&ACT_CODEGRP_2=CUST020&ACT_CODE_2="+jsonstr[0].contactcardV.substring(0,1)+"&ACT_TEXT_2="+jsonstr[0].contactcardV+
							"&ACT_CODEGRP_3=CUST030&ACT_CODE_3="+jsonstr[0].custsatifaction+"&ACT_TEXT_3="+jsonstr[0].custsatifaction+
							"&ACT_CODEGRP_4=CUST040&ACT_CODE_4="+c040+"&ACT_TEXT_4="+d040+
							"&ACT_CODEGRP_5=CUST050&ACT_CODE_5="+jsonstr[0].resolvedV.substring(0,1)+"&ACT_TEXT_5="+jsonstr[0].resolvedV+
							"&ACT_CODEGRP_6=CUST060&ACT_CODE_6="+c060+"&ACT_TEXT_6="+d060+
							"&ACT_CODEGRP_7=CUST070&ACT_CODE_7="+jsonstr[0].furtherworkV.substring(0,1)+"&ACT_TEXT_7="+jsonstr[0].furtherworkV+
							"&ACT_CODEGRP_8=CUST080&ACT_CODE_8="+jsonstr[0].additionalworkV.substring(0,1)+"&ACT_TEXT_8="+jsonstr[0].additionalworkV+
							"&ACT_CODEGRP_9=CUST090&ACT_CODE_9="+jsonstr[0].ppmV.substring(0,1)+"&ACT_TEXT_9="+jsonstr[0].ppmV+
							"&ACT_CODEGRP_10=CUST100&ACT_CODE_10="+c100+"&ACT_TEXT_10="+d100
							sendSAPData("MyJobsCreateCFEED.htm",params,"UPDATE MyFormsResponses SET lastupdated = 'NEW' WHERE id='"+rowsArray[0].id+"'");
						}
						if(fname=="Pollution"){
							if(jsonstr[0].formalsampletakenV=="YES"){	formalsampletaken="X"	}
							if(jsonstr[0].upstreamsenttolabV=="YES"){	upstreamsenttolab="X"	}
							if(jsonstr[0].ptofdiscsenttolabV=="YES"){	ptofdiscsenttolab="X"	}
							if(jsonstr[0].downstream1senttolabV=="YES"){	downstream1senttolab="X"	}
							if(jsonstr[0].downstream2senttolabV=="YES"){	downstream2senttolab="X"	}
							if(jsonstr[0].downstream3senttolabV=="YES"){	downstream3senttolab="X"	}

						params="&RECNO="+rowsArray[0].id+"&USERID="+user+"&AUFNR="+orderno+"&NOTIF_NO="+notifno+"&PPIA="+orderno+','+

							jsonstr[0].pollutionsitetype.trim()+",,"+jsonstr[0].pollutionsite.trim()+","+
							jsonstr[0].dischargetype.trim()+",,"+
							jsonstr[0].watercoursetype.trim()+",,"+
							jsonstr[0].watercoursewidth.trim()+",,"+
							formalsampletaken.trim()+","+
							jsonstr[0].sizeofimpact.trim()+","+
							jsonstr[0].amenitiesimpact.trim()+",,"+
							jsonstr[0].aestheticimpact.trim()+",,"+
							jsonstr[0].upstreamdistance.trim()+","+jsonstr[0].ptofdiscdistance.trim()+","+jsonstr[0].downstream1distance.trim()+","+jsonstr[0].downstream2distance.trim()+","+jsonstr[0].downstream3distance.trim()+","+
							jsonstr[0].upstreamonsitenh3.trim()+","+jsonstr[0].ptofdisconsitenh3.trim()+","+jsonstr[0].downstream1onsitenh3.trim()+","+jsonstr[0].downstream2onsitenh3.trim()+","+jsonstr[0].downstream3onsitenh3.trim()+","+
							upstreamsenttolab.trim()+","+ptofdiscsenttolab.trim()+","+downstream1senttolab.trim()+","+downstream2senttolab.trim()+","+downstream3senttolab.trim()

							sendSAPData("MyJobsPIACreate.htm",params,"UPDATE MyFormsResponses SET lastupdated = 'NEW' WHERE id='"+rowsArray[0].id+"'");
						}

						if(fname=="Flooding"){





						locsArray = [""]
						params="&RECNO="+rowsArray[0].id+"&USERID="+user+"&AUFNR="+orderno+
						"&ZASTYP="+jsonstr[0].sewertype.trim()+
						"&ZAESSTA="+jsonstr[0].sewerstatus.trim()+
						"&ZAWEAT="+jsonstr[0].floodweather.trim()
						var pitem="";
						for(var cnt=0; cnt < jsonstr[0].location.length ; cnt++)
						{
							if(cnt>0){
								pitem+=","
							}
						 row=cnt+1;
						 litenno = row *10;
						 litem = ("0000" + litenno).slice(-4)
						 type=jsonstr[0].location[cnt]["loctype-"+row].split(":")
						 subtype=jsonstr[0].location[cnt]["locsubtype-"+row].split(":")
						 severity=jsonstr[0].location[cnt]["locseverity-"+row].split(":")
						 floc=jsonstr[0].location[cnt]["locfloc-"+row].split(":")
						 comments=jsonstr[0].location[cnt]["loccomments-"+row].split(":")
						 pitem+=orderno+','+litem+","+type[0]+","+subtype[0]+","+floc[0]+",,,,,,,,,,,,,,,,"+comments[0]+",,"+severity[0]+',1.00'
						 locsArray.push(floc[0])
						 //alert("Loc:"+orderno+','+litem+","+type[0]+","+subtype[0]+","+floc[0])
						}
						roomsArray=[]
						for(var cnt=0; cnt < jsonstr[0].room.length ; cnt++)
						{
						row=cnt+1;
						 loc=jsonstr[0].room[cnt]["roomloc-"+row].split(":")
						 room=jsonstr[0].room[cnt]["roomroom-"+row].split(":")
						 depth=jsonstr[0].room[cnt]["roomdepth-"+row].split(":")
						 comments=jsonstr[0].room[cnt]["roomcomments"+row].split(":")

						 roomsArray.push(loc[0]+"|"+room[0]+"|"+depth[0]+"|"+comments[0])


						}
						roomsArray.sort();
						var pdepth="";
						var wasitem=0;
						dno=1;
						for(var cnt=0; cnt < roomsArray.length ; cnt++)
						{
							if(cnt>0){
								pdepth+=","
							}
						theroom = roomsArray[cnt].split("|");
						 row=cnt+1;
						 loc=theroom[0]
						 litemno = row *10;
						 f1=locsArray.indexOf(loc);
						 if (f1!=wasitem){
							 wasitem = f1;
							 dno=1;
						 }else{
							 dno++;
						 }
						 litem=("0000" + f1*10).slice(-4)
						 ditem=("0000" + dno*10).slice(-4)

						 room=theroom[1]
						 depth=theroom[2]
						 comments=theroom[3]
						 pdepth+=orderno+','+litem+','+ditem+','+room+",,"+depth+",,"+comments+","
						//alert("room:"+orderno+','+litem+','+ditem+','+room+",,"+depth+",,"+comments)



						}


						//need to populate the PHDR
						//sort date & time formats
						gridref=jsonstr[0].gridref.split(",");
						if(gridref.length>1){
							ENRef=gridref[0].substring(0,9)+":"+gridref[1].substring(0,9)
						}else{
							ENRef=gridref
						}
						jsonstr[0].floodtime=jsonstr[0].floodtime+":u00"
						jsonstr[0].attendancetime=jsonstr[0].attendancetime+":00"
						flooddate=jsonstr[0].flooddate.substring(6,10)+jsonstr[0].flooddate.substring(3,5)+jsonstr[0].flooddate.substring(0,2)
						floodtime=jsonstr[0].floodtime.substring(0,2)+jsonstr[0].floodtime.substring(3,5)+jsonstr[0].floodtime.substring(6,8)
						attenddate=jsonstr[0].attendancedate.substring(6,10)+jsonstr[0].attendancedate.substring(3,5)+jsonstr[0].attendancedate.substring(0,2)
						attendtime=jsonstr[0].attendancetime.substring(0,2)+jsonstr[0].attendancetime.substring(3,5)+jsonstr[0].attendancetime.substring(6,8)
						params+="&PHDR="+orderno+','+jsonstr[0].assetref.trim()+','+jsonstr[0].psshortcode+','+jsonstr[0].causeofflood+','+
						ENRef+',,'+flooddate+','+floodtime+','+empid+','+getShortSAPDate()+','+user+','+''+','+
						""+','+"Comments"+','+jsonstr[0].spillsize+","+attenddate+","+attendtime+','+
						jsonstr[0].attendanceweather+","+jsonstr[0].previousflooding+','+jsonstr[0].floodingsource+','+jsonstr[0].rootcause+
						"&PDEPTH="+pdepth+
						"&PITEM="+pitem


							sendSAPData("MyJobsDG5Create.htm",params,"UPDATE MyFormsResponses SET lastupdated = 'NEW' WHERE id='"+rowsArray[0].id+"'");
						}
					  }
				/*
				opMessage("NewTconf Details="+newTConfDets);

				sendSAPData("MyJobsCreateTConf.htm",newTConfDets,"UPDATE MyTimeConfs SET confno = 'NEW' WHERE id='"+item['id']+"'");
						*/

					},
					 function(error, statement){
						 console.log("send Form Error: " + error.message + " when processing " + statement);
					 }
				);

}

function setUserAgent(window, userAgent) {
    if (window.navigator.userAgent != userAgent) {
        var userAgentProp = { get: function () { return userAgent; } };
        try {
            Object.defineProperty(window.navigator, 'userAgent', userAgentProp);
        } catch (e) {
            window.navigator = Object.create(navigator, {
                userAgent: userAgentProp
            });
        }
    }
}
function isTablet(customUA) {
	  var ua = customUA || navigator.userAgent;

	  if (device.os.name === device.os.OS.IOS) {
	  return /ipad/i.test(ua);
	  }
}
function sendSMS(to, message)
{
   // $.post("https://sms.cginotify.com/api/SMS/Send",{ LicenseKey: "hmJks0HcfKplAP2i4vuVrXxThFbj4JYfHmRRB1Dw", PhoneNumbers: to, Message : message}, function(data, status){
       // alert("Data: " + data + "\nStatus: " + status);
    //});
}
function convertDate(dt){
var fdt="";
	fdt = dt.substring(0,4)+"-"+dt.substring(4,6)+"-"+dt.substring(6,9)+dt.substring(9,11)+":"+dt.substring(11,13);

return fdt;
}

function setSyncingIndicator(state){

	var path = window.location.pathname;
    var page = path.split("/").pop();
    /*if(page=="Jobs.html"){

		if(state){
			console.log("on")
			sap.ui.getCore().getElementById("Syncit").setType(syncStatusType)
			sap.ui.getCore().getElementById("Syncit").setVisible(false)
			sap.ui.getCore().getElementById("jobsyncIndicator").setVisible(true)
		}else{
			console.log("off")
			sap.ui.getCore().getElementById("Syncit").setType(syncStatusType)
			sap.ui.getCore().getElementById("Syncit").setVisible(true)
			sap.ui.getCore().getElementById("jobsyncIndicator").setVisible(false)

		}
	}*/
    //if(page=="Home.html"){

		if(state){
			sap.ui.getCore().getElementById("LastSyncMesshome").setType(syncStatusType)
			sap.ui.getCore().getElementById("LastSyncMesshome").setVisible(false)
			sap.ui.getCore().getElementById("syncIndicatorhome").setVisible(true)
		}else{
			sap.ui.getCore().getElementById("LastSyncMesshome").setType(syncStatusType)
			sap.ui.getCore().getElementById("LastSyncMesshome").setVisible(true)
			sap.ui.getCore().getElementById("syncIndicatorhome").setVisible(false)

		}
//	}
}



function requestSAPData(page,params){


	opMessage(SAPServerPrefix+page);
	var myurl=SAPServerPrefix+page+SAPServerSuffix+params;
	var urlStart=myurl.substring(0, 4).toUpperCase();
	if((urlStart.indexOf("HTTP") == -1)&&(urlStart.indexOf("HTTPS") == -1)){
		 console.log("Invalid URL")
		 syncStatusType=sap.m.ButtonType.Reject
		 setSyncingIndicator(false)

		  return
		}


	$.ajax({

	    dataType: "json",
	    url: myurl,

	    timeout: 300000
		}).done(function() {
			console.log("success")
			syncStatusType=sap.m.ButtonType.Accept
		    opMessage("call success"+page );
		  }).fail( function( xhr, status ) {


		      opErrorMessage(page + status)
			  	if (status!="parsererror"){

				    if( status == "timeout" ) {
				    	syncStatusType=sap.m.ButtonType.Reject
						setSyncingIndicator(false)
						opErrorMessage(page + status);
				    }
			  	}
			}).always(function() {
					console.log("complete")
					opMessage("Complete"+page );


			  });



}



function updateMyJobDetsDraw(id,dir)
{
	html5sql.process(

			["UPDATE MyJobDetsDraw set zurl  = '"+dir+"' WHERE id = "+ id],
			function(transaction, results, rowsArray){
				buildJobDocsTable();
			},
			 function(error, statement){
				opErrorMessage("Error: " + error.message + " when jobdetsdraw processing " + statement);
			 }

		)
}

function sendSAPData(page,params,timedOutSQL){
	var TimedOut=false;
	SetLastSyncDetails("LASTSYNC_UPLOAD");
	localStorage.setItem("SAPCalling","true")
	opMessage(page+getTime());
	console.log(page+getTime())

	var myurl=SAPServerPrefix+page+SAPServerSuffix+params;

	$.ajax({
	    dataType: "json",
	    url: myurl,
	    timeout: 60000
		}).done(function() {
		    console.log("call success"+page );
		  }).fail( function( xhr, status ) {

			  	if (status!="parsererror"){

				    if( status == "timeout" ) {
				    	console.log("TimedOut1"+TimedOut)
				    	TimedOut=true;
				    	resetSENDINGData(timedOutSQL);
				    	console.log(page+status)
				    	console.log("TimedOut2"+TimedOut)
				    }
			  	}
			}).always(function() {

					console.log( "Complete "+page+ " at "+getTime()+" Timedout = "+TimedOut);
					if(TimedOut==false){
						localStorage.setItem("SAPCalling","false")
						syncUpload()
					}else{
						localStorage.setItem("SAPCalling","false")

					}


			  });

  //})


}
function resetSENDINGData(sql){

		html5sql.process(sql,
				function(transaction, results, rowsArray){

					},
				 function(error, statement){
					 window.console&&console.log("Error: " + error.message + " when processing " + statement);
				 }
			);




	}
function opMessage(msg) {
	opLog(msg,"I");
}
function opErrorMessage(msg){
	opLog(msg,"E");
}
function opWarningMessage(msg){
	opLog(msg,"W");
}

function opLog(msg, type) {
    if (localStorage.getItem("Trace") == 'ON' || type != "I") {
        nowd = getDate();
        nowt = getTime();
        dtstamp = nowd + nowt;
    var sqlstatement = 'INSERT INTO LogFile (datestamp , type, message ) VALUES ("' + dtstamp + '","' + type + '","' + msg + '");';
    console.log("LogFile SQL Statement:" + sqlstatement);
		html5sql.process(sqlstatement,
						 function(){
							 //alert("Success Creating Tables");
						 },
						 function(error, statement){
							 window.console&&console.log("Error: " + error.message + " when processing " + statement);
						 }
	    		);
	}
}
function getTraceState(){
traceState="OFF";
xtraceState="";
	html5sql.process(
		["SELECT * from MyWorkConfig where paramname = 'TRACE'"],
		function(transaction, results, rowsArray){
			if( rowsArray.length > 0) {
				traceState= rowsArray[0].paramvalue;
				}
			localStorage.setItem('Trace',traceState);
			$('#traceState').val(traceState);
			$('#traceState').selectmenu('refresh', true);

		},
		 function(error, statement){
			 window.console&&console.log("Error: " + error.message + " when processing " + statement);
		 }
	);
}
function getCFeedFollowOnState(orderno,opno){
	sap.ui.getCore().getElementById("Close_Work").setEnabled(true);

		html5sql.process(
			["SELECT * from MyFormsResponses where orderno = '"+orderno+"' and opno = '"+opno+"' and formname = 'CustomerFeedback'"],
			function(transaction, results, rowsArray){

				if( rowsArray.length <1) {
					sap.ui.getCore().getElementById("Close_Work").setState(false);
					}else{
						if(unescape(rowsArray[0].contents).indexOf("\"furtherworkV\":\"YES\"")>0){

							sap.ui.getCore().getElementById("Close_Work").setState(true);

							sap.ui.getCore().getElementById("Close_Work").setEnabled(false);
						}else{

							sap.ui.getCore().getElementById("Close_Work").setState(false);
							sap.ui.getCore().getElementById("Close_Work").setState(false);

							sap.ui.getCore().getElementById("Close_Work").setEnabled(false);
						}
					}


			},
			 function(error, statement){

				sap.ui.getCore().getElementById("Close_Work").setState(false);
			 }
		);
	}
function databaseExists(){

	html5sql.process(
		["SELECT * FROM sqlite_master WHERE type='table';"],
		function(transaction, results, rowsArray){
			if( rowsArray.length > 10) {
				//alert("Database Existsh");
				return(true);
				}
			//alert("Database does not exist")
			return(false);

		},
		 function(error, statement){
			 window.console&&console.log("Error: " + error.message + " when processing " + statement);
			 return(false);
		 }
	);

}
function SetLocalStorageChangePage(page){

	html5sql.process(
	    ["SELECT * from MyWorkConfig "],
	    function(transaction, results, rowsArray){
	      for(var i = 0; i < rowsArray.length; i++){
	        //each row in the rowsArray represents a row retrieved from the database

			if (rowsArray[i].paramname=='SERVERNAME'){
				localStorage.setItem('ServerName',rowsArray[i].paramvalue);
				localStorage.setItem('DOCSERVER',rowsArray[i].paramvalue+"/api/DocumentService?");
				mobileService = new WindowsAzure.MobileServiceClient(localStorage.getItem('ServerName'));
			}
			if (rowsArray[i].paramname=='SAPSYSTEM'){
				localStorage.setItem('SAPSystem',rowsArray[i].paramvalue);

			}
			if (rowsArray[i].paramname=='SAPCLIENT'){
				localStorage.setItem('SAPClient',rowsArray[i].paramvalue);

			}
			if (rowsArray[i].paramname=='SYNC_REFERENCE_FREQUENCY'){
				localStorage.setItem('SyncReferenceFrequency',rowsArray[i].paramvalue);

			}
			if (rowsArray[i].paramname=='SYNC_TRANSACTIONAL_FREQUENCY'){
				localStorage.setItem('SyncTransactionalFrequency',rowsArray[i].paramvalue);
			}
			if (rowsArray[i].paramname=='SYNC_UPLOAD_FREQUENCY'){
				localStorage.setItem('SyncUploadFrequency',rowsArray[i].paramvalue);
			}

			if (rowsArray[i].paramname=='LASTSYNC_REFERENCE'){
				localStorage.setItem('LastSyncReference',rowsArray[i].paramvalue);

			}
			if (rowsArray[i].paramname=='LASTSYNC_TRANSACTIONAL'){
				localStorage.setItem('LastSyncTransactional',rowsArray[i].paramvalue);
			}
			if (rowsArray[i].paramname=='LASTSYNC_UPLOAD'){
				localStorage.setItem('LastSyncUpload',rowsArray[i].paramvalue);

			}
			if (rowsArray[i].paramname=='TRACE'){
				localStorage.setItem('Trace',rowsArray[i].paramvalue);

			}
			if (rowsArray[i].paramname=='ASSET_PATH'){
				localStorage.setItem('AssetPath',rowsArray[i].paramvalue);

			}
			if (rowsArray[i].paramname=='DEBUGUSERNAME'){
				localStorage.setItem('DebugUsername',rowsArray[i].paramvalue);

			}
			if (rowsArray[i].paramname=='DEBUGSCENARIO'){
				localStorage.setItem('DebugScenario',rowsArray[i].paramvalue);

			}
			if (rowsArray[i].paramname=='DEBUGPASSWORD'){
				localStorage.setItem('DebugPassword',rowsArray[i].paramvalue);

			}
			if (rowsArray[i].paramname=='DEBUGTOKENVALIDITY'){
				localStorage.setItem('DebugTokenValidity',rowsArray[i].paramvalue);

			}
			if (rowsArray[i].paramname=='LASTTOKENREFRESH'){
				localStorage.setItem('LastTokenRefresh',rowsArray[i].paramvalue);

			}
			if (rowsArray[i].paramname == 'LastLogoff') {
			    localStorage.setItem('LastLogoff', rowsArray[i].paramvalue);
			}

	      }

	     window.location.href=page
	    },
	    function(error, statement){

	    }
	);

	}
function SetLocalStorage(){

html5sql.process(
    ["SELECT * from MyWorkConfig "],
    function(transaction, results, rowsArray){
      for(var i = 0; i < rowsArray.length; i++){
        //each row in the rowsArray represents a row retrieved from the database

		if (rowsArray[i].paramname=='SERVERNAME'){
			localStorage.setItem('ServerName',rowsArray[i].paramvalue);
			localStorage.setItem('DOCSERVER', rowsArray[i].paramvalue+"/api/DocumentService?");
			mobileService = new WindowsAzure.MobileServiceClient(localStorage.getItem('ServerName'));

		}
		if (rowsArray[i].paramname=='SYNC_REFERENCE_FREQUENCY'){
			localStorage.setItem('SyncReferenceFrequency',rowsArray[i].paramvalue);

		}
		if (rowsArray[i].paramname=='SYNC_TRANSACTIONAL_FREQUENCY'){
			localStorage.setItem('SyncTransactionalFrequency',rowsArray[i].paramvalue);
		}
		if (rowsArray[i].paramname=='SYNC_UPLOAD_FREQUENCY'){
			localStorage.setItem('SyncUploadFrequency',rowsArray[i].paramvalue);
		}

		if (rowsArray[i].paramname=='LASTSYNC_REFERENCE'){
			localStorage.setItem('LastSyncReference',rowsArray[i].paramvalue);

		}
		if (rowsArray[i].paramname=='LASTSYNC_TRANSACTIONAL'){
			localStorage.setItem('LastSyncTransactional',rowsArray[i].paramvalue);
		}
		if (rowsArray[i].paramname=='LASTSYNC_UPLOAD'){
			localStorage.setItem('LastSyncUpload',rowsArray[i].paramvalue);

		}
		if (rowsArray[i].paramname=='TRACE'){
			localStorage.setItem('Trace',rowsArray[i].paramvalue);

		}
		if (rowsArray[i].paramname=='ASSET_PATH'){
			localStorage.setItem('AssetPath',rowsArray[i].paramvalue);

		}
		if (rowsArray[i].paramname=='DEBUGUSERNAME'){
			localStorage.setItem('DebugUsername',rowsArray[i].paramvalue);

		}
		if (rowsArray[i].paramname=='DEBUGSCENARIO'){
			localStorage.setItem('DebugScenario',rowsArray[i].paramvalue);

		}
		if (rowsArray[i].paramname=='DEBUGPASSWORD'){
			localStorage.setItem('DebugPassword',rowsArray[i].paramvalue);

		}
		if (rowsArray[i].paramname=='DEBUGTOKENVALIDITY'){
			localStorage.setItem('DebugTokenValidity',rowsArray[i].paramvalue);

		}
		if (rowsArray[i].paramname=='LASTTOKENREFRESH'){
			localStorage.setItem('LastTokenRefresh',rowsArray[i].paramvalue);

		}
		if (rowsArray[i].paramname == 'LastLogoff') {
		    localStorage.setItem('LastLogoff', rowsArray[i].paramvalue);

		}

      }
      getCurrentUser();
    },
    function(error, statement){
      //hande error here
    }
);

}



function GetConfigParam(paramName){

	html5sql.process(
		["SELECT * from MyWorkConfig where paramname = '"+paramName+"'"],
		function(transaction, results, rowsArray){
			if( rowsArray.length > 0) {
				if (paramName == "TRACE"){
					parTrace=item['paramvalue'];
				}

			}


		},
		 function(error, statement){
			 window.console&&console.log("Error: " + error.message + " when processing " + statement);
		 }
	);
}
function updatePinCode(pincode){

var user=localStorage.getItem('MobileUser')
		localStorage.setItem('PinCode',pincode);

		var sqlstatement="UPDATE MyUserDets SET pincode = '"+pincode+"' WHERE mobileuser = '"+user+"';";

	html5sql.process(sqlstatement,
	 function(){
		 //alert("Success dropping Tables");
	 },
	 function(error, statement){
		 opErrorMessage("Error: " + error.message + " when updateing Pincode " + statement);
	 }
	);

}
function updateVehicleReg(reg,fullname){

	var user=localStorage.getItem('MobileUser')


			var sqlstatement="UPDATE MyUserDets SET vehiclereg = '"+reg+"', fullname = '"+fullname+"' WHERE mobileuser = '"+user+"';";

		html5sql.process(sqlstatement,
		 function(){
			 //alert("Success dropping Tables");
		 },
		 function(error, statement){
			 opErrorMessage("Error: " + error.message + " when updateing Vehicle Reg " + statement);
		 }
		);

	}
function SetConfigParam(paramName, paramValue){
	 if (paramName == 'DEBUGUSERNAME') {
	        localStorage.setItem('DebugUsername', paramValue);
	    } if (paramName == 'DEBUGSCENARIO') {
	        localStorage.setItem('DebugScenario', paramValue);
	    }
	    if (paramName == 'DEBUGPASSWORD') {
	        localStorage.setItem('DebugPassword', paramValue);
	    }
	    if (paramName == 'DEBUGTOKENVALIDITY') {
	        localStorage.setItem('DebugTokenValidity', paramValue);
	    }
	    if (paramName == 'LASTTOKENREFRESH') {
	        localStorage.setItem('LastTokenRefresh', paramValue);
	    }
	    if (paramName == 'LastLogoff') {
	        localStorage.setItem('LastLogoff', paramValue);
	    }

			if (paramName=='SERVERNAME'){
				localStorage.setItem('ServerName',paramValue);
				localStorage.setItem('DOCSERVER',paramValue+"/api/DocumentService?");
			}
			if (paramName=='SAPCLIENT'){
				localStorage.setItem('SAPClient',paramValue);
			}
			if (paramName=='SAPSYSTEM'){
				localStorage.setItem('SAPSystem',paramValue);
			}
			if (paramName=='SYNC_REFERENCE_FREQUENCY'){
				localStorage.setItem('SyncReferenceFrequency',paramValue);
			}
			if (paramName=='SYNC_TRANSACTIONAL_FREQUENCY'){
				localStorage.setItem('SyncTransactionalFrequency',paramValue);
			}
			if (paramName=='SYNC_UPLOAD_FREQUENCY'){
				localStorage.setItem('SyncUploadFrequency',paramValue);
			}
			if (paramName=='LASTSYNC_REFERENCE'){
				localStorage.setItem('LastSyncReference',paramValue);

			}
			if (paramName=='LASTSYNC_TRANSACTIONAL'){
				localStorage.setItem('LastSyncTransactional',paramValue);
			}
			if (paramName=='LASTSYNC_UPLOAD'){
				localStorage.setItem('LastSyncUpload',paramValue);

			}

			if (paramName=='TRACE'){
				localStorage.setItem('Trace',paramValue);
			}
			if (paramName=='ASSET_PATH'){
				localStorage.setItem('AssetPath',paramValue);

			}
	var sqlstatement=""
	html5sql.process(
		["SELECT * from MyWorkConfig where paramname = '"+paramName+"'"],
		function(transaction, results, rowsArray){
			if( rowsArray.length > 0) {
				sqlstatement="UPDATE MyWorkConfig SET paramvalue = '"+paramValue+"' WHERE paramname = '"+paramName+"';";
				}else{
				sqlstatement="INSERT INTO MyWorkConfig (paramname , paramvalue ) VALUES ('"+paramName+"','"+paramValue+"');";
				}
			html5sql.process(sqlstatement,
			 function(){
				 //alert("Success dropping Tables");
			 },
			 function(error, statement){
				 opErrorMessage("Error: " + error.message + " when SetConfigParam processing " + statement);
			 }
			);
		},
		function(error, statement){
			opErrorMessage("Error: " + error.message + " when SetConfigParam processing " + statement);
		}
	);
}
function SetAllConfigParam(p1,v1,p2,v2,p3,v3,p4,v4,p5,v5){
	SetConfigParam(p1,v1);
	SetConfigParam(p2,v2);
	SetConfigParam(p3,v3);
	SetConfigParam(p4,v4);
	SetConfigParam(p5,v5);
}
function CreatePhotoEntry(orderno, opno, url, name, desc , size, date, status){



	html5sql.process("INSERT INTO MyJobsPhotos (orderno, opno, url, name, desc , size, date, status) VALUES ('"+
			orderno+"','" +opno+"','" +url+"','" +name+"','"+desc+"','"+size+"','" + date+"','" + status+"');",
	 function(transaction, results, rowsArray){
		html5sql.process("select id from MyJobsPhotos where url='"+url+"';",
		 function(transaction, results, rowsArray){
			selectedPhotoID=rowsArray[0].id;
			 if(status=="Sending"){
				 	getBase64FromImageUrl(selectedPhoto,selectedPhotoID,sap.ui.getCore().getElementById('NewPhotoName').getValue())
			 }


		 },
		 function(error, statement){
			 opErrorMessage("Error: " + error.message + " when inserting Photo" + statement);
		 }
		);

		buildJobPhotoList()
	 },
	 function(error, statement){
		 opErrorMessage("Error: " + error.message + " when inserting Photo" + statement);
	 }
	);

}
function UpdatePhotoEntry(orderno, opno, id, name, desc ,status){



	html5sql.process("Update MyJobsPhotos set name ='"+name+"', desc = '"+desc+"', status = '"+status+"' where id = '"+id+"'",
	 function(transaction, results, rowsArray){
		buildJobPhotoList()
	 },
	 function(error, statement){
		opErrorMessage("Error: " + error.message + " when inserting Photo" + statement);
	 }
	);

}
function UpdatePhotoEntryonClose(orderno, opno, id, name, desc ,status){



	html5sql.process("Update MyJobsPhotos set name ='"+name+"', desc = '"+desc+"', status = '"+status+"' where id = '"+id+"'",
	 function(transaction, results, rowsArray){
		//buildJobPhotoList()
	 },
	 function(error, statement){
		 opErrorMessage("Error: " + error.message + " when inserting Photo" + statement);
	 }
	);

}
function DeletePhotoEntry(orderno, opno, id){



	html5sql.process("Delete from  MyJobsPhotos where orderno ='"+orderno+"' and opno = '"+opno+"' and id = '"+id+"'",
	 function(transaction, results, rowsArray){
		buildJobPhotoList()
	 },
	 function(error, statement){
		opErrorMessage("Error: " + error.message + " when inserting Photo" + statement);
	 }
	);

}
//*************************************************************************************************************************
//
//  User Maintenance Functions
//
//*************************************************************************************************************************
function CreateUser(muser,vehiclereg, u, p, employeeid, pincode, maptype, docserver){

	opMessage("Creating User "+muser+":"+vehiclereg+":"+u+":"+p+":"+employeeid);

	html5sql.process("delete from MyUserDets; INSERT INTO MyUserDets (mobileuser , vehiclereg, user, password ,employeeid, pincode, maptype, docserver) VALUES ('"+muser+"','" +vehiclereg+"','" +u+"','" +p+"','"+employeeid+"','"+pincode+"','" + maptype+"','" + docserver+"');",
	 function(){
		//alert("User Created");
	 },
	 function(error, statement){
		 opErrorMessage("Error: " + error.message + " when drop processing " + statement);
	 }
	);

}
function CreateAZUREUser(muser,  maptype, docserver){
	html5sql.process("SELECT * from MyUserDets where user = '"+muser+"'",
			 function(transaction, results, rowsArray){
					if( rowsArray.length < 1) {
						opMessage("Creating User "+muser);

						html5sql.process("INSERT INTO MyUserDets (mobileuser , vehiclereg, user, password ,employeeid, pincode, maptype, docserver) VALUES ('"+muser+"','','" +muser+"','','','','" + maptype+"','" + docserver+"');",
						 function(){
							localStorage.setItem("MobileUser",muser)
							requestAzureData("ZGW_MAM30_USER_VALIDATE_SRV", "UserId='" + muser + "',Password=''")
						 },
						 function(error, statement){

							 opErrorMessage("Error: " + error.message + " when drop processing " + statement);
						 }
						);

					}

			 },
			 function(error, statement){
				 opErrorMessage("Error: " + error.message + " when drop processing " + statement);
				wait = false;
			 }
			);


}
function updateMapType(maptype){

	opMessage("Setting MAP Type = "+maptype);
	//alert("UPDATE MyUserDets set maptype = '"+maptype+"' Where user = '"+localStorage.setItem("MobileUser")+"';")
	html5sql.process("UPDATE MyUserDets set maptype = '"+maptype+"' Where user = '"+localStorage.getItem("MobileUser")+"';",
	 function(){
		localStorage.setItem("MAPTYPE",maptype)
	 },
	 function(error, statement){
		 opErrorMessage("Error: " + error.message + " when drop processing " + statement);
	 }
	);


}
function updateDocServer(docserver){

	opMessage("Setting DocServer = "+docserver);
	html5sql.process("UPDATE MyUserDets set docserver = '"+docserver+"' Where user = '"+localStorage.getItem("MobileUser")+"';",
	 function(){
		localStorage.setItem("DOCSERVER",docserver)
	 },
	 function(error, statement){
		 opErrorMessage("Error: " + error.message + " when docserver " + statement);
	 }
	);


}
function ChangeUserPW(muser, u, p){

	opMessage("Changing Password for User "+muser);
	html5sql.process("UPDATE MyUserDets set password = '"+p+"' Where user = '"+u+"';",
	 function(){
		 //alert("Success dropping Tables");
	 },
	 function(error, statement){
		 opErrorMessage("Error: " + error.message + " when drop processing " + statement);
	 }
	);


}
function validateUser(u, p){
var wait = true;
var retVal= false;
	opMessage("Changing Password for User "+u);
	html5sql.process("SELECT * from MyUserDets where user = '"+u+"' and password =  '"+p+"'",
	 function(transaction, results, rowsArray){
			if( rowsArray.length > 0) {
			retval = true;
			wait = false;
			//alert("hh")
			}else{
			wait = false;
			}

	 },
	 function(error, statement){
		 opErrorMessage("Error: " + error.message + " when drop processing " + statement);
		wait = false;
	 }
	);
while(wait == true){
}
return(retVal);

}
function validateUserExists(u,p){

	opMessage("Checking for User "+u);
	html5sql.process("SELECT * from MyUserDets where user = '"+u+"' ",
	 function(transaction, results, rowsArray){
			if( rowsArray.length < 1) {
			return(2);
			}else if (rowsArray[0].password!=p){
			return(1);
			}else {
			return(0);
			}

	 },
	 function(error, statement){
		 opErrorMessage("Error: " + error.message + " when drop processing " + statement);
		return(2);
	 }
	);
return(2);

}
function getCurrentUser(){
	html5sql.process("SELECT * from MyUserDets",
			 function(transaction, results, rowsArray){
					if( rowsArray.length > 0) {
						localStorage.setItem('MobileUser',rowsArray[0].user.toUpperCase())
						localStorage.setItem("EmployeeID",rowsArray[0].employeeid)
						localStorage.setItem("VehicleReg",rowsArray[0].vehiclereg)
						localStorage.setItem('EmployeeWorkCenter',rowsArray[0].workcenter)
						localStorage.setItem('EmployeeScenario',rowsArray[0].scenario)
						localStorage.setItem("PinCode",rowsArray[0].pincode)
						localStorage.setItem("MAPTYPE",rowsArray[0].maptype)
						localStorage.setItem("DOCSERVER",rowsArray[0].docserver)
						localStorage.setItem("MobileFullname",rowsArray[0].fullname)

					}else{
						localStorage.setItem('MobileUser',"")
						localStorage.setItem("EmployeeID","")
						localStorage.setItem("VehicleReg","")
						localStorage.setItem('EmployeeWorkCenter',"")
						localStorage.setItem('EmployeeScenario',"")
						localStorage.setItem("PinCode","")
						localStorage.setItem("MAPTYPE","")
						localStorage.setItem("DOCSERVER","")
						localStorage.setItem("MobileFullname","")
					}
					checkAzureLogin()
			 },
			 function(error, statement){
				 opErrorMessage("Error: " + error.message + " when drop processing " + statement);
				 localStorage.setItem('CurrentUsername','')
			 });
}
function CheckSyncInterval(SyncType){

	var dtNow=getDate()+getTime();
					if (SyncType=='REFERENCE'){
						lastSyncDT=localStorage.getItem('LastSyncReference');

						SyncInterval=localStorage.getItem('SyncReferenceFrequency');
					}
					if (SyncType=='TRANSACTIONAL'){
						lastSyncDT=localStorage.getItem('LastSyncTransactional');
						SyncInterval=localStorage.getItem('SyncTransactionalFrequency');

					}
					if (SyncType=='UPLOAD'){
						lastSyncDT=localStorage.getItem('LastSyncUpload');
						SyncInterval=localStorage.getItem('SyncUploadFrequency');

					}

	var diff = parseDate(dtNow) - parseDate(lastSyncDT);

	//opMessage("Checking Sync Interval:--Type="+SyncType+"--Last Synced="+lastSyncDT+"--Iterval ="+SyncInterval+"--MS Since Last Sync="+diff);


	if (diff>SyncInterval){

		return true;
		}else{

		return false;
		}


}
//changes for CREOL added new parameter equipment_status//XSource
function createNotification(type, priority, group, code, grouptext, codetext, description, details, startdate, starttime, funcloc, equipment, employeeno, SpecialReq, assigntome, equipment_status)
{

var ReportedOn=getDate()+" "+getTime();
var ReportedBy=localStorage.getItem("MobileUser");
if (assigntome){
	assigntomechar='X'
}else{
	assigntomechar=''
}
var sqlstatement = "INSERT INTO MyNotifications (notifno , type, startdate, starttime, shorttext, longtext , priority , pgroup , pcode , grouptext," +
    "codetext, funcloc, equipment, assignment, SpecialReq, reportedby, reportedon, plant , orderno, funclocgis, equipmentgis, assigntome) " +
    "VALUES (" +"'NEW','" + type + "','" + startdate + "','" + starttime + "','" + description + "','" + details + "','" + priority + "','" +
                     group + "','" + code + "','" + grouptext + "','" + codetext + "','" + funcloc + "','" + equipment + "','" + employeeno + "','" +
                     SpecialReq + "','" + ReportedBy + "','" + ReportedOn + "','','','','','" + assigntomechar + "');"
    //TODO What if there is no Equipment?
sqlstatement += "INSERT INTO  MyEquipmentUpdates (state ,equipment,equipmentstatus ,shorttext ) " +
    "VALUES (" + "'NEW','" + equipment + "','" + equipment_status + "','" + description + "');"
html5sql.process(sqlstatement,
	 function(transaction, results, rowsArray){

	     console.log("here");
	 },
	 function(error, statement){

	     console.log("fhere");
	 }
	)
}



function SetLastSyncDetails(paramName){
nowd=getDate();
nowt=getTime();
paramValue=nowd+nowt;
var sqlstatement="";
var lastsync=localStorage.getItem('LastSyncedDT')	;
	if (paramName=='LASTSYNC_REFERENCE'){
		localStorage.setItem('LastSyncReference',paramValue);

	}
	if (paramName=='LASTSYNC_TRANSACTIONAL'){
		localStorage.setItem('LastSyncTransactional',paramValue);

	}
	if (paramName=='LASTSYNC_UPLOAD'){
		localStorage.setItem('LastSyncUpload',paramValue);

	}
	if (paramName=='LASTSYNC_UPLOADDT'){
		localStorage.setItem('LastSyncUploadDT',paramValue);

	}
	if(paramValue>lastsync){
		localStorage.setItem('LastSyncedDT',paramValue);
	}
	var sqlstatement=""
	html5sql.process(
		["SELECT * from MyWorkConfig where paramname = '"+paramName+"'"],
		function(transaction, results, rowsArray){
			if( rowsArray.length > 0) {
				sqlstatement="UPDATE MyWorkConfig SET paramvalue = '"+paramValue+"' WHERE paramname = '"+paramName+"';";
				}else{
				sqlstatement="INSERT INTO MyWorkConfig (paramname , paramvalue ) VALUES ('"+paramName+"','"+paramValue+"');";
				}
			html5sql.process(sqlstatement,
			 function(){
				 //alert("Success dropping Tables");
			 },
			 function(error, statement){
				 opErrorMessage("Error: " + error.message + " when Last Sync Update processing " + statement);
			 }
			);
		},
		function(error, statement){
			opErrorMessage("Error: " + error.message + " when Last Sync Update processing " + statement);
		}
	);
}

function syncTransactional() {
    if (!checkConnection()) {
        return;
    }
    var d = new Date()
    //opMessage("SYNC:localStorage.getItem('LastLogoff')=" + localStorage.getItem('LastLogoff') +  " " + "d=" + d);
	if (Date.parse(localStorage.getItem('LastLogoff')) < d) {
	    opMessage("SYNC:Logging Out");
	    logoutazure(function () { opMessage("SYNC:logoutazure from syncTransactional complete") });
	}
	else {
	    if (!CheckSyncInterval('TRANSACTIONAL')) {
	        return;
	    }

	    homepage.setTitle("MyJobs ("+myjobsVersion+") - "+localStorage.getItem("MobileUser"))
	    opMessage("SYNC:TRANSACTIONAL SyncInterval reached");
	    setSyncingIndicator(true)
	    html5sql.process(
        ["SELECT * from MyUserDets"],
        function (transaction, results, rowsArray) {
            if (rowsArray.length > 0) {
                SAPServerSuffix = "?jsonCallback=?&MYJOBSSYSTEM=" + localStorage.getItem('SAPSystem') + "&sap-client=" + localStorage.getItem('SAPClient') + "&sap-user=" + rowsArray[0].user + "&sap-password=" + rowsArray[0].password + "&username=" + rowsArray[0].user;

                html5sql.process("SELECT * from MyWorkConfig where paramname = 'SERVERNAME'",
                function (transaction, results, rowsArray) {
                    if (rowsArray.length > 0) {
                        SetLastSyncDetails("LASTSYNC_TRANSACTIONAL");
                        localStorage.setItem('LastSyncTransactionalDetails', '');
                        syncTransactionalDetsUpdated = false;
                        SAPServerPrefix = $.trim(rowsArray[0].paramvalue);
                        localStorage.setItem('ServerName', $.trim(rowsArray[0].paramvalue));
                        localStorage.setItem('DOCSERVER', $.trim(rowsArray[0].paramvalue) + "/api/DocumentService?");
                        currentlySyncing = true;

                        opMessage("SYNC:TRANSACTIONAL calling ZGW_GET_JOB_DETAILS");
                        //requestAzureData("ZGW_GET_JOB_DETAILS", localStorage.getItem('MobileUser')) //AZURE
                        requestAzureData("ZGW_MAM30_001_GET_JOB_DETAILS", localStorage.getItem('MobileUser'))//changes for CR work bundling
                    }

                },
                function (error, statement) {
                    opErrorMessage("Error: " + error.message + " when syncTransactional processing " + statement);
                }
                );
            }
        },
        function (error, statement) {
            opErrorMessage("Error: " + error.message + " when syncTransactional processing " + statement);
        }
        );


	}




	}




function syncUpload() {
	var UploadSQLStatement=""
if(!checkConnection()){
		return;
	}

if (Postingazuredataflag) {
    opMessage("SYNC:UPLOAD Postingazuredataflag is true - exiting syncUpload");
		return;
}

	UploadSQLStatement="select 'VehicleCheck' as type, '' as extra,id as id, recordupdated from MyVehicleCheck where state = 'NEW' "
		UploadSQLStatement+=" union "
		UploadSQLStatement+=" select 'NotificationsZ7' as type,   shorttext as extra,id    as id, recordupdated from MyNotifications where notifno = 'NEW' and type = 'Z7' "
		UploadSQLStatement+=" union "
		UploadSQLStatement+=" select 'Notifications' as type,   shorttext as extra,id    as id, recordupdated from MyNotifications where notifno = 'NEW' and type <> 'Z7' "
		UploadSQLStatement+=" union "
		UploadSQLStatement+=" select 'NotificationsZ9' as type,  '' as extra,id    as id, recordupdated from MyNotifications where state = 'NEW' and type = 'Z9' "
		UploadSQLStatement+=" union "
		UploadSQLStatement+=" select 'ObjectList' as type,  '' as extra,id    as id, recordupdated from MyObjectListData where state = 'NEW' "
		UploadSQLStatement+=" union "
    /*changes for CREOL*/UploadSQLStatement += " select 'EquipmentStatus' as type,   '' as extra,id, recordupdated from MyEquipmentUpdates where state = 'NEW' "
        UploadSQLStatement+=" union "
        UploadSQLStatement += " select 'EquipmentStatusClose' as type, '' as extra, id    as id, recordupdated from MyJobClose where state = 'NEW' "
        UploadSQLStatement+=" union "
        	//end of changes
		UploadSQLStatement+=" select 'StatusUpdate' as type,  status as extra, id    as id, recordupdated from MyStatus where state = 'NEW' "
		UploadSQLStatement+=" union "
		UploadSQLStatement+=" select 'JobClose' as type,  '' as extra, id    as id, recordupdated from MyJobClose where state = 'NEW' "
		UploadSQLStatement+=" union "
		UploadSQLStatement+=" select 'JobAddWork' as type,  '' as extra, id    as id, recordupdated from MyJobAddWork where state = 'NEW' "
		UploadSQLStatement+=" union "
		UploadSQLStatement+=" select 'TimeConf' as type,  '' as extra, id    as id, recordupdated from MyTimeConfs where confno = 'NEW' "
		UploadSQLStatement+=" union "
		UploadSQLStatement+=" select 'MPointDoc' as type,   '' as extra,id    as id, recordupdated from MyMpointDocs where state = 'NEW' "
		UploadSQLStatement+=" union "
		UploadSQLStatement+=" select 'Flooding' as type,   '' as extra,id    as id, recordupdated from MyFormsResponses where lastupdated='CLOSED' and formname = 'Flooding' "
		UploadSQLStatement+=" union "
		UploadSQLStatement+=" select 'Pollution' as type,   '' as extra,id    as id, recordupdated from MyFormsResponses where lastupdated='CLOSED' and formname = 'Pollution' "
		UploadSQLStatement+=" union "
		UploadSQLStatement+=" select 'CustomerFeedback' as type,  '' as extra, id    as id, recordupdated from MyFormsResponses where lastupdated='CLOSED' and formname = 'CustomerFeedback' "
		UploadSQLStatement+=" order by recordupdated asc "

		html5sql.process(UploadSQLStatement,
		function(transaction, results, rowsArray){


		if (rowsArray.length>0) {
		    opMessage("SYNC:UPLOAD Calling syncUploadAzure");

			setSyncingIndicator(true);
		item = rowsArray[0];
		syncUploadAzure(item.id,item.type)
		//syncUploadNew(item.id,item.type)
		}else{
		   // opMessage("SYNC:UPLOAD no rows returned - NOT calling syncUploadAzure");
		}
		},
		function(error, statement){
			opErrorMessage("Error: " + error.message + " when processing " + statement);
		}
		);

}
function syncDocuments(){
	var DocSQLStatement
	if(!checkConnection()){
			return;
		}

		if(Postingazuredataflag){
		    opMessage("SYNC:UPLOAD: Postingazuredataflag=TRUE exiting syncDocuments");
			return;
		}

			var DocSQLStatement="select zurl as type,  '' as extra, id    as id, recordupdated from MyJobDetsDraw where zurl like 'RequestLiveLink%' "
				DocSQLStatement+=" union "
				DocSQLStatement+=" select zurl as type,  '' as extra, id    as id, recordupdated from MyJobDetsDraw where zurl like 'WaitingLiveLink%' "
				DocSQLStatement+=" order by recordupdated asc "

			html5sql.process(DocSQLStatement,
			function(transaction, results, rowsArray){


			if (rowsArray.length>0) {
				setSyncingIndicator(true);
			item = rowsArray[0];
			syncUploadAzure(item.id,item.type+":0")
			//syncUploadNew(item.id,item.type)
			}else{

			}
			},
			function(error, statement){
				opErrorMessage("Error: " + error.message + " when sync documents processing " + statement);
			}
			);

	}



function syncReference() {
    if (!CheckSyncInterval('REFERENCE')) { return; }
    if (!checkConnection()) {
        return;
    }
    opMessage("Synchronizing Reference Data");
    setSyncingIndicator(true);
    tidyLog();
    html5sql.process(
			["SELECT * from MyUserDets"],
			function (transaction, results, rowsArray) {
			    if (rowsArray.length > 0) {
			        SAPServerSuffix = "?jsonCallback=?&MYJOBSSYSTEM=" + localStorage.getItem('SAPSystem') + "&sap-client=" + localStorage.getItem('SAPClient') + "&sap-user=" + rowsArray[0].user + "&sap-password=" + rowsArray[0].password + "&username=" + rowsArray[0].mobileuser;
			        myScenario = rowsArray[0].scenario
			        html5sql.process("SELECT * from MyWorkConfig where paramname = 'SERVERNAME'",
							function (transaction, results, rowsArray) {
							    if (rowsArray.length > 0) {
							        SetLastSyncDetails("LASTSYNC_REFERENCE");
							        localStorage.setItem('LastSyncReferenceDetails', '');
							        localStorage.setItem('ServerName', $.trim(rowsArray[0].paramvalue));
							        localStorage.setItem('DOCSERVER', $.trim(rowsArray[0].paramvalue)+"/api/DocumentService?");
							        syncReferenceDetsUpdated = false;
							        SAPServerPrefix = $.trim(rowsArray[0].paramvalue);
							        opMessage("Sending SAP Request for Ref Data");
							        //getAssetFiles()
							        //requestSAPData("MyJobsRefData.htm",'');
							        //requestSAPData("MyJobsRefDataCodes.htm",'');
							        // requestSAPData("MyJobsUsers.htm",''); /////////This was the Old SAP Call
							        //requestSAPData("MyJobsAssetPlantsExt.htm",'');
							        //requestSAPData("MyJobsVehiclesDefault.htm",'');
							        //requestSAPData("MyJobsVehicles.htm",'');
							        //requestDEMOData('MyForms.json');
							        //requestDEMOData('PE29.json');
							        //requestDEMOData('POSTRIDGE2.json');
							        //requestDEMOData('MyJobsDG5Codes.json');
							        //Start of Azure
							        requestAzureData("ZGW_MAM_MAINT_PARAM", "Name ne 'ALL'");
							        requestAzureData("ZGW_MAM30_090_GETLIST_T3", "");             //Users
							        requestAzureData("ZGW_MAM30_VEHICLE", "");                    //vehicles
							        requestAzureData("ZG_MAM30_APPBAR_CTRL_SRV", "WHERE scenario = '" + myScenario + "'");             //AppBar
							        requestAzureData("ZGW_MAM30_REFDATA_T3_SRVActivity", "");     //Activities
							        requestAzureData("ZGW_MAM30_REFDATA_T3_SRVNotifTypes", "WHERE myalmScenario = '" + myScenario + "'");     //NotifTypes
							        requestAzureData("ZGW_MAM30_REFDATA_T3_SRVPAICode", "WHERE myalmScenario = '" + myScenario + "'");        // PAI Codes
							        requestAzureData("ZGW_MAM30_RFV_T3_SRV", "");                 // Variances RFV
							        requestAzureData("ZGW_MAM30_DG5_PIA_CODES_T3Dg5Code", "");
							        requestAzureData("ZGW_MAM30_DG5_PIA_CODES_T3Dg5Rel", "");
							        getAssets()
							        //requestAzureData("ZGW_GET_JOB_DETAILS","PSMITH11")
							        //End of Azure
							        requestAzureData("ZACAT001AssetCaptureCategory", "");
							        requestAzureData("PlantGroupCodesZPLG003", "");
							        requestAzureData("SystemCodesDescriptionZSYS004", "");
							        requestAzureData("FunctionTypeCodesZNAM005", "");
							        requestAzureData("EquipmentTypeCodesZEGI006", "");
							        requestAzureData("PlantGroupProcessGroupCodesZPLG_PRG007", "");
							        requestAzureData("AssetTypeCodesZAST008", "");
							        requestAzureData("EGINameCodeMappingZAEGI_NC", "");
							        requestAzureData("DecommissionStatusZDECOMSTAT", "");
							       // requestAzureData("ZGW_MAM_SITE_REFDATA", "");
							        requestAzureData("ZGW_MAM30_031_REFDATA_T3_SRVModel", "");
							        requestAzureData("ZGW_MAM30_031_REFDATA_T3_SRVManufacturer", "");
							        getFormsDL();

							    }

							},
					function (error, statement) {
					    opErrorMessage("Error: " + error.message + " when syncTransactional processing " + statement);
					}
					);
			    }
			},
			function (error, statement) {
			    opErrorMessage("Error: " + error.message + " when syncTransactional processing " + statement);
			}
	);







}


//*************************************************************************************************************************
//
//  Update Routines
//
//*************************************************************************************************************************
function updateOrderEquipment(orderno, property, funcloc, equipment)
{

	html5sql.process("UPDATE MyOrders SET property = '"+property+"', funcloc =  '"+funcloc+"',  equipment =  '"+equipment+"' where orderno = '"+orderno+"' ",
	 function(){
		 //alert("Success dropping Tables");
	 },
	 function(error, statement){
		 opErrorMessage("Error: " + error.message + " when updateOrderEquipment processing " + statement);
	 }
	);
}


function updateOrderAddress(orderno, house, houseno, street, district, city, postcode, workaddress)
{

	html5sql.process("UPDATE MyOrders SET house = '"+house+"', houseno = '"+houseno+"',  street ='"+street+"',  district = '"+district+"', city = '"+city+"',  postcode = '"+postcode+"',  workaddress='"+workaddress+"' where orderno = '"+orderno+"' ",
	 function(){
		 //alert("Success dropping Tables");
	 },
	 function(error, statement){
		 opErrorMessage("Error: " + error.message + " when updateOrderAddress processing " + statement);
	 }
	);
}
function updateNotifLatLong(notifno, fname, latlong)
{
res=notifno.split("|");


	html5sql.process("UPDATE MyOrders SET "+fname+" = '"+latlong+"' where id = '"+res[1]+"';",
	 function(){
		 //alert("Success dropping Tables");
	 },
	 function(error, statement){
		 opErrorMessage("Error: " + error.message + " when updateNotifLatLong processing " + statement);
	 }
	);
}
function updateOrderLatLong(orderno, fname, latlong)
{

	html5sql.process("UPDATE MyOrders SET "+fname+" = '"+latlong+"' where orderno = '"+orderno+"';",
	 function(){
		 //alert("Success dropping Tables");
	 },
	 function(error, statement){
		 opErrorMessage("Error: " + error.message + " when updateOrderLatLong processing " + statement);
	 }
	);
}

function updateOperationStatus(orderno, opno, code, status)
{

//	Remove the Create NWWK for New Work and overide the CONF with NWWK
	sqltimestamp=""

		if(code=='ACPT'){
			sqltimestamp=", acptDate = '"+statusUpdateDate+"', acptTime ='"+statusUpdateTime+"'"
		}else if(code=='SITE'){
			sqltimestamp=", onsiteDate = '"+statusUpdateDate+"', onsiteTime ='"+statusUpdateTime+"'"
		}else if(code=='PARK'){
			sqltimestamp=", parkDate = '"+statusUpdateDate+"', parkTime ='"+statusUpdateTime+"'"
			updateMeasurementDocsState(orderno,opno,"NEW")
		}else if(code=='CONF'){
			updateMeasurementDocsState(orderno,opno,"NEW")

		}

	html5sql.process("update  myjobdets set status = '"+code+"', statusDescS = '"+code+"', statusDescL =  '"+code+"'"+sqltimestamp+" ,tconf_date = '"+statusUpdateDate+"', tconf_time = '"+statusUpdateTime+"' where  orderid = '"+orderno+"' and ordnoOp = '"+ opno+"';",
			function(){
		if((code=='CONF')&&(followOnWork=="YES")&&(NWWKFlag))
		{
			code='NWWK'
				status='New Work'
		}
		html5sql.process("insert into mystatus (orderno, opno, state,  stsma, status, actdate, acttime, statusdesc) values("+
				"'"+orderno+"','"+opno+"','NEW','ZMAM_1', '"+code+"','"+statusUpdateDate+"','"+statusUpdateTime+"','"+status+"');",
				function(){
			if((code=="REJ1")||(code=="REJ2")){
				updateJobDetsStatus(orderno, opno, code)
			}
			if((code=='CONF')&&(followOnWork=="YES"))
			{
//				this is where we create the Follow on Work Status NWWK or MRWK
//				createNewStatus(CurrentOrderNo, CurrentOpNo, "NWWK", "New Work")
			}

		},
		function(error, statement){
			opErrorMessage("Error: " + error.message + " when InsertOperationStatus processing " + statement);
		}
		);
	},
	function(error, statement){
		opErrorMessage("Error: " + error.message + " when insertOperationStatus processing " + statement);

	}
	);
}
function updateMeasurementDocsState(orderno, opno, state)
{

//	Update all Measurement Docs to state = "NEW" ready for sending


	html5sql.process("update  mympointdocs set state = 'NEW'  where  orderno = '"+orderno+"' and opno = '"+ opno+"';",
			function(){


	},
	function(error, statement){
		opErrorMessage("Error: " + error.message + " when Updateing mympointdocs state " + statement);

	}
	);
}
function createNewStatus(orderno, opno, code, status)
{



	html5sql.process("insert into mystatus (orderno, opno, state,  stsma, status, actdate, acttime, statusdesc) values("+
			"'"+orderno+"','"+opno+"','NEW','ZMAM_1', '"+code+"','"+statusUpdateDate+"','"+statusUpdateTime+"','"+status+"');",
			function(){


	},
	function(error, statement){
		opErrorMessage("Error: " + error.message + " when InsertOperationStatus processing " + statement);
	}
	);

}
//AZURE
function updateJobDetsStatus(orderno, opno, status)
{



	html5sql.process("update  myjobdets set status = '"+status+"', statusDescS = '"+status+"', statusDescL =  '"+status+"' ,tconf_date = '"+statusUpdateDate+"', tconf_time = '"+statusUpdateTime+"' where  orderid = '"+orderno+"' and ordnoOp = '"+ opno+"';",
			function(){


	},
	function(error, statement){
		opErrorMessage("Error: " + error.message + " when insertOperationStatus processing " + statement);

	}
	);
}
//AZURE
function updateJobDetsDateTime(orderno, opno)
{



	html5sql.process("update  myjobdets set tconf_date = '"+statusUpdateDate+"', tconf_time = '"+statusUpdateTime+"' where  orderid = '"+orderno+"' and ordnoOp = '"+ opno+"';",
			function(){


	},
	function(error, statement){
		opErrorMessage("Error: " + error.message + " when insertOperationStatus processing " + statement);

	}
	);
}
function countStatus()
{



	html5sql.process("select count(*) as PARK ,   (select count(*)   from myjobdets  where status = 'ACPT') as ACPT, (select count(*)   from myjobdets  where status = 'SITE') as SITE from myjobdets  where status = 'PARK'",
			function(transaction, results, rowsArray){
		localStorage.setItem("totalParked",rowsArray[0].PARK)
		localStorage.setItem("totalAccepted",'0')
		if(rowsArray[0].ACPT!='0'){
			localStorage.setItem("totalAccepted",'1')
		}
		if(rowsArray[0].SITE!='0'){
			localStorage.setItem("totalAccepted",'1')
		}

	},
	function(error, statement){
		opErrorMessage("Error: " + error.message + " when insertOperationStatus processing " + statement);

	}
	);
}

//*************************************************************************************************************************
//
//  Create Routines
//
//*************************************************************************************************************************

function createAWSEODNotif(workdate,homedate,empno)
{



	wdate=convertEODDate(workdate).split(" ")
	hdate=convertEODDate(homedate).split(" ")

	html5sql.process("INSERT INTO MyNotifications (notifno , type, startdate, starttime, enddate, endtime, shorttext) VALUES ("+
					 "'NEW','Z7','"+wdate[0]+"','"+wdate[1]+"','"+hdate[0]+"','"+hdate[1]+"','Day End Travel/"+getDate()+"/"+empno+"');",
	 function(transaction, results, rowsArray){


	 },
	 function(error, statement){
		 opErrorMessage("Error: " + error.message + " when insertEOD Notif processing " + statement);

	 } )

}
//added parameter equipmentstatus for CREOL
function createAWSJobClose(order,opno,notifno, details, empid,work_cntr,closedate,closetime, funcloc , equipment, inshift , outofshift , pgrp, pcode, agrp, acode, igrp, icode, followon , variance, reason,oSwitchFlooding,oSwitchPollution,oSwitchCustFeed,scode,sdesc,equipmentstatus)
{

html5sql.process("INSERT INTO  MyJobClose (orderno , opno, notifno, details, empid, work_cntr, state , closedate, closetime, funcloc , equipment, inshift , outofshift , pgrp, pcode, agrp, acode, igrp, icode, followon , variance, reason,equipmentstatus) VALUES ("+
			 "'"+order+"','"+opno+"','"+notifno+"','"+details+"','"+empid+"','"+work_cntr+"','NEW','"+closedate+"','"+closetime+"','"+
			 funcloc+"','"+equipment+"','"+inshift+"','"+outofshift+"','"+pgrp+"','"+pcode+"','"+agrp+"','"+
			 acode+"','"+igrp+"','"+icode+"','"+followon+"','"+variance+"','"+reason+"','"+equipmentstatus+"');",
	 function () {
	     //If this is a ZPM3 job then we also need to create a new job using our new ZGW_MAM30_011_CREATE_NEW_JOB_SRV service
	     if (notifno.length<1){
	         html5sql.process("INSERT INTO MyNotifications (state , type, orderno, reportedby, longtext,equipment,equipmentstatus) VALUES (" +
					         "'NEW','Z9','" + order + "','" + empid + "','" + details + "','" + equipment + "','" + equipmentstatus + "');",
	         function (transaction, results, rowsArray) {


	         },
	         function (error, statement) {
	             opErrorMessage("Error: " + error.message + " when ZPM3 processing " + statement);

	         })
	     }
	 else{
	         html5sql.process("INSERT INTO  MyNotifications (state , type, orderno, reportedby,notifno, longtext,equipment,equipmentstatus) VALUES (" +
					         "'NEW','Z9','" + order + "','" + empid + "','" + notifno + "','" + details + "','"  + equipment + "','" + equipmentstatus + "');",
	         function (transaction, results, rowsArray) {
	         },
	         function (error, statement) {
	             opErrorMessage("Error: " + error.message + " when ZPM3 processing " + statement);
	         })
	     }

	     var sqlStatementUPDATEMyObjectListData = "UPDATE MyObjectListData SET state='NEW' WHERE orderid = '" + order.replace(/^[0]+/g, "") + "' ;"
	     html5sql.process(sqlStatementUPDATEMyObjectListData,
              function () {
              },
              function (error, statement) {
                  opErrorMessage("Error: " + error.message + " when MyObjectListdata processing " + statement);
              }
             );


			updateOperationStatus(order, opno, scode ,sdesc)
			if(oSwitchFlooding){

				 updateFormsResponseDate("Flooding",order,opno)

			 }else{

				 deleteFormsResponseDate("Flooding",order,opno)
			 }
			 if(oSwitchPollution){
				 updateFormsResponseDate("Pollution",order,opno)
			 }else{
				 deleteFormsResponseDate("Pollution",order,opno)
			 }
			 if(	 oSwitchCustFeed){
				 updateFormsResponseDate("CustomerFeedback",order,opno)
			 }else{
				 deleteFormsResponseDate("CustomerFeedback",order,opno)
			 }

	 },
	 function(error, statement){

		 opErrorMessage("Error: " + error.message + " when Creating JobClose  " + statement);
	 }
	);
}
function getAssetHistory(fl)
{
	var sqlStatement="select * from MyMenuBar where subitem = 'Asset history'"

	html5sql.process(sqlStatement,
		function(transaction, results, rowsArray){
			if(rowsArray<1){

				return "";
			}else{

				url=rowsArray[0].command

				url=url.replace("{SUPUSERNAME}",localStorage.getItem("MobileUser"))
				//url+="&TPLNR="+fl
				url=url.replace("{TPLNR}",fl)
				//window.open(url, "_blank", 'location=yes,closebuttoncaption=Return')
				window.open(url, "_system")
			}

		 },
		 function(error, statement){
			 opErrorMessage("Error: " + error.message + " when getAssetHistory processing " + statement);
		 }
		);
}

function updateDocumentState(id,status)
{


	var sqlStatement="UPDATE MyFormsResponses SET lastupdated='"+status+"',status='"+status+"' where id = '"+id+"'";

	html5sql.process(sqlStatement,
		 function(){

		//buildJobDocsTable()

		 },
		 function(error, statement){

			 opErrorMessage("Error: " + error.message + " when updateDocumentState processing " + statement);
		 }
		);
}
function updatePhotoState(id,status)
{


	var sqlStatement="UPDATE MyJobsPhotos SET status='"+status+"' where id = '"+id+"'";

	html5sql.process(sqlStatement,
		 function(){


		 },
		 function(error, statement){

			 opErrorMessage("Error: " + error.message + " when updatePhotoState processing " + statement);
		 }
		);
}
function updateAttachmentState(id,status)
{


	var sqlStatement="UPDATE MyJobsDocs SET status='"+status+"' where id = '"+id+"'";

	html5sql.process(sqlStatement,
		 function(){


		 },
		 function(error, statement){

			 opErrorMessage("Error: " + error.message + " when updateAttachmentState processing " + statement);
		 }
		);
}
function updateAttachmentStatus(url,name,type,size,lastmod,status)
{


	var sqlStatement="UPDATE MyJobsDocs SET status='"+status+"';"
	sqlMyJobsDocs="";
	html5sql.process(sqlStatement,
		 function(){

				if(url=="*"){

					BuildDocumentsTable()
				}
		 },
		 function(error, statement){
			 opErrorMessage("Error: " + error.message + " when updateAttachmentStatus processing " + statement);
		 }
		);
}
function deleteAllDocs()
{


	var sqlStatement="delete from MyJobsDocs"

	html5sql.process(sqlStatement,
		 function(){


		opMessage("All Docs deleted")

		 },
		 function(error, statement){
			 opErrorMessage("Error: " + error.message + " when deleteAllDocs processing " + statement);

		 }
		);
}
function addAttachment(orderno,opno, url, name, type, size)
{


	var sqlstatement="insert into MyJobsDocs (orderno,opno, url, name, type, size, status) values ("+
	"'"+orderno+"','"+opno+"','"+url+"','"+name+"','"+type+"','"+size+"','Local')";

	html5sql.process(sqlstatement,
		function(transaction, results, rowsArray){


		 },
		 function(error, statement){
			 opErrorMessage("Error: " + error.message + " when addAttachment processing " + statement);
		 }
		);
}
function updateDocumemntsTable(url, name,type,size,lastmod)
{




	var sqlStatement="select * from MyJobsDocs where url  = '"+url+"' and name = '"+name+"';"

	html5sql.process(sqlStatement,
		function(transaction, results, rowsArray){
			if(rowsArray<1){
				sqlMyJobsDocs+="insert into MyJobsDocs (url, name,type,size,lastmod, status) values ("+
				"\""+url+"\","+"\""+name+"\","+"\""+type+"\","+"\""+size+"\","+"\""+lastmod+"\", \"REMOTE\");" // New Download
			}else if((rowsArray[0].type==type)&&(rowsArray[0].size==size)&&(rowsArray[0].lastmod==lastmod)){

				sqlMyJobsDocs+="UPDATE MyJobsDocs SET status = \"LOCAL\" , size = \""+size+"\" , lastmod = \""+lastmod+"\" where id = "+rowsArray[0].id+";" // File not changed so dont Download
			}else{
				sqlMyJobsDocs+="UPDATE MyJobsDocs SET status = \"REMOTECHANGED\" , type = \""+type+"\" , size = \""+size+"\" , lastmod = \""+lastmod+"\" where id = "+rowsArray[0].id+";"// File Changed so download
			}

		 },
		 function(error, statement){
			 opErrorMessage("Error: " + error.message + " when updateDocumemntsTable processing " + statement);
		 }
		);
}
function updateDocsTable()
{

	html5sql.process(sqlMyJobsDocs,
			function(transaction, results, rowsArray){


				html5sql.process("select count(*)  as tot,  (select count(*) from MyJobsDocs where status = \"DELETE\") as del,  " +
						"(select count(*) from MyJobsDocs where status = \"REMOTE\") as ins, "+
						"(select count(*) from MyJobsDocs where status = \"REMOTECHANGED\") as mod, "+
						"(select count(*) from MyJobsDocs where status = \"LOCAL\") as loc from MyJobsDocs",

						function(transaction, results, rowsArray){

							document.getElementById('DocTot').innerHTML=rowsArray[0].tot
							document.getElementById('DocDel').innerHTML=rowsArray[0].del
							document.getElementById('DocNew').innerHTML=rowsArray[0].ins
							document.getElementById('DocMod').innerHTML=rowsArray[0].mod
							document.getElementById('DocLoc').innerHTML=rowsArray[0].loc

							html5sql.process("select * from MyJobsDocs where status = \"REMOTE\" or status = \"REMOTECHANGED\"",

									function(transaction, results, rowsArray){

										oProgIndDL.setPercentValue(5);
										oProgIndDL.setDisplayValue("5" + "%");
										percentagedownloaded=0;
										fileDownloadCnt=0;

										filesToDownload = rowsArray;

										checkFileDownload()
									 },
									 function(error, statement){
										 opErrorMessage("Error: " + error.message + " when updateDocumemntsTable1 processing " + statement);
									 }
									);

						 },
						 function(error, statement){
							 opErrorMessage("Error: " + error.message + " when updateDocumemntsTable2 processing " + statement);
						 }
						);
			 },
			 function(error, statement){
				 opErrorMessage("Error: " + error.message + " when updateDocumemntsTable3 processing " + statement);
			 }
			);


}
function updateFormsResponseDate(formname, order,opno)
{



	var sqlStatement="UPDATE MyFormsResponses "+
				 "SET lastupdated='CLOSED', recordupdated=STRFTIME('%Y-%m-%d %H:%M:%f', 'NOW') "+
				 "where orderno = '"+order+"' and opno = '"+opno+"' and formname = '"+formname+"' ;"


   opMessage("About to Update Formdata Date "+order+":"+opno+":"+formname)

	html5sql.process(sqlStatement,
		 function(transaction, results, rowsArray){

		opMessage("Formdata Updated OK")



		 },
		 function(error, statement){

			 opErrorMessage("Error: " + error.message + " when Updateing FormsResponses Date" );

		 }
		);

}
function deleteFormsResponseDate(formname, order,opno)
{



	var sqlStatement="DELETE from MyFormsResponses "+
				 "where orderno = '"+order+"' and opno = '"+opno+"' and formname = '"+formname+"' ;"


   opMessage("About to Delete Formdata "+order+":"+opno+":"+formname)

	html5sql.process(sqlStatement,
		 function(transaction, results, rowsArray){

		opMessage("Formdata Deleted OK")



		 },
		 function(error, statement){

			 opErrorMessage("Error: " + error.message + " when Deleting FormsResponses" );

		 }
		);

}

function renameDocument(id){
	selectedDocId=id;
	var sqlStatement="select formname, formdesc from MyFormsResponses where id = '"+id+"'"




	html5sql.process(sqlStatement,
			function(transaction, results, rowsArray){

		if(rowsArray.length>0){
			sap.ui.getCore().getElementById('attachmentFname').setValue(rowsArray[0].formdesc)
		}else{
			sap.ui.getCore().getElementById('attachmentFname').setValue("")
		}
		formFileName.open()

	},
	function(error, statement){
		opErrorMessage("Error: " + error.message + " when renameDocument "+statement );

	}
	);
}
function uploadDocument_Image_NotUsed(id){

	selectedDocId=id;
	var sqlStatement="select formname, formdesc, htmlbody from MyFormsResponses where id = '"+id+"'"



	html5sql.process(sqlStatement,
			function(transaction, results, rowsArray){

		if(rowsArray.length>0){




			createBase64FormXML(rowsArray[0].htmlbody,rowsArray[0].formdesc+".html",id,rowsArray[0].formdesc)

		}


	},
	function(error, statement){

		opErrorMessage("Error: " + error.message + " when uploadDocument_Image_NotUsed "+statement );
	}
	);
}
function uploadDocument(id){

	selectedDocId=id;
	var sqlStatement="select formname, formdesc, htmlbody,htmlreadonly from MyFormsResponses where id = '"+id+"'"



	html5sql.process(sqlStatement,
			function(transaction, results, rowsArray){

		if(rowsArray.length>0){
			x=unescape(rowsArray[0].htmlreadonly)
			y=unescape(encodeURIComponent(x))

			formHTML=window.btoa(HTMLFormStart+y+HTMLFormEnd)

			createBase64FormXML(formHTML,rowsArray[0].formdesc+".html",id,rowsArray[0].formdesc)

		}


	},
	function(error, statement){

		opErrorMessage("Error: " + error.message + " when uploadDocument "+statement );
	}
	);
}
function uploadAttachment(id){

	selectedDocId=id;
	var sqlStatement="select * from MyJobsDocs where id = '"+id+"'"



	html5sql.process(sqlStatement,
			function(transaction, results, rowsArray){
		//updatePhotoState(id,"Sending");

		if(rowsArray.length>0){

			getBase64FromAttachmentUrl(rowsArray[0].url,rowsArray[0].id,rowsArray[0].name,rowsArray[0].type)

		}


	},
	function(error, statement){

		opErrorMessage("Error: " + error.message + " when uploadAttachment "+statement );
	}
	);

}
function deleteAttachment(id){
	var sqlStatement=""
	 sap.m.MessageBox.show("Delete Attachment", {
        icon: sap.m.MessageBox.Icon.WARNING ,
        title: "Are you sure?",
        actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
			 onClose: function(oAction){

				 if(oAction=="YES"){

					 sqlStatement="Delete from MyJobsDocs where id =  '"+id+"' ;"




					html5sql.process(sqlStatement,
					function(transaction, results, rowsArray){


						buildJobDocsTable()

					},
					function(error, statement){

						opErrorMessage("Error: " + error.message + " when deleteAttachment "+statement );
					}
					);
				 }
			 }
      }
    );

}
function deleteDocument(id){
	var sqlStatement=""
	 sap.m.MessageBox.show("Delete Document", {
         icon: sap.m.MessageBox.Icon.WARNING ,
         title: "Are you sure?",
         actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
			 onClose: function(oAction){

				 if(oAction=="YES"){

					 sqlStatement="Delete from MyFormsResponses where id =  '"+id+"' ;"




					html5sql.process(sqlStatement,
					function(transaction, results, rowsArray){


						buildJobDocsTable()

					},
					function(error, statement){

						opErrorMessage("Error: " + error.message + " when deleteDocument "+statement );
					}
					);
				 }
			 }
       }
     );

}
function updateFormDescription(id, desc)
{

	var sqlstatement=""

	sqlStatement="UPDATE MyFormsResponses "+
				 "SET formdesc='"+desc+"'" +
				 "where id = '"+id+"' ;"




	html5sql.process(sqlStatement,
		 function(transaction, results, rowsArray){
		buildJobDocsTable()
		opMessage("Formdata Renamed")



		 },
		 function(error, statement){

			 opErrorMessage("Error: " + error.message + " whenupdateFormDescription "+statement );

		 }
		);

}
function InsertFormDetails(url, name,type,desc)
{
	var FormSQL=""
	html5sql.process(
			["SELECT * from MyForms where name = '"+name+"'"],
			function(transaction, results, rowsArray){
				if( rowsArray.length > 0) {
					FormSQL="UPDATE MyForms SET type = '"+type+"' , url = '"+url+"' , description = '"+desc+"'  WHERE name = '"+name+"';";
					console.log("Updating "+name)
					}else{
					console.log("Inserting "+name)
					FormSQL="INSERT INTO  MyForms (name, type, url, description) VALUES ("+"'"+name+"','"+type+"','"+url+"','"+desc+"');"
					}

				 html5sql.process(FormSQL,
				 function(){
					opMessage("Form inserted/updated OK ")

				 },
				 function(error, statement){
					 opErrorMessage("Error: " + error.message + " when MyForms processing " + statement);

				 }
				);
			},
			function(error, statement){
				opErrorMessage("Error: " + error.message + " when SetConfigParam processing " + statement);

			}
		);





}
// need to sort out not a delete if the form already exists


function createFormsResponse(formname, wc,plant,notifno,order,opno,user,content,htmlbody,htmlreadonly,mode,type)
{
var sqlStatement=""

if(formname.indexOf("~")>0){
	x=formname.split("~");
	formname=x[0]
}
var fdesc=""
	if (mode=="Close"){ //Called from the Close Screen
		state = "Close"
			fdesc=""
	}else{
		state="FORM"
		fdesc=formname
	}

	if(selectedFormId>0)
	{
		sqlStatement="UPDATE  MyFormsResponses set lastupdated='"+type+"',  "+
		"contents='"+escape(content) +"', "+
		"htmlbody='"+escape(htmlbody)+"', "+
		"htmlreadonly='"+escape(htmlreadonly)+"', "+
		"date='"+getDate()+"', "+
		"time='"+getTime()+"', "+

		"state='"+state+"', "+"status='Local' where id = "+selectedFormId+";"

	}else{
		sqlStatement="INSERT INTO  MyFormsResponses (formname, formdesc, lastupdated, wc,plant, notifno,orderno , opno, user, contents, htmlbody,htmlreadonly, date , time , state,status) VALUES ("+
		"'"+formname+"','"+fdesc+"','"+type+"','"+wc+"','"+plant+"','"+notifno+"','"+order+"','"+opno+"','"+user+"','"+escape(content)+"','"+escape(htmlbody)+"','"+escape(htmlreadonly)+"','"+getDate()+"',"+"'"+getTime()+"',"+"'"+state+"',"+"'Local');"

	}


		html5sql.process(sqlStatement,
				 function(transaction, results, rowsArray){

			  opMessage("Formdata inserted OK ")

				if(formDG5.isOpen()){
					getCFeedFollowOnState(CurrentOrderNo,CurrentOpNo)
				}
			  if (mode=="Forms"){ //Called from the Close Screen
					buildJobDocsTable()
				}

				formForms.close()
				 },
				 function(error, statement){

					 opErrorMessage("Error: " + error.message + " when createFormsResponse "+statement );
					formForms.close()
				 }
				);



}
function createAWSTConf(order,opno,empid,work_cntr,acttype,reasontype,startdate,starttime,enddate, endtime, actwork,remwork,text,details,finalconf)
{

	html5sql.process("INSERT INTO  MyTimeConfs (orderno , opno,reason,type, confno , description , longtext, date , time , enddate, endtime, act_work, rem_work, empid, work_cntr, final , datestamp, user, state) VALUES ("+
				 "'"+order+"','"+opno+"','"+reasontype+"','"+acttype+"','NEW','"+text+"','"+details+"','"+startdate+"','"+starttime+"','"+enddate+"','"+endtime+"','"+actwork+"','"+remwork+"','"+empid+"','"+CurrentJobWorkCentreOp+"','"+finalconf+"','"+getDate()+" "+getTime()+"','"+localStorage.getItem("MobileUser")+"','');",
		 function(){
			rebuildTimeConfs();
		 },
		 function(error, statement){

			 opErrorMessage("Error: " + error.message + " when createTConf processing " + statement);
		 }
		);
}
function createMPDocument(order,opno,floc,eq,mpoint,code,val,text)
{


	html5sql.process("INSERT INTO  MyMPointDocs (orderno , opno, funcloc, equipment , meas_point , date , time , code, value, shorttext, state) VALUES ("+
			 "'"+order+"','"+opno+"','"+floc+"','"+eq+"','"+mpoint+"','"+getDate()+"', '"+getTime()+"','"+code+"','"+val+"','"+text+"','');",
	 function(){

	 },
	 function(error, statement){

		 opErrorMessage("Error: " + error.message + " when createMPDoc processing " + statement);
	 }
	);
}
function updateMPDocument(order,opno,floc,eq,mpoint,code,val,text)
{


	html5sql.process("UPDATE MyMPointDocs set code = '"+code+"' , value = '"+ val+"', shorttext='"+text+"' where orderno = '"+order+"' and opno= '"+opno+"' and meas_point = '"+mpoint +"';",

	 function(){

	 },
	 function(error, statement){

		 opErrorMessage("Error: " + error.message + " when updateMPDoc processing " + statement);
	 }
	);
}
function createTConf(order,opno,empid,type,startdate,enddate,duration,finalconf,comments)
{

	var xempid=empid.split("|")
	var xstartdate=convertDateTimePicker(startdate).split("|")

	var xenddate=convertDateTimePicker(enddate).split("|")

	var xtctype="Travel"
	var xfinalconf=""

	if (type=="tconfWork"){
		xtctype="Work"
	}

	if (finalconf=="tconfFinalYes"){
		xfinalconf="X"
	}

	html5sql.process("INSERT INTO  MyTimeConfs (orderno , opno,type, confno , description , date , time , enddate, endtime, duration, empid, final , datestamp, user, state) VALUES ("+
			 "'"+order+"','"+opno+"','"+xtctype+"','NEW','"+comments+"','"+xstartdate[0]+"','"+xstartdate[1]+"','"+xenddate[0]+"','"+xenddate[1]+"','"+duration+"','"+xempid[2]+"','"+xfinalconf+"','"+getDate()+" "+getTime()+"','"+localStorage.getItem("MobileUser")+"','');",
	 function(){
		rebuildTimeConfs();
	 },
	 function(error, statement){

		 opErrorMessage("Error: " + error.message + " when createTConf processing " + statement);
	 }
	);
}

function createVehicleDefect(type,description,details,equipment)
{
var startdate=getSAPDate();
var starttime=getSAPTime();
var ReportedBy=localStorage.getItem("MobileUser");
	html5sql.process("INSERT INTO  MyNewJobs (state , type, date, time, shorttext, longtext, equipment, reportedby) VALUES ("+
					 "'VEHICLEDEFECT','"+type+"','"+startdate+"','"+starttime+"','"+description+"','"+details+"','"+equipment+"','"+ReportedBy+"');",
	 function(){
		 //alert("Created VDefect");
	 },
	 function(error, statement){
		 //alert("Error: " + error.message + " when createNotification processing " + statement);
		 opErrorMessage("Error: " + error.message + " when createVehicleDefect processing " + statement);
	 }
	);

}




//*************************************************************************************************************************
//
//  Create Database Tables
//
//*************************************************************************************************************************
function createTables(callback) {
	  var d = new Date();
    // d.setDate(d.getDate() + 1);
    //Assumping emptyTables is called during office hours, lastLogoff should happen out of hours. Once set last logoff should happen every 24 hours.
	  addHours(d, 12);

    // if not production set logging on
	  var logState = "OFF";
	  if (AzureServerName != 'https://myjobs.awis.mobi') {
	      logState = "ON";
	  }

		var sqlstatement='CREATE TABLE IF NOT EXISTS AssetTableColumns (id integer primary key autoincrement,ColumnNumber integer ,ColumnName TEXT,DisplayName TEXT, ColumnWidth TEXT);' +
		 'CREATE TABLE IF NOT EXISTS MyJobsParams      		(  id integer primary key autoincrement, name TEXT, key1 TEXT, key2 TEXT, value TEXT,recordupdated TIMESTAMP DATETIME DEFAULT(STRFTIME(\'%Y-%m-%d %H:%M:%f\', \'NOW\')));'+

		 'CREATE TABLE IF NOT EXISTS ParentAssetTableColumns (id integer primary key autoincrement,ColumnNumber integer ,ColumnName TEXT,DisplayName TEXT, ColumnWidth TEXT);' +
         'CREATE TABLE IF NOT EXISTS DecommissionStatus (id integer primary key autoincrement,ZSTAT TEXT ,ZSTATDESC TEXT);' +
	    'delete from AssetTableColumns ; ' +
	    'INSERT INTO AssetTableColumns ("ColumnNumber","ColumnName","DisplayName","ColumnWidth") VALUES (0,"plgrp","Plant Group","150px"); ' +
	    'INSERT INTO AssetTableColumns ("ColumnNumber","ColumnName","DisplayName","ColumnWidth") VALUES (1,"assdesc","Asset Type","150px"); ' +
	    'INSERT INTO AssetTableColumns ("ColumnNumber","ColumnName","DisplayName","ColumnWidth") VALUES (2,"tplnr","Functional Location","150px"); ' +
	    'INSERT INTO AssetTableColumns ("ColumnNumber","ColumnName","DisplayName","ColumnWidth") VALUES (3,"equnr","Equipment No","150px"); ' +
	    'INSERT INTO AssetTableColumns ("ColumnNumber","ColumnName","DisplayName","ColumnWidth") VALUES (4,"herst","Make","150px"); ' +
	    'INSERT INTO AssetTableColumns ("ColumnNumber","ColumnName","DisplayName","ColumnWidth") VALUES (5,"mapar","Model","150px"); ' +
        'INSERT INTO AssetTableColumns ("ColumnNumber","ColumnName","DisplayName","ColumnWidth") VALUES (6,"otdesc","Equipment Type Description","150px"); ' +
        'INSERT INTO AssetTableColumns ("ColumnNumber","ColumnName","DisplayName","ColumnWidth") VALUES (7,"pltxt","Functional Location Desc","150px"); ' +
        'INSERT INTO AssetTableColumns ("ColumnNumber","ColumnName","DisplayName","ColumnWidth") VALUES (8,"serge","Serial Number","150px"); ' +
        'INSERT INTO AssetTableColumns ("ColumnNumber","ColumnName","DisplayName","ColumnWidth") VALUES (9,"site","Site","150px"); ' +
        'INSERT INTO AssetTableColumns ("ColumnNumber","ColumnName","DisplayName","ColumnWidth") VALUES (10,"sysdesc","System Code Description","150px"); ' +
        'INSERT INTO AssetTableColumns ("ColumnNumber","ColumnName","DisplayName","ColumnWidth") VALUES (11,"eqktx","Equipment Desc","150px"); ' +
        'INSERT INTO AssetTableColumns ("ColumnNumber","ColumnName","DisplayName","ColumnWidth") VALUES (12,"ncdesc","Function Type Description","150px"); ' +
       'delete from ParentAssetTableColumns ; ' +
	    'INSERT INTO ParentAssetTableColumns ("ColumnNumber","ColumnName","DisplayName","ColumnWidth") VALUES (0,"plgrp","Plant Group","150px"); ' +
	    'INSERT INTO ParentAssetTableColumns ("ColumnNumber","ColumnName","DisplayName","ColumnWidth") VALUES (1,"assdesc","Asset Type","150px"); ' +
	    'INSERT INTO ParentAssetTableColumns ("ColumnNumber","ColumnName","DisplayName","ColumnWidth") VALUES (2,"tplnr","Functional Location","150px"); ' +
	    'INSERT INTO ParentAssetTableColumns ("ColumnNumber","ColumnName","DisplayName","ColumnWidth") VALUES (3,"equnr","Equipment No","150px"); ' +
	    'INSERT INTO ParentAssetTableColumns ("ColumnNumber","ColumnName","DisplayName","ColumnWidth") VALUES (4,"herst","Make","150px"); ' +
	    'INSERT INTO ParentAssetTableColumns ("ColumnNumber","ColumnName","DisplayName","ColumnWidth") VALUES (5,"mapar","Model","150px"); ' +
        'INSERT INTO ParentAssetTableColumns ("ColumnNumber","ColumnName","DisplayName","ColumnWidth") VALUES (6,"otdesc","Equipment Type Description","150px"); ' +
        'INSERT INTO ParentAssetTableColumns ("ColumnNumber","ColumnName","DisplayName","ColumnWidth") VALUES (7,"pltxt","Functional Location Desc","150px"); ' +
        'INSERT INTO ParentAssetTableColumns ("ColumnNumber","ColumnName","DisplayName","ColumnWidth") VALUES (8,"serge","Serial Number","150px"); ' +
        'INSERT INTO ParentAssetTableColumns ("ColumnNumber","ColumnName","DisplayName","ColumnWidth") VALUES (9,"site","Site","150px"); ' +
        'INSERT INTO ParentAssetTableColumns ("ColumnNumber","ColumnName","DisplayName","ColumnWidth") VALUES (10,"sysdesc","System Code Description","150px"); ' +
        'INSERT INTO ParentAssetTableColumns ("ColumnNumber","ColumnName","DisplayName","ColumnWidth") VALUES (11,"eqktx","Equipment Desc","150px"); ' +
        'INSERT INTO ParentAssetTableColumns ("ColumnNumber","ColumnName","DisplayName","ColumnWidth") VALUES (12,"ncdesc","Function Type Description","150px"); ' +

      'CREATE TABLE IF NOT EXISTS AssetSites     		( id integer primary key autoincrement,site TEXT,desc TEXT,bunit TEXT,recordupdated TIMESTAMP DATETIME DEFAULT(STRFTIME(\'%Y-%m-%d %H:%M:%f\', \'NOW\')));' +
       'CREATE TABLE IF NOT EXISTS AssetSitesDetails     	( id integer primary key autoincrement,assdesc TEXT, assettag TEXT, asstype TEXT, eqart TEXT, eqktx TEXT, equnr TEXT, herst TEXT, iwerk TEXT, mapar TEXT, ncdesc TEXT, otdesc TEXT, plgrp TEXT, pltxt TEXT, serge TEXT, site TEXT, status TEXT, swerk TEXT, syscode TEXT, sysdesc TEXT, tplnr TEXT, zfl_nc TEXT, zinbdt  TEXT,zlastmodify TEXT,desc TEXT,bunit TEXT,recordupdated TIMESTAMP DATETIME DEFAULT(STRFTIME(\'%Y-%m-%d %H:%M:%f\', \'NOW\')));' +
        'CREATE TABLE IF NOT EXISTS MyRefUsers    (  id integer primary key autoincrement, userid TEXT, scenario TEXT, plant TEXT, maintplant TEXT, workcenter TEXT, plannergroup TEXT, plannergroupplant TEXT, storagegroup TEXT, storageplant TEXT, partner TEXT, partnerrole TEXT, funclocint TEXT, funcloc TEXT, compcode TEXT, employeeno TEXT, equipment TEXT, firstname TEXT, lastname TEXT, telno TEXT,maint1 TEXT,maint2 TEXT,maint3 TEXT,maint4 TEXT,maint5 TEXT,maint6 TEXT,maint7 TEXT,maint8 TEXT,recordupdated TIMESTAMP DATETIME DEFAULT(STRFTIME(\'%Y-%m-%d %H:%M:%f\', \'NOW\')));'+

         'CREATE TABLE IF NOT EXISTS Manufacturer     	( id integer primary key autoincrement,manufacturer TEXT,recordupdated TIMESTAMP DATETIME DEFAULT(STRFTIME(\'%Y-%m-%d %H:%M:%f\', \'NOW\')));' +
                 'CREATE TABLE IF NOT EXISTS Model     	( id integer primary key autoincrement,EQART TEXT, HERST TEXT, MODEL TEXT,recordupdated TIMESTAMP DATETIME DEFAULT(STRFTIME(\'%Y-%m-%d %H:%M:%f\', \'NOW\')));' +
                 'CREATE TABLE IF NOT EXISTS EGIandNameCodeMapping     	( id integer primary key autoincrement,ZASCAT TEXT, ZDEFPG TEXT, ZZEQPT_EGI TEXT,ZZFL_NC TEXT,ZZW_WW TEXT ,recordupdated TIMESTAMP DATETIME DEFAULT(STRFTIME(\'%Y-%m-%d %H:%M:%f\', \'NOW\')));' +
  'CREATE TABLE IF NOT EXISTS EquipmentTypeCode     	( id integer primary key autoincrement,EARTX  TEXT,ZATCODE  TEXT,ZOTDEF  TEXT,ZOTDEF_EXT  TEXT,ZOTDESC  TEXT,ZZEQPT_EGI TEXT ,recordupdated TIMESTAMP DATETIME DEFAULT(STRFTIME(\'%Y-%m-%d %H:%M:%f\', \'NOW\')));' +
   'CREATE TABLE IF NOT EXISTS AssetTypeCodes     	( id integer primary key autoincrement,ZATCODE  TEXT,ZATDEF1 TEXT,ZATDEF2  TEXT,ZATDESC  TEXT,recordupdated TIMESTAMP DATETIME DEFAULT(STRFTIME(\'%Y-%m-%d %H:%M:%f\', \'NOW\')));' +
    'CREATE TABLE IF NOT EXISTS FunctionTypeCodes     	( id integer primary key autoincrement,EARTX TEXT,ZATCODE TEXT,ZNCDEF  TEXT,ZNCDEF_EXT TEXT,ZNCDESC TEXT, ZZFL_NC TEXT  ,recordupdated TIMESTAMP DATETIME DEFAULT(STRFTIME(\'%Y-%m-%d %H:%M:%f\', \'NOW\')));' +
    'CREATE TABLE IF NOT EXISTS PlantGroupCodes     	( id integer primary key autoincrement,ZPLGDEF1 TEXT ,ZPLGDEF2 TEXT,ZPLGDESC TEXT,ZPLGRP TEXT,ZZW_WW  TEXT,recordupdated TIMESTAMP DATETIME DEFAULT(STRFTIME(\'%Y-%m-%d %H:%M:%f\', \'NOW\')));' +
     'CREATE TABLE IF NOT EXISTS SystemCodes     	( id integer primary key autoincrement,ZSYSCODE TEXT,ZSYSDEF1 TEXT,ZSYSDEF2 TEXT,ZZSYSDESC  TEXT,recordupdated TIMESTAMP DATETIME DEFAULT(STRFTIME(\'%Y-%m-%d %H:%M:%f\', \'NOW\')));' +
      'CREATE TABLE IF NOT EXISTS PlantGroupAndProcessGroupCodes     	( id integer primary key autoincrement,ZPLGRP TEXT,ZPRG TEXT,ZZW_WW  TEXT,recordupdated TIMESTAMP DATETIME DEFAULT(STRFTIME(\'%Y-%m-%d %H:%M:%f\', \'NOW\')));' +
       'CREATE TABLE IF NOT EXISTS AssetCaptureCategory     	( id integer primary key autoincrement,ZASCAT  TEXT,ZATCODE  TEXT,ZSYSCODE TEXT,recordupdated TIMESTAMP DATETIME DEFAULT(STRFTIME(\'%Y-%m-%d %H:%M:%f\', \'NOW\')));' +
       'CREATE TABLE IF NOT EXISTS AssetTableColumns (id integer primary key autoincrement,ColumnNumber integer ,ColumnName TEXT,DisplayName TEXT, ColumnWidth TEXT);' +
        'CREATE TABLE IF NOT EXISTS AssetUpload     		( PKID integer primary key autoincrement,' +
        'EQKTU TEXT,EQUNR TEXT,ERFZEIT TEXT ,ERNAM TEXT,ESTAT TEXT ,HURST TEXT ,INBDT TEXT ,MAPAR TEXT,ORIGZINSTLOCN TEXT ,SERGE TEXT ,STATUS TEXT ,STATUS_PROFILE TEXT ,STATUS_TXT TEXT ,SYNCED TEXT int NULL,TERMAB TEXT,Z_GPSNMEA TEXT ,' +
        'ZASCAT TEXT,ZASSDESC TEXT,ZASSTYPE TEXT ,ZBUSN TEXT,ZCAPDEL_SURVEY TEXT,ZCHECK_OUT TEXT,ZCHECKOUT_DATE TEXT ,ZCHECKOUT_TO TEXT,ZCOMFLG TEXT,ZCOMMENTS1 TEXT ,ZCOMMENTS2 TEXT ,ZDECOM TEXT,ZDECOMR TEXT,ZDELETED TEXT,ZDOCFLG TEXT,' +
        'ZDOCPATH TEXT ,ZEQDECOM TEXT,ZINSLOCDESC TEXT,ZINSLOCDESC1 TEXT ,ZINSLOCDESC2 TEXT ,ZINSLOCDESC3 TEXT ,ZINSTLOCN TEXT ,ZIWERK TEXT ,ZNCDESC TEXT ,ZOTDESC TEXT,ZOWNER TEXT,ZPARECNUM TEXT,ZPARLOCN TEXT,ZPEQUNR TEXT ,' +
        'ZPLGDESC TEXT,ZPLGRP TEXT ,ZPRG TEXT ,ZPRGDESC TEXT,ZPROCTYP TEXT ,ZPROJ_CODE TEXT ,ZRECNUM TEXT,ZSERN1 TEXT ,ZSITE TEXT ,ZSITEDESC TEXT,ZSITESGNOFF TEXT,ZSTATUS TEXT ,ZSURV TEXT,ZSURVSUB TEXT,ZSWERK TEXT ,ZSYSCODE TEXT ,' +
        'ZSYSDESC TEXT,ZZASSETTAG TEXT,ZZEQPT_EGI TEXT ,ZZFL_NC TEXT ,ZZW_WW TEXT );' +



        'CREATE TABLE IF NOT EXISTS MyJobDets         ( id integer primary key autoincrement,'+
        " orderid TEXT,ordnoOp TEXT,watercare TEXT, textMess TEXT,reduration TEXT, startTime TEXT,startDate TEXT,pmacttypeText TEXT, pmacttype TEXT, "+
        " workTypeCdx TEXT,workTypeCd TEXT,workTypeCgpx TEXT,workTypeCgp TEXT,ordType TEXT,shortText TEXT,priorityx TEXT,priority TEXT, "+
        " statusCrtim TEXT,statusCrdat TEXT,statusDescL TEXT,statusDescS  TEXT,status TEXT,plant TEXT,myalmScenario TEXT,workCntrOper TEXT, "+
        " workCntrUser TEXT,empName TEXT,empNo TEXT,user TEXT,custAppt TEXT,jobPartRef TEXT,locHistRef TEXT,address TEXT, "+
        " custFeed TEXT,equipment TEXT,equipmentDesc TEXT,funcLoc TEXT,funcLocDesc TEXT,flcLonLat TEXT,siteShcode TEXT,acptDate TEXT,acptTime TEXT, "+
        " onsiteDate TEXT,onsiteTime TEXT,tconf_date TEXT, tconf_time TEXT,assocOpRef TEXT,opActtype TEXT,opActtypex TEXT,name1 TEXT,telNumber TEXT,eqpLonLat TEXT,notificationNo TEXT, "+
        " notifCatProf TEXT,enddateLconf TEXT,endtimeLconf TEXT,custNo TEXT,parkDate TEXT,parkTime TEXT,custCmmt TEXT,form1 TEXT,form2 TEXT,mandForm TEXT, "+
        " documents TEXT,tma TEXT,contractAssist TEXT,specialEq TEXT,materials TEXT,measurements TEXT,callAppt TEXT,acNo TEXT,acStatus TEXT,retention TEXT, "+
        " ntTelNo TEXT,skillType TEXT,assettag TEXT,ordWorkCntr TEXT,ordPlant TEXT,userMobile TEXT,notifCrdat TEXT,notifCrtim TEXT,ohdrShortText TEXT, "+
        " zzretc TEXT,zzretn TEXT,zzrettn TEXT,zzemai TEXT,zzgisx TEXT,zzgisy TEXT,zzmogisx TEXT,zzmogisy TEXT, "+
            " recordupdated TIMESTAMP DATETIME DEFAULT(STRFTIME(\'%Y-%m-%d %H:%M:%f\', \'NOW\'))); "+
        'CREATE TABLE IF NOT EXISTS MyJobDetsMPcodes       ( id integer primary key autoincrement, code_gp TEXT, code TEXT, code_text TEXT,recordupdated TIMESTAMP DATETIME DEFAULT(STRFTIME(\'%Y-%m-%d %H:%M:%f\', \'NOW\')));'+
        'CREATE TABLE IF NOT EXISTS MyJobDetsMPoints       ( id integer primary key autoincrement, meas_point TEXT, object_id TEXT,object_desc TEXT, psort TEXT,pttxt TEXT, format TEXT,no_char TEXT, no_deci TEXT,code_gp TEXT, code TEXT, unit_meas TEXT,read_from TEXT,recordupdated TIMESTAMP DATETIME DEFAULT(STRFTIME(\'%Y-%m-%d %H:%M:%f\', \'NOW\')));'+
        'CREATE TABLE IF NOT EXISTS MyJobDetsLoch          ( id integer primary key autoincrement, orderno TEXT, notification_no TEXT,not_type TEXT, not_date TEXT,not_time TEXT, not_shtxt TEXT,not_order TEXT, meter_no TEXT,meter_rdg TEXT, work_type TEXT, order_type TEXT, op_txt TEXT, order_date TEXT, order_status TEXT, recordupdated TIMESTAMP DATETIME DEFAULT(STRFTIME(\'%Y-%m-%d %H:%M:%f\', \'NOW\')));'+
        'CREATE TABLE IF NOT EXISTS MyJobDetsDraw          ( id integer primary key autoincrement, orderno TEXT, zact TEXT,zite TEXT, zmandatoryfield TEXT,zurl TEXT, nodeid TEXT,fname TEXT, mime TEXT,recordupdated TIMESTAMP DATETIME DEFAULT(STRFTIME(\'%Y-%m-%d %H:%M:%f\', \'NOW\')));'+
        'CREATE TABLE IF NOT EXISTS MyJobsDetsEQ ( id integer primary key autoincrement, equnr TEXT, obj_type TEXT, obj_type_desc TEXT, start_date TEXT,manfacture TEXT,manparno TEXT,manserno TEXT,user_status_code TEXT,swerk TEXT ,swerk_desc TEXT,profile TEXT ,device TEXT ,device_info TEXT ,install_date TEXT , install_loc_desc TEXT,recordupdated TIMESTAMP DATETIME DEFAULT(STRFTIME(\'%Y-%m-%d %H:%M:%f\', \'NOW\')));'+
        'CREATE TABLE IF NOT EXISTS MyJobsDetsATTR ( id integer primary key autoincrement, equnr TEXT ,classnum TEXT ,klassentext TEXT ,charact TEXT ,charact_desc TEXT,value TEXT,recordupdated TIMESTAMP DATETIME DEFAULT(STRFTIME(\'%Y-%m-%d %H:%M:%f\', \'NOW\')));'+
        'CREATE TABLE IF NOT EXISTS MyJobDetsMeasCodes ( id integer primary key autoincrement, code_gp TEXT ,code TEXT ,code_text TEXT ,recordupdated TIMESTAMP DATETIME DEFAULT(STRFTIME(\'%Y-%m-%d %H:%M:%f\', \'NOW\')));'+
        'CREATE TABLE IF NOT EXISTS MyJobDetsComps ( id integer primary key autoincrement, orderno TEXT ,opno TEXT ,material TEXT ,description TEXT ,ent_qty TEXT ,com_qty TEXT ,with_qty TEXT ,upm TEXT ,plant TEXT , stloc TEXT , batch_no TEXT ,req_date TEXT , res_item TEXT ,recordupdated TIMESTAMP DATETIME DEFAULT(STRFTIME(\'%Y-%m-%d %H:%M:%f\', \'NOW\')));'+
        'CREATE TABLE IF NOT EXISTS MyJobDetsOrderLongText ( id integer primary key autoincrement, objtype TEXT ,objkey TEXT ,orderno TEXT ,line_number TEXT, format_col TEXT, text_line TEXT,recordupdated TIMESTAMP DATETIME DEFAULT(STRFTIME(\'%Y-%m-%d %H:%M:%f\', \'NOW\')));'+
        'CREATE TABLE IF NOT EXISTS MyJobDetsAddress   (  id integer primary key autoincrement, orderno TEXT, opno TEXT, address01 TEXT, address02 TEXT, address03 TEXT, address04 TEXT, address05 TEXT, address06 TEXT, address07 TEXT, address08 TEXT,address09 TEXT, address10 TEXT,address11 TEXT,address12 TEXT,caption01 TEXT, caption02 TEXT, caption03 TEXT, caption04 TEXT, caption05 TEXT, caption06 TEXT, caption07 TEXT, caption08 TEXT, caption09 TEXT,caption10 TEXT,caption11 TEXT,caption12 TEXT,recordupdated TIMESTAMP DATETIME DEFAULT(STRFTIME(\'%Y-%m-%d %H:%M:%f\', \'NOW\')));'+
        'CREATE TABLE IF NOT EXISTS MyJobDetsNotifLongText (  id integer primary key autoincrement, objtype TEXT, objkey TEXT, orderno TEXT, line_number TEXT, format_col TEXT, text_line TEXT,recordupdated TIMESTAMP DATETIME DEFAULT(STRFTIME(\'%Y-%m-%d %H:%M:%f\', \'NOW\')));'+
        'CREATE TABLE IF NOT EXISTS MyJobDetsOrderOps (  id integer primary key autoincrement, orderno TEXT, operation TEXT, comp_date_time TEXT, description TEXT, status TEXT, name TEXT,recordupdated TIMESTAMP DATETIME DEFAULT(STRFTIME(\'%Y-%m-%d %H:%M:%f\', \'NOW\')));'+
        'CREATE TABLE IF NOT EXISTS MyJobDetsIconPriority (  id integer primary key autoincrement, orderno TEXT, opno TEXT, icon_filename TEXT, tooltip TEXT, tooltip_desc TEXT, command TEXT,recordupdated TIMESTAMP DATETIME DEFAULT(STRFTIME(\'%Y-%m-%d %H:%M:%f\', \'NOW\')));'+
        'CREATE TABLE IF NOT EXISTS MyJobDetsIconJob (  id integer primary key autoincrement, orderno TEXT, opno TEXT, icon_type TEXT, icon_position TEXT, icon_filename TEXT, icon_txt TEXT, tooltip TEXT, tooltip_desc TEXT, command TEXT,grid TEXT, grid_vals TEXT,recordupdated TIMESTAMP DATETIME DEFAULT(STRFTIME(\'%Y-%m-%d %H:%M:%f\', \'NOW\')));'+
			'CREATE TABLE IF NOT EXISTS MyOrders     			( sysid integer primary key autoincrement,orderno TEXT, changedby TEXT, changeddatetime TEXT, shorttext TEXT, longtext TEXT, startdate TEXT, enddate TEXT, contact TEXT,   telno TEXT,    type TEXT, priority TEXT, address TEXT, workaddress TEXT, house TEXT, houseno TEXT, street TEXT, district TEXT, city TEXT, postcode TEXT,gis TEXT, property TEXT, funcloc TEXT, equipment TEXT, propertygis TEXT, funclocgis TEXT, equipmentgis TEXT, notifno TEXT,recordupdated TIMESTAMP DATETIME DEFAULT(STRFTIME(\'%Y-%m-%d %H:%M:%f\', \'NOW\')));'+
					 'CREATE TABLE IF NOT EXISTS MyNotifications     	( id integer primary key autoincrement, notifno TEXT, changedby TEXT, changeddatetime TEXT, shorttext TEXT, longtext TEXT, cattype TEXT,  pgroup TEXT, pcode TEXT, grouptext TEXT, codetext TEXT, startdate TEXT, starttime TEXT, enddate TEXT, endtime TEXT, type TEXT, priority TEXT, funcloc TEXT,   equipment TEXT, assignment TEXT, SpecialReq TEXT, orderno TEXT, reportedon TEXT,   reportedby TEXT, plant TEXT, funclocgis TEXT,   equipmentgis TEXT, assigntome TEXT,state TEXT, equipmentstatus TEXT , recordupdated TIMESTAMP DATETIME DEFAULT(STRFTIME(\'%Y-%m-%d %H:%M:%f\', \'NOW\')));' +
					 'CREATE TABLE IF NOT EXISTS MyStatus     			( id integer primary key autoincrement, orderno TEXT, opno TEXT, stsma TEXT, status TEXT, statusdesc, state TEXT, actdate TEXT, acttime TEXT,recordupdated TIMESTAMP DATETIME DEFAULT(STRFTIME(\'%Y-%m-%d %H:%M:%f\', \'NOW\')));'+
					 'CREATE TABLE IF NOT EXISTS MyTimeConfs     		( id integer primary key autoincrement, orderno TEXT, opno TEXT, confno TEXT, type TEXT, description TEXT, date TEXT, time TEXT, enddate TEXT, endtime TEXT,act_work TEXT, rem_work TEXT, act_type TEXT, work_cntr TEXT, reason TEXT, longtext TEXT, duration TEXT, datestamp TEXT,  user TEXT,  empid TEXT, final TEXT, state TEXT,recordupdated TIMESTAMP DATETIME DEFAULT(STRFTIME(\'%Y-%m-%d %H:%M:%f\', \'NOW\')));'+
					 'CREATE TABLE IF NOT EXISTS MyMPointDocs     		( id integer primary key autoincrement, orderno TEXT, opno TEXT, funcloc TEXT, equipment TEXT, meas_point TEXT, date TEXT, time TEXT, shorttext TEXT, value TEXT, code TEXT, state TEXT,recordupdated TIMESTAMP DATETIME DEFAULT(STRFTIME(\'%Y-%m-%d %H:%M:%f\', \'NOW\')));'+
//added equipmentstatus field in Myjobclose table and Mynotofications table
					 'CREATE TABLE IF NOT EXISTS MyEquipmentUpdates     	( id integer primary key autoincrement, type TEXT,equipment TEXT,equipmentstatus TEXT,state TEXT,shorttext TEXT,recordupdated TIMESTAMP DATETIME DEFAULT(STRFTIME(\'%Y-%m-%d %H:%M:%f\', \'NOW\')));' +
					 'CREATE TABLE IF NOT EXISTS MyJobClose             ( id integer primary key autoincrement, orderno TEXT , opno TEXT, notifno TEXT, details TEXT, empid TEXT, work_cntr TEXT, state TEXT , closedate TEXT, closetime TEXT, funcloc  TEXT, equipment TEXT, inshift  TEXT, outofshift  TEXT, pgrp TEXT, pcode TEXT, agrp TEXT, acode TEXT, igrp TEXT, icode TEXT, followon  TEXT, variance TEXT, reason TEXT, equipmentstatus TEXT ,recordupdated TIMESTAMP DATETIME DEFAULT(STRFTIME(\'%Y-%m-%d %H:%M:%f\', \'NOW\')));'+
					 'CREATE TABLE IF NOT EXISTS MyJobAddWork           ( id integer primary key autoincrement, orderno TEXT , opno TEXT, specreqt TEXT, startdate TEXT, assignment TEXT, wktycd TEXT, wktygp TEXT,longtext TEXT, state TEXT,recordupdated TIMESTAMP DATETIME DEFAULT(STRFTIME(\'%Y-%m-%d %H:%M:%f\', \'NOW\')));'+
					 'CREATE TABLE IF NOT EXISTS MyNewJobs     			( id integer primary key autoincrement, type TEXT, defect TEXT, mpoint TEXT, mpval TEXT, shorttext TEXT, longtext TEXT, description TEXT, date TEXT, time TEXT, enddate TEXT, endtime TEXT, funcloc TEXT, equipment TEXT, cattype TEXT, codegroup TEXT, coding TEXT, activitycodegroup TEXT, activitycode TEXT, activitytext TEXT, prioritytype TEXT, priority TEXT, reportedby TEXT, state TEXT, assignment TEXT, spec_reqt TEXT, assig_tome TEXT, userid TEXT, eq_status TEXT, breakdown TEXT,recordupdated TIMESTAMP DATETIME DEFAULT(STRFTIME(\'%Y-%m-%d %H:%M:%f\', \'NOW\')));'+
					 'CREATE TABLE IF NOT EXISTS MyWorkConfig     		( id integer primary key autoincrement, paramname TEXT, paramvalue TEXT,recordupdated TIMESTAMP DATETIME DEFAULT(STRFTIME(\'%Y-%m-%d %H:%M:%f\', \'NOW\')));'+
					 'CREATE TABLE IF NOT EXISTS MyUserDets             ( id integer primary key autoincrement, mobileuser TEXT, workcenter TEXT, scenario TEXT, fullname TEXT, vehiclereg TEXT, employeeid TEXT, user TEXT, password TEXT,pincode TEXT,docserver TEXT, maptype TEXT,recordupdated TIMESTAMP DATETIME DEFAULT(STRFTIME(\'%Y-%m-%d %H:%M:%f\', \'NOW\')));'+
					 'CREATE TABLE IF NOT EXISTS MyRefUsers    			(  id integer primary key autoincrement, userid TEXT, scenario TEXT, plant TEXT, maintplant TEXT, workcenter TEXT, plannergroup TEXT, plannergroupplant TEXT, storagegroup TEXT, storageplant TEXT, partner TEXT, partnerrole TEXT, funclocint TEXT, funcloc TEXT, compcode TEXT, employeeno TEXT, equipment TEXT, firstname TEXT, lastname TEXT, telno TEXT,recordupdated TIMESTAMP DATETIME DEFAULT(STRFTIME(\'%Y-%m-%d %H:%M:%f\', \'NOW\')));'+
					 'CREATE TABLE IF NOT EXISTS MyRefPriorityTypes     (  id integer primary key autoincrement, scenario TEXT, type TEXT, priority TEXT, description TEXT,recordupdated TIMESTAMP DATETIME DEFAULT(STRFTIME(\'%Y-%m-%d %H:%M:%f\', \'NOW\')));'+
					 'CREATE TABLE IF NOT EXISTS MyVehiclesDefault     	(  sysid integer primary key autoincrement, equipment TEXT, reg TEXT, id TEXT, partner TEXT, level TEXT, sequence TEXT,mpoint TEXT,mpointdesc TEXT, mpointlongtext TEXT,description TEXT,recordupdated TIMESTAMP DATETIME DEFAULT(STRFTIME(\'%Y-%m-%d %H:%M:%f\', \'NOW\')));'+
					 'CREATE TABLE IF NOT EXISTS MyVehicles     		(  sysid integer primary key autoincrement, reg TEXT, id TEXT, partner TEXT, mpoints TEXT,description TEXT,recordupdated TIMESTAMP DATETIME DEFAULT(STRFTIME(\'%Y-%m-%d %H:%M:%f\', \'NOW\')));'+
					 'CREATE TABLE IF NOT EXISTS MyForms        		(  id integer primary key autoincrement, name TEXT, type TEXT, lastupdated TEXT, url TEXT,description TEXT,recordupdated TIMESTAMP DATETIME DEFAULT(STRFTIME(\'%Y-%m-%d %H:%M:%f\', \'NOW\')));'+
					 'CREATE TABLE IF NOT EXISTS MyFormsResponses  		(  id integer primary key autoincrement, formdesc TEXT, user TEXT, formname TEXT, lastupdated TEXT, wc TEXT, plant TEXT, notifno TEXT, orderno TEXT, opno TEXT, date TEXT, time TEXT, contents TEXT, htmlbody TEXT, htmlreadonly TEXT, state TEXT, status TEXT,recordupdated TIMESTAMP DATETIME DEFAULT(STRFTIME(\'%Y-%m-%d %H:%M:%f\', \'NOW\')));'+

					 'CREATE TABLE IF NOT EXISTS MyVehicleCheck     	(  id integer primary key autoincrement, equipment TEXT, reg TEXT,  mileage TEXT,  mpoint TEXT,  desc TEXT,  longtext TEXT,  mdate TEXT, mtime TEXT, mreadby TEXT, user TEXT,  state TEXT,recordupdated TIMESTAMP DATETIME DEFAULT(STRFTIME(\'%Y-%m-%d %H:%M:%f\', \'NOW\')));'+
					 'CREATE TABLE IF NOT EXISTS Assets     			(  sysid integer primary key autoincrement,type TEXT, id TEXT, eqart TEXT, eqtyp TEXT, shorttext TEXT,  address TEXT, workcenter TEXT,recordupdated TIMESTAMP DATETIME DEFAULT(STRFTIME(\'%Y-%m-%d %H:%M:%f\', \'NOW\')));'+
					 'CREATE TABLE IF NOT EXISTS LogFile    			( id integer primary key autoincrement, datestamp TEXT, type TEXT, message TEXT,recordupdated TIMESTAMP DATETIME DEFAULT(STRFTIME(\'%Y-%m-%d %H:%M:%f\', \'NOW\')));'+
					 'CREATE TABLE IF NOT EXISTS AssetDetails     		( id integer primary key autoincrement,PLAN_PLANT TEXT, MTCE_PLANT TEXT, SITE TEXT, FUNC_LOC TEXT, FUNC_LOC_DESC TEXT, EQUIP TEXT, EQUIP_DESC TEXT, PLANT_GROUP TEXT, ASSET_TYPE TEXT, ASSET_DESC TEXT, MAKE TEXT, MODEL TEXT, SERIAL_NO TEXT, OBJ_TYPE TEXT, EQTYPE_DESC TEXT, EFUNC_TYPE TEXT, FTYPE_DESC TEXT, SYS_CODE TEXT, SCODE_DESC TEXT, ASSET_TAG TEXT, START_UP_DATE TEXT, STATUS TEXT,recordupdated TIMESTAMP DATETIME DEFAULT(STRFTIME(\'%Y-%m-%d %H:%M:%f\', \'NOW\')));'+
					 'CREATE TABLE IF NOT EXISTS FuncLocs			  	( id integer primary key autoincrement, flid TEXT, description TEXT, swerk TEXT, level TEXT, parentid TEXT, children TEXT,recordupdated TIMESTAMP DATETIME DEFAULT(STRFTIME(\'%Y-%m-%d %H:%M:%f\', \'NOW\')));'+
					 'CREATE TABLE IF NOT EXISTS MyMenuBar 		        ( id integer primary key autoincrement, scenario TEXT, level TEXT, item TEXT, position TEXT, type TEXT,  subitem TEXT, command TEXT, item2 TEXT,recordupdated TIMESTAMP DATETIME DEFAULT(STRFTIME(\'%Y-%m-%d %H:%M:%f\', \'NOW\')));'+
					 'CREATE TABLE IF NOT EXISTS REFPAICODES			( id integer primary key autoincrement, scenario TEXT, userid TEXT, level TEXT, stsma TEXT, plant TEXT, work_cntr TEXT, catalogue TEXT, codegrp TEXT, kurztext_group TEXT, code TEXT, kurztext_code TEXT,recordupdated TIMESTAMP DATETIME DEFAULT(STRFTIME(\'%Y-%m-%d %H:%M:%f\', \'NOW\')));'+
					 'CREATE TABLE IF NOT EXISTS REFNOTIFICATIONTYPES	( id integer primary key autoincrement, scenario TEXT, userid TEXT, level_number TEXT, notiftype TEXT, notifdesc TEXT, notifprofile TEXT, priotype TEXT,priority TEXT, prioritydesc TEXT,recordupdated TIMESTAMP DATETIME DEFAULT(STRFTIME(\'%Y-%m-%d %H:%M:%f\', \'NOW\')));'+
					 'CREATE TABLE IF NOT EXISTS REFVARIANCESRFV		( id integer primary key autoincrement, scenario TEXT, userid TEXT, plant TEXT, work_cntr TEXT, job_activity TEXT, dev_reason TEXT, dev_reas_txt TEXT, mandate TEXT,recordupdated TIMESTAMP DATETIME DEFAULT(STRFTIME(\'%Y-%m-%d %H:%M:%f\', \'NOW\')));'+
					 'CREATE TABLE IF NOT EXISTS REFACTIVITY			( id integer primary key autoincrement, scenario TEXT, work_center TEXT, activity TEXT, activity_desc TEXT, action TEXT, deflt TEXT,recordupdated TIMESTAMP DATETIME DEFAULT(STRFTIME(\'%Y-%m-%d %H:%M:%f\', \'NOW\')));'+
					 'CREATE TABLE IF NOT EXISTS DG5REL					( id integer primary key autoincrement, catalogue TEXT, codegrp TEXT, code TEXT, codedesc TEXT, dg5rel TEXT, piarel TEXT,recordupdated TIMESTAMP DATETIME DEFAULT(STRFTIME(\'%Y-%m-%d %H:%M:%f\', \'NOW\')));'+
					 'CREATE TABLE IF NOT EXISTS DG5CODES			    ( id integer primary key autoincrement, type TEXT, level TEXT, coderef TEXT, description TEXT, code TEXT, codedesc TEXT,parenttype TEXT, parentcode TEXT,recordupdated TIMESTAMP DATETIME DEFAULT(STRFTIME(\'%Y-%m-%d %H:%M:%f\', \'NOW\')));'+
					 'CREATE TABLE IF NOT EXISTS CFCODES			    ( id integer primary key autoincrement, level TEXT, catalog_type TEXT, code_cat_group TEXT, codegroup TEXT, codegroup_text TEXT, long_text TEXT,code TEXT, codedesc TEXT,recordupdated TIMESTAMP DATETIME DEFAULT(STRFTIME(\'%Y-%m-%d %H:%M:%f\', \'NOW\')));'+
					 'CREATE TABLE IF NOT EXISTS MyJobsDocs			    ( id integer primary key autoincrement, orderno TEXT, opno TEXT, url TEXT, name TEXT, type TEXT, size TEXT, lastmod TEXT, status TEXT,recordupdated TIMESTAMP DATETIME DEFAULT(STRFTIME(\'%Y-%m-%d %H:%M:%f\', \'NOW\')));'+
					 'CREATE TABLE IF NOT EXISTS MyJobsPhotos			( id integer primary key autoincrement, orderno TEXT, opno TEXT, url TEXT, name TEXT, desc TEXT, size TEXT, date TEXT, status TEXT,recordupdated TIMESTAMP DATETIME DEFAULT(STRFTIME(\'%Y-%m-%d %H:%M:%f\', \'NOW\')));'+
                     //XSource MyObjectList
                    'CREATE TABLE IF NOT EXISTS MyObjectList			( id integer primary key autoincrement, funcldescr TEXT, equidescr TEXT , processingInd TEXT, sortfield TEXT, equipment TEXT, funclocDisp TEXT, functLoc TEXT, counter TEXT, orderid TEXT, user TEXT, recordupdated TIMESTAMP DATETIME DEFAULT(STRFTIME(\'%Y-%m-%d %H:%M:%f\', \'NOW\')));' +
					 'CREATE TABLE IF NOT EXISTS MyObjectListData		( id integer primary key autoincrement, sapcode TEXT,  counter TEXT, orderid TEXT,checked bool,feedbackdesc TEXT, state TEXT, recordupdated TIMESTAMP DATETIME DEFAULT(STRFTIME(\'%Y-%m-%d %H:%M:%f\', \'NOW\')));' +
					 'CREATE TABLE IF NOT EXISTS AssetDetailsAll		( id integer primary key autoincrement, floc TEXT ,planplant TEXT ,maintplant TEXT ,site TEXT ,flocdesc TEXT,eq TEXT,eqdesc TEXT,plgrpdesc TEXT,asstype TEXT,assdesc TEXT,manufacturer TEXT,partno TEXT,serialno TEXT,eqtype TEXT,eqtypedesc TEXT,recordupdated TIMESTAMP DATETIME DEFAULT(STRFTIME(\'%Y-%m-%d %H:%M:%f\', \'NOW\')));'+
					 "INSERT INTO MyWorkConfig (paramname , paramvalue ) VALUES ('TRACE', '" + logState + "');"+
					 "INSERT INTO MyWorkConfig (paramname , paramvalue ) VALUES ('SYNC_REFERENCE_FREQUENCY','86400000');" +
					 "INSERT INTO MyWorkConfig (paramname , paramvalue ) VALUES ('SYNC_TRANSACTIONAL_FREQUENCY','600000');"+
					 "INSERT INTO MyWorkConfig (paramname , paramvalue ) VALUES ('SYNC_UPLOAD_FREQUENCY','2000');"+
					 "INSERT INTO MyWorkConfig (paramname , paramvalue ) VALUES ('LASTSYNC_REFERENCE','20120101000000');"+
					 "INSERT INTO MyWorkConfig (paramname , paramvalue ) VALUES ('LASTSYNC_TRANSACTIONAL','20120101000000');"+
					 "INSERT INTO MyWorkConfig (paramname , paramvalue ) VALUES ('LASTSYNC_UPLOAD','20120101000000');"+
					 "INSERT INTO MyWorkConfig (paramname , paramvalue ) VALUES ('SERVERNAME','" +AzureServerName + "');"+
					 "INSERT INTO MyWorkConfig (paramname , paramvalue ) VALUES ('SAPCLIENT','');"+
					 "INSERT INTO MyWorkConfig (paramname , paramvalue ) VALUES ('SAPSYSTEM','');"+
					 "INSERT INTO MyWorkConfig (paramname , paramvalue ) VALUES ('AssetDocumentServerPath','G:\assetdocuments\global');"+
					 "INSERT INTO MyWorkConfig (paramname , paramvalue ) VALUES ('DEBUGPASSWORD','');"+
					 "INSERT INTO MyWorkConfig (paramname , paramvalue ) VALUES ('DEBUGUSERNAME','');"+
					 "INSERT INTO MyWorkConfig (paramname , paramvalue ) VALUES ('DEBUGTOKENVALIDITY','');"+
					 "INSERT INTO MyWorkConfig (paramname , paramvalue ) VALUES ('LastLogoff','" + d + "');";
		html5sql.process(sqlstatement,
						 function () {
                             //we add the columns here as they are read from the database
						     setColumnOrderAssetListEditUpdate();
						     setColumnOrderAssetListParent();

							busycreateDB.close()
							callback()



						 },
						 function(error, statement){

							 opErrorMessage("Error: " + error.message + " when create processing " + statement);


						 }
				);


}

function buildDirsErrorHandler(error){

	opMessage("Failed to create The Directories: "+ error);
}
function buildDirs(fs) {



    var entry=fs;

    entry.getDirectory("MyJobs", {create: true, exclusive: false},
    		function(dir){
		    	 console.log("Created dir "+dir.name);
		    	  entry.getDirectory("MyJobs/Global", {create: true, exclusive: false},
		    	    		function(dir){
		    			    	 console.log("Created dir "+dir.name);
		    			    	 entry.getDirectory("MyJobs/Private", {create: true, exclusive: false},
		    			    	    		function(dir){
		    			    			    	 console.log("Created dir "+dir.name);
		    			    			    	 entry.getDirectory("MyJobs/Private/Download", {create: true, exclusive: false},
		    			    			    	    		function(dir){
		    			    			    			    	 console.log("Created dir "+dir.name);
		    			    			    			    	 entry.getDirectory("MyJobs/Private/Upload", {create: true, exclusive: false},
		    			    			    			    	    		function(dir){
		    			    			    			    			    	 console.log("Created dir "+dir.name);
		    			    			    			    			    	 entry.getDirectory("MyJobs/Private/Photos", {create: true, exclusive: false},
		    			    			    			    			    				function(dir){
		    			    			    			    			    			    	 console.log("Created dir "+dir.name);
		    			    			    			    			    			    	 entry.getDirectory("MyJobs/Global/Download", {create: true, exclusive: false},
		    			    			    			    			    			    	    		function(dir){
		    			    			    			    			    			    			    	 console.log("Created dir "+dir.name);
		    			    			    			    			    			    			    	 entry.getDirectory("MyJobs/Global/Upload", {create: true, exclusive: false},
		    			    			    			    			    			    			    	    		function(dir){
		    			    			    			    			    			    			    			    	 console.log("Created dir Global-Upload"+dir.name);
		    			    			    			    			    			    			    			    	 entry.getDirectory("MyJobs/Global/Forms", {create: true, exclusive: false},
		    			    			    			    			    			    			    			    	    		function(dir){
		    			    			    			    			    			    			    			    			    	 console.log("Created dir Global-Forms"+dir.name);
		    			    			    			    			    			    			    			    			    	 entry.getDirectory("MyJobs/Private/Photos/ASC", {create: true, exclusive: false},
		    			    			    			    			    			    			    			    			    	    		function(dir){
		    			    			    			    			    			    			    			    			    	    		    console.log("Created dir Global-ASC" + dir.name);
                                                                                                                                                                entry.getDirectory("MyJobs/Global/Icons", {create: true, exclusive: false},
		    			    			    			    			    			    			    			    			    	    		    function(dir){
		    			    			    			    			    			    			    			    			    	    		        console.log("Created MyJobs-Global-Icons");
		    			    			    			    			    			    			    			    			    			        }, function(error){
		    			    			    			    			    			    			    			    			    			    	     console.log("error Creating Dir MyJobs-Global-Icons"+error);
		    			    			    			    			    			    			    			    			    			        });
		    			    			    			    			    			    			    			    			    			    }, function(error){
		    			    			    			    			    			    			    			    			    			    	 console.log("error Creating Di MyJobs-Global-ASC"+error);
		    			    			    			    			    			    			    			    			    			    });

		    			    			    			    			    			    			    			    			    }, function(error){
		    			    			    			    			    			    			    			    			    	 console.log("error Creating Di MyJobs-Global-Forms"+error);
		    			    			    			    			    			    			    			    			    });
		    			    			    			    			    			    			    			    }, function(error){
		    			    			    			    			    			    			    			    	 console.log("error Creating Di MyJobs-Global-Upload"+error);
		    			    			    			    			    			    			    			    });
		    			    			    			    			    			    			    }, function(error){
		    			    			    			    			    			    			    	 console.log("error Creating Di MyJobs-Global-Download"+error);
		    			    			    			    			    			    			    });

		    			    			    			    			    			    }, function(error){
		    			    			    			    			    			    	 console.log("error Creating Di MyJobs-Private-Photos"+error);
		    			    			    			    			    			    });
		    			    			    			    			    }, function(error){
		    			    			    			    			    	 console.log("error Creating Di MyJobs-Private-Upload"+error);
		    			    			    			    			    });

		    			    			    			    }, function(error){
		    			    			    			    	 console.log("error Creating Di MyJobs-Private-Download"+error);
		    			    			    			    });
		    			    			    }, function(error){
		    			    			    	 console.log("error Creating Di MyJobs-Private "+error);
		    			    			    });
		    			    }, function(error){
		    			    	 console.log("error Creating Di MyJobs-Global "+error);
		    			    });
		    }, function(error){
		    	 console.log("error Creating Di MyJobs "+error);
		    });













}
//*************************************************************************************************************************
//
//  Delete all Tables
//
//*************************************************************************************************************************
function dropTables() {

		var sqlstatement=

		'DROP TABLE IF EXISTS MyJobsParams;'+
		'DROP TABLE IF EXISTS DecommissionStatus;'+
		'DROP TABLE IF EXISTS AssetSites;'+
		'DROP TABLE IF EXISTS AssetSitesDetails;'+
		'DROP TABLE IF EXISTS MyRefUsers;'+
		'DROP TABLE IF EXISTS Manufacturer;'+
		'DROP TABLE IF EXISTS Model;'+
		'DROP TABLE IF EXISTS EGIandNameCodeMapping;'+
		'DROP TABLE IF EXISTS EquipmentTypeCode;'+
		'DROP TABLE IF EXISTS AssetTypeCodes;'+
		'DROP TABLE IF EXISTS FunctionTypeCodes;'+
		'DROP TABLE IF EXISTS PlantGroupCodes;'+
		'DROP TABLE IF EXISTS SystemCodes;'+
		'DROP TABLE IF EXISTS PlantGroupAndProcessGroupCodes;'+
		'DROP TABLE IF EXISTS AssetCaptureCategory;'+
		'DROP TABLE IF EXISTS AssetUpload;'+
		'DROP TABLE IF EXISTS MyJobDets;'+
		'DROP TABLE IF EXISTS MyJobDetsMPcodes;'+
		'DROP TABLE IF EXISTS MyJobDetsMPoints;'+
		'DROP TABLE IF EXISTS MyJobDetsLoch;'+
		'DROP TABLE IF EXISTS MyJobDetsDraw;'+
		'DROP TABLE IF EXISTS MyJobsDetsEQ;'+
		'DROP TABLE IF EXISTS MyJobsDetsATTR;'+
		'DROP TABLE IF EXISTS MyJobDetsMeasCodes;'+
		'DROP TABLE IF EXISTS MyJobDetsComps;'+
		'DROP TABLE IF EXISTS MyJobDetsOrderLongText;'+
		'DROP TABLE IF EXISTS MyJobDetsAddress;'+
		'DROP TABLE IF EXISTS MyJobDetsNotifLongText;'+
		'DROP TABLE IF EXISTS MyJobDetsOrderOps;'+
		'DROP TABLE IF EXISTS MyJobDetsIconPriority;'+
		'DROP TABLE IF EXISTS MyJobDetsIconJob;'+
		'DROP TABLE IF EXISTS MyOrders;'+
		'DROP TABLE IF EXISTS MyNotifications;'+
		'DROP TABLE IF EXISTS MyStatus;'+
		'DROP TABLE IF EXISTS MyTimeConfs;'+
		'DROP TABLE IF EXISTS MyMPointDocs;'+
		'DROP TABLE IF EXISTS MyJobClose;'+
		'DROP TABLE IF EXISTS MyNewJobs;'+
		'DROP TABLE IF EXISTS MyWorkConfig;'+
		'DROP TABLE IF EXISTS MyUserDets;'+
		'DROP TABLE IF EXISTS MyRefPriorityTypes;'+
		'DROP TABLE IF EXISTS MyVehiclesDefault;'+
		'DROP TABLE IF EXISTS MyVehicles;'+
		'DROP TABLE IF EXISTS MyForms;'+
		'DROP TABLE IF EXISTS MyFormsResponses;'+
		'DROP TABLE IF EXISTS MyVehicleCheck;'+
		'DROP TABLE IF EXISTS Assets;'+
		'DROP TABLE IF EXISTS LogFile;'+
		'DROP TABLE IF EXISTS AssetDetails;'+
		'DROP TABLE IF EXISTS FuncLocs;'+
		'DROP TABLE IF EXISTS MyMenuBar;'+
		'DROP TABLE IF EXISTS REFPAICODES;'+
		'DROP TABLE IF EXISTS REFNOTIFICATIONTYPES;'+
		'DROP TABLE IF EXISTS REFVARIANCESRFV;'+
		'DROP TABLE IF EXISTS REFACTIVITY;'+
		'DROP TABLE IF EXISTS DG5REL;'+
		'DROP TABLE IF EXISTS DG5CODES;'+
		'DROP TABLE IF EXISTS CFCODES;'+
		'DROP TABLE IF EXISTS MyJobsDocs;'+
		'DROP TABLE IF EXISTS MyJobsPhotos;'+
		'DROP TABLE IF EXISTS MyJobAddWork;'+
		'DROP TABLE IF EXISTS AssetDetailsAll';

						html5sql.process(sqlstatement,
						 function(){
							 //alert("Success dropping Tables");
						 },
						 function(error, statement){
							 opErrorMessage("Error: " + error.message + " when dropTables processing " + statement);
						 }
				);
}
var sqldeletetable=

'DELETE FROM MyJobsParams;'+
'DELETE FROM DecommissionStatus;'+
'DELETE FROM AssetSites;'+
'DELETE FROM AssetSitesDetails;'+
'DELETE FROM MyRefUsers;'+
'DELETE FROM Manufacturer;'+
'DELETE FROM Model;'+
'DELETE FROM EGIandNameCodeMapping;'+
'DELETE FROM EquipmentTypeCode;'+
'DELETE FROM AssetTypeCodes;'+
'DELETE FROM FunctionTypeCodes;'+
'DELETE FROM PlantGroupCodes;'+
'DELETE FROM SystemCodes;'+
'DELETE FROM PlantGroupAndProcessGroupCodes;'+
'DELETE FROM AssetCaptureCategory;'+
'DELETE FROM AssetUpload;'+
'DELETE FROM MyJobDets;'+
'DELETE FROM MyJobDetsMPcodes;'+
'DELETE FROM MyJobDetsMPoints;'+
'DELETE FROM MyJobDetsLoch;'+
'DELETE FROM MyJobDetsDraw;'+
'DELETE FROM MyJobsDetsEQ;'+
'DELETE FROM MyJobsDetsATTR;'+
'DELETE FROM MyJobDetsMeasCodes;'+
'DELETE FROM MyJobDetsComps;'+
'DELETE FROM MyJobDetsOrderLongText;'+
'DELETE FROM MyJobDetsAddress;'+
'DELETE FROM MyJobDetsNotifLongText;'+
'DELETE FROM MyJobDetsOrderOps;'+
'DELETE FROM MyJobDetsIconPriority;'+
'DELETE FROM MyJobDetsIconJob;'+
'DELETE FROM MyOrders;'+
'DELETE FROM MyNotifications;'+
'DELETE FROM MyStatus;'+
'DELETE FROM MyTimeConfs;'+
'DELETE FROM MyMPointDocs;'+
'DELETE FROM MyJobClose;'+
'DELETE FROM MyNewJobs;'+
'DELETE FROM MyWorkConfig;'+
'DELETE FROM MyUserDets;'+
'DELETE FROM MyRefPriorityTypes;'+
'DELETE FROM MyVehiclesDefault;'+
'DELETE FROM MyVehicles;'+
'DELETE FROM MyForms;'+
'DELETE FROM MyFormsResponses;'+
'DELETE FROM MyVehicleCheck;'+
'DELETE FROM Assets;'+
'DELETE FROM LogFile;'+
'DELETE FROM AssetDetails;'+
'DELETE FROM FuncLocs;'+
'DELETE FROM MyMenuBar;'+
'DELETE FROM REFPAICODES;'+
'DELETE FROM REFNOTIFICATIONTYPES;'+
'DELETE FROM REFVARIANCESRFV;'+
'DELETE FROM REFACTIVITY;'+
'DELETE FROM DG5REL;'+
'DELETE FROM DG5CODES;'+
'DELETE FROM CFCODES;'+
'DELETE FROM MyJobsDocs;'+
'DELETE FROM MyJobsPhotos;'+
'DELETE FROM MyJobAddWork;'+
'DELETE FROM AssetDetailsAll;';
var sqlresettable=

	'DELETE FROM MyJobsParams;'+
	'DELETE FROM DecommissionStatus;'+
	'DELETE FROM AssetSites;'+
	'DELETE FROM AssetSitesDetails;'+
	'DELETE FROM MyRefUsers;'+
	'DELETE FROM Manufacturer;'+
	'DELETE FROM Model;'+
	'DELETE FROM EGIandNameCodeMapping;'+
	'DELETE FROM EquipmentTypeCode;'+
	'DELETE FROM AssetTypeCodes;'+
	'DELETE FROM FunctionTypeCodes;'+
	'DELETE FROM PlantGroupCodes;'+
	'DELETE FROM SystemCodes;'+
	'DELETE FROM PlantGroupAndProcessGroupCodes;'+
	'DELETE FROM AssetCaptureCategory;'+
	'DELETE FROM AssetUpload;'+
	'DELETE FROM MyJobDets;'+
	'DELETE FROM MyJobDetsMPcodes;'+
	'DELETE FROM MyJobDetsMPoints;'+
	'DELETE FROM MyJobDetsLoch;'+
	'DELETE FROM MyJobDetsDraw;'+
	'DELETE FROM MyJobsDetsEQ;'+
	'DELETE FROM MyJobsDetsATTR;'+
	'DELETE FROM MyJobDetsMeasCodes;'+
	'DELETE FROM MyJobDetsComps;'+
	'DELETE FROM MyJobDetsOrderLongText;'+
	'DELETE FROM MyJobDetsAddress;'+
	'DELETE FROM MyJobDetsNotifLongText;'+
	'DELETE FROM MyJobDetsOrderOps;'+
	'DELETE FROM MyJobDetsIconPriority;'+
	'DELETE FROM MyJobDetsIconJob;'+
	'DELETE FROM MyOrders;'+
	'DELETE FROM MyNotifications;'+
	'DELETE FROM MyStatus;'+
	'DELETE FROM MyTimeConfs;'+
	'DELETE FROM MyMPointDocs;'+
	'DELETE FROM MyJobClose;'+
	'DELETE FROM MyNewJobs;'+
	//'DELETE FROM MyWorkConfig;'+
	'DELETE FROM MyUserDets;'+
	'DELETE FROM MyRefPriorityTypes;'+
	'DELETE FROM MyVehiclesDefault;'+
	'DELETE FROM MyVehicles;'+
	'DELETE FROM MyForms;'+
	'DELETE FROM MyFormsResponses;'+
	'DELETE FROM MyVehicleCheck;'+
	'DELETE FROM Assets;'+
	'DELETE FROM LogFile;'+
	'DELETE FROM AssetDetails;'+
	'DELETE FROM FuncLocs;'+
	'DELETE FROM MyMenuBar;'+
	'DELETE FROM REFPAICODES;'+
	'DELETE FROM REFNOTIFICATIONTYPES;'+
	'DELETE FROM REFVARIANCESRFV;'+
	'DELETE FROM REFACTIVITY;'+
	'DELETE FROM DG5REL;'+
	'DELETE FROM DG5CODES;'+
	'DELETE FROM CFCODES;'+
	'DELETE FROM MyJobsDocs;'+
	'DELETE FROM MyJobsPhotos;'+
	'DELETE FROM MyJobAddWork;'+
	'DELETE FROM AssetDetailsAll;';
function emptyTables(type) {
    var d = new Date();
    // d.setDate(d.getDate() + 1);
    //Assumping emptyTables is called during office hours, lastLogoff should happen out of hours. Once set last logoff should happen every 24 hours.
    addHours(d, 12);
var sqlstatement=sqldeletetable
sqlstatement+="INSERT INTO MyWorkConfig (paramname , paramvalue ) VALUES ('TRACE','OFF');";
sqlstatement += "INSERT INTO MyWorkConfig (paramname , paramvalue ) VALUES ('SYNC_REFERENCE_FREQUENCY','86400000');";
sqlstatement+="INSERT INTO MyWorkConfig (paramname , paramvalue ) VALUES ('SYNC_TRANSACTIONAL_FREQUENCY','600000');";
sqlstatement+="INSERT INTO MyWorkConfig (paramname , paramvalue ) VALUES ('SYNC_UPLOAD_FREQUENCY','2000');";
sqlstatement+="INSERT INTO MyWorkConfig (paramname , paramvalue ) VALUES ('LASTSYNC_REFERENCE','20120101000000');";
sqlstatement+="INSERT INTO MyWorkConfig (paramname , paramvalue ) VALUES ('LASTSYNC_TRANSACTIONAL','20120101000000');";
sqlstatement+="INSERT INTO MyWorkConfig (paramname , paramvalue ) VALUES ('LASTSYNC_UPLOAD','20120101000000');";
sqlstatement+="INSERT INTO MyWorkConfig (paramname , paramvalue ) VALUES ('SERVERNAME','" +AzureServerName + "');"
sqlstatement+="INSERT INTO MyWorkConfig (paramname , paramvalue ) VALUES ('SAPCLIENT','');";
sqlstatement+="INSERT INTO MyWorkConfig (paramname , paramvalue ) VALUES ('SAPSYSTEM','');";
sqlstatement+="INSERT INTO MyWorkConfig (paramname , paramvalue ) VALUES ('AssetDocumentServerPath','G:\assetdocuments\global');";
sqlstatement+="INSERT INTO MyWorkConfig (paramname , paramvalue ) VALUES ('DEBUGPASSWORD','');";
sqlstatement+="INSERT INTO MyWorkConfig (paramname , paramvalue ) VALUES ('DEBUGUSERNAME','');";
sqlstatement+= "INSERT INTO MyWorkConfig (paramname , paramvalue ) VALUES ('DEBUGTOKENVALIDITY','');";
sqlstatement+= "INSERT INTO MyWorkConfig (paramname , paramvalue ) VALUES ('LastLogoff','" + d + "');";
html5sql.process(sqlstatement,
		 function(){
			stopBGSync();
			logoutazureandrestart();
		 },
		 function(error, statement){

			 opErrorMessage("Error: " + error.message + " when delete processing " + statement);
		 }
);

}
function loadDemoData() {
	 var path = window.location.pathname;
     var page = path.split("/").pop();

	localStorage.setItem("LastSyncedDT",getDate()+getTime())
	sqlstatement=	'DELETE FROM  MyOrders;'+
					'DELETE FROM  AssetDetails;'+
					'DELETE FROM  MyNotifications;'+
					'DELETE FROM  MyStatus;'+
					'DELETE FROM  MyTimeConfs;'+
					'DELETE FROM  MyMPointDocs;'+
					'DELETE FROM  MyJobClose;'+
					'DELETE FROM  MyNewJobs;'+
					'DELETE FROM  MyWorkConfig;'+
					'DELETE FROM  MyRefUsers;'+
					'DELETE FROM  MyRefPriorityTypes;'+
					//'DELETE FROM  MyUserDets;'+
					'DELETE FROM  MyVehicles;'+
					'DELETE FROM  MyVehiclesDefault;'+
					'DELETE FROM  MyVehicleCheck;'+
					'DELETE FROM  Assets;'+
					'DELETE FROM  LogFile;'+
					'DELETE FROM  FuncLocs;'+
					'DELETE FROM MyMenuBar;'+
					'DELETE FROM MyJobDets;'+
									'DELETE FROM  REFPAICODES;'+
				'DELETE FROM  REFNOTIFICATIONTYPES;'+
				'DELETE FROM  REFVARIANCESRFV;'+
				'DELETE FROM  REFACTIVITY;'+
				'DELETE FROM  MyForms;'+
				'DELETE FROM  MyFormsResponses;'+
				'DELETE FROM  DG5REL;'+
				'DELETE FROM  DG5CODES;'+
				'DELETE FROM  CFCODES;'+
				'DELETE FROM  MyJobsDocs;'+
				'DELETE FROM  MyJobsPhotos;'+
				'DELETE FROM MyJobsDetsEQ;'+
				'DELETE FROM MyJobsDetsATTR;'+
				'DELETE FROM AssetDetailsAll;'+
				'DELETE FROM  MyJobDetsMPoints;'+
				'DELETE FROM  MyJobDetsLoch;'+
				'DELETE FROM  MyJobDetsMPCodes;'+
				'DELETE FROM  MyJobDetsDraw;'+


					html5sql.process(sqlstatement,
					 function(){


						SetConfigParam("TRACE", "ON");
						SetConfigParam("SYNC_REFERENCE_FREQUENCY", "86400000");
						SetConfigParam("SYNC_TRANSACTIONAL_FREQUENCY", "600000");
						SetConfigParam("SYNC_UPLOAD_FREQUENCY", "300");
						SetConfigParam("LASTSYNC_REFERENCE", "20180316170000");
						SetConfigParam("LASTSYNC_TRANSACTIONAL", "20180316224900");
						SetConfigParam("LASTSYNC_UPLOAD", "20180316214900");
						SetConfigParam("SERVERNAME", AzureServerName); //AZURE
						SetConfigParam("SAPCLIENT", "120");



						requestDEMOData('MyJobsOrders.json');

						requestDEMOData('MyJobsNotifications.json');

						requestDEMOData('MyJobsUsers.json');
						requestDEMOData('MyJobsAssetPlantsExt.json');

						requestDEMOData('MyJobsOrdersObjects.json');

						requestDEMOData('MyJobsRefData.json');

						requestDEMOData('MyJobsRefDataCodes.json');


						requestDEMOData('MyForms.json');
						requestDEMOData('PE29.json');

						requestDEMOData('MyJobsVehicles.json');
						requestDEMOData('MyJobsVehiclesDefault.json');
						requestDEMOData('MyJobsDG5Codes.json');

						getAssets();
						requestDEMOData('MyJobsParams.json');








					 },
					 function(error, statement){
						 opErrorMessage("Error: " + error.message + " when LoadDemo processing " + statement);

					 }
			);
}

function resetTables(server,dPassword,dUsername,dValidity) {
	var sqlstatement=sqlresettable;
	sqlstatement+="UPDATE MyWorkConfig SET paramvalue = '20120101010101' WHERE paramname = 'LASTSYNC_REFERENCE';"
	sqlstatement+="UPDATE MyWorkConfig SET paramvalue = '20120101010101' WHERE paramname = 'LASTSYNC_TRANSACTIONAL';"
	sqlstatement+="UPDATE MyWorkConfig SET paramvalue = '20120101010101' WHERE paramname = 'LASTSYNC_UPLOAD';"
	sqlstatement+="UPDATE MyWorkConfig SET paramvalue = '"+server+"' WHERE paramname = 'SERVERNAME';"
	sqlstatement+="UPDATE MyWorkConfig SET paramvalue = '"+dPassword+"' WHERE paramname = 'DEBUGPASSWORD';"
	sqlstatement+="UPDATE MyWorkConfig SET paramvalue = '"+dUsername+"' WHERE paramname = 'DEBUGUSERNAME';"
	sqlstatement+="UPDATE MyWorkConfig SET paramvalue = '"+dValidity+"' WHERE paramname = 'DEBUGTOKENVALIDITY';"
	sqlstatement+="INSERT INTO MyUserDets (mobileuser , vehiclereg, user, password ,employeeid, pincode, maptype, docserver) VALUES ('"+dUsername+"','','" +dUsername+"','','','','Intergraph','DocumentService');";
					html5sql.process(sqlstatement,
					 function(){
						localStorage.setItem('LastSyncReference','20120101010101');
						localStorage.setItem('LastSyncTransactional','20120101010101');
						localStorage.setItem('LastSyncUpload','20120101010101');
						//window.location.href="index.html"
						homepage.placeAt("body","only");

					    formLogin.open()

					 },
					 function(error, statement){

						 opErrorMessage("Error: " + error.message + " when resetTables processing " + statement);
					 }
			);
}

function DeleteLog() {
		html5sql.process("DELETE FROM LogFile",
						 function(){
						     currentPagedl = 1;
						 },
						 function(error, statement){
							 opErrorMessage("Error: " + error.message + " when DeleteLog processing " + statement);
						 }
				);

}

function tidyLog() {
        html5sql.process("DELETE from logfile WHERE  datetime(recordupdated)  <  datetime('now', '-14 day')",
                     function () {

                     },
                     function (error, statement) {
                         opErrorMessage("Error: " + error.message + " when DeleteLog processing " + statement);
                     }
            );

}

function requestDEMOData(page){

	opMessage("DEMOLoad "+page);

	$.getJSON("TestData/"+page,function(data,status){
		if (page == 'AssetSitesDetails.json') {
			refAssetSitesDetailsCB(data);
		}
		if(page=='MyJobsParams.json'){
			paramCB(data);

		}
		if(page=='MyJobsOrders.json'){

			orderCB(data);

		}
		if(page=='MyJobsNotifications.json'){

			notificationCB(data);

		}
		if(page=='MyJobsUsers.json'){
			userCB(data);

		}
		if(page=='MyJobsAssetPlantsExt.json'){
			assetPlantsCB(data);

		}
		if(page=='MyForms.json'){
			formCB(data);

		}
		if(page=='PE29.json'){
			propsCB(data);

		}
		if(page=='POSTRIDGE2.json'){

			assetdetailsCB(data);

		}
		if(page=='MyJobsOrdersObjects.json'){
			orderobjectsCB(data);

		}
		if(page=='MyJobsRefData.json'){

			refdataCB(data);

		}
		if(page=='MyJobsRefJobsDataCodes.json'){
			refdatacodesCB(data);

		}
		if(page=='MyJobsVehicles.json'){
			vehicleCB(data);

		}
		if(page=='MyJobsVehiclesDefault.json'){
			vehicleDefaultCB(data);

		}



		if(page=='funclocs.json'){
			refflocsCB(data);

		}



		if(page=='MyJobsDG5Codes.json'){

			dg5CB(data);

		}
	})
	.fail(function(data,status) {
		opErrorMessage("Error: " + data+"-"+status + " when DeleteLog processing " )
	})
}



function DeleteOldPhotos(orderlist){
	console.log("Delete Old Photos")

}
function UpdateJobDetClose(orderno, opno){
	status="CLOSED";
	html5sql.process("update  myjobdets set status = '"+status+"', statusDescS = '"+status+"', statusDescL =  '"+status+"' ,tconf_date = '"+statusUpdateDate+"', tconf_time = '"+statusUpdateTime+"' where  orderid = '"+orderno+"' and ordnoOp = '"+ opno+"';",
			function(){
		buildJobs();

	},
	function(error, statement){
		opErrorMessage("Error: " + error.message + " when insertOperationStatus processing " + statement);

	}
	);
}
function sendJobPhotos(orderno,opno){
	var sqlstatement="";

	sqlstatement+='SELECT  p.id as id,p.url as url, p.name as name, p.orderno as orderno, p.opno as opno, p.status as status '
		sqlstatement+=' from MyJobsPhotos p where   p.orderno = "'+orderno+'"  and p.opno = "'+opno+'";'



		opMessage("Processing Photos");


	html5sql.process(sqlstatement,
			function(transaction, results, rowsArray){
		if( rowsArray.length > 0) {
			for (var n = 0; n < rowsArray.length; n++) {
				item = rowsArray[n];
				if(item.status!="Sent"){

					getBase64FromImageUrl(item.url,item.id,item.name)
					UpdatePhotoEntryonClose(item.orderno,item.opno, item.id, item.name, "","Sending")
					//same as other without build list
				}

			}



		}

	},
	function(error, statement){
		opErrorMessage("Error: " + error.message + " when sendJobPhotos processing " + statement);

	}
	);




}
function sendJobAttachments(orderno,opno){
	var sqlstatement="";

	sqlstatement+='SELECT  p.id as id,p.url as url,p.name as name,p.type as type, p.orderno as orderno, p.opno as opno, p.status as status '
		sqlstatement+=' from MyJobsDocs p where   p.orderno = "'+orderno+'"  and p.opno = "'+opno+'";'



		opMessage("Processing Photos");


	html5sql.process(sqlstatement,
			function(transaction, results, rowsArray){
		if( rowsArray.length > 0) {
			for (var n = 0; n < rowsArray.length; n++) {
				item = rowsArray[n];
				if(item.status!="Sent"){

					getBase64FromAttachmentUrl(item.url,item.id,item.name,item.type,"close")
					//UpdatePhotoEntryonClose(item.orderno,item.opno, item.id, item.name, "","Sending")
					//same as other without build list
				}

			}



		}

	},
	function(error, statement){
		opErrorMessage("Error: " + error.message + " when sendJobAttachments processing " + statement);
	}
	);




}
function sendJobForms(orderno,opno){
	var sqlstatement="";

	sqlstatement+='SELECT  p.id as id,p.formdesc as formdesc,p.formname as formname,p.htmlbody as htmlbody,p.htmlreadonly as htmlreadonly, p.orderno as orderno, p.opno as opno, p.status as status '
		sqlstatement+=' from MyFormsResponses p where   p.orderno = "'+orderno+'"  and p.opno = "'+opno+'";'



		opMessage("Processing Photos");


	html5sql.process(sqlstatement,
			function(transaction, results, rowsArray){
		if( rowsArray.length > 0) {
			for (var n = 0; n < rowsArray.length; n++) {
				item = rowsArray[n];
				if(item.status!="Sent"){
					x=unescape(item.htmlreadonly)
					y=unescape(encodeURIComponent(x))

					formHTML=window.btoa(HTMLFormStart+y+HTMLFormEnd)

					createBase64FormXML(formHTML,item.formdesc+".html",item.id,item.formdesc,"close")

				}

			}



		}

	},
	function(error, statement){
		opErrorMessage("Error: " + error.message + " when sendJobForms processing " + statement);
	}
	);




}
function paramCB(data){
	var sqlstatement="";

	if(data.params.length>0){
		if(syncReferenceDetsUpdated){
			localStorage.setItem('LastSyncReferenceDetails',localStorage.getItem('LastSyncReferenceDetails')+', Params:'+String(data.params.length));
		}else{
			localStorage.setItem('LastSyncReferenceDetails',localStorage.getItem('LastSyncReferenceDetails')+'Params:'+String(data.params.length));
		}

		opMessage("Deleting Existing PParameters");
		sqlstatement+='DELETE FROM MyJobsParams;';
		opMessage("Loading"+data.params.length+" Existing Params");
		for(var cntx=0; cntx < data.params.length ; cntx++)
		{

			sqlstatement+=' INSERT INTO MyJobsParams (name , key1 , key2 , value ) VALUES ('+
			'"'+data.params[cntx].name +'",'+
			'"'+data.params[cntx].key1 +'",'+
			'"'+data.params[cntx].key2 +'",'+
			'"'+data.params[cntx].value+'");';
		}

		html5sql.process(sqlstatement,
				function(){

		},
		function(error, statement){
			opErrorMessage("Error: " + error.message + " when processing Param loading " + statement);
		}
		);


	}
}

//syncUsersDetails isn't called by anything ?
//function syncUsersDetails(server){


//	opMessage("Synchronizing Users Details");



//	html5sql.process("SELECT * from MyWorkConfig where paramname = 'SERVERNAME'",
//			function(transaction, results, rowsArray){
//		if( rowsArray.length > 0) {
//			SAPServerPrefix=$.trim(server);
//			requestAzureData("ZGW_MAM30_090_GETLIST_T3", "");             //Users

//		}

//	},
//	function(error, statement){
//		opErrorMessage("Error: " + error.message + " when syncTransactional processing " + statement);
//	}
//	);
//}

//Asset capture stuff below

function getBusinessUnit(siteShortCode, callback) {
	var sqlstatement = 'SELECT bunit FROM AssetSites WHERE site=' + '"' + siteShortCode + '"';

	html5sql.process(sqlstatement,
			function (transaction, results, rowsArray) {
		if (rowsArray.length > 0) {
			currentAssetRecord.businessUnit = rowsArray[0].bunit;
		}
		callback();
	},
	function (error, statement) {
		opErrorMessage("Error: " + error.message + " when processing " + statement);
		currentAssetRecord.businessUnit = null;
		callback();
	}
	);
}
function getEquipmentInfo(callback) {

	var sqlstatement = 'SELECT ZATCODE,ZOTDESC,ZOTDEF||ZOTDEF_EXT AS ZOTDEF from  EquipmentTypeCode e  where ZZEQPT_EGI ='
		sqlstatement += '"' + currentAssetRecord.equipmentTypeCodeZZEQPT_EGI + '"';

	html5sql.process(sqlstatement,
			function (transaction, results, rowsArray) {
		if (rowsArray.length > 0) {
			currentAssetRecord.assetTypeCodeZATCODE = rowsArray[0].ZATCODE;
			currentAssetRecord.ZotDef = rowsArray[0].ZOTDEF;
			currentAssetRecord.equipmentTypeDescriptionZOTDESC = rowsArray[0].ZOTDESC;
		}
		else {
			currentAssetRecord.assetTypeCodeZATCODE = null;
			currentAssetRecord.ZotDef = null;
			currentAssetRecord.equipmentTypeDescriptionZOTDESC = null;
		}
		callback();
	},
	function (error, statement) {
		opErrorMessage("Error: " + error.message + " when processing " + statement);
		showErrorMessage("", error.message)

	}
	);


}
function getEquipmentTypeCodeZZEQPT_EGI(make, model, callback) {

	var sqlstatement = 'SELECT EQART from  Model  where HERST ='
		sqlstatement += '"' + make + '" AND Model="' + model + '"';
	html5sql.process(sqlstatement,
			function (transaction, results, rowsArray) {
		if (rowsArray.length > 0) {
			currentAssetRecord.equipmentTypeCodeZZEQPT_EGI = rowsArray[0].EQART;
		}
		else {
			currentAssetRecord.equipmentTypeCodeZZEQPT_EGI = null;
		}
		callback();
	},
	function (error, statement) {
		opErrorMessage("Error: " + error.message + " when processing " + statement);
	}
	);


}
function getMakeModelValidity(make, model, callback) {

    var sqlstatement = "select model from model where herst like '%" + make + "%'";

    html5sql.process(sqlstatement,
			function (transaction, results, rowsArray) {
			    if (rowsArray.length > 0) {
			        for (var i = 0; i < rowsArray.length; i++) {
			            item = rowsArray[i];
			            if (item.MODEL.startsWith('#')) { item.MODEL = item.MODEL.substr(1) }
			            if (item.MODEL == model) {
			                callback(true);
			                break;
			            }
			        }
			        callback(false)
			    }
			    else {
			        callback(false)
			    }
			},
	function (error, statement) {
	    opErrorMessage("Error: " + error.message + " when processing " + statement);
	}
	);
}
function getZZFL_NC(zatCode, callback) {
	var sqlstatement = "select distinct ZZFL_NC from FunctionTypeCodes  where ZATCODE='" + zatCode + "'";

	html5sql.process(sqlstatement,
			function (transaction, results, rowsArray) {
		if (rowsArray.length > 0) {
			//currentAssetRecord.funcLocSub19_22zzfl_nc = rowsArray[0].ZZFL_NC;
			currentAssetRecord.zzfl_nc = rowsArray[0].ZZFL_NC;
		}
		callback();
	},
	function (error, statement) {
		opErrorMessage("Error: " + error.message + " when processing " + statement);
	}
	);


}
function getFunctionDefinitionZNCDEF(zzfl_nc) {

	var sqlstatement = 'SELECT ZNCDEF|| ZNCDEF_EXT AS ZNCDEF from  FunctionTypeCodes  where ZZFL_NC ='
		sqlstatement += '"' + zzfl_nc + '"';
	html5sql.process(sqlstatement,
			function (transaction, results, rowsArray) {
		if (rowsArray.length > 0) {
			sap.ui.getCore().getElementById("text_SelectFunctionType").setValue(rowsArray[0].ZNCDEF);
		}
		else {
			sap.ui.getCore().getElementById("text_SelectFunctionType").setValue("");
		}

	},
	function (error, statement) {
		opErrorMessage("Error: " + error.message + " when processing " + statement);
	}
	);
}
function getZZFL_NC(zatCode, callback) {
	var sqlstatement = "select distinct ZZFL_NC from FunctionTypeCodes  where ZATCODE='" + zatCode + "'";

	html5sql.process(sqlstatement,
			function (transaction, results, rowsArray) {
		if (rowsArray.length > 0) {
			//currentAssetRecord.funcLocSub19_22zzfl_nc = rowsArray[0].ZZFL_NC;
			currentAssetRecord.zzfl_nc = rowsArray[0].ZZFL_NC;
		}
		callback();
	},
	function (error, statement) {
		opErrorMessage("Error: " + error.message + " when processing " + statement);
	}
	);


}
function getAssetCategory(zzeqpt_egi, zzfl_nc, bunit, callback) {
	var sqlstatement = "select distinct ZASCAT from EGIandNameCodeMapping where  ZZW_WW =";
	sqlstatement += "'" + bunit + "' AND ZZFL_NC='" + zzfl_nc + "' AND ZZEQPT_EGI='" + zzeqpt_egi + "'";
	html5sql.process(sqlstatement,
			function (transaction, results, rowsArray) {
		if (rowsArray.length > 0) {
			currentAssetRecord.zascatAssetCategory = rowsArray[0].ZASCAT;
		}
		else {
			currentAssetRecord.zascatAssetCategory = "E";
		}
		callback();
	},
	function (error, statement) {
		opErrorMessage("Error: " + error.message + " when processing " + statement);
	}

	);


}
function getAssetCategoryValidity(zzeqpt_egi, zzfl_nc, bunit, callback) {
	var sqlstatement = "select distinct ZASCAT from EGIandNameCodeMapping where  ZZW_WW =";
	sqlstatement += "'" + bunit + "' AND ZZFL_NC='" + zzfl_nc + "' AND ZZEQPT_EGI='" + zzeqpt_egi + "'";
	html5sql.process(sqlstatement,
			function (transaction, results, rowsArray) {
		if (rowsArray.length > 0) {
			callback(true);
		}
		else {
			callback(false);
		}
	},
	function (error, statement) {
		opErrorMessage("Error: " + error.message + " when processing " + statement);
	}

	);
}
function getPlantGroup(zzeqpt_egi, zzfl_nc, bunit, zascat, callback) {
	var sqlstatement = "select distinct ZPLGRP,ZPLGDESC from EGIandNameCodeMapping e  inner join PlantGroupCodes p on e.ZDEFPG = p.ZPLGRP where  e.ZZW_WW =";
	sqlstatement += "'" + bunit + "' AND ZZFL_NC='" + zzfl_nc + "' AND ZZEQPT_EGI='" + zzeqpt_egi + "' AND ZASCAT = '" + zascat + "'";
	html5sql.process(sqlstatement,
			function (transaction, results, rowsArray) {
		if (rowsArray.length > 0) {
			currentAssetRecord.plantGroupCodeZplgrp = rowsArray[0].ZPLGRP;
			currentAssetRecord.plantGroupDescriptionZPLGDESC = rowsArray[0].ZPLGDESC;
		}
		else {
			currentAssetRecord.plantGroupCodeZplgrp = null;
		}
		callback();
	},
	function (error, statement) {
		opErrorMessage("Error: " + error.message + " when processing " + statement);
	}
	);
}
function getPlantGroupAndProcessGroupCode(zplgrp, bunit, callback) {
	var sqlstatement = "select distinct ZPRG from PlantGroupAndProcessGroupCodes where  ZZW_WW =";
	sqlstatement += "'" + bunit + "' AND ZPLGRP='" + zplgrp + "'";
	html5sql.process(sqlstatement,
			function (transaction, results, rowsArray) {
		if (rowsArray.length > 0) {
			currentAssetRecord.processGroupZPRG = rowsArray[0].ZPRG;
		}
		else {
			currentAssetRecordprocessGroupZPRG = null;
		}
		callback();
	},
	function (error, statement) {
		opErrorMessage("Error: " + error.message + " when processing " + statement);
		callback();
	}

	);


}
function getPlantGroupValidity(zplgrp, bunit, callback) {
	var sqlstatement = "select distinct ZPRG from PlantGroupAndProcessGroupCodes where  ZZW_WW =";
	sqlstatement += "'" + bunit + "' AND ZPLGRP='" + zplgrp + "'";
	html5sql.process(sqlstatement,
			function (transaction, results, rowsArray) {
		if (rowsArray.length > 0) {
			if (currentAssetRecord.processGroupZPRG == rowsArray[0].ZPRG) {
				callback(true);
			}
			else {
				callback(false);
			}
		}
		else {
			callback(false);
		}
	},
	function (error, statement) {
		opErrorMessage("Error: " + error.message + " when processing " + statement);
		callback();
	}

	);


}
function getFunctionalLocationsForSite(site, callback) {
	var sqlstatement = "select distinct tplnr from AssetSitesDetails where site =" + "'" + site + "'";
	html5sql.process(sqlstatement,
			function (transaction, results, rowsArray) {
		callback(rowsArray);
	},
	function (error, statement) {
		opErrorMessage("Error: " + error.message + " when processing " + statement);
	}
	);
}
function GetSystemCodefromAssetCaptureCategory(assetTypeZatcode, zascatAssetCategory, callback) {
	var sqlstatement = "select distinct a.ZSYSCODE,s.ZZSYSDESC from AssetCaptureCategory a inner join systemcodes s on a.ZSYSCODE=s.ZSYSCODE where  a.ZATCODE =";
	sqlstatement += "'" + assetTypeZatcode + "' AND a.ZASCAT='" + zascatAssetCategory + "'";
	html5sql.process(sqlstatement,
			function (transaction, results, rowsArray) {
		if (rowsArray.length > 0) {
			currentAssetRecord.SystemCodeZSYSCODE = rowsArray[0].ZSYSCODE;
			currentAssetRecord.zsysDescSystemCodeDescription = rowsArray[0].ZZSYSDESC;
		}
		else {
			currentAssetRecord.SystemCodeZSYSCODE = null;
			currentAssetRecord.zsysDescSystemCodeDescription = null;
		}
		callback();
	},
	function (error, statement) {
		opErrorMessage("Error: " + error.message + " when processing " + statement);
	}
	);
}


function getFunctionalLocationString() {

	var theSite = currentAssetRecord.site;
	var theProcessGroup = currentAssetRecord.processGroupZPRG;
	var theZplgrp = currentAssetRecord.plantGroupCodeZplgrp;
	var theZsyscode = currentAssetRecord.SystemCodeZSYSCODE;
	var theZzfl_nc;
	//var theSystemCodeId = currentAssetRecord.SystemCodeNumber;
	//var theZzfl_nc = currentAssetRecord.funcLocSub19_22zzfl_nc;
	var theSystemCodeId = null;
	var theFunctionTypeItemId = null;
	if(currentAssetRecord.zzfl_nc){
		if(currentAssetRecord.zzfl_nc.length==3){
			theZzfl_nc = currentAssetRecord.zzfl_nc;

		}
		else{
			theZzfl_nc = currentAssetRecord.zzfl_nc;
			theZzfl_nc=theZzfl_nc.substring(2)
		}
	}
	//var theFunctionTypeItemId = currentAssetRecord.funcLocSub22_3FunctionTypeItemNumber;

	if (theSite == null) {
		theSite = "XXXXXX";
	}
	if (theProcessGroup == null) {
		theProcessGroup = "XX";
	}
	if (theZplgrp == null) {
		theZplgrp = "XXX";
	}
	if (theZsyscode == null) {
		theZsyscode = "XX";
	}
	if (theSystemCodeId == null) {
		theSystemCodeId = "NN";
	}
	if (theZzfl_nc == null) {
		theZzfl_nc = "XXXXX";
	}
	if (theFunctionTypeItemId == null) {
		theFunctionTypeItemId = "NNN";
	}

	currentAssetRecord.funcLocStringZINSTLOCN = theSite + "-" + theProcessGroup + "-" + theZplgrp + "-"
	+ theZsyscode + theSystemCodeId + "-"
	+ theZzfl_nc + theFunctionTypeItemId;

	return currentAssetRecord.funcLocStringZINSTLOCN
}

function requestDEMODataAC(page) {

	opMessage("DEMOLoad " + page);

	$.getJSON("TestData/" + page, function (data, status) {
		if (page == 'AssetSites.json') {
			refAssetsSitesCB(data);
		}
		//already done in loadDemoData
		//if (page == 'AssetSitesDetails.json') {
		//    refAssetSitesDetailsCB(data);
		//}

		if (page == 'Manufacturer.json') {
			populateManufacturer(data);
		}
		if (page == 'Model.json') {
			populateModel(data);
		}
		if (page == 'EGIandNameCodeMapping.json') {
			populateEGIandNameCodeMapping(data);
		}
		if (page == 'EquipmentTypeCode.json') {
			populateEquipmentTypeCode(data);
		}
		if (page == 'AssetTypeCodes.json') {
			populateAssetTypeCodes(data);
		}
		if (page == 'FunctionTypeCodes.json') {
			populateFunctionTypeCodes(data);
		}
		if (page == 'PlantGroupCodes.json') {
			populatePlantGroupCodes(data);
		}
		if (page == 'SystemCodes.json') {
			populateSystemCodes(data);
		}
		if (page == 'AssetCaptureCategory.json') {
			populateAssetCaptureCategory(data);
		}
		if (page == 'PlantGroupAndProcessGroupCodes.json') {
			populatePlantGroupAndProcessGroupCodes(data);
		}


	})
	.fail(function (data, status) {
		// alert( "error:"+status+":"+data );
	})
}

function populateEGIandNameCodeMapping(EGIandNameCodeMappingData) {
	var sqlstatement = "";

	opMessage("Deleting Existing EGIandNameCodeMapping");
	sqlstatement += 'DELETE FROM EGIandNameCodeMapping;';
	opMessage("Loading " + EGIandNameCodeMappingData.EGIandNameCodeMapping.length + " records");

	for (var cntx = 0; cntx < EGIandNameCodeMappingData.EGIandNameCodeMapping.length ; cntx++) {
		sqlstatement += 'INSERT INTO EGIandNameCodeMapping (ZASCAT ,ZDEFPG,ZZEQPT_EGI ,ZZFL_NC,ZZW_WW) VALUES ( ' +
		'"' + EGIandNameCodeMappingData.EGIandNameCodeMapping[cntx].ZASCAT + '",' +
		'"' + EGIandNameCodeMappingData.EGIandNameCodeMapping[cntx].ZDEFPG + '",' +
		'"' + EGIandNameCodeMappingData.EGIandNameCodeMapping[cntx].ZZEQPT_EGI + '",' +
		'"' + EGIandNameCodeMappingData.EGIandNameCodeMapping[cntx].ZZFL_NC + '",' +
		'"' + EGIandNameCodeMappingData.EGIandNameCodeMapping[cntx].ZZW_WW + '");';
	}

	html5sql.process(sqlstatement,
			function () {
		opMessage("Success - Finished Loading EGIandNameCodeMapping");
	},
	function (error, statement) {
		opErrorMessage("Error: " + error.message + " when processing " + statement);
	}
	);

}
function populateManufacturer(ManufacturerData) {
	var sqlstatement = "";

	opMessage("Deleting Existing Manufacturer");
	sqlstatement += 'DELETE FROM Manufacturer;';
	opMessage("Loading " + ManufacturerData.Manufacturer.length + " records");

	for (var cntx = 0; cntx < ManufacturerData.Manufacturer.length ; cntx++) {
		sqlstatement += 'INSERT INTO Manufacturer (MANUFACTURER) VALUES ( ' +
		'"' + ManufacturerData.Manufacturer[cntx].MANUFACTURER + '");';
	}

	html5sql.process(sqlstatement,
			function () {
		opMessage("Success - Finished Loading Manufacturer");
		//   SetLastSyncDetails('LASTSYNC_REFERENCE');
		//  setSyncingIndicator(false)
	},
	function (error, statement) {
		opErrorMessage("Error: " + error.message + " when processing " + statement);
	}
	);
}
function populateModel(ModelData) {

	var sqlstatement = "";

	opMessage("Deleting Existing Model");
	sqlstatement += 'DELETE FROM Model;';
	opMessage("Loading " + ModelData.Model.length + " Model records");

	var myarray = [{ 'sql': 'DELETE FROM MODEL', 'data': [] }];

	for (var cntx = 0; cntx < ModelData.Model.length ; cntx++) {
		myarray.push({ 'sql': 'INSERT INTO Model (EQART ,HERST,MODEL) VALUES  (?, ?,?)', 'data': [ModelData.Model[cntx].EQART, ModelData.Model[cntx].HERST, ModelData.Model[cntx].MODEL] })
	}
	opMessage("Success - Built Model array - " + myarray.length + " rows");
	html5sql.process(
			myarray
			,
			function () {
				opMessage("Success - Finished Loading Model");
				SetLastSyncDetails('LASTSYNC_REFERENCE');
				setSyncingIndicator(false)
			},
			function (error, statement) {
				opErrorMessage("Error: " + error.message + " when processing " + statement);
			}
	);
}
function populateEquipmentTypeCode(EquipmentTypeCodeData) {
	var sqlstatement = "";

	opMessage("Deleting Existing EquipmentTypeCode");
	sqlstatement += 'DELETE FROM EquipmentTypeCode;';
	opMessage("Loading " + EquipmentTypeCodeData.EquipmentTypeCode.length + " records");

	var myarray = [{ 'sql': 'DELETE FROM EquipmentTypeCode', 'data': [] }];

	for (var cntx = 0; cntx < EquipmentTypeCodeData.EquipmentTypeCode.length ; cntx++) {
		myarray.push({
			'sql': 'INSERT INTO EquipmentTypeCode (EARTX ,ZATCODE,ZOTDEF,ZOTDEF_EXT,ZOTDESC,ZZEQPT_EGI) VALUES  (?, ?,?,?,?,?)', 'data':
				[EquipmentTypeCodeData.EquipmentTypeCode[cntx].EARTX, EquipmentTypeCodeData.EquipmentTypeCode[cntx].ZATCODE,
					EquipmentTypeCodeData.EquipmentTypeCode[cntx].ZOTDEF, EquipmentTypeCodeData.EquipmentTypeCode[cntx].ZOTDEF_EXT,
					EquipmentTypeCodeData.EquipmentTypeCode[cntx].ZOTDESC, EquipmentTypeCodeData.EquipmentTypeCode[cntx].ZZEQPT_EGI
					]
		})
	}

	html5sql.process(
			myarray
			,
			function () {
				opMessage("Success - Finished Loading EquipmentTypeCode");
			},
			function (error, statement) {
				opErrorMessage("Error: " + error.message + " when processing " + statement);
			}
	);
}
function populateAssetTypeCodes(AssetTypeCodesData) {
	var sqlstatement = "";

	opMessage("Deleting Existing AssetTypeCodes");
	sqlstatement += 'DELETE FROM AssetTypeCodes;';
	opMessage("Loading " + AssetTypeCodesData.AssetTypeCodes.length + " records");

	var myarray = [{ 'sql': 'DELETE FROM AssetTypeCodes', 'data': [] }];

	for (var cntx = 0; cntx < AssetTypeCodesData.AssetTypeCodes.length ; cntx++) {
		myarray.push({
			'sql': 'INSERT INTO AssetTypeCodes (ZATCODE ,ZATDEF1,ZATDEF2,ZATDESC) VALUES  (?,?,?,?)', 'data':
				[AssetTypeCodesData.AssetTypeCodes[cntx].ZATCODE, AssetTypeCodesData.AssetTypeCodes[cntx].ZATDEF1,
					AssetTypeCodesData.AssetTypeCodes[cntx].ZATDEF2, AssetTypeCodesData.AssetTypeCodes[cntx].ZATDESC
					]
		})
	}

	html5sql.process(
			myarray,
			function () {
				opMessage("Success - Finished Loading AssetTypeCodes");
			},
			function (error, statement) {
				opErrorMessage("Error: " + error.message + " when processing " + statement);
			}
	);
}
function populateFunctionTypeCodes(FunctionTypeCodesData) {
	var sqlstatement = "";

	opMessage("Deleting Existing FunctionTypeCodes");
	sqlstatement += 'DELETE FROM FunctionTypeCodes;';
	opMessage("Loading " + FunctionTypeCodesData.FunctionTypeCodes.length + " records");

	var myarray = [{ 'sql': 'DELETE FROM FunctionTypeCodes', 'data': [] }];

	for (var cntx = 0; cntx < FunctionTypeCodesData.FunctionTypeCodes.length ; cntx++) {
		myarray.push({
			'sql': 'INSERT INTO FunctionTypeCodes (EARTX ,ZATCODE,ZNCDEF,ZNCDEF_EXT,ZNCDESC,ZZFL_NC) VALUES  (?,?,?,?,?,?)', 'data':
				[FunctionTypeCodesData.FunctionTypeCodes[cntx].EARTX, FunctionTypeCodesData.FunctionTypeCodes[cntx].ZATCODE,
					FunctionTypeCodesData.FunctionTypeCodes[cntx].ZNCDEF, FunctionTypeCodesData.FunctionTypeCodes[cntx].ZNCDEF_EXT,
					FunctionTypeCodesData.FunctionTypeCodes[cntx].ZNCDESC, FunctionTypeCodesData.FunctionTypeCodes[cntx].ZZFL_NC
					]
		})
	}

	html5sql.process(
			myarray,
			function () {
				opMessage("Success - Finished Loading FunctionTypeCodes");

			},
			function (error, statement) {
				opErrorMessage("Error: " + error.message + " when processing " + statement);
			}
	);
}
function populatePlantGroupCodes(PlantGroupCodesData) {
	var sqlstatement = "";

	opMessage("Deleting Existing PlantGroupCodes");
	sqlstatement += 'DELETE FROM PlantGroupCodes;';
	opMessage("Loading " + PlantGroupCodesData.PlantGroupCodes.length + " records");

	var myarray = [{ 'sql': 'DELETE FROM PlantGroupCodes', 'data': [] }];

	for (var cntx = 0; cntx < PlantGroupCodesData.PlantGroupCodes.length ; cntx++) {
		myarray.push({
			'sql': 'INSERT INTO PlantGroupCodes (ZPLGDEF1 ,ZPLGDEF2,ZPLGDESC,ZPLGRP,ZZW_WW) VALUES  (?,?,?,?,?)', 'data':
				[PlantGroupCodesData.PlantGroupCodes[cntx].ZPLGDEF1, PlantGroupCodesData.PlantGroupCodes[cntx].ZPLGDEF2,
					PlantGroupCodesData.PlantGroupCodes[cntx].ZPLGDESC, PlantGroupCodesData.PlantGroupCodes[cntx].ZPLGRP,
					PlantGroupCodesData.PlantGroupCodes[cntx].ZZW_WW
					]
		})
	}

	html5sql.process(
			myarray,
			function () {
				opMessage("Success - Finished Loading PlantGroupCodes");
				//SetLastSyncDetails('LASTSYNC_REFERENCE');
				//setSyncingIndicator(false)
			},
			function (error, statement) {
				opErrorMessage("Error: " + error.message + " when processing " + statement);
			}
	);
}
function populateSystemCodes(SystemCodesData) {
	var sqlstatement = "";

	opMessage("Deleting Existing SystemCodes");
	sqlstatement += 'DELETE FROM SystemCodes;';
	opMessage("Loading " + SystemCodesData.SystemCodes.length + " records");

	var myarray = [{ 'sql': 'DELETE FROM SystemCodes', 'data': [] }];

	for (var cntx = 0; cntx < SystemCodesData.SystemCodes.length ; cntx++) {
		myarray.push({
			'sql': 'INSERT INTO SystemCodes (ZSYSCODE ,ZSYSDEF1,ZSYSDEF2,ZZSYSDESC) VALUES  (?,?,?,?)', 'data':
				[SystemCodesData.SystemCodes[cntx].ZSYSCODE, SystemCodesData.SystemCodes[cntx].ZSYSDEF1,
					SystemCodesData.SystemCodes[cntx].ZSYSDEF2, SystemCodesData.SystemCodes[cntx].ZSYSDESC
					]
		})
	}

	html5sql.process(
			myarray,
			function () {
				opMessage("Success - Finished Loading SystemCodes");
			},
			function (error, statement) {
				opErrorMessage("Error: " + error.message + " when processing " + statement);
			}
	);
}
function populateAssetCaptureCategory(AssetCaptureCategoryData) {
	var sqlstatement = "";

	opMessage("Deleting Existing AssetCaptureCategory");
	sqlstatement += 'DELETE FROM AssetCaptureCategory;';
	opMessage("Loading " + AssetCaptureCategoryData.AssetCaptureCategory.length + " records");

	var myarray = [{ 'sql': 'DELETE FROM AssetCaptureCategory', 'data': [] }];

	for (var cntx = 0; cntx < AssetCaptureCategoryData.AssetCaptureCategory.length ; cntx++) {
		myarray.push({
			'sql': 'INSERT INTO AssetCaptureCategory (ZASCAT ,ZATCODE,ZSYSCODE) VALUES  (?,?,?)', 'data':
				[AssetCaptureCategoryData.AssetCaptureCategory[cntx].ZASCAT, AssetCaptureCategoryData.AssetCaptureCategory[cntx].ZATCODE,
					AssetCaptureCategoryData.AssetCaptureCategory[cntx].ZSYSCODE
					]
		})
	}

	html5sql.process(
			myarray,
			function () {
				opMessage("Success - Finished Loading AssetCaptureCategory");
				//SetLastSyncDetails('LASTSYNC_REFERENCE');
				//setSyncingIndicator(false)
			},
			function (error, statement) {
				opErrorMessage("Error: " + error.message + " when processing " + statement);
			}
	);
}
function populatePlantGroupAndProcessGroupCodes(PlantGroupAndProcessGroupCodesData) {
	var sqlstatement = "";

	opMessage("Deleting Existing PlantGroupAndProcessGroupCodes");
	sqlstatement += 'DELETE FROM PlantGroupAndProcessGroupCodes;';
	opMessage("Loading " + PlantGroupAndProcessGroupCodesData.PlantGroupAndProcessGroupCodes.length + " records");

	var myarray = [{ 'sql': 'DELETE FROM PlantGroupAndProcessGroupCodes', 'data': [] }];

	for (var cntx = 0; cntx < PlantGroupAndProcessGroupCodesData.PlantGroupAndProcessGroupCodes.length ; cntx++) {
		myarray.push({
			'sql': 'INSERT INTO PlantGroupAndProcessGroupCodes (ZPLGRP ,ZPRG,ZZW_WW) VALUES  (?,?,?)', 'data':
				[PlantGroupAndProcessGroupCodesData.PlantGroupAndProcessGroupCodes[cntx].ZPLGRP, PlantGroupAndProcessGroupCodesData.PlantGroupAndProcessGroupCodes[cntx].ZPRG,
					PlantGroupAndProcessGroupCodesData.PlantGroupAndProcessGroupCodes[cntx].ZZW_WW
					]
		})
	}

	html5sql.process(
			myarray,
			function () {
				opMessage("Success - Finished Loading PlantGroupAndProcessGroupCodes");
			},
			function (error, statement) {
				opErrorMessage("Error: " + error.message + " when processing " + statement);
			}
	);
}

function createJobAddWork(orderno , opno , specreqt, startdate, assignment, wktycd, wktygp, longtext, state)
{
	console.log("createJobAddWork");

	html5sql.process("INSERT INTO  MyJobAddWork (orderno , opno , specreqt, startdate, assignment, wktycd, wktygp, longtext, state) VALUES ("+
			"'"+orderno+"','"+opno+"','"+specreqt+ "','"+startdate+"','"+assignment+"','"+wktycd+"','"+wktygp+"','"+longtext+"','"+state+"');",
			function(){


		console.log("createJobAddWork DONE");
	},
	function(error, statement){
		console.log("Error: " + error.message + " when CreateAddWork processing " + statement);
		opErrorMessage("Error: " + error.message + " when CreateAddWork processing " + statement);
	}
	);
}

function createMyJobsDir() {

    window.resolveLocalFileSystemURL(cordova.file.externalRootDirectory + "Documents/", function (fileEntry) {
        fileEntry.getDirectory("MyJobs", { create: true, exclusive: false },
        		function (dir) {
        		    console.log("MyJobs Directory Created");
        		}, function (error) {
        		    console.log("error Creating MyJobs: " + error);
        		});
    }, function (error) {
        opErrorMessage('Cannot Resolve Device Storage - Error =' + error.code);
    });


}

function loadConfigValues(){
	sap.ui.getCore().getElementById('configServer').setValue(localStorage.getItem('ServerName'))
	sap.ui.getCore().getElementById('configSAPClient').setValue(localStorage.getItem('SAPClient'))
	sap.ui.getCore().getElementById('configSAPSystem').setValue(localStorage.getItem('SAPSystem'))
	sap.ui.getCore().getElementById('configReferenceFrequency').setValue(localStorage.getItem('SyncReferenceFrequency'))
	sap.ui.getCore().getElementById('configTransactionalFrequency').setValue(localStorage.getItem('SyncTransactionalFrequency'))
	sap.ui.getCore().getElementById('configUploadFrequency').setValue(localStorage.getItem('SyncUploadFrequency'))
	sap.ui.getCore().getElementById("configDebugUsername").setValue(localStorage.getItem('DebugUsername'));
   
    sap.ui.getCore().getElementById('configDebugPassword').setValue(localStorage.getItem('DebugPassword'));
    sap.ui.getCore().getElementById('configDebugTokenValidity').setValue(localStorage.getItem('DebugTokenValidity'));
	
    if(localStorage.getItem('Trace')=="ON"||AzureServerName == 'https://aws-amp-mob-int-01.azurewebsites.net'){
		sap.ui.getCore().getElementById('configLogState').setState(true)
	}else{
		sap.ui.getCore().getElementById('configLogState').setState(false)
	}
	
}
var formDBReset = new sap.m.Dialog("dlgDBReset",{
    title:"Database Reset are you sure?",
    modal: true,
    contentWidth:"1em",
    buttons: [
				new sap.m.Button("dlgDBResetYes", {
				    text: "Yes",
				    type: 	sap.m.ButtonType.Accept,
				    tap: [ function(oEvt) {		  
				    	
				    	formDBReset.close()				    	
				    	emptyTables() 
						  } ]
				}),
				new sap.m.Button("dlgDBReseCancel", {
				    text: "No",
				    type: 	sap.m.ButtonType.Reject,
				    tap: [ function(oEvt) {		  
						 
				    	formDBReset.close()
						  } ]
				})
				],					

content:[

        
 
         
         ]
 })
var formAdminPW = new sap.m.Dialog("dlgAdminPW",{
    title:"Sync Config",
    modal: true,
    contentWidth:"1em",
    buttons: [
				new sap.m.Button({
				    text: "Save",
				    type: 	sap.m.ButtonType.Accept,
				   tap: [ function(oEvt) {	
					 
					   if(sap.ui.getCore().getElementById('AdminDebugPassword').getValue().length<1){
						    sap.ui.getCore().getElementById('configDebugPassword').setValue("");
							sap.ui.getCore().getElementById('configDebugUsername').setValue("");
							sap.ui.getCore().getElementById('configDebugTokenValidity').setValue("");
							formAdminPW.close()
							
					   }else if(sap.ui.getCore().getElementById('AdminDebugPassword').getValue()==getAdminPW())
							{
							sap.ui.getCore().getElementById('configDebugPassword').setValue(sap.ui.getCore().getElementById('AdminDebugPassword').getValue());
							sap.ui.getCore().getElementById('configDebugUsername').setValue(sap.ui.getCore().getElementById('AdminDebugUsername').getValue().toUpperCase());
							sap.ui.getCore().getElementById('configDebugTokenValidity').setValue(sap.ui.getCore().getElementById('AdminDebugTokenValidity').getValue());
							formAdminPW.close()
							}
					   else{
								  sap.m.MessageBox.show("The Admin Password is incorrect", {
								         icon: sap.m.MessageBox.Icon.ERROR ,
								         title: "Admin Error",
								         actions: [sap.m.MessageBox.Action.OK],
							  			 onClose: function(oAction){
							  				
							  				
							  			 }
								       }
								     );	
							}
					    
											
						
					   
						} ]
				}),   
				new sap.m.Button({
				    text: "Cancel",
				    type: 	sap.m.ButtonType.Reject,
				    tap: [ function(oEvt) {		  
						 
				    	formAdminPW.close()
						  } ]
				}),
               
               
				],					
    content:[
 			new sap.ui.layout.form.SimpleForm("adminpwForm",{
				minWidth : 1024,
				maxContainerCols : 2,
				content : [
							
			                new sap.m.Label({text:"Admin Password"}),
							new sap.m.Input("AdminDebugPassword",{type: sap.m.InputType.Password}),
							new sap.m.Label({ text: "SAP User" }),
							new sap.m.Input("AdminDebugUsername", { type: sap.m.InputType.Input }),
							new sap.m.Label({ text: "Azure Token Validity" }),
							new sap.m.Input("AdminDebugTokenValidity", { type: sap.m.InputType.Input }),
							 new sap.m.Label({text:""}),
							 new sap.m.Button({
				                    text: "Azure Logout",
				                    type: sap.m.ButtonType.Accept,
				                    tap: [function (oEvt) {
				                        logoutazure();
				                    }]
				                }),
							 new sap.m.Button({
				                    text: "Reset DB",
				                    type: sap.m.ButtonType.Reject,
				                    tap: [function (oEvt) {
				                    	formAdminPW.close()
								    	formDBReset.open();
				                    }]
				                }),
						]
 					})

            ],
            beforeOpen: function (oEvt) {
            	sap.ui.getCore().getElementById('AdminDebugPassword').setValue("")
            	sap.ui.getCore().getElementById('AdminDebugUsername').setValue("")
            	sap.ui.getCore().getElementById('AdminDebugTokenValidity').setValue("")
        	}
 });
function saveTheConfig(){
	if(sap.ui.getCore().getElementById('configLogState').getState()){
		SetConfigParam("TRACE", 'ON');
	}else{
		SetConfigParam("TRACE", 'OFF');
	}
    
	SetConfigParam("SYNC_REFERENCE_FREQUENCY", sap.ui.getCore().getElementById('configReferenceFrequency').getValue());
	SetConfigParam("SYNC_TRANSACTIONAL_FREQUENCY", sap.ui.getCore().getElementById('configTransactionalFrequency').getValue());
	SetConfigParam("SYNC_UPLOAD_FREQUENCY",sap.ui.getCore().getElementById('configUploadFrequency').getValue());
	SetConfigParam("SERVERNAME",sap.ui.getCore().getElementById('configServer').getValue());
	SetConfigParam("SAPCLIENT",sap.ui.getCore().getElementById('configSAPClient').getValue());
	SetConfigParam("SAPSYSTEM",sap.ui.getCore().getElementById('configSAPSystem').getValue());
	SetConfigParam("DEBUGPASSWORD", sap.ui.getCore().getElementById('configDebugPassword').getValue());  
    SetConfigParam("DEBUGUSERNAME", sap.ui.getCore().getElementById('configDebugUsername').getValue());
    SetConfigParam("DEBUGTOKENVALIDITY", sap.ui.getCore().getElementById('configDebugTokenValidity').getValue());
}
var formConfig = new sap.m.Dialog("dlgConfig",{
    title:"Sync Config",
    modal: true,
    contentWidth:"1em",
    buttons: [
				new sap.m.Button("dlgConfigSave", {
				    text: "Save",
				    type: 	sap.m.ButtonType.Accept,
				   tap: [ function(oEvt) {		
					   

					    
				        if(sap.ui.getCore().getElementById('configDebugPassword').getValue()==getAdminPW()){
							  sap.m.MessageBox.show("Reset Database\nAre you sure", {
							         icon: sap.m.MessageBox.Icon.ERROR ,
							         title: "Change Mobile User",
							         actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
						  			 onClose: function(oAction){
						  				
						  				 if(oAction=="YES"){
						  					formConfig.close();
						  					saveTheConfig();
						  					resetTables(sap.ui.getCore().getElementById('configServer').getValue(),
						  							    sap.ui.getCore().getElementById('configDebugPassword').getValue(),
						  							    sap.ui.getCore().getElementById('configDebugUsername').getValue(),
						  							    sap.ui.getCore().getElementById('configDebugTokenValidity').getValue()
						  							)
						  					
						  				 }
						  			 }
							       }
							     );
						   
					   }else{
						    sap.ui.getCore().getElementById('configDebugPassword').setValue("");
							sap.ui.getCore().getElementById('configDebugUsername').setValue("");
							sap.ui.getCore().getElementById('configDebugTokenValidity').setValue("");
							
						   saveTheConfig(); 
						   formConfig.close()
					   }
					   
					  } ]
				}),   
				new sap.m.Button("dlgConfigCancel", {
				    text: "Cancel",
				    type: 	sap.m.ButtonType.Reject,
				    tap: [ function(oEvt) {		  
						 
				    	formConfig.close()
						  } ]
				})
				],					
    content:[
 			new sap.ui.layout.form.SimpleForm("settingsForm",{
				minWidth : 1024,
				maxContainerCols : 2,
				content : [
   // 						new sap.m.Button({
   // 						    text: "Test Azure 1",
   // 						    type: sap.m.ButtonType.Accept,
   // 						    tap: [function (oEvt) {
   // 						        requestAzureData("ZGW_MAM30_001_GET_JOB_DETAILS", localStorage.getItem('MobileUser')) //AZURE

   // 						        var myjson = {};
   // 						        myjson["Message"] = "";
   // 						        myjson["UserStatus"] = "E0014";
   // 						        myjson["EquipNo"] = "1099";
							        
   // 						        postAzureData("ZGW_EQSTATUS_UPDATE", myjson)

   // 						        var myjson = {};
   // 						        myjson["Message"] = "";
   // 						        myjson["MessageType"] = "";
   // 						        myjson["ReportedBy"] = "TEST_MOBILE3";
   // 						        myjson["EqStatus"] = "3";
   // 						        myjson["NotifTyp"] = "Z9";
   // 						        myjson["OrderId"] = "30529820";
   // 						        myjson["Equipment"] = "1371391";
   // 						        myjson["ShortText"] = "Test GW Service";
   // 						        myjson["StartDate"] = "14.12.2016";
   // 						        myjson["StartTime"] = "10:43:00";
   // 						        myjson["EndDate"] = "15.12.2016";
   // 						        myjson["EndTime"] = "10:43:00";
   // 						        postAzureData("ZGW_MAM30_011_CREATE_NEW_JOB", myjson)

   ////<d:MessageType/>
   ////<d:Message/>
   ////<d:ActctivityCodeGrp/>
   ////<d:ActivityCode/>
   ////<d:ActivityText/>
   ////<d:PriorityType/>
   ////<d:Priority/>
   ////<d:ReportedBy>SMUNJEWAR2</d:ReportedBy>
   ////<d:Assignment/>
   ////<d:SpecReqt/>
   ////<d:AssigTome/>
   ////<d:UserId/>
   ////<d:EqStatus>3</d:EqStatus>
   ////<d:Breakdown/>
   ////<d:NotifTyp>Z9</d:NotifTyp>
   ////<d:OrderId>30529820</d:OrderId>
   ////<d:FuncLoc/>
   ////<d:Equipment>1371391</d:Equipment>
   ////<d:CodeGroup/>
   ////<d:Code/>
   ////<d:ShortText>Test GW Service</d:ShortText>
   ////<d:longText/>
   ////<d:StartDate>14.12.2016</d:StartDate>
   ////<d:StartTime>10:43:00</d:StartTime>
   ////<d:EndDate>15.12.2016</d:EndDate>
   ////<d:EndTime>10:43:00</d:EndTime>
   ////<d:ActCatTyp/>
   ////<d:NotifNo/>

   // 						        postAzureData("ZGW_EQSTATUS_UPDATE", myjson)

   // 						    }]
   // 						}),
			                new sap.m.Label({text:"Server"}),
							new sap.m.Input("configServer",{type: sap.m.InputType.Input}),
							new sap.m.Label({text:"SAP System (RFC Name)",visible:false}),
							new sap.m.Input("configSAPSystem",{type: sap.m.InputType.Input,visible:false}),
			                new sap.m.Label({text:"SAP Client",visible:false}),
							new sap.m.Input("configSAPClient",{type: sap.m.InputType.Input,visible:false}),
							new sap.m.Label({text:"Sync Reference Frequency"}),
							new sap.m.Input("configReferenceFrequency",{type: sap.m.InputType.Input}),
					        new sap.m.Label({text:"Sync Transactional Frequency"}),
							new sap.m.Input("configTransactionalFrequency",{type: sap.m.InputType.Input}),
							new sap.m.Label({text:"Sync Upload Frequency"}),
							new sap.m.Input("configUploadFrequency",{type: sap.m.InputType.Input}),
							new sap.m.Label({ text: "Mobile user" }),
							new sap.m.Input("configDebugUsername", { type: sap.m.InputType.Input,enabled:false}),
							
							new sap.m.Button( {
							    text: "Admin",
							    type: 	sap.m.ButtonType.Accept,
							    tap: [ function(oEvt) {		  
							    	formAdminPW.open()
									  } ]
							}),
                            
							new sap.m.Input("configDebugPassword", { type: sap.m.InputType.Password,enabled:false}),
							new sap.m.Input("configDebugTokenValidity", { type: sap.m.InputType.Input ,enabled:false}),
							new sap.m.Label({text:"Logging"}),
							new sap.m.Switch('configLogState',{
								state: true,
								type: sap.m.SwitchType.AcceptReject
							}),
							new sap.m.Button("deleteLog", {
							    text: "Delete",
							    type: 	sap.m.ButtonType.Reject,
							    tap: [ function(oEvt) {		  
									DeleteLog()
									  } ]
							}),
						
					  
						]
 					})

            ]
 });

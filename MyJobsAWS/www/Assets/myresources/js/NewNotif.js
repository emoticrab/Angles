var xmlDoc="";
var sites=[];
var plants=[];
var assets=[];
var SearchMode=""
var selectedAssetSearchSite="";
var selectedAssetSearchGroup="";
var selectedAssetSearchType="";
var newEQField = 			new sap.m.Input("NewEquipment",{ type: sap.m.InputType.Input,
			// icon:"images//barcode.png",
			 //showValueHelp: true,
			valueHelpRequest: [function(event){
				//Scan()
			
			}], change: function (event) {//changes for CREOL
			    if (this.getValue() == "") {
			        sap.ui.getCore().byId("Euipmentlabel").setVisible(false);
			        sap.ui.getCore().byId("Equipment_status").setVisible(false);
			    }
			    else {
			        if (localStorage.getItem('EmployeeScenario') == "Y005" || localStorage.getItem('EmployeeScenario') == "Y008") {
			            sap.ui.getCore().byId("Euipmentlabel").setVisible(true);
			            sap.ui.getCore().byId("Equipment_status").setVisible(true);
			        }
			    }
			    //end of changes
			}});
		//newEQField._getValueHelpIcon().setSrc("sap-icon://bar-code");
var formNewNotif = new sap.m.Dialog("dlgNewNotif",{
    title:"Raise New Job",
    modal: true,
    contentWidth:"1em",
    buttons: [
					new sap.m.Button( {
					    text: "Save",
					    type: 	sap.m.ButtonType.Accept,
					    tap: [ function(oEvt) {	
					        var error = "";
					        var equipment_status;//changes for CREOL
					    	if(sap.ui.getCore().byId("NewType").getSelectedItem().getKey()=="NOTSELECTED"){
					    		error="NotificationType,";
					    	}
					    	else if(sap.ui.getCore().byId("NewGroup").getSelectedItem().getKey()=="NOTSELECTED"){
					    		error+="GroupType,";
					    	}
					    	else if(sap.ui.getCore().byId("NewCode").getSelectedItem().getKey()=="NOTSELECTED"){
					    		error+="CodeType,";
					    	}
					    	else if(sap.ui.getCore().byId("NewPriority").getSelectedItem().getKey()=="NOTSELECTED"){
					    		error+="Priority,";
					    	}
					    	if(sap.ui.getCore().byId("NewNotifStart").getValue()==""){
					    		error+="StartDate,";
					    	}
					    	if((sap.ui.getCore().byId("NewFuncLoc").getValue()||sap.ui.getCore().byId("NewEquipment").getValue())==""){
					    		error+="Functional Location or Equipment number,";
					    	}
					    	if(sap.ui.getCore().byId("NewDescription").getValue()==""){
					    		error+="Description,";
					    	}
					        //changes for CREOL
					    	if (sap.ui.getCore().byId("Equipment_status").getVisible()) {
					    	    if (sap.ui.getCore().byId("Equipment_status").getSelectedItem().getKey() == "NOTSELECTED") {
					    	        error += "EquipmentStatus,";
					    	        equipment_status = "";
					    	    }
					    	    else {
					    	        equipment_status = sap.ui.getCore().byId("Equipment_status").getSelectedItem().getKey();
					    	    }
					    	}//end of changes
					    	if(error){
					    		var n=error.lastIndexOf(",");
					    	    var a=error.substring(0,n); 
					    	
					    		DisplayErrorMessage("Create Job - Error", "Please enter Notification type, Group Type , Code Type, Priority, Start Date, Description,Equipment Status,\n (Functional Location or Equipment Number).");
					    	}
					    	else{
					    	//alert(sap.ui.getCore().byId("NewType").getSelectedItem().getKey()+"--"+sap.ui.getCore().byId("NewGroup").getSelectedItem().getKey()+"--"+sap.ui.getCore().byId("NewCode").getSelectedItem().getKey())
					    	var xntype=sap.ui.getCore().byId("NewType").getSelectedItem().getKey().split("|")
					    	var xgroup=sap.ui.getCore().byId("NewGroup").getSelectedItem().getKey().split("|")
					    	var xcode=sap.ui.getCore().byId("NewCode").getSelectedItem().getKey().split("|")
					    	var xpriority=sap.ui.getCore().byId("NewPriority").getSelectedItem().getKey().split("|")
					    	var employeeno=sap.ui.getCore().byId("NewAssignToUser").getSelectedItem().getKey().split("|");
					    	var SpecialReq;
					    	if(employeeno=="NOTSELECTED"){
					    		 SpecialReq="";
					    		 employeeno[0]="";
					    	}
					    	else{
					    		SpecialReq="X";
					    	}
					    	ndate=convertEODDate(sap.ui.getCore().getElementById('NewNotifStart').getValue() + " 00:00:00").split(" ") 
					    	//alert(ndate+"caaaaac"+sap.ui.getCore().getElementById('NewNotifStart').getValue());
					    	//if(sap.ui.getCore().byId("NewDescription").getValue().length>0){
					    		createNotification(xntype[0],xpriority[0],xgroup[1],xcode[0],sap.ui.getCore().byId("NewGroup").getSelectedItem().getText(),
										sap.ui.getCore().byId("NewCode").getSelectedItem().getText(),sap.ui.getCore().byId("NewDescription").getValue(),
										sap.ui.getCore().byId("NewDetails").getValue(),
										ndate[0], ndate[1],
										sap.ui.getCore().byId("NewFuncLoc").getValue(),
										sap.ui.getCore().byId("NewEquipment").getValue(),employeeno[0],SpecialReq,sap.ui.getCore().byId("NewAssignToMe").getState(),equipment_status)


											formNewNotif.close()
										/*}else{
											DisplayErrorMessage("Create Job - Error", "Description is Mandatory")
										}*/
					    	}
							
							  } ]
					   
					}),   
					new sap.m.Button( {
					    text: "Cancel",
					    type: 	sap.m.ButtonType.Reject,
					    tap: [ function(oEvt) {		  
							 
					    	formNewNotif.close()} ]   
					})
					],					
    content:[
 			new sap.ui.layout.form.SimpleForm({
				minWidth : 1024,
				maxContainerCols : 2,
				content : [
								
								
								new sap.m.Label({text:"Notification Type"}),
								new sap.m.Select('NewType',{
									
									items: [
										
									],

									change: function(oControlEvent) {
										
										BuildPriorities(oControlEvent.getParameter("selectedItem").getKey());
									}
								}),
								new sap.m.Label({text:"Work Type Group"}),
								new sap.m.Select('NewGroup',{
									
									items: [
										
									],

									change: function(oControlEvent) {
										BuildCodes(oControlEvent.getParameter("selectedItem").getKey());
										
									}
								}),
								new sap.m.Label({text:"Work Type Code"}),
								new sap.m.Select('NewCode',{
									
									items: [
										
									],

									change: function(oControlEvent) {
										
									}
								}),
								
								new sap.m.Label({text:"Priority"}),
								new sap.m.Select('NewPriority',{
									
									items: [
										
									],

									change: function(oControlEvent) {
										//jQuery.sap.log.info("Event fired: 'change' value property to " + oControlEvent.getParameter("selectedItem") + " on " + this);
									}
								}),
								new sap.m.Label({text: "Start Date"}),
								
								new sap.m.DatePicker('NewNotifStart',{
									width : "99%",
									displayFormat : "dd-MM-yyyy",
									valueFormat : "yyyy-MM-dd",
									type : "Date",
									dateValue : new Date()
								}),
								new sap.m.Label({text:"Description"}),
								new sap.m.Input("NewDescription",{ type: sap.m.InputType.Input}),
								
								new sap.m.Label({text:"Details"}),
								new sap.m.TextArea("NewDetails",{ rows: 5,height:"100px",}),

			new sap.m.Label({text:"Functional Location"}),
			new sap.m.SearchField("NewFuncLoc",{
				tooltip: "Search for Functional Locations..",
				
				search: [function(event){
						SearchMode="NOTIF";
						flag="";
							formSearchAssetEditUpdate.open();
							
						//selectedFloc="LGF"
				 		//buildFlocList("LGF");
				 		//formSelectFloc.open()
					
				}]}),

			
			new sap.m.Label({text:"Equipment",
				}),
				 newEQField, Status_label, Equipment_status,	//added the two fields for CREOL									
				new sap.m.Label("NewAssignToMe_label",{visible:false,text:"Assign to me"}),
				new sap.m.Switch("NewAssignToMe",{
					visible:false,
					state: false,
					customTextOn:"Yes",
					customTextOff:"No",
					change: function(evt){

				    }
				}) ,
				new sap.m.Label('NewAssignToUser_label',{visible:false,text:"Assign To User"}),
				new sap.m.Select('NewAssignToUser',{
					visible:false,
					items: [
						
					],

					change: function(oControlEvent) {
						//jQuery.sap.log.info("Event fired: 'change' value property to " + oControlEvent.getParameter("selectedItem") + " on " + this);
					}
				}),
							]
 					})
 					

            ],
	contentWidth:"60%",
	contentHeight: "70%",
	beforeOpen:function(){
		BuildNotificationTypes() 
		BuildNotificationUsers()
		ShowHideAssigntoME()
		ShowHideAssigntoUser()
		sap.ui.getCore().byId("NewDescription").setValue('');
		sap.ui.getCore().byId("NewDetails").setValue('');
		
		sap.ui.getCore().byId("NewFuncLoc").setValue('');
		sap.ui.getCore().byId("NewEquipment").setValue('');
		sap.ui.getCore().byId("NewType").setSelectedKey("NOTSELECTED");
		sap.ui.getCore().byId("NewGroup").setSelectedKey("NOTSELECTED");
		sap.ui.getCore().byId("NewCode").setSelectedKey("NOTSELECTED");
		sap.ui.getCore().byId("NewPriority").setSelectedKey("NOTSELECTED");
		sap.ui.getCore().byId("Equipment_status").setSelectedKey("NOTSELECTED");//changes for CREOL
      },
      afterOpen:function(){
    	  document.getElementById("NewNotifStart-inner").disabled=true;
      }
	 })

function ShowHideAssigntoME(){
	var SQLStatement="";
	SQLStatement="select * from MyJobsParams where name = 'ASSIGNTOME' and key2 = '"+localStorage.getItem('EmployeeScenario')+"'"
	html5sql.process(SQLStatement,
			 function(transaction, results, rowsArray){
		if(rowsArray.length>0){
			item = rowsArray[0];
			if(item.value == "YES"){
				sap.ui.getCore().getElementById("NewAssignToMe").setVisible(true);
				sap.ui.getCore().getElementById("NewAssignToMe_label").setVisible(true);
			}
			else{
				sap.ui.getCore().getElementById("NewAssignToMe").setVisible(false);
				sap.ui.getCore().getElementById("NewAssignToMe_label").setVisible(false);
			}
		}			
			 },
			 function(error, statement){
				
			 }        
			);
}
function ShowHideAssigntoUser(){
	var SQLStatement="";
	SQLStatement="select * from MyJobsParams where name = 'ASSIGNTOUSER' and key2 = '"+localStorage.getItem('EmployeeScenario')+"'"
	html5sql.process(SQLStatement,
			 function(transaction, results, rowsArray){
		if(rowsArray.length>0){
			item = rowsArray[0];
			if(item.value == "YES"){
				sap.ui.getCore().getElementById("NewAssignToUser_label").setVisible(true);
				sap.ui.getCore().getElementById("NewAssignToUser").setVisible(true);
			}
			else{
				sap.ui.getCore().getElementById("NewAssignToUser_label").setVisible(false);
				sap.ui.getCore().getElementById("NewAssignToUser").setVisible(false);
			}
		}			
			 },
			 function(error, statement){
				
			 }        
			);
}

function BuildNotificationUsers(){

	var HTMLToOutput='';

	var SQLStatement="";
	var FirstVal="";
	
		SQLStatement="select * from MyRefUsers where workcenter = '"+localStorage.getItem('EmployeeWorkCenter')+"'"	
		sap.ui.getCore().getElementById("NewAssignToUser").destroyItems();
	sap.ui.getCore().getElementById("NewAssignToUser").addItem(
	new sap.ui.core.Item({
		key: "NOTSELECTED", 
		text: "Please Select"
	}))
	
		html5sql.process(SQLStatement,
		 function(transaction, results, rowsArray){
				//alert(rowsArray.length)
				for (var n = 0; n < rowsArray.length; n++) {
					item = rowsArray[n];
					sap.ui.getCore().getElementById("NewAssignToUser").addItem(
							new sap.ui.core.Item({
								key: item.employeeno+"|"+item.notifprofile+"|"+item.priotype, 
								text: item.lastname+", "+item.firstname+" ("+item.userid+")"
							}))
							
					
				}
					
				
		 },
		 function(error, statement){
			
		 }        
		);

	}
function BuildNotificationTypes(){

	var HTMLToOutput='';

	var SQLStatement="";
	var FirstVal="";
	SQLStatement="SELECT * from refnotificationtypes where level_number = '2'"
	
		sap.ui.getCore().getElementById("NewType").destroyItems();
	sap.ui.getCore().getElementById("NewType").addItem(
	new sap.ui.core.Item({
		key: "NOTSELECTED", 
		text: "Please Select"
	}))
		html5sql.process(SQLStatement,
		 function(transaction, results, rowsArray){
				//alert(rowsArray.length)
				for (var n = 0; n < rowsArray.length; n++) {
					item = rowsArray[n];
					sap.ui.getCore().getElementById("NewType").addItem(
							new sap.ui.core.Item({
								key: item.notiftype+"|"+item.notifprofile+"|"+item.priotype, 
								text: item.notifdesc
							}))
					
				}
					
				
		 },
		 function(error, statement){
			
		 }        
		);

	}
function BuildPriorities(selectedId){
	
	var x = selectedId.split("|")
	var priority_type = x[2];
	var profile=x[1];
		var HTMLToOutput='';

		var SQLStatement="";
		var FirstVal="";
		SQLStatement="SELECT * "
		SQLStatement+="from MyRefPriorityTypes "
		SQLStatement+="where type = '"+priority_type+"'"
		var HTMLToOutput="";
			html5sql.process(SQLStatement,
			 function(transaction, results, rowsArray){
				
				sap.ui.getCore().getElementById("NewPriority").destroyItems();
				sap.ui.getCore().getElementById("NewPriority").addItem(
						new sap.ui.core.Item({
							key: "NOTSELECTED", 
							text: "Please Select"
						}))
					for (var n = 0; n < rowsArray.length; n++) {
						item = rowsArray[n];
						sap.ui.getCore().getElementById("NewPriority").addItem(
								new sap.ui.core.Item({
									key: item.priority,
									text: item.description
								}))
					}
				BuildGroups(profile)
					
			 },
			 function(error, statement){
				
			 }        
			);

		}
		function BuildGroups(profile){



			var SQLStatement="";
			var FirstVal="";
			
			SQLStatement="SELECT *  "
			SQLStatement+="from refpaicodes "
			SQLStatement+="where level = '1'  and catalogue = 'W' and stsma = '"+profile+"' and work_cntr= '"+localStorage.getItem('EmployeeWorkCenter')+"'"
			var HTMLToOutput="";
				html5sql.process(SQLStatement,
				 function(transaction, results, rowsArray){

						sap.ui.getCore().getElementById("NewGroup").destroyItems();
						sap.ui.getCore().getElementById("NewCode").destroyItems();
						sap.ui.getCore().getElementById("NewGroup").addItem(
								new sap.ui.core.Item({
									key: "NOTSELECTED", 
									text: "Please Select"
								}))
						for (var n = 0; n < rowsArray.length; n++) {
							item = rowsArray[n];
							sap.ui.getCore().getElementById("NewGroup").addItem(
									new sap.ui.core.Item({
										key: profile+"|"+item.codegrp,
										text: item.kurztext_group
									}))
						}
						
				 },
				 function(error, statement){
					
				 }        
				);

			}
		function BuildCodes(Group){

			var HTMLToOutput='';

			var SQLStatement="";
			var res = Group.split("|")
			
			SQLStatement="SELECT *  "
			SQLStatement+="from refpaicodes "
			SQLStatement+="where level = '2'  and catalogue = 'W' and stsma = '"+res[0]+"' and codegrp = '"+res[1]+"'"
			var HTMLToOutput="";
				html5sql.process(SQLStatement,
				 function(transaction, results, rowsArray){

						sap.ui.getCore().getElementById("NewCode").destroyItems();
						sap.ui.getCore().getElementById("NewCode").addItem(
								new sap.ui.core.Item({
									key: "NOTSELECTED", 
									text: "Please Select"
								}))
						
						for (var n = 0; n < rowsArray.length; n++) {
							item = rowsArray[n];
							sap.ui.getCore().getElementById("NewCode").addItem(
									new sap.ui.core.Item({
										key: item.code,
										text: item.kurztext_code
									}))
						}
				 },
				 function(error, statement){
					
				 }        
				);

			}
		var aAlreadyAddedProducts7 = [];
		var oSuggestTableInput7=new sap.m.Input("sugtableinput7", {
			placeholder: "Site Name - Please Start Typing",
			showValueHelp: true,
			showTableSuggestionValueHelp: false,
			showSuggestion: true,
			type: sap.m.InputType.Input,
			valueHelpRequest: function (oEvent) {
				//sap.m.MessageBox.alert("Value help requested");
			},
			suggestionItemSelected: function(oEvent){
				var oItem = oEvent.getParameter("selectedRow");
				//alert("sap.m.Input id " + this.getId() + " with suggestion: selected item text is " + oItem.getCells()[0].getText()+":"+oItem.getCells()[1].getText());
				BuildAssetPlantGroups(oItem.getCells()[0].getText());
			},
			suggest: function(oEvent){
				var sValue = oEvent.getParameter("suggestValue"),
					oSuggestionRow;

				
				
				setTimeout(function () {
					// remove old columns
					oSuggestTableInput7.removeAllSuggestionColumns();
					oSuggestTableInput7.addSuggestionColumn(new sap.m.Column({
						styleClass : "name",
						hAlign : "Begin",
						header : new sap.m.Label({
							text : "Site"
						})
					}),
					new sap.m.Column({
						styleClass : "name",
						hAlign : "Begin",
						visible: false,
						header : new sap.m.Label({
							text : "plant"
						})
					}))
					
					
					//alert(sites.length)
					for(var i=0;sites.length; i++){
					
						if(jQuery.inArray(sites[i], aAlreadyAddedProducts7) < 0 && jQuery.sap.startsWithIgnoreCase(sites[i], sValue)){
						oSuggestionRow = oTableItemTemplate.clone();
							oSuggestionRow.getCells()[0].setText(sites[i]);
							
							
							oSuggestTableInput7.addSuggestionRow(oSuggestionRow);
							aAlreadyAddedProducts7.push(sites[i]);
					}
						
					}
				}, 500);
			}
		})
		var oTableItemTemplate = new sap.m.ColumnListItem({
			type : "Active",
			vAlign : "Middle",
			cells : [
				new sap.m.Label({
					text : "SITE"
				}),
				new sap.m.Label({
					text: "{qty}",
					wrapping : true
				}), new sap.m.Label({
					text: "{limit}"
				}), new sap.m.Label({
					text : "{price}"
				})
			]
		});
		/*var formSearchAsset = new sap.m.Dialog("dlgSearchAsset",{
		    title:"Search Assets",
		    modal: true,
		    contentWidth:"1em",
		    buttons: [
		  
		              new sap.m.Button( {
                          text: "Select",
                          type: sap.m.ButtonType.Accept,
                          tap: [ function(oEvt) {         
                                     
                        	  x=selectedAssetSearch.split(":")
                              
                              if(SearchMode=="NOTIF"){
                              	sap.ui.getCore().byId('NewFuncLoc').setValue(x[1])
                              	sap.ui.getCore().byId('NewEquipment').setValue(x[2])
                              }
                              if(SearchMode=="CLOSE"){
                            	
                              	sap.ui.getCore().byId('Close_FunctionalLocation').setValue(x[1])
                              	sap.ui.getCore().byId('Close_Equipment').setValue(x[2])
                              	}
                              formSearchAsset.close()
                              } ]   
                      }),
		                                  
new sap.m.Button( "BookToAsset",{
	visible:false,
    text: "Book To Asset",
    press:function(){
    	x=selectedAssetSearch.split(":");
    	 y=x[1].split("-");
   	  x[1]=y[0]+"-"+y[1]+"-"+y[2]
   	  x[2]=""
   		if(SearchMode=="NOTIF"){
          	sap.ui.getCore().byId('NewFuncLoc').setValue(x[1])
          	sap.ui.getCore().byId('NewEquipment').setValue(x[2])
          }
          if(SearchMode=="CLOSE"){
        	
          	sap.ui.getCore().byId('Close_FunctionalLocation').setValue(x[1])
          	sap.ui.getCore().byId('Close_Equipment').setValue(x[2])
          	}
          formSearchAsset.close()
    }
}),
		                                  new sap.m.Button( {
		                                      text: "Search",
		                                      type: sap.m.ButtonType.Accept,
		                                      tap: [ function(oEvt) {         
		                                                 
		                                    	  buildAssetTableRows()} ]   
		                                  }),
		                                  new sap.m.Button( {
		                                      text: "Cancel",
		                                      type: sap.m.ButtonType.Reject,
		                                      tap: [ function(oEvt) {         
		                                             
		                                         formSearchAsset.close()} ]   
		                                  })
		                                  ],                                
		    content:[assetSearchPanel
		                    ],
		             beforeOpen:function(){
		            	 sap.ui.getCore().getElementById('AssetSearchResults').destroyItems();
		            	 //populateSiteFilter();
		             populateSyncSiteDataHelpModel(); 
		            	 var SQLStatement="";
		            		SQLStatement="select * from MyJobsParams where name = 'BTP' and key2 = '"+localStorage.getItem('EmployeeScenario')+"'"
		            		html5sql.process(SQLStatement,
		            				 function(transaction, results, rowsArray){
		            			if(rowsArray.length>0){
		            				item = rowsArray[0];
		            				if(item.value == "YES"){
		            					sap.ui.getCore().getElementById("BookToAsset").setVisible(true); 
		            	     	 	   
		            				}
		            				else{
		            					sap.ui.getCore().getElementById("BookToAsset").setVisible(false);
		            				}
		            			}			
		            				 },
		            				 function(error, statement){
		            					
		            				 }        
		            				);
		            		
		             },
		        contentWidth:"85%",
		        contentHeight: "85%",
		       }).addStyleClass("sapUiSizeCompact");*/


		function showMessage(msg){
			sap.m.MessageToast.show(msg, {
				
				duration: Number(500),
				
				
				at: "center center",		
				autoClose: true,

			});

}
		


		function showMessage(msg){
			sap.m.MessageToast.show(msg, {
				
				duration: Number(500),
				
				
				at: "center center",		
				autoClose: true,

			});

}


		function BuildAssetSites(){
			
				sites=[]
				
				html5sql.process("Select Distinct site from AssetDetailsAll",
						 function(transaction, results, rowsArray){
							
						
								for (var n = 0; n < rowsArray.length; n++) {
									item = rowsArray[n];
									 var text= item.site;
						              
						              
						               if ($.inArray(text, sites)===-1){
						                   sites.push(text);
						               }
								}
							
								
						 },
						 function(error, statement){
							
						 }        
						);			



		}
		function LoadSites(){
			sap.ui.getCore().getElementById('AssetSite').destroyItems()
		    sap.ui.getCore().getElementById('AssetGroup').destroyItems()
		    sap.ui.getCore().getElementById('AssetType').destroyItems()
			   sites.sort();
			   selectedAssetSearchSite="ALL"
			   selectedAssetSearchGroup="ALL"
			   selectedAssetSearchType="ALL"
				   sap.ui.getCore().getElementById("AssetSite").addItem(
			                   new sap.ui.core.Item({
			                         key: "ALL",
			                         text: "Please Select Site"
			                   }))    
			   for (i=0;i<sites.length;i++)
			   {
			     
				    
			          sap.ui.getCore().getElementById("AssetSite").addItem(
			                           new sap.ui.core.Item({
			                                  key: sites[i],
			                                  text:  sites[i]
			                           }))   


			  
			   }
			   sap.ui.getCore().getElementById("AssetGroup").addItem(
			                     new sap.ui.core.Item({
			                           key: "ALL",
			                           text: "ALL"
			                     })) 
			                        sap.ui.getCore().getElementById("AssetType").addItem(
			                                         new sap.ui.core.Item({
			                                                key: "ALL",
			                                                text: "ALL"
			                                         })) 


		}

		function BuildAssetPlantGroups(site){
		if(site=="ALL"){
			selectedAssetSearchSite=site
			return
		}
		sap.ui.getCore().getElementById('AssetSearchResults').destroyItems();	
		sap.ui.getCore().getElementById('AssetGroup').destroyItems()
        sap.ui.getCore().getElementById('AssetType').destroyItems()
        selectedAssetSearchSite=site;
		selectedAssetSearchGroup="ALL"
        selectedAssetSearchType="ALL"
        plants=[]
		html5sql.process("Select * from AssetDetailsAll where site = '"+site+"'",
				 function(transaction, results, rowsArray){
					
				
						for (var n = 0; n < rowsArray.length; n++) {
							item = rowsArray[n];
							 var text= item.plgrpdesc;
				              
				              
				               if ($.inArray(text, plants)===-1){
				            	   plants.push(text);
				               }
						}
						 plants.sort();
						  sap.ui.getCore().getElementById("AssetGroup").addItem(
				                   new sap.ui.core.Item({
				                         key: "ALL",
				                         text: "ALL"
				                   }))
				          sap.ui.getCore().getElementById("AssetType").addItem(
					                                       new sap.ui.core.Item({
					                                              key: "ALL",
					                                              text: "ALL"
					                                       })) 
						 for (i=0;i<plants.length;i++)
						 {
						    
						
						        sap.ui.getCore().getElementById("AssetGroup").addItem(
						                         new sap.ui.core.Item({
						                                key: plants[i],
						                                text: plants[i]
						                         }))   
						
						
						
						 }
						
				 },
				 function(error, statement){
					
				 }        
				);				
		

					                    	                
                	
					
					 
	
		       
		}
		
		function BuildAssetTypes(AssetGroup){

     		      selectedAssetSearchGroup=AssetGroup;
     		      selectedAssetSearchType="ALL"
    		       sap.ui.getCore().getElementById('AssetType').destroyItems()
    		       		html5sql.process("Select distinct eqtypedesc from AssetDetailsAll where site = '"+selectedAssetSearchSite+"' and plgrpdesc = '"+AssetGroup+"'",
				
    		       			
    		       				function(transaction, results, rowsArray){
    		       		
    		       			sap.ui.getCore().getElementById("AssetType").addItem(
                                    new sap.ui.core.Item({
                                           key: "ALL",
                                           text: "ALL"
                                    })) 
				
						for (var n = 0; n < rowsArray.length; n++) {
							item = rowsArray[n];
							 var text= item.eqtypedesc;
							 sap.ui.getCore().getElementById("AssetType").addItem(
			                         new sap.ui.core.Item({
			                                key: text,
			                                text: text
			                         }))     
				              
				              
						}
						
						
				 },
				 function(error, statement){
					alert(error+statement)
				 }        
				);	
    		       
    		       
    		       
    		       
					
			 

		}

		function BuildAssetSearchResults(type){
		       selectedAssetSearchType=type;
		}

		function showAssetSearchResults(){
			
		       var flocs=[]
		       var flocdets=[];
		       var TestGroup=""
		    	   var TestType=""
		    		   if(selectedAssetSearchSite=="ALL"){
		    				
		    				return
		    			}
		       var opTable = sap.ui.getCore().getElementById('AssetSearchResults');
               x=selectedAssetSearchSite.split(":")
		       sap.ui.getCore().getElementById('AssetSearchResults').destroyItems();
               
               
               
               sql= "select * from AssetDetailsAll where site = '"+selectedAssetSearchSite+"'"
               if (selectedAssetSearchGroup!="ALL"){
            	   sql+=" and plgrpdesc = '"+selectedAssetSearchGroup+"'"
               }
               if (selectedAssetSearchType!="ALL"){
            	   sql+=" and eqtypedesc = '"+selectedAssetSearchType+"'"
               }

	       		html5sql.process(sql,
	    				
		       			
	       				function(transaction, results, rowsArray){
	       		
	       		
		
				for (var n = 0; n < rowsArray.length; n++) {
                    opTable.addItem (new sap.m.ColumnListItem("Asset"+n+":"+rowsArray[n].floc+":"+rowsArray[n].eq,{
                        
                        cells : 
                               [
                               new sap.m.Text({text: rowsArray[n].plgrpdesc}),
                               new sap.m.Text({text: rowsArray[n].assdesc}),  
                               new sap.m.Text({text: rowsArray[n].floc}),
                               new sap.m.Text({text: rowsArray[n].flocdesc}), 
                               new sap.m.Text({text: rowsArray[n].eqdesc}),
                               new sap.m.Text({text: rowsArray[n].manufacturer}),
                               new sap.m.Text({text: rowsArray[n].partno}) 
                               ]
                        }));
				}
				
		 },
		 function(error, statement){
			alert(error+statement)
		 }        
		);            
               
               
               
		}
		
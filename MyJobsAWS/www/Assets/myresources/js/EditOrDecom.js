var flag="";
var formSearchAssetEditUpdate = new sap.m.Dialog("dlgSearchAssetEditUpdate", {
    title: "Search Assets",
    modal: true,
    contentWidth: "1em",
    buttons: [

              new sap.m.Button("ButtonSelect_AssetListEditUpdate", {
                  enabled: false,
                  text: "Select",
                  type: sap.m.ButtonType.Accept,
                  tap: [function (oEvt) {
                      
                      formSearchAssetEditUpdate.close();
                      //x=selectedAssetSearch.split(":")
                      
                      if(SearchMode=="NOTIF"){
                    	  
                      	sap.ui.getCore().byId('NewFuncLoc').setValue(currentAssetRecord.funcLocStringZINSTLOCN);
                      	sap.ui.getCore().byId('NewEquipment').setValue(currentAssetRecord.EQUNR);
                      //changes for CREOL
                      	if(sap.ui.getCore().byId('NewEquipment').getValue()==""){
            				sap.ui.getCore().byId("Euipmentlabel").setVisible(false);
            				sap.ui.getCore().byId("Equipment_status").setVisible(false);
            			}
            			else{
            				if(localStorage.getItem('EmployeeScenario')=="Y005"||localStorage.getItem('EmployeeScenario')=="Y008"){
            					sap.ui.getCore().byId("Euipmentlabel").setVisible(true);
            					sap.ui.getCore().byId("Equipment_status").setVisible(true);
            				}
            			}
                      	//end of changes
                      }
                      if(SearchMode=="CLOSE"){
                    	
                      	sap.ui.getCore().byId('Close_FunctionalLocation').setValue(currentAssetRecord.funcLocStringZINSTLOCN);
                      	sap.ui.getCore().byId('Close_Equipment').setValue(currentAssetRecord.EQUNR);
                    	//changes for CREOL
                      	if(sap.ui.getCore().byId('Close_Equipment').getValue()==""){
             				sap.ui.getCore().byId("CloseEuipmentlabel").setVisible(false);
             				sap.ui.getCore().byId("CloseEquipment_status").setVisible(false);
             			}
             			else{
             				if(localStorage.getItem('EmployeeScenario')=="Y005"||localStorage.getItem('EmployeeScenario')=="Y008"){
             					sap.ui.getCore().byId("CloseEuipmentlabel").setVisible(true);
             					sap.ui.getCore().byId("CloseEquipment_status").setVisible(true);
             				}
             			}//end of changes
                      	}
                      if(flag=="Edit"){
                    	  inputChooseAssetEditOrDecom.setValue(currentAssetRecord.zinsLocDesc);
                          labelFuncLocStringEditOrDecom.setText(currentAssetRecord.funcLocStringZINSTLOCN);
                          formEditOrDecom.open();
                          ValidateControlsEditOrDecom();
                          flag="";
                      }
                      
                  }]
              }),
              new sap.m.Button( "BookToAsset",{
            		visible:false,
            	    text: "Book To Plant",
            	    press:function(){
            	    	/*x=selectedAssetSearch.split(":");
            	    	 y=x[1].split("-");
            	   	  x[1]=y[0]+"-"+y[1]+"-"+y[2]
            	   	  x[2]=""*/
            	   		if(SearchMode=="NOTIF"){
            	   			var a=currentAssetRecord.funcLocStringZINSTLOCN.split("-");
            	   			var b= a[0]+"-"+a[1]+"-"+a[2];
            	          	sap.ui.getCore().byId('NewFuncLoc').setValue(b);
            	          	sap.ui.getCore().byId('NewEquipment').setValue("");
            	        	//changes for CREOL
            	          	sap.ui.getCore().byId("Euipmentlabel").setVisible(false);
            				sap.ui.getCore().byId("Equipment_status").setVisible(false);
            				//end of changes
            	          }
            	          if(SearchMode=="CLOSE"){
            	        	var c=currentAssetRecord.funcLocStringZINSTLOCN.split("-");
              	   			var d= c[0]+"-"+c[1]+"-"+c[2];
            	          	sap.ui.getCore().byId('Close_FunctionalLocation').setValue(d);
            	          	sap.ui.getCore().byId('Close_Equipment').setValue("");
            	          	//changes for CREOL
            				sap.ui.getCore().byId("CloseEuipmentlabel").setVisible(false);
            				sap.ui.getCore().byId("CloseEquipment_status").setVisible(false);
            				//end of changes
            	          	}
            	          formSearchAssetEditUpdate.close()
            	    }
            	}),
                                  new sap.m.Button( {
                                      
                                      text: "Search",
                                      type: sap.m.ButtonType.Accept,
                                      tap: [function (oEvt) {

                                          buildAssetTableRowsAssetListEditUpdate()
                                      }]
                                  }),
                                  new sap.m.Button({
                                      text: "Cancel",
                                      type: sap.m.ButtonType.Reject,
                                      tap: [function (oEvt) {

                                          formSearchAssetEditUpdate.close()
                                      }]
                                  })
    ],
    content: [assetSearchPanelAssetListEditUpdate
    ],
    beforeOpen: function () {
       // sap.ui.getCore().getElementById('AssetSearchResultsAssetListEditUpdate').destroyItems();
        //populateSiteFilter();
    	
        populateHelpModelAssetListEditUpdate();
       if(flag!=="Edit"){
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
		if(SearchMode=="CLOSE"){
			clearAssetEditUpdateSearch("CLOSE");
		}
		else if(SearchMode=="NOTIF"){
			clearAssetEditUpdateSearch("EDIT");
		}
       }
       else{
    	   sap.ui.getCore().getElementById("BookToAsset").setVisible(false);
    	   clearAssetEditUpdateSearch("EDIT");
       }
		
    },
    contentWidth: "85%",
    contentHeight: "85%",
}).addStyleClass("sapUiSizeCompact");

var oMatrixEditOrDecom = new sap.ui.commons.layout.MatrixLayout({
    id: "MatrixEditOrDecom",
    layoutFixed: true,
    columns: 3,
    width: '790px',
    widths: ['120px', '120px', '550px']
});

var space = new sap.ui.commons.layout.AbsoluteLayout({
    width: "10px",
    height: "0px"
});

var labelFuncLocStringEditOrDecom = new sap.m.Label({
    text: ""
})

var labelChooseAssetEditOrDecom = new sap.m.Label({
    text: "Choose Asset"
})

var labelChooseAssetEditOrDecom1 = new sap.m.Label({
    text: "Choose Asset"
})


var buttonChooseAssetEditOrDecom = new sap.m.Button(
		"buttonChooseAsset_EditOrDecom", {
		    text: "Select Asset",
		    enabled: true,
		    type: sap.m.ButtonType.Accept,
		    tap: [function (oEvt) {
		    	flag="Edit";
		        formSearchAssetEditUpdate.open();
		    }]
		})

var inputChooseAssetEditOrDecom = new sap.m.Input("inputChooseAsset_EditOrDecom", {
 //   width: "450px",
    type: sap.m.InputType.Input,
    enabled: false
});



//oMatrixEditOrDecom.createRow(new sap.m.Label({ text: "1" }), new sap.m.Label({ text: "2" }), new sap.m.Label({ text: "3" }),
//		new sap.m.Label({ text: "4" }), new sap.m.Label({ text: "5" }));

// oCreateAssetMatrix.createRow(createAssetSiteCell1,createAssetSiteCell2,new
// sap.m.Label({text : ""}),createAssetSiteCell3,createAssetSiteCell4);
oMatrixEditOrDecom.createRow(new sap.m.Label({ text: " " }));
oMatrixEditOrDecom.createRow(new sap.m.Label({ text: "" }), new sap.m.Label({ text: "" }), labelFuncLocStringEditOrDecom);
oMatrixEditOrDecom.createRow(new sap.m.Label({ text: " " }));

oMatrixEditOrDecom.createRow(labelChooseAssetEditOrDecom, buttonChooseAssetEditOrDecom, inputChooseAssetEditOrDecom);

var formEditOrDecom = new sap.m.Dialog("form_EditOrDecom", {
    title: "Edit or Decommission Asset",
    subHeader: new sap.m.Bar({
        contentMiddle: [new sap.m.Label({text:"Step 1 of 4"})],
    }),
    horizontalScrolling: true,
    verticalScrolling: true,
    modal: true,
    contentWidth: "1em",

    buttons: [
			new sap.m.Button({
			    text: "Cancel",
			    icon: "sap-icon://sys-cancel",
			    type: sap.m.ButtonType.Reject,
			    tap: [function (oEvt) {
			        formEditOrDecom.close()
			        getAssets();
			    }
			    ]
			}), new sap.m.Button("buttonDecom_EditOrDecom", {
                enabled:false,
			    text: "Decom",
			    type: sap.m.ButtonType.Accept,
			    tap: [function (oEvt) {
			        formDecomAsset.open();
			        
			    }]
			}),
            , new sap.m.Button("buttonEdit_EditOrDecom", {
                enabled: false,
                text: "Edit",
                type: sap.m.ButtonType.Accept,
                tap: [function (oEvt) {
                    action = recordAction.EDIT;
                        sap.ui.getCore().byId("labelSite").setVisible(false);
                        InputCreateAssetSite.setVisible(false);
                        
                        checkMakeExists();
                        if (!makeExists) {
                            currentAssetRecord.newMake = currentAssetRecord.make;
                            currentAssetRecord.make = "NOT LISTED";
                            
                        }
                        
                        checkModelExists();
                        if (!modelExists) {
                            currentAssetRecord.newModel = currentAssetRecord.model;
                            currentAssetRecord.model = "NOT LISTED";
                           
                        }

                    formCreateAsset.open();
                }]
            })

    ],
    content: [oMatrixEditOrDecom],
    contentWidth: "860px",
    contentHeight: "200px",
    beforeOpen: function () {
    },
    afterOpen: function () {
        
    },
    beforeClose: function () {
    }
})

function ValidateControlsEditOrDecom() {
    if (inputChooseAssetEditOrDecom.getValue() == "") {

        sap.ui.getCore().getElementById("buttonDecom_EditOrDecom").setEnabled(false);
        sap.ui.getCore().getElementById("buttonEdit_EditOrDecom").setEnabled(false);
    }
    else {
        sap.ui.getCore().getElementById("buttonDecom_EditOrDecom").setEnabled(true);
        sap.ui.getCore().getElementById("buttonEdit_EditOrDecom").setEnabled(true);
    }
}
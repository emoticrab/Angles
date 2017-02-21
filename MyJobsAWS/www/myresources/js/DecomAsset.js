var oDecomAssetMatrix = new sap.ui.commons.layout.MatrixLayout({
	id : "DecomAssetMatrix",
	layoutFixed : true,
	columns : 4,
	width : '850px',
	widths : [ '210px','350px','20px', '300px']
});

//oDecomAssetMatrix.createRow(new sap.m.Label({ text: "1" }), new sap.m.Label({ text: "2" }), new sap.m.Label({ text: "3" }),  new sap.m.Label({ text: "4" }));

//row1
oDecomAssetMatrix.createRow(new sap.m.Label(),new sap.m.Label(),new sap.m.Label(),new sap.m.Label({text : "Comments"}));

var labelDecomAssetFuncLocDesc = new sap.m.Label({ text: "Functional Location Description" })
var inputZinsLocDescDecomAsset = new sap.m.Input("input_ZinsLocDescDecomAsset",
		{
		    width: "350px",
		    type: sap.m.InputType.Input,
		    enabled: false
		});
//currentAssetRecord.zinsLocDesc
//row2
var oRow = new sap.ui.commons.layout.MatrixLayoutRow();
oDecomAssetMatrix.addRow(oRow);

var oCell = new sap.ui.commons.layout.MatrixLayoutCell({});//col1
oCell.addContent(labelDecomAssetFuncLocDesc);
oRow.addCell(oCell);

var oCell = new sap.ui.commons.layout.MatrixLayoutCell();//col2 
oCell.addContent(inputZinsLocDescDecomAsset);
oRow.addCell(oCell);

oRow.addCell(new sap.ui.commons.layout.MatrixLayoutCell());//col3

var oCell = new sap.ui.commons.layout.MatrixLayoutCell({colSpan : 1,rowSpan : 3});         //col4
var textCommentDecomAsset = new sap.m.TextArea("DecomAssettext_Comment", {
    maxLength: 500,
    rows: 8, width: "270px", liveChange: [function (event) {
        calculateRemainingCharacterCountDecomAsset();
    }]
})
oCell.addContent(textCommentDecomAsset);
oRow.addCell(oCell);

//row3
var oRow = new sap.ui.commons.layout.MatrixLayoutRow();
oDecomAssetMatrix.addRow(oRow);

var oCell = new sap.ui.commons.layout.MatrixLayoutCell({});//col1
oCell.addContent(new sap.m.Label({ text: "Decommission Action" }));
oRow.addCell(oCell);

var DecomAssetFilterDecomAction = new sap.m.Select('DecomAssetFilter_DecomAction', {
    width: "350px",
    change: function () {
        onDecomAssetFilterChanged();
    }
});
var oCell = new sap.ui.commons.layout.MatrixLayoutCell({});//col2
oCell.addContent(DecomAssetFilterDecomAction);
oRow.addCell(oCell);

var charactersRemainingLabelDecomAsset = new sap.m.Label({ text: "" });
oDecomAssetMatrix.createRow(new sap.m.Label({ text: "" }));
oDecomAssetMatrix.createRow(new sap.m.Label({ text: "" }), new sap.m.Label({ text: "" }), new sap.m.Label({ text: "" }), charactersRemainingLabelDecomAsset);


var formDecomAsset = new sap.m.Dialog("form_DecomAsset",{
    subHeader: new sap.m.Bar({
        contentMiddle: [new sap.m.Label("DecomAssetfuncLocHeader", {
            text: ""
        })],
    }),
    horizontalScrolling:true,
    verticalScrolling:true,
    modal: true,
    contentWidth:"1em",

    buttons: [
					new sap.m.Button( {
					    text: "Cancel",
					    icon:"sap-icon://sys-cancel",
					    type: sap.m.ButtonType.Reject,
					    tap: [ function(oEvt) {	
					        formDecomAsset.close();
					    	} ]   
					}),
					new sap.m.Button("formDecomAsset_Decom" ,{
					    text: "Decommission",
                        enabled: false,
					    icon:"",
					    type: sap.m.ButtonType.Accept,
					    tap: [function (oEvt) {
					        showMessageConfirm("Decommission Asset",
                       "You have chosen to decommission an asset. Please confirm your requirement by clicking OK. If you do not with to decommission this asset select Abort to return to the previous screen.", decomRecord);
					    }
					    ]   
					}),
					new sap.m.Button("formDecomAsset_DecomAndReplace", {
					    text: "Decommission & Replace",
					    enabled: false,
					    icon: "",
					    type: sap.m.ButtonType.Accept,
					    tap: [function (oEvt) {
					        showMessageConfirm("Decommission Asset",
                                                 "You have chosen to decommission an asset. Please confirm your requirement by clicking OK. If you do not with to decommission this asset select Abort to return to the previous screen.", decomReplaceRecord);
					     }
					    ]
					})

    ],

    content:[
oDecomAssetMatrix
            ],
            contentWidth:"1024px",
            contentHeight: "99%",
            beforeOpen: function () { populateDecomAssetControls(); },
	  
      afterOpen:function(){  
          DecomAssetSetDefaultValues();
	  } ,
	  beforeClose:function(){
		  try {
			 
		  }catch(err)
		  {}
	  }
	
	 })

function populateDecomAssetControls()
{
    populateDecomAssetFilterDecomAction();
    
    sap.ui.getCore().getElementById("input_ZinsLocDescDecomAsset").setValue(currentAssetRecord.zinsLocDesc);
    sap.ui.getCore().getElementById("formDecomAsset_Decom").setEnabled(false);
    sap.ui.getCore().getElementById("formDecomAsset_DecomAndReplace").setEnabled(false);
			}

function DecomAssetConfirmCancel(title, msg) {

    sap.m.MessageBox.show(msg, {
        icon: sap.m.MessageBox.Icon.WARNING,
        title: title,
        actions: [sap.m.MessageBox.Action.OK, sap.m.MessageBox.Action.ABORT],
        onClose: function (oAction) {

            if (oAction == "OK") {
                formDecomAsset.close();
            }
        }
    }
           );
}
function DecomAssetSetDefaultValues() {
    sap.ui.getCore().getElementById("DecomAssetfuncLocHeader").setText(currentAssetRecord.originalFuncLocStringZINSTLOCN);
    textCommentDecomAsset.setValue("");
}

function onDecomAssetFilterChanged()
{
    validateControlsDecomAsset();

}

function validateControlsDecomAsset() {
    if (DecomAssetFilterDecomAction.getSelectedItem().getKey() == "NOTSELECTED")
    {
        sap.ui.getCore().getElementById("formDecomAsset_Decom").setEnabled(false);
        sap.ui.getCore().getElementById("formDecomAsset_DecomAndReplace").setEnabled(false);
    }
    else {
        sap.ui.getCore().getElementById("formDecomAsset_Decom").setEnabled(true);
        sap.ui.getCore().getElementById("formDecomAsset_DecomAndReplace").setEnabled(true);
    }
}

function calculateRemainingCharacterCountDecomAsset() {

    var charCount = textCommentDecomAsset.getValue().length;
    var remainingCharCount;
    remainingCharCount = 500 - charCount;
    if (remainingCharCount < 0) { remainingCharCount = 0 }
    charactersRemainingLabelDecomAsset.setText("Remaining Characters Count: " + remainingCharCount);

}

var formDecomAssetSuccess = new sap.m.Dialog("form_DecomAssetSuccess", {
    horizontalScrolling: true,
    verticalScrolling: true,
    modal: true,
    contentWidth: "1em",
    buttons: [
new sap.m.Button("OK_formDecomAsset", {
    text: "OK",
    type: sap.m.ButtonType.Accept,
    tap: [function (oEvt) {
        action = recordAction.AFTERDECOM;
        sap.ui.getCore().byId("labelSite").setVisible(true);
        InputCreateAssetSite.setVisible(true);
        formDecomAsset.close();
        formDecomAssetSuccess.close();
        formCreateAsset.open();
    }]
})
					
    ],
    content: [
     new sap.m.Label({ text: "The asset has been decommissioned successfully" })
    ],
    contentWidth: "300px",
    contentHeight: "100px",
})

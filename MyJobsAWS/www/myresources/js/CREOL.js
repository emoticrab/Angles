

var Status_label = new sap.m.Label("Euipmentlabel", { text: "Equipment Status", visible: false });
var Equipment_status = new sap.m.Select('Equipment_status', {
    visible: false,
    items: [
        {
            key: "NOTSELECTED",
            text: "Please Select"
        }, {
            key: "E0013",
            text: "Equipment Offline"
        }, {
            key: "E0014",
            text: "Equipment Online"
        }, {
            key: "E0015",
            text: "Unserviceable"
        }
    ],

    change: function (oControlEvent) {

        //BuildPriorities(oControlEvent.getParameter("selectedItem").getKey());
    }
});
var CloseStatus_label = new sap.m.Label("CloseEuipmentlabel", { text: "Equipment Status", visible: false });
var CloseEquipment_status = new sap.m.Select('CloseEquipment_status', {
    visible: false,
    width: "250px",
    items: [
        {
            key: "NOTSELECTED",
            text: "Please Select"
        }, {
            key: "E0013",
            text: "Equipment Offline"
        }, {
            key: "E0014",
            text: "Equipment Online"
        }, {
            key: "E0015",
            text: "Unserviceable"
        }
    ],

    change: function (oControlEvent) {

        //BuildPriorities(oControlEvent.getParameter("selectedItem").getKey());
    }
});

function buildObjectList() {

    ///new array
    // {Code:"RIT",Description:"Insufficient time",SAPCode:"RIT-Insuff.Time",Visibility:"UC"},
    dat2 = [];
    for (var i = 2; i < demodatafordropdown.length; i++) {

        item = demodatafordropdown[i];
        if (item.Visibility == "UC") {
            var y = {};
            // var z = {};
            y.Code = demodatafordropdown[i].Code;
            y.Description = demodatafordropdown[i].Description;
            y.SAPCode = demodatafordropdown[i].SAPCode;
            y.Visibility = demodatafordropdown[i].Visibility;
            dat2.push(y);




        }



    }

    var sqlstatementObjectListdataId = "delete from MyObjectListData where sapcode is null and feedbackdesc is null and checked is null;";
    /// new array 
    html5sql.process("SELECT MyObjectList.* ,checked,feedbackdesc,sapcode,o.id as objectListdataId FROM MyObjectList left outer join MyObjectListdata o on MyObjectList.orderid=o.orderid and  trim(MyObjectList.counter)=trim(o.counter)  where MyObjectList.orderid = '" + CurrentOrderNo.replace(/^[0]+/g, "") + "' ;",
			 function (transaction, results, rowsArray) {
			     var n = 0;
			     var opTable = sap.ui.getCore().getElementById('BundledAssets');

			     opTable.destroyItems();
			     if (results.rows.length > 0) {
			         while (n < rowsArray.length) {
			            

			             if (rowsArray[n].equipment) {
			                 objectId = rowsArray[n].equipment;
			                 objectDesc = rowsArray[n].equidescr;
			             } else {
			                 objectId = rowsArray[n].functLoc;
			                 objectDesc = rowsArray[n].funcldescr;
			             }

			             if (rowsArray[n].objectListdataId) {
			             }
			             else {
			                 sqlstatementObjectListdataId += "INSERT INTO MyObjectListData (counter ,orderid) VALUES ('" + rowsArray[n].counter + "','" + CurrentOrderNo.replace(/^[0]+/g, "") + "');"
                         }

			             opTable.addItem(new sap.m.ColumnListItem("Obj:" + rowsArray[n].id, {

			                 cells:
                                 [
                            //  new sap.m.Text({ text: rowsArray[n].counter }),
                                new sap.m.Text({ text: objectId.replace(/^[0]+/g, "") }),
                               new sap.m.Text({ text: objectDesc }),
                                 new sap.m.CheckBox("check" + n, {
                                     selected: rowsArray[n].checked == 'true',
                                     select: function (evt) {
                                         var checkid = evt.getSource().sId.replace(/[^0-9]/g, '');
                                         populateFeedbackCodeDopdown(this.getSelected(), checkid)
                                         updateMyObjectList(checkid, "checked", evt.mParameters.selected);
                                     }
                                 }),
                                 new sap.m.Select("drop" + n, {
                                     placeHolder: "Please Select",
                                     change: function (oControlEvent) {
                                         var id = oControlEvent.getSource().sId.replace(/[^0-9]/g, '');
                                         var text = oControlEvent.getSource().getSelectedItem().mProperties.text.split("-");
                                         sap.ui.getCore().getElementById("text" + id).setText(text[1]);
                                         updateMyObjectList(id, "sapcode", this.getSelectedKey(), text[1]);
                                     }
                                 }),
                                             new sap.m.Text("text" + n, { text: "" })
                                 ],
			             }));
			             populateFeedbackCodeDopdown(rowsArray[n].checked == 'true', +n)
			             sap.ui.getCore().getElementById("drop" + n).setSelectedKey(rowsArray[n].sapcode)
			             sap.ui.getCore().getElementById("text" + n).setText(rowsArray[n].feedbackdesc);
			             n++;
			         }

			         if (sqlstatementObjectListdataId.length > 0) {
			             html5sql.process(sqlstatementObjectListdataId, function (transaction, results, rowsArray) {
			             },
                            function (error, statement) {
                                //outputLogToDB(); 
                            }
                           );
			         }



			     }
			     else {
			         sap.ui.getCore().byId("bundleasseticon").setVisible(false)
			     }
			 },
	 function (error, statement) {
	     //outputLogToDB(); 
	 }
	);


}

function buildObjectList_close() {

    ///new array
    // {Code:"RIT",Description:"Insufficient time",SAPCode:"RIT-Insuff.Time",Visibility:"UC"},
    dat2 = [];
    for (var i = 0; i < demodatafordropdown.length; i++) {

        item = demodatafordropdown[i];
        if (item.Visibility == "UC") {
            var y = {};
            // var z = {};
            y.Code = demodatafordropdown[i].Code;
            y.Description = demodatafordropdown[i].Description;
            y.SAPCode = demodatafordropdown[i].SAPCode;
            y.Visibility = demodatafordropdown[i].Visibility;
            dat2.push(y)
        }
    }

    var sqlstatementObjectListdataId = "";

    /// new array 
    html5sql.process("SELECT MyObjectList.* ,checked,feedbackdesc,sapcode,o.id as objectListdataId  FROM MyObjectList left outer join MyObjectListdata o on MyObjectList.orderid=o.orderid and  trim(MyObjectList.counter)=trim(o.counter)  where MyObjectList.orderid = '" + CurrentOrderNo.replace(/^[0]+/g, "") + "' ;",
			 function (transaction, results, rowsArray) {
			     var n = 0;
			     var opTable = sap.ui.getCore().getElementById('closeBundledAssets');

			     opTable.destroyItems();
			     if (results.rows.length > 0) {
			         while (n < rowsArray.length) {
			             //functLoc

			             if (rowsArray[n].equipment) {
			                 objectId = rowsArray[n].equipment;
			                 objectDesc = rowsArray[n].equidescr;
			             } else {
			                 objectId = rowsArray[n].functLoc;
			                 objectDesc = rowsArray[n].funcldescr;
			             }

			             if (rowsArray[n].objectListdataId) {
			             }
			             else {
			                 sqlstatementObjectListdataId = "delete from MyObjectListData where counter='" + rowsArray[n].counter  + "' and orderid = '" + CurrentOrderNo.replace(/^[0]+/g, "") + "';";
			                 sqlstatementObjectListdataId += "INSERT INTO MyObjectListData (counter ,orderid) VALUES ('" + rowsArray[n].counter + "','" + CurrentOrderNo.replace(/^[0]+/g, "") + "');"
			             }

			             opTable.addItem(new sap.m.ColumnListItem("Obj_:" + rowsArray[n].id, {

			                 cells:
                                 [
                                new sap.m.Text({ text: objectId.replace(/^[0]+/g, "") }),
                               new sap.m.Text({ text: objectDesc }),
                                 new sap.m.CheckBox("checkClose" + n, {
                                     selected: rowsArray[n].checked == 'true',
                                     select: function (evt) {
                                         var checkid = evt.getSource().sId.replace(/[^0-9]/g, '');
                                         populateFeedbackCodeDopdown(this.getSelected(), "Close" + checkid)
                                         updateMyObjectList(checkid, "checked", evt.mParameters.selected);
                                     }
                                 }),
                                 new sap.m.Select("dropClose" + n, {
                                     items: [
                                         {
                                             key: "NOTSELECTED",
                                             text: "Please Select"
                                         }

                                     ], change: function (oControlEvent) {
                                         var id = oControlEvent.getSource().sId.replace(/[^0-9]/g, '');
                                         var text = oControlEvent.getSource().getSelectedItem().mProperties.text.split("-");
                                         sap.ui.getCore().getElementById("textClose" + id).setText(text[1]);
                                         updateMyObjectList(id, "sapcode", this.getSelectedKey(), text[1]);
                                     }

                                 }),
                                             new sap.m.Text("textClose" + n, { text: "" })
                                 ],

			             }));
			             populateFeedbackCodeDopdown(rowsArray[n].checked == 'true', "Close" + n)
			             sap.ui.getCore().getElementById("dropClose" + n).setSelectedKey(rowsArray[n].sapcode)
			             sap.ui.getCore().getElementById("textClose" + n).setText(rowsArray[n].feedbackdesc);
			             n++;
			         }
			         if (sqlstatementObjectListdataId.length > 0) {
			             html5sql.process(sqlstatementObjectListdataId, function (transaction, results, rowsArray) {
			             },
                            function (error, statement) {
                                //outputLogToDB(); 
                            }
                           );
			         }
			     }
			     else {

			         //	sap.ui.getCore().byId("dg54icon").setVisible(false);
			     }


			 },
	 function (error, statement) {
	     //outputLogToDB(); 
	 }
	);


}
function populateFeedbackCodeDopdown(checked, checkid) {
    if (checked) {
        sap.ui.getCore().getElementById("drop" + checkid).destroyItems();
        for (var i = 0; i < demodatafordropdown.length; i++) {
            sap.ui.getCore().byId("text" + checkid).setText("");
            item = demodatafordropdown[i];

            if (item.Visibility == "C") {
                sap.ui.getCore().getElementById("drop" + checkid).addItem(
                        new sap.ui.core.Item({
                            key: item.SAPCode,
                            text: item.Code + "-" + item.Description
                        }))
            }
        }
    }
    else {
        sap.ui.getCore().byId("text" + checkid).setText("");
        sap.ui.getCore().getElementById("drop" + checkid).destroyItems();
        for (var i = 0; i < demodatafordropdown.length; i++) {
            item = demodatafordropdown[i];
            if (item.Visibility == "UC") {
                sap.ui.getCore().getElementById("drop" + checkid).addItem(
                         new sap.ui.core.Item({
                             key: item.SAPCode,
                             text: item.Code + "-" + item.Description
                         }))
            }
        }
    }
}
function updateMyObjectList(counter, type, val1, val2) {
    counter = +counter + +1;//go from zero based to 1 based
    if (type == 'sapcode') {
        if (val1 == false) {
            var sqlstatement = "UPDATE MyObjectListData  SET sapcode = null where rtrim(counter)='" + counter + "' AND orderid = '" + CurrentOrderNo.replace(/^[0]+/g, "") + "' ;"
        }
        else {
            var sqlstatement = "UPDATE MyObjectListData  SET sapcode = '" + val1 + "' ,feedbackdesc='" + val2 + "' where rtrim(counter)='" + counter + "' AND orderid = '" + CurrentOrderNo.replace(/^[0]+/g, "") + "' ;"
        }
    }
    else {
        if (val1 == false) {
            var sqlstatement = "UPDATE MyObjectListData  SET checked = null, sapcode = null where rtrim(counter)='" + counter + "' AND orderid = '" + CurrentOrderNo.replace(/^[0]+/g, "") + "' ;"
        }
        else {
            var sqlstatement = "UPDATE MyObjectListData  SET checked = 'true' where rtrim(counter)='" + counter + "' AND orderid = '" + CurrentOrderNo.replace(/^[0]+/g, "") + "' ;"
        }

    }

    html5sql.process(sqlstatement, function (transaction, results, rowsArray) {
    },
    function (error, statement) {
        //outputLogToDB(); 
    }
   );
}
function updateMyObjectListAll(val) {
    if (val == true) {
        var sqlstatement = "UPDATE MyObjectListData  SET sapcode =null,feedbackdesc=null, checked = 'true' WHERE checked is null AND orderid = '" + CurrentOrderNo.replace(/^[0]+/g, "") + "' ;"
    }
    else {
        var sqlstatement = "UPDATE MyObjectListData  SET sapcode =null ,feedbackdesc=null,checked = null WHERE checked is not null AND orderid = '" + CurrentOrderNo.replace(/^[0]+/g, "") + "' ;"
    }

    html5sql.process(sqlstatement, function (transaction, results, rowsArray) {
        buildObjectList_close();
    },
    function (error, statement) {
        //outputLogToDB(); 
    }
   );
}

function BundledAssetOKToClose(callback) {
    var sqlstatementOKToClose = "select o.id FROM MyObjectList left outer join MyObjectListdata o on MyObjectList.orderid=o.orderid and  trim(MyObjectList.counter)=trim(o.counter) where checked is null and feedbackdesc is null AND MyObjectList.orderid = '" + CurrentOrderNo.replace(/^[0]+/g, "") + "' ;"
    html5sql.process(sqlstatementOKToClose, function (transaction, results, rowsArray) {
            callback(rowsArray.length);
    },
        function (error, statement) {
            //outputLogToDB(); 
        }
       );
}
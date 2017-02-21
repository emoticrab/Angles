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
var CloseStatus_label = new sap.m.Label("CloseEuipmentlabel", { text: "Status", visible: false });
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
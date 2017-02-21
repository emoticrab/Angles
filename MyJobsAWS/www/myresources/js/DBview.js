var currentPage=1;
var rowsPerPage=20;
var totalRecords=0;
var selectedTableName="-TABLECOUNTS-";
var totalPages=1;
var TotalColumns;

function nextPage(){
	if (currentPage<totalPages){
		currentPage+=1;
		buildRows();
		}
		
}
function prevPage(){
	if (currentPage>1){
		currentPage-=1;
		buildRows();
		}

}
function lastPage(){
	if (currentPage<totalPages){
		currentPage=totalPages;
		buildRows();
		}

}
function firstPage(){
	
		currentPage=1;
		buildRows();


}
function buildDebugRowsxx(){

	var n = 0;
	var opTable = sap.ui.getCore().getElementById('DBTable');

	var startRec=(currentPage-1)*rowsPerPage;

	sap.ui.getCore().getElementById('pageDetails').setText(currentPage+" of "+totalPages)
	//alert('SELECT * FROM '+selectedTableName+' LIMIT '+startRec+', '+rowsPerPage+";")
		html5sql.process('SELECT * FROM '+selectedTableName+' LIMIT '+startRec+', '+rowsPerPage+";",
				 function(transaction, results, rowsArray){
					opTable.destroyItems();
				
					while (n < rowsArray.length) {
						
						item=rowsArray[n]
						opTable.addItem (new sap.m.ColumnListItem("tr"+n,{
							
							}));
						
						for (var prop in item) {
							if(item.hasOwnProperty(prop)){						
								sap.ui.getCore().getElementById("tr"+n).addCell(new sap.m.Text({text: item[prop]}))
								}
					        }
						
						
						n++;
					 }

				 },
				 function(error, statement){
					alert(error)
				 }        
				);	

		
	}
function buildRows(){

var n = 0;
var opTable = sap.ui.getCore().getElementById('DBTable');

var startRec=(currentPage-1)*rowsPerPage;

sap.ui.getCore().getElementById('pageDetails').setText(currentPage+" of "+totalPages)
sap.ui.getCore().getElementById('bFirst').setVisible(true)
sap.ui.getCore().getElementById('bPrev').setVisible(true)
sap.ui.getCore().getElementById('bNext').setVisible(true)
sap.ui.getCore().getElementById('bLast').setVisible(true)

//alert('SELECT * FROM '+selectedTableName+' LIMIT '+startRec+', '+rowsPerPage+";")
	html5sql.process('SELECT * FROM '+selectedTableName+' LIMIT '+startRec+', '+rowsPerPage+";",
			 function(transaction, results, rowsArray){
				opTable.destroyItems();
			
				while (n < rowsArray.length) {
					
					item=rowsArray[n]
					opTable.addItem (new sap.m.ColumnListItem("tr"+n,{
						
						}));
					
					for (var prop in item) {
						if(item.hasOwnProperty(prop)){						
							sap.ui.getCore().getElementById("tr"+n).addCell(new sap.m.Text({text: item[prop]}))
							}
				        }
					
					
					n++;
				 }

			 },
			 function(error, statement){
				alert(error)
			 }        
			);	

	
}
var tabNames=new sap.m.Select('TableNames',{
	



	change: function(oControlEvent) {
		selectedTableName=oControlEvent.getParameter("selectedItem").getKey()
		BuildHeaders()
	}
});
function getTotalRecords()
{
	
	totalRecords=0;
	html5sql.process(
		['SELECT * FROM '+selectedTableName],
		function(transaction, results, rowsArray){

			totalRecords = rowsArray.length;
			totalPages=Math.floor(totalRecords/rowsPerPage);
			if (totalRecords%rowsPerPage>0){
				totalPages+=1;
			}
			
			firstPage();
		},
		function(error, statement){
		 opErrorMessage("Error: " + error.message + " when rowsArray.length processing " + statement);          
		}
	);






}
function buildSyncingCounts()
{
	SQLStatement="";
	totalRecords=0;
	var opTable = sap.ui.getCore().getElementById('DBTable');
	opTable.destroyItems();
	sap.ui.getCore().getElementById('pageDetails').setText("")
	
		    SQLStatement="select 'VehicleCheck' as type, id as id, recordupdated , reg || ' ' || mileage ||' ' || mpoint as info from MyVehicleCheck where state = 'NEW' "
			SQLStatement+=" union "
			SQLStatement+=" select 'NotificationsZ7' as type,   id    as id, recordupdated, shorttext as info from MyNotifications where notifno = 'NEW' and type = 'Z7' "
			SQLStatement+=" union "
			SQLStatement+=" select 'Notifications' as type,   id    as id, recordupdated , shorttext as info from MyNotifications where notifno = 'NEW' and type <> 'Z7' "
			SQLStatement+=" union "
			SQLStatement+=" select 'StatusUpdate' as type,   id    as id, recordupdated ,orderno || opno || ' ' || status as info from MyStatus where state = 'NEW' "
			SQLStatement+=" union "
			SQLStatement+=" select 'JobClose' as type,  id    as id, recordupdated ,orderno || opno  as info from MyJobClose where state = 'NEW' "
			SQLStatement+=" union "
			SQLStatement+=" select 'JobAddWork' as type,   id    as id, recordupdated ,orderno || opno  as info from MyJobAddWork where state = 'NEW' "
			SQLStatement+=" union "	
			SQLStatement+=" select 'TimeConf' as type,   id    as id, recordupdated ,orderno || opno || ' ' || description as info from MyTimeConfs where confno = 'NEW' "
			SQLStatement+=" union "
			SQLStatement+=" select 'FileRequest' as type,   id    as id, recordupdated ,orderno || ' ' || fname as info from MyJobDetsDraw where zurl = 'RequestLiveLink' "
			SQLStatement+=" union "
			SQLStatement+=" select 'FileDownload' as type,  id    as id, recordupdated ,orderno || ' ' || fname as info from MyJobDetsDraw where zurl = 'WaitingLiveLink' "
			SQLStatement+=" union "
			SQLStatement+=" select 'MPointDoc' as type,   id    as id, recordupdated ,orderno || ' ' || opno as info from MyMpointDocs where state = 'NEW' "
			SQLStatement+=" union "
			SQLStatement+=" select 'Flooding' as type,   id    as id, recordupdated ,orderno || ' ' || opno || ' ' || formname info from MyFormsResponses where lastupdated='CLOSED' and formname = 'Flooding' "
			SQLStatement+=" union "
			SQLStatement+=" select 'Pollution' as type,   id    as id, recordupdated ,orderno || ' ' || opno || ' ' || formname info from MyFormsResponses where lastupdated='CLOSED' and formname = 'Pollution' "
			SQLStatement+=" union "
			SQLStatement+=" select 'CustomerFeedback' as type,   id    as id, recordupdated ,orderno || ' ' || opno || ' ' || formname info from MyFormsResponses where lastupdated='CLOSED' and formname = 'CustomerFeedback' "
			SQLStatement+=" order by recordupdated asc "


			
	html5sql.process(
		[SQLStatement],
		function(transaction, results, rowsArray){
			for(var cnt=0; cnt < rowsArray.length ; cnt++){
				opTable.addItem (new sap.m.ColumnListItem("tr"+cnt,{
					
				}));
				sap.ui.getCore().getElementById("tr"+cnt).addCell(new sap.m.Text({text: rowsArray[cnt].type}))
				sap.ui.getCore().getElementById("tr"+cnt).addCell(new sap.m.Text({text: rowsArray[cnt].id}))
				sap.ui.getCore().getElementById("tr"+cnt).addCell(new sap.m.Text({text: rowsArray[cnt].recordupdated}))
				sap.ui.getCore().getElementById("tr"+cnt).addCell(new sap.m.Text({text: rowsArray[cnt].info}))
			}
			
		},
		function(error, statement){
		 opErrorMessage("Error: " + error.message + " when rowsArray.length processing " + statement);          
		}
	);






}
function buildLocalStorage()
{
	
	totalRecords=0;
	var opTable = sap.ui.getCore().getElementById('DBTable');
	opTable.destroyItems();
	sap.ui.getCore().getElementById('pageDetails').setText("")
	cnt = 0;
	$.each(localStorage, function(key, value){
		 cnt=cnt+1;
		 if(!key.match(/password/i)){
			 opTable.addItem (new sap.m.ColumnListItem("tr"+cnt,{}));
		     sap.ui.getCore().getElementById("tr"+cnt).addCell(new sap.m.Text({text: key}))
	         sap.ui.getCore().getElementById("tr"+cnt).addCell(new sap.m.Text({text: value}))
		 }
		
	});

}
function buildTableCounts()
{
	
	var sqlstatement=""
	var n = 0;
	var opTable = sap.ui.getCore().getElementById('DBTable');
	opTable.destroyItems();
	

	sap.ui.getCore().getElementById('pageDetails').setText("")
	//alert('SELECT * FROM '+selectedTableName+' LIMIT '+startRec+', '+rowsPerPage+";")
	html5sql.process("SELECT name FROM sqlite_master WHERE type='table' order by name",
				 function(transaction, results, rowsArray){
					for(var cnt=0; cnt < rowsArray.length ; cnt++){
						if(cnt==0){
							sqlstatement = 'select "****User Details****" as name, mobileuser || "-" || scenario || "-" || workcenter || "-" || employeeid as count from MyUserDets	union '
							
						}else{
							sqlstatement = ""
						}
						if((rowsArray[cnt].name!="__WebKitDatabaseInfoTable__")&&
						 (rowsArray[cnt].name!="sqlite_sequence"))
							{
								
							sqlstatement += 'SELECT "'+rowsArray[cnt].name+'" as name, count(*) as count FROM '+rowsArray[cnt].name +" "
							
							html5sql.process(sqlstatement,
									 function(transaction, results, rowsArray1){
										
	
											item=rowsArray1[0]
											opTable.addItem (new sap.m.ColumnListItem({
												cells:
													[
														new sap.m.Text({text: item.name}),
														new sap.m.Text({text: item.count})
													]
												}));
											
							
					
									 },
									 function(error, statement){
										alert(error)
									 }        
									);	
							}
					}
				},
				 function(error, statement){
					console.log(error)
				 }        
				);					



}
function buildRecordView()
{
	
	var sqlstatement=""
	var n = 0;

	dbrectable.destroyItems()
	

	
	html5sql.process("SELECT * FROM "+selectedTableName+" WHERE id='"+selectedTableRecord+"'",
				 function(transaction, results, rowsArray){
						
						item=rowsArray[0]
						cnt=0;
						for (var prop in item) {
							if(item.hasOwnProperty(prop)){	
								cnt = cnt +1;
								dbrectable.addItem (new sap.m.ColumnListItem("rec"+cnt,{
									cells:
										[
											new sap.m.Text({text: prop}),
											new sap.m.Text({text: item[prop]})
										]
									}));
								
								}
					        }
					console.log(cnt)
						formRecordView.open()
				},
				 function(error, statement){
					console.log(error)
				 }        
				);					

		
	

}
function BuildHeaders(){
var tablewidth=0;
	if((selectedTableName=="-TABLECOUNTS-")||
			(selectedTableName=="-SYNCING-")||
			(selectedTableName=="-LOCALSTORAGE-")){
		BuildDebugHeaders()
		return
	}
	var opTable = sap.ui.getCore().getElementById('DBTable');
	TotalColumns=0;
		html5sql.process('SELECT name, sql FROM sqlite_master WHERE type="table" AND name = "'+selectedTableName+'";',
		 function(transaction, results, rowsArray){

				item = rowsArray[0];

				var columnParts = item.sql.replace(/^[^\(]+\(([^\)]+)\)/g, '$1').split(','); ///// RegEx
			
				var columnName = "";
				var cols="";
				opTable.removeAllColumns();
				for(i in columnParts) {
					
					if (typeof columnParts[i] === 'string') columnName=columnParts[i].split(' ')[1]
					if (columnName==""){columnName=columnParts[i]}					  
					opTable.addColumn( new sap.m.Column({
						header: new sap.m.Text({text:columnName}),
						width: "200px"
					}));
					tablewidth+=200;
					
					}	
				//sap.ui.getCore().getElementById('sc1').setWidth(tablewidth);
				getTotalRecords();
				
		 },
		 function(error, statement){
			
		 }        
		);

	}

function BuildDebugHeaders(){
	var tablewidth=0;
	var opTable = sap.ui.getCore().getElementById('DBTable');
	sap.ui.getCore().getElementById('bFirst').setVisible(false)
	sap.ui.getCore().getElementById('bPrev').setVisible(false)
	sap.ui.getCore().getElementById('bNext').setVisible(false)
	sap.ui.getCore().getElementById('bLast').setVisible(false)
	opTable.removeAllColumns();
		if(selectedTableName=="-TABLECOUNTS-"){
				
					  
			opTable.addColumn( new sap.m.Column({
				header: new sap.m.Text({text:"Tablename"}),
				width: "200px"
			}));
						
			opTable.addColumn( new sap.m.Column({
				header: new sap.m.Text({text:"Record Count"}),
				width: "200px"
			}));			
		}else if(selectedTableName=="-LOCALSTORAGE-"){
			opTable.addColumn( new sap.m.Column({
				header: new sap.m.Text({text:"Key"}),
				width: "200px"
			}));
						
			opTable.addColumn( new sap.m.Column({
				header: new sap.m.Text({text:"Value"}),
				width: "200px"
			}));
		}else{
			opTable.addColumn( new sap.m.Column({
				header: new sap.m.Text({text:"Type"}),
				width: "200px"
			}));
						
			opTable.addColumn( new sap.m.Column({
				header: new sap.m.Text({text:"id"}),
				width: "40px"
			}))
			opTable.addColumn( new sap.m.Column({
				header: new sap.m.Text({text:"Date"}),
				width: "200px"
			}));	
			opTable.addColumn( new sap.m.Column({
				header: new sap.m.Text({text:"Info"}),
				width: "200px"
			}))
		}
			
		if(selectedTableName=="-TABLECOUNTS-"){
			buildTableCounts()
		}else if(selectedTableName=="-LOCALSTORAGE-"){
			buildLocalStorage()
		}
		else{
			buildSyncingCounts()
		}
			
		
}

function BuildDBTableNames(){
	var HTMLToOutput="";
	var selected=""
	var first=false;
	selectedTableName="-TABLECOUNTS-";
	
	tabNames.destroyItems()
	tabNames.addItem(new sap.ui.core.Item({
		key: "-TABLECOUNTS-",
		text: "-TABLECOUNTS-"
	}))
		tabNames.addItem(new sap.ui.core.Item({
		key: "-SYNCING-",
		text: "-SYNCING-"
	}))
		tabNames.addItem(new sap.ui.core.Item({
		key: "-LOCALSTORAGE-",
		text: "-LOCALSTORAGE-"
	}))
		html5sql.process("SELECT * FROM sqlite_master WHERE type='table' order by name;",
		 function(transaction, results, rowsArray){

			for (var n = 0; n < rowsArray.length; n++) {

				item = rowsArray[n];
				if (item.name.indexOf("__") ===-1){
					
					tabNames.addItem(new sap.ui.core.Item({
						key: item.name,
						text: item.name
					}))
				
					
						
					}
				}
			tabNames.setSelectedKey("-TABLECOUNTS-")

		 },
		 function(error, statement){
			//ert("error");
		 }        
		);
	}


var formDBView = new sap.m.Dialog("dlgDBView",{
    title:"Display DB",
    modal: true,
    contentWidth:"1em",
    buttons: [
	       			new sap.m.Button("pageDetails",{text:"xx of xx"}),
			       		
				new sap.m.Button({
				    text: "Close",
				    type: 	sap.m.ButtonType.Reject,
				    tap: [ function(oEvt) {		  
						 
				    	formDBView.close()
						  } ]
				})
				],					
				
content:[
new sap.m.Bar({
	contentLeft : [

		       		new sap.m.Button("bFirst",{
		       			 
		       			 icon:"sap-icon://sys-first-page",
		       				 press: [ function(){
		       					
		       					firstPage()
		       						}]
		       			 }),
				       		new sap.m.Button("bPrev",{
				       			 
				       			 icon:"sap-icon://sys-prev-page",
				       				 press: [ function(){
				       					
				       					 prevPage()
				       						}]
				       			 })
			],
	contentMiddle: [new sap.m.Label({text:"Table Name"}),tabNames], 	
contentRight : [

	       		new sap.m.Button("bNext",{
	       			 
	       			 icon:"sap-icon://sys-next-page",
	       				 press: [ function(){
	       					
	       					 nextPage()
	       						}]
	       			 }),
			       		new sap.m.Button("bLast",{
			       			 
			       			 icon:"sap-icon://sys-last-page",
			       				 press: [ function(){
			       					
			       					 lastPage()
			       						}]
			       			 })
		]


}),
new sap.m.ScrollContainer("sc1", {
	horizontal: true,
	vertical: true,
	content:[new sap.m.Table("DBTable",{
		mode: sap.m.ListMode.SingleSelectMaster,
		selectionChange: function(evt){
			if(selectedTableName=="-SYNCING-"){
				return				
			}else if (selectedTableName=="-TABLECOUNTS-"){
				if(evt.getParameter("listItem").getCells()[0].getText().indexOf("User Details")>0)
				{
				return
				}else{
					tabNames.setSelectedKey(evt.getParameter("listItem").getCells()[0].getText())
					selectedTableName=evt.getParameter("listItem").getCells()[0].getText()
					BuildHeaders()
				}	
			}else if (selectedTableName=="-LOCALSTORAGE-"){
				return
			}else{
				selectedTableRecord=evt.getParameter("listItem").getCells()[0].getText()
				buildRecordView()
			}
			
			
			
	    }
		
	})]
	
	
}) 
 		  
 
         
         ],
         contentWidth:"100%",
         contentHeight: "100%",
         beforeOpen:function(){
        	 BuildDBTableNames()
        	
        	 BuildHeaders()
         }
 })
var dbrectable=new sap.m.Table("DBRecordTable",{
	mode: sap.m.ListMode.SingleSelectMaster,
	selectionChange: function(evt){
		
		
		
    },
    columns:[
        new sap.m.Column({header: new sap.m.Label({text:"Field"}),
       	 hAlign: 'Left',width: '15%', minScreenWidth : "" , demandPopin: false}),
        new sap.m.Column({header: new sap.m.Label({text:"Value"}),
       	 hAlign: 'Left',width: '19%',minScreenWidth : "" , demandPopin: true})
        ]
});
var formRecordView = new sap.m.Dialog("dlgRecordView",{
    title:"Record View",
    modal: true,
    contentWidth:"1em",
    buttons: [
  
				
				new sap.m.Button( {
				    text: "Close",
				    type: 	sap.m.ButtonType.Reject,
				    tap: [ function(oEvt) {		  
						 
				    	formRecordView.close()
						  } ]
				})
				],	
	            contentWidth:"80%",
	            contentHeight: "80%",
    content:[dbrectable]
            
 })

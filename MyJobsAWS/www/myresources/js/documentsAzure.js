﻿

function getNumFilesForUpload(recNum) {
    if (recNum == null) { return 0; }
    var fileCount = 0;
    try {

        window.resolveLocalFileSystemURL(DeviceStorageDirectory + AppDocDirectory + "/Private/Photos/ASC", function (dirEntry) {

            var directoryReader = dirEntry.createReader();
            directoryReader.readEntries(function (entries) {
                var i;

                for (i = 0; i < entries.length; i++) {

                    if (entries[i].isFile) {
                        //do nothing
                    } else {
                        //  Directory
                        if (entries[i].fullPath.indexOf(recNum) > 0) {
                            try {
                                window.resolveLocalFileSystemURL(entries[i].nativeURL, function (dirEntry2) {

                                    var directoryReader2 = dirEntry2.createReader();
                                    directoryReader2.readEntries(function (files) {
                                        for (i = 0; i < files.length; i++) {

                                            if (files[i].isFile) {
                                                fileCount += 1;
                                                currentAssetRecord.Zdocflg = "X"
                                                currentAssetRecord.Zdocpath = localStorage.getItem("AssetDocumentServerPath");
                                            }
                                        }
                                        sap.ui.getCore().getElementById("DocCount_CreateAssetStep4").setText(fileCount + "  Photo's/Documents attached to asset record.");
                                    })
                                });
                            }
                            catch (err) {
                                //Not in Cordova

                            }

                        }
                    }
                }


            }, function () { opErrorMessage(err); });
        });
    }
    catch (err) {
        opErrorMessage(err);
        console.log("photoUpload - no Cordova")
        //Not in Cordova
    }



};
var formGetPhotoAC = new sap.m.Dialog("dlgGetPhotoAC", {
    title: "Attach Photo",
    modal: true,
    contentWidth: "1em",
    buttons: [

				new sap.m.Button({
				    icon: "sap-icon://sys-cancel",
				    text: "Close",
				    type: sap.m.ButtonType.Accept,
				    tap: [function (oEvt) {

				        formGetPhotoAC.close()
				    }]
				})
    ],
    content: [
		new sap.ui.layout.form.SimpleForm({
		    minWidth: 1024,
		    maxContainerCols: 2,
		    content: [
		             new sap.m.Label({ text: " " }),
					 new sap.m.Button({
					     text: "Take Photo",
					     type: sap.m.ButtonType.Accept,
					     tap: [function (oEvt) {

					         getPhotoAC(selectedPhotoType);
					         formGetPhotoAC.close()
					     }]
					 }),
					 new sap.m.Label({ text: " " }),
					 new sap.m.Button({
					     text: "Select Photo",
					     type: sap.m.ButtonType.Reject,
					     tap: [function (oEvt) {

					         selectPhotoAC()
					         formGetPhotoAC.close()
					     }]
					 })
		    ]
		})
    ],

    beforeOpen: function () {
        try {

            DeviceStorageDirectory = cordova.file.externalApplicationStorageDirectory
            AppDocDirectory = "MyJobs"
            if (device.platform == "iOS") {
                DeviceStorageDirectory = cordova.file.dataDirectory
                AppDocDirectory = "documents/MyJobs"
            }
            localStorage.setItem("DeviceType", device.platform)
        } catch (err) {
            localStorage.setItem("DeviceType", "WINDOWS")

        }
    },
    beforeClose: function () {

    }
})
function selectPhotoAC() {

    window.imagePicker.getPictures(
	    function (results) {
	        for (var i = 0; i < results.length; i++) {
	            //alert('Image URI: ' + results[i]);
	            try {
	                moveFileAC(results[i], DeviceStorageDirectory + AppDocDirectory + "/Private/Photos/ASC")

	            }
	            catch (err) {
	                opErrorMessage('Error: ' + err);
	                showErrorMessage("There was an error adding the photo:" + err);
	            }
	        }
	    }, function (error) {
	        opErrorMessage('Error: ' + error);
	    }, {
	        maximumImagesCount: 10,
	        width: 800
	    }
	);
}

//get photo and store locally
function getPhotoAC(caller) {
    getPhotoCaller = caller
    // Take picture using device camera and retrieve image as base64-encoded string
    //alert("about to take photo"+DeviceStorageDirectory)

    navigator.camera.getPicture(onGetPhotoDataSuccessAC, onGetPhotoDataFail, { quality: 50 });
}


//Callback function when the picture has been successfully taken
function onGetPhotoDataSuccessAC(imageData) {
    try {
        moveFileAC(imageData, DeviceStorageDirectory + AppDocDirectory + "/Private/Photos/ASC")
    }
    catch (err) {
        opErrorMessage('Error: ' + err);
        console.log("onGetPhotoDataSuccessAC:" + err)
    }

}

function moveFileAC(fileUri, dir) {
    console.log("moveFileAC:fileUri=" + fileUri + " dir=" + dir);
 //   var newfileURI = resizedataURLAC(fileUri, 640, 480)

  


    var opdir = dir;
    // alert(dir);
    var now = new Date();
    if (currentAssetRecord.recordNumberZRECNUM == null) {
        currentAssetRecord.recordNumberZRECNUM = localStorage.getItem("MobileUser") +
                   now.getFullYear() + ("0" + (now.getMonth() + 1)).slice(-2) + ("0" + (now.getDate())).slice(-2) + ("0" + (now.getHours())).slice(-2) +
                    ("0" + (now.getMinutes())).slice(-2) + ("0" + (now.getSeconds())).slice(-2) + ("0" + (now.getMilliseconds())).slice(-3)
    }
    window.resolveLocalFileSystemURL(fileUri, function (file) {

        window.resolveLocalFileSystemURL(opdir, function (opdir) {

            opdir.getDirectory(currentAssetRecord.recordNumberZRECNUM, { create: true, exclusive: false }, function (newDir) {

                var fileExtension = file.name.split(".").pop().toUpperCase();
                if (fileExtension == "JPG") {
                    newDir.getFile(file.name, { create: true }, function (fileEntry) {
                        fileEntry.createWriter(function (fileWriter) {
                            resizedataURLAC(fileUri, 640, 480, function (blob) {
                                fileWriter.write(blob);
                                getNumFilesForUpload(currentAssetRecord.recordNumberZRECNUM);
                                showSucessMessage("Sucess", "The Photo/Document was added successfully");
                            })
                        }, errorHandler);
                    }, errorHandler);
                }
                else {
                    file.moveTo(newDir, file.name, function (entry) {
                        getNumFilesForUpload(currentAssetRecord.recordNumberZRECNUM);
                        showSucessMessage("Sucess", "The Photo/Document was added successfully");
                    }, function (error) {
                        opErrorMessage("error moving:" + error.code + ":" + error.source + ":" + error.target);
                    });
                }
              




            }
            , function (err) { opErrorMessage(err) });
        }, errorMoveCallback);
    }, errorMoveCallback);
}

function photoUpload() {

    // privatephotos = new Array()
    //  var opTable = sap.ui.getCore().getElementById('PhotosTable');
    //  opTable.destroyItems();
    try {

        window.resolveLocalFileSystemURL(DeviceStorageDirectory + AppDocDirectory + "/Private/Photos/ASC", function (dirEntry) {

            var directoryReader = dirEntry.createReader();
            directoryReader.readEntries(processFolders, photosReadFail);
        });
    }
    catch (err) {
        opErrorMessage(err);
        console.log("photoUpload - no Cordova")
        //Not in Cordova
    }
}

function processFolders(entries) {
    var i;
    for (i = 0; i < entries.length; i++) {

        if (entries[i].isFile) {
           selectedPhoto = cordova.file.externalRootDirectory + entries[i].fullPath
            console.log("processFolders:selectedPhoto =" + selectedPhoto);
            uploadPhotoAC(selectedPhoto);
        } else {
            //  alert("Directory =" + entries[i].name);
            selectedFolder = cordova.file.externalRootDirectory + entries[i].fullPath
            window.resolveLocalFileSystemURL(selectedFolder, function (dirEntry) {
                //Delete folder if empty. this will fail if not empty
                try {
                    dirEntry.remove(function () { }, function () { });
                }
                catch (err)
                { console.log("Directory not empty:" + dirEntry); }
                var directoryReader = dirEntry.createReader();
                directoryReader.readEntries(uploadAllPhotos, photosReadFail);
            });
        }
    }
}

function uploadAllPhotos(entries) {
    var i;
    for (i = 0; i < entries.length; i++) {

        if (entries[i].isFile) {
            selectedPhoto = cordova.file.externalRootDirectory + entries[i].fullPath
            uploadPhotoAC(selectedPhoto);
        } else {
            console.log('photosDirectory - ' + entries[i].name);
        }
    }
}

function createDirectory(fsEntry, thedir) {
    //   window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, onRequestFileSystemSuccess, null);

    //function onRequestFileSystemSuccess(fileSystem) {
    //    var entry = fileSystem.root;
    //    entry.getDirectory("example", { create: true, exclusive: false }, onGetDirectorySuccess, onGetDirectoryFail);
    //}

    fsEntry.getDirectory(thedir, { create: true, exclusive: false }, onGetDirectorySuccess, onGetDirectoryFail);
}
function onGetDirectorySuccess(dir) {
    //  alert("Created dir " + dir.name)
    console.log("Created dir " + dir.name);
}

function onGetDirectoryFail(error) {
    //  alert("Error creating directory " + error.code)
    console.log("Error creating directory " + error.code);
}


function uploadPhotoAC(fileURI) {
    var options = new FileUploadOptions();
    options.fileKey = "file";
    options.fileName = fileURI.substr(fileURI.lastIndexOf('/') + 1);
    var path = fileURI.substr(0, fileURI.lastIndexOf('/'));
    var myFolder = path.substr(path.lastIndexOf('/') + 1);
    options.chunkedMode = true;

    var params = new Object();
    params.folderName = myFolder;
    options.params = params;

    var headers = { 'X-ZUMO-AUTH': mobileService.currentUser.mobileServiceAuthenticationToken };
    options.headers = headers;

    var ft = new FileTransfer();
    console.log("fileURI=" + fileURI + " URI=" + localStorage.getItem('ServerName') + "/api/DocumentService?ACFileUpload.php")
    ft.upload(fileURI, localStorage.getItem('ServerName')+"/api/DocumentService?" + "ACFileUpload.php", 
        function (message) {
            //success function
            photoUploadSucess(message, fileURI)
        },
        function (error) {
            //error function
            photoUploadFail(error, fileURI)
        }, options)

}

function photoUploadSucess(message, fileURI) {
    opMessage("Success Uploading " + fileURI);
    console.log("Success Uploading " + fileURI)
    //delete the file
    delFile(fileURI);
}
function photoUploadFail(error, fileURI) {
    opErrorMessage("An error has occurred: Code = " + error.code + " source = " + error.source + " target = " + error.target + " http" + error.http_status);
    console.log("An error has occurred: Code = " + error.code + " source = " + error.source + " target = " + error.target + " http" + error.http_status);
}

function delFile(fileURI) {
    window.resolveLocalFileSystemURL(fileURI, function (file) {
        file.remove(function () {
            console.log(fileURI + " deleted");
        }, function () {
            console.log("error deleting the file " + error.code);
        });
    }, function () {
        console.log("file does not exist");
    });
}

function buildDocumentListAC() {
    var asset_id = ""
    var asset_name = ""
    var asset_type = ""
    var docsTabBarAC = new sap.m.IconTabBar('DocumentsTabBarAC',
                {
                    expanded: '{device>/isNoPhone}',

                    select: [function (oEvt) {

                        if (oEvt.getParameters().key == "Global") {
                            //oDetailPage.setFooter(detailFooter)
                        }
                        if (oEvt.getParameters().key == "Download") {
                            //oDetailPage.setFooter(detailFooter)
                        }
                        if (oEvt.getParameters().key == "Upload") {
                            //oDetailPage.setFooter(detailFooter)
                        }
                        if (oEvt.getParameters().key == "Photos") {
                            //oDetailPage.setFooter(materialFooter)
                        }

                    }
                    ],

                    items: [


                            new sap.m.IconTabFilter({
                                key: 'DocumentsGlobal',
                                tooltip: 'Global Documents',
                                icon: "sap-icon://documents",
                                text:"Info",
                                content: [
                                     new sap.m.Table("DocumentsGlobalTableAC", {
                                         mode: sap.m.ListMode.SingleSelectMaster,
                                         selectionChange: function (evt) {
                                             if (evt.getParameter("listItem").getCells()[2].getText() == "") {
                                                 buildGlobalDownloadsAC(evt.getParameter("listItem").getCells()[5].getText())
                                             } else {
                                                 moveFileAC(evt.getParameter("listItem").getCells()[5].getText(), DeviceStorageDirectory + AppDocDirectory + "/Private/Photos/ASC")
                                             }
                                         },
                                         columns: [
                                                  new sap.m.Column({
                                                      header: new sap.m.Label({ text: "" }),
                                                      hAlign: 'Left', width: '5%', minScreenWidth: "", demandPopin: false
                                                  }),
                                                  new sap.m.Column({
                                                      header: new sap.m.Label({ text: "Filename" }),
                                                      hAlign: 'Left', width: '35%', minScreenWidth: "", demandPopin: false
                                                  }),
                                                  new sap.m.Column({
                                                      header: new sap.m.Label({ text: "Type" }),
                                                      hAlign: 'Left', width: '15%', minScreenWidth: "", demandPopin: true
                                                  }),
                                                  new sap.m.Column({
                                                      header: new sap.m.Label({ text: "Size" }),
                                                      hAlign: 'Left', width: '15%', minScreenWidth: "", demandPopin: true
                                                  }),
                                                  new sap.m.Column({
                                                      header: new sap.m.Label({ text: "Last Modified" }),
                                                      hAlign: 'Left', width: '30%', minScreenWidth: "", demandPopin: true
                                                  }),
                                                      new sap.m.Column({
                                                          header: new sap.m.Label({ text: "Path" }),
                                                          hAlign: 'Left', width: '0%', minScreenWidth: "", visible: false, demandPopin: false
                                                      })
                                         ]


                                     })
                                ]

                            }),
                           
                    ]
                });
    return docsTabBarAC
}

var formDocumentsAC = new sap.m.Dialog("dlgDocumentsAC", {
    title: "Documents",
    modal: true,
    contentWidth: "1em",
    buttons: [

                                new sap.m.Button({
                                    icon: "sap-icon://sys-cancel",
                                    text: "Close",
                                    type: sap.m.ButtonType.Accept,
                                    tap: [function (oEvt) {

                                        formDocumentsAC.close()
                                    }]
                                })
    ],
    content: [
buildDocumentListAC()

    ],
    beforeOpen: function () {
        buildDocumentTablesAC()
        //buildPhotoList();

    },
    contentWidth: "90%",
    contentHeight: "90%",
})


function buildDocumentTablesAC() {
    buildGlobalDownloadsAC(cordova.file.externalRootDirectory + "Documents")
    //buildPrivateDownloads()
    //buildPrivateUploads()

}
function buildGlobalDownloadsAC(dir) {
    //need to sort out up directory

    privatephotos = new Array()
    var opTable = sap.ui.getCore().getElementById("DocumentsGlobalTableAC");
    opTable.destroyItems();
    prevDir = dir;
    if (dir != cordova.file.externalRootDirectory + "Documents") {
        if (dir != "") {
            X = dir.split("/");
            uDir = ""
            for (n = 0; n <= X.length - 3; n++) {
                uDir += X[n] + "/"
            }
            uDir += X[X.length - 2]
            prevDir = ""
            for (n = 0; n <= X.length - 2; n++) {
                prevDir += X[n] + "/"
            }
            prevDir += X[X.length - 1]
            opTable.addItem(new sap.m.ColumnListItem({
                cells:
                    [
                    new sap.ui.core.Icon({ src: "sap-icon://response" }),
                    new sap.m.Text({ text: "" }),
                    new sap.m.Text({ text: "" }),
                    new sap.m.Text({ text: "" }),
                    new sap.m.Text({ text: "" }),
                    new sap.m.Text({ text: uDir })
                    ]
            }));
        }
    }
    GlobalDirectory = prevDir;
    try {
        window.resolveLocalFileSystemURL(dir, function (dirEntry) {

            var directoryReader = dirEntry.createReader();
            directoryReader.readEntries(docsGDReadSuccessAC, docsGDReadFailAC);
        });
    }
    catch (err) {
        console.log("error resolving " + dir + " err " + err)
        //Not in Cordova
    }


}
function docsGDReadFailAC(error) {
    opErrorMessage("Failed to list Documents contents: " + error);
}
function gddocs_details_callbackAC(f) {
    var d1 = new Date(f.lastModifiedDate);

    var opTable = sap.ui.getCore().getElementById("DocumentsGlobalTableAC");
    if (f.type != "") {
        x = f.type.split("/")
        y = d1.toString('yyyyMMdd')
        z = y.substring(0, 24)
        opTable.addItem(new sap.m.ColumnListItem({
            cells:
                [
                new sap.ui.core.Icon({ src: "sap-icon://document-text" }),
                new sap.m.Text({ text: f.name }),
                new sap.m.Text({ text: x[1] }),
                new sap.m.Text({ text: f.size }),
                new sap.m.Text({ text: z }),
                new sap.m.Text({ text: GlobalDirectory + "/" + f.name })
                ]
        }));
    }
}
function docsGDReadSuccessAC(entries) {
    var opTable = sap.ui.getCore().getElementById("DocumentsGlobalTableAC");


    var i;
    for (i = 0; i < entries.length; i++) {

        if (entries[i].isFile) {

            entries[i].file(gddocs_details_callbackAC);

        } else {
            opTable.addItem(new sap.m.ColumnListItem({
                cells:
                    [
                    new sap.ui.core.Icon({ src: "sap-icon://folder" }),
                    new sap.m.Text({ text: entries[i].name }),
                    new sap.m.Text({ text: "" }),
                    new sap.m.Text({ text: "" }),
                    new sap.m.Text({ text: "" }),
                    new sap.m.Text({ text: GlobalDirectory + "/" + entries[i].name })
                    ]
            }));

        }
    }
}

function resizedataURLAC(datas, wantedWidth, wantedHeight,callback) {
    // We create an image to receive the Data URI
    var img = document.createElement('img');

    // When the event "onload" is triggered we can resize the image.
    img.onload = function () {
        // We create a canvas and get its context.
        var canvas = document.createElement('canvas');
        var ctx = canvas.getContext('2d');

        // We set the dimensions at the wanted size.
        canvas.width = wantedWidth;
        canvas.height = wantedHeight;

        // We resize the image with the canvas method drawImage();
        ctx.drawImage(this, 0, 0, wantedWidth, wantedHeight);

        var dataURI = canvas.toDataURL();

        var blobBin = atob(dataURI.split(',')[1]);
        var array = [];
        for (var i = 0; i < blobBin.length; i++) {
            array.push(blobBin.charCodeAt(i));
        }
        var myFile = new Blob([new Uint8Array(array)], { type: 'image/png' });


        callback (myFile);
    };

    // We put the Data URI in the image's src attribute
    img.src = datas;
}
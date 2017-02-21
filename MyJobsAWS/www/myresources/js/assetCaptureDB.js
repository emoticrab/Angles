function populateDecomAssetFilterDecomAction() {

    var SQLStatement;

    SQLStatement = "select distinct ZSTAT,ZSTATDESC from DecommissionStatus ORDER BY ZSTATDESC"
   
    sap.ui.getCore().getElementById("DecomAssetFilter_DecomAction").destroyItems();

    sap.ui.getCore().getElementById("DecomAssetFilter_DecomAction").addItem(
				new sap.ui.core.Item({
				    key: "NOTSELECTED",
				    text: '--Select--'
				}))

    html5sql.process(SQLStatement, function (transaction,
            results, rowsArray) {

        for (var n = 0; n < rowsArray.length; n++) {
            item = rowsArray[n];
            sap.ui.getCore().getElementById(
                    "DecomAssetFilter_DecomAction").addItem(
                    new sap.ui.core.Item({
                        key: item.ZSTAT,
                        text: item.ZSTATDESC
                    }))
        }
        DecomAssetFilterDecomAction.setSelectedKey("NOTSELECTED");
        
    }, function (error, statement) {
    })
}

function submitRecord(callback) {
    //send any attached photos and documents
    //TODO Enable line below !!
    try
    { photoUpload(); }
    catch (err) {//not in cordova
    }
    EvaluateValueForZPROCTYP(function (zProcTyp) {
        currentAssetRecord.zproctyp = zProcTyp;
      
        if (currentAssetRecord.recordNumberZRECNUM == null) {
            currentAssetRecord.recordNumberZRECNUM = generateZrecnum();
        }
        saveCurrentrecord(function (result) {
            if (result == true) {
                callback(true);
            }
            else {
                showErrorMessage("", "There was an error on save when submitting the record")
            }
        })
    });
}

function decomRecord() {
    setDecomValues();
    currentAssetRecord.Zdecom = "X";
    currentAssetRecord.Zdecomr = null;
    currentAssetRecord.Zeqdecom = null;
    currentAssetRecord.zproctyp = "DC1";
    if (currentAssetRecord.recordNumberZRECNUM == null) {
        currentAssetRecord.recordNumberZRECNUM = generateZrecnum();
    }

    saveCurrentrecord(function (result) {
        if (result == true) {
                    showSucessMessage("Sucess", "The asset has been decomissioned successfully");
                    cancelAsset();
                    //TODO Maybe just do an Upload sync
                    uploadAllRecords(function (data) {
                    })
        }
        else {
            showErrorMessage("", "There was an error on save when submitting the record")
        }
    })
}
function decomReplaceRecord() {
    setDecomValues();
    currentAssetRecord.Zdecom = null;
    currentAssetRecord.Zdecomr = "X";
    currentAssetRecord.Zeqdecom = currentAssetRecord.EQUNR;
    currentAssetRecord.zproctyp = "DC2";
    if (currentAssetRecord.recordNumberZRECNUM == null) {
        currentAssetRecord.recordNumberZRECNUM = generateZrecnum();
    }
    saveCurrentrecord(function (success) {
        if (success == true) {
            //TODO Maybe just do an Upload sync
            uploadAllRecords(function (data) {
            })
            formDecomAssetSuccess.open();
        }
        else {
            showErrorMessage("", "There was an error decomissioning the record")
        }
    })
}

function setDecomValues() {
    currentAssetRecord.STATUS = DecomAssetFilterDecomAction.getSelectedKey();


    if (textCommentDecomAsset.getValue().length > 250) {
        currentAssetRecord.zcomments1 = textCommentDecomAsset.getValue().substr(0, 250);
        currentAssetRecord.zcomments2 = textCommentDecomAsset.getValue().substr(250, textCommentDecomAsset.getValue().length);
    }
    else {
        currentAssetRecord.zcomments1 = textCommentDecomAsset.getValue();
    }
    if (currentAssetRecord.zcomments1 != null && currentAssetRecord.zcomments1.length > 0) {
        currentAssetRecord.Zcomflg = "X";
    }
    else {
        currentAssetRecord.Zcomflg = null;
    }

}

function saveCurrentrecord(callback) {
    var ZINSLOCDESCString = "";
    if (currentAssetRecord.zinsLocDesc1 != null) { ZINSLOCDESCString = currentAssetRecord.zinsLocDesc1; }
    if (currentAssetRecord.zinsLocDesc2 != null) {
        if (ZINSLOCDESCString == "") {
            ZINSLOCDESCString = currentAssetRecord.zinsLocDesc2;
        }
        else {
            ZINSLOCDESCString = ZINSLOCDESCString + " " + currentAssetRecord.zinsLocDesc2;
        }
    }
    if (currentAssetRecord.zinsLocDesc3 != null) {
        if (ZINSLOCDESCString == "") {
            ZINSLOCDESCString = currentAssetRecord.zinsLocDesc3;
        }
        else {
            ZINSLOCDESCString = ZINSLOCDESCString + " " + currentAssetRecord.zinsLocDesc3;
        }
    }
    if (ZINSLOCDESCString == "") { ZINSLOCDESCString = "NULL," }
    else {
        ZINSLOCDESCString = '"' + ZINSLOCDESCString + '",'
    }

    var sqlstatement = 'INSERT INTO AssetUpload (ZASCAT,ZASSDESC ,ZZASSETTAG,ERNAM,TERMAB,ERFZEIT,ZDECOM,ESTAT,ZDECOMR,' +
        'ZEQDECOM,ZDOCFLG,Z_GPSNMEA,ZINSLOCDESC,ZINSLOCDESC1,ZINSLOCDESC2,ZINSLOCDESC3,ZPARLOCN,ZPEQUNR,ZPARECNUM,ZPRG,' +
        'ZPRGDESC,ZPROCTYP,ZRECNUM,ZSERN1,ZSITEDESC,ZSITESGNOFF,STATUS,STATUS_TXT,STATUS_PROFILE,ZSURV,ZSURVSUB,ZSTATUS,ZZW_WW,' +
        'ZCOMMENTS1,ZCOMMENTS2,SYNCED,ZDOCPATH,ZCAPDEL_SURVEY,ZPROJ_CODE,ZCheck_OUT,ZCHECKOUT_TO,ZCHECKOUT_DATE,ZDELETED,  ' +
        'ZASSTYPE,ZZEQPT_EGI ,EQKTU ,EQUNR ,HURST,ZIWERK,MAPAR ,ZNCDESC' +
                      ',ZOTDESC ,ZPLGRP ,ZPLGDESC ,SERGE ,ZSITE ,ZSWERK ,ZSYSCODE ,ZSYSDESC ,ZINSTLOCN ,ZZFL_NC ,INBDT ) VALUES ( ' +
                     (currentAssetRecord.zascatAssetCategory == null ? "NULL," : '"' + currentAssetRecord.zascatAssetCategory + '",') +
                      (currentAssetRecord.AssetDescriptionZASSDESC == null ? "NULL," : '"' + currentAssetRecord.AssetDescriptionZASSDESC + '",') +
                      (currentAssetRecord.zzAssetTag == null ? "NULL," : '"' + currentAssetRecord.zzAssetTag + '",') +
                       (currentAssetRecord.Ernam == null ? "NULL," : '"' + currentAssetRecord.Ernam + '",') +
                        (currentAssetRecord.Termab == null ? "NULL," : '"' + currentAssetRecord.Termab + '",') +
                        (currentAssetRecord.Erfzeit == null ? "NULL," : '"' + currentAssetRecord.Erfzeit + '",') +
                         (currentAssetRecord.Zdecom == null ? "NULL," : '"' + currentAssetRecord.Zdecom + '",') +
                           (currentAssetRecord.Estat == null ? "NULL," : '"' + currentAssetRecord.Estat + '",') +
                            (currentAssetRecord.Zdecomr == null ? "NULL," : '"' + currentAssetRecord.Zdecomr + '",') +
                            (currentAssetRecord.Zeqdecom == null ? "NULL," : '"' + currentAssetRecord.Zeqdecom + '",') +
                             (currentAssetRecord.Zdocflg == null ? "NULL," : '"' + currentAssetRecord.Zdocflg + '",') +
                             (currentAssetRecord.z_gpsNmea == null ? "NULL," : '"' + currentAssetRecord.z_gpsNmea + '",') +
                            ZINSLOCDESCString +
                             (currentAssetRecord.zinsLocDesc1 == null ? "NULL," : '"' + currentAssetRecord.zinsLocDesc1 + '",') +
                             (currentAssetRecord.zinsLocDesc2 == null ? "NULL," : '"' + currentAssetRecord.zinsLocDesc2 + '",') +
                             (currentAssetRecord.zinsLocDesc3 == null ? "NULL," : '"' + currentAssetRecord.zinsLocDesc3 + '",') +
                             (currentAssetRecord.parentFlStringZPARLOCN == null ? "NULL," : '"' + currentAssetRecord.parentFlStringZPARLOCN + '",') +
                             (currentAssetRecord.parentEquipmentNumberZPEQUNR == null ? "NULL," : '"' + currentAssetRecord.parentEquipmentNumberZPEQUNR + '",') +
                             (currentAssetRecord.parentRecordNumberZPARECNUM == null ? "NULL," : '"' + currentAssetRecord.parentRecordNumberZPARECNUM + '",') +
                             (currentAssetRecord.processGroupZPRG == null ? "NULL," : '"' + currentAssetRecord.processGroupZPRG + '",') +
                             (currentAssetRecord.processGroupDescriptionZprgdesc == null ? "NULL," : '"' + currentAssetRecord.processGroupDescriptionZprgdesc + '",') +
                            (currentAssetRecord.zproctyp == null ? "NULL," : '"' + currentAssetRecord.zproctyp + '",') +
                            (currentAssetRecord.recordNumberZRECNUM == null ? "NULL," : '"' + currentAssetRecord.recordNumberZRECNUM + '",') +
                             (currentAssetRecord.sergeSerialNumber == null ? "NULL," : '"' + currentAssetRecord.sergeSerialNumber + '",') +
                            (currentAssetRecord.ZsiteDesc == null ? "NULL," : '"' + currentAssetRecord.ZsiteDesc + '",') +
                             "NULL," +//ZSITESIGNOFF"
                           (currentAssetRecord.STATUS == null ? "NULL," : '"' + currentAssetRecord.STATUS + '",') +
                            (currentAssetRecord.StatusTxt == null ? "NULL," : '"' + currentAssetRecord.StatusTxt + '",') +
                            (currentAssetRecord.StatusProfile == null ? "NULL," : '"' + currentAssetRecord.StatusProfile + '",') +
                            (currentAssetRecord.ZSURV == null ? "NULL," : '"' + currentAssetRecord.ZSURV + '",') +
                             "NULL," +//"ZSURVSUB"
                            "NULL," +//" ZSTATUS"
                            (currentAssetRecord.businessUnit == null ? "NULL," : '"' + currentAssetRecord.businessUnit + '",') +
                            (currentAssetRecord.zcomments1 == null ? "NULL," : '"' + currentAssetRecord.zcomments1 + '",') +
                            (currentAssetRecord.zcomments2 == null ? "NULL," : '"' + currentAssetRecord.zcomments2 + '",') +
                             "NULL," +//" SYNCED"
                            (currentAssetRecord.Zdocpath == null ? "NULL," : '"' + currentAssetRecord.Zdocpath + '",') +
                            (currentAssetRecord.ZcapSurv == null ? "NULL," : '"' + currentAssetRecord.ZcapSurv + '",') +
                            (currentAssetRecord.Zproj == null ? "NULL," : '"' + currentAssetRecord.Zproj + '",') +
                            (currentAssetRecord.ZcheckOut == null ? "NULL," : '"' + currentAssetRecord.ZcheckOut + '",') +
                            (currentAssetRecord.ZchkoutBy == null ? "NULL," : '"' + currentAssetRecord.ZchkoutBy + '",') +
                            (currentAssetRecord.ZchkoutDate == null ? "NULL," : '"' + currentAssetRecord.ZchkoutDate + '",') +
                            (currentAssetRecord.Deleted == null ? "NULL," : '"' + currentAssetRecord.Deleted + '",') +
                      (currentAssetRecord.ZASSTYPE == null ? "NULL," : '"' + currentAssetRecord.ZASSTYPE + '",') +
                      (currentAssetRecord.equipmentTypeCodeZZEQPT_EGI == null ? "NULL," : '"' + currentAssetRecord.equipmentTypeCodeZZEQPT_EGI + '",') +
                     (currentAssetRecord.EquipmentDescriptionEQKTU == null ? "NULL," : '"' + currentAssetRecord.EquipmentDescriptionEQKTU + '",') +
                      (currentAssetRecord.EQUNR == null ? "NULL," : '"' + currentAssetRecord.EQUNR + '",') +
                      (currentAssetRecord.make == null ? "NULL," : '"' + currentAssetRecord.make + '",') +
                      (currentAssetRecord.ZIWERK == null ? "NULL," : '"' + currentAssetRecord.ZIWERK + '",') +
                      (currentAssetRecord.model == null ? "NULL," : '"' + currentAssetRecord.model + '",') +
                      (currentAssetRecord.functionTypeZNCDESC == null ? "NULL," : '"' + currentAssetRecord.functionTypeZNCDESC + '",') +
                      (currentAssetRecord.equipmentTypeDescriptionZOTDESC == null ? "NULL," : '"' + currentAssetRecord.equipmentTypeDescriptionZOTDESC + '",') +
                      (currentAssetRecord.plantGroupCodeZplgrp == null ? "NULL," : '"' + currentAssetRecord.plantGroupCodeZplgrp + '",') +
                      (currentAssetRecord.plantGroupDescriptionZPLGDESC == null ? "NULL," : '"' + currentAssetRecord.plantGroupDescriptionZPLGDESC + '",') +
                      (currentAssetRecord.sergeSerialNumber == null ? "NULL," : '"' + currentAssetRecord.sergeSerialNumber + '",') +
                      (currentAssetRecord.site == null ? "NULL," : '"' + currentAssetRecord.site + '",') +
                      (currentAssetRecord.maintenancePlantZSWERK == null ? "NULL," : '"' + currentAssetRecord.maintenancePlantZSWERK + '",') +
                      (currentAssetRecord.SystemCodeZSYSCODE == null ? "NULL," : '"' + currentAssetRecord.SystemCodeZSYSCODE + '",') +
                      (currentAssetRecord.zsysDescSystemCodeDescription == null ? "NULL," : '"' + currentAssetRecord.zsysDescSystemCodeDescription + '",') +
                      (currentAssetRecord.funcLocStringZINSTLOCN == null ? "NULL," : '"' + currentAssetRecord.funcLocStringZINSTLOCN + '",') +
                      (currentAssetRecord.zzfl_nc == null ? "NULL," : '"' + currentAssetRecord.zzfl_nc + '",') +
                      (currentAssetRecord.inbdtInstallDate == null ? "NULL" : '"' + currentAssetRecord.inbdtInstallDate + '"') + ')';

    html5sql.process(sqlstatement,
                     function () {
                         callback(true);
                     },
                     function (error, statement) {
                         opErrorMessage("Error: " + error.message + " when processing " + statement);
                         callback(false);
                     }
            );

}
function uploadRecord(item) {
    var myjson = {};
    myjson["Zsite"] = "";
    myjson["MsgTyp"] = "";
    myjson["Message"] = "";

    var ToSurvey = [];
    var survey = {};

    survey["Zncdesc"] = item.ZNCDESC == null ? "" : item.functionTypeZNCDESC;// "BOOSTER PUMP";
    survey["Zascat"] = item.ZASCAT == null ? "" : item.ZASCAT;// "A";
    survey["ZzflNc"] = item.ZZFL_NC == null ? "" : item.ZZFL_NC;// "30BOO";
    survey["ZzwWw"] = item.ZZW_WW == null ? "" : item.ZZW_WW;// "W";
    survey["ZsiteDesc"] = item.ZSITEDESC == null ? "" : item.ZSITEDESC;// "GAINSBOROUGH NEW WW - 02";
    survey["Zsite"] = item.ZSITE;// "GAINWW";
    survey["Eqktx"] = item.EQKTU == null ? "" : item.EQKTU;// "N/A";
    survey["Equnr"] = item.EQUNR == null ? "" : item.EQUNR;// "000000000000123456";
    survey["Zsitesgnoff"] = "";
    survey["Zsurvsub"] = "";
    survey["Zsurv"] = "";
    survey["Zrecnum"] = item.ZRECNUM;// "TESTASSETUPLOAD";
    survey["Herst"] = item.HURST == null ? "" : item.HURST;// "SEEPEX";
    survey["Mapar"] = item.MAPAR == null ? "" : item.MAPAR;// "M2020A";
    survey["Zinstlocn"] = item.ZINSTLOCN == null ? "" : item.ZINSTLOCN;// "GAINWW-1H-FIN-PS02-BOO004";
    survey["Zinslocdesc1"] = item.ZINSLOCDESC1 == null ? "" : item.ZINSLOCDESC1;// "BOOSTER PUMP";
    survey["Zinslocdesc2"] = item.ZINSLOCDESC2 == null ? "" : item.ZINSLOCDESC2;// "-";
    survey["Zinslocdesc3"] = item.ZINSLOCDESC3 == null ? "" : item.ZINSLOCDESC3;// "HIGHLIFT PUMP  5";
    survey["Zinslocdesc"] = item.ZINSLOCDESC == null ? "" : item.ZINSLOCDESC;// "BOOSTER PUMP - HIGHLIFT PUMP  5";
    survey["ZzeqptEgi"] = item.ZZEQPT_EGI == null ? "" : item.ZZEQPT_EGI;// "3003";
    survey["Zotdesc"] = item.ZOTDESC == null ? "" : item.ZOTDESC;// "CENTRIFUGAL HORIZONTAL SPINDLE PUMP";
    survey["Zprg"] = item.ZPRG == null ? "" : item.ZPRG;// "1H";
    survey["Zprgdesc"] = item.ZPRGDESC == null ? "" : item.ZPRGDESC;// "TREATED WATER PUMPING";
    survey["Zplgrp"] = item.ZPLGRP == null ? "" : item.ZPLGRP;// "FIN";
    survey["Zplgdesc"] = item.ZPLGDESC == null ? "" : item.ZPLGDESC;// "FINAL WATER PUMPING";
    survey["Zsyscode"] = item.ZSYSCODE == null ? "" : item.ZSYSCODE;
    survey["Zsysdesc"] = item.ZSYSDESC == null ? "" : item.ZSYSDESC;// "N/A";
    survey["Zparlocn"] = item.ZPARLOCN == null ? "" : item.ZPARLOCN;// "";
    survey["Zpequnr"] = item.ZPEQUNR == null ? "" : item.ZPEQUNR;// "";
    survey["Zparecnum"] = item.ZPARECNUM == null ? "" : item.ZPARECNUM;
    survey["Zdecom"] = item.ZDECOM == null ? "" : item.ZDECOM;// "";
    survey["Zdecomr"] = item.ZDECOMR == null ? "" : item.ZDECOMR;// "";
    survey["Zeqdecom"] = item.ZEQDECOM == null ? "" : item.ZEQDECOM;// "";
    survey["Ernam"] = localStorage.getItem("MobileUser");
    survey["Termab"] = getDate();
    survey["Erfzeit"] = formatTime2(getTime());// "PT00H00M00S";
    survey["Zowner"] = item.ZOWNER == null ? "" : item.ZOWNER;//Not Used on the Client - can be deleted.
    survey["Zproctyp"] = item.ZPROCTYP == null ? "" : item.ZPROCTYP;// "";
    survey["Zcomflg"] = item.ZCOMFLG == null ? "" : item.ZCOMFLG;// Don't think this is used ?
    survey["Inbdt"] = item.INBDT == null ? "" : item.INBDT;// "00000000";
    survey["Zsern1"] = item.ZSERN1 == null ? "" : item.ZSERN1;// Duplicate of SERGE  ?
    survey["Serge"] = item.SERGE == null ? "" : item.SERGE;// "";
    survey["Zzassettag"] = item.ZZASSETTAG == null ? "" : item.ZZASSETTAG;// "";
    survey["Zdocflg"] = item.ZDOCFLG == null ? "" : item.ZDOCFLG;// "";
    survey["StatusProfile"] = item.STATUS_PROFILE == null ? "" : item.STATUS_PROFILE;// "";//TODO: What is StatusProfile ?
    survey["Estat"] = item.ESTAT == null ? "" : item.ESTAT;// "";//TODO: What is Estat ?
    survey["StatusTxt"] = item.STATUS_TXT == null ? "" : item.STATUS_TXT;// "N/A";
    survey["Zcomments1"] = item.ZCOMMENTS1 == null ? "" : item.ZCOMMENTS1;// "";
    survey["Zcomments2"] = item.ZCOMMENTS2 == null ? "" : item.ZCOMMENTS2;;
    survey["Zdocpath"] = item.ZDOCPATH == null ? "" : item.ZDOCPATH;// "";
    survey["ZGpsnmea"] = item.Z_GPSNMEA == null ? "" : item.Z_GPSNMEA;// "";
    survey["ZcapSurv"] = item.ZCAPDEL_SURVEY == null ? "" : item.ZCAPDEL_SURVEY;// "";
    survey["Zproj"] = item.ZPROJ_CODE == null ? "" : item.ZPROJ_CODE; "";
    survey["ZcheckOut"] = item.ZCHECK_OUT == null ? "" : item.ZCHECK_OUT; "";
    survey["ZchkoutBy"] = item.ZCHECKOUT_TO == null ? "" : item.ZCHECKOUT_TO; "";
    survey["ZchkoutDate"] = item.ZCHECKOUT_DATE == null ? "" : item.ZCHECKOUT_DATE;//
    survey["Deleted"] = item.ZDELETED == null ? "" : item.ZDELETED;// "";
    survey["Zasstype"] = item.ZASSTYPE == null ? "" : item.ZASSTYPE.substring(1, 3);// "";
    survey["Zassdesc"] = item.ZASSDESC == null ? "" : item.ZASSDESC;// "";
    survey["Ziwerk"] = item.ZIWERK == null ? "" : item.ZIWERK;// "";
    survey["Zswerk"] = item.ZSWERK == null ? "" : item.ZSWERK;// ""

    ToSurvey.push(survey);
    myjson["toSurvey"] = ToSurvey;




    //var myjson = {};
    //myjson["Zsite"] = "";
    //myjson["MsgTyp"] = "";
    //myjson["Message"] = "";

    //var ToSurvey = [];
    //var survey = {};

    //survey["Zncdesc"] = "BOOSTER PUMP";
    //survey["Zascat"] = "A";
    //survey["ZzflNc"] = "30BOO";
    //survey["ZzwWw"] = "W";

    // survey["ZsiteDesc"] = "";
    // survey["Zsite"] = "GAINWW";
    // survey["Eqktx"] = "N/A";



    // survey["Equnr"] = "000000000000123456";

    //survey["Zsitesgnoff"] = "";
    //survey["Zsurvsub"] = "";
    //survey["Zsurv"] = "";
    //survey["Zrecnum"] = "TESTASSETUPLOA1";
    //survey["Herst"] = "SEEPEX";
    //survey["Mapar"] = "M2020A";
    //survey["Zinstlocn"] = "GAINWW-1H-FIN-PS02-BOO004";
    //survey["Zinslocdesc1"] = "BOOSTER PUMP";
    //survey["Zinslocdesc2"] = "-";
    //survey["Zinslocdesc3"] = "HIGHLIFT PUMP  5";
    //survey["Zinslocdesc"] = "BOOSTER PUMP - HIGHLIFT PUMP  5";
    //survey["ZzeqptEgi"] = "3003";
    //survey["Zotdesc"] = "CENTRIFUGAL HORIZONTAL SPINDLE PUMP";
    //survey["Zprg"] = "1H";

    // survey["Zprgdesc"] = "TREATED WATER PUMPING";
    // survey["Zplgrp"] = "FIN";
    // survey["Zplgdesc"] = "FINAL WATER PUMPING";

    //survey["Zsyscode"] = "";
    //survey["Zsysdesc"] = "N/A";
    //survey["Zparlocn"] = "";
    // survey["Zpequnr"] = "";
    //survey["Zparecnum"] = "";
    //survey["Zdecom"] = "";
    //survey["Zdecomr"] = "";
    //survey["Zeqdecom"] = "";
    //survey["Ernam"] = "";
    //survey["Termab"] = "";

    //survey["Erfzeit"] = "PT00H00M00S";
    // survey["Zowner"] = "";
    // survey["Zproctyp"] = "";
    // survey["Zcomflg"] = "";
    // survey["Inbdt"] = "00000000";
    // survey["Zsern1"] = "";
    // survey["Serge"] = "";
    // survey["Zzassettag"] = "";
    // survey["Zdocflg"] = "";
    // survey["StatusProfile"] = "";

    //survey["Estat"] = "";
    //survey["StatusTxt"] = "";
    //survey["Zcomments1"] = "";
    //survey["Zcomments2"] = "";
    //survey["Zdocpath"] = "";
    //survey["ZGpsnmea"] = "";
    //survey["ZcapSurv"] = "";
    //survey["Zproj"] = "";
    //survey["ZcheckOut"] = "";
    //survey["ZchkoutBy"] = "";

    //survey["ZchkoutDate"] = "";
    //survey["Deleted"] = "";
    // survey["Zasstype"] = "XX";
    //survey["Zassdesc"] = "";
    //survey["Ziwerk"] = "";
    //survey["Zswerk"] = ""
    //ToSurvey.push(survey);
    //myjson["toSurvey"] = ToSurvey;







    SAPServerPrefix = $.trim(localStorage.getItem('ServerName'));
   postAzureData("ZGW_MAM30_ASSET_SURVEY_UPL", myjson, "", survey["Zrecnum"])

}

function uploadAllRecords() {
    sqlstatement = 'Select * from AssetUpload ';
    html5sql.process(sqlstatement,
            function (transaction, results, rowsArray) {
                if (rowsArray.length > 0) {
                    for (var n = 0; n < rowsArray.length; n++) {
                        item = rowsArray[n];
                        uploadRecord(item);
                    }
                }
            }
    )
}

function generateZrecnum() {
    var now = new Date();
   return localStorage.getItem("MobileUser") +
                       now.getFullYear() + ("0" + (now.getMonth() + 1)).slice(-2) + ("0" + (now.getDate())).slice(-2) + ("0" + (now.getHours())).slice(-2) +
                        ("0" + (now.getMinutes())).slice(-2) + ("0" + (now.getSeconds())).slice(-2) + ("0" + (now.getMilliseconds())).slice(-3)
}
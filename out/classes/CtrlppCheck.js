"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
var vscode = require("vscode");
var fs_1 = require("fs");
var CtrlppcheckRecord_1 = require("./CtrlppcheckRecord");
var SLTQualityChecks_1 = require("./SLTQualityChecks");
var util_1 = require("../util");
// modules to handle with xml contents
var sxml = require("sxml");
var XML = sxml.XML;
var constants_1 = require("../constants");
var collection = vscode.languages.createDiagnosticCollection("ctrlppcheck");
//--------------------------------------------------------------------------------
var CtrlppCheck = /** @class */ (function () {
    //----------------------------------------------------------------------------
    function CtrlppCheck() {
        this.settings = vscode.workspace.getConfiguration("Ctrl_Ctrlpp.SLTQualityChecks.ctrlppcheck");
        var qc = new SLTQualityChecks_1.SLTQualityChecks();
        this.path = this.determineExePath(qc.path);
        this.cfgPath = qc.path + "\\data\\ctrlPpCheck\\cfg\\";
        this.rulesPath = qc.path + "\\data\\ctrlPpCheck\\rule\\";
        this.records = [];
    }
    //----------------------------------------------------------------------------
    CtrlppCheck.prototype.determineExePath = function (qcPath) {
        if (fs_1.existsSync(qcPath + "\\bin\\ctrlppcheck\\ctrlppcheck.exe")) {
            return qcPath + "\\bin\\ctrlppcheck\\ctrlppcheck";
        }
        else {
            this.showUpdateWarningMessage();
            return qcPath + "\\bin\\ctrlppcheck\\cppcheck";
        }
    };
    //----------------------------------------------------------------------------
    CtrlppCheck.prototype.start = function (fileName) {
        if (this.cfgPath == "" || fs_1.existsSync(this.cfgPath) == false) {
            this.showMissingCtrlppcheck();
            return -1;
        }
        var config = this.cfgPath + "ctrl.xml";
        var cmdstring = new Array(this.path, "--enable=all", "--xml", 
        /// @todo replace project by rely project name
        "--winccoa-projectName=HUGO", "--library=" + config, "--rule-file=" + this.rulesPath + "ctrl.xml");
        if (this.settings.get("inconclusive")) {
            cmdstring.push("--inconclusive");
        }
        if (this.settings.get("verbose")) {
            cmdstring.push("-v");
        }
        if (this.settings.get("inlineSuppressions")) {
            cmdstring.push("--inline-suppr");
        }
        if (this.settings.get("platform") !== "") {
            cmdstring.push("--platform=" + this.settings.get("platform"));
        }
        if (this.settings.get("checkConfig")) {
            cmdstring.push("--check-config");
        }
        cmdstring.push(fileName);
        var result = util_1.runCmd(cmdstring);
        if (this.settings.get("verbose")) {
            console.log("file result is:" + result.stdout);
            console.log("file result error is:" + result.stderr);
        }
        this.handleOutput(result.stderr.toString());
        return 0;
    };
    //----------------------------------------------------------------------------
    CtrlppCheck.prototype.handleOutput = function (xmlreport) {
        util_1.output.append(xmlreport);
        var xml = new XML(xmlreport);
        if (xml.has("errors") == false || xml.get("errors").size() < 1) {
            vscode.window.showErrorMessage("It may be possible that the ctrlppcheck is missing on your computer.");
            return;
        }
        var xmlList = xml
            .get("errors")
            .at(0)
            .get("error");
        this.records = [];
        for (var i = 0; i < xmlList.size(); i++) {
            var item = xmlList.at(i);
            var severity = item.getProperty("severity");
            var id = item.getProperty("id");
            var msg = item.getProperty("msg");
            var verbose = "";
            if (item.hasProperty("verbose")) {
                verbose = item.getProperty("verbose");
            }
            var cwe = 0;
            if (item.hasProperty("cwe")) {
                cwe = Number(item.getProperty("cwe"));
            }
            // get error location
            var line = 0;
            var filePath = "";
            var infos = [];
            if (item.has("location")) {
                var locations = item.get("location");
                if (locations !== undefined && locations.size() > 0) {
                    line = Number(locations.at(0).getProperty("line"));
                    filePath = locations.at(0).getProperty("file");
                    for (var y = 0; y < locations.size(); y++) {
                        var location = locations.at(y);
                        if (location.hasProperty("info")) {
                            infos.push(location.getProperty("info"));
                        }
                    }
                }
            }
            var symbol = "";
            if (item.has("symbol")) {
                var symbols = item.get("symbol");
                if (symbols !== undefined && symbols.size() > 0) {
                    symbol = symbols.at(0).getValue();
                }
            }
            var record = new CtrlppcheckRecord_1.CtrlppcheckRecord(filePath, line, cwe, id, severity, msg, verbose, symbol, infos);
            this.records.push(record);
        }
    };
    //----------------------------------------------------------------------------
    /**
     * @brief Function check if the error is enabed.
     * @details Check if:
     *  + the error is form current opened file.
     *  + the error severity match with enabled severities. See also setting.ctrlppcheck.severity
     *  + the error id does not mathc with black list IDs. See also setting.ctrlppcheck.errId.blackList
     * @param record Error
     * @return true when error is enabled.
     */
    CtrlppCheck.prototype.isErrEnabled = function (record) {
        if (vscode.window.activeTextEditor === undefined) {
            return false;
        }
        var curdoc = vscode.window.activeTextEditor.document;
        // is not this file
        if (curdoc.fileName !== record.file && record.file !== "") {
            return false;
        }
        // check enabled severity
        var str = this.settings.get("severity");
        if (str === undefined) {
            return false;
        }
        if (str !== "" && str !== "all") {
            var severities = str.split(",");
            if (severities.indexOf(record.errPrio) < 0) {
                return false;
            }
        }
        // check error in black list ids
        str = this.settings.get("errId.blackList");
        if (str === undefined) {
            return false;
        }
        if (str !== "") {
            var severities = str.split(",");
            if (severities.indexOf(record.errId) >= 0) {
                return false;
            }
        }
        return true;
    };
    //----------------------------------------------------------------------------
    /**
     * @brief functions shows diagnostic
     */
    CtrlppCheck.prototype.showDiagnostic = function (textDocument) {
        var _this = this;
        var missingLicense = false;
        var diagnostics = [];
        this.records.forEach(function (record) {
            try {
                if (record.errId === "missingLicence" ||
                    record.errId === "missingLicense") {
                    missingLicense = true;
                }
                else if (_this.isErrEnabled(record)) {
                    // error located in line 0 is for whole file.
                    // Ex: license error
                    if (record.line <= 0) {
                        record.line = 1;
                    }
                    // calculate the symbol position
                    var startPos = 0;
                    var endPos = 0;
                    var lineText = textDocument.lineAt(record.line - 1).text;
                    // empty symbol - not all checks returns symbol
                    if (record.symbol !== "") {
                        startPos = lineText.indexOf(record.symbol);
                        endPos = lineText.lastIndexOf(record.symbol);
                        // check if the symbol position is correct
                        // first and last usage of symbol muss have the same index
                        // Ex: in this line is i not defined 'int i2 = i;'
                        // It is not possible to determine the correct postion of i
                        if (startPos === -1 || endPos - startPos !== 0) {
                            startPos = 0;
                            endPos = 0;
                        }
                        else {
                            // it is exact the symbol. In that case is endPos simple.
                            endPos = startPos + record.symbol.length;
                        }
                    }
                    // when we can not determined error position.
                    // Just mark the line without leading spaces
                    if (endPos === 0) {
                        var search = lineText.trim();
                        startPos = lineText.indexOf(search);
                        endPos = lineText.length;
                    }
                    // create error message
                    var errCodeMsg = record.errCode !== 0 ? "(CWE: " + record.errCode.toString() + ")" : "";
                    var errVerbose = record.errVerbose !== "" && record.errVerbose !== record.errMsg
                        ? "\n" + record.errVerbose
                        : "";
                    var infoMsgs_1 = "";
                    if (record.infos.length > 0) {
                        record.infos.forEach(function (info) {
                            infoMsgs_1 += "\n " + info;
                        });
                    }
                    var msg = record.errMsg + " " + errCodeMsg + " " + errVerbose + infoMsgs_1 + "\n " + record.errPrio + " (" + record.errId + "):";
                    // replace FF by CR
                    msg = msg.replace(/\\012/g, "\n");
                    // add the error in diagnostic list
                    record.line--;
                    var dia = new vscode.Diagnostic(new vscode.Range(new vscode.Position(record.line, startPos), new vscode.Position(record.line, endPos)), msg, record.toVsCodeError());
                    dia.code = record.errId;
                    dia.source = "ctrlppcheck";
                    diagnostics.push(dia);
                }
                if (missingLicense) {
                    _this.showMissingLicenseInfo();
                }
            }
            catch (error) {
                console.log("ERROR: " + error);
            }
        });
        collection.clear();
        collection.set(textDocument.uri, diagnostics);
    };
    //----------------------------------------------------------------------------
    /**
     * Function show missing license popup.
     */
    CtrlppCheck.prototype.showMissingLicenseInfo = function () {
        var msg;
        msg =
            "Version is limited to max. 1 error per error ID. To get all " +
                this.records.length +
                " errors, buy the feature CtrlPPCheck on the SloopTools store.";
        msg += "\n\n\n";
        msg += "Visit the SloopTools store for more information.";
        vscode.window.showWarningMessage(msg, "Store").then(function (selection) {
            if (selection === "Store") {
                vscode.env.openExternal(vscode.Uri.parse("https://store.slooptools.com/addon/quality-check-ctrlppcheck"));
            }
        });
    };
    //----------------------------------------------------------------------------
    /**
     * Function show missing ctrlppcheck popup.
     */
    CtrlppCheck.prototype.showMissingCtrlppcheck = function () {
        var msg;
        msg =
            "It may be possible that the Ctrlppcheck is missing on your computer.";
        msg += "\n\n\n";
        msg += "Visit the SloopTools store for more information.";
        vscode.window.showWarningMessage(msg, "Store").then(function (selection) {
            if (selection === "Store") {
                vscode.env.openExternal(vscode.Uri.parse("https://store.slooptools.com/addon/quality-check-ctrlppcheck"));
            }
        });
    };
    //----------------------------------------------------------------------------
    CtrlppCheck.prototype.showUpdateWarningMessage = function () {
        var update = "How to update";
        var action = vscode.window.showWarningMessage("Please update the " + constants_1.Constants.ctrlppcheckAddonName + " Add-on.", update);
        action.then(function (value) {
            if (value && value === update) {
                vscode.env.openExternal(vscode.Uri.parse("https://docu.slooptools.com/en/services/installer.html#add-on"));
            }
        });
    };
    return CtrlppCheck;
}());
exports.CtrlppCheck = CtrlppCheck;
//# sourceMappingURL=CtrlppCheck.js.map
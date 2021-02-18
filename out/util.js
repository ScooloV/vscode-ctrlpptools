"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Registry = require("winreg");
var fs = require("fs");
var vscode = require("vscode");
var cross_spawn = require("cross-spawn");
exports.output = vscode.window.createOutputChannel("CTRL/CTRL++");
function determineCtrlppCheckInstallPath(cb) {
    getSltAddonInstallPathFromRegistry(function (addonInstallPath) {
        addonInstallPath += "\\SLT_QualityChecks";
        getLatestQualityCheckDirectory(addonInstallPath, function (directory) {
            addonInstallPath += "\\" + directory;
            addonInstallPath += "\\SLT_QualityChecks";
            cb(addonInstallPath);
        });
    });
}
exports.determineCtrlppCheckInstallPath = determineCtrlppCheckInstallPath;
function runCmd(params) {
    var cmd = params.shift() || "echo";
    console.log("executing: ", cmd, params.join(" "));
    return cross_spawn.sync(cmd, params, {
        windowsHide: true,
        encoding: "utf-8",
        maxBuffer: 5 * 1024 * 1024 //set maxBuffer to 5MB beacuse of files like aes.ctl
    });
}
exports.runCmd = runCmd;
function getSltAddonInstallPathFromRegistry(cb) {
    var regKey = new Registry({
        hive: Registry.HKCU,
        key: "\\Software\\JavaSoft\\Prefs\\com\\slooptools\\installer\\controller" // key containing install path of SLTAddons
    });
    regKey.get("installation/Path", function (err, result) {
        if (err) {
            cb("C:\\SloopTools\\Addons");
        }
        else {
            var path = result.value
                .replace(new RegExp("///", "g"), "\\")
                .replace(new RegExp("/", "g"), "");
            //.replace(new RegExp('\\\\', 'g'), '/');
            cb(path);
        }
    });
}
function getLatestQualityCheckDirectory(path, cb) {
    fs.readdir(path, function (err, items) {
        if (err) {
            vscode.window.showWarningMessage("Could not find SLT_QualityChecks directory.");
            return "WinCC_OA_3_16";
        }
        items.sort();
        items.reverse();
        cb(items[0]);
    });
}
//# sourceMappingURL=util.js.map
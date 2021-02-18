"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var extension_1 = require("../extension");
var util_1 = require("../util");
var vscode = require("vscode");
var pathFromSettings = vscode.workspace
    .getConfiguration("Ctrl_Ctrlpp.SLTQualityChecks")
    .get("path");
//--------------------------------------------------------------------------------
var SLTQualityChecks = /** @class */ (function () {
    function SLTQualityChecks() {
        if (pathFromSettings == "") {
            this.path = extension_1.sltQcDetecedPath;
        }
        else {
            this.path = pathFromSettings;
        }
        util_1.output.appendLine("Following path will be used: " + this.path);
    }
    return SLTQualityChecks;
}());
exports.SLTQualityChecks = SLTQualityChecks;
//# sourceMappingURL=SLTQualityChecks.js.map
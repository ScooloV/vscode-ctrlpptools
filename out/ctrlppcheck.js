"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
var vscode = require("vscode");
var CtrlppCheck_1 = require("./classes/CtrlppCheck");
//--------------------------------------------------------------------------------
function ctrlppcheckCurrentFile() {
    if (vscode.window.activeTextEditor === undefined) {
        return;
    }
    var curdoc = vscode.window.activeTextEditor.document;
    ctrlppcheckFile(curdoc);
}
exports.ctrlppcheckCurrentFile = ctrlppcheckCurrentFile;
//--------------------------------------------------------------------------------
function ctrlppcheckFile(textDocument) {
    if (textDocument.languageId !== "ctrlpp" &&
        textDocument.languageId !== "ctrl") {
        return;
    }
    var check = new CtrlppCheck_1.CtrlppCheck();
    if (check.start(textDocument.fileName) != 0) {
        return;
    }
    check.showDiagnostic(textDocument);
}
//# sourceMappingURL=ctrlppcheck.js.map
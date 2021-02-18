"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
var vscode = require("vscode");
var util = require("./util");
var fs_1 = require("fs");
var CtrlKnownItems_1 = require("./classes/CtrlKnownItems");
var CtrlKnownItem_1 = require("./classes/CtrlKnownItem");
var ctrlppcheck_1 = require("./ctrlppcheck");
//--------------------------------------------------------------------------------
var extensionPath = "";
//--------------------------------------------------------------------------------
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function activate(context) {
    //context: { subscriptions: any[]; }) {
    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    util.determineCtrlppCheckInstallPath(function (path) {
        exports.sltQcDetecedPath = path;
    });
    extensionPath = context.extensionPath;
    context.subscriptions.push(vscode.commands.registerCommand("ctrlcheckcmd.ctrlppcheck", function () {
        // The code you place here will be executed every time your command is executed
        ctrlppcheck_1.ctrlppcheckCurrentFile();
    }));
    vscode.window.onDidChangeActiveTextEditor(function (textEditor) {
        ctrlppcheck_1.ctrlppcheckCurrentFile();
    });
    // check on document save
    vscode.workspace.onDidSaveTextDocument(function (textDocument) {
        ctrlppcheck_1.ctrlppcheckCurrentFile();
    });
    fillKnownCtrlItems();
    var complCtrlPpCheck = vscode.languages.registerCompletionItemProvider("ctrlpp", {
        // for good example look also here
        // https://github.com/microsoft/vscode-extension-samples/blob/master/completions-sample/src/extension.ts
        provideCompletionItems: function (document, position, token, context) {
            var range = document.getWordRangeAtPosition(position);
            var word = document.getText(range);
            var completions = new Array();
            var matchedKeys = CtrlKnownItems_1.CtrlKnownItems.getMatchedKeys(word);
            matchedKeys.forEach(function (element) {
                var item = CtrlKnownItems_1.CtrlKnownItems.get(element);
                var docuStr = item.toString();
                var snippetCompletion = new vscode.CompletionItem(element, item.getCompletionItemKind());
                snippetCompletion.insertText = new vscode.SnippetString(item.getSnippetString());
                if (docuStr !== "") {
                    snippetCompletion.documentation = new vscode.MarkdownString(docuStr);
                }
                completions.push(snippetCompletion);
            });
            return completions;
        }
    });
    context.subscriptions.push(complCtrlPpCheck);
    vscode.languages.registerHoverProvider("ctrlpp", {
        provideHover: function (document, position, token) {
            var range = document.getWordRangeAtPosition(position);
            var word = document.getText(range);
            if (CtrlKnownItems_1.CtrlKnownItems.hasItem(word)) {
                var item = CtrlKnownItems_1.CtrlKnownItems.get(word);
                var docuStr = item.toString();
                if (docuStr !== "") {
                    return new vscode.Hover(docuStr, range);
                }
            }
        }
    });
    console.log('Congratulations, your extension "ctrlpp" is now active!');
}
exports.activate = activate;
//--------------------------------------------------------------------------------
// this method is called when your extension is deactivated
function deactivate() { }
exports.deactivate = deactivate;
//--------------------------------------------------------------------------------
/// Fill hovers mapping with all possible values
function fillKnownCtrlItems() {
    fs_1.readdir(extensionPath + "/definitions", function (err, files) {
        files.forEach(function (file) {
            fs_1.readFile(extensionPath + "/definitions/" + file, handleJSONFile);
        });
    });
}
// Handle the data
var handleJSONFile = function (err, data) {
    if (err) {
        throw err;
    }
    var json = JSON.parse(data);
    var format = "";
    if (json.hover.format) {
        format = json.hover.format;
    }
    var completionItemKind = "";
    if (json.completionItemKind) {
        completionItemKind = json.completionItemKind;
    }
    json.defines.forEach(function (element) {
        var item = new CtrlKnownItem_1.CtrlKnownItem();
        item.fromJsonItem(element, format, completionItemKind);
        CtrlKnownItems_1.CtrlKnownItems.add(item);
    });
};
//# sourceMappingURL=extension.js.map
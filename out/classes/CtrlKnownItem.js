"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
var vscode = require("vscode");
var CtrlComment_1 = require("./CtrlComment");
//--------------------------------------------------------------------------------
/**
 * Ctrl constant item
 */
var CtrlKnownItem = /** @class */ (function () {
    function CtrlKnownItem() {
        //----------------------------------------------------------------------------
        this.name = "";
        this.docuStr = "";
        this.completionItemKind = vscode.CompletionItemKind.Text;
    }
    //----------------------------------------------------------------------------
    /**
     * Returns the item kind.
     */
    CtrlKnownItem.prototype.getCompletionItemKind = function () {
        return this.completionItemKind;
    };
    //----------------------------------------------------------------------------
    /**
     * Convert ctrl constant item to human readeable string.
     * Used for completion provider.
     * @return markdown string
     */
    CtrlKnownItem.prototype.toString = function () {
        return this.docuStr;
    };
    //----------------------------------------------------------------------------
    CtrlKnownItem.prototype.getSnippetString = function () {
        if (this.completionItemKind == vscode.CompletionItemKind.Function) {
            return this.name + "($0)";
        }
        return this.name;
    };
    //----------------------------------------------------------------------------
    CtrlKnownItem.prototype.fromJsonItem = function (element, format, completionItemKind) {
        this.name = element.id;
        if (format !== "") {
            var docu = "";
            if (element.description) {
                docu = CtrlComment_1.CtrlComment.doxyStringToMdString(element.description.join("\n"));
            }
            var definition = "";
            if (element.definition) {
                definition = element.definition;
            }
            var text = format.replace("${definition}", definition);
            text = text.replace("${description}", docu);
            this.docuStr = text;
        }
        if (element.completionItemKind) {
            completionItemKind = element.completionItemKind;
        }
        if (completionItemKind !== undefined) {
            this.completionItemKind = vscode.CompletionItemKind[completionItemKind];
        }
    };
    return CtrlKnownItem;
}());
exports.CtrlKnownItem = CtrlKnownItem;
//# sourceMappingURL=CtrlKnownItem.js.map
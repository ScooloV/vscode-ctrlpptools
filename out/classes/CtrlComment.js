"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var CtrlComment = /** @class */ (function () {
    function CtrlComment() {
    }
    CtrlComment.initReplkeys = function () {
        if (this.doxyKeys.length > 0) {
            return;
        }
        this.doxyKeys.push("/**");
        this.mdKeys.push("");
        this.doxyKeys.push("*/");
        this.mdKeys.push("");
        this.doxyKeys.push("@brief");
        this.mdKeys.push("");
        this.doxyKeys.push("@details");
        this.mdKeys.push("");
        this.doxyKeys.push(new RegExp("@availability ", "g")); // '@availability');
        this.mdKeys.push("### Availability\n");
        this.doxyKeys.push(new RegExp("@code{.ctl}", "g"));
        this.mdKeys.push("```");
        this.doxyKeys.push(new RegExp("@code", "g"));
        this.mdKeys.push("```");
        this.doxyKeys.push(new RegExp("@endcode", "g"));
        this.mdKeys.push("```");
        // this.doxyKeys.push(new RegExp('\n', 'g'));
        // this.mdKeys.push('\n\n');
        this.doxyKeys.push(new RegExp("@example\\s*\\$exampleRelPath.*", "g"));
        this.mdKeys.push("");
        this.doxyKeys.push(new RegExp("@snippets*$exampleRelPath.*", "g"));
        this.mdKeys.push("");
        // function params
        this.doxyKeys.push("@param[in] ");
        this.mdKeys.push("+ **In parameter:** ");
        this.doxyKeys.push("@param[out] ");
        this.mdKeys.push("+ **Out parameter:** ");
        this.doxyKeys.push("@param[inout] ");
        this.mdKeys.push("+ **In/Out parameter:** ");
        this.doxyKeys.push("@param ");
        this.mdKeys.push("+ **Parameter:** ");
        this.doxyKeys.push("@return ");
        this.mdKeys.push("**Return:** ");
        // exceptions, warnings notes
        this.doxyKeys.push(new RegExp("@exception ", "g"));
        this.mdKeys.push("### Exception\n");
        this.doxyKeys.push(new RegExp("@warning ", "g"));
        this.mdKeys.push("### Warning\n");
        this.doxyKeys.push(new RegExp("@note ", "g"));
        this.mdKeys.push("### Note\n");
    };
    //----------------------------------------------------------------------------
    CtrlComment.doxyStringToMdString = function (doxyStr) {
        if (doxyStr === "")
            return "";
        var text = doxyStr;
        CtrlComment.initReplkeys();
        if (text.startsWith("/**")) {
            text = text.substr(3);
        }
        if (text.endsWith("*/")) {
            text = text.substr(0, text.length - 2);
        }
        for (var index = 0; index < CtrlComment.doxyKeys.length; index++) {
            var doxyKey = CtrlComment.doxyKeys[index];
            var mdKey = CtrlComment.mdKeys[index];
            text = text.replace(doxyKey, mdKey);
        }
        return text;
    };
    CtrlComment.doxyKeys = new Array();
    CtrlComment.mdKeys = new Array();
    return CtrlComment;
}());
exports.CtrlComment = CtrlComment;
//# sourceMappingURL=CtrlComment.js.map
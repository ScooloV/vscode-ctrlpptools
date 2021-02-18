"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
var vscode = require("vscode");
//--------------------------------------------------------------------------------
var CtrlppcheckRecord = /** @class */ (function () {
    function CtrlppcheckRecord(file, line, errCode, errId, errPrio, errMsg, errVerbose, symbol, infos) {
        this.file = file;
        this.line = line;
        this.errCode = errCode;
        this.errId = errId;
        this.errPrio = errPrio;
        this.errMsg = errMsg;
        this.errVerbose = errVerbose;
        this.symbol = symbol;
        this.infos = infos;
        this.errPrioMap = {
            error: vscode.DiagnosticSeverity.Error,
            warning: vscode.DiagnosticSeverity.Warning,
            style: vscode.DiagnosticSeverity.Warning,
            performance: vscode.DiagnosticSeverity.Warning,
            portability: vscode.DiagnosticSeverity.Warning,
            debug: vscode.DiagnosticSeverity.Hint,
            information: vscode.DiagnosticSeverity.Information
        };
    }
    // Enabled sevirities:\nerror\nwarning\nstyle\nperformance\nportability\ninformation\ndebug\nall"
    //
    CtrlppcheckRecord.prototype.toVsCodeError = function () {
        return this.errPrioMap[this.errPrio] || vscode.DiagnosticSeverity.Error;
    };
    return CtrlppcheckRecord;
}());
exports.CtrlppcheckRecord = CtrlppcheckRecord;
//# sourceMappingURL=CtrlppcheckRecord.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tstl_1 = require("tstl");
//--------------------------------------------------------------------------------
/**
 * Contains all known ctrl items (functions, constants, ...)
 */
var CtrlKnownItems = /** @class */ (function () {
    function CtrlKnownItems() {
    }
    //------------------------------------------------------------------------------
    CtrlKnownItems.hasItem = function (itemId) {
        return this.items[itemId] !== undefined;
    };
    //------------------------------------------------------------------------------
    CtrlKnownItems.get = function (itemId) {
        return this.items[itemId];
    };
    //------------------------------------------------------------------------------
    CtrlKnownItems.add = function (item) {
        this.items[item.name] = item;
        if (this.allKeys.indexOf(item.name) < 0) {
            this.allKeys.push(item.name);
        }
    };
    //------------------------------------------------------------------------------
    CtrlKnownItems.getMatchedKeys = function (word) {
        var matchedKeys = new Array();
        this.allKeys.forEach(function (element) {
            if (element !== undefined &&
                element.toLowerCase().startsWith(word.toLowerCase())) {
                matchedKeys.push(element);
            }
        });
        return matchedKeys;
    };
    //------------------------------------------------------------------------------
    CtrlKnownItems.items = new tstl_1.HashMap();
    CtrlKnownItems.allKeys = new Array();
    return CtrlKnownItems;
}());
exports.CtrlKnownItems = CtrlKnownItems;
//# sourceMappingURL=CtrlKnownItems.js.map
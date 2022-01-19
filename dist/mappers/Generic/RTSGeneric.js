"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const overkiz_client_1 = require("overkiz-client");
const RollerShutter_1 = __importDefault(require("../RollerShutter"));
class RTSGeneric extends RollerShutter_1.default {
    getTargetCommands(value) {
        if (value === 0) {
            return new overkiz_client_1.Command('down');
        }
        else {
            return new overkiz_client_1.Command('up');
        }
    }
}
exports.default = RTSGeneric;
//# sourceMappingURL=RTSGeneric.js.map
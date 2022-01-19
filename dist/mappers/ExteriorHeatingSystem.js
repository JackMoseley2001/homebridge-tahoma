"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const overkiz_client_1 = require("overkiz-client");
const HeatingSystem_1 = __importDefault(require("./HeatingSystem"));
class ExteriorHeatingSystem extends HeatingSystem_1.default {
    registerServices() {
        this.registerSwitchService();
    }
    getOnCommands(value) {
        return new overkiz_client_1.Command(value ? 'on' : 'off');
    }
}
exports.default = ExteriorHeatingSystem;
//# sourceMappingURL=ExteriorHeatingSystem.js.map
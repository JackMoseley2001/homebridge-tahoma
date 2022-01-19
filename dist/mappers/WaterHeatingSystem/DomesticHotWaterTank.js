"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const overkiz_client_1 = require("overkiz-client");
const WaterHeatingSystem_1 = __importDefault(require("../WaterHeatingSystem"));
class DomesticHotWaterTank extends WaterHeatingSystem_1.default {
    registerServices() {
        this.registerSwitchService('boost');
    }
    getOnCommands(value) {
        return new overkiz_client_1.Command('setForceHeating', value ? 'on' : 'off');
    }
    onStateChanged(name, value) {
        var _a;
        switch (name) {
            case 'io:ForceHeatingState':
                (_a = this.on) === null || _a === void 0 ? void 0 : _a.updateValue(value === 'on');
                break;
        }
    }
}
exports.default = DomesticHotWaterTank;
//# sourceMappingURL=DomesticHotWaterTank.js.map
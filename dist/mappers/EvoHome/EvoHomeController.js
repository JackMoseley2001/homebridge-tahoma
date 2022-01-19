"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Platform_1 = require("../../Platform");
const overkiz_client_1 = require("overkiz-client");
const HeatingSystem_1 = __importDefault(require("../HeatingSystem"));
class EvoHomeController extends HeatingSystem_1.default {
    registerServices() {
        var _a;
        this.registerThermostatService();
        (_a = this.targetState) === null || _a === void 0 ? void 0 : _a.setProps({ validValues: [
                Platform_1.Characteristics.TargetHeatingCoolingState.AUTO,
                Platform_1.Characteristics.TargetHeatingCoolingState.OFF,
            ] });
    }
    getTargetStateCommands(value) {
        switch (value) {
            case Platform_1.Characteristics.TargetHeatingCoolingState.AUTO:
                return new overkiz_client_1.Command('setOperatingMode', 'auto');
            case Platform_1.Characteristics.TargetHeatingCoolingState.OFF:
                return new overkiz_client_1.Command('setOperatingMode', 'off');
        }
    }
}
exports.default = EvoHomeController;
//# sourceMappingURL=EvoHomeController.js.map
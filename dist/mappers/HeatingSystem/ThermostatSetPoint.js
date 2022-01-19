"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Platform_1 = require("../../Platform");
const overkiz_client_1 = require("overkiz-client");
const HeatingSystem_1 = __importDefault(require("../HeatingSystem"));
class ThermostatSetPoint extends HeatingSystem_1.default {
    constructor() {
        super(...arguments);
        this.TARGET_MODES = [
            Platform_1.Characteristics.TargetHeatingCoolingState.AUTO,
        ];
    }
    registerServices() {
        var _a, _b;
        this.registerThermostatService();
        (_a = this.targetState) === null || _a === void 0 ? void 0 : _a.updateValue(Platform_1.Characteristics.TargetHeatingCoolingState.AUTO);
        (_b = this.currentState) === null || _b === void 0 ? void 0 : _b.updateValue(Platform_1.Characteristics.CurrentHeatingCoolingState.HEAT);
    }
    getTargetTemperatureCommands(value) {
        return new overkiz_client_1.Command('setHeatingTargetTemperature', value);
    }
    onStateChanged(name, value) {
        var _a;
        switch (name) {
            case 'zwave:SetPointHeatingValueState':
            case 'core:RoomTemperatureState':
                this.onTemperatureUpdate(value);
                break;
            case 'core:HeatingTargetTemperatureState':
                (_a = this.targetTemperature) === null || _a === void 0 ? void 0 : _a.updateValue(value);
                break;
        }
    }
}
exports.default = ThermostatSetPoint;
//# sourceMappingURL=ThermostatSetPoint.js.map
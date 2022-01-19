"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Platform_1 = require("../../Platform");
const overkiz_client_1 = require("overkiz-client");
const HeatingSystem_1 = __importDefault(require("../HeatingSystem"));
class ValveHeatingTemperatureInterface extends HeatingSystem_1.default {
    constructor() {
        super(...arguments);
        this.TARGET_MODES = [
            Platform_1.Characteristics.TargetHeatingCoolingState.AUTO,
            Platform_1.Characteristics.TargetHeatingCoolingState.HEAT,
            Platform_1.Characteristics.TargetHeatingCoolingState.COOL,
            Platform_1.Characteristics.TargetHeatingCoolingState.OFF,
        ];
    }
    registerServices() {
        this.registerThermostatService();
    }
    getTargetStateCommands(value) {
        switch (value) {
            case Platform_1.Characteristics.TargetHeatingCoolingState.AUTO:
                return new overkiz_client_1.Command('exitDerogation');
            case Platform_1.Characteristics.TargetHeatingCoolingState.HEAT:
                return new overkiz_client_1.Command('setDerogation', ['comfort', 'further_notice']);
            case Platform_1.Characteristics.TargetHeatingCoolingState.COOL:
                return new overkiz_client_1.Command('setDerogation', ['eco', 'further_notice']);
            case Platform_1.Characteristics.TargetHeatingCoolingState.OFF:
                return new overkiz_client_1.Command('setDerogation', ['away', 'further_notice']);
        }
    }
    getTargetTemperatureCommands(value) {
        return new overkiz_client_1.Command('setDerogation', [value, 'further_notice']);
    }
    onStateChanged(name, value) {
        var _a;
        super.onStateChanged(name, value);
        switch (name) {
            case 'core:OperatingModeState':
            case 'io:CurrentHeatingModeState':
                this.postpone(this.computeStates);
                break;
            case 'core:TargetRoomTemperatureState':
                (_a = this.targetTemperature) === null || _a === void 0 ? void 0 : _a.updateValue(value);
                break;
        }
    }
    computeStates() {
        var _a, _b, _c;
        let targetState;
        const auto = ['auto', 'prog', 'program'].includes(this.device.get('core:OperatingModeState') || '');
        switch (this.device.get('io:CurrentHeatingModeState')) {
            case 'manual':
            case 'comfort':
                (_a = this.currentState) === null || _a === void 0 ? void 0 : _a.updateValue(Platform_1.Characteristics.CurrentHeatingCoolingState.HEAT);
                targetState = auto ? Platform_1.Characteristics.TargetHeatingCoolingState.AUTO : Platform_1.Characteristics.TargetHeatingCoolingState.HEAT;
                break;
            case 'eco':
                (_b = this.currentState) === null || _b === void 0 ? void 0 : _b.updateValue(Platform_1.Characteristics.CurrentHeatingCoolingState.COOL);
                targetState = auto ? Platform_1.Characteristics.TargetHeatingCoolingState.AUTO : Platform_1.Characteristics.TargetHeatingCoolingState.COOL;
                break;
            case 'off':
            case 'awayMode':
            case 'frostprotection':
                (_c = this.currentState) === null || _c === void 0 ? void 0 : _c.updateValue(Platform_1.Characteristics.CurrentHeatingCoolingState.OFF);
                targetState = Platform_1.Characteristics.TargetHeatingCoolingState.OFF;
                break;
        }
        if (this.targetState !== undefined && targetState !== undefined && this.isIdle) {
            this.targetState.updateValue(targetState);
        }
    }
}
exports.default = ValveHeatingTemperatureInterface;
//# sourceMappingURL=ValveHeatingTemperatureInterface.js.map
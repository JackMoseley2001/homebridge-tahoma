"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Platform_1 = require("../../Platform");
const overkiz_client_1 = require("overkiz-client");
const HeatingSystem_1 = __importDefault(require("../HeatingSystem"));
class AtlanticElectricalHeaterWithAdjustableTemperatureSetpoint extends HeatingSystem_1.default {
    constructor() {
        super(...arguments);
        this.THERMOSTAT_CHARACTERISTICS = ['prog'];
        this.MIN_TEMP = 16;
        this.MAX_TEMP = 28;
        this.TARGET_MODES = [
            Platform_1.Characteristics.TargetHeatingCoolingState.AUTO,
            Platform_1.Characteristics.TargetHeatingCoolingState.OFF,
        ];
    }
    registerServices() {
        if (this.device.get('io:NativeFunctionalLevelState') === 'Top') {
            this.TARGET_MODES.push(Platform_1.Characteristics.TargetHeatingCoolingState.HEAT);
        }
        this.registerThermostatService();
    }
    getTargetStateCommands(value) {
        var _a, _b;
        switch (value) {
            case Platform_1.Characteristics.TargetHeatingCoolingState.AUTO:
                if (this.device.get('io:NativeFunctionalLevelState') === 'Top') {
                    return new overkiz_client_1.Command('setOperatingMode', 'auto');
                }
                else {
                    return new overkiz_client_1.Command('setOperatingMode', ((_a = this.prog) === null || _a === void 0 ? void 0 : _a.value) ? 'internal' : 'basic');
                }
            case Platform_1.Characteristics.TargetHeatingCoolingState.HEAT:
                if (this.device.get('io:NativeFunctionalLevelState') === 'Top') {
                    return new overkiz_client_1.Command('setOperatingMode', ((_b = this.prog) === null || _b === void 0 ? void 0 : _b.value) ? 'internal' : 'basic');
                }
                break;
            case Platform_1.Characteristics.TargetHeatingCoolingState.OFF:
                return new overkiz_client_1.Command('setOperatingMode', 'standby');
        }
        return [];
    }
    getTargetTemperatureCommands(value) {
        var _a;
        if ((_a = this.prog) === null || _a === void 0 ? void 0 : _a.value) {
            return new overkiz_client_1.Command('setDerogatedTargetTemperature', value);
        }
        else {
            return new overkiz_client_1.Command('setTargetTemperature', value);
        }
    }
    onStateChanged(name, value) {
        var _a;
        switch (name) {
            case 'core:TemperatureState':
                this.onTemperatureUpdate(value);
                break;
            case 'io:EffectiveTemperatureSetpointState':
                //case 'core:TargetTemperatureState': 
                (_a = this.targetTemperature) === null || _a === void 0 ? void 0 : _a.updateValue(value);
                break;
            case 'io:TargetHeatingLevelState':
            case 'core:OperatingModeState':
                this.postpone(this.computeStates);
                break;
        }
    }
    computeStates() {
        var _a, _b, _c, _d, _e, _f, _g;
        let targetState;
        targetState = Platform_1.Characteristics.TargetHeatingCoolingState.AUTO;
        switch (this.device.get('core:OperatingModeState')) {
            case 'off':
            case 'away':
            case 'frostprotection':
            case 'standby':
                targetState = Platform_1.Characteristics.TargetHeatingCoolingState.OFF;
                (_a = this.currentState) === null || _a === void 0 ? void 0 : _a.updateValue(Platform_1.Characteristics.CurrentHeatingCoolingState.OFF);
                break;
            case 'auto':
                (_b = this.prog) === null || _b === void 0 ? void 0 : _b.updateValue(false);
                if (this.device.get('io:TargetHeatingLevelState') === 'eco') {
                    (_c = this.currentState) === null || _c === void 0 ? void 0 : _c.updateValue(Platform_1.Characteristics.CurrentHeatingCoolingState.COOL);
                }
                else {
                    (_d = this.currentState) === null || _d === void 0 ? void 0 : _d.updateValue(Platform_1.Characteristics.CurrentHeatingCoolingState.HEAT);
                }
                break;
            case 'prog':
            case 'program':
            case 'internal':
            case 'comfort':
            case 'eco':
            case 'manual':
            case 'basic':
                if (this.device.get('io:NativeFunctionalLevelState') === 'Top') {
                    targetState = Platform_1.Characteristics.TargetHeatingCoolingState.HEAT;
                }
                (_e = this.prog) === null || _e === void 0 ? void 0 : _e.updateValue(['prog', 'program', 'internal'].includes(this.device.get('core:OperatingModeState')));
                if (this.device.get('io:TargetHeatingLevelState') === 'eco') {
                    (_f = this.currentState) === null || _f === void 0 ? void 0 : _f.updateValue(Platform_1.Characteristics.CurrentHeatingCoolingState.COOL);
                }
                else {
                    (_g = this.currentState) === null || _g === void 0 ? void 0 : _g.updateValue(Platform_1.Characteristics.CurrentHeatingCoolingState.HEAT);
                }
                break;
        }
        if (this.targetState !== undefined && targetState !== undefined && this.isIdle) {
            this.targetState.updateValue(targetState);
        }
    }
}
exports.default = AtlanticElectricalHeaterWithAdjustableTemperatureSetpoint;
//# sourceMappingURL=AtlanticElectricalHeaterWithAdjustableTemperatureSetpoint.js.map
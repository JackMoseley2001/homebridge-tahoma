"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Platform_1 = require("../../Platform");
const overkiz_client_1 = require("overkiz-client");
const HeatingSystem_1 = __importDefault(require("../HeatingSystem"));
class AtlanticPassAPCZoneControl extends HeatingSystem_1.default {
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
        var _a;
        this.registerThermostatService();
        (_a = this.targetTemperature) === null || _a === void 0 ? void 0 : _a.setProps({ perms: ["pr" /* PAIRED_READ */, "ev" /* EVENTS */] });
    }
    getTargetStateCommands(value) {
        switch (value) {
            case Platform_1.Characteristics.TargetHeatingCoolingState.AUTO:
                return [
                    new overkiz_client_1.Command('setPassAPCOperatingMode', 'heating'),
                    new overkiz_client_1.Command('setHeatingCoolingAutoSwitch', 'on'),
                ];
            case Platform_1.Characteristics.TargetHeatingCoolingState.HEAT:
                return [
                    new overkiz_client_1.Command('setPassAPCOperatingMode', 'heating'),
                    new overkiz_client_1.Command('setHeatingCoolingAutoSwitch', 'off'),
                ];
            case Platform_1.Characteristics.TargetHeatingCoolingState.COOL:
                return [
                    new overkiz_client_1.Command('setPassAPCOperatingMode', 'cooling'),
                    new overkiz_client_1.Command('setHeatingCoolingAutoSwitch', 'off'),
                ];
            default:
            case Platform_1.Characteristics.TargetHeatingCoolingState.OFF:
                return [
                    new overkiz_client_1.Command('setPassAPCOperatingMode', 'stop'),
                ];
        }
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    getTargetTemperatureCommands(value) {
        return [];
    }
    onStateChanged(name, value) {
        switch (name) {
            case 'io:PassAPCOperatingModeState':
            case 'core:HeatingCoolingAutoSwitchState':
                this.postpone(this.computeStates);
        }
    }
    computeStates() {
        var _a, _b, _c;
        let targetState;
        switch (this.device.get('io:PassAPCOperatingModeState')) {
            case 'heating':
                if (this.device.get('core:HeatingCoolingAutoSwitchState') === 'on') {
                    targetState = Platform_1.Characteristics.TargetHeatingCoolingState.AUTO;
                }
                else {
                    targetState = Platform_1.Characteristics.TargetHeatingCoolingState.HEAT;
                }
                (_a = this.currentState) === null || _a === void 0 ? void 0 : _a.updateValue(Platform_1.Characteristics.CurrentHeatingCoolingState.HEAT);
                break;
            case 'cooling':
                if (this.device.get('core:HeatingCoolingAutoSwitchState') === 'on') {
                    targetState = Platform_1.Characteristics.TargetHeatingCoolingState.AUTO;
                }
                else {
                    targetState = Platform_1.Characteristics.TargetHeatingCoolingState.COOL;
                }
                (_b = this.currentState) === null || _b === void 0 ? void 0 : _b.updateValue(Platform_1.Characteristics.CurrentHeatingCoolingState.COOL);
                break;
            case 'stop':
                targetState = Platform_1.Characteristics.TargetHeatingCoolingState.OFF;
                (_c = this.currentState) === null || _c === void 0 ? void 0 : _c.updateValue(Platform_1.Characteristics.CurrentHeatingCoolingState.OFF);
                break;
        }
        // eslint-disable-next-line eqeqeq
        if (this.targetState !== undefined && targetState != null && this.isIdle) {
            this.targetState.updateValue(targetState);
        }
    }
}
exports.default = AtlanticPassAPCZoneControl;
//# sourceMappingURL=AtlanticPassAPCZoneControl.js.map
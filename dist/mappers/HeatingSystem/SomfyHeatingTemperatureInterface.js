"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Platform_1 = require("../../Platform");
const overkiz_client_1 = require("overkiz-client");
const HeatingSystem_1 = __importDefault(require("../HeatingSystem"));
class SomfyHeatingTemperatureInterface extends HeatingSystem_1.default {
    constructor() {
        super(...arguments);
        this.THERMOSTAT_CHARACTERISTICS = ['prog', 'eco'];
        this.MIN_TEMP = 0;
        this.MAX_TEMP = 26;
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
                return [
                    new overkiz_client_1.Command('setOnOff', 'on'),
                    new overkiz_client_1.Command('setOperatingMode', 'both'),
                ];
            case Platform_1.Characteristics.TargetHeatingCoolingState.HEAT:
                return [
                    new overkiz_client_1.Command('setOnOff', 'on'),
                    new overkiz_client_1.Command('setOperatingMode', 'heating'),
                ];
            case Platform_1.Characteristics.TargetHeatingCoolingState.COOL:
                return [
                    new overkiz_client_1.Command('setOnOff', 'on'),
                    new overkiz_client_1.Command('setOperatingMode', 'cooling'),
                ];
            case Platform_1.Characteristics.TargetHeatingCoolingState.OFF:
                return new overkiz_client_1.Command('setOnOff', 'off');
        }
    }
    getProgCommands() {
        var _a, _b;
        if ((_a = this.prog) === null || _a === void 0 ? void 0 : _a.value) {
            return new overkiz_client_1.Command('setActiveMode', 'auto');
        }
        else {
            if ((_b = this.eco) === null || _b === void 0 ? void 0 : _b.value) {
                return new overkiz_client_1.Command('setManuAndSetPointModes', 'eco');
            }
            else {
                return new overkiz_client_1.Command('setManuAndSetPointModes', 'comfort');
            }
        }
    }
    getTargetTemperatureCommands(value) {
        if (this.device.get('ovp:HeatingTemperatureInterfaceSetPointModeState') === 'comfort') {
            return new overkiz_client_1.Command('setComfortTemperature', value);
        }
        else {
            return new overkiz_client_1.Command('setEcoTemperature', value);
        }
    }
    onStateChanged(name, value) {
        super.onStateChanged(name, value);
        switch (name) {
            case 'core:OnOffState':
            case 'ovp:HeatingTemperatureInterfaceOperatingModeState':
                this.postpone(this.computeStates);
                break;
        }
    }
    computeStates() {
        var _a, _b, _c, _d;
        let targetState;
        if (this.device.get('core:OnOffState') === 'on') {
            switch (this.device.get('ovp:HeatingTemperatureInterfaceOperatingModeState')) {
                case 'both':
                    (_a = this.currentState) === null || _a === void 0 ? void 0 : _a.updateValue(Platform_1.Characteristics.CurrentHeatingCoolingState.HEAT);
                    targetState = Platform_1.Characteristics.TargetHeatingCoolingState.AUTO;
                    break;
                case 'heating':
                    (_b = this.currentState) === null || _b === void 0 ? void 0 : _b.updateValue(Platform_1.Characteristics.CurrentHeatingCoolingState.HEAT);
                    targetState = Platform_1.Characteristics.TargetHeatingCoolingState.HEAT;
                    break;
                case 'cooling':
                    (_c = this.currentState) === null || _c === void 0 ? void 0 : _c.updateValue(Platform_1.Characteristics.CurrentHeatingCoolingState.COOL);
                    targetState = Platform_1.Characteristics.TargetHeatingCoolingState.COOL;
                    break;
            }
        }
        else {
            (_d = this.currentState) === null || _d === void 0 ? void 0 : _d.updateValue(Platform_1.Characteristics.CurrentHeatingCoolingState.OFF);
            targetState = Platform_1.Characteristics.TargetHeatingCoolingState.OFF;
        }
        if (this.targetState !== undefined && targetState !== undefined && this.isIdle) {
            this.targetState.updateValue(targetState);
        }
    }
}
exports.default = SomfyHeatingTemperatureInterface;
//# sourceMappingURL=SomfyHeatingTemperatureInterface.js.map
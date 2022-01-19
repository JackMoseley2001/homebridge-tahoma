"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Platform_1 = require("../../Platform");
const overkiz_client_1 = require("overkiz-client");
const HeatingSystem_1 = __importDefault(require("../HeatingSystem"));
class HitachiAirToAirHeatPump extends HeatingSystem_1.default {
    constructor() {
        super(...arguments);
        this.MIN_TEMP = 16;
        this.MAX_TEMP = 30;
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
        var _a;
        return this.getCommands(value, (_a = this.targetTemperature) === null || _a === void 0 ? void 0 : _a.value);
    }
    getTargetTemperatureCommands(value) {
        var _a;
        return this.getCommands((_a = this.targetState) === null || _a === void 0 ? void 0 : _a.value, value);
    }
    onStateChanged(name, value) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
        switch (name) {
            case 'ovp:ModeChangeState':
            case 'ovp:MainOperationState':
                if (this.device.get('ovp:MainOperationState') === 'Off' || this.device.get('ovp:MainOperationState') === 'off') {
                    (_a = this.currentState) === null || _a === void 0 ? void 0 : _a.updateValue(Platform_1.Characteristics.CurrentHeatingCoolingState.OFF);
                    (_b = this.targetState) === null || _b === void 0 ? void 0 : _b.updateValue(Platform_1.Characteristics.TargetHeatingCoolingState.OFF);
                }
                else {
                    switch ((_c = this.device.get('ovp:ModeChangeState')) === null || _c === void 0 ? void 0 : _c.toLowerCase()) {
                        case 'auto cooling':
                            (_d = this.currentState) === null || _d === void 0 ? void 0 : _d.updateValue(Platform_1.Characteristics.CurrentHeatingCoolingState.COOL);
                            (_e = this.targetState) === null || _e === void 0 ? void 0 : _e.updateValue(Platform_1.Characteristics.TargetHeatingCoolingState.AUTO);
                            break;
                        case 'auto heating':
                            (_f = this.currentState) === null || _f === void 0 ? void 0 : _f.updateValue(Platform_1.Characteristics.CurrentHeatingCoolingState.HEAT);
                            (_g = this.targetState) === null || _g === void 0 ? void 0 : _g.updateValue(Platform_1.Characteristics.TargetHeatingCoolingState.AUTO);
                            break;
                        case 'cooling':
                            (_h = this.currentState) === null || _h === void 0 ? void 0 : _h.updateValue(Platform_1.Characteristics.CurrentHeatingCoolingState.COOL);
                            (_j = this.targetState) === null || _j === void 0 ? void 0 : _j.updateValue(Platform_1.Characteristics.TargetHeatingCoolingState.COOL);
                            break;
                        case 'heating':
                            (_k = this.currentState) === null || _k === void 0 ? void 0 : _k.updateValue(Platform_1.Characteristics.CurrentHeatingCoolingState.HEAT);
                            (_l = this.targetState) === null || _l === void 0 ? void 0 : _l.updateValue(Platform_1.Characteristics.TargetHeatingCoolingState.HEAT);
                            break;
                    }
                }
                break;
            case 'ovp:RoomTemperatureState':
                this.onTemperatureUpdate(value);
                break;
            case 'core:TargetTemperatureState':
                (_m = this.targetTemperature) === null || _m === void 0 ? void 0 : _m.updateValue(value);
                break;
            /*
            case 'ovp:TemperatureChangeState':
                if(value <= 5 && this.currentTemperature) {
                    this.targetTemperature?.updateValue(this.currentTemperature.value + value);
                } else {
                    this.targetTemperature?.updateValue(value);
                }
                break;
            */
        }
    }
    getCommands(state, temperature) {
        const currentState = this.currentState ? this.currentState.value : 0;
        const currentTemperature = this.currentTemperature && this.currentTemperature.value !== null ? this.currentTemperature.value : 0;
        let onOff = 'on';
        const fanMode = 'auto';
        const progMode = 'manu';
        let heatMode = 'auto';
        const autoTemp = Math.trunc(Math.max(Math.min(temperature - parseInt(currentTemperature.toString()), 5), -5));
        switch (state) {
            case Platform_1.Characteristics.TargetHeatingCoolingState.OFF:
                onOff = 'off';
                switch (currentState) {
                    case Platform_1.Characteristics.CurrentHeatingCoolingState.HEAT:
                        heatMode = 'heating';
                        break;
                    case Platform_1.Characteristics.CurrentHeatingCoolingState.COOL:
                        heatMode = 'cooling';
                        break;
                    default:
                        temperature = autoTemp;
                        break;
                }
                break;
            case Platform_1.Characteristics.TargetHeatingCoolingState.HEAT:
                heatMode = 'heating';
                break;
            case Platform_1.Characteristics.TargetHeatingCoolingState.COOL:
                heatMode = 'cooling';
                break;
            case Platform_1.Characteristics.TargetHeatingCoolingState.AUTO:
                heatMode = 'auto';
                temperature = autoTemp;
                break;
            default:
                temperature = autoTemp;
                break;
        }
        temperature = Math.round(temperature);
        this.debug('FROM ' + currentState + '/' + currentTemperature + ' TO ' + state + '/' + temperature);
        return new overkiz_client_1.Command('globalControl', [onOff, temperature, fanMode, heatMode, progMode]);
    }
}
exports.default = HitachiAirToAirHeatPump;
//# sourceMappingURL=HitachiAirToAirHeatPump.js.map
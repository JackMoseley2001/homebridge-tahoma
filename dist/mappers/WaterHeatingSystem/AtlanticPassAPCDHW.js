"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Platform_1 = require("../../Platform");
const overkiz_client_1 = require("overkiz-client");
const WaterHeatingSystem_1 = __importDefault(require("../WaterHeatingSystem"));
class AtlanticPassAPCDHW extends WaterHeatingSystem_1.default {
    constructor() {
        super(...arguments);
        this.THERMOSTAT_CHARACTERISTICS = ['eco', 'prog'];
    }
    registerServices() {
        this.registerThermostatService();
        if (this.device.hasCommand('setBoostOnOffState')) {
            this.registerSwitchService('boost');
        }
    }
    getTargetStateCommands(value) {
        var _a, _b;
        const commands = [];
        switch (value) {
            case Platform_1.Characteristics.TargetHeatingCoolingState.AUTO:
                commands.push(new overkiz_client_1.Command('setDHWOnOffState', 'on'));
                if ((_a = this.prog) === null || _a === void 0 ? void 0 : _a.value) {
                    commands.push(new overkiz_client_1.Command('setPassAPCDHWMode', 'internalScheduling'));
                }
                else {
                    if ((_b = this.eco) === null || _b === void 0 ? void 0 : _b.value) {
                        commands.push(new overkiz_client_1.Command('setPassAPCDHWMode', 'eco'));
                    }
                    else {
                        commands.push(new overkiz_client_1.Command('setPassAPCDHWMode', 'comfort'));
                    }
                }
                break;
            case Platform_1.Characteristics.TargetHeatingCoolingState.OFF:
                commands.push(new overkiz_client_1.Command('setDHWOnOffState', 'off'));
                break;
        }
        return commands;
    }
    getTargetTemperatureCommands(value) {
        var _a;
        if (((_a = this.targetState) === null || _a === void 0 ? void 0 : _a.value) === Platform_1.Characteristics.TargetHeatingCoolingState.COOL) {
            return new overkiz_client_1.Command('setEcoTargetDHWTemperature', value);
        }
        else {
            return new overkiz_client_1.Command('setComfortTargetDHWTemperature', value);
        }
    }
    getOnCommands(value) {
        return new overkiz_client_1.Command('setBoostOnOffState', value ? 'on' : 'off');
    }
    onStateChanged(name, value) {
        var _a;
        switch (name) {
            case 'core:TargetDHWTemperatureState':
                this.onTemperatureUpdate(value);
                //this.postpone(this.computeStates);
                break;
            case 'core:DHWOnOffState':
            case 'io:PassAPCDHWModeState':
            case 'io:PassAPCDHWProfileState':
            case 'core:ComfortTargetDHWTemperatureState':
            case 'core:EcoTargetDHWTemperatureState':
                this.postpone(this.computeStates);
                break;
            case 'core:BoostOnOffState':
                (_a = this.on) === null || _a === void 0 ? void 0 : _a.updateValue(value === 'on');
                break;
        }
    }
    computeStates() {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s;
        let targetState;
        if (this.device.get('core:DHWOnOffState') === 'on') {
            targetState = Platform_1.Characteristics.TargetHeatingCoolingState.AUTO;
            switch (this.device.get('io:PassAPCDHWModeState')) {
                case 'off':
                case 'stop':
                    targetState = Platform_1.Characteristics.TargetHeatingCoolingState.OFF;
                    (_a = this.currentState) === null || _a === void 0 ? void 0 : _a.updateValue(Platform_1.Characteristics.CurrentHeatingCoolingState.OFF);
                    (_b = this.targetTemperature) === null || _b === void 0 ? void 0 : _b.updateValue(this.device.get('core:TargetDHWTemperatureState'));
                    break;
                case 'internalScheduling':
                case 'externalScheduling':
                    (_c = this.prog) === null || _c === void 0 ? void 0 : _c.updateValue(true);
                    if (this.device.get('io:PassAPCDHWProfileState') === 'comfort') {
                        (_d = this.currentState) === null || _d === void 0 ? void 0 : _d.updateValue(Platform_1.Characteristics.CurrentHeatingCoolingState.HEAT);
                        (_e = this.targetTemperature) === null || _e === void 0 ? void 0 : _e.updateValue(this.device.get('core:ComfortTargetDHWTemperatureState'));
                    }
                    else {
                        (_f = this.currentState) === null || _f === void 0 ? void 0 : _f.updateValue(Platform_1.Characteristics.CurrentHeatingCoolingState.COOL);
                        (_g = this.targetTemperature) === null || _g === void 0 ? void 0 : _g.updateValue(this.device.get('core:EcoTargetDHWTemperatureState'));
                    }
                    break;
                case 'comfort':
                    (_h = this.prog) === null || _h === void 0 ? void 0 : _h.updateValue(false);
                    (_j = this.eco) === null || _j === void 0 ? void 0 : _j.updateValue(false);
                    (_k = this.currentState) === null || _k === void 0 ? void 0 : _k.updateValue(Platform_1.Characteristics.CurrentHeatingCoolingState.HEAT);
                    (_l = this.targetTemperature) === null || _l === void 0 ? void 0 : _l.updateValue(this.device.get('core:ComfortTargetDHWTemperatureState'));
                    break;
                case 'eco':
                    (_m = this.prog) === null || _m === void 0 ? void 0 : _m.updateValue(false);
                    (_o = this.eco) === null || _o === void 0 ? void 0 : _o.updateValue(true);
                    (_p = this.currentState) === null || _p === void 0 ? void 0 : _p.updateValue(Platform_1.Characteristics.CurrentHeatingCoolingState.COOL);
                    (_q = this.targetTemperature) === null || _q === void 0 ? void 0 : _q.updateValue(this.device.get('core:EcoTargetDHWTemperatureState'));
                    break;
            }
        }
        else {
            targetState = Platform_1.Characteristics.TargetHeatingCoolingState.OFF;
            (_r = this.currentState) === null || _r === void 0 ? void 0 : _r.updateValue(Platform_1.Characteristics.CurrentHeatingCoolingState.OFF);
            (_s = this.targetTemperature) === null || _s === void 0 ? void 0 : _s.updateValue(this.device.get('core:TargetDHWTemperatureState'));
        }
        if (this.targetState !== undefined && targetState !== undefined && this.isIdle) {
            this.targetState.updateValue(targetState);
        }
    }
}
exports.default = AtlanticPassAPCDHW;
//# sourceMappingURL=AtlanticPassAPCDHW.js.map
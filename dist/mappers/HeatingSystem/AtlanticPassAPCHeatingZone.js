"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Platform_1 = require("../../Platform");
const overkiz_client_1 = require("overkiz-client");
const HeatingSystem_1 = __importDefault(require("../HeatingSystem"));
class AtlanticPassAPCHeatingZone extends HeatingSystem_1.default {
    constructor() {
        super(...arguments);
        this.THERMOSTAT_CHARACTERISTICS = ['eco', 'prog'];
        this.MIN_TEMP = 10;
        this.MAX_TEMP = 35;
        this.TARGET_MODES = [
            Platform_1.Characteristics.TargetHeatingCoolingState.AUTO,
            Platform_1.Characteristics.TargetHeatingCoolingState.OFF,
        ];
    }
    registerServices() {
        this.registerThermostatService();
    }
    getTargetStateCommands(value) {
        var _a, _b;
        const commands = [];
        switch (value) {
            case Platform_1.Characteristics.TargetHeatingCoolingState.AUTO:
                commands.push(new overkiz_client_1.Command('setHeatingOnOffState', 'on'));
                if ((_a = this.prog) === null || _a === void 0 ? void 0 : _a.value) {
                    commands.push(new overkiz_client_1.Command('setPassAPCHeatingMode', 'internalScheduling'));
                }
                else {
                    commands.push(new overkiz_client_1.Command('setDerogationOnOffState', 'off'));
                    if ((_b = this.eco) === null || _b === void 0 ? void 0 : _b.value) {
                        commands.push(new overkiz_client_1.Command('setPassAPCHeatingMode', 'eco'));
                    }
                    else {
                        commands.push(new overkiz_client_1.Command('setPassAPCHeatingMode', 'comfort'));
                    }
                }
                break;
            case Platform_1.Characteristics.TargetHeatingCoolingState.OFF:
                commands.push(new overkiz_client_1.Command('setHeatingOnOffState', 'off'));
                //commands.push(new Command('setHeatingOnOffState', 'on'));
                //commands.push(new Command('setPassAPCHeatingMode', 'absence'));
                break;
        }
        return commands;
    }
    getTargetTemperatureCommands(value) {
        var _a, _b;
        const duration = this.derogationDuration;
        const commands = [];
        if ((_a = this.prog) === null || _a === void 0 ? void 0 : _a.value) {
            commands.push(new overkiz_client_1.Command('setDerogatedTargetTemperature', value));
            commands.push(new overkiz_client_1.Command('setDerogationTime', duration));
            commands.push(new overkiz_client_1.Command('setDerogationOnOffState', 'on'));
        }
        else {
            if ((_b = this.eco) === null || _b === void 0 ? void 0 : _b.value) {
                commands.push(new overkiz_client_1.Command('setEcoHeatingTargetTemperature', value));
            }
            else {
                commands.push(new overkiz_client_1.Command('setComfortHeatingTargetTemperature', value));
            }
        }
        return commands;
    }
    onStateChanged(name, value) {
        switch (name) {
            case 'core:TemperatureState':
                this.onTemperatureUpdate(value);
                break;
            case 'core:TargetTemperatureState':
            case 'core:HeatingOnOffState':
            case 'io:PassAPCHeatingModeState':
            case 'io:PassAPCHeatingProfileState':
            case 'core:ComfortHeatingTargetTemperatureState':
            case 'core:EcoHeatingTargetTemperatureState':
                this.postpone(this.computeStates);
        }
    }
    computeStates() {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u;
        let targetState;
        if (this.device.get('core:HeatingOnOffState') === 'on') {
            targetState = Platform_1.Characteristics.TargetHeatingCoolingState.AUTO;
            switch (this.device.get('io:PassAPCHeatingModeState')) {
                case 'off':
                case 'absence':
                    targetState = Platform_1.Characteristics.TargetHeatingCoolingState.OFF;
                    (_a = this.currentState) === null || _a === void 0 ? void 0 : _a.updateValue(Platform_1.Characteristics.CurrentHeatingCoolingState.OFF);
                    (_b = this.targetTemperature) === null || _b === void 0 ? void 0 : _b.updateValue(this.device.get('core:TargetTemperatureState'));
                    break;
                case 'auto':
                case 'internalScheduling':
                case 'externalScheduling':
                    (_c = this.prog) === null || _c === void 0 ? void 0 : _c.updateValue(true);
                    if (this.device.get('io:PassAPCHeatingProfileState') === 'comfort') {
                        (_d = this.currentState) === null || _d === void 0 ? void 0 : _d.updateValue(Platform_1.Characteristics.CurrentHeatingCoolingState.HEAT);
                    }
                    else {
                        (_e = this.currentState) === null || _e === void 0 ? void 0 : _e.updateValue(Platform_1.Characteristics.CurrentHeatingCoolingState.COOL);
                    }
                    if (this.device.get('io:PassAPCHeatingProfileState') === 'derogation') {
                        (_f = this.targetTemperature) === null || _f === void 0 ? void 0 : _f.updateValue(this.device.get('core:DerogatedTargetTemperatureState'));
                    }
                    else if (this.device.get('io:PassAPCHeatingProfileState') === 'comfort') {
                        (_g = this.targetTemperature) === null || _g === void 0 ? void 0 : _g.updateValue(this.device.get('core:ComfortHeatingTargetTemperatureState'));
                    }
                    else if (this.device.get('io:PassAPCHeatingProfileState') === 'eco') {
                        (_h = this.targetTemperature) === null || _h === void 0 ? void 0 : _h.updateValue(this.device.get('core:EcoHeatingTargetTemperatureState'));
                    }
                    else {
                        (_j = this.targetTemperature) === null || _j === void 0 ? void 0 : _j.updateValue(this.device.get('core:TargetTemperatureState'));
                    }
                    break;
                case 'comfort':
                    (_k = this.prog) === null || _k === void 0 ? void 0 : _k.updateValue(false);
                    (_l = this.eco) === null || _l === void 0 ? void 0 : _l.updateValue(false);
                    (_m = this.currentState) === null || _m === void 0 ? void 0 : _m.updateValue(Platform_1.Characteristics.CurrentHeatingCoolingState.HEAT);
                    (_o = this.targetTemperature) === null || _o === void 0 ? void 0 : _o.updateValue(this.device.get('core:ComfortHeatingTargetTemperatureState'));
                    break;
                case 'eco':
                    (_p = this.prog) === null || _p === void 0 ? void 0 : _p.updateValue(false);
                    (_q = this.eco) === null || _q === void 0 ? void 0 : _q.updateValue(true);
                    (_r = this.currentState) === null || _r === void 0 ? void 0 : _r.updateValue(Platform_1.Characteristics.CurrentHeatingCoolingState.COOL);
                    (_s = this.targetTemperature) === null || _s === void 0 ? void 0 : _s.updateValue(this.device.get('core:EcoHeatingTargetTemperatureState'));
                    break;
            }
        }
        else {
            targetState = Platform_1.Characteristics.TargetHeatingCoolingState.OFF;
            (_t = this.currentState) === null || _t === void 0 ? void 0 : _t.updateValue(Platform_1.Characteristics.CurrentHeatingCoolingState.OFF);
            (_u = this.targetTemperature) === null || _u === void 0 ? void 0 : _u.updateValue(this.device.get('core:TargetTemperatureState'));
        }
        if (this.targetState !== undefined && targetState !== undefined && this.isIdle) {
            this.targetState.updateValue(targetState);
        }
    }
}
exports.default = AtlanticPassAPCHeatingZone;
//# sourceMappingURL=AtlanticPassAPCHeatingZone.js.map
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Platform_1 = require("../../Platform");
const overkiz_client_1 = require("overkiz-client");
const HeatingSystem_1 = __importDefault(require("../HeatingSystem"));
const FROSTPROTECTION_TEMP = 7;
class AtlanticElectricalHeater extends HeatingSystem_1.default {
    constructor() {
        super(...arguments);
        this.THERMOSTAT_CHARACTERISTICS = ['eco'];
        this.TARGET_MODES = [
            Platform_1.Characteristics.TargetHeatingCoolingState.HEAT,
            Platform_1.Characteristics.TargetHeatingCoolingState.COOL,
            Platform_1.Characteristics.TargetHeatingCoolingState.OFF,
        ];
    }
    registerServices() {
        var _a;
        this.registerThermostatService();
        (_a = this.targetTemperature) === null || _a === void 0 ? void 0 : _a.setProps({
            minValue: FROSTPROTECTION_TEMP,
            maxValue: this.comfortTemperature,
            minStep: 1,
            perms: ["pr" /* PAIRED_READ */, "ev" /* EVENTS */, "pw" /* PAIRED_WRITE */],
        });
    }
    getTargetStateCommands(value) {
        var _a;
        switch (value) {
            case Platform_1.Characteristics.TargetHeatingCoolingState.AUTO:
                return new overkiz_client_1.Command('setHeatingLevel', ((_a = this === null || this === void 0 ? void 0 : this.eco) === null || _a === void 0 ? void 0 : _a.value) ? 'eco' : 'comfort');
            case Platform_1.Characteristics.TargetHeatingCoolingState.HEAT:
                return new overkiz_client_1.Command('setHeatingLevel', 'comfort');
            case Platform_1.Characteristics.TargetHeatingCoolingState.COOL:
                return new overkiz_client_1.Command('setHeatingLevel', 'eco');
            case Platform_1.Characteristics.TargetHeatingCoolingState.OFF:
                return new overkiz_client_1.Command('setHeatingLevel', 'off');
        }
        return [];
    }
    async setTargetTemperature(value) {
        var _a;
        const frostEcoLimit = FROSTPROTECTION_TEMP + (this.ecoTemperature - FROSTPROTECTION_TEMP) / 2;
        const ecoComfortLimit = this.ecoTemperature + (this.comfortTemperature - this.ecoTemperature) / 2;
        let newValue = value;
        if (value <= frostEcoLimit) {
            newValue = FROSTPROTECTION_TEMP;
        }
        else if (value > frostEcoLimit && value <= this.ecoTemperature) {
            newValue = this.ecoTemperature;
        }
        else if (value > this.ecoTemperature && value <= ecoComfortLimit) {
            newValue = this.comfortTemperature;
        }
        if (newValue !== value) {
            (_a = this.targetTemperature) === null || _a === void 0 ? void 0 : _a.updateValue(newValue);
        }
        await this.executeCommands(this.getTargetTemperatureCommands(newValue));
    }
    getTargetTemperatureCommands(value) {
        var _a, _b, _c;
        if (value === FROSTPROTECTION_TEMP) {
            (_a = this.targetState) === null || _a === void 0 ? void 0 : _a.updateValue(Platform_1.Characteristics.CurrentHeatingCoolingState.COOL);
            return new overkiz_client_1.Command('setHeatingLevel', 'frostprotection');
        }
        else if (value === this.ecoTemperature) {
            (_b = this.targetState) === null || _b === void 0 ? void 0 : _b.updateValue(Platform_1.Characteristics.CurrentHeatingCoolingState.COOL);
            return new overkiz_client_1.Command('setHeatingLevel', 'eco');
        }
        else if (value === this.comfortTemperature) {
            (_c = this.targetState) === null || _c === void 0 ? void 0 : _c.updateValue(Platform_1.Characteristics.CurrentHeatingCoolingState.HEAT);
            return new overkiz_client_1.Command('setHeatingLevel', 'comfort');
        }
    }
    getProgCommands() {
        var _a;
        return new overkiz_client_1.Command('setHeatingLevel', ((_a = this === null || this === void 0 ? void 0 : this.eco) === null || _a === void 0 ? void 0 : _a.value) ? 'eco' : 'comfort');
    }
    onStateChanged(name, value) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
        let targetState;
        switch (name) {
            case 'io:TargetHeatingLevelState':
                //targetState = Characteristics.TargetHeatingCoolingState.AUTO;
                switch (value) {
                    case 'off':
                        targetState = Platform_1.Characteristics.TargetHeatingCoolingState.OFF;
                        (_a = this.currentState) === null || _a === void 0 ? void 0 : _a.updateValue(Platform_1.Characteristics.CurrentHeatingCoolingState.OFF);
                        break;
                    case 'frostprotection':
                        targetState = Platform_1.Characteristics.TargetHeatingCoolingState.HEAT;
                        (_b = this.currentState) === null || _b === void 0 ? void 0 : _b.updateValue(Platform_1.Characteristics.CurrentHeatingCoolingState.OFF);
                        (_c = this.currentTemperature) === null || _c === void 0 ? void 0 : _c.updateValue(FROSTPROTECTION_TEMP);
                        (_d = this.targetTemperature) === null || _d === void 0 ? void 0 : _d.updateValue(FROSTPROTECTION_TEMP);
                        break;
                    case 'comfort':
                    case 'comfort-1':
                    case 'comfort-2':
                        targetState = Platform_1.Characteristics.TargetHeatingCoolingState.HEAT;
                        (_e = this.currentState) === null || _e === void 0 ? void 0 : _e.updateValue(Platform_1.Characteristics.CurrentHeatingCoolingState.HEAT);
                        (_f = this.eco) === null || _f === void 0 ? void 0 : _f.updateValue(false);
                        (_g = this.currentTemperature) === null || _g === void 0 ? void 0 : _g.updateValue(this.comfortTemperature);
                        (_h = this.targetTemperature) === null || _h === void 0 ? void 0 : _h.updateValue(this.comfortTemperature);
                        break;
                    case 'eco':
                        targetState = Platform_1.Characteristics.TargetHeatingCoolingState.COOL;
                        (_j = this.currentState) === null || _j === void 0 ? void 0 : _j.updateValue(Platform_1.Characteristics.CurrentHeatingCoolingState.COOL);
                        (_k = this.eco) === null || _k === void 0 ? void 0 : _k.updateValue(true);
                        (_l = this.currentTemperature) === null || _l === void 0 ? void 0 : _l.updateValue(this.ecoTemperature);
                        (_m = this.targetTemperature) === null || _m === void 0 ? void 0 : _m.updateValue(this.ecoTemperature);
                        break;
                }
                if (this.targetState !== undefined && targetState !== undefined && this.isIdle) {
                    this.targetState.updateValue(targetState);
                }
                break;
        }
    }
}
exports.default = AtlanticElectricalHeater;
//# sourceMappingURL=AtlanticElectricalHeater.js.map
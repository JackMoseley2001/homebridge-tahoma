"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Platform_1 = require("../../Platform");
const overkiz_client_1 = require("overkiz-client");
const HeatingSystem_1 = __importDefault(require("../HeatingSystem"));
class AtlanticPassAPCHeatingAndCoolingZone extends HeatingSystem_1.default {
    constructor() {
        super(...arguments);
        this.THERMOSTAT_CHARACTERISTICS = ['prog'];
        this.MIN_TEMP = 16;
        this.MAX_TEMP = 30;
        this.TARGET_MODES = [
            Platform_1.Characteristics.TargetHeatingCoolingState.AUTO,
            Platform_1.Characteristics.TargetHeatingCoolingState.OFF,
        ];
    }
    applyConfig(config) {
        super.applyConfig(config);
    }
    registerServices() {
        this.registerThermostatService();
    }
    getTargetStateCommands(value) {
        var _a;
        const heatingCooling = this.getHeatingCooling();
        const commands = [];
        switch (value) {
            case Platform_1.Characteristics.TargetHeatingCoolingState.AUTO:
                commands.push(new overkiz_client_1.Command('set' + heatingCooling + 'OnOffState', 'on'));
                commands.push(new overkiz_client_1.Command('setPassAPC' + heatingCooling + 'Mode', ((_a = this.prog) === null || _a === void 0 ? void 0 : _a.value) ? 'internalScheduling' : 'manu'));
                break;
            case Platform_1.Characteristics.TargetHeatingCoolingState.OFF:
                commands.push(new overkiz_client_1.Command('set' + heatingCooling + 'OnOffState', 'off'));
                break;
        }
        return commands;
    }
    getTargetTemperatureCommands(value) {
        var _a;
        const heatingCooling = this.getHeatingCooling();
        if ((_a = this.prog) === null || _a === void 0 ? void 0 : _a.value) {
            if (this.device.hasCommand('setDerogatedTargetTemperature')) {
                // AtlanticPassAPCHeatPump
                return [
                    new overkiz_client_1.Command('setDerogatedTargetTemperature', value),
                    new overkiz_client_1.Command('setDerogationTime', this.derogationDuration),
                    new overkiz_client_1.Command('setDerogationOnOffState', 'on'),
                ];
            }
            else {
                const profile = this.getProfile();
                return new overkiz_client_1.Command(`set${profile}${heatingCooling}TargetTemperature`, value);
            }
        }
        else {
            if (this.device.hasCommand(`set${heatingCooling}TargetTemperature`)) {
                // AtlanticPassAPCZoneControl
                return new overkiz_client_1.Command(`set${heatingCooling}TargetTemperature`, value);
            }
            else {
                // AtlanticPassAPCHeatPump
                return new overkiz_client_1.Command(`setComfort${heatingCooling}TargetTemperature`, value);
            }
        }
    }
    onStateChanged(name, value) {
        var _a;
        switch (name) {
            case 'core:TemperatureState':
                this.onTemperatureUpdate(value);
                break;
            case 'core:TargetTemperatureState':
                if (value >= 16) {
                    (_a = this.targetTemperature) === null || _a === void 0 ? void 0 : _a.updateValue(value);
                }
                break;
            case 'core:HeatingOnOffState':
            case 'core:CoolingOnOffState':
            case 'io:PassAPCHeatingModeState':
            case 'io:PassAPCCoolingModeState':
            case 'io:PassAPCHeatingProfileState':
            case 'io:PassAPCCoolingProfileState':
                this.postpone(this.computeStates);
        }
    }
    computeStates() {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        let targetState;
        let targetTemperature;
        const heatingCooling = this.getHeatingCooling();
        if (this.device.get(`core:${heatingCooling}OnOffState`) === 'off') {
            targetState = Platform_1.Characteristics.TargetHeatingCoolingState.OFF;
            (_a = this.currentState) === null || _a === void 0 ? void 0 : _a.updateValue(Platform_1.Characteristics.CurrentHeatingCoolingState.OFF);
        }
        else {
            targetTemperature = targetTemperature = this.device.get(`core:${heatingCooling}TargetTemperatureState`) ||
                this.device.get('core:TargetTemperatureState');
            const currentTemperature = ((_b = this.currentTemperature) === null || _b === void 0 ? void 0 : _b.value) || targetTemperature;
            if (heatingCooling === 'Heating') {
                if (currentTemperature >= (targetTemperature + 0.5)) {
                    (_c = this.currentState) === null || _c === void 0 ? void 0 : _c.updateValue(Platform_1.Characteristics.CurrentHeatingCoolingState.OFF);
                }
                else {
                    (_d = this.currentState) === null || _d === void 0 ? void 0 : _d.updateValue(Platform_1.Characteristics.CurrentHeatingCoolingState.HEAT);
                }
            }
            else {
                if (currentTemperature <= (targetTemperature - 0.5)) {
                    (_e = this.currentState) === null || _e === void 0 ? void 0 : _e.updateValue(Platform_1.Characteristics.CurrentHeatingCoolingState.OFF);
                }
                else {
                    (_f = this.currentState) === null || _f === void 0 ? void 0 : _f.updateValue(Platform_1.Characteristics.CurrentHeatingCoolingState.COOL);
                }
            }
            targetState = Platform_1.Characteristics.TargetHeatingCoolingState.AUTO;
        }
        if (this.device.get(`io:PassAPC${heatingCooling}ModeState`) === 'internalScheduling') {
            (_g = this.prog) === null || _g === void 0 ? void 0 : _g.updateValue(true);
        }
        else {
            (_h = this.prog) === null || _h === void 0 ? void 0 : _h.updateValue(false);
        }
        if (this.targetState !== undefined && targetState !== undefined && this.isIdle) {
            this.targetState.updateValue(targetState);
        }
        if (this.targetTemperature !== undefined && targetTemperature >= 16 && this.isIdle) {
            this.targetTemperature.updateValue(targetTemperature);
        }
    }
    /**
     * Helpers
     */
    getHeatingCooling() {
        var _a;
        const operatingMode = (_a = this.device.parent) === null || _a === void 0 ? void 0 : _a.get('io:PassAPCOperatingModeState');
        if (operatingMode === 'cooling') {
            return 'Cooling';
        }
        else {
            return 'Heating';
        }
    }
    getProfile() {
        const heatingCooling = this.getHeatingCooling();
        if (this.device.get(`core:Eco${heatingCooling}TargetTemperatureState`) === this.device.get('core:TargetTemperatureState')) {
            return 'Eco';
        }
        else {
            return 'Comfort';
        }
    }
    launchRefreshStates() {
        clearTimeout(this.refreshStatesTimeout);
        this.refreshStatesTimeout = setTimeout(() => {
            const commands = [
                new overkiz_client_1.Command('refreshTargetTemperature'),
                new overkiz_client_1.Command('refreshPassAPCHeatingProfile'),
            ];
            this.executeCommands(commands);
        }, 30 * 1000);
    }
    launchRefreshTemperature() {
        clearTimeout(this.refreshStatesTimeout);
        this.refreshStatesTimeout = setTimeout(() => {
            this.executeCommands(new overkiz_client_1.Command('refreshTargetTemperature'));
        }, 30 * 1000);
    }
}
exports.default = AtlanticPassAPCHeatingAndCoolingZone;
//# sourceMappingURL=AtlanticPassAPCHeatingAndCoolingZone.js.map
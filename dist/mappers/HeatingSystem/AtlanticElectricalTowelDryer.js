"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Platform_1 = require("../../Platform");
const overkiz_client_1 = require("overkiz-client");
const HeatingSystem_1 = __importDefault(require("../HeatingSystem"));
class AtlanticElectricalTowelDryer extends HeatingSystem_1.default {
    constructor() {
        super(...arguments);
        this.THERMOSTAT_CHARACTERISTICS = ['prog'];
        this.MIN_TEMP = 7;
        this.MAX_TEMP = 28;
        this.TARGET_MODES = [
            Platform_1.Characteristics.TargetHeatingCoolingState.AUTO,
            Platform_1.Characteristics.TargetHeatingCoolingState.OFF,
        ];
    }
    registerServices() {
        var _a;
        this.registerThermostatService();
        if (this.device.hasCommand('setTowelDryerBoostModeDuration')) {
            this.registerSwitchService('boost');
        }
        if (this.device.hasCommand('setDryingDuration')) {
            const service = this.registerService(Platform_1.Services.Switch, 'drying');
            this.drying = service.getCharacteristic(Platform_1.Characteristics.On);
            (_a = this.drying) === null || _a === void 0 ? void 0 : _a.onSet(this.setDrying.bind(this));
        }
    }
    getTargetStateCommands(value) {
        var _a;
        switch (value) {
            case Platform_1.Characteristics.TargetHeatingCoolingState.AUTO:
                return new overkiz_client_1.Command('setTowelDryerOperatingMode', ((_a = this.prog) === null || _a === void 0 ? void 0 : _a.value) ? 'internal' : 'external');
            case Platform_1.Characteristics.TargetHeatingCoolingState.OFF:
                return new overkiz_client_1.Command('setTowelDryerOperatingMode', 'standby');
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
    getOnCommands(value) {
        const commands = new Array();
        commands.push(new overkiz_client_1.Command('setTowelDryerTemporaryState', value ? 'boost' : 'permanentHeating'));
        if (value) {
            commands.push(new overkiz_client_1.Command('setTowelDryerBoostModeDuration', 10));
        }
        return commands;
    }
    async setDrying(value) {
        const commands = new Array();
        commands.push(new overkiz_client_1.Command('setTowelDryerTemporaryState', value ? 'drying' : 'permanentHeating'));
        if (value) {
            commands.push(new overkiz_client_1.Command('setDryingDuration', 60));
        }
        const action = await this.executeCommands(commands);
        action.on('update', (state) => {
            var _a;
            switch (state) {
                case overkiz_client_1.ExecutionState.FAILED:
                    (_a = this.drying) === null || _a === void 0 ? void 0 : _a.updateValue(!value);
                    break;
            }
        });
    }
    onStateChanged(name, value) {
        var _a, _b;
        switch (name) {
            case 'core:TemperatureState':
                this.onTemperatureUpdate(value);
                break;
            case 'io:TowelDryerTemporaryStateState':
                (_a = this.on) === null || _a === void 0 ? void 0 : _a.updateValue(value === 'boost');
                (_b = this.drying) === null || _b === void 0 ? void 0 : _b.updateValue(value === 'drying');
                break;
            case 'core:TargetTemperatureState':
            case 'core:DerogatedTargetTemperatureState':
            case 'core:ComfortRoomTemperatureState':
            case 'core:EcoRoomTemperatureState':
            case 'core:OperatingModeState':
            case 'io:TargetHeatingLevelState':
                this.postpone(this.computeStates);
                break;
        }
    }
    computeStates() {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
        let targetTemperature = Number(this.device.get('core:ComfortRoomTemperatureState'));
        switch (this.device.get('io:TargetHeatingLevelState')) {
            case 'off':
                (_a = this.currentState) === null || _a === void 0 ? void 0 : _a.updateValue(Platform_1.Characteristics.CurrentHeatingCoolingState.OFF);
                (_b = this.targetTemperature) === null || _b === void 0 ? void 0 : _b.updateValue(this.device.get('core:TargetTemperatureState'));
                break;
            case 'eco':
                (_c = this.currentState) === null || _c === void 0 ? void 0 : _c.updateValue(Platform_1.Characteristics.CurrentHeatingCoolingState.COOL);
                targetTemperature = targetTemperature - Number(this.device.get('core:EcoRoomTemperatureState'));
                break;
            case 'comfort':
                (_d = this.currentState) === null || _d === void 0 ? void 0 : _d.updateValue(Platform_1.Characteristics.CurrentHeatingCoolingState.HEAT);
                break;
        }
        switch (this.device.get('core:OperatingModeState')) {
            case 'standby':
                (_e = this.targetState) === null || _e === void 0 ? void 0 : _e.updateValue(Platform_1.Characteristics.TargetHeatingCoolingState.OFF);
                break;
            case 'internal':
                (_f = this.prog) === null || _f === void 0 ? void 0 : _f.updateValue(true);
                (_g = this.targetState) === null || _g === void 0 ? void 0 : _g.updateValue(Platform_1.Characteristics.TargetHeatingCoolingState.AUTO);
                if (Number(this.device.get('core:DerogatedTargetTemperatureState')) > 0) {
                    (_h = this.targetTemperature) === null || _h === void 0 ? void 0 : _h.updateValue(this.device.get('core:DerogatedTargetTemperatureState'));
                }
                else {
                    (_j = this.targetTemperature) === null || _j === void 0 ? void 0 : _j.updateValue(targetTemperature);
                }
                break;
            case 'external':
                (_k = this.prog) === null || _k === void 0 ? void 0 : _k.updateValue(false);
                (_l = this.targetState) === null || _l === void 0 ? void 0 : _l.updateValue(Platform_1.Characteristics.TargetHeatingCoolingState.AUTO);
                (_m = this.targetTemperature) === null || _m === void 0 ? void 0 : _m.updateValue(targetTemperature);
                break;
        }
    }
}
exports.default = AtlanticElectricalTowelDryer;
//# sourceMappingURL=AtlanticElectricalTowelDryer.js.map
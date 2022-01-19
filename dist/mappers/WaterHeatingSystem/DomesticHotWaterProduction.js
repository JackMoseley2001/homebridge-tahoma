"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Platform_1 = require("../../Platform");
const overkiz_client_1 = require("overkiz-client");
const WaterHeatingSystem_1 = __importDefault(require("../WaterHeatingSystem"));
const CustomCharacteristics_1 = require("../../CustomCharacteristics");
class DomesticHotWaterProduction extends WaterHeatingSystem_1.default {
    constructor() {
        super(...arguments);
        this.THERMOSTAT_CHARACTERISTICS = ['eco'];
        this.TARGET_MODES = [
            Platform_1.Characteristics.TargetHeatingCoolingState.AUTO,
            Platform_1.Characteristics.TargetHeatingCoolingState.HEAT,
            Platform_1.Characteristics.TargetHeatingCoolingState.OFF,
        ];
    }
    registerServices() {
        const service = this.registerThermostatService();
        service.addOptionalCharacteristic(CustomCharacteristics_1.TargetShowerCharacteristic);
        service.addOptionalCharacteristic(CustomCharacteristics_1.CurrentShowerCharacteristic);
        this.registerSwitchService('boost');
        if (this.device.hasState('core:NumberOfShowerRemainingState')) {
            this.currentShower = service.getCharacteristic(CustomCharacteristics_1.CurrentShowerCharacteristic);
            this.targetShower = service.getCharacteristic(CustomCharacteristics_1.TargetShowerCharacteristic);
            this.targetShower.setProps({
                minValue: this.device.getNumber('core:MinimalShowerManualModeState'),
                maxValue: this.device.getNumber('core:MaximalShowerManualModeState'),
            });
            this.targetShower.onSet(this.setTargetShower.bind(this));
        }
    }
    getTargetStateCommands(value) {
        var _a, _b;
        const commands = Array();
        if (this.device.hasCommand('setDHWMode')) {
            if (((_a = this.targetState) === null || _a === void 0 ? void 0 : _a.value) === Platform_1.Characteristics.TargetHeatingCoolingState.OFF) {
                commands.push(new overkiz_client_1.Command('setAbsenceMode', 'off'));
            }
            switch (value) {
                case Platform_1.Characteristics.TargetHeatingCoolingState.AUTO:
                    commands.push(new overkiz_client_1.Command('setDHWMode', 'autoMode'));
                    break;
                case Platform_1.Characteristics.TargetHeatingCoolingState.HEAT:
                    if ((_b = this.eco) === null || _b === void 0 ? void 0 : _b.value) {
                        commands.push(new overkiz_client_1.Command('setDHWMode', 'manualEcoActive'));
                    }
                    else {
                        commands.push(new overkiz_client_1.Command('setDHWMode', 'manualEcoInactive'));
                    }
                    break;
                case Platform_1.Characteristics.TargetHeatingCoolingState.OFF:
                    commands.push(new overkiz_client_1.Command('setAbsenceMode', 'on'));
                    break;
            }
            return commands;
        }
        else if (this.device.hasCommand('setCurrentOperatingMode')) {
            switch (value) {
                case Platform_1.Characteristics.TargetHeatingCoolingState.AUTO:
                    return new overkiz_client_1.Command('setCurrentOperatingMode', { 'relaunch': 'off', 'absence': 'off' });
                case Platform_1.Characteristics.TargetHeatingCoolingState.HEAT:
                    return new overkiz_client_1.Command('setCurrentOperatingMode', { 'relaunch': 'on', 'absence': 'off' });
                case Platform_1.Characteristics.TargetHeatingCoolingState.OFF:
                    return new overkiz_client_1.Command('setCurrentOperatingMode', { 'relaunch': 'off', 'absence': 'on' });
            }
        }
        else if (this.device.hasCommand('setBoostModeDuration')) {
            switch (value) {
                case Platform_1.Characteristics.TargetHeatingCoolingState.AUTO:
                    return [
                        new overkiz_client_1.Command('setBoostModeDuration', 0),
                        new overkiz_client_1.Command('setAwayModeDuration', 0),
                    ];
                case Platform_1.Characteristics.TargetHeatingCoolingState.HEAT:
                    return new overkiz_client_1.Command('setBoostModeDuration', 1);
                case Platform_1.Characteristics.TargetHeatingCoolingState.OFF:
                    return new overkiz_client_1.Command('setAwayModeDuration', 30);
            }
        }
        else if (this.device.hasCommand('setBoostMode')) {
            switch (value) {
                case Platform_1.Characteristics.TargetHeatingCoolingState.AUTO:
                    return [
                        new overkiz_client_1.Command('setBoostMode', 'off'),
                        new overkiz_client_1.Command('setAbsenceMode', 'off'),
                    ];
                case Platform_1.Characteristics.TargetHeatingCoolingState.HEAT:
                    return new overkiz_client_1.Command('setBoostMode', 'on');
                case Platform_1.Characteristics.TargetHeatingCoolingState.OFF:
                    return new overkiz_client_1.Command('setAbsenceMode', 'on');
            }
        }
    }
    getTargetTemperatureCommands(value) {
        return new overkiz_client_1.Command('setWaterTargetTemperature', value);
    }
    getOnCommands(value) {
        return new overkiz_client_1.Command('setBoostMode', value ? 'on' : 'off');
    }
    async setTargetShower(value) {
        var _a;
        const previous = (_a = this.targetShower) === null || _a === void 0 ? void 0 : _a.value;
        const action = await this.executeCommands(new overkiz_client_1.Command('setExpectedNumberOfShower', value));
        action.on('update', (state, data) => {
            var _a;
            switch (state) {
                case overkiz_client_1.ExecutionState.FAILED:
                    if (previous) {
                        (_a = this.targetShower) === null || _a === void 0 ? void 0 : _a.updateValue(previous);
                    }
                    break;
            }
        });
    }
    onStateChanged(name, value) {
        var _a, _b, _c, _d, _e, _f;
        switch (name) {
            case 'io:DHWBoostModeState':
                (_a = this.on) === null || _a === void 0 ? void 0 : _a.updateValue(value !== 'off');
                break;
            case 'core:WaterTemperatureState':
                if (!this.device.hasState('io:MiddleWaterTemperatureState')) {
                    (_b = this.currentTemperature) === null || _b === void 0 ? void 0 : _b.updateValue(value);
                }
                break;
            case 'io:MiddleWaterTemperatureState':
                (_c = this.currentTemperature) === null || _c === void 0 ? void 0 : _c.updateValue(value);
                break;
            case 'core:TargetTemperatureState':
            case 'core:WaterTargetTemperatureState':
                (_d = this.targetTemperature) === null || _d === void 0 ? void 0 : _d.updateValue(value);
                break;
            case 'io:DHWModeState':
            case 'io:DHWAbsenceModeState':
                this.postpone(this.computeStates);
                break;
            case 'core:NumberOfShowerRemainingState':
                (_e = this.currentShower) === null || _e === void 0 ? void 0 : _e.updateValue(value);
                break;
            case 'core:ExpectedNumberOfShowerState':
                (_f = this.targetShower) === null || _f === void 0 ? void 0 : _f.updateValue(value);
                break;
        }
    }
    computeStates() {
        var _a, _b, _c, _d, _e, _f;
        let targetState;
        if (this.device.get('io:DHWAbsenceModeState') === 'off') {
            switch (this.device.get('io:DHWModeState')) {
                case 'autoMode':
                    targetState = Platform_1.Characteristics.TargetHeatingCoolingState.AUTO;
                    (_a = this.currentState) === null || _a === void 0 ? void 0 : _a.updateValue(Platform_1.Characteristics.CurrentHeatingCoolingState.HEAT);
                    break;
                case 'manualEcoInactive':
                    (_b = this.eco) === null || _b === void 0 ? void 0 : _b.updateValue(false);
                    targetState = Platform_1.Characteristics.TargetHeatingCoolingState.HEAT;
                    (_c = this.currentState) === null || _c === void 0 ? void 0 : _c.updateValue(Platform_1.Characteristics.CurrentHeatingCoolingState.HEAT);
                    break;
                case 'manualEcoActive':
                    (_d = this.eco) === null || _d === void 0 ? void 0 : _d.updateValue(true);
                    targetState = Platform_1.Characteristics.TargetHeatingCoolingState.HEAT;
                    (_e = this.currentState) === null || _e === void 0 ? void 0 : _e.updateValue(Platform_1.Characteristics.CurrentHeatingCoolingState.COOL);
                    break;
            }
        }
        else {
            targetState = Platform_1.Characteristics.TargetHeatingCoolingState.OFF;
            (_f = this.currentState) === null || _f === void 0 ? void 0 : _f.updateValue(Platform_1.Characteristics.CurrentHeatingCoolingState.OFF);
        }
        if (this.targetState !== undefined && targetState !== undefined && this.isIdle) {
            this.targetState.updateValue(targetState);
        }
    }
}
exports.default = DomesticHotWaterProduction;
//# sourceMappingURL=DomesticHotWaterProduction.js.map
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const overkiz_client_1 = require("overkiz-client");
const Platform_1 = require("../../../Platform");
const DomesticHotWaterProduction_1 = __importDefault(require("../DomesticHotWaterProduction"));
class AtlanticDomesticHotWaterProductionV2_SPLIT_IOComponent extends DomesticHotWaterProduction_1.default {
    constructor() {
        super(...arguments);
        this.THERMOSTAT_CHARACTERISTICS = ['eco'];
        this.TARGET_MODES = [
            Platform_1.Characteristics.TargetHeatingCoolingState.AUTO,
            Platform_1.Characteristics.TargetHeatingCoolingState.HEAT,
            Platform_1.Characteristics.TargetHeatingCoolingState.OFF,
        ];
    }
    registerThermostatService() {
        var _a;
        const service = super.registerThermostatService();
        (_a = this.targetTemperature) === null || _a === void 0 ? void 0 : _a.setProps({
            minValue: 50.0,
            maxValue: 54.5,
            validValues: [50, 52, 54, 54.5, 55],
            minStep: 2,
        });
        return service;
    }
    getTargetTemperatureCommands(value) {
        const safeValue = value === 54 ? 54.5 : value;
        return new overkiz_client_1.Command('setTargetTemperature', safeValue);
    }
    getTargetStateCommands(value) {
        var _a, _b;
        const commands = Array();
        if (((_a = this.targetState) === null || _a === void 0 ? void 0 : _a.value) === Platform_1.Characteristics.TargetHeatingCoolingState.OFF) {
            commands.push(new overkiz_client_1.Command('setCurrentOperatingMode', { 'relaunch': 'off', 'absence': 'off' }));
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
                commands.push(new overkiz_client_1.Command('setCurrentOperatingMode', { 'relaunch': 'off', 'absence': 'on' }));
                break;
        }
        return commands;
    }
    getOnCommands(value) {
        return new overkiz_client_1.Command('setCurrentOperatingMode', { 'relaunch': value ? 'on' : 'off', 'absence': 'off' });
    }
    onStateChanged(name, value) {
        var _a, _b;
        switch (name) {
            case 'io:MiddleWaterTemperatureState':
                (_a = this.currentTemperature) === null || _a === void 0 ? void 0 : _a.updateValue(value);
                break;
            case 'core:TargetTemperatureState':
                (_b = this.targetTemperature) === null || _b === void 0 ? void 0 : _b.updateValue(value);
                break;
            case 'io:DHWModeState':
            case 'core:OperatingModeState':
                this.postpone(this.computeStates);
                break;
        }
    }
    computeStates() {
        var _a, _b, _c, _d, _e, _f;
        let targetState;
        const operatingMode = this.device.get('core:OperatingModeState');
        (_a = this.on) === null || _a === void 0 ? void 0 : _a.updateValue(operatingMode.relaunch !== 'off');
        if (operatingMode.absence === 'off') {
            switch (this.device.get('io:DHWModeState')) {
                case 'autoMode':
                    targetState = Platform_1.Characteristics.TargetHeatingCoolingState.AUTO;
                    break;
                case 'manualEcoInactive':
                    (_b = this.eco) === null || _b === void 0 ? void 0 : _b.updateValue(false);
                    targetState = Platform_1.Characteristics.TargetHeatingCoolingState.HEAT;
                    break;
                case 'manualEcoActive':
                    (_c = this.eco) === null || _c === void 0 ? void 0 : _c.updateValue(true);
                    targetState = Platform_1.Characteristics.TargetHeatingCoolingState.HEAT;
                    break;
            }
            const powerHeatPumpState = this.device.get('io:PowerHeatPumpState');
            const powerHeatElectricalState = this.device.get('io:PowerHeatElectricalState');
            if (powerHeatElectricalState > 100 || powerHeatPumpState > 100) {
                (_d = this.currentState) === null || _d === void 0 ? void 0 : _d.updateValue(Platform_1.Characteristics.CurrentHeatingCoolingState.HEAT);
            }
            else {
                (_e = this.currentState) === null || _e === void 0 ? void 0 : _e.updateValue(Platform_1.Characteristics.CurrentHeatingCoolingState.OFF);
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
exports.default = AtlanticDomesticHotWaterProductionV2_SPLIT_IOComponent;
//# sourceMappingURL=AtlanticDomesticHotWaterProductionV2_SPLIT_IOComponent.js.map
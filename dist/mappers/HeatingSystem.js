"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Platform_1 = require("../Platform");
const overkiz_client_1 = require("overkiz-client");
const Mapper_1 = __importDefault(require("../Mapper"));
const CustomCharacteristics_1 = require("../CustomCharacteristics");
class HeatingSystem extends Mapper_1.default {
    constructor() {
        super(...arguments);
        this.THERMOSTAT_CHARACTERISTICS = [];
        this.MIN_TEMP = 7;
        this.MAX_TEMP = 26;
        this.TARGET_MODES = [
            Platform_1.Characteristics.TargetHeatingCoolingState.AUTO,
            Platform_1.Characteristics.TargetHeatingCoolingState.OFF,
        ];
    }
    applyConfig(config) {
        this.derogationDuration = config['derogationDuration'] || 1;
        this.comfortTemperature = config['comfort'] || 19;
        this.ecoTemperature = config['eco'] || 17;
    }
    registerThermostatService(subtype) {
        var _a, _b, _c, _d;
        const service = this.registerService(Platform_1.Services.Thermostat, subtype);
        service.setPrimaryService(true);
        service.addOptionalCharacteristic(CustomCharacteristics_1.ProgCharacteristic);
        service.addOptionalCharacteristic(CustomCharacteristics_1.EcoCharacteristic);
        this.currentTemperature = service.getCharacteristic(Platform_1.Characteristics.CurrentTemperature);
        this.targetTemperature = service.getCharacteristic(Platform_1.Characteristics.TargetTemperature);
        this.currentState = service.getCharacteristic(Platform_1.Characteristics.CurrentHeatingCoolingState);
        this.targetState = service.getCharacteristic(Platform_1.Characteristics.TargetHeatingCoolingState);
        (_a = this.targetState) === null || _a === void 0 ? void 0 : _a.setProps({ validValues: this.TARGET_MODES });
        (_b = this.targetTemperature) === null || _b === void 0 ? void 0 : _b.setProps({ minValue: this.MIN_TEMP, maxValue: this.MAX_TEMP, minStep: 0.5 });
        if (this.targetTemperature && this.targetTemperature.value < this.targetTemperature.props.minValue) {
            this.targetTemperature.value = this.targetTemperature.props.minValue;
        }
        if (this.targetTemperature && this.targetTemperature.value > this.targetTemperature.props.maxValue) {
            this.targetTemperature.value = this.targetTemperature.props.maxValue;
        }
        if (this.THERMOSTAT_CHARACTERISTICS.includes('prog')) {
            this.prog = service.getCharacteristic(CustomCharacteristics_1.ProgCharacteristic);
            this.prog.onSet((value) => {
                var _a;
                (_a = this.prog) === null || _a === void 0 ? void 0 : _a.updateValue(value);
                this.sendProgCommands();
            });
        }
        if (this.THERMOSTAT_CHARACTERISTICS.includes('eco')) {
            this.eco = service.getCharacteristic(CustomCharacteristics_1.EcoCharacteristic);
            this.eco.onSet((value) => {
                var _a;
                (_a = this.eco) === null || _a === void 0 ? void 0 : _a.updateValue(value);
                this.sendProgCommands();
            });
        }
        (_c = this.targetState) === null || _c === void 0 ? void 0 : _c.onSet(this.setTargetState.bind(this));
        (_d = this.targetTemperature) === null || _d === void 0 ? void 0 : _d.onSet(this.debounce(this.setTargetTemperature));
        return service;
    }
    registerSwitchService(subtype) {
        var _a;
        const service = this.registerService(Platform_1.Services.Switch, subtype);
        this.on = service.getCharacteristic(Platform_1.Characteristics.On);
        (_a = this.on) === null || _a === void 0 ? void 0 : _a.onSet(this.setOn.bind(this));
        return service;
    }
    getTargetStateCommands(value) {
        switch (value) {
            case Platform_1.Characteristics.TargetHeatingCoolingState.AUTO:
                return new overkiz_client_1.Command('auto');
            case Platform_1.Characteristics.TargetHeatingCoolingState.HEAT:
                return new overkiz_client_1.Command('heat');
            case Platform_1.Characteristics.TargetHeatingCoolingState.COOL:
                return new overkiz_client_1.Command('cool');
            case Platform_1.Characteristics.TargetHeatingCoolingState.OFF:
                return new overkiz_client_1.Command('off');
            default:
                return new overkiz_client_1.Command('auto');
        }
    }
    async setTargetState(value) {
        var _a;
        if (value === ((_a = this.targetState) === null || _a === void 0 ? void 0 : _a.value)) {
            return;
        }
        const action = await this.executeCommands(this.getTargetStateCommands(value));
        action.on('update', (state) => {
            var _a, _b;
            switch (state) {
                case overkiz_client_1.ExecutionState.COMPLETED:
                    if (this.stateless) {
                        (_a = this.currentState) === null || _a === void 0 ? void 0 : _a.updateValue(value);
                    }
                    break;
                case overkiz_client_1.ExecutionState.FAILED:
                    if (this.currentState) {
                        (_b = this.targetState) === null || _b === void 0 ? void 0 : _b.updateValue(this.currentState.value);
                    }
                    break;
            }
        });
    }
    getTargetTemperatureCommands(value) {
        return new overkiz_client_1.Command('setTargetTemperature', value);
    }
    async setTargetTemperature(value) {
        await this.executeCommands(this.getTargetTemperatureCommands(value));
    }
    getOnCommands(value) {
        return new overkiz_client_1.Command('setOn', value);
    }
    async setOn(value) {
        const action = await this.executeCommands(this.getOnCommands(value));
        action.on('update', (state) => {
            var _a;
            switch (state) {
                case overkiz_client_1.ExecutionState.FAILED:
                    (_a = this.on) === null || _a === void 0 ? void 0 : _a.updateValue(!value);
                    break;
            }
        });
    }
    getProgCommands() {
        var _a;
        return this.getTargetStateCommands((_a = this.targetState) === null || _a === void 0 ? void 0 : _a.value);
    }
    sendProgCommands() {
        var _a;
        if (((_a = this.targetState) === null || _a === void 0 ? void 0 : _a.value) !== Platform_1.Characteristics.TargetHeatingCoolingState.OFF) {
            this.executeCommands(this.getProgCommands());
        }
    }
    onTemperatureUpdate(value) {
        var _a;
        (_a = this.currentTemperature) === null || _a === void 0 ? void 0 : _a.updateValue(value > 273.15 ? (value - 273.15) : value);
    }
    onStateChanged(name, value) {
        var _a;
        switch (name) {
            case 'core:TemperatureState':
                this.onTemperatureUpdate(value);
                break;
            case 'core:TargetTemperatureState':
                (_a = this.targetTemperature) === null || _a === void 0 ? void 0 : _a.updateValue(value);
                break;
        }
    }
}
exports.default = HeatingSystem;
//# sourceMappingURL=HeatingSystem.js.map
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Platform_1 = require("../Platform");
const Mapper_1 = __importDefault(require("../Mapper"));
class SmokeSensor extends Mapper_1.default {
    registerServices() {
        const service = this.registerService(Platform_1.Services.SmokeSensor);
        this.smoke = service.getCharacteristic(Platform_1.Characteristics.SmokeDetected);
        if (this.device.hasState('core:SensorDefectState') ||
            this.device.hasState('io:SensorDefMaintenanceSensorPartBatteryStateectState') ||
            this.device.hasState('io:MaintenanceRadioPartBatteryState') ||
            this.device.hasState('io:SensorRoomState')) {
            this.fault = service.getCharacteristic(Platform_1.Characteristics.StatusFault);
            this.battery = service.getCharacteristic(Platform_1.Characteristics.StatusLowBattery);
        }
        if (this.device.hasState('core:StatusState')) {
            this.active = service.getCharacteristic(Platform_1.Characteristics.StatusActive);
        }
    }
    onStateChanged(name, value) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
        switch (name) {
            case 'core:StatusState':
                (_a = this.active) === null || _a === void 0 ? void 0 : _a.updateValue(value === 'available');
                break;
            case 'core:SmokeState':
                (_b = this.smoke) === null || _b === void 0 ? void 0 : _b.updateValue(value === 'detected');
                break;
            case 'core:SensorDefectState':
                switch (value) {
                    case 'lowBattery':
                        (_c = this.battery) === null || _c === void 0 ? void 0 : _c.updateValue(Platform_1.Characteristics.StatusLowBattery.BATTERY_LEVEL_LOW);
                        break;
                    case 'maintenanceRequired':
                    case 'dead':
                        (_d = this.fault) === null || _d === void 0 ? void 0 : _d.updateValue(Platform_1.Characteristics.StatusFault.GENERAL_FAULT);
                        break;
                    case 'noDefect':
                        (_e = this.fault) === null || _e === void 0 ? void 0 : _e.updateValue(Platform_1.Characteristics.StatusFault.NO_FAULT);
                        (_f = this.battery) === null || _f === void 0 ? void 0 : _f.updateValue(Platform_1.Characteristics.StatusLowBattery.BATTERY_LEVEL_NORMAL);
                        break;
                }
                break;
            case 'io:MaintenanceRadioPartBatteryState':
            case 'io:MaintenanceSensorPartBatteryState':
                switch (value) {
                    case 'absence':
                    case 'normal':
                        (_g = this.battery) === null || _g === void 0 ? void 0 : _g.updateValue(Platform_1.Characteristics.StatusLowBattery.BATTERY_LEVEL_NORMAL);
                        break;
                    case 'low':
                        (_h = this.battery) === null || _h === void 0 ? void 0 : _h.updateValue(Platform_1.Characteristics.StatusLowBattery.BATTERY_LEVEL_LOW);
                        break;
                }
                break;
            case 'io:SensorRoomState':
                switch (value) {
                    case 'clean':
                        (_j = this.fault) === null || _j === void 0 ? void 0 : _j.updateValue(Platform_1.Characteristics.StatusFault.NO_FAULT);
                        break;
                    case 'dirty':
                        (_k = this.fault) === null || _k === void 0 ? void 0 : _k.updateValue(Platform_1.Characteristics.StatusFault.GENERAL_FAULT);
                        break;
                }
                break;
        }
    }
}
exports.default = SmokeSensor;
//# sourceMappingURL=SmokeSensor.js.map
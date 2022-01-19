"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Platform_1 = require("../Platform");
const Mapper_1 = __importDefault(require("../Mapper"));
class RainSensor extends Mapper_1.default {
    registerServices() {
        const service = this.registerService(Platform_1.Services.ContactSensor);
        this.rain = service.getCharacteristic(Platform_1.Characteristics.ContactSensorState);
        if (this.device.hasState('core:SensorDefectState')) {
            this.fault = service.getCharacteristic(Platform_1.Characteristics.StatusFault);
            this.battery = service.getCharacteristic(Platform_1.Characteristics.StatusLowBattery);
        }
    }
    onStateChanged(name, value) {
        var _a, _b, _c, _d, _e;
        switch (name) {
            case 'core:RainState':
                (_a = this.rain) === null || _a === void 0 ? void 0 : _a.updateValue(value === 'detected');
                break;
            case 'core:SensorDefectState':
                switch (value) {
                    case 'lowBattery':
                        (_b = this.battery) === null || _b === void 0 ? void 0 : _b.updateValue(Platform_1.Characteristics.StatusLowBattery.BATTERY_LEVEL_LOW);
                        break;
                    case 'maintenanceRequired':
                    case 'dead':
                        (_c = this.fault) === null || _c === void 0 ? void 0 : _c.updateValue(Platform_1.Characteristics.StatusFault.GENERAL_FAULT);
                        break;
                    case 'noDefect':
                        (_d = this.fault) === null || _d === void 0 ? void 0 : _d.updateValue(Platform_1.Characteristics.StatusFault.NO_FAULT);
                        (_e = this.battery) === null || _e === void 0 ? void 0 : _e.updateValue(Platform_1.Characteristics.StatusLowBattery.BATTERY_LEVEL_NORMAL);
                        break;
                }
                break;
        }
    }
}
exports.default = RainSensor;
//# sourceMappingURL=RainSensor.js.map
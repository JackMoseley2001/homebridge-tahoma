"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Platform_1 = require("../Platform");
const Mapper_1 = __importDefault(require("../Mapper"));
class ContactSensor extends Mapper_1.default {
    registerServices() {
        const service = this.registerService(Platform_1.Services.ContactSensor);
        this.state = service.getCharacteristic(Platform_1.Characteristics.ContactSensorState);
        if (this.device.hasState('core:SensorDefectState')) {
            this.fault = service.getCharacteristic(Platform_1.Characteristics.StatusFault);
            this.battery = service.getCharacteristic(Platform_1.Characteristics.StatusLowBattery);
        }
    }
    onStateChanged(name, value) {
        var _a, _b, _c, _d, _e, _f;
        switch (name) {
            case 'core:ContactState':
                switch (value) {
                    case 'closed':
                        (_a = this.state) === null || _a === void 0 ? void 0 : _a.updateValue(Platform_1.Characteristics.ContactSensorState.CONTACT_DETECTED);
                        break;
                    case 'tilt':
                    case 'open':
                        (_b = this.state) === null || _b === void 0 ? void 0 : _b.updateValue(Platform_1.Characteristics.ContactSensorState.CONTACT_NOT_DETECTED);
                        break;
                }
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
        }
    }
}
exports.default = ContactSensor;
//# sourceMappingURL=ContactSensor.js.map
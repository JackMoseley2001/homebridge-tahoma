"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Platform_1 = require("../Platform");
const Mapper_1 = __importDefault(require("../Mapper"));
class TemperatureSensor extends Mapper_1.default {
    registerServices() {
        const service = this.registerService(Platform_1.Services.TemperatureSensor);
        this.temperature = service.getCharacteristic(Platform_1.Characteristics.CurrentTemperature);
    }
    onStateChanged(name, value) {
        var _a;
        switch (name) {
            case 'core:TemperatureState':
                (_a = this.temperature) === null || _a === void 0 ? void 0 : _a.updateValue(value > 200 ? (value - 273.15) : value);
                break;
        }
    }
}
exports.default = TemperatureSensor;
//# sourceMappingURL=TemperatureSensor.js.map
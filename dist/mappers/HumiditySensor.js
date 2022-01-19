"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Platform_1 = require("../Platform");
const Mapper_1 = __importDefault(require("../Mapper"));
class HumiditySensor extends Mapper_1.default {
    registerServices() {
        const service = this.registerService(Platform_1.Services.HumiditySensor);
        this.humidity = service.getCharacteristic(Platform_1.Characteristics.CurrentRelativeHumidity);
    }
    onStateChanged(name, value) {
        var _a;
        switch (name) {
            case 'core:RelativeHumidityState':
                (_a = this.humidity) === null || _a === void 0 ? void 0 : _a.updateValue(value);
                break;
        }
    }
}
exports.default = HumiditySensor;
//# sourceMappingURL=HumiditySensor.js.map
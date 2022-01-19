"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Platform_1 = require("../Platform");
const Mapper_1 = __importDefault(require("../Mapper"));
class AirSensor extends Mapper_1.default {
    registerServices() {
        const service = this.registerService(Platform_1.Services.AirQualitySensor);
        service.addOptionalCharacteristic(Platform_1.Characteristics.CarbonDioxideLevel);
        this.quality = service.getCharacteristic(Platform_1.Characteristics.AirQuality);
        this.co2 = service.getCharacteristic(Platform_1.Characteristics.CarbonDioxideLevel);
    }
    onStateChanged(name, value) {
        var _a, _b;
        switch (name) {
            case 'core:CO2ConcentrationState':
                (_a = this.co2) === null || _a === void 0 ? void 0 : _a.updateValue(value);
                (_b = this.quality) === null || _b === void 0 ? void 0 : _b.updateValue(this.co2ToQuality(value));
                break;
        }
    }
    co2ToQuality(value) {
        if (value < 350) {
            return Platform_1.Characteristics.AirQuality.EXCELLENT;
        }
        else if (value < 1000) {
            return Platform_1.Characteristics.AirQuality.GOOD;
        }
        else if (value < 2000) {
            return Platform_1.Characteristics.AirQuality.FAIR;
        }
        else if (value < 5000) {
            return Platform_1.Characteristics.AirQuality.INFERIOR;
        }
        else {
            return Platform_1.Characteristics.AirQuality.POOR;
        }
    }
}
exports.default = AirSensor;
//# sourceMappingURL=AirSensor.js.map
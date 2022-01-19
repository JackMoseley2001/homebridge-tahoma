"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Platform_1 = require("../Platform");
const HeatingSystem_1 = __importDefault(require("./HeatingSystem"));
class WaterHeatingSystem extends HeatingSystem_1.default {
    constructor() {
        super(...arguments);
        this.MIN_TEMP = 45;
        this.MAX_TEMP = 65;
        this.TARGET_MODES = [
            Platform_1.Characteristics.TargetHeatingCoolingState.AUTO,
            Platform_1.Characteristics.TargetHeatingCoolingState.OFF,
        ];
    }
    registerThermostatService(subtype) {
        var _a;
        const service = super.registerThermostatService(subtype);
        service.setPrimaryService(true);
        (_a = this.targetTemperature) === null || _a === void 0 ? void 0 : _a.setProps({ minStep: 1 });
        return service;
    }
}
exports.default = WaterHeatingSystem;
//# sourceMappingURL=WaterHeatingSystem.js.map
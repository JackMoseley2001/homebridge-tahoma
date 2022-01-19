"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Platform_1 = require("../../Platform");
const HeatingSystem_1 = __importDefault(require("../HeatingSystem"));
class HeatingSetPoint extends HeatingSystem_1.default {
    registerServices() {
        var _a, _b;
        this.registerThermostatService();
        (_a = this.targetState) === null || _a === void 0 ? void 0 : _a.setProps({ validValues: [
                Platform_1.Characteristics.TargetHeatingCoolingState.AUTO,
            ] });
        (_b = this.targetState) === null || _b === void 0 ? void 0 : _b.updateValue(Platform_1.Characteristics.TargetHeatingCoolingState.AUTO);
    }
}
exports.default = HeatingSetPoint;
//# sourceMappingURL=HeatingSetPoint.js.map
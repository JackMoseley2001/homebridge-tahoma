"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Platform_1 = require("../../Platform");
const ContactSensor_1 = __importDefault(require("../ContactSensor"));
class WaterDetectionSensor extends ContactSensor_1.default {
    onStateChanged(name, value) {
        var _a;
        switch (name) {
            case 'core:WaterDetectionState ':
                (_a = this.state) === null || _a === void 0 ? void 0 : _a.updateValue(value === 'detected' ?
                    Platform_1.Characteristics.ContactSensorState.CONTACT_DETECTED :
                    Platform_1.Characteristics.ContactSensorState.CONTACT_NOT_DETECTED);
                break;
        }
    }
}
exports.default = WaterDetectionSensor;
//# sourceMappingURL=WaterDetectionSensor.js.map
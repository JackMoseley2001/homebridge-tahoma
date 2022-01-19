"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Platform_1 = require("../Platform");
const ContactSensor_1 = __importDefault(require("./ContactSensor"));
class WindowHandle extends ContactSensor_1.default {
    onStateChanged(name, value) {
        var _a, _b, _c, _d;
        switch (name) {
            case 'core:ThreeWayHandleDirectionState':
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
            case 'core:OpenClosedState':
                switch (value) {
                    case 'closed':
                        (_c = this.state) === null || _c === void 0 ? void 0 : _c.updateValue(Platform_1.Characteristics.ContactSensorState.CONTACT_DETECTED);
                        break;
                    case 'open':
                        (_d = this.state) === null || _d === void 0 ? void 0 : _d.updateValue(Platform_1.Characteristics.ContactSensorState.CONTACT_NOT_DETECTED);
                        break;
                }
                break;
        }
    }
}
exports.default = WindowHandle;
//# sourceMappingURL=WindowHandle.js.map
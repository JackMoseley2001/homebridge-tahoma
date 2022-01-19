"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Pergola_1 = __importDefault(require("../Pergola"));
class PergolaHorizontalAwningUno extends Pergola_1.default {
    onStateChanged(name, value) {
        var _a, _b, _c, _d;
        // Fix (https://github.com/dubocr/homebridge-tahoma/issues/305)
        value = 100 - value;
        switch (name) {
            case 'core:ClosureState':
                (_a = this.currentPosition) === null || _a === void 0 ? void 0 : _a.updateValue(this.reversedValue(value));
                if (!this.device.hasState('core:TargetClosureState') && this.isIdle) {
                    (_b = this.targetPosition) === null || _b === void 0 ? void 0 : _b.updateValue(this.reversedValue(value));
                }
                break;
            case 'core:TargetClosureState':
                (_c = this.targetPosition) === null || _c === void 0 ? void 0 : _c.updateValue(this.reversedValue(value));
                if (!this.device.hasState('core:ClosureState')) {
                    (_d = this.currentPosition) === null || _d === void 0 ? void 0 : _d.updateValue(this.reversedValue(value));
                }
                break;
        }
    }
}
exports.default = PergolaHorizontalAwningUno;
//# sourceMappingURL=PergolaHorizontalAwningUno.js.map
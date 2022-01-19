"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const overkiz_client_1 = require("overkiz-client");
const VenetianBlind_1 = __importDefault(require("./VenetianBlind"));
class AdjustableSlatsRollerShutter extends VenetianBlind_1.default {
    getTargetCommands(value) {
        var _a;
        if (this.blindMode) {
            if (value === 100) {
                return new overkiz_client_1.Command('setClosure', 0);
            }
            else {
                return new overkiz_client_1.Command('setClosureOrOrientation', [100, this.reversedValue(value)]);
            }
        }
        else {
            return new overkiz_client_1.Command('setClosureOrOrientation', [
                this.reversedValue(value),
                this.angleToOrientation((_a = this.targetAngle) === null || _a === void 0 ? void 0 : _a.value),
            ]);
        }
    }
    getTargetAngleCommands(value) {
        var _a;
        return new overkiz_client_1.Command('setClosureOrOrientation', [
            this.reversedValue((_a = this.targetPosition) === null || _a === void 0 ? void 0 : _a.value),
            this.angleToOrientation(value),
        ]);
    }
    onStateChanged(name, value) {
        var _a, _b;
        super.onStateChanged(name, value);
        switch (name) {
            case 'core:ClosureOrRockerPositionState':
                (_a = this.currentPosition) === null || _a === void 0 ? void 0 : _a.updateValue(this.reversedValue(value));
                if (!this.device.hasState('core:TargetClosureState')) {
                    (_b = this.targetPosition) === null || _b === void 0 ? void 0 : _b.updateValue(this.reversedValue(value));
                }
                break;
            default: break;
        }
    }
}
exports.default = AdjustableSlatsRollerShutter;
//# sourceMappingURL=AdjustableSlatsRollerShutter.js.map
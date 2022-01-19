"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Platform_1 = require("../../Platform");
const overkiz_client_1 = require("overkiz-client");
const Alarm_1 = __importDefault(require("../Alarm"));
class MyFoxAlarmController extends Alarm_1.default {
    getTargetCommands(value) {
        switch (value) {
            default:
            case Platform_1.Characteristics.SecuritySystemTargetState.STAY_ARM:
                return [];
            case Platform_1.Characteristics.SecuritySystemTargetState.NIGHT_ARM:
                return new overkiz_client_1.Command('partial');
            case Platform_1.Characteristics.SecuritySystemTargetState.AWAY_ARM:
                return new overkiz_client_1.Command('arm');
            case Platform_1.Characteristics.SecuritySystemTargetState.DISARM:
                return new overkiz_client_1.Command('disarm');
        }
    }
    onStateChanged(name, value) {
        var _a, _b, _c, _d, _e, _f;
        switch (name) {
            case 'myfox:AlarmStatusState':
                switch (value) {
                    default:
                    case 'disarmed':
                        (_a = this.currentState) === null || _a === void 0 ? void 0 : _a.updateValue(Platform_1.Characteristics.SecuritySystemCurrentState.DISARMED);
                        (_b = this.targetState) === null || _b === void 0 ? void 0 : _b.updateValue(Platform_1.Characteristics.SecuritySystemTargetState.DISARM);
                        break;
                    case 'armed':
                        (_c = this.currentState) === null || _c === void 0 ? void 0 : _c.updateValue(Platform_1.Characteristics.SecuritySystemCurrentState.AWAY_ARM);
                        (_d = this.targetState) === null || _d === void 0 ? void 0 : _d.updateValue(Platform_1.Characteristics.SecuritySystemTargetState.AWAY_ARM);
                        break;
                    case 'partial':
                        (_e = this.currentState) === null || _e === void 0 ? void 0 : _e.updateValue(Platform_1.Characteristics.SecuritySystemCurrentState.NIGHT_ARM);
                        (_f = this.targetState) === null || _f === void 0 ? void 0 : _f.updateValue(Platform_1.Characteristics.SecuritySystemTargetState.NIGHT_ARM);
                        break;
                }
                break;
        }
    }
}
exports.default = MyFoxAlarmController;
//# sourceMappingURL=MyFoxAlarmController.js.map
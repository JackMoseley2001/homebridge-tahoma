"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Platform_1 = require("../../Platform");
const overkiz_client_1 = require("overkiz-client");
const Alarm_1 = __importDefault(require("../Alarm"));
class TSKAlarmController extends Alarm_1.default {
    getTargetCommands(value) {
        switch (value) {
            default:
            case Platform_1.Characteristics.SecuritySystemTargetState.STAY_ARM:
                return new overkiz_client_1.Command('alarmPartial1');
            case Platform_1.Characteristics.SecuritySystemTargetState.NIGHT_ARM:
                return new overkiz_client_1.Command('alarmPartial2');
            case Platform_1.Characteristics.SecuritySystemTargetState.AWAY_ARM:
                return new overkiz_client_1.Command('alarmOn');
            case Platform_1.Characteristics.SecuritySystemTargetState.DISARM:
                return new overkiz_client_1.Command('alarmOff');
        }
    }
    onStateChanged(name, value) {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        switch (name) {
            case 'internal:CurrentAlarmModeState':
                switch (value) {
                    default:
                    case 'off':
                        (_a = this.currentState) === null || _a === void 0 ? void 0 : _a.updateValue(Platform_1.Characteristics.SecuritySystemCurrentState.DISARMED);
                        break;
                    case 'partial1':
                    case 'zone1':
                        (_b = this.currentState) === null || _b === void 0 ? void 0 : _b.updateValue(Platform_1.Characteristics.SecuritySystemCurrentState.STAY_ARM);
                        break;
                    case 'total':
                        (_c = this.currentState) === null || _c === void 0 ? void 0 : _c.updateValue(Platform_1.Characteristics.SecuritySystemCurrentState.AWAY_ARM);
                        break;
                    case 'partial2':
                    case 'zone2':
                        (_d = this.currentState) === null || _d === void 0 ? void 0 : _d.updateValue(Platform_1.Characteristics.SecuritySystemCurrentState.NIGHT_ARM);
                        break;
                }
                break;
            case 'internal:TargetAlarmModeState':
                switch (value) {
                    default:
                    case 'off':
                        (_e = this.targetState) === null || _e === void 0 ? void 0 : _e.updateValue(Platform_1.Characteristics.SecuritySystemTargetState.DISARM);
                        break;
                    case 'partial1':
                    case 'zone1':
                        (_f = this.targetState) === null || _f === void 0 ? void 0 : _f.updateValue(Platform_1.Characteristics.SecuritySystemTargetState.STAY_ARM);
                        break;
                    case 'total':
                        (_g = this.targetState) === null || _g === void 0 ? void 0 : _g.updateValue(Platform_1.Characteristics.SecuritySystemTargetState.AWAY_ARM);
                        break;
                    case 'partial2':
                    case 'zone2':
                        (_h = this.targetState) === null || _h === void 0 ? void 0 : _h.updateValue(Platform_1.Characteristics.SecuritySystemTargetState.NIGHT_ARM);
                        break;
                }
                break;
        }
    }
}
exports.default = TSKAlarmController;
//# sourceMappingURL=TSKAlarmController.js.map
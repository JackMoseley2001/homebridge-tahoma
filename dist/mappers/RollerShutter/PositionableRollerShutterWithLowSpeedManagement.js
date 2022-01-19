"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const moment_1 = __importDefault(require("moment"));
const overkiz_client_1 = require("overkiz-client");
const RollerShutter_1 = __importDefault(require("../RollerShutter"));
class PositionableRollerShutterWithLowSpeedManagement extends RollerShutter_1.default {
    applyConfig(config) {
        this.lowSpeed = config['lowSpeed'] || false;
    }
    getTargetCommands(value) {
        if (this.isLowSpeed) {
            return new overkiz_client_1.Command('setClosureAndLinearSpeed', [this.reversedValue(value), 'lowspeed']);
        }
        else {
            return new overkiz_client_1.Command('setClosure', this.reversedValue(value));
        }
    }
    get isLowSpeed() {
        if (this.lowSpeed === true) {
            return true;
        }
        else if (typeof this.lowSpeed === 'string') {
            const parts = this.lowSpeed.split(new RegExp('[-:]'));
            const now = (0, moment_1.default)();
            const start = (0, moment_1.default)();
            const end = (0, moment_1.default)();
            start.set({ 'hour': parseInt(parts[0]), 'minute': parseInt(parts[1]), 'second': 0, 'millisecond': 0 });
            end.set({ 'hour': parseInt(parts[2]), 'minute': parseInt(parts[3]), 'second': 0, 'millisecond': 0 });
            if (end.isBefore(start)) {
                return now.isAfter(start) || now.isBefore(end);
            }
            else {
                return now.isBetween(start, end);
            }
        }
        else {
            return false;
        }
    }
}
exports.default = PositionableRollerShutterWithLowSpeedManagement;
//# sourceMappingURL=PositionableRollerShutterWithLowSpeedManagement.js.map
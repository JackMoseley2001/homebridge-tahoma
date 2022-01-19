"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Platform_1 = require("../Platform");
const overkiz_client_1 = require("overkiz-client");
const Mapper_1 = __importDefault(require("../Mapper"));
class Alarm extends Mapper_1.default {
    applyConfig(config) {
        this.stayZones = config.stayZones || 'A';
        this.nightZones = config.nightZones || 'B';
        this.occupancySensor = config.occupancySensor || false;
    }
    registerServices() {
        const service = this.registerService(Platform_1.Services.SecuritySystem);
        this.currentState = service.getCharacteristic(Platform_1.Characteristics.SecuritySystemCurrentState);
        this.targetState = service.getCharacteristic(Platform_1.Characteristics.SecuritySystemTargetState);
        this.targetState.onSet(this.setTargetState.bind(this));
    }
    getTargetCommands(value) {
        switch (value) {
            default:
            case Platform_1.Characteristics.SecuritySystemTargetState.STAY_ARM:
                return new overkiz_client_1.Command('alarmZoneOn', [this.stayZones]);
            case Platform_1.Characteristics.SecuritySystemTargetState.NIGHT_ARM:
                return new overkiz_client_1.Command('alarmZoneOn', [this.nightZones]);
            case Platform_1.Characteristics.SecuritySystemTargetState.AWAY_ARM:
                return new overkiz_client_1.Command('alarmOn');
            case Platform_1.Characteristics.SecuritySystemTargetState.DISARM:
                return new overkiz_client_1.Command('alarmOff');
        }
    }
    async setTargetState(value) {
        const action = await this.executeCommands(this.getTargetCommands(value));
        action.on('update', (state, data) => {
            var _a, _b;
            switch (state) {
                case overkiz_client_1.ExecutionState.COMPLETED:
                    if (this.stateless) {
                        (_a = this.currentState) === null || _a === void 0 ? void 0 : _a.updateValue(value);
                    }
                    break;
                case overkiz_client_1.ExecutionState.FAILED:
                    if (this.currentState &&
                        this.currentState.value !== Platform_1.Characteristics.SecuritySystemCurrentState.ALARM_TRIGGERED) {
                        (_b = this.targetState) === null || _b === void 0 ? void 0 : _b.updateValue(this.currentState.value);
                    }
                    break;
            }
        });
    }
    onStateChanged(name, value) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j;
        switch (name) {
            case 'core:ActiveZonesState':
                switch (value) {
                    default:
                    case '':
                        (_a = this.currentState) === null || _a === void 0 ? void 0 : _a.updateValue(Platform_1.Characteristics.SecuritySystemCurrentState.DISARMED);
                        (_b = this.targetState) === null || _b === void 0 ? void 0 : _b.updateValue(Platform_1.Characteristics.SecuritySystemTargetState.DISARM);
                        break;
                    case this.stayZones:
                        (_c = this.currentState) === null || _c === void 0 ? void 0 : _c.updateValue(Platform_1.Characteristics.SecuritySystemCurrentState.STAY_ARM);
                        (_d = this.targetState) === null || _d === void 0 ? void 0 : _d.updateValue(Platform_1.Characteristics.SecuritySystemTargetState.STAY_ARM);
                        break;
                    case 'A,B,C':
                        (_e = this.currentState) === null || _e === void 0 ? void 0 : _e.updateValue(Platform_1.Characteristics.SecuritySystemCurrentState.AWAY_ARM);
                        (_f = this.targetState) === null || _f === void 0 ? void 0 : _f.updateValue(Platform_1.Characteristics.SecuritySystemTargetState.AWAY_ARM);
                        break;
                    case this.nightZones:
                        (_g = this.currentState) === null || _g === void 0 ? void 0 : _g.updateValue(Platform_1.Characteristics.SecuritySystemCurrentState.NIGHT_ARM);
                        (_h = this.targetState) === null || _h === void 0 ? void 0 : _h.updateValue(Platform_1.Characteristics.SecuritySystemTargetState.NIGHT_ARM);
                        break;
                    case 'triggered':
                        (_j = this.currentState) === null || _j === void 0 ? void 0 : _j.updateValue(Platform_1.Characteristics.SecuritySystemCurrentState.ALARM_TRIGGERED);
                        break;
                }
                break;
        }
    }
}
exports.default = Alarm;
//# sourceMappingURL=Alarm.js.map
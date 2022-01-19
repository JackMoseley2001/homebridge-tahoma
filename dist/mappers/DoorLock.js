"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Platform_1 = require("../Platform");
const overkiz_client_1 = require("overkiz-client");
const Mapper_1 = __importDefault(require("../Mapper"));
class VentilationSystem extends Mapper_1.default {
    registerServices() {
        var _a;
        const service = this.registerService(Platform_1.Services.LockMechanism);
        this.currentState = service.getCharacteristic(Platform_1.Characteristics.LockCurrentState);
        this.targetState = service.getCharacteristic(Platform_1.Characteristics.LockTargetState);
        (_a = this.targetState) === null || _a === void 0 ? void 0 : _a.onSet(this.setTargetState.bind(this));
    }
    getTargetStateCommands(value) {
        switch (value) {
            case Platform_1.Characteristics.LockTargetState.SECURED:
                return new overkiz_client_1.Command('setLockedUnlocked', 'locked');
            case Platform_1.Characteristics.LockTargetState.UNSECURED:
            default:
                return new overkiz_client_1.Command('setLockedUnlocked', 'unlocked');
        }
    }
    async setTargetState(value) {
        const action = await this.executeCommands(this.getTargetStateCommands(value));
        action.on('update', (state) => {
            var _a, _b;
            switch (state) {
                case overkiz_client_1.ExecutionState.COMPLETED:
                    if (this.stateless) {
                        (_a = this.currentState) === null || _a === void 0 ? void 0 : _a.updateValue(value);
                    }
                    break;
                case overkiz_client_1.ExecutionState.FAILED:
                    if (this.currentState) {
                        (_b = this.targetState) === null || _b === void 0 ? void 0 : _b.updateValue(this.currentState.value);
                    }
                    break;
            }
        });
    }
    onStateChanged(name, value) {
        var _a, _b, _c;
        switch (name) {
            case 'core:LockedUnlockedState':
                switch (value) {
                    case 'locked':
                        (_a = this.currentState) === null || _a === void 0 ? void 0 : _a.updateValue(Platform_1.Characteristics.LockCurrentState.SECURED);
                        break;
                    default:
                        (_b = this.currentState) === null || _b === void 0 ? void 0 : _b.updateValue(Platform_1.Characteristics.LockCurrentState.UNSECURED);
                        break;
                }
                if (this.isIdle && this.currentState) {
                    (_c = this.targetState) === null || _c === void 0 ? void 0 : _c.updateValue(this.currentState.value);
                }
                break;
        }
    }
}
exports.default = VentilationSystem;
//# sourceMappingURL=DoorLock.js.map
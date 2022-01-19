"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Platform_1 = require("../Platform");
const overkiz_client_1 = require("overkiz-client");
const RollerShutter_1 = __importDefault(require("./RollerShutter"));
class VenetianBlind extends RollerShutter_1.default {
    applyConfig(config) {
        super.applyConfig(config);
        this.blindMode = config['blindMode'] || false;
    }
    registerServices() {
        var _a, _b;
        super.registerServices();
        if (!this.stateless) {
            const service = this.accessory.getService(Platform_1.Services.WindowCovering);
            this.currentAngle = service === null || service === void 0 ? void 0 : service.getCharacteristic(Platform_1.Characteristics.CurrentHorizontalTiltAngle);
            this.targetAngle = service === null || service === void 0 ? void 0 : service.getCharacteristic(Platform_1.Characteristics.TargetHorizontalTiltAngle);
            (_a = this.targetAngle) === null || _a === void 0 ? void 0 : _a.setProps({ minStep: 10 });
            (_b = this.targetAngle) === null || _b === void 0 ? void 0 : _b.onSet(this.debounce(this.setTargetAnglePosition));
            if (this.blindMode && this.currentAngle) {
                service === null || service === void 0 ? void 0 : service.removeCharacteristic(this.currentAngle);
            }
            if (this.blindMode && this.targetAngle) {
                service === null || service === void 0 ? void 0 : service.removeCharacteristic(this.targetAngle);
            }
        }
    }
    orientationToAngle(value) {
        return Math.round((value * 1.8) - 90);
    }
    angleToOrientation(value) {
        return Math.round((value + 90) / 1.8);
    }
    getTargetCommands(value) {
        var _a;
        if (this.stateless) {
            if (value === 100) {
                return new overkiz_client_1.Command('open');
            }
            else if (value === 0) {
                return new overkiz_client_1.Command('close');
            }
            else {
                if (this.movementDuration > 0) {
                    const delta = value - Number(this.currentPosition.value);
                    return new overkiz_client_1.Command(delta > 0 ? 'open' : 'close');
                }
                else {
                    return new overkiz_client_1.Command('my');
                }
            }
        }
        else if (this.blindMode) {
            if (value === 100) {
                return new overkiz_client_1.Command('open');
            }
            else {
                return new overkiz_client_1.Command('setClosureAndOrientation', [100, this.reversedValue(value)]);
            }
        }
        else if (this.device.hasState('core:SlateOrientationState')) {
            return new overkiz_client_1.Command('setClosureAndOrientation', [
                this.reversedValue(value),
                this.angleToOrientation((_a = this.targetAngle) === null || _a === void 0 ? void 0 : _a.value),
            ]);
        }
        else {
            return new overkiz_client_1.Command('setClosure', this.reversedValue(value));
        }
    }
    getTargetAngleCommands(value) {
        var _a;
        if (this.stateless) {
            return [];
        }
        else {
            return new overkiz_client_1.Command('setClosureAndOrientation', [
                this.reversedValue((_a = this.targetPosition) === null || _a === void 0 ? void 0 : _a.value),
                this.angleToOrientation(value),
            ]);
        }
    }
    async setTargetAnglePosition(value) {
        const action = await this.executeCommands(this.getTargetAngleCommands(value));
        action.on('update', (state, data) => {
            var _a;
            switch (state) {
                case overkiz_client_1.ExecutionState.FAILED:
                    if (this.currentAngle) {
                        (_a = this.targetAngle) === null || _a === void 0 ? void 0 : _a.updateValue(this.currentAngle.value);
                    }
                    break;
            }
        });
    }
    onStateChanged(name, value) {
        var _a, _b, _c, _d, _e, _f, _g;
        if (this.blindMode) {
            switch (name) {
                case 'core:OpenClosedState':
                case 'core:SlateOrientationState':
                    if (this.device.get('core:OpenClosedState') === 'closed') {
                        const position = this.reversedValue(this.device.get('core:SlateOrientationState'));
                        const target = Number((_a = this.targetPosition) === null || _a === void 0 ? void 0 : _a.value);
                        if (Number.isInteger(position)) {
                            (_b = this.currentPosition) === null || _b === void 0 ? void 0 : _b.updateValue(position);
                            if (this.isIdle || Math.round(position / 5) === Math.round(target / 5)) {
                                (_c = this.targetPosition) === null || _c === void 0 ? void 0 : _c.updateValue(position);
                            }
                        }
                    }
                    else {
                        (_d = this.currentPosition) === null || _d === void 0 ? void 0 : _d.updateValue(100);
                        if (this.isIdle) {
                            (_e = this.targetPosition) === null || _e === void 0 ? void 0 : _e.updateValue(100);
                        }
                    }
                    break;
                default: break;
            }
        }
        else {
            super.onStateChanged(name, value);
            switch (name) {
                case 'core:SlateOrientationState':
                    (_f = this.currentAngle) === null || _f === void 0 ? void 0 : _f.updateValue(this.orientationToAngle(value));
                    if (this.isIdle) {
                        (_g = this.targetAngle) === null || _g === void 0 ? void 0 : _g.updateValue(this.orientationToAngle(value));
                    }
                    break;
                default: break;
            }
        }
    }
}
exports.default = VenetianBlind;
//# sourceMappingURL=VenetianBlind.js.map
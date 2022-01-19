"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Platform_1 = require("../Platform");
const overkiz_client_1 = require("overkiz-client");
const Mapper_1 = __importDefault(require("../Mapper"));
const CustomCharacteristics_1 = require("../CustomCharacteristics");
class RollerShutter extends Mapper_1.default {
    applyConfig(config) {
        this.defaultPosition = config['defaultPosition'] || 0;
        this.initPosition = config['initPosition'] !== undefined ? config['initPosition'] : (config['defaultPosition'] || 50);
        this.reverse = config['reverse'] || false;
        this.movementDuration = config['movementDuration'] || 0;
        this.blindsOnRollerShutter = config['blindsOnRollerShutter'] || false;
    }
    registerServices() {
        const service = this.registerService(Platform_1.Services.WindowCovering);
        service.addOptionalCharacteristic(CustomCharacteristics_1.MyPositionCharacteristic);
        this.currentPosition = service.getCharacteristic(Platform_1.Characteristics.CurrentPosition);
        this.targetPosition = service.getCharacteristic(Platform_1.Characteristics.TargetPosition);
        this.positionState = service.getCharacteristic(Platform_1.Characteristics.PositionState);
        if (this.stateless) {
            //this.currentPosition.updateValue(this.initPosition);
            //this.targetPosition.updateValue(this.initPosition);
            if (this.device.hasCommand('my')) {
                this.my = service.getCharacteristic(CustomCharacteristics_1.MyPositionCharacteristic);
                this.my.onSet(this.setMyPosition.bind(this));
            }
        }
        else {
            this.obstructionDetected = service.getCharacteristic(Platform_1.Characteristics.ObstructionDetected);
        }
        if (service.testCharacteristic(Platform_1.Characteristics.On)) {
            this.my = service.getCharacteristic(Platform_1.Characteristics.On);
            service.removeCharacteristic(this.my);
        }
        this.positionState.updateValue(Platform_1.Characteristics.PositionState.STOPPED);
        this.targetPosition.onSet(this.debounce(this.setTargetPosition));
    }
    getTargetCommands(value) {
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
        else {
            return new overkiz_client_1.Command('setClosure', this.reversedValue(value));
        }
    }
    /**
    * Triggered when Homekit try to modify the Characteristic.TargetPosition
    * HomeKit '0' (Close) => 100% Closure
    * HomeKit '100' (Open) => 0% Closure
    **/
    async setTargetPosition(value) {
        if (this.cancelTimeout !== null) {
            clearTimeout(this.cancelTimeout);
        }
        const standalone = this.stateless && this.movementDuration > 0 && value !== 100 && value !== 0;
        const action = await this.executeCommands(this.getTargetCommands(value), standalone);
        action.on('update', (state, data) => {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o;
            const positionState = (value === 100 || value > (((_a = this.currentPosition) === null || _a === void 0 ? void 0 : _a.value) || 0)) ?
                Platform_1.Characteristics.PositionState.INCREASING :
                Platform_1.Characteristics.PositionState.DECREASING;
            switch (state) {
                case overkiz_client_1.ExecutionState.TRANSMITTED:
                    if (standalone) {
                        const delta = value - Number(this.currentPosition.value);
                        const duration = Math.round(this.movementDuration * Math.abs(delta) * 1000 / 100);
                        this.info('Will stop movement in ' + duration + ' millisec');
                        this.cancelTimeout = setTimeout(() => {
                            this.cancelTimeout = null;
                            if (this.isIdle) {
                                this.executeCommands(new overkiz_client_1.Command('stop'), true);
                            }
                            else {
                                this.cancelExecution().catch(this.error.bind(this));
                            }
                        }, duration);
                    }
                    break;
                case overkiz_client_1.ExecutionState.IN_PROGRESS:
                    (_b = this.positionState) === null || _b === void 0 ? void 0 : _b.updateValue(positionState);
                    break;
                case overkiz_client_1.ExecutionState.COMPLETED:
                    (_c = this.positionState) === null || _c === void 0 ? void 0 : _c.updateValue(Platform_1.Characteristics.PositionState.STOPPED);
                    if (this.stateless) {
                        if (this.defaultPosition) {
                            (_d = this.currentPosition) === null || _d === void 0 ? void 0 : _d.updateValue(this.defaultPosition);
                            (_e = this.targetPosition) === null || _e === void 0 ? void 0 : _e.updateValue(this.defaultPosition);
                        }
                        else {
                            (_f = this.currentPosition) === null || _f === void 0 ? void 0 : _f.updateValue(value);
                        }
                    }
                    else {
                        (_g = this.obstructionDetected) === null || _g === void 0 ? void 0 : _g.updateValue(false);
                    }
                    if (this.blindsOnRollerShutter && value < 98) {
                        this.executeCommands(new overkiz_client_1.Command('setClosure', value + 2));
                    }
                    break;
                case overkiz_client_1.ExecutionState.FAILED:
                    if (this.stateless && data.failureType === 'CMDCANCELLED' && this.movementDuration > 0) {
                        if (this.defaultPosition) {
                            (_h = this.currentPosition) === null || _h === void 0 ? void 0 : _h.updateValue(this.defaultPosition);
                            (_j = this.targetPosition) === null || _j === void 0 ? void 0 : _j.updateValue(this.defaultPosition);
                        }
                        else {
                            (_k = this.currentPosition) === null || _k === void 0 ? void 0 : _k.updateValue(value);
                        }
                    }
                    (_l = this.positionState) === null || _l === void 0 ? void 0 : _l.updateValue(Platform_1.Characteristics.PositionState.STOPPED);
                    (_m = this.obstructionDetected) === null || _m === void 0 ? void 0 : _m.updateValue(data.failureType === 'WHILEEXEC_BLOCKED_BY_HAZARD');
                    if (!this.device.hasState('core:TargetClosureState') && this.currentPosition) {
                        (_o = this.targetPosition) === null || _o === void 0 ? void 0 : _o.updateValue(this.currentPosition.value);
                    }
                    break;
            }
        });
    }
    /**
    * Set My position
    **/
    async setMyPosition(value) {
        if (!value) {
            return;
        }
        const action = await this.executeCommands(new overkiz_client_1.Command('my'));
        action.on('update', (state, data) => {
            var _a, _b, _c, _d, _e, _f, _g, _h;
            switch (state) {
                case overkiz_client_1.ExecutionState.COMPLETED:
                    (_a = this.my) === null || _a === void 0 ? void 0 : _a.updateValue(0);
                    if (this.stateless) {
                        if (this.defaultPosition) {
                            (_b = this.currentPosition) === null || _b === void 0 ? void 0 : _b.updateValue(this.defaultPosition);
                            (_c = this.targetPosition) === null || _c === void 0 ? void 0 : _c.updateValue(this.defaultPosition);
                        }
                        else {
                            (_d = this.currentPosition) === null || _d === void 0 ? void 0 : _d.updateValue(50);
                            (_e = this.targetPosition) === null || _e === void 0 ? void 0 : _e.updateValue(50);
                        }
                    }
                    break;
                case overkiz_client_1.ExecutionState.FAILED:
                    (_f = this.my) === null || _f === void 0 ? void 0 : _f.updateValue(0);
                    (_g = this.obstructionDetected) === null || _g === void 0 ? void 0 : _g.updateValue(data.failureType === 'WHILEEXEC_BLOCKED_BY_HAZARD');
                    if (!this.device.hasState('core:TargetClosureState') && this.currentPosition) {
                        (_h = this.targetPosition) === null || _h === void 0 ? void 0 : _h.updateValue(this.currentPosition.value);
                    }
                    break;
            }
        });
    }
    reversedValue(value) {
        return this.reverse ? value : (100 - value);
    }
    onStateChanged(name, value) {
        var _a, _b, _c, _d;
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
exports.default = RollerShutter;
//# sourceMappingURL=RollerShutter.js.map
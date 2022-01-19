"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Platform_1 = require("../Platform");
const overkiz_client_1 = require("overkiz-client");
const Mapper_1 = __importDefault(require("../Mapper"));
class GarageDoor extends Mapper_1.default {
    applyConfig(config) {
        this.reverse = config['reverse'] || false;
        this.cyclic = config['cyclic'] || false;
        this.cycleDuration = (config['cycleDuration'] || 5) * 1000;
        this.pedestrianDuration = (config['pedestrianDuration'] || 0) * 1000;
        this.pedestrianCommand = ['setPedestrianPosition', 'partialPosition', 'my']
            .find((command) => this.device.hasCommand(command));
    }
    registerServices() {
        var _a, _b;
        const service = this.registerService(Platform_1.Services.GarageDoorOpener);
        this.currentState = service.getCharacteristic(Platform_1.Characteristics.CurrentDoorState);
        this.targetState = service.getCharacteristic(Platform_1.Characteristics.TargetDoorState);
        this.targetState.onSet(this.setTargetState.bind(this));
        this.cyclic = this.cyclic || this.device.hasCommand('cycle');
        if ((this.pedestrianCommand || this.pedestrianDuration) && this.device.uiClass === 'Gate') {
            this.registerLockService('pedestrian');
        }
        if (this.stateless) {
            this.currentState.updateValue(Platform_1.Characteristics.CurrentDoorState.CLOSED);
            this.targetState.updateValue(Platform_1.Characteristics.TargetDoorState.CLOSED);
            (_a = this.currentPedestrian) === null || _a === void 0 ? void 0 : _a.updateValue(Platform_1.Characteristics.LockCurrentState.SECURED);
            (_b = this.targetPedestrian) === null || _b === void 0 ? void 0 : _b.updateValue(Platform_1.Characteristics.LockCurrentState.SECURED);
        }
        else if (this.device.states.find((s) => [
            'core:OpenClosedPedestrianState',
            'core:OpenClosedUnknownState',
            'core:OpenClosedState',
            'core:OpenClosedPartialState',
        ].includes(s.name))) {
            this.currentState.onGet(this.getCurrentState.bind(this));
        }
    }
    registerSwitchService(subtype) {
        var _a;
        const service = this.registerService(Platform_1.Services.Switch, subtype);
        this.on = service.getCharacteristic(Platform_1.Characteristics.On);
        (_a = this.on) === null || _a === void 0 ? void 0 : _a.onSet(this.setOn.bind(this));
        return service;
    }
    registerLockService(subtype) {
        var _a;
        const service = this.registerService(Platform_1.Services.LockMechanism, subtype);
        this.currentPedestrian = service.getCharacteristic(Platform_1.Characteristics.LockCurrentState);
        this.targetPedestrian = service.getCharacteristic(Platform_1.Characteristics.LockTargetState);
        (_a = this.targetPedestrian) === null || _a === void 0 ? void 0 : _a.onSet(this.setLock.bind(this));
        return service;
    }
    getTargetCommands(value) {
        if (this.device.hasCommand('cycle')) {
            return new overkiz_client_1.Command('cycle');
        }
        else {
            return new overkiz_client_1.Command(value ? 'close' : 'open');
        }
    }
    async getCurrentState() {
        this.requestStatesUpdate().catch((e) => this.warn(e));
        return this.currentState.value;
    }
    async setOn(value) {
        const action = await this.executeCommands(this.getOnCommands(value));
        action.on('update', (state) => {
            var _a;
            switch (state) {
                case overkiz_client_1.ExecutionState.FAILED:
                    (_a = this.on) === null || _a === void 0 ? void 0 : _a.updateValue(!value);
                    break;
            }
        });
    }
    getOnCommands(value) {
        if (value) {
            if (this.pedestrianCommand) {
                return new overkiz_client_1.Command(this.pedestrianCommand);
            }
            else {
                return new overkiz_client_1.Command(value ? 'open' : 'close');
            }
        }
        else {
            return new overkiz_client_1.Command('close');
        }
    }
    async setLock(value) {
        if (this.cancelTimeout !== null) {
            clearTimeout(this.cancelTimeout);
        }
        const action = await this.executeCommands(this.getLockCommands(value));
        action.on('update', (state) => {
            switch (state) {
                case overkiz_client_1.ExecutionState.TRANSMITTED:
                    if (this.stateless && !this.pedestrianCommand && this.pedestrianDuration) {
                        this.info('Will stop movement in ' + this.pedestrianDuration + ' millisec');
                        this.cancelTimeout = setTimeout(() => {
                            this.cancelTimeout = null;
                            if (this.isIdle) {
                                this.executeCommands(new overkiz_client_1.Command('stop'), true);
                            }
                            else {
                                this.cancelExecution().catch(this.error.bind(this));
                            }
                        }, this.pedestrianDuration);
                    }
                    break;
                case overkiz_client_1.ExecutionState.COMPLETED:
                    if (this.stateless) {
                        this.onStateChanged('core:OpenClosedPedestrianState', value === Platform_1.Characteristics.LockTargetState.SECURED ? 'closed' : 'pedestrian');
                        if (this.cyclic) {
                            setTimeout(() => {
                                this.onStateChanged('core:OpenClosedPedestrianState', 'closed');
                            }, this.cycleDuration);
                        }
                    }
                    break;
            }
        });
    }
    getLockCommands(value) {
        if (value === Platform_1.Characteristics.LockTargetState.UNSECURED) {
            if (this.pedestrianCommand) {
                return new overkiz_client_1.Command(this.pedestrianCommand);
            }
            else {
                return new overkiz_client_1.Command(value === Platform_1.Characteristics.LockTargetState.UNSECURED ? 'open' : 'close');
            }
        }
        else {
            return new overkiz_client_1.Command('close');
        }
    }
    async setTargetState(value) {
        var _a;
        const previousTarget = (_a = this.targetState) === null || _a === void 0 ? void 0 : _a.value;
        const action = await this.executeCommands(this.getTargetCommands(value));
        action.on('update', (state) => {
            var _a, _b, _c;
            switch (state) {
                case overkiz_client_1.ExecutionState.IN_PROGRESS:
                    if (value === Platform_1.Characteristics.TargetDoorState.OPEN) {
                        (_a = this.currentState) === null || _a === void 0 ? void 0 : _a.updateValue(Platform_1.Characteristics.CurrentDoorState.OPENING);
                    }
                    else {
                        (_b = this.currentState) === null || _b === void 0 ? void 0 : _b.updateValue(Platform_1.Characteristics.CurrentDoorState.CLOSING);
                    }
                    break;
                case overkiz_client_1.ExecutionState.COMPLETED:
                    if (this.stateless) {
                        this.onStateChanged('core:OpenClosedPedestrianState', value === Platform_1.Characteristics.TargetDoorState.CLOSED ? 'closed' : 'open');
                        if (this.cyclic) {
                            setTimeout(() => {
                                this.onStateChanged('core:OpenClosedPedestrianState', 'closed');
                            }, this.cycleDuration);
                        }
                    }
                    else {
                        this.requestStatesUpdate(60);
                    }
                    break;
                case overkiz_client_1.ExecutionState.FAILED:
                    if (previousTarget) {
                        (_c = this.targetState) === null || _c === void 0 ? void 0 : _c.updateValue(previousTarget);
                    }
                    break;
            }
        });
    }
    onStateChanged(name, value) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j;
        let targetState;
        let targetPedestrian;
        switch (name) {
            case 'core:OpenClosedPedestrianState':
            case 'core:OpenClosedUnknownState':
            case 'core:OpenClosedState':
            case 'core:OpenClosedPartialState':
                switch (value) {
                    case 'unknown':
                    case 'open':
                        (_a = this.on) === null || _a === void 0 ? void 0 : _a.updateValue(false);
                        (_b = this.currentState) === null || _b === void 0 ? void 0 : _b.updateValue(Platform_1.Characteristics.CurrentDoorState.OPEN);
                        targetState = Platform_1.Characteristics.TargetDoorState.OPEN;
                        (_c = this.currentPedestrian) === null || _c === void 0 ? void 0 : _c.updateValue(Platform_1.Characteristics.LockCurrentState.UNKNOWN);
                        targetPedestrian = Platform_1.Characteristics.LockTargetState.UNSECURED;
                        break;
                    case 'pedestrian':
                    case 'partial':
                        (_d = this.on) === null || _d === void 0 ? void 0 : _d.updateValue(true);
                        (_e = this.currentState) === null || _e === void 0 ? void 0 : _e.updateValue(Platform_1.Characteristics.CurrentDoorState.STOPPED);
                        targetState = Platform_1.Characteristics.TargetDoorState.OPEN;
                        (_f = this.currentPedestrian) === null || _f === void 0 ? void 0 : _f.updateValue(Platform_1.Characteristics.LockCurrentState.UNSECURED);
                        targetPedestrian = Platform_1.Characteristics.LockTargetState.UNSECURED;
                        break;
                    case 'closed':
                        (_g = this.on) === null || _g === void 0 ? void 0 : _g.updateValue(false);
                        (_h = this.currentState) === null || _h === void 0 ? void 0 : _h.updateValue(Platform_1.Characteristics.CurrentDoorState.CLOSED);
                        targetState = Platform_1.Characteristics.TargetDoorState.CLOSED;
                        (_j = this.currentPedestrian) === null || _j === void 0 ? void 0 : _j.updateValue(Platform_1.Characteristics.LockCurrentState.SECURED);
                        targetPedestrian = Platform_1.Characteristics.LockTargetState.SECURED;
                        break;
                }
                break;
        }
        if (this.targetState && targetState !== undefined) {
            this.targetState.updateValue(targetState);
        }
        if (this.targetPedestrian && targetPedestrian !== undefined) {
            this.targetPedestrian.updateValue(targetPedestrian);
        }
    }
}
exports.default = GarageDoor;
//# sourceMappingURL=GarageDoor.js.map
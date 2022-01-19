"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const RollerShutter_1 = __importDefault(require("./RollerShutter"));
const overkiz_client_1 = require("overkiz-client");
class Awning extends RollerShutter_1.default {
    /**
    * Triggered when Homekit try to modify the Characteristic.TargetPosition
    * HomeKit '0' (Close) => 0% Deployment
    * HomeKit '100' (Open) => 100% Deployment
    **/
    getTargetCommands(value) {
        if (this.stateless) {
            if (value === 100) {
                return new overkiz_client_1.Command('deploy');
            }
            else if (value === 0) {
                return new overkiz_client_1.Command('undeploy');
            }
            else {
                if (this.movementDuration > 0) {
                    const delta = value - Number(this.currentPosition.value);
                    return new overkiz_client_1.Command(delta > 0 ? 'deploy' : 'undeploy');
                }
                else {
                    return new overkiz_client_1.Command('my');
                }
            }
        }
        else {
            return new overkiz_client_1.Command('setDeployment', this.reversedValue(value));
        }
    }
    reversedValue(value) {
        return this.reverse ? (100 - value) : value;
    }
    onStateChanged(name, value) {
        var _a, _b, _c, _d, _e, _f;
        switch (name) {
            case 'core:DeploymentState':
                (_a = this.currentPosition) === null || _a === void 0 ? void 0 : _a.updateValue(this.reversedValue(value));
                if (!this.device.hasState('core:TargetClosureState')) {
                    (_b = this.targetPosition) === null || _b === void 0 ? void 0 : _b.updateValue(this.reversedValue(value));
                }
                break;
            case 'core:ClosureState':
                (_c = this.currentPosition) === null || _c === void 0 ? void 0 : _c.updateValue(this.reversedValue(value));
                if (!this.device.hasState('core:TargetClosureState')) {
                    (_d = this.targetPosition) === null || _d === void 0 ? void 0 : _d.updateValue(this.reversedValue(value));
                }
                break;
            case 'core:TargetClosureState':
                (_e = this.targetPosition) === null || _e === void 0 ? void 0 : _e.updateValue(this.reversedValue(value));
                if (!this.device.hasState('core:ClosureState')) {
                    (_f = this.currentPosition) === null || _f === void 0 ? void 0 : _f.updateValue(this.reversedValue(value));
                }
                break;
        }
    }
}
exports.default = Awning;
//# sourceMappingURL=Awning.js.map
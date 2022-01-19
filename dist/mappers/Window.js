"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const RollerShutter_1 = __importDefault(require("./RollerShutter"));
const Platform_1 = require("../Platform");
class Window extends RollerShutter_1.default {
    registerServices() {
        const service = this.registerService(Platform_1.Services.Window);
        this.currentPosition = service.getCharacteristic(Platform_1.Characteristics.CurrentPosition);
        this.targetPosition = service.getCharacteristic(Platform_1.Characteristics.TargetPosition);
        this.positionState = service.getCharacteristic(Platform_1.Characteristics.PositionState);
        if (this.stateless) {
            this.currentPosition.updateValue(this.initPosition);
            this.targetPosition.updateValue(this.initPosition);
        }
        else {
            this.obstructionDetected = service.getCharacteristic(Platform_1.Characteristics.ObstructionDetected);
        }
        this.positionState.updateValue(Platform_1.Characteristics.PositionState.STOPPED);
        this.targetPosition.onSet(this.debounce(this.setTargetPosition));
    }
}
exports.default = Window;
//# sourceMappingURL=Window.js.map
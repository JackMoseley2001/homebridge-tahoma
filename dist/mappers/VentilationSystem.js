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
        const service = this.registerService(Platform_1.Services.AirPurifier);
        this.active = service.getCharacteristic(Platform_1.Characteristics.Active);
        this.currentState = service.getCharacteristic(Platform_1.Characteristics.CurrentAirPurifierState);
        this.targetState = service.getCharacteristic(Platform_1.Characteristics.TargetAirPurifierState);
        (_a = this.targetState) === null || _a === void 0 ? void 0 : _a.onSet(this.setTargetState.bind(this));
    }
    getTargetStateCommands(value) {
        switch (value) {
            case Platform_1.Characteristics.TargetAirPurifierState.AUTO:
                return new overkiz_client_1.Command('setAirDemandMode', 'auto');
            case Platform_1.Characteristics.TargetAirPurifierState.MANUAL:
            default:
                return new overkiz_client_1.Command('setAirDemandMode', 'boost');
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
        var _a, _b;
        switch (name) {
            case 'io:AirDemandModeState':
                switch (value) {
                    case 'auto':
                        (_a = this.targetState) === null || _a === void 0 ? void 0 : _a.updateValue(Platform_1.Characteristics.TargetAirPurifierState.AUTO);
                        break;
                    default:
                        (_b = this.targetState) === null || _b === void 0 ? void 0 : _b.updateValue(Platform_1.Characteristics.TargetAirPurifierState.MANUAL);
                        break;
                }
                break;
        }
    }
}
exports.default = VentilationSystem;
//# sourceMappingURL=VentilationSystem.js.map
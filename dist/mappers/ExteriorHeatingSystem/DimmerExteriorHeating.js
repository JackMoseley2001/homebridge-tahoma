"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const overkiz_client_1 = require("overkiz-client");
const Platform_1 = require("../../Platform");
const ExteriorHeatingSystem_1 = __importDefault(require("../ExteriorHeatingSystem"));
class DimmerExteriorHeating extends ExteriorHeatingSystem_1.default {
    registerServices() {
        const service = this.registerService(Platform_1.Services.Lightbulb);
        this.on = service.getCharacteristic(Platform_1.Characteristics.On);
        this.on.onSet(this.setOn.bind(this));
        this.level = service.getCharacteristic(Platform_1.Characteristics.Brightness);
        this.level.onSet(this.debounce(this.setBrightness));
    }
    async setBrightness(value) {
        const action = await this.executeCommands(new overkiz_client_1.Command('setLevel', 100 - value));
        action.on('update', (state, data) => {
            switch (state) {
                case overkiz_client_1.ExecutionState.COMPLETED:
                    break;
                case overkiz_client_1.ExecutionState.FAILED:
                    break;
            }
        });
    }
    onStateChanged(name, value) {
        var _a, _b;
        value = 100 - value;
        switch (name) {
            case 'core:LevelState':
                (_a = this.level) === null || _a === void 0 ? void 0 : _a.updateValue(value);
                (_b = this.on) === null || _b === void 0 ? void 0 : _b.updateValue(value === 0 ? 0 : 1);
                break;
        }
        return false;
    }
}
exports.default = DimmerExteriorHeating;
//# sourceMappingURL=DimmerExteriorHeating.js.map
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Platform_1 = require("../Platform");
const overkiz_client_1 = require("overkiz-client");
const Mapper_1 = __importDefault(require("../Mapper"));
class OnOff extends Mapper_1.default {
    registerServices() {
        const service = this.registerService(Platform_1.Services.Switch);
        this.on = service.getCharacteristic(Platform_1.Characteristics.On);
        this.on.onSet(this.setOn.bind(this));
    }
    getOnOffCommands(value) {
        return new overkiz_client_1.Command(value ? 'on' : 'off');
    }
    async setOn(value) {
        const action = await this.executeCommands(this.getOnOffCommands(value));
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
        var _a;
        switch (name) {
            case 'core:OnOffState':
                (_a = this.on) === null || _a === void 0 ? void 0 : _a.updateValue(value === 'on');
                break;
        }
        return false;
    }
}
exports.default = OnOff;
//# sourceMappingURL=OnOff.js.map
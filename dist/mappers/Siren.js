"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Platform_1 = require("../Platform");
const overkiz_client_1 = require("overkiz-client");
const Mapper_1 = __importDefault(require("../Mapper"));
class Siren extends Mapper_1.default {
    registerServices() {
        const service = this.registerService(Platform_1.Services.Speaker);
        this.mute = service.getCharacteristic(Platform_1.Characteristics.Mute);
        this.volume = service.getCharacteristic(Platform_1.Characteristics.Volume);
        this.mute.onSet(this.setMute.bind(this));
        this.volume.onSet(this.setVolume.bind(this));
        this.mute.updateValue(true);
    }
    getMuteCommands(value) {
        return new overkiz_client_1.Command(value ? 'off' : 'on');
    }
    async setMute(value) {
        const action = await this.executeCommands(this.getMuteCommands(value));
        action.on('update', (state, data) => {
            switch (state) {
                case overkiz_client_1.ExecutionState.COMPLETED:
                    break;
                case overkiz_client_1.ExecutionState.FAILED:
                    break;
            }
        });
    }
    getVolumeCommands(value) {
        return new overkiz_client_1.Command('setVolume', value);
    }
    async setVolume(value) {
        const action = await this.executeCommands(this.getVolumeCommands(value));
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
                (_a = this.mute) === null || _a === void 0 ? void 0 : _a.updateValue(value === 'off');
                break;
        }
    }
}
exports.default = Siren;
//# sourceMappingURL=Siren.js.map
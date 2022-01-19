"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Platform_1 = require("../Platform");
const overkiz_client_1 = require("overkiz-client");
const Mapper_1 = __importDefault(require("../Mapper"));
class Light extends Mapper_1.default {
    registerServices() {
        const service = this.registerService(this.device.hasCommand('setIntensity') ? Platform_1.Services.Lightbulb : Platform_1.Services.Switch);
        this.on = service.getCharacteristic(Platform_1.Characteristics.On);
        this.on.onSet(this.setOn.bind(this));
        if (this.device.hasCommand('setIntensity')) {
            this.brightness = service.getCharacteristic(Platform_1.Characteristics.Brightness);
            this.brightness.onSet(this.setBrightness.bind(this));
            if (this.device.hasCommand('setHueAndSaturation')) {
                this.hue = service.getCharacteristic(Platform_1.Characteristics.Hue);
                this.saturation = service.getCharacteristic(Platform_1.Characteristics.Saturation);
                this.saturation.onSet(this.setSaturation.bind(this));
            }
        }
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
    getBrightnessCommands(value) {
        return new overkiz_client_1.Command('setIntensity', value);
    }
    async setBrightness(value) {
        const action = await this.executeCommands(this.getBrightnessCommands(value));
        action.on('update', (state, data) => {
            switch (state) {
                case overkiz_client_1.ExecutionState.COMPLETED:
                    break;
                case overkiz_client_1.ExecutionState.FAILED:
                    break;
            }
        });
    }
    getSaturationCommands(value) {
        var _a;
        return new overkiz_client_1.Command('setHueAndSaturation', [(_a = this.hue) === null || _a === void 0 ? void 0 : _a.value, value]);
    }
    async setSaturation(value) {
        const action = await this.executeCommands(this.getSaturationCommands(value));
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
        var _a, _b, _c, _d;
        switch (name) {
            case 'core:OnOffState':
                (_a = this.on) === null || _a === void 0 ? void 0 : _a.updateValue(value === 'on');
                break;
            case 'core:IntensityState':
            case 'core:LightIntensityState':
                (_b = this.brightness) === null || _b === void 0 ? void 0 : _b.updateValue(value);
                break;
            case 'core:ColorHueState':
                (_c = this.hue) === null || _c === void 0 ? void 0 : _c.updateValue(value);
                break;
            case 'core:ColorSaturationState':
                (_d = this.saturation) === null || _d === void 0 ? void 0 : _d.updateValue(value);
                break;
        }
        return false;
    }
}
exports.default = Light;
//# sourceMappingURL=Light.js.map
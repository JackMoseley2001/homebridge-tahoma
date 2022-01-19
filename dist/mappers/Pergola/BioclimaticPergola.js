"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const overkiz_client_1 = require("overkiz-client");
const Pergola_1 = __importDefault(require("../Pergola"));
class BioclimaticPergola extends Pergola_1.default {
    getTargetCommands(value) {
        return new overkiz_client_1.Command('setOrientation', this.reversedValue(value));
    }
    onStateChanged(name, value) {
        var _a, _b;
        switch (name) {
            case 'core:SlatsOrientationState':
                (_a = this.currentPosition) === null || _a === void 0 ? void 0 : _a.updateValue(this.reversedValue(value));
                if (this.isIdle) {
                    (_b = this.targetPosition) === null || _b === void 0 ? void 0 : _b.updateValue(this.reversedValue(value));
                }
                break;
            default: break;
        }
    }
}
exports.default = BioclimaticPergola;
//# sourceMappingURL=BioclimaticPergola.js.map
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const overkiz_client_1 = require("overkiz-client");
const HeatingSystem_1 = __importDefault(require("../HeatingSystem"));
class AtlanticPassAPCBoiler extends HeatingSystem_1.default {
    registerServices() {
        this.registerSwitchService();
    }
    getOnCommands(value) {
        return new overkiz_client_1.Command('setPassAPCOperatingMode', value ? 'heating' : 'stop');
    }
    onStateChanged(name, value) {
        var _a, _b;
        switch (name) {
            case 'io:PassAPCOperatingModeState':
                switch (value) {
                    case 'stop':
                        (_a = this.on) === null || _a === void 0 ? void 0 : _a.updateValue(false);
                        break;
                    case 'heating':
                    case 'drying':
                    case 'cooling':
                        (_b = this.on) === null || _b === void 0 ? void 0 : _b.updateValue(true);
                        break;
                }
        }
    }
}
exports.default = AtlanticPassAPCBoiler;
//# sourceMappingURL=AtlanticPassAPCBoiler.js.map
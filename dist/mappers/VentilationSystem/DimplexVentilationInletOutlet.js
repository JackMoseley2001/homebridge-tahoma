"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Platform_1 = require("../../Platform");
const overkiz_client_1 = require("overkiz-client");
const VentilationSystem_1 = __importDefault(require("../VentilationSystem"));
class DimplexVentilationInletOutlet extends VentilationSystem_1.default {
    getTargetStateCommands(value) {
        switch (value) {
            case Platform_1.Characteristics.TargetAirPurifierState.AUTO:
                return new overkiz_client_1.Command('auto');
            case Platform_1.Characteristics.TargetAirPurifierState.MANUAL:
            default:
                return new overkiz_client_1.Command('max');
        }
    }
}
exports.default = DimplexVentilationInletOutlet;
//# sourceMappingURL=DimplexVentilationInletOutlet.js.map
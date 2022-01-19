"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Mapper_1 = __importDefault(require("../Mapper"));
const Platform_1 = require("../Platform");
class RemoteController extends Mapper_1.default {
    registerServices() {
        const service = this.registerService(Platform_1.Services.StatelessProgrammableSwitch);
        this.event = service.getCharacteristic(Platform_1.Characteristics.ProgrammableSwitchEvent);
    }
}
exports.default = RemoteController;
//# sourceMappingURL=RemoteController.js.map
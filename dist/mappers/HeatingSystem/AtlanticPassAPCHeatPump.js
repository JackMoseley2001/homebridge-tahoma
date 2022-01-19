"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AtlanticPassAPCZoneControl_1 = __importDefault(require("./AtlanticPassAPCZoneControl"));
class AtlanticPassAPCHeatPump extends AtlanticPassAPCZoneControl_1.default {
    constructor() {
        super(...arguments);
        this.MIN_TEMP = 0;
    }
}
exports.default = AtlanticPassAPCHeatPump;
//# sourceMappingURL=AtlanticPassAPCHeatPump.js.map
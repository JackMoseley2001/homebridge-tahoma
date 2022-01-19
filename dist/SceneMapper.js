"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Platform_1 = require("./Platform");
const overkiz_client_1 = require("overkiz-client");
class Mapper {
    constructor(platform, accessory, action) {
        this.platform = platform;
        this.accessory = accessory;
        this.action = action;
        this.services = [];
        this.log = platform.log;
        const service = this.accessory.getService(Platform_1.Services.Switch) || this.accessory.addService(Platform_1.Services.Switch);
        this.on = service.getCharacteristic(Platform_1.Characteristics.On);
        this.on.onSet(this.setOn.bind(this));
        this.on.updateValue(0);
    }
    get isInProgress() {
        return this.platform.client.hasExecution(this.lastExecId);
    }
    async setOn(value) {
        if (value) {
            const execution = new overkiz_client_1.Execution('');
            this.lastExecId = await this.platform.client.execute(this.action.oid, execution);
            execution.on('update', (state, event) => {
                var _a;
                switch (state) {
                    case overkiz_client_1.ExecutionState.COMPLETED:
                    case overkiz_client_1.ExecutionState.FAILED:
                        this.log.info('[Scene] ' + this.action.label + ' ' + (state === overkiz_client_1.ExecutionState.FAILED ? event.failureType : state));
                        (_a = this.on) === null || _a === void 0 ? void 0 : _a.updateValue(0);
                        break;
                }
            });
        }
        else if (this.isInProgress) {
            await this.platform.client.cancelExecution(this.lastExecId);
        }
    }
}
exports.default = Mapper;
//# sourceMappingURL=SceneMapper.js.map
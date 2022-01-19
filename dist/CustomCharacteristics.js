"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomCharacteristics = exports.EcoCharacteristic = exports.ProgCharacteristic = exports.MyPositionCharacteristic = exports.TargetShowerCharacteristic = exports.CurrentShowerCharacteristic = void 0;
class CustomCharacteristics {
    constructor(hap) {
        var _a, _b, _c, _d, _e;
        exports.CurrentShowerCharacteristic = (_a = class extends hap.Characteristic {
                constructor() {
                    super('Current Shower', exports.CurrentShowerCharacteristic.UUID, {
                        format: "int" /* INT */,
                        minValue: 0,
                        maxValue: 8,
                        minStep: 1,
                        perms: ["ev" /* NOTIFY */, "pr" /* PAIRED_READ */],
                    });
                    this.value = this.getDefaultValue();
                }
            },
            _a.UUID = '10000001-0000-1000-8000-0026BB765291',
            _a);
        exports.TargetShowerCharacteristic = (_b = class extends hap.Characteristic {
                constructor() {
                    super('Target Shower', exports.TargetShowerCharacteristic.UUID, {
                        format: "int" /* INT */,
                        minValue: 0,
                        maxValue: 8,
                        minStep: 1,
                        perms: ["ev" /* NOTIFY */, "pr" /* PAIRED_READ */, "pw" /* PAIRED_WRITE */],
                    });
                    this.value = this.getDefaultValue();
                }
            },
            _b.UUID = '10000002-0000-1000-8000-0026BB765291',
            _b);
        exports.MyPositionCharacteristic = (_c = class extends hap.Characteristic {
                constructor() {
                    super('My', exports.MyPositionCharacteristic.UUID, {
                        format: "bool" /* BOOL */,
                        perms: ["ev" /* NOTIFY */, "pr" /* PAIRED_READ */, "pw" /* PAIRED_WRITE */],
                    });
                    this.value = this.getDefaultValue();
                }
            },
            _c.UUID = '10000003-0000-1000-8000-0026BB765291',
            _c);
        exports.ProgCharacteristic = (_d = class extends hap.Characteristic {
                constructor() {
                    super('Prog', exports.ProgCharacteristic.UUID, {
                        format: "bool" /* BOOL */,
                        perms: ["ev" /* NOTIFY */, "pr" /* PAIRED_READ */, "pw" /* PAIRED_WRITE */],
                    });
                    this.value = this.getDefaultValue();
                }
            },
            _d.UUID = '10000004-0000-1000-8000-0026BB765291',
            _d);
        exports.EcoCharacteristic = (_e = class extends hap.Characteristic {
                constructor() {
                    super('Eco', exports.EcoCharacteristic.UUID, {
                        format: "bool" /* BOOL */,
                        perms: ["ev" /* NOTIFY */, "pr" /* PAIRED_READ */, "pw" /* PAIRED_WRITE */],
                    });
                    this.value = this.getDefaultValue();
                }
            },
            _e.UUID = '10000005-0000-1000-8000-0026BB765291',
            _e);
    }
}
exports.CustomCharacteristics = CustomCharacteristics;
//# sourceMappingURL=CustomCharacteristics.js.map
import { HAP, Characteristic, WithUUID } from 'homebridge';
export declare let CurrentShowerCharacteristic: WithUUID<{
    new (): Characteristic;
}>;
export declare let TargetShowerCharacteristic: WithUUID<{
    new (): Characteristic;
}>;
export declare let MyPositionCharacteristic: WithUUID<{
    new (): Characteristic;
}>;
export declare let ProgCharacteristic: WithUUID<{
    new (): Characteristic;
}>;
export declare let EcoCharacteristic: WithUUID<{
    new (): Characteristic;
}>;
export declare class CustomCharacteristics {
    constructor(hap: HAP);
}
//# sourceMappingURL=CustomCharacteristics.d.ts.map
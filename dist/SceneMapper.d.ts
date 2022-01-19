import { Characteristic, Logger, PlatformAccessory, Service } from 'homebridge';
import { ActionGroup } from 'overkiz-client';
import { Platform } from './Platform';
export default class Mapper {
    protected readonly platform: Platform;
    protected readonly accessory: PlatformAccessory;
    protected readonly action: ActionGroup;
    protected log: Logger;
    protected services: Array<Service>;
    protected on: Characteristic | undefined;
    private lastExecId;
    constructor(platform: Platform, accessory: PlatformAccessory, action: ActionGroup);
    private get isInProgress();
    protected setOn(value: any): Promise<void>;
}
//# sourceMappingURL=SceneMapper.d.ts.map
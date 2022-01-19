import { API, Characteristic, DynamicPlatformPlugin, Logger, PlatformAccessory, PlatformConfig, Service } from 'homebridge';
import { Client, Action } from 'overkiz-client';
export declare let Services: typeof Service;
export declare let Characteristics: typeof Characteristic;
/**
 * HomebridgePlatform
 * This class is the main constructor for your plugin, this is where you should
 * parse the user config and discover/register accessories with Homebridge.
 */
export declare class Platform implements DynamicPlatformPlugin {
    readonly log: Logger;
    readonly config: PlatformConfig;
    readonly api: API;
    private readonly accessories;
    readonly client: Client;
    private readonly exclude;
    private readonly exposeScenarios;
    readonly devicesConfig: Array<unknown>;
    private translations;
    private executionPromise;
    private retryDelay;
    constructor(log: Logger, config: PlatformConfig, api: API);
    /**
     * This function is invoked when homebridge restores cached accessories from disk at startup.
     * It should be used to setup event handlers for characteristics and update respective values.
     */
    loadLocation(): Promise<void>;
    /**
     * This function is invoked when homebridge restores cached accessories from disk at startup.
     * It should be used to setup event handlers for characteristics and update respective values.
     */
    configureAccessory(accessory: PlatformAccessory): Promise<void>;
    /**
     * This is an example method showing how to register discovered accessories.
     * Accessories must only be registered once, previously created accessories
     * must not be registered again to prevent "duplicate UUID" errors.
     */
    discoverDevices(): Promise<void>;
    executeAction(label: string, action: Action, highPriority?: boolean, standalone?: boolean): any;
    /**
     * Translate
     * @param path
     * @returns string
     */
    translate(label: string): string | null;
}
//# sourceMappingURL=Platform.d.ts.map
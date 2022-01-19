import { CharacteristicValue, Logger, PlatformAccessory, Service, WithUUID } from 'homebridge';
import { Device, State, Command, Action } from 'overkiz-client';
import { Platform } from './Platform';
export default class Mapper {
    protected readonly platform: Platform;
    protected readonly accessory: PlatformAccessory;
    protected readonly device: Device;
    protected log: Logger;
    protected services: Array<Service>;
    private postponeTimer;
    private debounceTimer;
    protected stateless: boolean;
    private executionId;
    private actionPromise;
    constructor(platform: Platform, accessory: PlatformAccessory, device: Device);
    build(): void;
    /**
     * Helper methods
     */
    protected applyConfig(config: any): void;
    protected registerService(type: WithUUID<typeof Service>, subtype?: string): Service;
    private translate;
    protected debounce(task: any): (value: CharacteristicValue) => void;
    protected postpone(task: any, ...args: any[]): void;
    protected executeCommands(commands: Command | Array<Command> | undefined, standalone?: boolean): Promise<Action>;
    private delay;
    protected requestStatesUpdate(defer?: number): Promise<void>;
    /**
     * Logging methods
     */
    protected debug(...args: any[]): void;
    protected info(...args: any[]): void;
    protected warn(...args: any[]): void;
    protected error(...args: any[]): void;
    /**
     * Children methods
     */
    protected registerServices(): void;
    protected onStatesChanged(states: Array<State>, init?: boolean): void;
    /**
     * Triggered when device state change
     * @param name State name
     * @param value State value
     */
    protected onStateChanged(name: string, value: any): void;
    get isIdle(): boolean;
    cancelExecution(): Promise<void>;
}
//# sourceMappingURL=Mapper.d.ts.map
import { Characteristic, CharacteristicValue, Nullable, Service } from 'homebridge';
import { Command } from 'overkiz-client';
import Mapper from '../Mapper';
export default class GarageDoor extends Mapper {
    protected currentState: Characteristic | undefined;
    protected targetState: Characteristic | undefined;
    protected on: Characteristic | undefined;
    protected currentPedestrian: Characteristic | undefined;
    protected targetPedestrian: Characteristic | undefined;
    protected cyclic: any;
    protected reverse: any;
    protected cycleDuration: any;
    protected pedestrianCommand: any;
    protected pedestrianDuration: any;
    protected cancelTimeout: any;
    protected applyConfig(config: any): void;
    protected registerServices(): void;
    protected registerSwitchService(subtype?: string): Service;
    protected registerLockService(subtype?: string): Service;
    protected getTargetCommands(value: any): any;
    protected getCurrentState(): Promise<Nullable<CharacteristicValue>>;
    protected setOn(value: any): Promise<void>;
    protected getOnCommands(value: any): Command | Array<Command>;
    protected setLock(value: any): Promise<void>;
    protected getLockCommands(value: any): Command | Array<Command>;
    protected setTargetState(value: any): Promise<void>;
    protected onStateChanged(name: string, value: any): void;
}
//# sourceMappingURL=GarageDoor.d.ts.map
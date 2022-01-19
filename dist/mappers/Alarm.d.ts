import { Characteristic } from 'homebridge';
import { Command } from 'overkiz-client';
import Mapper from '../Mapper';
export default class Alarm extends Mapper {
    protected currentState: Characteristic | undefined;
    protected targetState: Characteristic | undefined;
    protected stayZones: unknown | undefined;
    protected nightZones: unknown | undefined;
    protected occupancySensor: unknown | undefined;
    protected applyConfig(config: any): void;
    protected registerServices(): void;
    protected getTargetCommands(value: any): Command | Array<Command>;
    setTargetState(value: any): Promise<void>;
    protected onStateChanged(name: string, value: any): void;
}
//# sourceMappingURL=Alarm.d.ts.map
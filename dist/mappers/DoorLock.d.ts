import { Characteristic } from 'homebridge';
import { Command } from 'overkiz-client';
import Mapper from '../Mapper';
export default class VentilationSystem extends Mapper {
    protected currentState: Characteristic | undefined;
    protected targetState: Characteristic | undefined;
    protected registerServices(): void;
    protected getTargetStateCommands(value: any): Command | Array<Command>;
    protected setTargetState(value: any): Promise<void>;
    protected onStateChanged(name: string, value: any): void;
}
//# sourceMappingURL=DoorLock.d.ts.map
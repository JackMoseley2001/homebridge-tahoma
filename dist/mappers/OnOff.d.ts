import { Characteristic } from 'homebridge';
import { Command } from 'overkiz-client';
import Mapper from '../Mapper';
export default class OnOff extends Mapper {
    protected on: Characteristic | undefined;
    protected registerServices(): void;
    protected getOnOffCommands(value: any): Command | Array<Command>;
    protected setOn(value: any): Promise<void>;
    protected onStateChanged(name: string, value: any): boolean;
}
//# sourceMappingURL=OnOff.d.ts.map
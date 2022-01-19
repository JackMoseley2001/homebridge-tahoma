import { Characteristic } from 'homebridge';
import { Command } from 'overkiz-client';
import Mapper from '../Mapper';
export default class Siren extends Mapper {
    protected mute: Characteristic | undefined;
    protected volume: Characteristic | undefined;
    protected registerServices(): void;
    protected getMuteCommands(value: any): Command | Array<Command>;
    protected setMute(value: any): Promise<void>;
    protected getVolumeCommands(value: any): Command | Array<Command>;
    protected setVolume(value: any): Promise<void>;
    protected onStateChanged(name: string, value: any): void;
}
//# sourceMappingURL=Siren.d.ts.map
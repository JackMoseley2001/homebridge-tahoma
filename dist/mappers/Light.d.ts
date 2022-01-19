import { Characteristic } from 'homebridge';
import { Command } from 'overkiz-client';
import Mapper from '../Mapper';
export default class Light extends Mapper {
    protected on: Characteristic | undefined;
    protected hue: Characteristic | undefined;
    protected brightness: Characteristic | undefined;
    protected saturation: Characteristic | undefined;
    protected registerServices(): void;
    protected getOnOffCommands(value: any): Command | Array<Command>;
    protected setOn(value: any): Promise<void>;
    protected getBrightnessCommands(value: any): Command | Array<Command>;
    protected setBrightness(value: any): Promise<void>;
    protected getSaturationCommands(value: any): Command | Array<Command>;
    protected setSaturation(value: any): Promise<void>;
    protected onStateChanged(name: string, value: any): boolean;
}
//# sourceMappingURL=Light.d.ts.map
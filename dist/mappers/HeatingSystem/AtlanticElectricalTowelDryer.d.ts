import { Characteristic } from 'homebridge';
import { Command } from 'overkiz-client';
import HeatingSystem from '../HeatingSystem';
export default class AtlanticElectricalTowelDryer extends HeatingSystem {
    protected THERMOSTAT_CHARACTERISTICS: string[];
    protected MIN_TEMP: number;
    protected MAX_TEMP: number;
    protected TARGET_MODES: number[];
    protected drying: Characteristic | undefined;
    protected registerServices(): void;
    protected getTargetStateCommands(value: any): Command | Array<Command>;
    protected getTargetTemperatureCommands(value: any): Command | Array<Command> | undefined;
    protected getOnCommands(value: any): Command | Array<Command>;
    protected setDrying(value: any): Promise<void>;
    protected onStateChanged(name: string, value: any): void;
    protected computeStates(): void;
}
//# sourceMappingURL=AtlanticElectricalTowelDryer.d.ts.map
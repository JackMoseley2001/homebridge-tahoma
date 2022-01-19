import { Command } from 'overkiz-client';
import HeatingSystem from '../HeatingSystem';
export default class AtlanticElectricalHeater extends HeatingSystem {
    protected THERMOSTAT_CHARACTERISTICS: string[];
    protected TARGET_MODES: number[];
    protected registerServices(): void;
    protected getTargetStateCommands(value: any): Command | Array<Command>;
    protected setTargetTemperature(value: any): Promise<void>;
    protected getTargetTemperatureCommands(value: any): Command | Array<Command> | undefined;
    protected getProgCommands(): Command | Array<Command> | undefined;
    protected onStateChanged(name: any, value: any): void;
}
//# sourceMappingURL=AtlanticElectricalHeater.d.ts.map
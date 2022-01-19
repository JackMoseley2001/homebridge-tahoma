import { Command } from 'overkiz-client';
import HeatingSystem from '../HeatingSystem';
export default class AtlanticElectricalHeaterWithAdjustableTemperatureSetpoint extends HeatingSystem {
    protected THERMOSTAT_CHARACTERISTICS: string[];
    protected MIN_TEMP: number;
    protected MAX_TEMP: number;
    protected TARGET_MODES: number[];
    protected registerServices(): void;
    protected getTargetStateCommands(value: any): Command | Array<Command>;
    protected getTargetTemperatureCommands(value: any): Command | Array<Command> | undefined;
    protected onStateChanged(name: string, value: any): void;
    protected computeStates(): void;
}
//# sourceMappingURL=AtlanticElectricalHeaterWithAdjustableTemperatureSetpoint.d.ts.map
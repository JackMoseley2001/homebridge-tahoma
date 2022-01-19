import { Command } from 'overkiz-client';
import HeatingSystem from '../HeatingSystem';
export default class HitachiAirToAirHeatPump extends HeatingSystem {
    protected MIN_TEMP: number;
    protected MAX_TEMP: number;
    protected TARGET_MODES: number[];
    protected registerServices(): void;
    protected getTargetStateCommands(value: any): Command | Array<Command> | undefined;
    protected getTargetTemperatureCommands(value: any): Command | Array<Command>;
    protected onStateChanged(name: string, value: any): void;
    private getCommands;
}
//# sourceMappingURL=HitachiAirToAirHeatPump.d.ts.map
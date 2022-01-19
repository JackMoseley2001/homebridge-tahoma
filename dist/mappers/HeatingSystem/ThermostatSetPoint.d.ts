import { Command } from 'overkiz-client';
import HeatingSystem from '../HeatingSystem';
export default class ThermostatSetPoint extends HeatingSystem {
    protected TARGET_MODES: number[];
    protected registerServices(): void;
    protected getTargetTemperatureCommands(value: any): Command | Array<Command>;
    protected onStateChanged(name: any, value: any): void;
}
//# sourceMappingURL=ThermostatSetPoint.d.ts.map
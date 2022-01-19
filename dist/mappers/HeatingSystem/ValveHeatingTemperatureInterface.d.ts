import { Command } from 'overkiz-client';
import HeatingSystem from '../HeatingSystem';
export default class ValveHeatingTemperatureInterface extends HeatingSystem {
    protected TARGET_MODES: number[];
    protected registerServices(): void;
    protected getTargetStateCommands(value: any): Command | Array<Command> | undefined;
    protected getTargetTemperatureCommands(value: any): Command | Array<Command> | undefined;
    protected onStateChanged(name: any, value: any): void;
    protected computeStates(): void;
}
//# sourceMappingURL=ValveHeatingTemperatureInterface.d.ts.map
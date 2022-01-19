import { Command } from 'overkiz-client';
import WaterHeatingSystem from '../WaterHeatingSystem';
export default class AtlanticPassAPCDHW extends WaterHeatingSystem {
    protected THERMOSTAT_CHARACTERISTICS: string[];
    protected registerServices(): void;
    protected getTargetStateCommands(value: any): Command | Array<Command>;
    protected getTargetTemperatureCommands(value: any): Command | Array<Command>;
    protected getOnCommands(value: any): Command | Array<Command>;
    protected onStateChanged(name: string, value: any): void;
    protected computeStates(): void;
}
//# sourceMappingURL=AtlanticPassAPCDHW.d.ts.map
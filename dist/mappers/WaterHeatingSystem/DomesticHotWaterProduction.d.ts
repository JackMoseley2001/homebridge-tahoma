import { Characteristic } from 'homebridge';
import { Command } from 'overkiz-client';
import WaterHeatingSystem from '../WaterHeatingSystem';
export default class DomesticHotWaterProduction extends WaterHeatingSystem {
    protected THERMOSTAT_CHARACTERISTICS: string[];
    protected currentShower: Characteristic | undefined;
    protected targetShower: Characteristic | undefined;
    protected TARGET_MODES: number[];
    protected registerServices(): void;
    protected getTargetStateCommands(value: any): Command | Array<Command> | undefined;
    protected getTargetTemperatureCommands(value: any): Command | Array<Command>;
    protected getOnCommands(value: any): Command | Array<Command>;
    setTargetShower(value: any): Promise<void>;
    protected onStateChanged(name: string, value: any): void;
    protected computeStates(): void;
}
//# sourceMappingURL=DomesticHotWaterProduction.d.ts.map
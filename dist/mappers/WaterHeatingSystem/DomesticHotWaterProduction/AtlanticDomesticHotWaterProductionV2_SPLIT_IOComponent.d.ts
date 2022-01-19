import { Command } from 'overkiz-client';
import DomesticHotWaterProduction from '../DomesticHotWaterProduction';
export default class AtlanticDomesticHotWaterProductionV2_SPLIT_IOComponent extends DomesticHotWaterProduction {
    protected THERMOSTAT_CHARACTERISTICS: string[];
    protected TARGET_MODES: number[];
    protected registerThermostatService(): import("hap-nodejs").Service;
    protected getTargetTemperatureCommands(value: any): Command | Array<Command>;
    protected getTargetStateCommands(value: any): Command | Array<Command> | undefined;
    protected getOnCommands(value: any): Command | Array<Command>;
    protected onStateChanged(name: string, value: any): void;
    protected computeStates(): void;
}
//# sourceMappingURL=AtlanticDomesticHotWaterProductionV2_SPLIT_IOComponent.d.ts.map
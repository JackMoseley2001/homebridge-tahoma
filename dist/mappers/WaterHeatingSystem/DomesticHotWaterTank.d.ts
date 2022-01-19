import { Command } from 'overkiz-client';
import WaterHeatingSystem from '../WaterHeatingSystem';
export default class DomesticHotWaterTank extends WaterHeatingSystem {
    protected registerServices(): void;
    protected getOnCommands(value: any): Command | Array<Command>;
    protected onStateChanged(name: string, value: any): void;
}
//# sourceMappingURL=DomesticHotWaterTank.d.ts.map
import { Characteristic } from 'homebridge';
import ExteriorHeatingSystem from '../ExteriorHeatingSystem';
export default class DimmerExteriorHeating extends ExteriorHeatingSystem {
    protected level: Characteristic | undefined;
    protected registerServices(): void;
    protected setBrightness(value: any): Promise<void>;
    protected onStateChanged(name: string, value: any): boolean;
}
//# sourceMappingURL=DimmerExteriorHeating.d.ts.map
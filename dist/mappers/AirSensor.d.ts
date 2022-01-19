import { Characteristic } from 'homebridge';
import Mapper from '../Mapper';
export default class AirSensor extends Mapper {
    protected quality: Characteristic | undefined;
    protected co2: Characteristic | undefined;
    protected registerServices(): void;
    protected onStateChanged(name: string, value: any): void;
    private co2ToQuality;
}
//# sourceMappingURL=AirSensor.d.ts.map
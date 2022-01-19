import { Characteristic } from 'homebridge';
import Mapper from '../Mapper';
export default class LightSensor extends Mapper {
    protected lightLevel: Characteristic | undefined;
    protected registerServices(): void;
    protected onStateChanged(name: string, value: any): void;
}
//# sourceMappingURL=LightSensor.d.ts.map
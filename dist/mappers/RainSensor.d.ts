import { Characteristic } from 'homebridge';
import Mapper from '../Mapper';
export default class RainSensor extends Mapper {
    protected rain: Characteristic | undefined;
    protected fault: Characteristic | undefined;
    protected battery: Characteristic | undefined;
    protected registerServices(): void;
    protected onStateChanged(name: string, value: any): void;
}
//# sourceMappingURL=RainSensor.d.ts.map
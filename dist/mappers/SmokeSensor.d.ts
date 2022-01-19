import { Characteristic } from 'homebridge';
import Mapper from '../Mapper';
export default class SmokeSensor extends Mapper {
    protected smoke: Characteristic | undefined;
    protected active: Characteristic | undefined;
    protected fault: Characteristic | undefined;
    protected battery: Characteristic | undefined;
    protected registerServices(): void;
    protected onStateChanged(name: string, value: any): void;
}
//# sourceMappingURL=SmokeSensor.d.ts.map
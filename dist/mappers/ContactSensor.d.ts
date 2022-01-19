import { Characteristic } from 'homebridge';
import Mapper from '../Mapper';
export default class ContactSensor extends Mapper {
    protected state: Characteristic | undefined;
    protected fault: Characteristic | undefined;
    protected battery: Characteristic | undefined;
    protected registerServices(): void;
    protected onStateChanged(name: string, value: any): void;
}
//# sourceMappingURL=ContactSensor.d.ts.map
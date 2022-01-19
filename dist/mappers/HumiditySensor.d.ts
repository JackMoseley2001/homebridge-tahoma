import { Characteristic } from 'homebridge';
import Mapper from '../Mapper';
export default class HumiditySensor extends Mapper {
    protected humidity: Characteristic | undefined;
    protected registerServices(): void;
    protected onStateChanged(name: string, value: any): void;
}
//# sourceMappingURL=HumiditySensor.d.ts.map
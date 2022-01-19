import { Characteristic } from 'homebridge';
import Mapper from '../Mapper';
export default class TemperatureSensor extends Mapper {
    protected temperature: Characteristic | undefined;
    protected registerServices(): void;
    protected onStateChanged(name: string, value: any): void;
}
//# sourceMappingURL=TemperatureSensor.d.ts.map
import { Characteristic } from 'homebridge';
import Mapper from '../Mapper';
export default class OccupancySensor extends Mapper {
    protected occupancy: Characteristic | undefined;
    protected fault: Characteristic | undefined;
    protected battery: Characteristic | undefined;
    protected registerServices(): void;
    protected onStateChanged(name: string, value: any): void;
}
//# sourceMappingURL=OccupancySensor.d.ts.map
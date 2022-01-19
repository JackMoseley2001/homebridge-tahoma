import { Service } from 'homebridge';
import HeatingSystem from './HeatingSystem';
export default class WaterHeatingSystem extends HeatingSystem {
    protected MIN_TEMP: number;
    protected MAX_TEMP: number;
    protected TARGET_MODES: number[];
    protected registerThermostatService(subtype?: string): Service;
}
//# sourceMappingURL=WaterHeatingSystem.d.ts.map
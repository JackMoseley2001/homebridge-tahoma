import { Characteristic, Service } from 'homebridge';
import Mapper from '../Mapper';
export default class RollerShutter extends Mapper {
    protected windowService: Service | undefined;
    protected currentPosition: Characteristic | undefined;
    protected targetPosition: Characteristic | undefined;
    protected positionState: Characteristic | undefined;
    protected obstructionDetected: Characteristic | undefined;
    protected my: Characteristic | undefined;
    protected reverse: any;
    protected initPosition: any;
    protected defaultPosition: any;
    protected blindsOnRollerShutter: any;
    protected movementDuration: any;
    protected cancelTimeout: any;
    protected applyConfig(config: any): void;
    protected registerServices(): void;
    protected getTargetCommands(value: any): any;
    /**
    * Triggered when Homekit try to modify the Characteristic.TargetPosition
    * HomeKit '0' (Close) => 100% Closure
    * HomeKit '100' (Open) => 0% Closure
    **/
    setTargetPosition(value: any): Promise<void>;
    /**
    * Set My position
    **/
    setMyPosition(value: any): Promise<void>;
    protected reversedValue(value: any): any;
    protected onStateChanged(name: string, value: any): void;
}
//# sourceMappingURL=RollerShutter.d.ts.map
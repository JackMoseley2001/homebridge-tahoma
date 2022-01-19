import { Characteristic } from 'homebridge';
import RollerShutter from './RollerShutter';
export default class VenetianBlind extends RollerShutter {
    protected currentAngle: Characteristic | undefined;
    protected targetAngle: Characteristic | undefined;
    protected blindMode: any;
    protected applyConfig(config: any): void;
    protected registerServices(): void;
    protected orientationToAngle(value: any): number;
    protected angleToOrientation(value: any): number;
    protected getTargetCommands(value: any): any;
    protected getTargetAngleCommands(value: any): any;
    setTargetAnglePosition(value: any): Promise<void>;
    protected onStateChanged(name: any, value: any): void;
}
//# sourceMappingURL=VenetianBlind.d.ts.map
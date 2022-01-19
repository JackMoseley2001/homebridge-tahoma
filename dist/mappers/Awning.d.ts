import RollerShutter from './RollerShutter';
export default class Awning extends RollerShutter {
    /**
    * Triggered when Homekit try to modify the Characteristic.TargetPosition
    * HomeKit '0' (Close) => 0% Deployment
    * HomeKit '100' (Open) => 100% Deployment
    **/
    protected getTargetCommands(value: any): any;
    protected reversedValue(value: any): any;
    protected onStateChanged(name: string, value: any): void;
}
//# sourceMappingURL=Awning.d.ts.map
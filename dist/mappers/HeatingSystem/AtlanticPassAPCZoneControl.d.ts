import { Command } from 'overkiz-client';
import HeatingSystem from '../HeatingSystem';
export default class AtlanticPassAPCZoneControl extends HeatingSystem {
    protected TARGET_MODES: number[];
    protected registerServices(): void;
    protected getTargetStateCommands(value: any): Command | Array<Command>;
    protected getTargetTemperatureCommands(value: any): Command | Array<Command>;
    protected onStateChanged(name: any, value: any): void;
    protected computeStates(): void;
}
//# sourceMappingURL=AtlanticPassAPCZoneControl.d.ts.map
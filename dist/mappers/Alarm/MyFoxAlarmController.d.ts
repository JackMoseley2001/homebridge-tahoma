import { Command } from 'overkiz-client';
import Alarm from '../Alarm';
export default class MyFoxAlarmController extends Alarm {
    protected getTargetCommands(value: any): Command | Array<Command>;
    protected onStateChanged(name: string, value: any): void;
}
//# sourceMappingURL=MyFoxAlarmController.d.ts.map
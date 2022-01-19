import { Command } from 'overkiz-client';
import HeatingSystem from '../HeatingSystem';
export default class EvoHomeController extends HeatingSystem {
    protected registerServices(): void;
    protected getTargetStateCommands(value: any): Command | Array<Command> | undefined;
}
//# sourceMappingURL=EvoHomeController.d.ts.map
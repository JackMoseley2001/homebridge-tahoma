import { Command } from 'overkiz-client';
import HeatingSystem from '../HeatingSystem';
export default class AtlanticPassAPCBoiler extends HeatingSystem {
    protected registerServices(): void;
    protected getOnCommands(value: any): Command | Array<Command>;
    protected onStateChanged(name: any, value: any): void;
}
//# sourceMappingURL=AtlanticPassAPCBoiler.d.ts.map
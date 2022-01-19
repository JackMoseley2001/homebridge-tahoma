import { Command } from 'overkiz-client';
import HeatingSystem from '../HeatingSystem';
export default class AtlanticPassAPCHeatingAndCoolingZone extends HeatingSystem {
    protected THERMOSTAT_CHARACTERISTICS: string[];
    protected MIN_TEMP: number;
    protected MAX_TEMP: number;
    protected TARGET_MODES: number[];
    private refreshStatesTimeout;
    protected applyConfig(config: any): void;
    protected registerServices(): void;
    protected getTargetStateCommands(value: any): Command | Array<Command>;
    protected getTargetTemperatureCommands(value: any): Command | Array<Command>;
    protected onStateChanged(name: any, value: any): void;
    protected computeStates(): void;
    /**
     * Helpers
     */
    private getHeatingCooling;
    private getProfile;
    private launchRefreshStates;
    private launchRefreshTemperature;
}
//# sourceMappingURL=AtlanticPassAPCHeatingAndCoolingZone.d.ts.map
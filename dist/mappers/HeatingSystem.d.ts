import { Characteristic, Service } from 'homebridge';
import { Command } from 'overkiz-client';
import Mapper from '../Mapper';
export default class HeatingSystem extends Mapper {
    protected THERMOSTAT_CHARACTERISTICS: string[];
    protected MIN_TEMP: number;
    protected MAX_TEMP: number;
    protected TARGET_MODES: number[];
    protected currentTemperature: Characteristic | undefined;
    protected targetTemperature: Characteristic | undefined;
    protected currentState: Characteristic | undefined;
    protected targetState: Characteristic | undefined;
    protected on: Characteristic | undefined;
    protected prog: Characteristic | undefined;
    protected eco: Characteristic | undefined;
    protected derogationDuration: any;
    protected comfortTemperature: any;
    protected ecoTemperature: any;
    protected applyConfig(config: any): void;
    protected registerThermostatService(subtype?: string): Service;
    protected registerSwitchService(subtype?: string): Service;
    protected getTargetStateCommands(value: any): Command | Array<Command> | undefined;
    protected setTargetState(value: any): Promise<void>;
    protected getTargetTemperatureCommands(value: any): Command | Array<Command> | undefined;
    protected setTargetTemperature(value: any): Promise<void>;
    protected getOnCommands(value: any): Command | Array<Command> | undefined;
    protected setOn(value: any): Promise<void>;
    protected getProgCommands(): Command | Array<Command> | undefined;
    protected sendProgCommands(): void;
    protected onTemperatureUpdate(value: any): void;
    protected onStateChanged(name: string, value: any): void;
}
//# sourceMappingURL=HeatingSystem.d.ts.map
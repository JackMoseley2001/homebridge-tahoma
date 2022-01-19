"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Platform_1 = require("./Platform");
const overkiz_client_1 = require("overkiz-client");
const colors_1 = require("./colors");
class Mapper {
    constructor(platform, accessory, device) {
        this.platform = platform;
        this.accessory = accessory;
        this.device = device;
        this.services = [];
        this.stateless = false;
        this.log = this.platform.log;
    }
    build() {
        const config = Object.assign({}, this.platform.devicesConfig[this.device.uiClass], this.platform.devicesConfig[this.device.widget], this.platform.devicesConfig[this.device.label], this.platform.devicesConfig[this.device.oid]);
        this.applyConfig(config);
        if (Object.keys(config).length > 0) {
            delete config.key;
            if (this.platform.config.debug) {
                this.log.info(`${colors_1.GREY}  Config: `, JSON.stringify(config));
            }
            else {
                this.log.debug('  Config: ', JSON.stringify(config));
            }
        }
        const info = this.accessory.getService(Platform_1.Services.AccessoryInformation);
        if (info) {
            info.setCharacteristic(Platform_1.Characteristics.Manufacturer, this.device.manufacturer);
            info.setCharacteristic(Platform_1.Characteristics.Model, this.device.model);
            info.setCharacteristic(Platform_1.Characteristics.SerialNumber, this.device.address.substring(0, 64));
            this.services.push(info);
        }
        this.stateless = (this.device.states.length === 0);
        this.registerServices();
        this.accessory.services.forEach((service) => {
            if (!this.services.find((s) => s.UUID === service.UUID && s.subtype === service.subtype)) {
                this.accessory.removeService(service);
            }
        });
        if (!this.stateless) {
            // Init and register states changes
            this.onStatesChanged(this.device.states, true);
            this.device.on('states', states => this.onStatesChanged(states));
            // Init and register sensors states changes
            this.device.sensors.forEach((sensor) => {
                this.onStatesChanged(sensor.states, true);
                sensor.on('states', states => this.onStatesChanged(states));
            });
        }
        // TODO: instanciate mapper for device sensors
        // Configure accessory sensors
        // this.device.sensors.forEach((sensor) => new mapper(platform, accessory, sensor)))
    }
    /**
     * Helper methods
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    applyConfig(config) {
        //
    }
    registerService(type, subtype) {
        let service;
        const name = subtype ? this.translate(subtype) : this.device.label;
        if (subtype) {
            service = this.accessory.getServiceById(type, subtype) || this.accessory.addService(type, name, subtype);
        }
        else {
            service = this.accessory.getService(type) || this.accessory.addService(type);
        }
        service.setCharacteristic(Platform_1.Characteristics.Name, name);
        /*
        service.getCharacteristic(Characteristics.Name)
            .updateValue(name)
            .onSet((value) => {
                this.debug('Will rename ' + name + ' to ' + value);
                this.platform.client.setDeviceName(this.device.deviceURL, value);
            });
        */
        this.services.push(service);
        return service;
    }
    translate(value) {
        switch (value) {
            case 'boost': return 'Boost';
            case 'drying': return 'Séchage';
            default: return value.charAt(0).toUpperCase() + value.slice(1);
        }
    }
    debounce(task) {
        return (value) => {
            if (this.debounceTimer !== null) {
                clearTimeout(this.debounceTimer);
            }
            this.debounceTimer = setTimeout(() => {
                this.debounceTimer = null;
                task.bind(this)(value).catch(() => null);
            }, 2000);
        };
    }
    postpone(task, ...args) {
        if (this.postponeTimer !== null) {
            clearTimeout(this.postponeTimer);
        }
        this.postponeTimer = setTimeout(task.bind(this), 500, ...args);
    }
    async executeCommands(commands, standalone = false) {
        if (commands === undefined || (Array.isArray(commands) && commands.length === 0)) {
            this.error('No target command for', this.device.label);
            throw new Error('No target command for ' + this.device.label);
        }
        else if (Array.isArray(commands)) {
            for (const c of commands) {
                this.info(c.name + JSON.stringify(c.parameters));
            }
        }
        else {
            this.info(commands.name + JSON.stringify(commands.parameters));
            commands = [commands];
        }
        const commandName = commands[0].name;
        const localizedName = this.platform.translate(commands[0].name + (commands[0].parameters.length > 0 ? '.' + commands[0].parameters[0] : ''));
        /*
        if (!this.isIdle) {
            this.cancelExecution();
        }
        */
        const highPriority = this.device.hasState('io:PriorityLockLevelState') ? true : false;
        const label = this.device.label + ' - ' + localizedName;
        if (this.actionPromise) {
            this.actionPromise.action.addCommands(commands);
        }
        else {
            this.actionPromise = new Promise((resolve, reject) => {
                setTimeout(async () => {
                    try {
                        this.executionId = await this.platform.executeAction(label, this.actionPromise.action, highPriority, standalone);
                        resolve(this.actionPromise.action);
                    }
                    catch (error) {
                        this.error(commandName + ' ' + error.message);
                        reject(error);
                    }
                    this.actionPromise = null;
                }, 100);
            });
            this.actionPromise.action = new overkiz_client_1.Action(this.device.deviceURL, commands);
            this.actionPromise.action.on('update', (state, event) => {
                if (state === overkiz_client_1.ExecutionState.FAILED) {
                    this.error(commandName, event.failureType);
                }
                else if (state === overkiz_client_1.ExecutionState.COMPLETED) {
                    this.info(commandName, state);
                }
                else {
                    this.debug(commandName, state);
                }
            });
        }
        return this.actionPromise;
    }
    async delay(duration) {
        return new Promise(resolve => setTimeout(resolve, duration));
    }
    async requestStatesUpdate(defer) {
        if (defer) {
            setTimeout(this.requestStatesUpdate.bind(this), defer * 1000);
        }
        else {
            await this.platform.client.refreshDeviceStates(this.device.deviceURL);
        }
    }
    /**
     * Logging methods
     */
    debug(...args) {
        if (this.platform.config.debug) {
            this.platform.log.info(`${colors_1.GREY}[${this.device.label}]`, ...args);
        }
        else {
            this.platform.log.debug(`[${this.device.label}]`, ...args);
        }
    }
    info(...args) {
        this.platform.log.info(`[${this.device.label}]`, ...args);
    }
    warn(...args) {
        this.platform.log.warn(`[${this.device.label}]`, ...args);
    }
    error(...args) {
        this.platform.log.error(`[${this.device.label}]`, ...args);
    }
    /**
     * Children methods
     */
    registerServices() {
        // 
    }
    onStatesChanged(states, init = false) {
        states.forEach((state) => {
            if (!init) {
                this.debug(state.name + ' => ' + state.value);
            }
            this.onStateChanged(state.name, state.value);
        });
    }
    /**
     * Triggered when device state change
     * @param name State name
     * @param value State value
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    onStateChanged(name, value) {
        //
    }
    // OLD
    get isIdle() {
        return !this.platform.client.hasExecution(this.executionId);
    }
    async cancelExecution() {
        await this.platform.client.cancelExecution(this.executionId);
    }
}
exports.default = Mapper;
//# sourceMappingURL=Mapper.js.map
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Platform = exports.Characteristics = exports.Services = void 0;
const settings_1 = require("./settings");
const overkiz_client_1 = require("overkiz-client");
const Mapper_1 = __importDefault(require("./Mapper"));
const SceneMapper_1 = __importDefault(require("./SceneMapper"));
const CustomCharacteristics_1 = require("./CustomCharacteristics");
const colors_1 = require("./colors");
const DEFAULT_RETRY_DELAY = 60;
/**
 * HomebridgePlatform
 * This class is the main constructor for your plugin, this is where you should
 * parse the user config and discover/register accessories with Homebridge.
 */
class Platform {
    constructor(log, config, api) {
        var _a;
        this.log = log;
        this.config = config;
        this.api = api;
        // this is used to track restored cached accessories
        this.accessories = [];
        this.devicesConfig = [];
        this.retryDelay = DEFAULT_RETRY_DELAY;
        exports.Services = this.api.hap.Service;
        exports.Characteristics = this.api.hap.Characteristic;
        new CustomCharacteristics_1.CustomCharacteristics(this.api.hap);
        this.log.debug('Finished initializing platform:', this.config.name);
        this.exclude = config.exclude || [];
        this.exclude.push('Pod', 'ConfigurationComponent', 'NetworkComponent', 'ProtocolGateway', 'ConsumptionSensor', 'ElectricitySensor', 'OnOffHeatingSystem', 'Wifi', 'RemoteController', 
        // AtlanticElectricalTowelDryer bad sensors
        'io:LightIOSystemDeviceSensor', 'io:RelativeHumidityIOSystemDeviceSensor', 'WeatherForecastSensor');
        this.exposeScenarios = config.exposeScenarios;
        (_a = config.devicesConfig) === null || _a === void 0 ? void 0 : _a.forEach(x => this.devicesConfig[x.key] = x);
        try {
            this.client = new overkiz_client_1.Client(log, config);
        }
        catch (error) {
            this.log.error(error.message);
            throw error;
        }
        // When this event is fired it means Homebridge has restored all cached accessories from disk.
        // Dynamic Platform plugins should only register new accessories after this event was fired,
        // in order to ensure they weren't added to homebridge already. This event can also be used
        // to start discovery of new accessories.
        this.api.on('didFinishLaunching', () => {
            log.debug('Executed didFinishLaunching callback');
            // run the method to discover / register your devices as accessories
            this.discoverDevices();
            this.loadLocation();
        });
    }
    /**
     * This function is invoked when homebridge restores cached accessories from disk at startup.
     * It should be used to setup event handlers for characteristics and update respective values.
     */
    async loadLocation() {
        const location = await this.client.getSetupLocation();
        const countryCode = location.countryCode.toLowerCase().trim();
        this.translations = await Promise.resolve().then(() => __importStar(require(`./lang/${countryCode}.json`))).catch(() => Promise.resolve().then(() => __importStar(require('./lang/en.json'))))
            .then((c) => c.default);
    }
    /**
     * This function is invoked when homebridge restores cached accessories from disk at startup.
     * It should be used to setup event handlers for characteristics and update respective values.
     */
    async configureAccessory(accessory) {
        if (!this.accessories.map((a) => a.UUID).includes(accessory.UUID)) {
            this.accessories.push(accessory);
        }
    }
    /**
     * This is an example method showing how to register discovered accessories.
     * Accessories must only be registered once, previously created accessories
     * must not be registered again to prevent "duplicate UUID" errors.
     */
    async discoverDevices() {
        try {
            const uuids = Array();
            const devices = await this.client.getDevices();
            // loop over the discovered devices and register each one if it has not already been registered
            for (const device of devices) {
                if (this.exclude.includes(device.uiClass) ||
                    this.exclude.includes(device.widget) ||
                    this.exclude.includes(device.controllableName) ||
                    this.exclude.includes(device.label) ||
                    this.exclude.includes(device.protocol)) {
                    continue;
                }
                // see if an accessory with the same uuid has already been registered and restored from
                // the cached devices we stored in the `configureAccessory` method above
                let accessory = this.accessories.find(accessory => accessory.UUID === device.uuid);
                if (accessory) {
                    // the accessory already exists
                    //this.log.info('Updating accessory:', accessory.displayName);
                    /*
                    const newaccessory = new this.api.platformAccessory(device.label, device.uuid);
                    newaccessory.context.device = device;
                    await this.configureAccessory(newaccessory);
                    const services = newaccessory.services.map((service) => service.UUID);
                    accessory.services
                        .filter((service) => !services.includes(service.UUID))
                        .forEach((services) => accessory?.removeService(services));
                    this.api.updatePlatformAccessories([accessory]);
                    */
                }
                else {
                    // the accessory does not yet exist, so we need to create it
                    this.log.info('Create accessory:', device.label);
                    accessory = new this.api.platformAccessory(device.label, device.uuid);
                    //accessory.context.device = device;
                    await this.configureAccessory(accessory);
                    this.api.registerPlatformAccessories(settings_1.PLUGIN_NAME, settings_1.PLATFORM_NAME, [accessory]);
                }
                this.log.info(`Configure device ${colors_1.BLUE}${accessory.displayName}${colors_1.RESET}`);
                this.log.info(`${colors_1.GREY}  ${device.uiClass} > ${device.widget}`);
                const mapper = await Promise.resolve().then(() => __importStar(require(`./mappers/${device.uiClass}/${device.widget}/${device.uniqueName}`))).catch(() => Promise.resolve().then(() => __importStar(require(`./mappers/${device.uiClass}/${device.widget}`))))
                    .catch(() => Promise.resolve().then(() => __importStar(require(`./mappers/${device.uiClass}`))))
                    .then((c) => c.default)
                    .catch(() => Mapper_1.default);
                new mapper(this, accessory, device).build();
                uuids.push(device.uuid);
            }
            if (this.exposeScenarios) {
                const actionGroups = await this.client.getActionGroups();
                for (const actionGroup of actionGroups) {
                    if (this.exclude.includes(actionGroup.label)) {
                        continue;
                    }
                    let accessory = this.accessories.find(accessory => accessory.UUID === actionGroup.oid);
                    if (!accessory) {
                        // the accessory does not yet exist, so we need to create it
                        this.log.info('Create accessory', actionGroup.label);
                        accessory = new this.api.platformAccessory(actionGroup.label, actionGroup.oid);
                        await this.configureAccessory(accessory);
                        this.api.registerPlatformAccessories(settings_1.PLUGIN_NAME, settings_1.PLATFORM_NAME, [accessory]);
                    }
                    this.log.info('Map scene', accessory.displayName);
                    new SceneMapper_1.default(this, accessory, actionGroup);
                    uuids.push(actionGroup.oid);
                }
            }
            const deleted = this.accessories.filter((accessory) => !uuids.includes(accessory.UUID));
            this.api.unregisterPlatformAccessories(settings_1.PLUGIN_NAME, settings_1.PLATFORM_NAME, deleted);
            this.retryDelay = DEFAULT_RETRY_DELAY;
        }
        catch (error) {
            this.log.error(error);
            this.log.error('Retry in ' + this.retryDelay + ' sec...');
            setTimeout(this.discoverDevices.bind(this), this.retryDelay * 1000);
            this.retryDelay *= 2;
        }
    }
    /*
        action: The action to execute
    */
    executeAction(label, action, highPriority = false, standalone = false) {
        if (standalone) {
            // Run action in standalone execution
            return this.client.execute(highPriority ? 'apply/highPriority' : 'apply', new overkiz_client_1.Execution(label + ' - HomeKit', action));
        }
        else {
            if (this.executionPromise) {
                this.executionPromise.execution.addAction(action);
                this.executionPromise.execution.label = 'Execute scene (' +
                    this.executionPromise.execution.actions.length + ' devices) - HomeKit';
            }
            else {
                this.executionPromise = new Promise((resolve, reject) => {
                    setTimeout(() => {
                        this.client.execute(highPriority ? 'apply/highPriority' : 'apply', this.executionPromise.execution)
                            .then(resolve)
                            .catch(reject);
                        this.executionPromise = null;
                    }, 100);
                });
                this.executionPromise.execution = new overkiz_client_1.Execution(label + ' - HomeKit', action);
            }
            return this.executionPromise;
        }
    }
    /**
     * Translate
     * @param path
     * @returns string
     */
    translate(label) {
        const path = label.split('.');
        let translation = this.translations;
        for (const key of path) {
            if (typeof translation === 'object' && key in translation) {
                translation = translation[key];
            }
            else if (typeof translation === 'string') {
                if (translation.includes(':param')) {
                    translation = translation.replace(':param', key);
                }
                return translation;
            }
        }
        return label;
    }
}
exports.Platform = Platform;
//# sourceMappingURL=Platform.js.map
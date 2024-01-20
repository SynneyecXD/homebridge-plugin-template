import { Service, PlatformAccessory, CharacteristicValue } from 'homebridge';

import { ExampleHomebridgePlatform } from './platform';

/**
 * Platform Accessory
 * An instance of this class is created for each accessory your platform registers
 * Each accessory may expose multiple services of different service types.
 */
export class ExamplePlatformAccessory {
  private service: Service;

  /**
   * These are just used to create a working example
   * You should implement your own code to track the state of your accessory
   */
  private exampleStates = {
    CurrentPosition: 100,
    PositionState: 2,
    TargetPosition: 100,
  };

  constructor(
    private readonly platform: ExampleHomebridgePlatform,
    private readonly accessory: PlatformAccessory,
  ) {
    // set accessory information
    this.accessory
      .getService(this.platform.Service.AccessoryInformation)!
      .setCharacteristic(
        this.platform.Characteristic.Manufacturer,
        'Dari Gomez',
      )
      .setCharacteristic(this.platform.Characteristic.Model, 'V1')
      .setCharacteristic(this.platform.Characteristic.SerialNumber, 'HOMEMADE');

    // get the WindowCovering service if it exists, otherwise create a new WindowCovering service
    // you can create multiple services for each accessory
    this.service =
      this.accessory.getService(this.platform.Service.WindowCovering) ||
      this.accessory.addService(this.platform.Service.WindowCovering);

    // set the service name, this is what is displayed as the default name on the Home app
    // in this example we are using the name we stored in the `accessory.context` in the `discoverDevices` method.
    this.service.setCharacteristic(
      this.platform.Characteristic.Name,
      accessory.context.device.exampleDisplayName,
    );

    // each service must implement at-minimum the "required characteristics" for the given service type
    // see https://developers.homebridge.io/#/service/WindowCovering

    // register handlers for the CurrentPosition Characteristic
    this.service
      .getCharacteristic(this.platform.Characteristic.CurrentPosition)
      .onGet(this.getCurrentPosition.bind(this)); // GET - bind to the 'getCurrentPosition` method below

    // register handlers for the PositionState Characteristic
    this.service
      .getCharacteristic(this.platform.Characteristic.PositionState)
      .onGet(this.getPositionState.bind(this)); // GET - bind to the 'getPositionState` method below

    // register handlers for the TargetPosition Characteristic
    this.service
      .getCharacteristic(this.platform.Characteristic.TargetPosition)
      .onSet(this.setTargetPosition.bind(this)) // SET - bind to the `setTargetPosition` method below
      .onGet(this.getTargetPosition.bind(this)); // GET - bind to the `getTargetPosition` method below
  }

  /**
   * Handle "SET" requests from HomeKit
   * These are sent when the user changes the state of an accessory, for example, turning on a Light bulb.
   */
  async setTargetPosition(value: CharacteristicValue) {
    // implement your own code to turn your device on/off
    this.exampleStates.TargetPosition = value as number;

    this.exampleStates.PositionState = (value as number) > 50 ? 1 : 0;

    setTimeout(() => {
      this.exampleStates.PositionState = 2;
      this.exampleStates.CurrentPosition = this.exampleStates.TargetPosition;
      this.platform.log.debug('Blind finished moving.');
    }, 1000);

    this.platform.log.debug('Set Characteristic TargetPosition ->', value);
  }

  /**
   * Handle the "GET" requests from HomeKit
   * These are sent when HomeKit wants to know the current state of the accessory, for example, checking if a Light bulb is on.
   *
   * GET requests should return as fast as possbile. A long delay here will result in
   * HomeKit being unresponsive and a bad user experience in general.
   *
   * If your device takes time to respond you should update the status of your device
   * asynchronously instead using the `updateCharacteristic` method instead.
   */

  async getCurrentPosition(): Promise<CharacteristicValue> {
    // implement your own code to check if the device is on
    const CurrentPosition = this.exampleStates.CurrentPosition;

    this.platform.log.debug(
      'Get Characteristic CurrentPosition ->', CurrentPosition,
    );

    // if you need to return an error to show the device as "Not Responding" in the Home app:
    // throw new this.platform.api.hap.HapStatusError(this.platform.api.hap.HAPStatus.SERVICE_COMMUNICATION_FAILURE);

    return CurrentPosition;
  }

  async getPositionState(): Promise<CharacteristicValue> {
    // implement your own code to check if the device is on
    const PositionState = this.exampleStates.PositionState;

    this.platform.log.debug(
      'Get Characteristic PositionState ->', PositionState,
    );

    // if you need to return an error to show the device as "Not Responding" in the Home app:
    // throw new this.platform.api.hap.HapStatusError(this.platform.api.hap.HAPStatus.SERVICE_COMMUNICATION_FAILURE);

    return PositionState;
  }

  async getTargetPosition(): Promise<CharacteristicValue> {
    // implement your own code to check if the device is on
    const TargetPosition = this.exampleStates.TargetPosition;

    this.platform.log.debug(
      'Get Characteristic TargetPosition ->', TargetPosition,
    );

    // if you need to return an error to show the device as "Not Responding" in the Home app:
    // throw new this.platform.api.hap.HapStatusError(this.platform.api.hap.HAPStatus.SERVICE_COMMUNICATION_FAILURE);

    return TargetPosition;
  }
}

import { DataPointTag } from './DataPointTag';
import DeviceTypeEnum from './DeviceType';
import { Job } from './Job';
import { User } from './User';

interface Device {
  uid: string;
  user: User;
  sharedUsers: User[];
  name: string;
  mac: string;
  type: DeviceTypeEnum;
  version: string;
  firmware: string;
  dataPointTags: DataPointTag[];
  responseTime: number;
  addTime?: number;
  initExpireTime?: number;
  initApiKey?: string;
  deactivated: boolean;
  jobs: Job[];
}

interface DeviceInput {
  name: string;
  mac: string;
  type?: DeviceTypeEnum;
  version: string;
  firmware: string;
  initApiKey?: string;
  deactivated: boolean;
  dataPointTags?: DataPointTag[] | null;
}

function deviceToInput(device: Device): DeviceInput {
  return {
    name: device.name,
    mac: device.mac,
    type: device.type,
    version: device.version,
    firmware: device.firmware,
    initApiKey: device.initApiKey,
    deactivated: device.deactivated,
    dataPointTags: device.dataPointTags,
  };
}

function getEmptyDeviceInput(): DeviceInput {
  return {
    name: '',
    mac: '',
    version: '',
    firmware: '',
    deactivated: false,
  };
}

export type { Device, DeviceInput };
export { deviceToInput, getEmptyDeviceInput };

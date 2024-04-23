import { Device } from './Device';

interface Module {
  uid: string;
  name: string;
  devices?: Array<Device>;
}

interface ModuleInput {
  name: string;
  devices?: Array<Device> | null;
}

function getEmptyModuleInput(): ModuleInput {
  return {
    name: '',
    devices: null,
  };
}

export type { Module, ModuleInput };
export { getEmptyModuleInput };

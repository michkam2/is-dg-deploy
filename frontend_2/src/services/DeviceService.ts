import { Device, DeviceInput } from 'src/models/Device';
import { api } from '@/utils/api';
import { User } from '@/models/User';
import { useAuthStore } from '@/stores/auth-store';

class DeviceService {
  async getDevices(): Promise<Device[]> {
    return await api<Device[]>('device');
  }

  async getDevice(uid: string): Promise<Device> {
    const device = await api<Device>(`device/getDeviceById/${uid}`);
    device.dataPointTags = device.dataPointTags.filter(
      (dataPoint) => dataPoint !== null && dataPoint.deactivated === false,
    );
    return device;
  }

  async createDevice(deviceCreate: DeviceInput): Promise<Device> {
    return await api<Device>('device/create', {
      method: 'POST',
      body: deviceCreate,
    });
  }

  async updateDevice(deviceUpdate: DeviceInput, uid: string): Promise<Device> {
    deviceUpdate.dataPointTags = null;
    return await api<Device>(`device/updateDevice/${uid}`, {
      method: 'PUT',
      body: deviceUpdate,
    });
  }

  async deleteDevice(uid: string): Promise<void> {
    await api(`device/delete/${uid}`, {
      method: 'DELETE',
    });
  }

  async initExpireTime(uid: string): Promise<void> {
    await api(`/device/initExpireTime/${uid}`, {
      method: 'GET',
    });
  }

  async getSharedDevices(): Promise<Device[]> {
    return await api<Device[]>('device/getDevicesSharedWithUser', {
      method: 'GET',
    });
  }

  async shareDevice(deviceUid: string, email: string): Promise<void> {
    await api(`device/addSharedUser/${deviceUid}/${email}`, {
      method: 'PUT',
    });
  }

  async removeSharedUser(deviceUid: string, email: string): Promise<void> {
    await api(`device/removeSharedUser/${deviceUid}/${email}`, {
      method: 'DELETE',
    });
  }

  async getSharedUsers(deviceUid: string): Promise<User[]> {
    let users = await api<User[]>(`device/getSharedUsers/${deviceUid}`, {
      method: 'GET',
    });

    if (!users) {
      return [];
    }
    users = users.filter((user) => user !== null);

    return users;
  }

  isOwner(device: Device): boolean {
    const authStore = useAuthStore();
    return device.user.uid === authStore.user?.uid;
  }
}

export default new DeviceService();

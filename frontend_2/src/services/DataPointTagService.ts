import { api } from '@/utils/api';
import { DataPointTag, DataPointTagInput } from 'src/models/DataPointTag';
import { Device } from 'src/models/Device';

class DataPointTagService {
  async getDataPointTags(): Promise<DataPointTag[]> {
    return await api<DataPointTag[]>('device');
  }

  async createDataPointTag(dataPointTagCreate: DataPointTagInput): Promise<DataPointTag> {
    return await api<DataPointTag>('datapoint/datapointtag/create', {
      method: 'POST',
      body: dataPointTagCreate,
    });
  }

  async addDataPointTagToDevice(deviceId: string, dataPointTagId: string): Promise<Device> {
    return await api<Device>(`device/addDataPointTagToDevice/${deviceId}/${dataPointTagId}`, {
      method: 'PUT',
    });
  }

  async updateDataPointTag(dataPointTagUpdate: DataPointTagInput, dataPointTagId: string): Promise<DataPointTag> {
    return await api<DataPointTag>(`datapoint/datapointtag/updateDataPointTag/${dataPointTagId}`, {
      method: 'POST',
      body: dataPointTagUpdate,
    });
  }

  async deleteDataPointTag(dataPointTagId: string): Promise<DataPointTag> {
    return await api<DataPointTag>(`datapoint/datapointtag/deleteDataPointTag/${dataPointTagId}`, {
      method: 'DELETE',
    });
  }
}

export default new DataPointTagService();

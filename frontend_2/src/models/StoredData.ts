interface StoredData {
  uid: string;
  dataPointTagId: string;
  value: number;
  measureAdd: number;
  deactivated: boolean;
  deviceId: string;
  tag: string;
}

export type { StoredData };

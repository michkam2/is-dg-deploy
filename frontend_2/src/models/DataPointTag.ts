import { StoredData } from './StoredData';

interface DataPointTag {
  uid: string;
  tag: string;
  name: string;
  unit: string;
  decimal: number;
  storedData: StoredData[];
  createdAt: number;
  deactivated: boolean;
}

interface DataPointTagInput {
  tag: string;
  name: string;
  unit: string;
  decimal: number;
}

function dataPointTagToInput(dataPointTag: DataPointTag): DataPointTagInput {
  return {
    tag: dataPointTag.tag,
    name: dataPointTag.name,
    unit: dataPointTag.unit,
    decimal: dataPointTag.decimal,
  };
}

export type { DataPointTag, DataPointTagInput };
export { dataPointTagToInput };

import { DataPointTag } from './DataPointTag';

interface DataPointTagNode {
  uid: string;
  name: string;
  children?: Array<DataPointTagNode>;
  dataPointTag?: DataPointTag;
}

export type { DataPointTagNode };

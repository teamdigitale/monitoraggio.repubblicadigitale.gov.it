import { ElaboratoCsvRequest } from './ElaboratoCsvRequest.model';

export interface DataUploadContextModel {
  search: () => void;
  parsedData: ElaboratoCsvRequest | undefined;
  setParsedData: (data: ElaboratoCsvRequest | undefined) => void;
}

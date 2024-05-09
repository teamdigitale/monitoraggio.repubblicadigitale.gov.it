import { ServiziElaboratiResponse } from './ServiziElaboratiResponse.model';

export interface ElaboratoCsvResponse {
  fileContent: string;
  fileName: string;
  response: ServiziElaboratiResponse;
}

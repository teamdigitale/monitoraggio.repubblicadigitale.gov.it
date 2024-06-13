import { ServiziElaboratiDto } from './ServiziElaboratiDto.model';

export interface ElaboratoCsvRequest {
  serviziValidati: ServiziElaboratiDto[];
  serviziScartati: ServiziElaboratiDto[];
}

import { ServiziElaboratiDto } from './ServiziElaboratiDto.model';

export interface ServiziElaboratiResponse {
  serviziScartati: ServiziElaboratiDto[];
  serviziAggiunti: number;
  cittadiniAggiunti: number;
  questionariAggiunti: number;
}

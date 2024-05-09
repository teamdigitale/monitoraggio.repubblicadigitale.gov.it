import { QuestionarioRequestModel } from './QuestionarioRequest.model';
import { CittadinoCSV } from './Cittadino.model';
import { CampiAggiuntiviCsv } from './CampiAggiuntiviCsv.model';
import { ServizioRequest } from './ServizioRequest';

export interface ServiziElaboratiDto {
  servizioRequest: ServizioRequest;
  nuovoCittadinoServizioRequest: CittadinoCSV;
  questionarioCompilatoRequest: QuestionarioRequestModel;
  campiAggiuntiviCSV: CampiAggiuntiviCsv;
}

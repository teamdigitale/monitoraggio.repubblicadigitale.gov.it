import { AxiosResponse } from 'axios';
import { Page } from '../models/Page.model';
import { RegistroAttivita } from '../models/RegistroAttivita.model';
import API from '../utils/apiHelper';
import { getUserHeaders } from '../redux/features/user/userThunk';
import { ElaboratoCsvRequest } from '../models/ElaboratoCsvRequest.model';
import { ElaboratoCsvResponse } from '../models/ElaboratoCsvResponse.model';

export function searchActivityReport(
  page: number,
  idProgetto: number
): Promise<AxiosResponse<Page<RegistroAttivita>>> {
  const { cfUtenteLoggato, codiceRuoloUtenteLoggato, idEnte } =
    getUserHeaders();
  return API.post<Page<RegistroAttivita>>(
    `${process.env.QUESTIONARIO_CITTADINO}registroAttivita/search`,
    {
      cfUtenteLoggato,
      codiceRuoloUtenteLoggato,
      idEnte,
      idProgetto,
    },
    { params: { page } }
  );
}

export function saveActivityReport(
  report: RegistroAttivita
): Promise<AxiosResponse<RegistroAttivita>> {
  return API.post<RegistroAttivita>(
    `${process.env.QUESTIONARIO_CITTADINO}registroAttivita`,
    report
  );
}

export function elaborateCsv(
  elaborato: ElaboratoCsvRequest
): Promise<AxiosResponse<ElaboratoCsvResponse>> {
  return API.post<ElaboratoCsvResponse>(
    `${process.env.QUESTIONARIO_CITTADINO}importCsv`,
    elaborato
  );
}

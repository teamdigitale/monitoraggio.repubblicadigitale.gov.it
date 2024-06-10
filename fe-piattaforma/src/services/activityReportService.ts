import axios, { AxiosResponse } from 'axios';
import { Page } from '../models/Page.model';
import {
  RegistroAttivita,
  RegistroAttivitaWithoutID,
} from '../models/RegistroAttivita.model';
import API from '../utils/apiHelper';
import { getUserHeaders } from '../redux/features/user/userThunk';
import { ElaboratoCsvRequest } from '../models/ElaboratoCsvRequest.model';
import { ElaboratoCsvResponse } from '../models/ElaboratoCsvResponse.model';
import { UriPresigned } from '../models/UriPresigned.model';

export function searchActivityReport(
  page: number,
  idProgetto: number,
  idEnte: number
): Promise<AxiosResponse<Page<RegistroAttivita>>> {
  const { cfUtenteLoggato, codiceRuoloUtenteLoggato, idProgramma } =
    getUserHeaders();
  return API.post<Page<RegistroAttivita>>(
    `${process.env.QUESTIONARIO_CITTADINO}registroAttivita/search`,
    {
      cfUtenteLoggato,
      codiceRuoloUtenteLoggato,
      idEnte,
      idProgetto,
      idProgramma,
    },
    { params: { page } }
  );
}

export function saveActivityReport(
  report: RegistroAttivitaWithoutID,
  idProgetto: number,
  idEnte: number
): Promise<AxiosResponse<RegistroAttivita>> {
  const { cfUtenteLoggato, codiceRuoloUtenteLoggato, idProgramma } =
    getUserHeaders();
  return API.post<RegistroAttivita>(
    `${process.env.QUESTIONARIO_CITTADINO}registroAttivita`,
    {
      ...report,
      cfUtenteLoggato,
      codiceRuoloUtenteLoggato,
      idEnte,
      idProgetto,
      idProgramma,
    }
  );
}

export function elaborateCsv(
  elaborato: ElaboratoCsvRequest,
  idProgetto: number,
  idEnte: number
): Promise<AxiosResponse<ElaboratoCsvResponse>> {
  const { cfUtenteLoggato, codiceRuoloUtenteLoggato, idProgramma } =
    getUserHeaders();
  return API.post<ElaboratoCsvResponse>(
    `${process.env.QUESTIONARIO_CITTADINO}importCsv`,
    {
      ...elaborato,
      cfUtenteLoggato,
      codiceRuoloUtenteLoggato,
      idEnte,
      idProgetto,
      idProgramma,
    }
  );
}

export function generateUploadPUActivityReport(
  activityReportId: number,
  fileName: string
): Promise<AxiosResponse<UriPresigned>> {
  return API.put(
    `${process.env.QUESTIONARIO_CITTADINO}registroAttivita/${activityReportId}/generateUploadPu`,
    {},
    { params: { fileName } }
  );
}

export function uploadActivityReportResume(
  presignedUrl: string,
  file: File
): Promise<AxiosResponse<void>> {
  return axios.put(presignedUrl, file);
}

export function updateActivityReportFileUploaded(
  activityReportId: number,
  fileUploaded: boolean
) {
  return API.patch(
    `${process.env.QUESTIONARIO_CITTADINO}registroAttivita/${activityReportId}`,
    fileUploaded
  );
}

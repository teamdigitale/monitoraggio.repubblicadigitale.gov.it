import axios, { AxiosResponse } from 'axios';
import { Page } from '../models/Page.model';
import {
  RegistroAttivita,
  RegistroAttivitaWithoutID,
} from '../models/RegistroAttivita.model';
import API from '../utils/apiHelper';
import { getUserHeaders } from '../redux/features/user/userThunk';
import { ElaboratoCsvRequest } from '../models/ElaboratoCsvRequest.model';
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
): Promise<AxiosResponse<string>> {
  const { cfUtenteLoggato, codiceRuoloUtenteLoggato, idProgramma } =
    getUserHeaders();
  return API.post<string>(`${process.env.QUESTIONARIO_CITTADINO}importCsv`, {
    ...elaborato,
    cfUtenteLoggato,
    codiceRuoloUtenteLoggato,
    idEnte,
    idProgetto,
    idProgramma,
  });
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
    { isFileUpdated: fileUploaded }
  );
}
export function generateDownloadPUActivityReport(
  activityReportId: number
): Promise<AxiosResponse<UriPresigned>> {
  return API.put(
    `${process.env.QUESTIONARIO_CITTADINO}registroAttivita/${activityReportId}/generateDownloadPu`,
    {}
  );
}

export function downloadActivityReportResume(
  presignedUrl: string
): Promise<AxiosResponse<string>> {
  return axios.get(presignedUrl);
}

export function checkActivityReportStatus(
  activityReportUUID: string
): Promise<AxiosResponse<RegistroAttivita>> {
  return API.get(
    `${process.env.QUESTIONARIO_CITTADINO}registroAttivita/polling/${activityReportUUID}`
  );
}

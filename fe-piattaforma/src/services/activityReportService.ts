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

export function downloadCSVGuide(): Promise<AxiosResponse<any>> {
  return axios.get(
    'https://s3-mitd-drupal-prod.s3.eu-central-1.amazonaws.com/public/2024-06/doc_guida_tmp_17183517107416726678.pdf?versionId=GBZcjjjmeC7WYICPXGiOIHFVd1YfmY.r&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIA6RGETSJQ7K6J4KNR%2F20240614%2Feu-central-1%2Fs3%2Faws4_request&X-Amz-Date=20240614T075513Z&X-Amz-SignedHeaders=host&X-Amz-Expires=7200&X-Amz-Signature=1e48108f1455c04aad1aa65e75f5795120fa3d02292052adec3ad38bfb41857d'
  );
}

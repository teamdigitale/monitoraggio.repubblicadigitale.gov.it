import { Spinner } from 'design-react-kit';
import React, { useCallback, useContext, useState } from 'react';
import { ElaboratoCsvResponse } from '../../models/ElaboratoCsvResponse.model';
import { ElaboratoCsvRequest } from '../../models/ElaboratoCsvRequest.model';
import { getUserHeaders } from '../../redux/features/user/userThunk';
import { RegistroAttivitaWithoutID } from '../../models/RegistroAttivita.model';
import {
  elaborateCsv,
  generateUploadPUActivityReport,
  saveActivityReport,
  updateActivityReportFileUploaded,
  uploadActivityReportResume,
} from '../../services/activityReportService';
import { convertBase64ToFile, downloadGeneratedFile } from '../../utils/common';
import { DataUploadContextModel } from '../../models/DataUploadContext.model';
import { DataUploadContext } from '../../contexts/DataUploadContext';
import { dispatchNotify } from '../../utils/notifictionHelper';
import { ProjectInfo } from '../../models/ProjectInfo.model';
import { ProjectContext } from '../../contexts/ProjectContext';
import { useParams } from 'react-router-dom';
import { UriPresigned } from '../../models/UriPresigned.model';

function showSuccessImport() {
  dispatchNotify({
    title: 'Caricamento file',
    status: 'success',
    message: `L'import dei dati è andato a buon fine.`,
    closable: true,
    duration: 'slow',
  });
}

function showErrorImport() {
  dispatchNotify({
    title: 'Caricamento file',
    status: 'error',
    message: `I dati sono stati parzialmente o totalmente scartati, controllare il file e reinserire i dati mancanti.`,
    closable: true,
    duration: 'slow',
  });
}

function showErrorUpload() {
  dispatchNotify({
    title: 'Salvataggio file',
    status: 'error',
    message: `Il salvataggio non é andato a buon fine.`,
    closable: true,
    duration: 'slow',
  });
}

export default function SubmitFileCsv(props: { clearFile: () => void }) {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const dataUploadContext = useContext<DataUploadContextModel | undefined>(
    DataUploadContext
  );
  const projectContext = useContext<ProjectInfo | undefined>(ProjectContext);
  const { projectId, enteId } = useParams();

  const handleSaveReport = useCallback(
    (
      elaboratoResponse: ElaboratoCsvResponse,
      elaboratoRequest: ElaboratoCsvRequest,
      fileName: string
    ) => {
      if (projectId && (enteId || projectContext)) {
        const { cfUtenteLoggato, codiceFiscale, codiceRuoloUtenteLoggato } =
          getUserHeaders();
        const report: RegistroAttivitaWithoutID = {
          operatore: codiceFiscale || cfUtenteLoggato,
          totaleRigheFile:
            elaboratoRequest.serviziScartati.length +
            elaboratoRequest.serviziValidati.length,
          righeScartate: elaboratoResponse.response.serviziScartati.length,
          serviziAcquisiti: elaboratoResponse.response.serviziAggiunti,
          cittadiniAggiunti: elaboratoResponse.response.cittadiniAggiunti,
          rilevazioneDiEsperienzaCompilate:
            elaboratoResponse.response.questionariAggiunti,
          idProgetto: parseInt(projectId),
          codiceRuoloUtenteLoggato,
          fileName,
        };

        return saveActivityReport(
          report,
          parseInt(projectId),
          enteId ? parseInt(enteId) : projectContext!.idEnte
        );
      }
    },
    [projectContext, projectId, enteId]
  );

  const handleSubmit = useCallback(() => {
    if (
      dataUploadContext &&
      dataUploadContext.parsedData &&
      projectId &&
      (enteId || projectContext)
    ) {
      const parsedData = dataUploadContext.parsedData;
      setIsSubmitting(true);
      let convertedFile: File;
      let activityReportId: number;
      elaborateCsv(
        dataUploadContext.parsedData,
        parseInt(projectId),
        enteId ? parseInt(enteId) : projectContext!.idEnte
      )
        .then((res) => {
          convertedFile = convertBase64ToFile(
            res.data.fileContent,
            res.data.fileName,
            'text/csv'
          );
          downloadGeneratedFile(convertedFile);
          res.data.response.serviziScartati.length > 0
            ? showErrorImport()
            : showSuccessImport();
          return handleSaveReport(res.data, parsedData, res.data.fileName);
        })
        .then((res) => {
          if (res) {
            activityReportId = res.data.id;
            return generateUploadPUActivityReport(
              activityReportId,
              convertedFile.name
            );
          }
        })
        .then((res) => {
          if (res) {
            return uploadActivityReportResume(res.data.uri, convertedFile);
          }
        })
        .then((res) => {
          if (activityReportId && res) {
            return updateActivityReportFileUploaded(activityReportId, true);
          }
        })
        .catch(() => {
          if (activityReportId) {
            showErrorUpload();
            return updateActivityReportFileUploaded(activityReportId, false);
          }
        })
        .finally(() => {
          setIsSubmitting(false);
          props.clearFile();
          if (dataUploadContext) dataUploadContext.search();
        });
    }
  }, [
    dataUploadContext?.parsedData,
    projectContext,
    props.clearFile,
    handleSaveReport,
  ]);

  return (
    <div className='row'>
      <div className='col'>
        <button
          className='btn btn-primary w-100'
          onClick={handleSubmit}
          disabled={!dataUploadContext?.parsedData}
        >
          Invia file
        </button>
      </div>
      {isSubmitting && (
        <div className='col-auto'>
          <Spinner active />
        </div>
      )}
    </div>
  );
}

import React, { useCallback, useContext, useState } from 'react';
import { ElaboratoCsvResponse } from '../../models/ElaboratoCsvResponse.model';
import { ElaboratoCsvRequest } from '../../models/ElaboratoCsvRequest.model';
import { getUserHeaders } from '../../redux/features/user/userThunk';
import {
  RegistroAttivita,
  RegistroAttivitaWithoutID,
} from '../../models/RegistroAttivita.model';
import {
  elaborateCsv,
  generateUploadPUActivityReport,
  saveActivityReport,
  updateActivityReportFileUploaded,
  uploadActivityReportResume,
} from '../../services/activityReportService';
import { convertBase64ToFile } from '../../utils/common';
import { DataUploadContextModel } from '../../models/DataUploadContext.model';
import { DataUploadContext } from '../../contexts/DataUploadContext';
import { dispatchNotify } from '../../utils/notifictionHelper';
import { ProjectInfo } from '../../models/ProjectInfo.model';
import { ProjectContext } from '../../contexts/ProjectContext';
import { useParams } from 'react-router-dom';
import LoadingModal from './LoadingModal';
import { useAppDispatch } from '../../redux/hooks';
import { closeModal, openModal } from '../../redux/features/modal/modalSlice';

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
  const dataUploadContext = useContext<DataUploadContextModel | undefined>(
    DataUploadContext
  );
  const projectContext = useContext<ProjectInfo | undefined>(ProjectContext);
  const { projectId, enteId } = useParams();
  const dispatch = useAppDispatch();
  const [lastActivityReport, setLastActivityReport] = useState<
    RegistroAttivita | undefined
  >(undefined);

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

  const handleCloseModal = useCallback(() => {
    dispatch(closeModal());
    setLastActivityReport(undefined);
  }, []);

  const handleSubmit = useCallback(() => {
    if (
      dataUploadContext &&
      dataUploadContext.parsedData &&
      projectId &&
      (enteId || projectContext)
    ) {
      dispatch(
        openModal({
          id: 'caricamento-csv',
          payload: {
            title: ``,
          },
        })
      );
      const parsedData = dataUploadContext.parsedData;
      let convertedFile: File;
      let activityReportId: number;
      let savedActivityReport: RegistroAttivita;
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
          return handleSaveReport(res.data, parsedData, res.data.fileName);
        })
        .then((res) => {
          if (res) {
            savedActivityReport = res.data;
            activityReportId = savedActivityReport.id;
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
        .catch(() => {
          handleCloseModal();
        })
        .finally(() => {
          props.clearFile();
          if (dataUploadContext) dataUploadContext.search();
          if (savedActivityReport) setLastActivityReport(savedActivityReport);
        });
    }
  }, [
    dataUploadContext?.parsedData,
    projectContext,
    props.clearFile,
    handleSaveReport,
    handleCloseModal,
  ]);

  return (
    <>
      <div className='text-center mb-2'>
        <p className='font-weight-semibold text-primary'>
          Carica il file controllato
        </p>
      </div>
      <button
        className='btn btn-primary w-100'
        onClick={handleSubmit}
        disabled={!dataUploadContext?.parsedData}
      >
        Carica
      </button>
      <LoadingModal
        activityReport={lastActivityReport}
        handleCloseModal={handleCloseModal}
      />
    </>
  );
}

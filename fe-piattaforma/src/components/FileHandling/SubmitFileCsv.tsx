import React, { useCallback, useContext, useState } from 'react';
import { elaborateCsv } from '../../services/activityReportService';
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
  const [activityReportUUID, setActivityReportUUID] = useState<string | undefined>(undefined);
  const [showModal, setShowModal] = useState<boolean | undefined>(undefined)

  // const handleSaveReport = useCallback(
  //   (
  //     elaboratoResponse: ElaboratoCsvResponse,
  //     elaboratoRequest: ElaboratoCsvRequest,
  //     fileName: string
  //   ) => {
  //     if (projectId && (enteId || projectContext)) {
  //       const { cfUtenteLoggato, codiceFiscale, codiceRuoloUtenteLoggato } =
  //         getUserHeaders();
  //       const report: RegistroAttivitaWithoutID = {
  //         operatore: codiceFiscale || cfUtenteLoggato,
  //         totaleRigheFile:
  //           elaboratoRequest.serviziScartati.length +
  //           elaboratoRequest.serviziValidati.length,
  //         righeScartate: elaboratoResponse.response.serviziScartati.length,
  //         serviziAcquisiti: elaboratoResponse.response.serviziAggiunti,
  //         cittadiniAggiunti: elaboratoResponse.response.cittadiniAggiunti,
  //         rilevazioneDiEsperienzaCompilate:
  //           elaboratoResponse.response.questionariAggiunti,
  //         idProgetto: parseInt(projectId),
  //         codiceRuoloUtenteLoggato,
  //         fileName,
  //       };
  //
  //       return saveActivityReport(
  //         report,
  //         parseInt(projectId),
  //         enteId ? parseInt(enteId) : projectContext!.idEnte
  //       );
  //     }
  //   },
  //   [projectContext, projectId, enteId]
  // );

  const handleCloseModal = useCallback(() => {
    dispatch(closeModal());
    setActivityReportUUID(undefined);
    setShowModal(false)
  }, []);

  const handleSubmit = useCallback(() => {
    if (
      dataUploadContext &&
      dataUploadContext.parsedData &&
      projectId &&
      (enteId || projectContext)
    ) {
      
      const dispatchPromise = dispatch(
        openModal({
          id: 'caricamento-csv',
        })
      );
      const elaborateCsvPromise = elaborateCsv(
        dataUploadContext.parsedData,
        parseInt(projectId),
        enteId ? parseInt(enteId) : projectContext!.idEnte
      );
      setShowModal(true)
      Promise.all([dispatchPromise, elaborateCsvPromise])
      .then((results) => {
        const res = results[1];
        setActivityReportUUID(res.data);
        props.clearFile();
      })
      .catch(() => 
        showErrorUpload());
  }
  }, [
    dataUploadContext?.parsedData,
    projectContext,
    props.clearFile,
    handleCloseModal,
  ]);

  const triggerSearch = useCallback(() => {
    if (dataUploadContext) {
      dataUploadContext.search();
    }
  }, [dataUploadContext]);

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
      {showModal && (
        <LoadingModal
          activityReportUUID={activityReportUUID}
          handleCloseModal={handleCloseModal}
          triggerSearch={triggerSearch}
          showModal={showModal}
        />
      )}

    </>
  );
}

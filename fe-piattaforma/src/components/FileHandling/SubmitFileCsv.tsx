import { Spinner } from 'design-react-kit';
import React, { useCallback, useContext, useState } from 'react';
import { ElaboratoCsvResponse } from '../../models/ElaboratoCsvResponse.model';
import { ElaboratoCsvRequest } from '../../models/ElaboratoCsvRequest.model';
import { hideLoader, showLoader } from '../../redux/features/app/appSlice';
import { getUserHeaders } from '../../redux/features/user/userThunk';
import { RegistroAttivita } from '../../models/RegistroAttivita.model';
import {
  elaborateCsv,
  saveActivityReport,
} from '../../services/activityReportService';
import { convertBase64ToFile, downloadGeneratedFile } from '../../utils/common';
import { useAppDispatch } from '../../redux/hooks';
import { DataUploadContextModel } from '../../models/DataUploadContext.model';
import { DataUploadContext } from '../../contexts/DataUploadContext';
import { dispatchNotify } from '../../utils/notifictionHelper';
import { ProjectInfo } from '../../models/ProjectInfo.model';
import { ProjectContext } from '../../contexts/ProjectContext';

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

export default function SubmitFileCsv(props: { clearFile: () => void }) {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  const dataUploadContext = useContext<DataUploadContextModel | undefined>(
    DataUploadContext
  );
  const projectContext = useContext<ProjectInfo | undefined>(ProjectContext);

  const handleSaveReport = useCallback(
    (
      elaboratoResponse: ElaboratoCsvResponse,
      elaboratoRequest: ElaboratoCsvRequest
    ) => {
      dispatch(showLoader());
      const {
        cfUtenteLoggato,
        codiceFiscale,
        idEnte,
        codiceRuoloUtenteLoggato,
      } = getUserHeaders();
      if (projectContext) {
        const report: RegistroAttivita = {
          operatore: codiceFiscale || cfUtenteLoggato,
          totaleRigheFile:
            elaboratoRequest.serviziScartati.length +
            elaboratoRequest.serviziValidati.length,
          righeScartate: elaboratoResponse.response.serviziScartati.length,
          serviziAcquisiti: elaboratoResponse.response.serviziAggiunti,
          cittadiniAggiunti: elaboratoResponse.response.cittadiniAggiunti,
          rilevazioneDiEsperienzaCompilate:
            elaboratoResponse.response.questionariAggiunti,
          idProgetto: parseInt(projectContext.id),
          idEnte,
          codiceRuoloUtenteLoggato,
        };

        saveActivityReport(report, parseInt(projectContext.id))
          .then(() => {
            if (dataUploadContext) dataUploadContext.search();
          })
          .finally(() => {
            dispatch(hideLoader());
            props.clearFile();
          });
      }
    },
    [dataUploadContext, dispatch, projectContext]
  );

  const handleSubmit = useCallback(() => {
    if (dataUploadContext && dataUploadContext.parsedData && projectContext) {
      const parsedData = dataUploadContext.parsedData;
      setIsSubmitting(true);
      elaborateCsv(dataUploadContext.parsedData, parseInt(projectContext.id))
        .then((res) => {
          const convertedFile = convertBase64ToFile(
            res.data.fileContent,
            res.data.fileName,
            'text/csv'
          );
          downloadGeneratedFile(convertedFile);
          res.data.response.serviziScartati.length > 0
            ? showErrorImport()
            : showSuccessImport();
          handleSaveReport(res.data, parsedData);
        })
        .finally(() => setIsSubmitting(false));
    }
  }, [dataUploadContext?.parsedData, projectContext]);

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

import React, { useCallback, useContext } from 'react';
import { Spinner } from 'design-react-kit';
import { useCSVProcessor } from '../../hooks/useCSVProcessor';
import { DataUploadContext } from '../../contexts/DataUploadContext';
import { dispatchNotify } from '../../utils/notifictionHelper';
import checkImg from './../../../public/assets/img/icon-check-no-circle.png';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { closeModal, openModal } from '../../redux/features/modal/modalSlice';
import { selectProfile } from '../../redux/features/user/userSlice';
import { mapRule } from '../../utils/csvUtils';
import WarningModal from './WarningModal';
import { ProjectContext } from '../../contexts/ProjectContext';

type CSVProcessorProps = {
  file: File | undefined;
  clearFile: () => void;
};

function showSuccess() {
  dispatchNotify({
    title: 'Elaborazione file',
    status: 'success',
    message: 'Elaborazione del file completata con successo',
    closable: true,
    duration: 'slow',
  });
}

function showError(error: Error) {
  dispatchNotify({
    title: 'Elaborazione file',
    status: 'error',
    message: error.message,
    closable: true,
    duration: 'slow',
  });
}

export default function ProcessFileCsv({ file, clearFile }: CSVProcessorProps) {
  const { isProcessing, processCSV } = useCSVProcessor(file);
  const dataUploadContext = useContext(DataUploadContext);
  const dispatch = useAppDispatch();
  const { codiceRuolo: userRole } = useAppSelector(selectProfile) || {};
  const projectContext = useContext(ProjectContext);

  const handleProcessCSV = useCallback(() => {
    processCSV()
      .then((data) => {
        if (dataUploadContext) {
          dataUploadContext.setParsedData(data);
        }
        showSuccess();
      })
      .catch((error) => {
        showError(error);
      });
  }, [processCSV, dataUploadContext]);

  const showConfirmDialog = useCallback(() => {
    if (userRole !== 'DTD') {
      dispatch(
        openModal({
          id: 'dataUpload',
          payload: {
            title: `Avviso`,
          },
        })
      );
    }
  }, [userRole]);

  const handleAccept = useCallback(() => {
    dispatch(closeModal());
    handleProcessCSV();
  }, [handleProcessCSV]);

  const handleReject = useCallback(() => {
    clearFile();
    dispatch(closeModal());
  }, [clearFile]);

  return (
    <>
      <WarningModal
        id='dataUpload'
        onClose={handleReject}
        onConfirm={handleAccept}
      >
        Stai operando in qualità di {userRole ? mapRule.get(userRole) : ''}{' '}
        dell'ente {projectContext?.nomeEnte} per il progetto{' '}
        {projectContext?.nomeBreve}. Ricorda: puoi caricare{' '}
        <strong>solo i dati dei servizi effettivamente erogati</strong> presso
        le sedi del tuo ente e
        <strong> sei responsabile della loro veridicità.</strong>
        <br></br>Confermi di voler procedere?
      </WarningModal>

      <div className='text-center mb-2'>
        <p className='font-weight-semibold text-primary'>
          {dataUploadContext?.parsedData ? (
            <div className='d-flex align-items-center justify-content-center gap-2'>
              <div
                className='bg-primary rounded-circle mx-2'
                style={{ width: '32px', height: '32px' }}
              >
                <img src={checkImg} alt='' width={16} height={16} />
              </div>
              File controllato
            </div>
          ) : (
            <>Controlla il file</>
          )}
        </p>
      </div>

      <button
        className='btn btn-secondary w-100'
        onClick={showConfirmDialog}
        disabled={!!dataUploadContext?.parsedData}
      >
        Controlla
      </button>
      {isProcessing && <Spinner active />}
    </>
  );
}

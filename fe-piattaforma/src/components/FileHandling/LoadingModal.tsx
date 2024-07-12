import GenericModal from '../Modals/GenericModal/genericModal';
import React, { useCallback, useEffect, useState } from 'react';
import { Spinner } from 'design-react-kit';
import { RegistroAttivita } from '../../models/RegistroAttivita.model';
import greenCheckCircle from '../../../public/assets/img/green-check-circle.png';
import uploadIcon from '../../../public/assets/img/it-upload-primary.png';
import errorIcon from '../../../public/assets/img/it-report.png';
import { downloadResume } from '../../utils/csvUtils';
import { checkActivityReportStatus } from '../../services/activityReportService';

export default function LoadingModal(props: {
  handleCloseModal: () => void;
  activityReportUUID: string | undefined;
  triggerSearch: () => void;
}) {
  const [savedActivityReport, setSavedActivityReport] = useState<
    RegistroAttivita | undefined | null
  >(undefined);
  const handleDownloadResume = useCallback(() => {
    if (savedActivityReport) downloadResume(savedActivityReport);
  }, [savedActivityReport]);

  useEffect(() => {
    let interval: NodeJS.Timer;
    if (props.activityReportUUID && savedActivityReport === undefined) {
      interval = setInterval(handleActivityReportPolling, 10000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [props.activityReportUUID, savedActivityReport]);

  const handleActivityReportPolling = useCallback(() => {
    if (props.activityReportUUID) {
      checkActivityReportStatus(props.activityReportUUID)
        .then((result) => {
          if (result.data && result.data.jobStatus === 'SUCCESS') {
            setSavedActivityReport(result.data);
            props.triggerSearch();
          }
        })
        .catch(() => {
          setSavedActivityReport(null);
        });
    }
  }, [props.activityReportUUID, props.triggerSearch]);

  return (
    <GenericModal
      id='caricamento-csv'
      centerButtons
      showCloseBtn={savedActivityReport ? true : false}
      onCloseFromHeader={savedActivityReport ? props.handleCloseModal : () => {}}
      onClose={savedActivityReport ? props.handleCloseModal : () => {}}
      modalBodyClassNames='no-overflow-modal'
      closableKey={savedActivityReport ? 'unclosable' : undefined}
    >
      <div className='d-flex flex-column align-items-center my-4 p-4 text-secondary'>
        {props.activityReportUUID && savedActivityReport !== null ? (
          savedActivityReport ? (
            <>
              <img
                className='success-upload-modal'
                src={greenCheckCircle}
                alt=''
              />
              <div className='my-4 text-center'>
                <p className='h5'>Caricamento completato con successo!</p>
              </div>
              <div className='row csv-resume-gap success-upload-info justify-content-center'>
                <div className='mx-4'>
                  <p>
                    TOTALE RIGHE:{' '}
                    <strong>{savedActivityReport.totaleRigheFile}</strong>
                  </p>
                  <p>
                    RIGHE SCARTATE:{' '}
                    <strong>{savedActivityReport.righeScartate}</strong>
                  </p>
                </div>
                <div className='mx-4'>
                  <p>
                    SERVIZI CARICATI:{' '}
                    <strong>{savedActivityReport.serviziAcquisiti}</strong>
                  </p>
                  <p>
                    CITTADINI BENEFICIARI:{' '}
                    <strong>{savedActivityReport.cittadiniAggiunti}</strong>
                  </p>
                </div>
              </div>
              <div className='my-4 d-flex flex-column align-items-center'>
                <p>
                  Scarica il report delle righe che non é stato possibile
                  acquisire durante il caricamento
                </p>
                <button
                  className='btn p-0 ml-4 text-primary-action'
                  onClick={handleDownloadResume}
                >
                  <img className='delete-csv-btn-img' src={uploadIcon} alt='' />
                  Report righe scartate
                </button>
              </div>
            </>
          ) : (
            <>
              <Spinner active />
              <div className='my-4 text-center text-primary font-weight-semibold'>
                <p>Caricamento in corso</p>
                <p>L'operazione potrebbe richiedere alcuni minuti</p>
                <div className='my-2 mx-auto'>
                  <p className='text-secondary font-weight-normal'>
                    Attendi l'esito dell'operazione per consultare il{' '}
                    <strong>report</strong> oppure chiudi la finestra e consulta
                    il
                    <strong> report</strong> al termine dell'operazione nel
                    registro caricamenti
                  </p>
                </div>
              </div>
            </>
          )
        ) : (
          <>
            <img src={errorIcon} alt='' />
            <p className='text-center my-2'>
              Si é verificato un errore, si prega di riprovare.
            </p>
          </>
        )}
      </div>
    </GenericModal>
  );
}

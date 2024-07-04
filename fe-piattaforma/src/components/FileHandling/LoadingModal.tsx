import GenericModal from '../Modals/GenericModal/genericModal';
import React, { useCallback } from 'react';
import { Spinner } from 'design-react-kit';
import { RegistroAttivita } from '../../models/RegistroAttivita.model';
import greenCheckCircle from '../../../public/assets/img/green-check-circle.png';
import uploadIcon from '../../../public/assets/img/it-upload-primary.png';
import { downloadResume } from '../../utils/csvUtils';

export default function LoadingModal(props: {
  activityReport: RegistroAttivita | undefined;
  handleCloseModal: () => void;
}) {
  const handleDownloadResume = useCallback(() => {
    if (props.activityReport) downloadResume(props.activityReport);
  }, [props.activityReport]);
  return (
    <GenericModal
      id='caricamento-csv'
      centerButtons
      showCloseBtn={props.activityReport ? true : false}
      onCloseFromHeader={props.activityReport ? props.handleCloseModal : () => {}}
      onClose={props.activityReport ? props.handleCloseModal : () => {}}
      //modalBodyClassNames='no-overflow-modal'
      closableKey={props.activityReport ? 'unclosable' : undefined}
    >
      {props.activityReport ? (
        <div className='d-flex flex-column align-items-center my-4 p-4 text-secondary'>
          <img className='success-upload-modal' src={greenCheckCircle} alt='' />
          <div className='my-4 text-center'>
            <p className='h5'>Caricamento completato con successo!</p>
          </div>
          <div className='row csv-resume-gap success-upload-info justify-content-center'>
            <div className='mx-4'>
              <p>
                TOTALE RIGHE:{' '}
                <strong>{props.activityReport.totaleRigheFile}</strong>
              </p>
              <p>
                RIGHE SCARTATE:{' '}
                <strong>{props.activityReport.righeScartate}</strong>
              </p>
            </div>
            <div className='mx-4'>
              <p>
                SERVIZI CARICATI:{' '}
                <strong>{props.activityReport.serviziAcquisiti}</strong>
              </p>
              <p>
                CITTADINI BENEFICIARI:{' '}
                <strong>{props.activityReport.cittadiniAggiunti}</strong>
              </p>
            </div>
          </div>
          <div className='my-4 d-flex flex-column align-items-center'>
            <p>
              Scarica il report delle righe che non é stato possibile acquisire
              durante il caricamento
            </p>
            <button
              className='btn p-0 ml-4 text-primary-action'
              onClick={handleDownloadResume}
            >
              <img className='delete-csv-btn-img' src={uploadIcon} alt='' />
              Report righe scartate
            </button>
          </div>
        </div>
      ) : (
        <div className='d-flex flex-column align-items-center my-4 p-4 text-secondary'>
          <Spinner active />
          <div className='my-4 text-center'>
            <p className='h5'>Caricamento in corso</p>
            <p className='h5'>L'operazione potrebbe richiedere alcuni minuti</p>
          </div>
        </div>
      )}
    </GenericModal>
  );
}

import React, { useCallback } from 'react';
import uploadIcon from '../../../public/assets/img/it-upload-primary.png';
import { downloadCSVGuide } from '../../services/activityReportService';
import { dispatchNotify } from '../../utils/notifictionHelper';

function showErrorDownloadGuide() {
  dispatchNotify({
    title: 'Guida utente',
    status: 'error',
    message: 'Impossibile scaricare il file, permessi mancanti',
    closable: true,
    duration: 'slow',
  });
}
export default function CsvInstructions() {
  const onDownloadGuide = useCallback(() => {
    downloadCSVGuide().catch(() => {
      showErrorDownloadGuide();
    });
  }, []);


  return (
    <div className='d-flex flex-column'>
      <h1 className='h5 text-black font-weight-semibold'>
        Come caricare i dati in modo massivo
      </h1>
      <ol className='ml-3 csv-instruction-list'>
        <li>
          <p>
            <strong>
              Trascina o seleziona il file dei dati in formato CSV
            </strong>{' '}
            per inserirlo nello strumento di caricamento massivo.
          </p>
        </li>
        <li>
          <p>
            <strong>Seleziona il pulsante "Controlla"</strong> per consentire il
            controllo formale del file da parte del sistema e l'anonimizzazione
            dei dati dei cittadini.
          </p>
        </li>
        <li>
          <p>
            <strong>Seleziona il pulsante "Carica"</strong> per avviare il
            caricamento del file controllato.
          </p>
        </li>
        <li>
          <p>
            <strong>Scarica il report</strong> delle righe scartate, cioè le
            righe del file che non è stato possibile acquisire per lacune o
            incoerenze nei dati.
          </p>
        </li>
      </ol>
      <hr />
      <div>
        <p className='text-secondary mb-2'>
          Scarica il manuale e consulta i dettagli su come caricare un nuovo
          file e leggere il registro dei caricamenti.
        </p>
        <a
          href="https://s3-mitd-drupal-prod.s3.eu-central-1.amazonaws.com/public/2024-06/Guida_Operativa_Caricamento_Dati_17186481766690424010.pdf?versionId=4inbSdqj3DYQ4gcKM3TlaldlGFxIfqyy&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIA6RGETSJQ7K6J4KNR%2F20240618%2Feu-central-1%2Fs3%2Faws4_request&X-Amz-Date=20240618T043638Z&X-Amz-SignedHeaders=host&X-Amz-Expires=7200&X-Amz-Signature=631b8710c7faa27ffaa47869924abe6647828fc245f389d64fb1067884307762"
          target="_blank"
          rel="noreferrer"
          className='btn p-0 text-primary-action'
        >
          <img className='delete-csv-btn-img mr-2' src={uploadIcon} alt='' />
          Scarica la guida operativa (PDF)
        </a>
      </div>
    </div>
  );
}

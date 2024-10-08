import React from 'react';
import uploadIcon from '../../../public/assets/img/it-upload-primary.png';
import { selectProjects } from '../../redux/features/administrativeArea/administrativeAreaSlice';
import { useAppSelector } from '../../redux/hooks';
import { policy } from '../../pages/administrator/AdministrativeArea/Entities/utils';

export default function CsvInstructions({ urlGuida, attachmentGuida }: { urlGuida: string | "" , attachmentGuida: any}) {
  const projectDetail = useAppSelector(selectProjects).detail?.dettagliInfoProgetto;
  const fileInputConsentito = projectDetail?.policy === policy.RFD ? 'CSV' : 'EXCEL';
  return (
    <div className='d-flex flex-column'>
      <h1 className='h5 text-black font-weight-semibold'>
        Come caricare i dati in modo massivo
      </h1>
      <ol className='ml-3 csv-instruction-list'>
        <li>
          <p>
            <strong>
              Trascina o seleziona il file dei dati in formato {fileInputConsentito}
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
        <p>
          <strong>Attenzione:</strong> una volta individuati e corretti i problemi 
          segnalati nel file di scarti, dovrai predisporre un nuovo file contenente  
          <strong> le sole righe scartate e rettificate</strong> prima di procedere a 
          un nuovo caricamento seguendo gli stessi step descritti in precedenza.
        </p>


      <hr />
      <div>
        <p className='text-secondary mb-2'>
          Scarica il manuale e consulta i dettagli su come caricare un nuovo
          file e leggere il registro dei caricamenti.
        </p>
        <a
          href={urlGuida == "" ? undefined : urlGuida}
          target='_blank'
          className='btn p-0 text-primary-action'
          onClick={attachmentGuida}
        >
          <img className='delete-csv-btn-img mr-2' src={uploadIcon} alt='' />
          Scarica la guida operativa (PDF)
        </a>
      </div>
    </div>
  );
}

import React from 'react';
export default function CsvInstructions() {
  return (
    <div className='d-flex flex-column'>
      <h1 className='h5 text-black'>Come caricare i dati in modo massivo</h1>
      <ol className='ml-3'>
        <li>
          <p><strong>Trascina o seleziona il file dei dati in formato CSV</strong> per inserirlo nello strumento di caricamento massivo.</p>
        </li>
        <li>
          <p><strong>Seleziona il pulsante "Controlla"</strong> per consentire il controllo formale del file da parte del sistema e l'anonimizzazione dei dati dei cittadini.</p>
        </li>
        <li>
          <p><strong>Seleziona il pulsante "Carica"</strong> per avviare il caricamento del file controllato.</p>
        </li>
        <li>
          <p><strong>Scarica il report</strong> delle righe scartate, cioè le righe del file che non è stato possibile acquisire per lacune o incoerenze nei dati.</p>
        </li>
      </ol>
      <hr />
      <p className='text-secondary'>
        Scarica il manuale e consulta i dettagli su come caricare un nuovo file e leggere il registro dei caricamenti.
      </p>
    </div>
  );
}

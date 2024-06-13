import React from 'react';
export default function CsvInstructions() {
  return (
    <div className='d-flex flex-column'>
      <h1 className='h5 text-black'>Guida per il caricamento del CSV</h1>
      <ol className='ml-3'>
        <li>
          <p>Inserisci o trascina il tuo file CSV.</p>
        </li>
        <li>
          <p>Clicca 'Elabora file' una volta caricato il file.</p>
        </li>
        <li>
          <p>Clicca 'Invia file' dopo l'elaborazione.</p>
        </li>
      </ol>
      <hr />
      <p className='text-secondary'>
        N.B. Una volta effettuato l'invio del file CSV é possibile che alcuni
        servizi vengano rifiutati, in tal caso verrá scaricato automaticamente
        un file contenente tutti i servizi scartati ed una colonna 'Note'
        contenente il motivo di tale scarto.
      </p>
    </div>
  );
}

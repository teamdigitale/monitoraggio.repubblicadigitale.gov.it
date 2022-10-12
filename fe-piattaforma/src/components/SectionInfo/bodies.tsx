export const surveyBody = `
      <p style= "padding-bottom: 24px" >
      Questa sezione consente di gestire i questionari da erogare ai
      cittadini. Ogni questionario caricato sulla piattaforma presenta le
      seguenti informazioni:
    </p>
    <ul class="section-info-list" style="padding-bottom: 24px; padding-left: 24px">
      <li>
        <strong> Nome </strong>
      </li>
      <li>
        <strong> Data ultima modifica </strong>
      </li>
      <li>
        <strong> Default SCD: </strong>
        pulsante interruttore che, se selezionato, indica che il
         questionario sa associabile di default a tutti
          i programmi dell'intervento SCD
      </li>
      <li>
        <strong> ID </strong>
      </li>
      <li>
        <strong> Stato </strong>
      </li>
      <li>
        <strong> Default RFD: </strong>
        pulsante interruttore che, se selezionato,
         indica che il questionario sarà associabile
          di default a tutti i programmi dell'intervento RFD.
      </li>
    </ul>
    <p>
      In base ai permessi assegnati all'utente,
       è possibile visualizzare il dettaglio del
        questionario oppure modificarlo e duplicarlo. 
    </p>
      `;

export const openDataBody = (dateCoverage: string, lastDate: string) => (`
<ul class="section-info-list" style="padding-bottom: 24px; padding-left: 24px;">
<li >
  <strong>Nome Dataset: 
  </strong> Statistiche del Piano Operativo per le Competenze Digitali
</li>
<li style="max-width: 300px">
  <strong> Copertura temporale:  </strong> ${dateCoverage}
</li>
<li >
  <strong> Data ultima pubblicazione: 
  </strong>
  ${lastDate}
</li>
<li>
  <strong>Periodicita' rilevazione: 
  </strong> Mensile
</li>
<li>
  <strong> Copertura geografica: 
  </strong> Nazionale
</li>
<li>
  <strong> Licenza: 
  </strong><a href="https://www.dati.gov.it/content/italian-open-data-license-v20" target="_blank">Italian Open Data License v2.0</a>
</li>
</ul>
`);

export const openDataSubtitle = `
<p class='text-muted' style='padding-bottom: 24px;'>
Allo scopo di incrementare le competenze digitali dei cittadini, nell'ambito di <strong>Repubblica Digitale</strong> sono previsti servizi di facilitazione e formazione, organizzati a livello nazionale e con sedi distribuite in tutto il Paese. 
In relazione a questi servizi, sono rilevate le principali caratteristiche della popolazione partecipante e la tipologia di servizio erogato.
</p>
`;

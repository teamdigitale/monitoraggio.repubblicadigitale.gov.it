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

export const surveyDocumentBody = `
  <div style= "color: #001A33; opacity: 0.7; padding-left: 16px">
    <p>
      Lorem ipsum dolor sit amet, <b>consectetur adipiscing elit.</b> Duis ultrices laoreet justo id sagittis. 
      Integer consequat odio libero, at aliquet nibh dapibus sed. Curabitur vehicula lectus quis massa eleifend tristique. 
      Mauris viverra aliquet orci, sed pretium urna pretium ac. Sed non orci quis lectus feugiat convallis. 
      Vivamus blandit facilisis ante quis gravida.
    </p><br>
    <p>
      Nam ultrices <b><u>ultricies elementum</u>.</b> Etiam tincidunt maximus orci, sed accumsan arcu. 
      Nulla interdum, eros et faucibus vehicula, nibh magna molestie sapien, et aliquam magna dui in turpis.
    </p><br>
    <p>
      Cras a dapibus nunc, ut faucibus ante. 
      Fusce volutpat, massa eu laoreet faucibus, libero tortor posuere arcu, id tincidunt sapien neque et mauris. 
      Morbi lacus nisl, tempus ut pharetra quis, tempus at elit.
    </p><br>
    <p>
      Suspendisse sed facilisis nisl. Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
      <b>Vestibulum convallis sapien quis finibus lacinia.</b>
    </p><br>
  </div>`;

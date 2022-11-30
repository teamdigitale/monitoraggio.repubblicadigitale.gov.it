export const surveyBody = `
      <p style= "padding-bottom: 24px" >
      Questa sezione consente di gestire i questionari da erogare ai
      cittadini. Ogni questionario caricato sulla piattaforma presenta le
      seguenti informazioni:
    </p>
    <ul style="padding-bottom: 24px; padding-left: 24px">
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

export const openDataBody = (dateCoverage: string, lastDate: string) => `
<ul style="padding-bottom: 24px; padding-left: 24px;">
<li >
  <strong>Nome Dataset: 
  </strong> Servizi di facilitazione e formazione
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
`;

export const openDataSubtitle = `
<p class='text-muted' style='padding-bottom: 24px;'>
Allo scopo di incrementare le competenze digitali dei cittadini, nell'ambito di <strong>Repubblica Digitale</strong> sono previsti servizi di facilitazione e formazione, organizzati a livello nazionale e con sedi distribuite in tutto il Paese. 
In relazione a questi servizi, sono rilevate le principali caratteristiche della popolazione partecipante e la tipologia di servizio erogato.
</p>
`;

export const accessibilitySubtitle = `<p class='text-muted pb-4'>Il Dipartimento per la trasformazione digitale si impegna a rendere il proprio sito web accessibile, conformemente al <a href="https://www.gazzettaufficiale.it/eli/id/2018/09/11/18G00133/sg" target="_blank">D.lgs 10 agosto 2018, n. 106</a> che ha recepito la <a href="https://eur-lex.europa.eu/legal-content/IT/TXT/?uri=CELEX%3A32016L2102" target="_blank">direttiva UE 2016/2102</a> del Parlamento europeo e del Consiglio.</p>
<p class="pb-4"><a href="https://form.agid.gov.it/" target="_blank">Dichiarazione di accessibilità</a></p>`;

export const accessibilityBody = `<h2 class="h4 primary-color-a9 border-bottom w-100 pb-2">Feedback e recapiti</h2>
<p class="ml-0 py-2">Per inviare segnalazioni su casi di mancata conformità ai requisiti di accessibilità scrivere alla casella di posta elettronica <a href="mailto:accessibilita@repubblicadigitale.gov.it">accessibilita@repubblicadigitale.gov.it</a></p>
<div class="d-flex flex-column align-items-start"><p class="ml-0 py-2">Nella e-mail è necessario indicare:</p>
<ul class="mb-0 ml-3">
<li style="height: 40px">nome e cognome</li>
<li style="height: 40px">indirizzo e-mail</li>
<li style="height: 40px">url della pagina web oggetto della segnalazione</li>
<li style="height: 40px">descrizione chiara e sintetica del problema riscontrato</li>
<li style="height: 40px">strumenti utilizzati (sistema operativo, browser, tecnologie assistive)</li>
</ul></div>`;

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

export const documentsBody = `In Documenti puoi scoprire risorse utili per la gestione dei servizi a cui partecipi.<br>Utilizza l&apos;<b>Area di collaborazione</b> per lavorare in simultanea alla creazione di nuovi documenti&nbsp;<b>con altri utenti aggiungendo il loro indirizzo email</b>. Hai a disposizione fino a&nbsp;<b>1 Giga di spazio</b>&nbsp;per caricare e condividere file in formato doc, docx, xls, .xlsx, ppt e pptx. Per accedere dopo esserti registrato, utilizza il&nbsp;<b>tuo indirizzo email come username</b>.`;

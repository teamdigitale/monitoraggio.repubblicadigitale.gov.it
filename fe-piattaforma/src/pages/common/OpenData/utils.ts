import { TableHeadingI } from '../../../components/Table/table';

export const TableHeading: TableHeadingI[] = [
  {
    label: 'Attributo',
    field: 'attributo',
    size: 'medium',
  },
  {
    label: 'Tipo',
    field: 'attributo_tipo',
    size: 'small',
  },
  {
    label: 'Descrizione',
    field: 'descrizione',
    size: 'medium',
  },
  {
    label: 'Tipo',
    field: 'descrizione_tipo',
    size: 'medium',
  },
];

export const staticValues = [
  {
    attributo: 'GENERE',
    attributo_tipo: 'string',
    descrizione: 'È il genere del cittadino',
    descrizione_tipo: 'Donna, Uomo, Non binario',
  },
  {
    attributo: 'TITOLO_DI_STUDIO',
    attributo_tipo: 'string',
    descrizione:
      'È il titolo di studio massimo più alto raggiunto dal cittadino',
    descrizione_tipo:
      'Licenza elementare / Scuola primaria, Licenza media inferiore / Scuola secondaria di I grado (3 anni), Diploma di scuola superiore (diploma di maturità) / Scuola secondaria di II grado (5 anni), Diploma professionale (3 anni) / Istituti professionali / Istituti di Istruzione e Formazione Professionale (IeFP), Laurea (3 anni), Laurea magistrale (5 anni) / Master di I livello / Specializzazione post-laurea (2 anni), Dottorato, Master di II livello o titoli equiparati, Non conosciuto / non fornito / Altro',
  },
  {
    attributo: 'ANNO_DI_NASCITA',
    attributo_tipo: 'string',
    descrizione: "È l'anno di nascita del cittadino",
    descrizione_tipo: '-',
  },
  {
    attributo: 'OCCUPAZIONE',
    attributo_tipo: 'string',
    descrizione: 'È lo stato occupazionale del cittadino ',
    descrizione_tipo:
      'Dipendente a tempo indeterminato, Dipendente a tempo determinato, Imprenditore, Libero professionista, Commerciante/artigiano, Inoccupato/a, Disoccupato/a, Volontario/a, Studente o studentessa / in formazione, Persona ritirata dal lavoro / Pensionato/a, Casalinga/o, Inabile al lavoro, Altro',
  },
  {
    attributo: 'REGIONE',
    attributo_tipo: 'string',
    descrizione:
      'È la regione dove viene erogato il servizio di facilitazione/formazione al cittadino ',
    descrizione_tipo: '-',
  },
  {
    attributo: 'PROVINCIA',
    attributo_tipo: 'string',
    descrizione:
      'È la provincia dove viene erogato il servizio di facilitazione/formazione al cittadino ',
    descrizione_tipo: '-',
  },
  {
    attributo: 'COMUNE',
    attributo_tipo: 'string',
    descrizione:
      'È il comune dove viene erogato il servizio di facilitazione/formazione al cittadino ',
    descrizione_tipo: '-',
  },
  {
    attributo: 'CAP',
    attributo_tipo: 'string',
    descrizione:
      'È il codice di avviamento postale che identifica il comune dove viene erogato il servizio di facilitazione/formazione al cittadino  ',
    descrizione_tipo: '-',
  },
  {
    attributo: 'SEDE_ID',
    attributo_tipo: 'string',
    descrizione:
      'È un codice interno che identifica univocamente la sede che eroga il servizio di...',
    descrizione_tipo: '-',
  },
  {
    attributo: 'NOME_SEDE',
    attributo_tipo: 'string',
    descrizione:
      'È il nome della sede presso la quale viene erogato il servizio di ...',
    descrizione_tipo: '-',
  },
  {
    attributo: 'TIPOLOGIA-SERVIZIO',
    attributo_tipo: 'string',
    descrizione: 'È il tipo di servizio prenotato dal cittadino',
    descrizione_tipo:
      'Facilitazione, Formazione in presenza, Formazione online, Utilizzo postazione/ Dispositivi digitali, Altro',
  },
  {
    attributo: 'SERVIZIO_ID',
    attributo_tipo: 'string',
    descrizione:
      'È un codice interno che identifica univocamente il servizio erogato',
    descrizione_tipo: '-',
  },
  {
    attributo: 'NOME_SERVIZIO',
    attributo_tipo: 'string',
    descrizione: 'È il nome del servizio erogato al cittadino ',
    descrizione_tipo: '-',
  },
  {
    attributo: 'COMPETENZE_TRATTATE',
    attributo_tipo: 'string',
    descrizione:
      "Sono l'insieme delle competenze oggetto del servizio erogato al cittadino",
    descrizione_tipo:
      'Alfabetizzazione su informazioni e dati, Comunicazione e collaborazione, Creazione di contenuti digitali, Sicurezza, Risolvere i problemi tecnici',
  },
  {
    attributo: 'AMBITO_SERVIZI_PUBBLICI_DIGITALI',
    attributo_tipo: 'string',
    descrizione:
      "Sono l'insieme degli ambiti dei servizi pubblici digitali oggetto del servizio erogato al cittadino ",
    descrizione_tipo:
      "App IO, Sistemi di pagamenti elettronici (pagoPA), Servizi anagrafici tramite ANPR, Fascicolo sanitario elettronico, Fatturazione elettronica, Cultura e turismo, Istruzione, Formazione, Sport, Servizi di sostegno all'occupazione, Commercio e impresa, Servizi previdenziali e assistenziali, Servizi sanitari diversi da FSE Adempimenti fiscali, Servizi tributari e contravvenzioni, Urbanistica ed edilizia, Infrastrutture e mobilità , Utilizzo di piattaforme di partecipazione, Nessuna delle precedenti",
  },
  {
    attributo: 'ID_PROGRAMMA',
    attributo_tipo: 'string',
    descrizione:
      'È un codice interno che identifica il programma per cui si eroga il servizio di facilitazione/ formazione',
    descrizione_tipo: '-',
  },
  {
    attributo: 'INTERVENTO',
    attributo_tipo: 'string',
    descrizione:
      'È il tipo di intervento a cui sono associati i servizi di facilitazione/ formazione erogati',
    descrizione_tipo: 'RFD, SCD',
  },
  {
    attributo: 'ID_PROGETTO',
    attributo_tipo: 'string',
    descrizione:
      'È un codice interno che identifica il progetto per cui si eroga il servizio di facilitazione/ formazione',
    descrizione_tipo: '-',
  },
];

import { TableHeadingI, TableRowI } from '../../../../components/Table/table';
import { CRUDActionsI } from '../../../../utils/common';

export const dayOfWeek = [
  'Lunedì',
  'Martedì',
  'Mercoledì',
  'Giovedì',
  'Venerdì',
  'Sabato',
  'Domenica',
];

export const dayCode = ['lun', 'mar', 'mer', 'gio', 'ven', 'sab', 'dom'];

export const TableHeading: TableHeadingI[] = [
  {
    label: 'Nome',
    field: 'label',
    size: 'medium',
  },
  {
    label: 'ID',
    field: 'id',
    size: 'medium',
  },
  {
    field: 'policy',
    label: 'Intervento',
    size: 'small',
  },
  {
    field: 'enteGestore',
    label: 'Ente gestore',
    size: 'medium',
  },
  {
    label: 'Stato',
    field: 'status',
    size: 'medium',
  },
];

export const TableCategories: TableHeadingI[] = [
  {
    label: 'Categoria',
    field: 'label',
    size: 'medium',
  },
  {
    label: 'Sezione',
    field: 'section',
    size: 'medium',
  },
];

export const TableHeadingUsers: TableHeadingI[] = [
  {
    label: 'Cognome e Nome',
    field: 'label',
    size: 'medium',
  },
  {
    label: 'ID',
    field: 'id',
    size: 'medium',
  },
  {
    label: 'Stato Utente',
    field: 'status',
    size: 'medium',
  },
  {
    label: 'Ruolo',
    field: 'role',
    size: 'medium',
  },
];

export const TableHeadingQuestionnaires: TableHeadingI[] = [
  {
    label: 'Nome questionario',
    field: 'nome',
    size: 'auto',
  },
  {
    label: 'ID',
    field: 'idShort',
    size: 'small',
  },
  {
    label: 'Data ultima modifica',
    field: 'dataUltimaModifica',
    size: 'auto',
  },
  {
    label: 'Stato',
    field: 'status',
    size: 'auto',
  },
  {
    label: 'Default SCD',
    field: 'defaultSCD',
    size: 'auto',
  },
  {
    label: 'Default RFD',
    field: 'defaultRFD',
    size: 'auto',
  },
];

export const TableHeadingQuestionnairesLite: TableHeadingI[] = [
  {
    label: 'Nome questionario',
    field: 'nome',
    size: 'auto',
  },
  {
    label: 'ID',
    field: 'idShort',
    size: 'medium',
  },
  {
    label: 'Data ultima modifica',
    field: 'dataUltimaModifica',
    size: 'auto',
  },
  {
    label: 'Stato',
    field: 'status',
    size: 'auto',
  },
];

export const TableHeadingEntities: TableHeadingI[] = [
  {
    label: 'Nome',
    field: 'nome',
    size: 'medium',
  },
  {
    label: 'ID',
    field: 'id',
    size: 'medium',
  },
  {
    label: 'Tipologia ente',
    field: 'tipologia',
    size: 'medium',
  },
  {
    label: 'Profili',
    field: 'profilo',
    size: 'medium',
  },
];

export const TableHeadingMinorenni: TableHeadingI[] = [
  {
    label: 'Nome Programma',
    field: 'nomeProgramma',
    size: 'medium',
    sort: 'nome_programma',
    direction: 'asc',
  },
  {
    label: 'Intervento',
    field: 'intervento',
    size: 'medium',
    sort: 'intervento',
    direction: 'asc',
  },
  {
    label: 'Data di Abilitazione',
    field: 'dataAbilitazione',
    size: 'small',
    sort: 'data_abilitazione',
    direction: 'asc',
  },
  {
    label: 'Data di Decorrenza',
    field: 'dataDecorrenza',
    size: 'medium',
    sort: 'data_decorrenza',
    direction: 'asc',
  },
  {
    label: 'Stato abilitazione',
    field: 'stato',
    size: 'medium',
    sort: 'data_decorrenza',
    direction: 'asc',
  },
];

export const formTypes = {
  PROGETTI: 'progetti',
  PROGRAMMA: 'programmi',
  PROGETTO: 'progetto',
  ENTE_GESTORE_PROGRAMMA: 'ente-gestore-programma',
  ENTE_GESTORE_PROGETTO: 'ente-gestore-progetto',
  ENTI_GESTORE_PROGETTO: 'enti-gestore-progetto',
  ENTI_PARTNER: 'enti-partner',
  ENTE_PARTNER: 'ente-partner',
  ENTE_GESTORE: 'ente-gestore',
  SEDI: 'sedi',
  SEDE: 'sede',
  REFERENTE: 'referente',
  REFERENTI: 'referenti',
  DELEGATO: 'delegato',
  DELEGATI: 'delegati',
  USER: 'user',
  FACILITATORE: 'facilitatore',
  VOLONTARIO: 'volontario',
  SERVICES: 'services',
  CITIZENS: 'cittadino',
  SERVICE_CITIZEN: 'cittadino-in-servizio',
  PROFILE: 'profilo',
  UTENTI: 'utenti',
};

export interface ItemListI {
  title?: string;
  items: {
    [key: string]: string | CRUDActionsI | TableRowI;
  }[];
}

export interface AccordionItemListI {
  title?: string;
  items: {
    [key: string]: string | CRUDActionsI | TableRowI;
  }[];
}

export const entityStatus = {
  ATTIVO: 'ATTIVO',
  ATTIVABILE: 'ATTIVABILE',
  NON_ATTIVO: 'NON ATTIVO',
  TERMINATO: 'TERMINATO',
  TERMINABILE: 'TERMINABILE',
  ELIMINATO: 'ELIMINATO',
  CANCELLATO: 'CANCELLATO',
};

export const userRoles = {
  DTD: 'DTD',
  DSCU: 'DSCU',
  REG: 'REG',
  REGP: 'REGP',
  VOL: 'VOL',
  FAC: 'FAC',
  DEG: 'DEG',
  DEGP: 'DEGP',
  REPP: 'REPP',
  DEPP: 'DEPP',
  USR: 'utenti',
  "Profilo UDM": 'Profilo UDM'
};

export const contractTypes = [
  { label: 'Volontario', value: 'Volontario' },
  { label: 'Dipendente', value: 'Dipendente' },
  {
    label: 'Collaboratore',
    value: 'Collaboratore',
  },
];

export const policy = {
  SCD: 'SCD',
  RFD: 'RFD'
};

export const statusMassivo = {
  IN_PROGRESS: "IN_PROGRESS",
  SUCCESS: "SUCCESS",
  FAIL_MONGO: "FAIL_MONGO", 
  FAIL_S3_API: "FAIL_S3_API",
  FAIL_S3_UPLOAD: "FAIL_S3_UPLOAD", 
  GENERIC_FAIL: "GENERIC_FAIL"
}

export const statusMassivoFail = {
  FAIL_MONGO: "FAIL_MONGO", 
  FAIL_S3_API: "FAIL_S3_API",
  FAIL_S3_UPLOAD: "FAIL_S3_UPLOAD", 
  GENERIC_FAIL: "GENERIC_FAIL"
}

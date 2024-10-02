import { TableHeadingI, TableRowI } from '../../../components/Table/table';
import { CRUDActionsI } from '../../../utils/common';

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
    label: 'Data',
    field: 'data',
    size: 'small',
  },
  {
    label: 'Ente',
    field: 'ente',
    size: 'medium',
  },
  {
    label: 'Intervento',
    field: 'intervento',
    size: 'small',
  },
  {
    label: 'Progetto',
    field: 'progetto',
    size: 'medium',
  },
  {
    label: 'Programma',
    field: 'programma',
    size: 'medium',
  },
  {
    label: 'Caricamenti',
    field: 'caricamenti',
    size: 'small',
  },
  {
    label: 'Servizi Caricati',
    field: 'serviziCaricati',
    size: 'medium',
  },
  {
    label: 'Cittadini Caricati',
    field: 'cittadiniCaricati',
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
    label: 'Ruolo',
    field: 'role',
    size: 'medium',
  },
  {
    label: 'Stato',
    field: 'status',
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

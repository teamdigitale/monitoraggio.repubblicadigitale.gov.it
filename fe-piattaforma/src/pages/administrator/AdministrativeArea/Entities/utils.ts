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
    label: 'Policy',
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
    field: 'label',
    size: 'auto',
  },
  {
    label: 'ID',
    field: 'id',
    size: 'small',
  },
  {
    label: 'Data ultima modifica',
    field: 'lastChangeDate',
    size: 'auto',
  },
  {
    label: 'Stato',
    field: 'status',
    size: 'auto',
  },
  {
    label: 'Default SCD',
    field: 'default_SCD',
    size: 'auto',
  },
  {
    label: 'Default RFD',
    field: 'default_RFD',
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
  SEDI: 'sedi',
  SEDE: 'sede',
  REFERENTE: 'referente',
  REFERENTI: 'referenti',
  DELEGATO: 'delegato',
  DELEGATI: 'delegati',
  USER: 'user',
  FACILITATORE: 'facilitatore',
  SERVICES: 'services',
  CITIZENS: 'cittadino',
  PROFILE: 'profilo',
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

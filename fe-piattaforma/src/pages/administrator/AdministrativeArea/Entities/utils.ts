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
    size: 'medium',
  },
  {
    field: 'enteGestore',
    label: 'Ente gestore',
    size: 'medium',
  },
  {
    label: 'Stato',
    field: 'status',
    size: 'small',
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
  },
  {
    label: 'ID',
    field: 'id',
    size: 'small',
  },
  {
    label: 'Data ultima modifica',
    field: 'lastChangeDate',
  },
  {
    label: 'Stato',
    field: 'status',
  },
  {
    label: 'Default SCD',
    field: 'default_SCD',
  },
  {
    label: 'Default RFD',
    field: 'default_RFD',
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
  DELEGATO: 'delegato',
  USER: 'user',
  FACILITATORE: 'facilitatore',
  SERVICES: 'services',
  CITIZENS: 'cittadino',
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

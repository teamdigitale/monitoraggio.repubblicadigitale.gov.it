import { TableHeadingI, TableRowI } from '../../../../components/Table/table';
import { CRUDActionsI } from '../../../../utils/common';

const statusTypes = {
  ACTIVE: 'ATTIVO',
  DRAFT: 'BOZZA',
  INACTIVE: 'NON_ATTIVO',
};

export const dayOfWeek = [
  'Lunedì',
  'Martedì',
  'Mercoledì',
  'Giovedì',
  'Venerdì',
  'Sabato',
  'Domenica',
];

export const statusBgColor = (status: string) => {
  switch (status) {
    case statusTypes.ACTIVE:
    case 'active':
      return 'primary-bg-a9';
    case statusTypes.DRAFT:
    case 'draft':
      return 'analogue-2-bg-a2';
    case statusTypes.INACTIVE:
    case 'inactive':
      return 'neutral-1-bg-b4';
    default:
      return 'complementary-1-bg-a2';
  }
};

export const statusColor = (status: string) => {
  switch (status) {
    case statusTypes.ACTIVE:
    case 'active':
      return 'text-white';
    case statusTypes.DRAFT:
    case 'draft':
      return 'primary-color-a9';
    case statusTypes.INACTIVE:
    case 'inactive':
      return 'neutral-1-color-b6';
    default:
      return 'complementary-1-bg-a2';
  }
};

export const TableHeading: TableHeadingI[] = [
  {
    label: 'ID',
    field: 'id',
    size: 'small',
  },
  {
    label: 'Nome',
    field: 'label',
  },
  {
    label: 'Stato',
    field: 'status',
  },
];

export const TableHeadingUsers: TableHeadingI[] = [
  {
    label: 'ID',
    field: 'id',
    size: 'small',
  },
  {
    label: 'Nome',
    field: 'label',
  },
  {
    label: 'Ruolo',
    field: 'role',
  },
  {
    label: 'Stato',
    field: 'status',
  },
];

export const TableHeadingQuestionnaires: TableHeadingI[] = [
  {
    label: 'ID',
    field: 'id',
    size: 'small',
  },
  {
    label: 'Nome questionario',
    field: 'label',
  },
  {
    label: 'Tipo questionario',
    field: 'type',
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
  },
  {
    label: 'ID',
    field: 'id',
  },
  {
    label: 'Tipologia ente',
    field: 'tipologia',
  },
  {
    label: 'Profili',
    field: 'profilo',
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

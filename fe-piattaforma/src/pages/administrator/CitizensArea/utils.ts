import { TableHeadingI } from '../../../components/Table/table';

const statusTypes = {
  COMPLETE: 'COMPLETATO',
  DRAFT: 'IN BOZZA',
  INACTIVE: 'NON_ATTIVO',
  ACTIVE: 'ATTIVO',
  NOT_SENT: 'NON INVIATO',
  SENT: 'INVIATO',
  FILLED_OUT: 'COMPILATO',
};

export const statusBgColor = (status: string) => {
  switch (status) {
    case statusTypes.ACTIVE:
    case statusTypes.COMPLETE:
    case statusTypes.SENT:
      return 'primary-bg-a9';
    case statusTypes.FILLED_OUT:
      return 'primary-bg-c7';
    case statusTypes.DRAFT:
      return 'analogue-2-bg-a2';
    case statusTypes.INACTIVE:
      return 'neutral-1-bg-b4';
    case statusTypes.NOT_SENT:
      return 'light-grey-bg';
    default:
      return 'complementary-1-bg-a2';
  }
};

export const statusColor = (status: string) => {
  switch (status) {
    case statusTypes.COMPLETE:
    case statusTypes.ACTIVE:
    case statusTypes.SENT:
      return 'text-white';
    case statusTypes.FILLED_OUT:
      return 'white-color';
    case statusTypes.DRAFT:
      return 'primary-color-a9';
    case statusTypes.INACTIVE:
    case statusTypes.NOT_SENT:
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
    field: 'name',
  },
  {
    label: 'Questionari sottomessi',
    field: 'submitted',
  },
  {
    label: 'Questionari in bozza',
    field: 'onDraft',
  },
  {
    label: 'Stato questionari',
    field: 'status',
  },
];

export const TableHeadingSearchResults: TableHeadingI[] = [
  {
    label: 'Nome',
    field: 'nome',
  },
  {
    label: 'Cognome',
    field: 'cognome',
  },
  {
    label: 'Codice fiscale',
    field: 'codiceFiscale',
  },
];

export const TableHeadingEventsList: TableHeadingI[] = [
  {
    label: 'Nome',
    field: 'nome',
  },
  {
    label: 'Numero cittadini',
    field: 'numeroCittadini',
  },
  {
    label: 'Questionari',
    field: 'questionari',
  },
  {
    label: 'Facilitatore',
    field: 'facilitatore',
  },
  {
    label: 'Stato',
    field: 'stato',
  },
];

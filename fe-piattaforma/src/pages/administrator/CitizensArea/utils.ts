import { TableHeadingI } from '../../../components/Table/table';

const statusTypes = {
  COMPLETE: 'COMPLETATO',
  DRAFT: 'IN BOZZA',
  INACTIVE: 'NON_ATTIVO',
};

export const statusBgColor = (status: string) => {
  switch (status) {
    case statusTypes.COMPLETE:
      return 'primary-bg-a9';
    case statusTypes.DRAFT:
      return 'analogue-2-bg-a2';
    case statusTypes.INACTIVE:
      return 'neutral-1-bg-b4';
    default:
      return 'complementary-1-bg-a2';
  }
};

export const statusColor = (status: string) => {
  switch (status) {
    case statusTypes.COMPLETE:
      return 'text-white';
    case statusTypes.DRAFT:
      return 'primary-color-a9';
    case statusTypes.INACTIVE:
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

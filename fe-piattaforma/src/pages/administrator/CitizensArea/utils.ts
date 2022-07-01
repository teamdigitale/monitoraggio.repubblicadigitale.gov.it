import { TableHeadingI } from '../../../components/Table/table';

export const TableHeading: TableHeadingI[] = [
  {
    label: 'Nome',
    field: 'name',
  },
  {
    label: 'ID',
    field: 'id',
    size: 'small',
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
    field: 'nome',
    label: 'Nome',
  },
  {
    field: 'serviceType',
    label: 'Tipo di servizio prenotato',
    size: 'medium',
  },
  {
    field: 'date',
    label: 'data',
    size: 'small',
  },
  {
    field: 'facilitatore',
    label: 'Facilitatore',
  },
  {
    field: 'status',
    label: 'Stato',
  },
];

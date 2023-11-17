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
    label: 'N. servizi utilizzati',
    field: 'numeroServizi',
  },
  {
    label: 'N. questionari compilati',
    field: 'numeroQuestionariCompilati',
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

export const TableHeadingServicesList: TableHeadingI[] = [
  {
    field: 'nome',
    label: 'Nome',
  },
  {
    field: 'tipologiaServizio',
    label: 'Tipo di servizio prenotato',
    size: 'medium',
  },
  {
    field: 'data',
    label: 'data',
    //size: 'small',
  },
  /*{
    field: 'facilitatore',
    label: 'Facilitatore',
  },*/
  {
    field: 'nomeSede',
    label: 'Sede',
  },
  {
    field: 'stato',
    label: 'Stato',
  },
];

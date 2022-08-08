import {TableHeadingI} from "../../../components/Table/table";

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

export const staticValues = [{
  attributo: 'GENERE',
  attributo_tipo: 'string',
  descrizione: 'È il genere del cittadino',
  descrizione_tipo: 'Donna, Uomo, Non binario',
}, {
  attributo: 'TITOLO_DI_STUDIO',
  attributo_tipo: 'string',
  descrizione: 'È il titolo di studio massimo più alto raggiunto dal cittadino',
  descrizione_tipo: 'Licenza elementare / Scuola primaria, Licenza media inferiore / Scuola secondaria di I grado (3 anni), Diploma di scuola superiore (diploma di maturità) / Scuola secondaria di II grado (5 anni), Diploma professionale (3 anni) / Istituti professionali / Istituti di Istruzione e Formazione Professionale (IeFP), Laurea (3 anni), Laurea magistrale (5 anni) / Master di I livello / Specializzazione post-laurea (2 anni), Dottorato, Master di II livello o titoli equiparati, Non conosciuto / non fornito / Altro',
}, {
  attributo: 'ANNO_DI_NASCITA',
  attributo_tipo: 'string',
  descrizione: "È l'anno di nascita del cittadino",
  descrizione_tipo: '-',
}];

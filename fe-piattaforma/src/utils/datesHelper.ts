import moment from 'moment';

export const shortFormats: { [key: string]: string } = {
  fullDate: 'DD/MM/YYYY - hh:mm:ss',
  dateTime: 'DD/MM/YYYY hh:mm',
  shortDate: 'DD/MM/YYYY',
  snakeDate: 'YYYY-MM-DD',
  midDate: 'MMM Do, YYYY',
  dayMonthData: 'DDD MMM',
  default: 'MMM DD, YYYY \\at hh:mm A',
  defaultSeconds: 'MMM DD, YYYY \\at hh:mm:ss A',
  defaultMilliseconds: 'MMM DD, YYYY \\at HH:mm:ss.SSS A',
  itaDefault: 'DD MMM YYYY \\at hh:mm',
};

export const formatDate = (timestamp: string | number, format: string) => {
  let timeToFormat = timestamp;
  if (!timeToFormat) {
    return undefined;
  }
  if (!isNaN(Number(timeToFormat))) {
    timeToFormat = Number(timeToFormat);
  }
  return moment(timeToFormat).format(
    shortFormats[format] || shortFormats.default
  );
};

export const dateToTimestamp = (date: string, format: string) => {
  if (!date) {
    return undefined;
  }
  return moment(date, format).format('x');
};

export const dateToUtcDate = (date: string, format: string) => {
  if (!date) {
    return undefined;
  }
  return moment.utc(moment(date, format)).toISOString();
};

// Numero massimo di giorni nel passato ammessi per la data di un servizio.
export const LIMITE_GIORNI_SERVIZIO = 15;

// Data di rilascio del controllo, mostrata nell'avviso in creazione servizio.
// Placeholder: aggiornare con la data effettiva di rilascio.
export const DATA_RILASCIO_LIMITE_SERVIZIO = '2026-07-01';

export const MESSAGGIO_DATA_SERVIZIO_LIMITE =
  'Puoi aggiungere servizi solo con data a partire dagli ultimi 15 giorni.';

// Data minima selezionabile per un servizio (oggi - LIMITE_GIORNI_SERVIZIO),
// in formato YYYY-MM-DD per la validazione e per l'attributo min del campo date.
export const getDataMinimaServizio = (): string =>
  moment().subtract(LIMITE_GIORNI_SERVIZIO, 'days').format('YYYY-MM-DD');

// True se la data servizio e' anteriore di oltre LIMITE_GIORNI_SERVIZIO giorni
// rispetto a oggi.
export const isDataServizioOltreLimite = (
  dataServizio?: string | number | Date
): boolean => {
  if (!dataServizio) {
    return false;
  }
  const limite = moment()
    .startOf('day')
    .subtract(LIMITE_GIORNI_SERVIZIO, 'days');
  return moment(dataServizio).startOf('day').isBefore(limite);
};

// Testo dell'avviso statico mostrato nella modale di creazione servizio.
export const getTestoAvvisoLimiteServizio = (): string =>
  `Attenzione: dal giorno ${moment(DATA_RILASCIO_LIMITE_SERVIZIO).format(
    'DD/MM/YYYY'
  )} è possibile aggiungere servizi solo con data a partire dagli ultimi 15 giorni`;

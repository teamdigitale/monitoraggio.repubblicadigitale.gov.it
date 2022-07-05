import moment from 'moment';

export const shortFormats: { [key: string]: string } = {
  fullDate: 'DD/MM/YYYY - hh:mm:ss A',
  shortDate: 'DD/MM/YYYY',
  snakeDate: 'YYYY-MM-DD',
  midDate: 'MMM Do, YYYY',
  dayMonthData: 'DDD MMM',
  default: 'MMM DD, YYYY \\at hh:mm A',
  defaultSeconds: 'MMM DD, YYYY \\at hh:mm:ss A',
  defaultMilliseconds: 'MMM DD, YYYY \\at HH:mm:ss.SSS A',
  itaDefault: 'DD MMM YYYY \\at hh:mm',
};

export const formatDate = (timestamp: string | undefined, format: string) => {
  if (!timestamp) {
    return undefined;
  }
  return moment(timestamp).format(shortFormats[format] || shortFormats.default);
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

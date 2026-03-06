import axios, { AxiosHeaders } from 'axios';
import { errorHandler } from './notifictionHelper';
import { getSessionValues } from './sessionHelper';

const API = axios.create({
  baseURL: `${process?.env?.REACT_APP_BE_BASE_URL}`,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 550000,
});

API.interceptors.request.use((req) => {
  const newHeaders = new AxiosHeaders(req.headers);
  newHeaders.set('userRole', JSON.parse(getSessionValues('profile'))?.codiceRuolo || "undefined");
  if (JSON.parse(getSessionValues('auth'))?.id_token) {
    newHeaders.set('authToken', JSON.parse(getSessionValues('auth'))?.id_token);
  }
  req.headers = newHeaders;
  return req;
});

API.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.config.data != null) {
      let json = JSON.parse(error.config.data)
      if (!json?.url?.includes("notifications")) {
        try {
          if (error.response && Number(error.response.status) === 403) {
            // TODO manage unauthorized
          }
        } catch (err) {
          errorHandler(err);
        } finally {
          errorHandler(error);
        }
      }
      return Promise.reject(error);
    }
  }
);

export default API;

export const createPath = (payloadEntity: string): string | undefined => {
  switch (payloadEntity) {
    case 'programma':
    case 'progetto':
      return `${process?.env?.PROGRAMMA_PROGETTO}`;
    case 'ente':
      return `${process?.env?.ENTE}`;
    case 'servizio':
    case 'questionarioTemplate':
      return `${process?.env?.QUESTIONARIO_CITTADINO}`;
    case 'utente':
      return `${process?.env?.GESTIONE_UTENTE}`;
    default:
      return undefined;
  }
};

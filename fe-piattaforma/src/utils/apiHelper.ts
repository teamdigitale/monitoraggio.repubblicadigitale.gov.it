import axios from 'axios';
import { initMock } from './mockHelper';
import { errorHandler } from './notifictionHelper';
import { getSessionValues } from './sessionHelper';

const API = axios.create({
  baseURL: `${process?.env?.REACT_APP_BE_BASE_URL}`,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

API.interceptors.request.use((req) => {
  const codiceRuolo = JSON.parse(getSessionValues('profile'))?.codiceRuolo;
  const newHeaders: {
    authToken?: string;
    userRole?: string;
  } = {
    ...req.headers,
    userRole: codiceRuolo,
  };
  const authSession =
    getSessionValues('auth') !== 'fguhbjinokj8765d578t9yvghugyftr646tg'
      ? JSON.parse(getSessionValues('auth'))
      : getSessionValues('auth');
  if (authSession.idToken) {
    newHeaders.authToken = authSession.idToken;
  } else if (authSession) {
    newHeaders.authToken = authSession;
  }
  if (codiceRuolo) {
    newHeaders.userRole = codiceRuolo;
  }
  return {
    ...req,
    headers: newHeaders,
  };
});

API.interceptors.response.use(
  (res) => res,
  (error) => {
    try {
      if (error.response && Number(error.response.status) === 403) {
        // TODO manage unauthorized
      }
    } catch (err) {
      errorHandler(err);
    } finally {
      errorHandler(error);
    }

    return Promise.reject(error);
  }
);

initMock(API);

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

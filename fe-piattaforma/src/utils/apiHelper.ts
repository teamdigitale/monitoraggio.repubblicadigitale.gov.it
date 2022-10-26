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
  return {
    ...req,
    headers: {
      ...req.headers,
      authToken: JSON.parse(getSessionValues('auth'))?.id_token,
      userRole: JSON.parse(getSessionValues('profile'))?.codiceRuolo,
    },
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

import axios from 'axios';
import { initMock } from './mockHelper';
import { errorHandler } from './notifictionHelper';

const API = axios.create({
  baseURL: `${process?.env?.REACT_APP_BE_BASE_URL}`,
  headers: {
    'Content-Type': 'application/json',
    authToken: 'fguhbjinokj8765d578t9yvghugyftr646tg', // MOCK
    userRole: 'TBD', // MOCK
  },
});

API.interceptors.request.use((req) => {
  // TODO implement retrieve authToken & userRole fron storage
  // req.headers['authToken'] = 'fguhbjinokj8765d578t9yvghugyftr646tg';
  return req;
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

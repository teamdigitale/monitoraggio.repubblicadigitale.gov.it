import { Dispatch } from '@reduxjs/toolkit';
import API from '../../../utils/apiHelper';
import { hideLoader, showLoader } from '../app/appSlice';
import {
  setRicercaSingolaResult,
  setRicercaMultiplaResult,
} from './ricercaCittadiniSlice';
import { getUserHeaders } from '../user/userThunk';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const AES256 = require('aes-everywhere');

const encryptValue = (value: string): string =>
  AES256.encrypt(value.toUpperCase(), process?.env?.AES256_KEY);

const encryptRaw = (value: string): string =>
  AES256.encrypt(value, process?.env?.AES256_KEY);

export const RicercaSingolaCittadino =
  (criterioRicerca: string) => async (dispatch: Dispatch) => {
    try {
      dispatch(showLoader());
      const { cfUtenteLoggato, codiceRuoloUtenteLoggato } = getUserHeaders();
      const body = {
        codiceRuoloUtenteLoggato,
        cfUtenteLoggato,
        criterioRicerca: encryptValue(criterioRicerca),
      };
      const endpoint = `${process?.env?.QUESTIONARIO_CITTADINO}cittadino/ricerca`;
      const res = await API.post(endpoint, body);
      const data = res?.data;
      dispatch(setRicercaSingolaResult(Array.isArray(data) ? data : data ? [data] : []));
    } catch (error) {
      dispatch(setRicercaSingolaResult([]));
      console.log('RicercaSingolaCittadino error', error);
    } finally {
      dispatch(hideLoader());
    }
  };

export const RicercaMultiplaCittadini =
  (criteriRicerca: string[]) => async (dispatch: Dispatch) => {
    try {
      dispatch(showLoader());
      const { cfUtenteLoggato, codiceRuoloUtenteLoggato } = getUserHeaders();
      const body = {
        codiceRuoloUtenteLoggato,
        cfUtenteLoggato,
        criterioRicercaMultipla: criteriRicerca.map(encryptRaw),
      };
      const endpoint = `${process?.env?.QUESTIONARIO_CITTADINO}cittadino/ricerca-multipla`;
      const res = await API.post(endpoint, body);
      if (res?.data) {
        dispatch(setRicercaMultiplaResult(res.data));
      }
    } catch (error) {
      console.log('RicercaMultiplaCittadini error', error);
    } finally {
      dispatch(hideLoader());
    }
  };

import { Dispatch, Selector } from '@reduxjs/toolkit';
import API from '../../../utils/apiHelper';
import { RootState } from '../../store';
import {
  AnagraphicStateI,
  cleanIdsToGet,
  setAnagraphics,
  UserAnagraphicStateI,
} from './anagraphicSlice';

export const GetUsersAnagrapic =
  (richiediImmagine = false) =>
  async (dispatch: Dispatch, select: Selector) => {
    try {
      const {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        anagraphic: { idsToGet },
      } = select((state: RootState) => state);
      if (idsToGet?.length) {
        const res = await API.post(
          `/utente/listaUtenti?richiediImmagine=${richiediImmagine}`,
          {
            idsUtenti: idsToGet,
          }
        );
        dispatch(cleanIdsToGet(idsToGet));
        if (res?.data?.length) {
          const newAnagraphic: AnagraphicStateI['anagraphics'] = {};
          res?.data.forEach((user: UserAnagraphicStateI) => {
            newAnagraphic[user.id || user.cognome] = user;
          });
          dispatch(setAnagraphics(newAnagraphic));
        }
      }
    } catch (error) {
      console.log('GetUsersAnagrapic error', error);
    }
  };

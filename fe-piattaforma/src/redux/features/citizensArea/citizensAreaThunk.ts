import { Dispatch, Selector } from '@reduxjs/toolkit';
import API from '../../../utils/apiHelper';
import { hideLoader, showLoader } from '../app/appSlice';
import {
  getEntityDetail,
  getEntitySearch,
  getEntitySearchMultiple,
  setEntityFilterOptions,
  setEntityValues,
  setEntityPagination,
} from './citizensAreaSlice';
import { RootState } from '../../store';
import { mapOptions } from '../../../utils/common';

const GetValuesAction = { type: 'citizensArea/GetEntityValues' };

export const GetEntityValues =
  (payload?: any) => async (dispatch: Dispatch, select: Selector) => {
    try {
      dispatch({ ...GetValuesAction, payload });
      dispatch(showLoader());
      const {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        citizensArea: { filters, pagination },
      } = select((state: RootState) => state);
      const entityEndpoint = `/cittadino/all`;
      const body = {
        filtro: {
          ...filters,
          criterioRicerca: null,
          idsSedi: [],
        },
        idProgetto: 0,
        idProgramma: 0,
        codiceFiscaleUtenteLoggato: 'UTENTE1', //MOCK
        codiceRuoloUtenteLoggato: 'DTD', //MOCK DA MANTENERE SOLO NELL'HEADER
      };
      const res = await API.post(entityEndpoint, body, {
        params: {
          currPage: Math.max(0, pagination.pageNumber - 1),
          pageSize: pagination.pageSize,
        },
      });
      if (res?.data) {
        dispatch(
          setEntityValues({ entity: payload.entity, data: res.data.cittadini })
        );
        dispatch(setEntityPagination({ totalPages: res.data.numeroPagine }));
      }
    } catch (error) {
      console.log('GetEntityValues citizensArea error', error);
    } finally {
      dispatch(hideLoader());
    }
  };

const GetFilterValuesAction = {
  type: 'citizensArea/GetFilterValues',
};
export const GetEntityFilterValues =
  (entityFilter: any, payload?: any) =>
  async (dispatch: Dispatch, select: Selector) => {
    try {
      dispatch({ ...GetFilterValuesAction, payload });
      dispatch(showLoader());
      const {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        citizensArea: { filters },
      } = select((state: RootState) => state);
      // } = select((state: RootState) => state);
      const entityFilterEndpoint = `cittadino/${entityFilter}/dropdown`;
      const body = {
        filtro: {
          ...filters,
          criterioRicerca: null,
          idsSedi: [],
        },
        idProgetto: 0,
        idProgramma: 0,
        codiceFiscaleUtenteLoggato: 'UTENTE1', //MOCK
        codiceRuoloUtenteLoggato: 'DTD', //MOCK DA MANTENERE SOLO NELL'HEADER
      };
      const res = await API.post(entityFilterEndpoint, body);
      if (res?.data) {
        dispatch(
          setEntityFilterOptions({
            [entityFilter]: mapOptions(res.data.data.list),
          })
        );
      }
    } catch (error) {
      console.log('GetEntityFilterValues citizensArea error', error);
    } finally {
      dispatch(hideLoader());
    }
  };

const GetEntityDetailAction = {
  type: 'citizensArea/GetEntityDetail',
};
export const GetEntityDetail =
  (idCittadino: string | undefined, payload?: any) =>
  async (dispatch: Dispatch) => {
    try {
      dispatch(showLoader());
      dispatch({ ...GetEntityDetailAction, idCittadino, payload });
      const res = await API.get(`cittadino/${idCittadino}`);
      if (res?.data) {
        dispatch(getEntityDetail(res.data));
      }
    } catch (error) {
      console.log('GetEntityDetail citizensArea error', error);
    } finally {
      dispatch(hideLoader());
    }
  };

const GetEntitySearchResultAction = {
  type: 'citizensArea/GetEntitySearchResult',
};

export const GetEntitySearchResult =
  (cfUtente: string, searchType: string) => async (dispatch: Dispatch) => {
    try {
      dispatch(showLoader());
      dispatch({ ...GetEntitySearchResultAction, cfUtente, searchType });
      const res = await API.get('cittadino/light/idCittadino', {
        params: { cfUtente, searchType },
      });
      if (res?.data) {
        if (Array.isArray(res.data.data)) {
          dispatch(getEntitySearchMultiple(res.data.data));
        } else {
          dispatch(getEntitySearch(res.data.data));
        }
      }
    } catch (error) {
      console.log('GetEntitySearchResult citizensArea error', error);
    } finally {
      dispatch(hideLoader());
    }
  };

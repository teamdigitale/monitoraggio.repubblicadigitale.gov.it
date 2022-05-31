import { Dispatch, Selector } from '@reduxjs/toolkit';
import API from '../../../utils/apiHelper';
import { hideLoader, showLoader } from '../app/appSlice';
import {
  getEntityDetail,
  getEntitySearch,
  getEntitySearchMultiple,
  setEntityFilterOptions,
  setEntityValues,
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
      const entityEndpoint = `/${payload.entity}/all`;
      const body = {
        ...filters,
      };
      let res;
      if (body) {
        res = await API.post(entityEndpoint, body, { params: pagination });
      } else {
        res = await API.get(entityEndpoint, { params: pagination });
      }
      if (res?.data) {
        dispatch(setEntityValues({ entity: payload.entity, data: res.data }));
      }
    } catch (error) {
      console.log('GetEntityValues citizensArea error', error);
    } finally {
      dispatch(hideLoader());
    }
  };

const GetFilterValuesAction = {
  type: 'citizensArea/GetEntityFilterValues',
};
export const GetEntityFilterValues =
  (cfUtente: string, entityFilter: any, payload?: any) =>
  async (dispatch: Dispatch, select: Selector) => {
    try {
      dispatch({ ...GetFilterValuesAction, cfUtente, payload });
      dispatch(showLoader());
      const {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        citizensArea: { pagination },
      } = select((state: RootState) => state);
      const entityFilterEndpoint = `areaCittadini/${entityFilter}/dropdown/${cfUtente}`;
      const res = await API.get(entityFilterEndpoint, { params: pagination });
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
  (cfUtente: string | undefined, payload?: any) =>
  async (dispatch: Dispatch) => {
    try {
      dispatch(showLoader());
      dispatch({ ...GetEntityDetailAction, cfUtente, payload });
      const res = await API.get('citizensArea/detail', { params: cfUtente });
      if (res?.data) {
        dispatch(getEntityDetail(res.data.data));
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

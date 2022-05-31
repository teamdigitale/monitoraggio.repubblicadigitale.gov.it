import { Dispatch, Selector } from '@reduxjs/toolkit';
import API from '../../../utils/apiHelper';
import { hideLoader, showLoader } from '../app/appSlice';
import {
  setEntityDetail,
  setEntityFilterOptions,
  setEntityValues,
} from './administrativeAreaSlice';
import { RootState } from '../../store';
import { mapOptions } from '../../../utils/common';

const GetValuesAction = { type: 'administrativeArea/GetEntityValues' };

// TODO: RIPULIRE QUESTO FILE DALLE ACTION INUTILI, AL MOMENTO LE TENGO QUI PER I QUESTIONARI
export const GetEntityValues =
  (payload?: any) => async (dispatch: Dispatch, select: Selector) => {
    try {
      dispatch(showLoader());
      dispatch({ ...GetValuesAction, payload }); // TODO manage dispatch for dev env only
      const {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        administrativeArea: { filters, pagination },
      } = select((state: RootState) => state);
      const entityEndpoint = `/${payload.entity}/all`;
      const body = {
        ...filters,
        // TODO reduce filters object to key:value
      };
      let res;
      if (body) {
        res = await API.post(entityEndpoint, body, {
          params: {
            currPage: pagination.pageNumber,
            pageSize: pagination.pageSize,
          },
        });
      } else {
        res = await API.get(entityEndpoint, {
          params: {
            currPage: pagination.pageNumber,
            pageSize: pagination.pageSize,
          },
        });
      }
      if (res?.data)
        dispatch(setEntityValues({ entity: payload.entity, data: res.data }));
    } finally {
      dispatch(hideLoader());
    }
  };

const GetFilterValuesAction = {
  type: 'administrativeArea/GetEntityFilterValues',
};
export const GetEntityFilterValues =
  (tab: string, cfUtente: string, entityFilter: any, payload?: any) =>
  async (dispatch: Dispatch, select: Selector) => {
    try {
      // dispatch(showLoader());
      dispatch({ ...GetFilterValuesAction, cfUtente, payload });
      const {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        administrativeArea: { pagination },
      } = select((state: RootState) => state);

      const entityFilterEndpoint = `/${tab}/${entityFilter}/dropdown/${cfUtente}`;
      const res = await API.get(entityFilterEndpoint, { params: pagination });
      if (res?.data) {
        dispatch(
          setEntityFilterOptions({
            [entityFilter]: mapOptions(res.data.data.list),
          })
        );
      }
    } catch (error) {
      console.log('GetFilterValuesAction error', error);
    } finally {
      //   dispatch(hideLoader());
    }
  };

const GetEntityDetailAction = {
  type: 'administrativeArea/GetEntityDetail',
};
export const GetEntityDetail =
  (endpoint: string, entity?: string, id?: string) =>
  async (dispatch: Dispatch) => {
    try {
      //dispatch(showLoader());
      dispatch({ ...GetEntityDetailAction, entity, id });
      const res = await API.get(endpoint);
      if (res?.data) {
        dispatch(setEntityDetail(res.data.data));
      }
    } catch (error) {
      console.log('GetEntityDetail error', error);
    } finally {
      //   dispatch(hideLoader());
    }
  };

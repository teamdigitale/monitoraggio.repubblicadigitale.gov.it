import { Dispatch, Selector } from '@reduxjs/toolkit';
import { hideLoader, showLoader } from '../../app/appSlice';
import { RootState } from '../../../store';
import isEmpty from 'lodash.isempty';
import API from '../../../../utils/apiHelper';
import {
  setEntityFilterOptions,
  setUserDetails,
  setUsersList,
} from '../administrativeAreaSlice';
import { mapOptions } from '../../../../utils/common';

export interface UtentiLightI {
  id: string;
  nome: string;
  ruoli: string;
  stato: string;
}

export interface ProgettoListResponseI {
  numeroPagine: number;
  utentiLight: UtentiLightI[];
}

const GetAllUtentiAction = {
  type: 'administrativeArea/GetAllUtenti',
};

export const GetAllUtenti =
  () => async (dispatch: Dispatch, select: Selector) => {
    try {
      dispatch(showLoader());
      dispatch({ ...GetAllUtentiAction });
      const {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        administrativeArea: { filters, pagination },
      } = select((state: RootState) => state);
      const endpoint = `utente/all`;
      let res;
      if (!isEmpty(filters)) {
        const body = {
          filtroRequest: { ...filters },
          codiceFiscale: '',
          codiceRuolo: '',
        };
        res = await API.post(endpoint, body, {
          params: {
            currPage: pagination.pageNumber,
            pageSize: pagination.pageSize,
          },
        });
      } else {
        res = await API.get(endpoint, {
          params: {
            currPage: pagination.pageNumber,
            pageSize: pagination.pageSize,
          },
        });
      }
      if (res?.data) {
        dispatch(setUsersList({ data: res.data.data.list }));
      }
    } finally {
      dispatch(hideLoader());
    }
  };

const GetFilterValuesUtentiAction = {
  type: 'administrativeArea/GetFilterValuesUtenti',
};
export const GetFilterValuesUtenti =
  (dropdownType: 'ruoli' | 'stati') =>
  async (dispatch: Dispatch, select: Selector) => {
    try {
      // dispatch(showLoader());
      dispatch({ ...GetFilterValuesUtentiAction, dropdownType });
      const {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        administrativeArea: { filters },
      } = select((state: RootState) => state);
      const body = {
        cfUtente: '',
        codiceRuolo: '',
        filtroRequest: { ...filters },
        idProgramma: 0,
      };
      const entityFilterEndpoint = `/utente/${dropdownType}/dropdown`;
      const res = await API.post(entityFilterEndpoint, body);
      if (res?.data) {
        dispatch(
          setEntityFilterOptions({
            [dropdownType]: mapOptions(res.data.data.list),
          })
        );
      }
    } catch (error) {
      console.log('GetFilterValuesAction error', error);
    } finally {
      //   dispatch(hideLoader());
    }
  };

const GetUserDetailAction = {
  type: 'administrativeArea/GetUserDetail',
};
export const GetUserDetail =
  (idUtente: string) => async (dispatch: Dispatch) => {
    try {
      dispatch(showLoader());
      dispatch({ ...GetUserDetailAction, idUtente });
      const res = await API.get(`utente/idUtente`);
      if (res?.data) {
        dispatch(setUserDetails(res.data));
      }
    } catch (error) {
      console.log('GetHeadquartersDetail error', error);
    } finally {
      dispatch(hideLoader());
    }
  };

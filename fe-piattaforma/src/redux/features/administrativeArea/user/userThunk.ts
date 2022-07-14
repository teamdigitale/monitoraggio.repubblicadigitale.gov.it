import { Dispatch, Selector } from '@reduxjs/toolkit';
import { hideLoader, showLoader } from '../../app/appSlice';
import { RootState } from '../../../store';
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
  cognome: string;
  email: string;
  ruoli: string;
  codiceFiscale: string;
  stato: string;
}

export interface ProgettoListResponseI {
  numeroPagine: number;
  utentiLight: UtentiLightI[];
}

const GetAllUsersAction = {
  type: 'administrativeArea/GetAllUsers',
};

export const GetAllUsers =
  () => async (dispatch: Dispatch, select: Selector) => {
    try {
      dispatch(showLoader());
      dispatch({ ...GetAllUsersAction });
      const {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        administrativeArea: { filters, pagination },
      } = select((state: RootState) => state);
      const endpoint = `utente/all`;
      const body = {
        filtroRequest: { ...filters },
        codiceFiscale: 'UTENTE1',
        codiceRuolo: 'DTD',
        idProgetto: 0,
        idProgramma: 0,
      };
      const res = await API.post(endpoint, body, {
        params: {
          currPage: pagination.pageNumber,
          pageSize: pagination.pageSize,
        },
      });
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
export const GetUserDetails =
  (userId: string) => async (dispatch: Dispatch) => {
    try {
      dispatch(showLoader());
      dispatch({ ...GetUserDetailAction, userId });
      const res = await API.get(`utente/${userId}`);
      if (res?.data) {
        dispatch(setUserDetails(res.data));
      }
    } catch (error) {
      console.log('GetHeadquartersDetail error', error);
    } finally {
      dispatch(hideLoader());
    }
  };

export const GetUsersBySearch =
  (search: string) => async (dispatch: Dispatch) => {
    try {
      dispatch(showLoader());
      dispatch({ ...GetAllUsersAction });

      const res = await API.get(`/utente/cerca/${search}`);

      if (Array.isArray(res.data)) {
        dispatch(setUsersList(res.data));
      } else {
        dispatch(setUsersList(null));
      }
    } catch (error) {
      console.log(error);
    } finally {
      dispatch(hideLoader());
    }
  };

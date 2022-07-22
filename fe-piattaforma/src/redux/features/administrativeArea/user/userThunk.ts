import { Dispatch, Selector } from '@reduxjs/toolkit';
import { hideLoader, showLoader } from '../../app/appSlice';
import { RootState } from '../../../store';
import API from '../../../../utils/apiHelper';
import {
  setEntityFilterOptions,
  setEntityPagination,
  setEntityValues,
  setUserDetails,
  setUsersList,
} from '../administrativeAreaSlice';
import { mapOptions } from '../../../../utils/common';
import { formFieldI } from '../../../../utils/formHelper';

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
        cfUtente: 'UTENTE1',
        codiceRuolo: 'DTD',
        idProgetto: 0,
        idProgramma: 0,
      };
      const res = await API.post(endpoint, body, {
        params: {
          currPage: Math.max(0, pagination.pageNumber - 1),
          pageSize: pagination.pageSize,
        },
      });
      if (res?.data) {
        dispatch(setEntityValues({ entity: 'utenti', data: res.data }));
        dispatch(setEntityPagination({ totalPages: res.data.numeroPagine }));
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

const CreateUserAction = {
  type: 'administrativeArea/CreateUser',
};
export const CreateUser =
  (payload: { [key: string]: formFieldI['value'] }) =>
  async (dispatch: Dispatch) => {
    try {
      dispatch(showLoader());
      dispatch({ ...CreateUserAction, payload });

      const body = {
        telefono: payload?.telefono,
        codiceFiscale: payload?.codiceFiscale?.toString().toUpperCase(),
        cognome: payload?.cognome,
        email: payload?.email,
        mansione: payload?.mansione,
        nome: payload?.nome,
        ruolo: 'REG', // TODO: valore?
        tipoContratto: '', // TODO: valore?
      };

      const res = await API.post(`/utente`, body);

      if (res) {
        return res;
      }
    } catch (error) {
      console.log(error);
    } finally {
      dispatch(hideLoader());
    }
  };

  const UpdateUserAction = {
    type: 'administrativeArea/UpdateUser',
  };
  export const UpdateUser =
    (cfUtente: string, payload: { [key: string]: formFieldI['value'] }) =>
    async (dispatch: Dispatch) => {
      try {
        dispatch(showLoader());
        dispatch({ ...UpdateUserAction, cfUtente });
  
        const body = {
          telefono: payload?.telefono,
          codiceFiscale: payload?.codiceFiscale?.toString().toUpperCase(),
          cognome: payload?.cognome,
          email: payload?.email,
          mansione: payload?.mansione,
          nome: payload?.nome,
          ruolo: 'REG', // TODO: valore?
          tipoContratto: '', // TODO: valore?
        };
  
        const res = await API.put(`/utente/${cfUtente}`, body);
  
        if (res) {
         console.log(res)
        }
      } catch (error) {
        console.log(error);
      } finally {
        dispatch(hideLoader());
      }
    };
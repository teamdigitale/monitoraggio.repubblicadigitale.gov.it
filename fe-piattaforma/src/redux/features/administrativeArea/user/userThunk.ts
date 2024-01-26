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
import { getUserHeaders } from '../../user/userThunk';

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
      const { codiceFiscale, codiceRuolo, idProgramma, idEnte } =
        getUserHeaders();
      const body = {
        cfUtente: codiceFiscale,
        cfUtenteLoggato: codiceFiscale,
        codiceRuolo: codiceRuolo,
        codiceRuoloUtenteLoggato: codiceRuolo,
        filtroRequest: { ...filters },
        idProgramma,
        idEnte,
      };
      const entityFilterEndpoint = `/utente/${dropdownType}/dropdown`;
      const res = await API.post(entityFilterEndpoint, body);
      if (res?.data) {
        dispatch(
          setEntityFilterOptions({
            [dropdownType]: mapOptions(res.data),
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
  (userId: string, light = false) =>
  async (dispatch: Dispatch) => {
    try {
      dispatch(showLoader());
      dispatch({ ...GetUserDetailAction, userId });
      const { codiceFiscale, codiceRuolo, idProgramma, idProgetto, idEnte } =
        getUserHeaders();
      const body = {
        cfUtente: codiceFiscale,
        cfUtenteLoggato: codiceFiscale,
        codiceRuolo,
        codiceRuoloUtenteLoggato: codiceRuolo
        idProgramma,
        idProgetto,
        idEnte,
      };
      let res;
      if (light) {
        res = await API.get(`/utente/light/${userId}`);
      } else {
        res = await API.post(`/utente/${userId}`, body);
      }
      if (res?.data) {
        dispatch(setUserDetails(res.data));
        return res.data;
      }
    } catch (error) {
      console.log('GetHeadquartersDetail error', error);
    } finally {
      dispatch(hideLoader());
    }
  };

const GetUsersBySearchAction = {
  type: 'administrativeArea/GetUsersBySearch',
};
export const GetUsersBySearch =
  (search: string) => async (dispatch: Dispatch) => {
    try {
      dispatch(showLoader());
      dispatch({ ...GetUsersBySearchAction });

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
        telefono: payload?.telefono?.toString().trim(),
        codiceFiscale: payload?.codiceFiscale?.toString().toUpperCase().trim(),
        cognome: payload?.cognome?.toString().trim(),
        email: payload?.email?.toString().trim(),
        mansione: payload?.mansione?.toString().trim(),
        nome: payload?.nome?.toString()?.trim(),
        ruolo: payload?.ruolo,
      };

      const res = await API.post(`/utente`, body);

      if (res) {
        return res;
      }
    } catch (error: any) {
      console.log(error);
      return error.response.data;
    } finally {
      dispatch(hideLoader());
    }
  };

const UpdateUserAction = {
  type: 'administrativeArea/UpdateUser',
};
export const UpdateUser =
  (idUtente: string, payload: { [key: string]: formFieldI['value'] }) =>
  async (dispatch: Dispatch) => {
    try {
      dispatch(showLoader());
      dispatch({ ...UpdateUserAction, idUtente });
      const { idProgramma, idProgetto, idEnte } = getUserHeaders();
      const body = {
        idProgramma,
        idProgetto,
        idEnte,
        telefono: payload?.telefono,
        codiceFiscale: payload?.codiceFiscale?.toString().toUpperCase(),
        cognome: payload?.cognome,
        email: payload?.email,
        mansione: payload?.mansione,
        nome: payload?.nome,
        ruolo: payload?.ruolo, // TODO: valore?
        tipoContratto: payload?.tipoContratto, // TODO: valore?
      };

      const res = await API.put(`/utente/${idUtente}`, body);

      if (res) {
        return true;
      }
    } catch (error: any) {
      console.log(error);
      return error.response.data;
    } finally {
      dispatch(hideLoader());
    }
  };

const UserAddRoleAction = {
  type: 'user/UserAddRole',
};
export const UserAddRole =
  (payload: { idUtente: string; ruolo: string }) =>
  async (dispatch: Dispatch) => {
    try {
      dispatch(showLoader());
      dispatch({ ...UserAddRoleAction, payload });
      const { idUtente, ruolo } = payload;
      const res = await API.put(`/utente/${idUtente}/assegnaRuolo/${ruolo}`);
      if (res) {
        return true;
      }
    } catch (error) {
      console.log(error);
    } finally {
      dispatch(hideLoader());
    }
  };

const UserDeleteRoleAction = {
  type: 'user/UserRemoveRole',
};
export const UserDeleteRole =
  (payload: { idUtente: string; ruolo: string }) =>
  async (dispatch: Dispatch) => {
    try {
      dispatch(showLoader());
      dispatch({ ...UserDeleteRoleAction, payload });
      const { idUtente, ruolo } = payload;
      const { idProgramma, idProgetto, idEnte } = getUserHeaders();
      const res = await API.delete(
        `/utente/${idUtente}/cancellaRuolo/${ruolo}`,
        { data: { idProgramma, idProgetto, idEnte } }
      );
      if (res) {
        return true;
      }
    } catch (error) {
      console.log(error);
    } finally {
      dispatch(hideLoader());
    }
  };

const UserDeleteAction = {
  type: 'user/UserDelte',
};
export const UserDelete = (idUtente: string) => async (dispatch: Dispatch) => {
  try {
    dispatch(showLoader());
    dispatch({ ...UserDeleteAction, idUtente });
    const { idProgramma, idProgetto, idEnte } = getUserHeaders();
    const res = await API.delete(`/utente/${idUtente}`, {
      data: { idProgramma, idProgetto, idEnte },
    });
    if (res) {
      return true;
    }
  } catch (error) {
    console.log(error);
    return false;
  } finally {
    dispatch(hideLoader());
  }
};

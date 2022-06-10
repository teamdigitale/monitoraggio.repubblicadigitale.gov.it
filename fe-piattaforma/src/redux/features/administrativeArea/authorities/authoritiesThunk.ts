import { Dispatch, Selector } from '@reduxjs/toolkit';
import { hideLoader, showLoader } from '../../app/appSlice';
import { RootState } from '../../../store';
import isEmpty from 'lodash.isempty';
import API from '../../../../utils/apiHelper';
import {
  setAuthoritiesDetails,
  setAuthoritiesList,
  setEntityFilterOptions,
} from '../administrativeAreaSlice';
import { mapOptions } from '../../../../utils/common';
import { formTypes } from '../../../../pages/administrator/AdministrativeArea/Entities/utils';

export interface AuthoritiesLightI {
  id: number;
  nome: string;
  profilo: string;
  tipologia: string;
}

export interface AuthoritiesListResponseI {
  numeroPagine: number;
  programmiLight: AuthoritiesLightI[];
}

const GetAllEntiAction = {
  type: 'administrativeArea/GetAllEnti',
};

export const GetAllEnti =
  () => async (dispatch: Dispatch, select: Selector) => {
    try {
      dispatch(showLoader());
      dispatch({ ...GetAllEntiAction });
      const {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        administrativeArea: { filters, pagination },
      } = select((state: RootState) => state);
      const endpoint = `ente/all`;
      let res;
      if (!isEmpty(filters)) {
        const body = {
          filtroRequest: { ...filters },
          idProgramma: 0,
          cfUtente: '',
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
        dispatch(setAuthoritiesList({ data: res.data.data.list }));
      }
    } finally {
      dispatch(hideLoader());
    }
  };

const GetFilterValuesEntiAction = {
  type: 'administrativeArea/GetFilterValuesEnti',
};
export const GetFilterValuesEnti =
  (dropdownType: 'profili' | 'stati' | 'progetti' | 'programmi') =>
  async (dispatch: Dispatch, select: Selector) => {
    try {
      dispatch({ ...GetFilterValuesEntiAction, dropdownType });
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
      const entityFilterEndpoint = `/ente/${dropdownType}/dropdown`;
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
    }
  };

const SetEnteDetailAction = {
  type: 'administrativeArea/GetEnteDetail',
};

export const GetEnteDetail = (type: string) => async (dispatch: Dispatch) => {
  try {
    let res;
    dispatch({ ...SetEnteDetailAction, type });
    switch (type) {
      case formTypes.ENTE_GESTORE_PROGETTO:
        res = await API.get('/ente/project1/gestoreProgetto/prova');
        break;
      case formTypes.ENTE_GESTORE_PROGRAMMA:
        res = await API.get('/ente/321321/gestoreProgramma/prova');
        break;
      case formTypes.ENTE_PARTNER:
        res = await API.get('/ente/project1/partner/prova');
        break;
      default:
        return;
    }
    if (res?.data) {
      dispatch(setAuthoritiesDetails(res.data));
    }
  } catch (e) {
    console.log({ e });
  }
};

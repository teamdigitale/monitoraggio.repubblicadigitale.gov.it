import { Dispatch, Selector } from '@reduxjs/toolkit';
import { hideLoader, showLoader } from '../../app/appSlice';
import { RootState } from '../../../store';
import isEmpty from 'lodash.isempty';
import API from '../../../../utils/apiHelper';
import {
  // setAuthorityGeneralInfo,
  setAuthoritiesList,
  setEntityFilterOptions,
  setAuthorityDetails,
  resetAuthorityDetails,
} from '../administrativeAreaSlice';
import { mapOptions } from '../../../../utils/common';
// import { formTypes } from '../../../../pages/administrator/AdministrativeArea/Entities/utils';

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
/*
export const sanitizeResult = (data: any) => Object.fromEntries(
  Object.entries(data).map(([key, value]) => {
    switch (key) {
      // case 'indirizzoPec': return ([key, 'pec@mail.com'])
      default: return ([key, value])
    }
  })
);
*/
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

const SetAuthorityDetailAction = {
  type: 'administrativeArea/GetAuthorityDetail',
};
/*
export const GetAuthorityDetail = (type: string) => async (dispatch: Dispatch) => {
  try {
    let res;
    dispatch({ ...SetAuthorityDetailAction, type });
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
      dispatch(setAuthorityDetails(res.data.data));
    }
  } catch (e) {
    console.log({ e });
  }
};
*/

export const GetAuthorityDetail =
  (authorityId: string) => async (dispatch: Dispatch) => {
    try {
      dispatch(showLoader());
      dispatch({ ...SetAuthorityDetailAction });

      const res = await API.get(`/ente/${authorityId}`);

      if (res?.data) {
        dispatch(
          setAuthorityDetails({
            profili: res.data.dettagliProfili,
            dettagliInfoEnte: res.data.dettagliEnte,
          })
        );
      }
    } catch (e) {
      console.log({ e });
    } finally {
      dispatch(hideLoader());
    }
  };

export const GetAuthorityManagerDetail =
  (entityId: string, entity: 'programma' | 'progetto') =>
  async (dispatch: Dispatch) => {
    try {
      dispatch(showLoader());
      dispatch({ ...SetAuthorityDetailAction });
      dispatch(resetAuthorityDetails());

      const res = await API.get(
        `/ente/${
          entity === 'programma' ? 'gestoreProgramma' : 'gestoreProgetto'
        }/${entityId}`
      );

      if (res.data) {
        dispatch(
          setAuthorityDetails({
            delegatiEnteGestore: res.data.delegatiEnteGestore,
            referentiEnteGestore: res.data.referentiEnteGestore,
            dettagliInfoEnte: Object.fromEntries(
              Object.entries(res.data.ente).map(([key, value]) =>
                key === 'partitaIva' ? ['piva', value] : [key, value]
              )
            ),
          })
        );
      }
    } catch (error) {
      console.log(error);
    } finally {
      dispatch(hideLoader());
    }
  };

const GetAuthoritiesBySearchAction = {
  type: 'administrativeArea/GetAuthoritiesBySearch',
};

export const GetAuthoritiesBySearch =
  (search: string) => async (dispatch: Dispatch) => {
    try {
      dispatch(showLoader());
      dispatch({ ...GetAuthoritiesBySearchAction });
      console.log(search);

      const body = {
        filtroRequest: {},
        idProgramma: 0,
        idProgetto: 0,
        cfUtente: 'UTENTE1',
        codiceRuolo: 'DTD',
      };

      const res = await API.post(`/ente/all`, body);

      if (res.data) {
        dispatch(setAuthoritiesList(res.data.enti));
      }
    } catch (error) {
      console.log(error);
    } finally {
      dispatch(hideLoader());
    }
  };

const CreateAuthorityAction = {
  type: 'administrativeArea/CreateAuthority',
};

export const CreateManagerAuthority =
  (authorityDetail: any, entityId: string, entity: 'programma' | 'progetto') =>
  async (dispatch: Dispatch) => {
    try {
      dispatch(showLoader());
      dispatch({ ...CreateAuthorityAction });

      const body = Object.fromEntries(
        Object.entries(authorityDetail).filter(([key, _value]) => key !== 'id')
      );

      if (body) {
        let res = await API.post(`/ente/`, {
          ...body,
        });
        if (res) {
          res = await API.put(
            `/${entity}/${entityId}/assegna/${
              entity === 'programma' ? 'entegestore' : 'enteGestore'
            }/${res.data.id}`
          );
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
      dispatch(hideLoader());
      // window.location.reload();
    }
  };

const UpdateAuthorityAction = {
  type: 'administrativeArea/UpdateAuthority',
};

export const UpdateManagerAuthority =
  (authorityDetail: any, entityId: string, entity: 'programma' | 'progetto') =>
  async (dispatch: Dispatch) => {
    try {
      dispatch(showLoader());
      dispatch({ ...UpdateAuthorityAction });

      if (authorityDetail) {
        let res = await API.put(
          `/ente/${authorityDetail.id}/${
            entity === 'programma' ? 'gestoreProgramma' : 'gestoreProgetto'
          }/${entityId}`,
          {
            ...authorityDetail,
          }
        );
        console.log(res);

        res = await API.put(
          `/${entity}/${entityId}/assegna/${
            entity === 'programma' ? 'entegestore' : 'enteGestore'
          }/${authorityDetail.id}`
        );

        return res;
      }
    } catch (error) {
      console.log(error);
    } finally {
      dispatch(hideLoader());
      // window.location.reload();
    }
  };

const RemoveAuthorityAction = {
  type: 'administrativeArea/RemoveAuthority',
};

export const RemoveManagerAuthority =
  (authorityId: string, entityId: string, entity: 'programma' | 'progetto') =>
  async (dispatch: Dispatch) => {
    try {
      dispatch(showLoader());
      dispatch({ ...RemoveAuthorityAction });

      if (authorityId && entityId) {
        await API.delete(
          `/ente/${authorityId}/cancellagestore${entity}/${entityId}`
        );
      }
    } catch (error) {
      console.log(error);
    } finally {
      dispatch(hideLoader());
    }
  };

export const CreatePartnerAuthority =
  (authorityDetail: any, entityId: string) => async (dispatch: Dispatch) => {
    try {
      dispatch(showLoader());
      dispatch({ ...CreateAuthorityAction });

      const body = Object.fromEntries(
        Object.entries(authorityDetail).filter(([key, _value]) => key !== 'id')
      );

      if (body) {
        let res = await API.post(`/ente/`, {
          ...body,
        });
        if (res) {
          res = await API.put(
            `/ente/partner/associa/${res.data.id}/progetto/${entityId}`
          );
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
      dispatch(hideLoader());
    }
  };

export const UpdatePartnerAuthority =
  (authorityDetail: any, entityId: string) => async (dispatch: Dispatch) => {
    try {
      dispatch(showLoader());
      dispatch({ ...UpdateAuthorityAction });
      if (authorityDetail) {
        await API.put(
          `/ente/partner/associa/${authorityDetail.id}/progetto/${entityId}`
        );
      }
    } catch (error) {
      console.log(error);
    } finally {
      dispatch(hideLoader());
    }
  };

export const RemovePartnerAuthority =
  (authorityId: string, entityId: string) => async (dispatch: Dispatch) => {
    try {
      dispatch(showLoader());
      dispatch({ ...RemoveAuthorityAction });

      if (authorityId && entityId) {
        await API.delete(
          `/ente/${authorityId}/cancellaentepartner/${entityId}`
        );
      }
    } catch (error) {
      console.log(error);
    } finally {
      dispatch(hideLoader());
    }
  };

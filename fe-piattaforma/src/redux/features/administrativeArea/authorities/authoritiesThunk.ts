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
import { getUserHeaders } from '../../user/userThunk';
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

export type UserAuthorityRole =
  | 'REG'
  | 'DEG'
  | 'REGP'
  | 'DEGP'
  | 'REPP'
  | 'DEPP';

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
        const { codiceFiscale, codiceRuolo, idProgramma } = getUserHeaders();
        const body = {
          filtroRequest: { ...filters },
          idProgramma,
          cfUtente: codiceFiscale,
          codiceRuolo,
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
      const { codiceFiscale, codiceRuolo, idProgramma } = getUserHeaders();
      const body = {
        cfUtente: codiceFiscale,
        codiceRuolo,
        filtroRequest: { ...filters },
        idProgramma,
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
            delegatiEnteGestore:
              entity === 'programma'
                ? res.data.delegatiEnteGestore
                : res.data.delegatiEnteGestoreProgetto,
            referentiEnteGestore:
              entity === 'programma'
                ? res.data.referentiEnteGestore
                : res.data.referentiEnteGestoreProgetto,
            dettagliInfoEnte: Object.fromEntries(
              Object.entries(res.data.ente).map(([key, value]) =>
                key === 'partitaIva' ? ['piva', value] : [key, value]
              )
            ),
            sediGestoreProgetto:
              entity === 'progetto' ? res.data.sediEnteGestoreProgetto : null,
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

      const { codiceFiscale, codiceRuolo, idProgramma, idProgetto } =
        getUserHeaders();

      const body = {
        filtroRequest: {},
        idProgramma,
        idProgetto,
        cfUtente: codiceFiscale,
        codiceRuolo,
      };

      const res = await API.post(`/ente/all`, body);

      if (search && res.data) {
        dispatch(setAuthoritiesList(res.data.enti));
      } else {
        dispatch(setAuthoritiesList([]));
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
        const res = await API.post(`/ente`, {
          ...body,
        });
        if (res) {
          await API.put(
            `/${entity}/${entityId}/assegna/${
              entity === 'programma' ? 'entegestore' : 'enteGestore'
            }/${res.data.id}`
          );
          return res.data.id;
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
      dispatch(hideLoader());
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

export const GetPartnerAuthorityDetail =
  (projectId: string, authorityId: string) => async (dispatch: Dispatch) => {
    dispatch(showLoader());
    dispatch({ ...SetAuthorityDetailAction });
    try {
      const res = await API.get(`/ente/partner/${projectId}/${authorityId}`);

      if (res.data) {
        dispatch(
          setAuthorityDetails({
            delegatiEntePartner: res.data.delegatiEntePartner,
            referentiEntePartner: res.data.referenteEntePartner,
            dettagliInfoEnte: Object.fromEntries(
              Object.entries(res.data.ente).map(([key, value]) =>
                key === 'partitaIva' ? ['piva', value] : [key, value]
              )
            ),
            sediEntePartner: res.data.sediEntePartner,
          })
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

const AssignReferentDelegateAction = {
  type: 'administrativeArea/AssignReferentDelegate',
};

export const AssignManagerAuthorityReferentDelegate =
  (
    authorityId: string,
    entityId: string,
    userDetail: {
      [key: string]: string | number | boolean | Date | string[] | undefined;
    },
    entity: 'programma' | 'progetto',
    role: UserAuthorityRole
  ) =>
  async (dispatch: Dispatch) => {
    try {
      dispatch(showLoader());
      dispatch({ ...AssignReferentDelegateAction });
      const endpoint =
        entity === 'programma'
          ? '/ente/associa/referenteDelegato/gestoreProgramma'
          : entity === 'progetto'
          ? '/ente/associa/referenteDelegato/gestoreProgetto'
          : '';
      let body = {};
      if (entity === 'programma') {
        body = {
          cfReferenteDelegato: userDetail?.codiceFiscale
            ?.toString()
            .toUpperCase(),
          codiceRuolo: role,
          idEnte: authorityId,
          idProgramma: entityId,
          mansione: userDetail.mansione,
        };
      } else {
        body = {
          cfUtente: userDetail?.codiceFiscale?.toString().toUpperCase(),
          codiceRuolo: role,
          idEnte: authorityId,
          idProgetto: entityId,
          mansione: userDetail.mansione,
        };
      }
      if (userDetail?.id) {
        await API.post(endpoint, body);
      } else {
        const payload = {
          telefono: userDetail?.telefono,
          codiceFiscale: userDetail?.codiceFiscale?.toString().toUpperCase(),
          cognome: userDetail?.cognome,
          email: userDetail?.email,
          mansione: userDetail?.mansione,
          nome: userDetail?.nome,
          ruolo: role,
          tipoContratto: '', // TODO: valore?
        };
        // eslint-disable-next-line no-case-declarations
        const res = await API.post(`/utente`, payload);
        if (res) {
          await API.post(endpoint, body);
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
      dispatch(hideLoader());
    }
  };

export const AssignPartnerAuthorityReferentDelegate =
  (
    authorityId: string,
    entityId: string,
    userDetail: {
      [key: string]: string | number | boolean | Date | string[] | undefined;
    },
    role: UserAuthorityRole
  ) =>
  async (dispatch: Dispatch) => {
    try {
      dispatch(showLoader());
      dispatch({ ...AssignReferentDelegateAction });
      const endpoint = '/ente/associa/referenteDelegato/partner';
      if (userDetail?.id) {
        await API.post(endpoint, {
          cfUtente: userDetail.codiceFiscale?.toString().toUpperCase(),
          codiceRuolo: role,
          idEnte: authorityId,
          idProgramma: entityId,
          mansione: userDetail.mansione,
        });
      } else {
        const payload = {
          telefono: userDetail?.telefono,
          codiceFiscale: userDetail.codiceFiscale?.toString().toUpperCase(),
          cognome: userDetail?.cognome,
          email: userDetail?.email,
          mansione: userDetail?.mansione,
          nome: userDetail?.nome,
          ruolo: role,
          tipoContratto: '', // TODO: valore?
        };
        // eslint-disable-next-line no-case-declarations
        const res = await API.post(`/utente`, payload);
        if (res) {
          await API.post(endpoint, {
            cfUtente: userDetail.codiceFiscale?.toString().toUpperCase(),
            codiceRuolo: role,
            idEntePartner: authorityId,
            idProgetto: entityId,
            mansione: userDetail.mansione,
          });
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
      dispatch(hideLoader());
    }
  };

const RemoveReferentDelegateAction = {
  type: 'administrativeArea/RemoveReferentDelegate',
};

export const RemoveReferentDelegate =
  (
    authorityId: string,
    entityId: string,
    userCF: string,
    role: UserAuthorityRole
  ) =>
  async (dispatch: Dispatch) => {
    try {
      dispatch(showLoader());
      dispatch({ ...RemoveReferentDelegateAction });
      switch (role) {
        case 'DEPP':
        case 'REPP':
          await API.post(
            '/ente/cancellaOTerminaAssociazione/referenteDelegato/partner',
            {
              cfUtente: userCF.toUpperCase(),
              codiceRuolo: role,
              idEntePartner: authorityId,
              idProgetto: entityId,
              mansione: 'string',
            }
          );
          break;
        case 'DEG':
        case 'REG':
          await API.post(
            '/ente/cancellaOTerminaAssociazione/referenteDelegato/gestoreProgramma',
            {
              cfReferenteDelegato: userCF.toUpperCase(),
              codiceRuolo: role,
              idEnte: authorityId,
              idProgramma: entityId,
              mansione: 'string',
            }
          );
          break;
        case 'DEGP':
        case 'REGP':
          await API.post(
            '/ente/cancellaOTerminaAssociazione/referenteDelegato/gestoreProgetto',
            {
              cfUtente: userCF.toUpperCase(),
              codiceRuolo: role,
              idEnte: authorityId,
              idProgetto: entityId,
              mansione: 'string',
            }
          );
          break;
        default:
          break;
      }
    } catch (error) {
      console.log(error);
    } finally {
      dispatch(hideLoader());
    }
  };

const UpdateAuthorityDetailsAction = {
  type: 'administrativeArea/UpdateAuthorityDetails',
};

export const UpdateAuthorityDetails =
  (idEnte: string | undefined, payload: any) => async (dispatch: Dispatch) => {
    try {
      dispatch(showLoader());
      dispatch({ ...UpdateAuthorityDetailsAction });

      await API.put(`/ente/${idEnte}`, payload);

      await API.get(`/ente/${idEnte}`);
    } catch (error) {
      console.log(error);
    } finally {
      dispatch(hideLoader());
    }
  };

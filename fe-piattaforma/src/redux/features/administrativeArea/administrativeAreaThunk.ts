import { Dispatch, Selector } from '@reduxjs/toolkit';
import API from '../../../utils/apiHelper';
import { hideLoader, showLoader } from '../app/appSlice';
import {
  setEntityDetail,
  setEntityFilterOptions,
  setEntityPagination,
  setEntityValues,
} from './administrativeAreaSlice';
import { RootState } from '../../store';
import { OptionType } from '../../../components/Form/select';
import {
  downloadCSV,
  transformFiltersToQueryParams,
} from '../../../utils/common';

interface EntityFilterValuesPayloadI {
  entity: string;
  dropdownType: string;
}

const GetValuesAction = {
  type: 'administrativeArea/GetEntityValues',
};
export const GetEntityValues =
  (payload?: any) => async (dispatch: Dispatch, select: Selector) => {
    try {
      dispatch(showLoader());
      dispatch({ ...GetValuesAction, payload }); // TODO manage dispatch for dev env only

      const {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        administrativeArea: { filters, pagination },
        // TODO get user cf, role, idProgramma, idProgetto
      } = select((state: RootState) => state);
      const entityEndpoint = `/${payload.entity}/all`;
      const filtroRequest: {
        [key: string]: string[] | undefined;
      } = {};
      Object.keys(filters).forEach((filter: string) => {
        if (
          filter === 'criterioRicerca' ||
          filter === 'filtroCriterioRicerca'
        ) {
          filtroRequest[filter] =
            filters[filter]?.value || filters[filter] || null;
        } else {
          filtroRequest[filter] = filters[filter]?.map(
            (value: OptionType) => value.value
          );
        }
      });

      const body = {
        filtroRequest,
        idProgramma: 0, //MOCK
        cfUtente: 'UTENTE1', //MOCK
        codiceRuolo: 'DTD', //MOCK DA MANTENERE SOLO NELL'HEADER
      };

      const res = await API.post(entityEndpoint, body, {
        params: {
          currPage: Math.max(0, pagination.pageNumber - 1),
          pageSize: pagination.pageSize,
        },
      });

      if (res?.data) {
        dispatch(setEntityValues({ entity: payload.entity, data: res.data }));
        dispatch(setEntityPagination({ totalPages: res.data.numeroPagine }));
      }
    } catch (error) {
      console.log('GetEntityValues error', error);
    } finally {
      dispatch(hideLoader());
    }
  };

const GetFilterValuesAction = {
  type: 'administrativeArea/GetEntityFilterValues',
};
export const GetEntityFilterValues =
  (payload: EntityFilterValuesPayloadI) =>
  async (dispatch: Dispatch, select: Selector) => {
    try {
      dispatch(showLoader());
      dispatch({ ...GetFilterValuesAction, payload });
      const {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        administrativeArea: { filters },
      } = select((state: RootState) => state);
      const filtroRequest: {
        [key: string]: string[] | undefined;
      } = {};
      Object.keys(filters).forEach((filter: string) => {
        if (
          filter === 'criterioRicerca' ||
          filter === 'filtroCriterioRicerca'
        ) {
          filtroRequest[filter] =
            filters[filter]?.value || filters[filter] || null;
        } else {
          filtroRequest[filter] = filters[filter]?.map(
            (value: OptionType) => value.value
          );
        }
      });
      const body = {
        filtroRequest,
        idProgramma: 0,
        cfUtente: 'UTENTE1', //MOCK
        codiceRuolo: 'DTD', //MOCK DA MANTENERE SOLO NELL'HEADER
      };
      const entityFilterEndpoint = `/${payload.entity}/${payload.dropdownType}${
        payload.entity === 'progetto' && payload.dropdownType === 'policies'
          ? '/programmi'
          : ''
      }/dropdown`;
      const res = await API.post(entityFilterEndpoint, body);
      if (res?.data?.length) {
        const filterResponse = {
          [payload.dropdownType]: res.data.map((option: string) => ({
            label:
              payload.dropdownType === 'stati'
                ? option[0] + option.slice(1).toLowerCase()
                : option,
            value: option.replace(/\s/g, '_'),
          })),
        };

        if (
          payload.dropdownType === 'programmi' ||
          payload.dropdownType === 'progetti'
        ) {
          filterResponse[payload.dropdownType] = res.data.map(
            (option: { nome: string; id: string | number }) => ({
              label: option.nome,
              value: option.id,
            })
          );
        }

        dispatch(setEntityFilterOptions(filterResponse));
      }
    } catch (error) {
      console.log('GetEntityFilterValues error', error);
    } finally {
      dispatch(hideLoader());
    }
  };

const GetEntityFilterQueryParamsValuesAction = {
  type: 'administrativeArea/GetEntityFilterQueryParamsValues',
};
export const GetEntityFilterQueryParamsValues =
  (payload: EntityFilterValuesPayloadI) =>
  async (dispatch: Dispatch, select: Selector) => {
    try {
      dispatch(showLoader());
      dispatch({ ...GetEntityFilterQueryParamsValuesAction, payload });
      const {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        administrativeArea: { filters },
      } = select((state: RootState) => state);
      const queryParamFilters = transformFiltersToQueryParams(filters);
      const body = {
        codiceFiscaleUtenteLoggato: 'UTENTE1', //MOCK
        codiceRuoloUtenteLoggato: 'DTD', //MOCK
        idProgetto: 0,
        idProgramma: 0,
      };
      const entityFilterEndpoint = `/${payload.entity}/${payload.dropdownType}/dropdown${queryParamFilters}`;
      const res = await API.post(entityFilterEndpoint, body);
      if (res?.data) {
        const filterResponse = {
          [payload.dropdownType]: res.data.data?.map((option: string) => ({ // TODO: togliere un data quando BE fixa chiamata
            label:
              payload.dropdownType === 'stati'
                ? option[0] + option.slice(1).toLowerCase()
                : option,
            value:
              payload.dropdownType === 'stati'
                ? option.replace(/\s/g, '_')
                : option,
          })),
        };
        dispatch(setEntityFilterOptions(filterResponse));
      }
    } catch (error) {
      console.log('GetEntityFilterQueryParamsValues error', error);
    } finally {
      dispatch(hideLoader());
    }
  };

const DownloadEntityValuesAction = {
  type: 'administrativeArea/DownloadEntityValues',
};
export const DownloadEntityValues =
  (payload: any) => async (dispatch: Dispatch, select: Selector) => {
    try {
      dispatch(showLoader());
      dispatch({ ...DownloadEntityValuesAction, payload });
      const {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        administrativeArea: { filters },
      } = select((state: RootState) => state);
      const body = {
        filtroRequest: {
          ...filters,
        },
        idProgramma: 0,
        cfUtente: 'UTENTE1', //MOCK
        codiceRuolo: 'DTD', //MOCK DA MANTENERE SOLO NELL'HEADER
      };
      const entityEndpoint = `/${payload.entity}/download`;
      const res = await API.post(entityEndpoint, body);
      if (res?.data) {
        downloadCSV(res.data, `${payload.entity}.csv`, true);
      }
    } catch (error) {
      console.log('DownloadEntityValues error', error);
    } finally {
      dispatch(hideLoader());
    }
  };

const DownloadEntityValuesQueryParamsAction = {
  type: 'administrativeArea/DownloadEntityValuesQueryParams',
};
export const DownloadEntityValuesQueryParams =
  (payload: any) => async (dispatch: Dispatch, select: Selector) => {
    try {
      dispatch(showLoader());
      dispatch({ ...DownloadEntityValuesQueryParamsAction, payload });
      const {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        administrativeArea: { filters },
      } = select((state: RootState) => state);
      const body = {
        codiceFiscaleUtenteLoggato: 'UTENTE1', //MOCK
        codiceRuoloUtenteLoggato: 'DTD', //MOCK
        idProgetto: 0,
        idProgramma: 0,
      };
      const queryParamFilters = transformFiltersToQueryParams(filters);
      const entityEndpoint = `/${payload.entity}/download${queryParamFilters}`;
      const res = await API.post(entityEndpoint, body);
      if (res?.data) {
        downloadCSV(res.data, `${payload.entity}.csv`, true);
      }
    } catch (error) {
      console.log('DownloadEntityValuesQueryParams error', error);
    } finally {
      dispatch(hideLoader());
    }
  };

const DeleteEntityAction = {
  type: 'administrativeArea/DeleteEntity',
};

export const DeleteEntity =
  (entity: string, id: string) => async (dispatch: Dispatch) => {
    try {
      dispatch(showLoader());
      dispatch({ ...DeleteEntityAction, entity, id });
      await API.delete(`/${entity}/${id}`);
    } catch (error) {
      console.log('DeleteEntity error', error);
    } finally {
      dispatch(hideLoader());
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

export const TerminateEntity =
  (
    entityId: string,
    entity: 'programma' | 'progetto',
    terminationDate: string
  ) =>
  async (dispatch: Dispatch) => {
    try {
      dispatch(showLoader());
      dispatch({ type: 'admistrativeArea/TerminateEntity' });
      if (entityId && terminationDate) {
        await API.put(
          `/${entity}/termina/${entityId}?dataTerminazione=${terminationDate}`
        );
      }
    } catch (error) {
      console.log(error);
    } finally {
      dispatch(hideLoader());
    }
  };

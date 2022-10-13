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
import { getUserHeaders } from '../user/userThunk';

export interface EntityFilterValuesPayloadI {
  entity: string;
  dropdownType: string;
  noFilters?: boolean;
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
      const { codiceFiscale, codiceRuolo, idProgramma, idProgetto } =
        getUserHeaders();
      const body = {
        filtroRequest,
        idProgramma,
        idProgetto,
        cfUtente: codiceFiscale,
        codiceRuolo,
      };

      const res = await API.post(entityEndpoint, body, {
        params: {
          currPage: Math.max(0, pagination.pageNumber - 1),
          pageSize: pagination.pageSize,
        },
      });

      if (res?.data) {
        dispatch(setEntityValues({ entity: payload.entity, data: res.data }));
        dispatch(
          setEntityPagination({
            totalPages: res.data.numeroPagine,
            totalElements: res.data.numeroTotaleElementi,
          })
        );
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
      if (!payload.noFilters) {
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
      }
      const { codiceFiscale, codiceRuolo, idProgramma, idProgetto } =
        getUserHeaders();
      const body = {
        filtroRequest,
        idProgramma,
        idProgetto,
        cfUtente: codiceFiscale,
        codiceRuolo,
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
            label: option,
            // payload.dropdownType === 'stati' ||
            // payload.dropdownType === 'ruoli'
            //   ? option[0] + option.slice(1).toLowerCase()
            //   : option,
            value: option,
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
      const { codiceFiscale, codiceRuolo, idProgramma, idProgetto } =
        getUserHeaders();
      const body = {
        codiceFiscaleUtenteLoggato: codiceFiscale,
        codiceRuoloUtenteLoggato: codiceRuolo,
        idProgetto,
        idProgramma,
      };
      const entityFilterEndpoint = `/${payload.entity}/${
        payload.dropdownType
      }/dropdown${payload?.noFilters ? '' : queryParamFilters}`;
      const res = await API.post(entityFilterEndpoint, body);
      if (res?.data) {
        const filterResponse = {
          [payload.dropdownType]: res.data.map((option: string) => ({
            label:
              payload.dropdownType === 'stati'
                ? option[0] + option.slice(1).toLowerCase()
                : option,
            value: option,
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
      const { codiceFiscale, codiceRuolo, idProgramma } = getUserHeaders();
      const body = {
        filtroRequest: {
          ...filters,
        },
        idProgramma,
        cfUtente: codiceFiscale,
        codiceRuolo,
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
      const { codiceFiscale, codiceRuolo, idProgramma, idProgetto } =
        getUserHeaders();
      const body = {
        codiceFiscaleUtenteLoggato: codiceFiscale,
        codiceRuoloUtenteLoggato: codiceRuolo,
        idProgetto,
        idProgramma,
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
      return true;
    } catch (error) {
      console.log('DeleteEntity error', error);
      return false;
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
        const res = await API.put(`/${entity}/termina/${entityId}`, {
          dataTerminazione: terminationDate,
        });
        if (res) {
          return true;
        }
      } else {
        return false;
      }
    } catch (error) {
      console.log(error);
      return false;
    } finally {
      dispatch(hideLoader());
    }
  };

const UploadFileAction = { type: 'user/UploadFile' };
export const UploadFile =
  (payload: { endpoint: string; formData: FormData }) =>
  async (dispatch: Dispatch) => {
    try {
      const { endpoint, formData } = payload;
      dispatch({ ...UploadFileAction, payload }); // TODO manage dispatch for dev env only
      dispatch(showLoader());
      const res = await API.post(endpoint, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        timeout: 20000,
      });

      if (res?.data) {
        return res.data;
      }
    } catch (error) {
      console.log('UploadFile error', error);
      return false;
    } finally {
      dispatch(hideLoader());
    }
  };

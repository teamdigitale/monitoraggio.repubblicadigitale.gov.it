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
import { downloadCSV } from '../../../utils/common';

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
            label: option,
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

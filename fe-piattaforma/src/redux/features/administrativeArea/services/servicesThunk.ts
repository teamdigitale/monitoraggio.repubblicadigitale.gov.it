import { Dispatch, Selector } from '@reduxjs/toolkit';
import API from '../../../../utils/apiHelper';
import { hideLoader, showLoader } from '../../app/appSlice';

import { RootState } from '../../../store';
import {
  setEntityFilterOptions,
  setServicesList,
  setServicesDetail,
  setServicesDetailCitizenList,
  setEntityPagination,
} from '../administrativeAreaSlice';
import { OptionType } from '../../../../components/Form/select';
import { transformFiltersToQueryParams } from '../../../../utils/common';

export interface ServicesI {
  id: string;
  nome: string;
  tipologiaServizio: string;
  data: string;
  facilitatore: string;
  stato: string;
}

export interface CitizenListI {
  numeroCittadini?: number;
  numeroPagine?: number;
  numeroQuestionariCompilati?: number;
  servizi: any[];
  // servizi: {
  //   codiceFiscale: string;
  //   cognome: string;
  //   idCittadino: number;
  //   idQuestionario: string;
  //   nome: string;
  //   statoQuestionario: string;
  // }[];
}

const GetAllServicesAction = { type: 'citizensArea/GetAllServices' };
export const GetAllServices =
  () => async (dispatch: Dispatch, select: Selector) => {
    try {
      dispatch({ ...GetAllServicesAction });
      dispatch(showLoader());
      const {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        administrativeArea: { filters, pagination },
      } = select((state: RootState) => state);
      const queryParamFilters = transformFiltersToQueryParams(filters);
      const entityEndpoint = `/servizio/all${queryParamFilters}`;
      const body = {
        codiceFiscaleUtenteLoggato: 'UTENTE1', // MOCK
        codiceRuoloUtenteLoggato: 'DTD', // MOCK
        idProgetto: 0, // MOCK
        idProgramma: 0, // MOCK
      };
      const res = await API.post(entityEndpoint, body, {
        params: {
          currPage: Math.max(0, pagination.pageNumber - 1),
          pageSize: pagination.pageSize,
        },
      });
      if (res?.data) {
        dispatch(setServicesList({ data: res.data.servizi || [] }));
        dispatch(
          setEntityPagination({
            totalPages: res.data.numeroPagine,
            totalElements: res.data.numeroTotaleElementi,
          })
        );
      }
    } catch (error) {
      console.log('GetAllServices administrativeArea error', error);
    } finally {
      dispatch(hideLoader());
    }
  };

const GetServicesDetailAction = {
  type: 'administrativeArea/GetServicesDetail',
};
export const GetServicesDetail =
  (id: string | undefined) => async (dispatch: Dispatch) => {
    try {
      dispatch(showLoader());
      dispatch({ ...GetServicesDetailAction, id });
      const res = await API.get(`/servizio/${id}/schedaDettaglio`);
      if (res?.data) {
        dispatch(setServicesDetail(res.data.data));
      }
    } catch (error) {
      console.log('GetEntityDetail administrativeArea error', error);
    } finally {
      dispatch(hideLoader());
    }
  };

const GetCitizenListServiceDetailAction = {
  type: 'administrativeArea/GetCitizenListServiceDetail',
};
export const GetCitizenListServiceDetail =
  (idServizio: string | undefined) =>
  async (dispatch: Dispatch, select: Selector) => {
    try {
      dispatch(showLoader());
      dispatch({ ...GetCitizenListServiceDetailAction, idServizio });
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
      let filterString = '?';
      Object.keys(filters).forEach((filter: string) => {
        if (filter === 'criterioRicerca') {
          if (filters[filter])
            filterString =
              filterString +
              (filterString !== '?' ? '&' : '') +
              filter +
              '=' +
              filters[filter];
        } else {
          filters[filter]?.map(
            (value: OptionType) =>
              (filterString =
                filterString +
                (filterString !== '?' ? '&' : '') +
                filter +
                '=' +
                value?.value)
          );
        }
      });
      const res = await API.post(
        `/servizio/cittadino/all/${idServizio}${filterString}`,
        body
      );
      if (res?.data) {
        dispatch(setServicesDetailCitizenList(res.data.data));
      }
    } catch (error) {
      console.log(
        'GetCitizenListServiceDetail administrativeArea error',
        error
      );
    } finally {
      dispatch(hideLoader());
    }
  };

const GetServicesDetailFiltersAction = {
  type: 'administrativeArea/GetServicesDetailFilters',
};
export const GetServicesDetailFilters =
  (idServizio: string | undefined) =>
  async (dispatch: Dispatch, select: Selector) => {
    try {
      dispatch({ ...GetServicesDetailFiltersAction, idServizio });
      dispatch(showLoader());
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
      const res = await API.post(
        `/servizio/cittadino/stati/dropdown/${idServizio}`,
        body,
        { params: { ...filters } }
      );
      if (res?.data) {
        const filterResponse = {
          stati: res.data.data.map((option: string) => ({
            label: option[0] + option.slice(1).toLowerCase(),
            value: option,
          })),
        };
        dispatch(setEntityFilterOptions(filterResponse));
      }
    } catch (error) {
      console.log('GetEntityFilterValues administrativeArea error', error);
    } finally {
      dispatch(hideLoader());
    }
  };

const CreateServiceAction = {
  type: 'administrativeArea/CreateService',
};
export const CreateService = (payload: any) => async (dispatch: Dispatch) => {
  try {
    dispatch(showLoader());
    dispatch({ ...CreateServiceAction, payload });
    await API.post(`/servizio`, payload);
  } catch (error) {
    console.log('CreateService administrativeArea error', error);
  } finally {
    dispatch(hideLoader());
  }
};

const UpdateServiceAction = {
  type: 'administrativeArea/UpdateService',
};
export const UpdateService =
  (idServizio: string, payload: any) => async (dispatch: Dispatch) => {
    try {
      dispatch(showLoader());
      dispatch({ ...UpdateServiceAction, idServizio });
      await API.put(`/servizio/${idServizio}`, payload);
    } catch (error) {
      console.log('UpdateService administrativeArea error', error);
    } finally {
      dispatch(hideLoader());
    }
  };

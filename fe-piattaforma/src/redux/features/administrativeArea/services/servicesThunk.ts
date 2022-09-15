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
  setServicesDropdownCreation,
  setServicesSchemaFieldsCreation,
  setServiceQuestionarioTemplateIstanze,
} from '../administrativeAreaSlice';
import { transformFiltersToQueryParams } from '../../../../utils/common';
import { getUserHeaders } from '../../user/userThunk';

export interface ServicesI {
  id: string;
  nome: string;
  tipologiaServizio: string[];
  data: string;
  facilitatore: string;
  stato: string;
}

export interface CitizenListI {
  numeroCittadini?: number;
  numeroPagine?: number;
  numeroQuestionariCompilati?: number;
  cittadini: any[];
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
      const { codiceFiscale, codiceRuolo, idProgramma, idProgetto } =
        getUserHeaders();
      const body = {
        codiceFiscaleUtenteLoggato: codiceFiscale,
        codiceRuoloUtenteLoggato: codiceRuolo,
        idProgetto,
        idProgramma,
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
        dispatch(setServicesDetail(res.data));
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
      const { codiceFiscale, codiceRuolo, idProgramma, idProgetto } =
        getUserHeaders();
      const body = {
        codiceFiscaleUtenteLoggato: codiceFiscale,
        codiceRuoloUtenteLoggato: codiceRuolo,
        idProgetto,
        idProgramma,
      };
      const queryParamFilters = transformFiltersToQueryParams(filters);
      const res = await API.post(
        `/servizio/cittadino/all/${idServizio}${queryParamFilters}`,
        body,
      );
      if (res?.data) {
        dispatch(setServicesDetailCitizenList(res.data));
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
      const { codiceFiscale, codiceRuolo, idProgramma, idProgetto } =
        getUserHeaders();
      const body = {
        codiceFiscaleUtenteLoggato: codiceFiscale,
        codiceRuoloUtenteLoggato: codiceRuolo,
        idProgetto,
        idProgramma,
      };
      const queryParamFilters = transformFiltersToQueryParams(filters);
      const res = await API.post(
        `/servizio/cittadino/stati/dropdown/${idServizio}${queryParamFilters}`,
        body,
      );
      if (res?.data) {
        const filterResponse = {
          stati: res.data.map((option: string) => ({
            label: option[0] + option.slice(1).toLowerCase().replace('_', ' '),
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
    const res = await API.post(`/servizio`, payload);
    if (res) {
      return res;
    }
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

const GetValuesDropdownServiceCreationAction = {
  type: 'administrativeArea/GetValuesDropdownServiceCreation',
};
export const GetValuesDropdownServiceCreation =
  (payload: { dropdownType: string; idEnte?: number }) =>
  async (dispatch: Dispatch) => {
    try {
      dispatch({ ...GetValuesDropdownServiceCreationAction });
      dispatch(showLoader());
      const entityEndpoint = `/servizio/facilitatore/${payload.dropdownType}/dropdown`;
      const { codiceFiscale, codiceRuolo, idProgramma, idProgetto } =
        getUserHeaders();
      let body = {};
      if (payload.dropdownType !== 'sedi') {
        body = {
          codiceFiscaleUtenteLoggato: codiceFiscale,
          codiceRuoloUtenteLoggato: codiceRuolo,
          idProgetto,
          idProgramma,
        };
      } else {
        body = {
          codiceFiscaleUtenteLoggato: codiceFiscale,
          codiceRuoloUtenteLoggato: codiceRuolo,
          idProgetto,
          idProgramma,
          idEnte: payload.idEnte,
        };
      }
      const res = await API.post(entityEndpoint, body);
      if (res?.data) {
        const dropdownOptions: { [key: string]: string | number }[] = [];
        (res.data || []).map((elem: { [key: string]: string | number }) =>
          dropdownOptions.push({ label: elem?.nome, value: elem?.id })
        );
        dispatch(
          setServicesDropdownCreation({
            [payload.dropdownType]: dropdownOptions,
          })
        );
      }
    } catch (error) {
      console.log(
        'GetValuesDropdownServiceCreation administrativeArea error',
        error
      );
    } finally {
      dispatch(hideLoader());
    }
  };

const GetSurveyTemplateServiceCreationAction = {
  type: 'administrativeArea/GetSurveyTemplateServiceCreation',
};

export const GetSurveyTemplateServiceCreation =
  () => async (dispatch: Dispatch) => {
    try {
      dispatch({ ...GetSurveyTemplateServiceCreationAction });
      dispatch(showLoader());
      const { idProgramma } = getUserHeaders();
      const res = await API.get(
        `questionarioTemplate/programma/${idProgramma}`
      );
      if (res?.data) {
        dispatch(setServicesSchemaFieldsCreation(res.data));
      }
    } catch (error) {
      console.log(
        'GetSurveyTemplateServiceCreation administrativeArea error',
        error
      );
    } finally {
      dispatch(hideLoader());
    }
  };

const DeleteServiceAction = {
  type: 'administrativeArea/DeleteService',
};
export const DeleteService =
  (idServizio: string) => async (dispatch: Dispatch) => {
    try {
      dispatch(showLoader());
      dispatch({ ...DeleteServiceAction, idServizio });
      await API.delete(`/servizio/${idServizio}`);
    } catch (error) {
      console.log('DeleteService administrativeArea error', error);
    } finally {
      dispatch(hideLoader());
    }
  };

const AssociateCitizenToServiceAction = {
  type: 'administrativeArea/AssociateCitizenToService',
};
export const AssociateCitizenToService =
  (payload: { idServizio: string, body: { [key: string]: string | number | boolean | Date | string[] | undefined; } }) => async (dispatch: Dispatch) => {
    try {
      dispatch({ ...AssociateCitizenToServiceAction });
      dispatch(showLoader());
      const res = await API.post(`/servizio/cittadino/${payload.idServizio}`, payload.body);
      if (res?.data) {
        // TODO: check if correct
      }
    } catch (error) {
      console.log('GetAllServices administrativeArea error', error);
    } finally {
      dispatch(hideLoader());
    }
  };

  const SendSurveyToCitizenAction = {
    type: 'administrativeArea/SendSurveyToCitizen',
  };

  export const SendSurveyToCitizen =
  (idCittadino: string, idQuestionario: string) => async (dispatch: Dispatch) => {
    try {
      dispatch({ ...SendSurveyToCitizenAction });
      dispatch(showLoader());
      const res = await API.post(`/servizio/cittadino/questionarioCompilato/invia?idCittadino=${idCittadino}&idQuestionario=${idQuestionario}`);
      return res;
    } catch (error) {
      console.log('SendSurveyToCitizen administrativeArea error', error);
      return 'error';
    } finally {
      dispatch(hideLoader());
    }
  };

  const SendSurveyToAllAction = {
    type: 'administrativeArea/SendSurveyToAll',
  };

  export const SendSurveyToAll =
  (idServizio?: string) => async (dispatch: Dispatch) => {
    try {
      dispatch({ ...SendSurveyToAllAction });
      dispatch(showLoader());
      await API.post(`/servizio/cittadino/servizio/${idServizio}/questionarioCompilato/inviaATutti`);
    } catch (error) {
      console.log('SendSurveyToAll administrativeArea error', error);
    } finally {
      dispatch(hideLoader());
    }
  };

  const GetCompiledSurveyCitizenServiceAction = {
    type: 'administrativeArea/GetCompiledSurveyCitizenService',
  };

  export const GetCompiledSurveyCitizenService =
  (idQuestionarioCompilato: string) => async (dispatch: Dispatch) => {
    try {
      dispatch({ ...GetCompiledSurveyCitizenServiceAction });
      dispatch(showLoader());
      const res = await API.get(`/servizio/cittadino/questionarioCompilato/compilato/${idQuestionarioCompilato}`);
      if (res?.data) {
        dispatch(setServiceQuestionarioTemplateIstanze(res.data.sezioniQuestionarioTemplateIstanze));
      }

    } catch (error) {
      console.log('GetCompiledSurveyCitizenService administrativeArea error', error);
    } finally {
      dispatch(hideLoader());
    }
  };
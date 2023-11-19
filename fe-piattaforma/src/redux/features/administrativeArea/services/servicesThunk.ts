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
      //const entityEndpoint = `${process?.env?.QUESTIONARIO_CITTADINO}/servizio/all${queryParamFilters}`;
      //const { codiceFiscale, codiceRuolo, idProgramma, idProgetto, idEnte } =
        //getUserHeaders();
      /*const body = {
        cfUtenteLoggato: codiceFiscale,
        codiceRuoloUtenteLoggato: codiceRuolo,
        idProgetto,
        idProgramma,
        idEnte,
      };*/
      /*const res = await API.post(entityEndpoint, body, {
        params: {
          currPage: Math.max(0, pagination.pageNumber - 1),
          pageSize: pagination.pageSize,
        },
      });*/
      const res = {
        data: {
          "numeroPagine": 1,
          "numeroTotaleElementi": 3,
          "servizi": [
            {
              "data": "2022-06-27T12:49:26.762Z",
              "facilitatore": "Simone Viola",
              "id": "1",
              "nome": "Nome Servizio 1",
              "stato": "ATTIVO",
              "tipologiaServizio": "Facilitazione"
            },
            {
              "data": "2022-06-27T12:49:26.762Z",
              "facilitatore": "Paola Neri",
              "id": "2",
              "nome": "Nome Servizio 2",
              "stato": "ATTIVO",
              "tipologiaServizio": "Formazione in presenza"
            },
            {
              "data": "2022-06-27T12:49:26.762Z",
              "facilitatore": "Sofia Bianchi",
              "id": "3",
              "nome": "Nome Servizio 3",
              "stato": "ATTIVO",
              "tipologiaServizio": "Formazione online"
            }
          ]
        }
      }      
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
      //const { idProgramma, idProgetto, idEnte } = getUserHeaders();
      /*const res = await API.post(`${process?.env?.QUESTIONARIO_CITTADINO}/servizio/${id}/schedaDettaglio`, {
        idProgramma,
        idProgetto,
        idEnte,
      });*/
      const res = {
        "data": {
          "dettaglioServizio": {
            "nomeEnte": "nome ente",
            "nomeSede": "nome sede",
            "nomeServizio": "servizio",
            "sezioneQ3compilato": {
              "dataOraCreazione": "2022-07-07T09:01:45.308Z",
              "dataOraUltimoAggiornamento": "2022-07-07T09:01:45.308Z",
              "id": "1",
              "mongoId": "string",
              "sezioneQ1Compilato": "{'id':'anagraphic-service-section','title':'Anagrafica del servizio','properties':[{'22':['2022-07-24'],'23':['10:00'],'24':['18:00'],'25':['Facilitazione'],'26':['Comunicazione e collaborazione'],'27':['Interagire attraverso le tecnologie digitali'],'28':['test'],'29':['dettagli']}']}",
              "sezioneQ3Compilato": "{'id':'anagraphic-service-section','title':'Anagrafica del servizio','properties':[{'22':['2022-07-24'],'23':['10:00'],'24':['18:00'],'25':['Facilitazione'],'26':['Comunicazione e collaborazione'],'27':['Interagire attraverso le tecnologie digitali'],'28':['test'],'29':['dettagli']}']}"
            },
            "tipologiaServizio": "tipo servizio"
          },
          "progettiAssociatiAlServizio": [
            {
              "id": 1,
              "nomeBreve": "progetto 1",
              "stato": "NON ATTIVO"
            },
            {
              "id": 2,
              "nomeBreve": "progetto 2",
              "stato": "NON ATTIVO"
            },
            {
              "id": 3,
              "nomeBreve": "progetto 3",
              "stato": "NON ATTIVO"
            }
          ]
        }
      }      
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
  (idServizio: string | undefined, pagination?: boolean) =>
  async (dispatch: Dispatch, select: Selector) => {
    try {
      dispatch(showLoader());
      dispatch({ ...GetCitizenListServiceDetailAction, idServizio });
      const {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        administrativeArea: { filters },
      } = select((state: RootState) => state);
      const { codiceFiscale, codiceRuolo, idProgramma, idProgetto, idEnte } =
        getUserHeaders();
      const body = {
        codiceFiscaleUtenteLoggato: codiceFiscale,
        codiceRuoloUtenteLoggato: codiceRuolo,
        idProgetto,
        idProgramma,
        idEnte,
      };
      console.log(body)
      let queryParamFilters = transformFiltersToQueryParams(filters);
      if (pagination) {
        queryParamFilters =
          queryParamFilters === ''
            ? '?currPage=0&pageSize=1000'
            : queryParamFilters + '&currPage=0&pageSize=1000';
      }
      console.log(queryParamFilters)
      /*const res = await API.post(
        `${process?.env?.QUESTIONARIO_CITTADINO}/cittadino/all/${idServizio}${queryParamFilters}`,
        body
      );*/
      const res = {
        "data": {
          "numeroCittadini": 0,
          "numeroPagine": 0,
          "numeroQuestionariCompilati": 0,
          "servizi": [
            {
              "codiceFiscale": "string",
              "cognome": "Rossi",
              "idCittadino": 0,
              "idQuestionario": "1",
              "nome": "Nino",
              "statoQuestionario": "INVIATO"
            }
          ]
        }
      }      
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
      const { codiceFiscale, codiceRuolo, idProgramma, idProgetto, idEnte } =
        getUserHeaders();
      const body = {
        codiceFiscaleUtenteLoggato: codiceFiscale,
        codiceRuoloUtenteLoggato: codiceRuolo,
        idProgetto,
        idProgramma,
        idEnte,
      };
      const queryParamFilters = transformFiltersToQueryParams(filters);
      const res = await API.post(
        `/servizio/cittadino/stati/dropdown/${idServizio}${queryParamFilters}`,
        body
      );
      if (res?.data) {
        const filterResponse = {
          stati: res.data.map((option: string) => ({
            label: option.replace('_', ' '),
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
    const { idProgramma, idProgetto, idEnte } = getUserHeaders();
    const res = await API.post(`/servizio`, {
      ...payload,
      idProgramma,
      idProgetto,
      idEnte,
    });
    if (res) {
      return res;
    }
  } catch (error) {
    console.log('CreateService administrativeArea error', error);
    return false;
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
      const res = await API.put(`/servizio/${idServizio}`, {
        ...payload,
        profilazioneParam: undefined,
      });
      if (res) {
        return true;
      }
    } catch (error) {
      console.log('UpdateService administrativeArea error', error);
      return false;
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
      const { codiceFiscale, codiceRuolo, idProgramma, idProgetto, idEnte } =
        getUserHeaders();
      let body = {};
      if (payload.dropdownType !== 'sedi') {
        body = {
          codiceFiscaleUtenteLoggato: codiceFiscale,
          codiceRuoloUtenteLoggato: codiceRuolo,
          idProgetto,
          idProgramma,
          idEnte,
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
      const { idProgramma, idProgetto, idEnte } = getUserHeaders();
      const res = await API.post(
        `questionarioTemplate/programma/${idProgramma}`,
        { idProgramma, idProgetto, idEnte }
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
      const { idProgramma, idProgetto, idEnte } = getUserHeaders();
      await API.delete(`/servizio/${idServizio}`, {
        data: { idProgramma, idProgetto, idEnte },
      });
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
  (payload: {
    idServizio: string;
    body: {
      [key: string]: string | number | boolean | Date | string[] | undefined;
    };
  }) =>
  async (dispatch: Dispatch) => {
    try {
      dispatch({ ...AssociateCitizenToServiceAction });
      dispatch(showLoader());
      const { idProgramma, idProgetto, idEnte, codiceFiscale, codiceRuolo } = getUserHeaders();
      const res = await API.post(`/servizio/cittadino/${payload.idServizio}`, {
        ...payload.body,
        idProgramma,
        idProgetto,
        idEnte,
        cfUtenteLoggato: codiceFiscale,
        codiceRuoloUtenteLoggato: codiceRuolo
      });
      if (res) {
        return true;
      }
    } catch (error) {
      console.log('GetAllServices administrativeArea error', error);
      return false;
    } finally {
      dispatch(hideLoader());
    }
  };

const SendSurveyToCitizenAction = {
  type: 'administrativeArea/SendSurveyToCitizen',
};

export const SendSurveyToCitizen =
  (idCittadino: string, idQuestionario: string) =>
  async (dispatch: Dispatch) => {
    try {
      dispatch({ ...SendSurveyToCitizenAction });
      dispatch(showLoader());
      const { idProgramma, idProgetto, idEnte } = getUserHeaders();
      const res = await API.post(
        `/servizio/cittadino/questionarioCompilato/invia?idCittadino=${idCittadino}&idQuestionario=${idQuestionario}`,
        { idProgramma, idProgetto, idEnte }
      );
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
      const { idProgramma, idProgetto, idEnte } = getUserHeaders();
      const res = await API.post(
        `/servizio/cittadino/servizio/${idServizio}/questionarioCompilato/inviaATutti`,
        { idProgramma, idProgetto, idEnte }
      );
      return res;
    } catch (error) {
      console.log('SendSurveyToAll administrativeArea error', error);
      return 'error';
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
      const { idProgramma, idProgetto, idEnte } = getUserHeaders();
      dispatch(showLoader());
      const res = await API.post(
        `/servizio/cittadino/questionarioCompilato/compilato/${idQuestionarioCompilato}`,
        { idProgramma, idProgetto, idEnte }
      );
      if (res?.data) {
        dispatch(
          setServiceQuestionarioTemplateIstanze(
            res.data.sezioniQuestionarioTemplateIstanze
          )
        );
      }
    } catch (error) {
      console.log(
        'GetCompiledSurveyCitizenService administrativeArea error',
        error
      );
    } finally {
      dispatch(hideLoader());
    }
  };

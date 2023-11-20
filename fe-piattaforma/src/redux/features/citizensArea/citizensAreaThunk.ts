import { Dispatch, Selector } from '@reduxjs/toolkit';
import API from '../../../utils/apiHelper';
import { hideLoader, showLoader } from '../app/appSlice';
import {
  getEntityDetail,
  setEntityFilterOptions,
  setEntityValues,
  setEntityPagination,
  setCitizenSearchResults,
} from './citizensAreaSlice';
import { RootState } from '../../store';
// import { mapOptions } from '../../../utils/common';
import { OptionType } from '../../../components/Form/select';
import { downloadCSV, mapOptionsCitizens } from '../../../utils/common';
import { getUserHeaders } from '../user/userThunk';
import { AES } from 'crypto-js';

const GetValuesAction = { type: 'citizensArea/GetEntityValues' };

export const GetEntityValues =
  (payload?: any) => async (dispatch: Dispatch, select: Selector) => {
    try {
      dispatch({ ...GetValuesAction, payload });
      dispatch(showLoader());
      const {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        citizensArea: { filters, pagination },
      } = select((state: RootState) => state);
      //const entityEndpoint = `${process?.env?.QUESTIONARIO_CITTADINO}/cittadino/all`;
      const filtroRequest: {
        [key: string]: string | undefined;
      } = {};
      Object.keys(filters).forEach((filter: string) => {
        if (filter === 'criterioRicerca') {
          filtroRequest[filter] =
          filters[filter]?.value || filters[filter] || null;
        } else {
          filtroRequest[filter] = filters[filter]?.map(
            (value: OptionType) => value.value
          );
        }
      });
      //const { codiceFiscale, codiceRuolo, idProgramma, idProgetto, idEnte } =
        //getUserHeaders();
        if(filtroRequest.criterioRicerca) {
          filtroRequest.criterioRicerca = AES.encrypt(filtroRequest.criterioRicerca, process?.env?.KEY_SECRET as string).toString();
        }
      /*const body = {
        filtro: filtroRequest,
        idProgetto,
        idProgramma,
        idEnte,
        cfUtenteLoggato: codiceFiscale,
        codiceRuoloUtenteLoggato: codiceRuolo,
      };*/
      /*API.post(entityEndpoint, body, {
        params: {
          currPage: Math.max(0, pagination.pageNumber - 1),
          pageSize: pagination.pageSize,
        },
      }).then((res: any) => {*/
      const res = {
        data: 
        {
          cittadini: [
            {
              id: 1,
              nome: "Cittadino 1",
              cognome: "Cognome 1",
              numeroQuestionariCompilati: 0,
              numeroServizi: 0,
              dataOraAggiornamento: new Date()
            },
            {
              id: 2,
              nome: "Cittadino 2",
              cognome: "Cognome 2",
              numeroQuestionariCompilati: 0,
              numeroServizi: 0,
              dataOraAggiornamento: new Date(),
              submitted: "2",
              onDraft: "1",
              status: "COMPLETATO"
            },
            {
              id: 3,
              nome: "Cittadino 3",
              cognome: "Cognome 3",
              numeroQuestionariCompilati: 0,
              numeroServizi: 0,
              dataOraAggiornamento: new Date(),
              submitted: "11",
              onDraft: "1",
              status: "IN BOZZA"
            }
          ],
          numeroPagine: 0,
          numeroTotaleElementi: 3
        }        
      }
        if (res?.data) {
          dispatch(
            setEntityValues({
              entity: payload.entity,
              data: res.data.cittadini,
            })
          );
          dispatch(
            setEntityPagination({
              totalPages: res.data.numeroPagine,
              totalElements: res.data.numeroTotaleElementi,
            })
          );
        }
      
    } catch (error) {
      console.log('GetEntityValues citizensArea error', error);
    } finally {
      dispatch(hideLoader());
    }
  };

const GetFilterValuesAction = {
  type: 'citizensArea/GetFilterValues',
};
export const GetEntityFilterValues =
  (entityFilter: any) => async (dispatch: Dispatch, select: Selector) => {
    try {
      dispatch({ ...GetFilterValuesAction });
      dispatch(showLoader());
      const {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        citizensArea: { filters },
      } = select((state: RootState) => state);
      // } = select((state: RootState) => state);
      const entityFilterEndpoint = `${process?.env?.QUESTIONARIO_CITTADINO}cittadino/${entityFilter}/dropdown`;
      const filtroRequest: {
        [key: string]: string[] | undefined;
      } = {};
      Object.keys(filters).forEach((filter: string) => {
        if (filter === 'criterioRicerca') {
          filtroRequest[filter] =
            filters[filter]?.value || filters[filter] || null;
        } else {
          filtroRequest[filter] = filters[filter]?.map(
            (value: OptionType) => value.value
          );
        }
      });
      const { codiceFiscale, codiceRuolo, idProgramma, idProgetto, idEnte } =
        getUserHeaders();
      const body = {
        filtro: filtroRequest,
        idProgetto,
        idProgramma,
        idEnte,
        cfUtenteLoggato: codiceFiscale,
        codiceRuoloUtenteLoggato: codiceRuolo,
      };
      API.post(entityFilterEndpoint, body).then((res) => {
        if (res?.data) {
          dispatch(
            setEntityFilterOptions({
              [entityFilter]: mapOptionsCitizens(res.data),
            })
          );
        }
      });
    } catch (error) {
      console.log('GetEntityFilterValues citizensArea error', error);
    } finally {
      dispatch(hideLoader());
    }
  };

const GetEntityDetailAction = {
  type: 'citizensArea/GetEntityDetail',
};
export const GetEntityDetail =
  (idCittadino: string | undefined) => async (dispatch: Dispatch) => {
    try {
      dispatch(showLoader());
      dispatch({ ...GetEntityDetailAction, idCittadino });
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
      //const res = await API.post(`cittadino/${idCittadino}`, body);
      const res = {
        data: {
          dettaglioCittadino: {
            id: 1,
            codiceFiscale: "RSSNTN82D14A783S",
            tipoDocumento: "Patente",
            numeroDocumento: "576545",
            genere: "F",
            fasciaDiEta: "5",
            titoloDiStudio: "Laurea magistrale (5 anni) / Master di I livello / Specializzazione post-laurea (2 anni)",
            occupazione: "Disoccupato/a",
            provincia: "Caserta",
            cittadinanza: "Italiana"
          },
          serviziCittadino: [
            {
              idQuestionarioCompilato: 1,
              idServizio: 1,
              nomeCompletoFacilitatore: "nome facilitatore",
              nomeServizio: "Servizio 1",
              nomeSede: "CAMPANIA",
              statoQuestionario: "ATTIVO"
            }
          ]
        }
      }      
      if (res?.data) {
        dispatch(getEntityDetail(res.data));
      }
    } catch (error) {
      console.log('GetEntityDetail citizensArea error', error);
    } finally {
      dispatch(hideLoader());
    }
  };

const GetEntitySearchResultAction = {
  type: 'citizensArea/GetEntitySearchResult',
};

export const GetEntitySearchResult =
  (searchValue: string, searchType: string) => async (dispatch: Dispatch) => {
    try {
      dispatch({ ...GetEntitySearchResultAction, searchValue, searchType });
      dispatch(showLoader());
      const body = {
        criterioRicerca: searchValue,
        tipoDocumento: searchType === 'codiceFiscale' ? 'CF' : 'NUM_DOC',
      };
      const res = await API.post(`/servizio/cittadino`, body);
      if (res?.data) {
        if (Array.isArray(res.data)) {
          dispatch(setCitizenSearchResults(res.data));
        }
      }
    } catch (error) {
      console.log('GetEntitySearchResult citizensArea error', error);
    } finally {
      dispatch(hideLoader());
    }
  };

const UpdateCitizenDetailAction = {
  type: 'citizensArea/UpdateCitizenDetail',
};
export const UpdateCitizenDetail =
  (
    idCittadino: string | undefined,
    body: {
      [key: string]: string | number | boolean | Date | string[] | undefined;
    }
  ) =>
  async (dispatch: Dispatch) => {
    try {
      dispatch(showLoader());
      dispatch({ ...UpdateCitizenDetailAction, idCittadino, body });
      const { idProgramma, idProgetto, idEnte } = getUserHeaders();
      const res = await API.put(`cittadino/${idCittadino}`, {
        ...body,
        idProgramma,
        idProgetto,
        idEnte,
      });
      if (res) {
        return true;
      }
    } catch (error) {
      console.log('UpdateCitizenDetail citizensArea error', error);
      return false;
    } finally {
      dispatch(hideLoader());
    }
  };

const DownloadEntityValuesAction = {
  type: 'citizensArea/DownloadEntityValues',
};
export const DownloadEntityValues =
  () => async (dispatch: Dispatch, select: Selector) => {
    try {
      dispatch(showLoader());
      dispatch({ ...DownloadEntityValuesAction });
      const {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        citizensArea: { filters },
      } = select((state: RootState) => state);
      const { codiceFiscale, codiceRuolo, idProgramma, idProgetto, idEnte } =
        getUserHeaders();
      const body = {
        codiceFiscaleUtenteLoggato: codiceFiscale,
        codiceRuoloUtenteLoggato: codiceRuolo,
        filtro: {
          ...filters,
        },
        idProgetto,
        idProgramma,
        idEnte,
      };
      const entityEndpoint = `/cittadino/download`;
      const res = await API.post(entityEndpoint, body);
      if (res?.data) {
        downloadCSV(res.data, `cittadino.csv`, true);
      }
    } catch (error) {
      console.log('citizensArea error', error);
    } finally {
      dispatch(hideLoader());
    }
  };

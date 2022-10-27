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
      const entityEndpoint = `/cittadino/all`;
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
        codiceFiscaleUtenteLoggato: codiceFiscale,
        codiceRuoloUtenteLoggato: codiceRuolo,
      };
      const res = await API.post(entityEndpoint, body, {
        params: {
          currPage: Math.max(0, pagination.pageNumber - 1),
          pageSize: pagination.pageSize,
        },
      });
      if (res?.data) {
        dispatch(
          setEntityValues({ entity: payload.entity, data: res.data.cittadini })
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
      const entityFilterEndpoint = `cittadino/${entityFilter}/dropdown`;
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
        codiceFiscaleUtenteLoggato: codiceFiscale,
        codiceRuoloUtenteLoggato: codiceRuolo,
      };
      const res = await API.post(entityFilterEndpoint, body);
      if (res?.data) {
        dispatch(
          setEntityFilterOptions({
            [entityFilter]: mapOptionsCitizens(res.data),
          })
        );
      }
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
      const res = await API.post(`cittadino/${idCittadino}`, body);
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
      const res = await API.put(`cittadino/${idCittadino}`, body);
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

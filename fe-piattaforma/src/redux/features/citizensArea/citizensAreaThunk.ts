import { Dispatch, Selector } from '@reduxjs/toolkit';
import API from '../../../utils/apiHelper';
import { hideLoader, showLoader } from '../app/appSlice';
import {
  getEntityDetail,
  setCitizenSearchResults,
  setEntityFilterOptions,
  setEntityPagination,
  setEntityValues,
} from './citizensAreaSlice';
import { RootState } from '../../store';
import { OptionType } from '../../../components/Form/select';
import { downloadCSV, mapOptionsCitizens } from '../../../utils/common';
import { getUserHeaders } from '../user/userThunk';

const GetValuesAction = { type: 'citizensArea/GetEntityValues' };
// eslint-disable-next-line @typescript-eslint/no-var-requires
const AES256 = require('aes-everywhere');

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
      const entityEndpoint = `${process?.env?.QUESTIONARIO_CITTADINO}cittadino/all`;
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
      const { codiceFiscale, codiceRuolo, idProgramma, idProgetto, idEnte } =
        getUserHeaders();
      if (filtroRequest.criterioRicerca) {
        filtroRequest.criterioRicerca = AES256.encrypt(
          filtroRequest.criterioRicerca.toUpperCase(),
          process?.env?.AES256_KEY
        );
      }
      const body = {
        filtro: filtroRequest,
        idProgetto,
        idProgramma,
        idEnte,
        cfUtenteLoggato: codiceFiscale,
        codiceRuoloUtenteLoggato: codiceRuolo,
      };
      API.post(entityEndpoint, body, {
        params: {
          currPage: Math.max(0, pagination.pageNumber - 1),
          pageSize: pagination.pageSize,
        },
      }).then((res: any) => {
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
      });
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
        cfUtenteLoggato: codiceFiscale,
        codiceRuoloUtenteLoggato: codiceRuolo,
        idProgetto,
        idProgramma,
        idEnte,
      };
      const res = await API.post(
        `${process?.env?.QUESTIONARIO_CITTADINO}cittadino/${idCittadino}`,
        body
      );
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
  (searchValue: string, searchType: string, alreadySearched: any) => async (dispatch: Dispatch) => {
    try {
      dispatch({ ...GetEntitySearchResultAction, searchValue, searchType });
      dispatch(showLoader());
      const body = {
        criterioRicerca: searchValue,
        tipoDocumento: searchType === 'codiceFiscale' ? 'CF' : 'NUM_DOC',
      };
      const res = await API.post(
        `${process?.env?.QUESTIONARIO_CITTADINO}servizio/cittadino`,
        body
      );
      if (res?.data) {
        if (Array.isArray(res.data)) {
          dispatch(setCitizenSearchResults(res.data));
        }
      }
    } catch (error) {
      console.log('GetEntitySearchResult citizensArea error', error);
    } finally {
      dispatch(hideLoader());
      alreadySearched(true);
    }
  };

export const SetSearchHasResultToFalse = (setSearchHasResult: any) => {
  setSearchHasResult(false);
}

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
        const res = await API.put(
          `${process?.env?.QUESTIONARIO_CITTADINO}cittadino/${idCittadino}`,
          {
            ...body,
            idProgramma,
            idProgetto,
            idEnte,
          }
        );
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
      const transformedFilters = Object.fromEntries(
        Object.entries(filters)
          .map(([key, value]) => [
            key,
            Array.isArray(value) ? value.map((item) => item.value ?? item) : value
          ])
          .filter(([_, value]) => !(Array.isArray(value) && value.length === 0))
      );

      const body = {
        cfUtenteLoggato: codiceFiscale,
        codiceRuoloUtenteLoggato: codiceRuolo,
        filtro: {
          ...transformedFilters,
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

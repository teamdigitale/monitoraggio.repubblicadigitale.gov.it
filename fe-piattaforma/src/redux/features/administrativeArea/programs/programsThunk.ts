import { Dispatch, Selector } from '@reduxjs/toolkit';
import { hideLoader, showLoader } from '../../app/appSlice';
import { RootState } from '../../../store';
import isEmpty from 'lodash.isempty';
import API from '../../../../utils/apiHelper';
import {
  setEntityFilterOptions,
  setProgramDetails,
  setProgramGeneralInfo,
  setProgramsList,
} from '../administrativeAreaSlice';
import { mapOptions } from '../../../../utils/common';
import { formFieldI } from '../../../../utils/formHelper';

export interface ProgramsLightI {
  id: number;
  nome: string;
  nomeBreve: string;
  enteGestore: string;
  policy: string;
  stato: string;
}

export interface ProgramListResponseI {
  pageNumber: number;
  programsSLight: ProgramsLightI[];
}

const GetAllProgramsAction = {
  type: 'administrativeArea/GetAllPrograms',
};

export const GetAllPrograms =
  () => async (dispatch: Dispatch, select: Selector) => {
    try {
      dispatch(showLoader());
      dispatch({ ...GetAllProgramsAction });
      const {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        administrativeArea: { filters, pagination },
      } = select((state: RootState) => state);
      const endpoint = `programma/all`;
      let res;
      if (!isEmpty(filters)) {
        const body = {
          filtroRequest: { ...filters },
          idProgramma: 0,
          cfUtente: '',
          codiceRuolo: '',
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
        dispatch(setProgramsList({ data: res.data.data.programmiLight }));
      }
    } finally {
      dispatch(hideLoader());
    }
  };

const GetFilterValuesAction = {
  type: 'administrativeArea/GetFilterValues',
};
export const GetFilterValues =
  (dropdownType: 'policies' | 'stati') =>
  async (dispatch: Dispatch, select: Selector) => {
    try {
      // dispatch(showLoader());
      dispatch({ ...GetFilterValuesAction, dropdownType });
      const {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        administrativeArea: { filters },
      } = select((state: RootState) => state);
      const body = {
        cfUtente: '',
        codiceRuolo: '',
        filtroRequest: { ...filters },
        idProgramma: 0,
      };
      const entityFilterEndpoint = `/programma/${dropdownType}/dropdown`;
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
    } finally {
      //   dispatch(hideLoader());
    }
  };

const GetProgramDetailAction = {
  type: 'administrativeArea/GetProgramDetail',
};
export const GetProgramDetail =
  (idProgramma: string) => async (dispatch: Dispatch) => {
    try {
      dispatch(showLoader());
      dispatch({ ...GetProgramDetailAction, idProgramma });
      const res = await API.get(`programma/idProgramma`);
      if (res?.data) {
        dispatch(setProgramDetails(res.data));
      }
    } catch (error) {
      console.log('GetProgramDetail error', error);
    } finally {
      dispatch(hideLoader());
    }
  };

export const createProgramDetails =
  (payload?: { [key: string]: formFieldI['value'] }) =>
  async (dispatch: Dispatch, select: Selector) => {
    try {
      dispatch(showLoader());
      const {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        programma: { details },
      } = select((state: RootState) => state);
      const body = { ...details, facilitators: payload };
      dispatch(setProgramGeneralInfo({ currentStep: 6, payload }));
      if (body) {
        await API.put(`/programmi/setProgramDetail`, {
          ...body,
        });
        console.log('createProgramDetails body', body);
      }
    } catch (error) {
      console.log(error);
    } finally {
      dispatch(hideLoader());
    }
  };

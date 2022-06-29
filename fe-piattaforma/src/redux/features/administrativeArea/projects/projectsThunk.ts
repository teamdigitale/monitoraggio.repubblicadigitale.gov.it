import { Dispatch, Selector } from '@reduxjs/toolkit';
import { hideLoader, showLoader } from '../../app/appSlice';
import { RootState } from '../../../store';
import isEmpty from 'lodash.isempty';
import API from '../../../../utils/apiHelper';
import {
  setEntityFilterOptions,
  setProjectsList,
  setProjectDetails,
  setProjectGeneralInfo,
} from '../administrativeAreaSlice';
import { mapOptions } from '../../../../utils/common';
import { formFieldI } from '../../../../utils/formHelper';

export interface ProjectLightI {
  id: number;
  nomeBreve: string;
  enteGestore: string;
  policy: string;
  nome: string;
  stato: string;
}

export interface ProgettoListResponseI {
  numeroPagine: number;
  progettiLight: ProjectLightI[];
}

const GetAllProjectsAction = {
  type: 'administrativeArea/GetAllProjects',
};

export const GetAllProjects =
  () => async (dispatch: Dispatch, select: Selector) => {
    try {
      dispatch(showLoader());
      dispatch({ ...GetAllProjectsAction });
      const {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        administrativeArea: { filters, pagination },
      } = select((state: RootState) => state);
      const endpoint = `progetto/all`;
      let res;
      if (!isEmpty(filters)) {
        const body = {
          filtroRequest: { ...filters },
          idProgetto: 0,
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
        dispatch(setProjectsList({ data: res.data.data.list }));
      }
    } finally {
      dispatch(hideLoader());
    }
  };

const GetFilterValuesProjectsAction = {
  type: 'administrativeArea/GetFilterValuesProjects',
};
export const GetFilterValuesProjects =
  (dropdownType: 'policies' | 'stati' | 'programmi') =>
  async (dispatch: Dispatch, select: Selector) => {
    try {
      // dispatch(showLoader());
      dispatch({ ...GetFilterValuesProjectsAction, dropdownType });
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
      const entityFilterEndpoint = `/progetto/${dropdownType}/dropdown`;
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

const GetProjectDetailAction = {
  type: 'administrativeArea/GetProjectDetail',
};
export const GetProjectDetail =
  (idProgetto: string) => async (dispatch: Dispatch) => {
    try {
      dispatch(showLoader());
      dispatch({ ...GetProjectDetailAction, idProgetto });
      const res = await API.get(`progetto/idProgetto`);
      if (res?.data) {
        dispatch(setProjectDetails(res.data));
      }
    } catch (error) {
      console.log('GetProgramDetail error', error);
    } finally {
      dispatch(hideLoader());
    }
  };

export const createProjectDetails =
  (payload?: { [key: string]: formFieldI['value'] }) =>
  async (dispatch: Dispatch, select: Selector) => {
    try {
      dispatch(showLoader());
      const {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        progetto: { details },
      } = select((state: RootState) => state);
      const body = { ...details, facilitators: payload };
      dispatch(setProjectGeneralInfo({ currentStep: 6, payload }));
      if (body) {
        await API.put(`/progetti/setProjectDetail`, {
          ...body,
        });
        console.log('createProjectDetails body', body);
      }
    } catch (error) {
      console.log(error);
    } finally {
      dispatch(hideLoader());
    }
  };

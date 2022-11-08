import { Dispatch, Selector } from '@reduxjs/toolkit';
import { hideLoader, showLoader } from '../../app/appSlice';
import { RootState } from '../../../store';
import API from '../../../../utils/apiHelper';
import {
  setProjectDetails,
  setProjectGeneralInfo,
} from '../administrativeAreaSlice';
import { formFieldI } from '../../../../utils/formHelper';
import { parseResult } from '../programs/programsThunk';
import { getUserHeaders } from '../../user/userThunk';

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

const GetProjectDetailAction = {
  type: 'administrativeArea/GetProjectDetail',
};
export const GetProjectDetail =
  (projectId: string) => async (dispatch: Dispatch) => {
    try {
      dispatch(showLoader());
      dispatch({ ...GetProjectDetailAction, projectId });

      if (projectId) {
        const { codiceFiscale, codiceRuolo, idProgramma, idProgetto, idEnte } =
          getUserHeaders();
        const res = await API.post(`progetto/${projectId}`, {
          idProgramma,
          idProgetto,
          idEnte,
          cfUtente: codiceFiscale,
          codiceRuolo,
        });

        /* OLD
        const res = await API.get(`progetto/${idProgetto}`);
        */

        if (res?.data) {
          dispatch(
            setProjectDetails({
              ...res.data,
              dettagliInfoProgetto: parseResult(res.data.dettagliInfoProgetto),
            })
          );
        }
      }
    } catch (error) {
      console.log('GetProjectDetail error', error);
    } finally {
      dispatch(hideLoader());
    }
  };

const CreateProjectAction = {
  type: 'administrativeArea/CreateProject',
};

export const createProject =
  (programId: string, payload?: { [key: string]: formFieldI['value'] }) =>
  async (dispatch: Dispatch, select: Selector) => {
    try {
      dispatch(showLoader());
      dispatch({ ...CreateProjectAction });
      const state: RootState = select((state: RootState) => state) as RootState;
      const projectDetail =
        state.administrativeArea.projects.detail.dettagliInfoProgetto;

      const body = { ...projectDetail, ...payload };

      dispatch(
        setProjectGeneralInfo({ currentStep: 4, newFormValues: payload })
      );
      if (body) {
        const res = await API.post(`/progetto?idProgramma=${programId}`, {
          ...body,
        });
        console.log('createProjectDetails body', res);
      }
    } catch (error) {
      console.log(error);
    } finally {
      dispatch(hideLoader());
    }
  };

const UpdateProjectAction = {
  type: 'administrativeArea/UpdateProject',
};

export const updateProject =
  (projectId: string, payload?: { [key: string]: formFieldI['value'] }) =>
  async (dispatch: Dispatch, select: Selector) => {
    try {
      dispatch(showLoader());
      dispatch({ ...UpdateProjectAction });
      const state: RootState = select((state: RootState) => state) as RootState;
      const projectDetail =
        state.administrativeArea.projects.detail.dettagliInfoProgetto;

      const body = Object.fromEntries(
        Object.entries({ ...projectDetail, ...payload }).map(([key, value]) =>
          key.includes('Target') && !key.includes('Data')
            ? [key, parseInt(value as string)]
            : [key, value]
        )
      );

      dispatch(
        setProjectGeneralInfo({ currentStep: 4, newFormValues: payload })
      );
      if (body) {
        const { idProgramma, idProgetto, idEnte } = getUserHeaders();
        const res = await API.put(`/progetto/${projectId}`, {
          ...body,
          idProgramma,
          idProgetto,
          idEnte,
        });
        console.log('updateProjectDetails res', res);
      }
    } catch (error) {
      console.log(error);
    } finally {
      dispatch(hideLoader());
    }
  };

const ActivateProjectAction = {
  type: 'administrativeArea/ActivateProject',
};
export const ActivateProject =
  (projectId: string) => async (dispatch: Dispatch) => {
    try {
      dispatch(showLoader());
      dispatch({ ...ActivateProjectAction, projectId });
      if (projectId) {
        const { idProgramma, idProgetto, idEnte } = getUserHeaders();
        const res = await API.put(`progetto/attiva/${projectId}`, {
          idProgramma,
          idProgetto,
          idEnte,
        });
        console.log('ActivateProject res', res);
      }
    } catch (error) {
      console.log('ActivateProject error', error);
    } finally {
      dispatch(hideLoader());
    }
  };

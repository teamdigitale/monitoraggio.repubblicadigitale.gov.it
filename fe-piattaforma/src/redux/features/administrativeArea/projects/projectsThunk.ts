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
  (idProgetto: string) => async (dispatch: Dispatch) => {
    try {
      dispatch(showLoader());
      dispatch({ ...GetProjectDetailAction, idProgetto });

      if (idProgetto) {
        const res = await API.get(`progetto/${idProgetto}`);

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

export const createProject =
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

const UpdateProjectAction = {
  type: 'administrativeArea/UpdateProject',
};

export const updateProject =
  (projectId: string, payload?: { [key: string]: formFieldI['value'] }) =>
  async (dispatch: Dispatch, select: Selector) => {
    try {
      dispatch(showLoader());
      dispatch({ ...UpdateProjectAction });
      const {
        administrativeArea: {
          projects: { detail },
        },
      }: any = select((state: RootState) => state);

      const body = Object.fromEntries(
        Object.entries({ ...detail.dettagliInfoProgetto, ...payload }).map(
          ([key, value]) =>
            key.includes('Target') && !key.includes('Data')
              ? [key, parseInt(value as string)]
              : [key, value]
        )
      );

      dispatch(
        setProjectGeneralInfo({ currentStep: 4, newFormValues: payload })
      );
      if (body) {
        console.log(body);

        const res = await API.put(`/progetto/${projectId}`, {
          ...body,
        });
        console.log('updateProjectDetails res', res);
      }
    } catch (error) {
      console.log(error);
    } finally {
      dispatch(hideLoader());
    }
  };

import { Dispatch, Selector } from '@reduxjs/toolkit';
import { hideLoader, showLoader } from '../../app/appSlice';
import { RootState } from '../../../store';
//import isEmpty from 'lodash.isempty';
import API from '../../../../utils/apiHelper';
import {
  setProgramDetails,
  setProgramGeneralInfo,
} from '../administrativeAreaSlice';
import { formFieldI } from '../../../../utils/formHelper';
import { getUserHeaders } from '../../user/userThunk';

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

export const parseResult = (res: any) => ({
  ...Object.fromEntries(
    Object.entries(res)
      .filter(([_key, value]) => value !== null)
      .map(([key, value]) =>
        key.toLowerCase().includes('data') && value
          ? [key, new Date(value as number).toISOString().split('T')[0]]
          : [key, typeof value === 'number' ? value.toString() : value]
      )
  ),
});

const GetProgramDetailAction = {
  type: 'administrativeArea/GetProgramDetail',
};
export const GetProgramDetail =
  (programId: string) => async (dispatch: Dispatch) => {
    try {
      dispatch(showLoader());
      dispatch({ ...GetProgramDetailAction, programId });
      if (programId) {
        const { codiceFiscale, codiceRuolo, idProgramma, idProgetto, idEnte } =
          getUserHeaders();
        const res = await API.post(
          `${process?.env?.PROGRAMMA_PROGETTO}programma/${programId}`,
          {
            idProgramma,
            idProgetto,
            idEnte,
            cfUtenteLoggato: codiceFiscale,
            codiceRuoloUtenteLoggato: codiceRuolo,
          }
        );

        /* old
                        const res = await API.get(`/programma/${programId}`);
                        */

        if (res?.data) {
          dispatch(
            setProgramDetails({
              ...res.data,
              dettagliInfoProgramma: parseResult(
                res.data.dettagliInfoProgramma
              ),
            })
          );
          // TODO call get authority details
        }
      }
    } catch (error) {
      console.log('GetProgramDetail error', error);
    } finally {
      dispatch(hideLoader());
    }
  };

const CreateProgramAction = {
  type: 'administrativeArea/CreateProgram',
};

export const createProgram =
  (payload?: { [key: string]: formFieldI['value'] }) =>
  async (dispatch: Dispatch, select: Selector) => {
    try {
      dispatch(showLoader());
      dispatch({ ...CreateProgramAction });
      const {
        administrativeArea: {
          programs: { detail },
        },
      }: any = select((state: RootState) => state);

      const body = Object.fromEntries(
        Object.entries({ ...detail.dettagliInfoProgramma, ...payload }).map(
          ([key, value]) =>
            key.includes('Target') && !key.includes('Data')
              ? [key, parseInt(value as string)]
              : [key, value]
        )
      );

      dispatch(
        setProgramGeneralInfo({ currentStep: 4, newFormValues: payload })
      );
      if (body) {
        const res = await API.post(`/programma`, {
          ...body,
        });
        if (res) {
          return res;
        }
      }
    } catch (error: any) {
      return error.response.data;
    } finally {
      dispatch(hideLoader());
    }
  };

const UpdateProgramAction = {
  type: 'administrativeArea/UpdateProgram',
};

export const updateProgram =
  (programId: string, payload?: { [key: string]: formFieldI['value'] }) =>
  async (dispatch: Dispatch, select: Selector) => {
    try {
      dispatch(showLoader());
      dispatch({ ...UpdateProgramAction });
      const {
        administrativeArea: {
          programs: { detail },
        },
      }: any = select((state: RootState) => state);

      const body = Object.fromEntries(
        Object.entries({ ...detail.dettagliInfoProgramma, ...payload }).map(
          ([key, value]) =>
            key.includes('Target') && !key.includes('Data')
              ? [key, parseInt(value as string)]
              : [key, value]
        )
      );

      dispatch(
        setProgramGeneralInfo({ currentStep: 4, newFormValues: payload })
      );
      if (body) {
        const { idProgramma, idProgetto, idEnte } = getUserHeaders();
        await API.put(`/programma/${programId}`, {
          ...body,
          idProgramma,
          idProgetto,
          idEnte,
        });
      }
    } catch (error) {
      console.log(error);
    } finally {
      dispatch(hideLoader());
    }
  };

const UpdateProgramSurveyDefaultAction = {
  type: 'surveys/UpdateProgramSurveyDefault',
};

export const UpdateProgramSurveyDefault =
  (payload: { idProgramma: string; idQuestionario: string }) =>
  async (dispatch: Dispatch) => {
    try {
      dispatch(showLoader());
      dispatch({ ...UpdateProgramSurveyDefaultAction, payload });
      const { idProgramma: programId, idQuestionario } = payload;
      const { idProgramma, idProgetto, idEnte } = getUserHeaders();
      await API.put(`/programma/${programId}/aggiungi/${idQuestionario}`, {
        idProgramma,
        idProgetto,
        idEnte,
      });
      // GetProgramDetail(idProgramma); // TODO: far dispatchare azioni anche qui!
    } catch (e) {
      console.error('UpdateProgramSurveyDefault error', e);
    } finally {
      dispatch(hideLoader());
    }
  };
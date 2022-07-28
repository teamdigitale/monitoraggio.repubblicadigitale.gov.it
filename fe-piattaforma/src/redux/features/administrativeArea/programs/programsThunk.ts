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
        const res = await API.get(`/programma/${programId}`);
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
    } catch (error) {
      console.log(error);
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
        await API.put(`/programma/${programId}`, {
          ...body,
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
      const { idProgramma, idQuestionario } = payload;
      await API.put(`/programma/${idProgramma}/aggiungi/${idQuestionario}`);
      // GetProgramDetail(idProgramma); // TODO: far dispatchare azioni anche qui!
    } catch (e) {
      console.error('UpdateProgramSurveyDefault error', e);
    } finally {
      dispatch(hideLoader());
    }
  };

//   export interface ProgramDetailsI extends ProgramsLightI {
//     bando?: string;
//     cup?: string;
//     dataFine: string;
//     dataInizio: string;
//     nomeProgramma: string;
//     nomeBreve: string;
//     nfacilitatoriDataTarget1: string;
//     nfacilitatoriDataTarget2: string;
//     nfacilitatoriDataTarget3: string;
//     nfacilitatoriDataTarget4: string;
//     nfacilitatoriDataTarget5: string;
//     nfacilitatoriTarget1: number;
//     nfacilitatoriTarget2: number;
//     nfacilitatoriTarget3: number;
//     nfacilitatoriTarget4: number;
//     nfacilitatoriTarget5: number;
//     npuntiFacilitazioneDataTarget1: string;
//     npuntiFacilitazioneDataTarget2: string;
//     npuntiFacilitazioneDataTarget3: string;
//     npuntiFacilitazioneDataTarget4: string;
//     npuntiFacilitazioneDataTarget5: string;
//     npuntiFacilitazioneTarget1: number;
//     npuntiFacilitazioneTarget2: number;
//     npuntiFacilitazioneTarget3: number;
//     npuntiFacilitazioneTarget4: number;
//     npuntiFacilitazioneTarget5: number;
//     nserviziDataTarget1: string;
//     nserviziDataTarget2: string;
//     nserviziDataTarget3: string;
//     nserviziDataTarget4: string;
//     nserviziDataTarget5: string;
//     nserviziTarget1: number;
//     nserviziTarget2: number;
//     nserviziTarget3: number;
//     nserviziTarget4: number;
//     nserviziTarget5: number;
//     nutentiUniciDataTarget1: string;
//     nutentiUniciDataTarget2: string;
//     nutentiUniciDataTarget3: string;
//     nutentiUniciDataTarget4: string;
//     nutentiUniciDataTarget5: string;
//     nutentiUniciTarget1: number;
//     nutentiUniciTarget2: number;
//     nutentiUniciTarget3: number;
//     nutentiUniciTarget4: number;
//     nutentiUniciTarget5: number;
// }

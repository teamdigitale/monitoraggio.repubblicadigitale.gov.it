import { Dispatch } from '@reduxjs/toolkit';
import API from '../../../../utils/apiHelper';
import { hideLoader, showLoader } from '../../app/appSlice';
import {
  setHeadquarterDetails,
  setHeadquartersList,
} from '../administrativeAreaSlice';

export interface HeadquarterLight {
  id: string;
  nome: string;
}

export interface HeadquarterFacilitator {
  nome: string;
  cognome: string;
  id: string;
  stato: string;
}

const SetHeadquartersDetailsAction = {
  type: 'headquarters/SetHeadquartersDetails',
};
export const SetHeadquartersDetails =
  (payload?: any) => async (dispatch: Dispatch) => {
    try {
      dispatch({ ...SetHeadquartersDetailsAction, payload }); // TODO manage dispatch for dev env only
      dispatch(showLoader());
      if (payload.id) {
        await API.put(`/sedi/${payload.id}`, {
          ...payload,
          id: undefined,
        });
      } else {
        await API.post('/headquarters', { ...payload });
      }
      // dispatch(setSediDetails({ ...payload, id: new Date().getTime() }));
    } finally {
      dispatch(hideLoader());
    }
  };

const GetHeadquartersDetailAction = {
  type: 'administrativeArea/GetHeadquartersDetail',
};
export const GetHeadquarterDetails =
  (idSede: string) => async (dispatch: Dispatch) => {
    try {
      dispatch(showLoader());
      dispatch({ ...GetHeadquartersDetailAction, idSede });
      const res = await API.get(`sede/light/${idSede}`);
      if (res?.data) {
        dispatch(
          setHeadquarterDetails({
            dettagliInfoSede: res.data.dettaglioSede,
          })
        );
      }
    } catch (error) {
      console.log('GetHeadquartersDetail error', error);
    } finally {
      dispatch(hideLoader());
    }
  };

const GetHeadquartersListAction = {
  type: 'administrativeArea/GetHeadquartersList',
};

export const GetHeadquartersBySearch =
  (search: string) => async (dispatch: Dispatch) => {
    dispatch(showLoader());
    dispatch({ ...GetHeadquartersListAction });
    try {
      if (search) {
        const res = await API.get(`/sede/cerca/${search}`);

        if (res.data) {
          dispatch(setHeadquartersList(res.data));
        }
      } else {
        dispatch(setHeadquartersList([]));
      }
    } catch (error) {
      console.log(error);
    } finally {
      dispatch(hideLoader());
    }
  };

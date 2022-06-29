import { Dispatch } from '@reduxjs/toolkit';
import API from '../../../../utils/apiHelper';
import { hideLoader, showLoader } from '../../app/appSlice';
import { setHeadquartersDetails } from '../administrativeAreaSlice';

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
export const GetHeadquartersDetail =
  (idSede: string) => async (dispatch: Dispatch) => {
    try {
      dispatch(showLoader());
      dispatch({ ...GetHeadquartersDetailAction, idSede });
      const res = await API.get(`sede/idSede`);
      console.log(res);
      if (res?.data) {
        dispatch(setHeadquartersDetails(res.data));
      }
    } catch (error) {
      console.log('GetHeadquartersDetail error', error);
    } finally {
      dispatch(hideLoader());
    }
  };

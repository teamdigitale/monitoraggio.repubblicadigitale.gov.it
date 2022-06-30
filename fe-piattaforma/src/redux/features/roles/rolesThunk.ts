import { Dispatch, Selector } from '@reduxjs/toolkit';
import API from '../../../utils/apiHelper';
import { hideLoader, showLoader } from '../app/appSlice';
import { RootState } from '../../store';
import { setRolesList } from './rolesSlice';

const GetRolesListAction = { type: 'roles/GetRolesListValues' };

export const GetRolesListValues =
  (idUtente: string, payload?: any) =>
  async (dispatch: Dispatch, select: Selector) => {
    try {
      dispatch({ ...GetRolesListAction, payload }); // TODO manage dispatch for dev env only
      dispatch(showLoader());
      const {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        roles: { pagination },
      } = select((state: RootState) => state);
      const rolesListEndpoint = `/roles/${idUtente}/all`;
      const res = await API.get(rolesListEndpoint, { params: pagination });

      if (res?.data) {
        dispatch(setRolesList({ list: res.data.data.list }));
      }
    } catch (error) {
      console.log('GetRolesListAction error', error);
    } finally {
      dispatch(hideLoader());
    }
  };

const GetUserRolesListAction = { type: 'roles/GetUserRolesListValues' };

export const GetUserRolesList =
  (cfUtente: string, payload?: any) => async (dispatch: Dispatch) => {
    try {
      dispatch({ ...GetUserRolesListAction, payload });
      dispatch(showLoader());
      const rolesListEndpoint = `/roles/${cfUtente}/ruoli`;
      const res = await API.get(rolesListEndpoint);

      if (res.data) console.log(res.data);
    } catch (error) {
      console.log(error);
    }
  };

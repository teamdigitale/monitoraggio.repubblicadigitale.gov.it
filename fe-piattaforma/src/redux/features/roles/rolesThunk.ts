import { Dispatch } from '@reduxjs/toolkit';
import API from '../../../utils/apiHelper';
import { hideLoader, showLoader } from '../app/appSlice';
import { setRolesList } from './rolesSlice';

const GetRolesListAction = { type: 'roles/GetRolesListValues' };
export const GetRolesListValues =
  (filters: { tipologiaRuoli?: string; nomeRuolo?: string } = {}) =>
  async (dispatch: Dispatch) => {
    try {
      dispatch({ ...GetRolesListAction, filters }); // TODO manage dispatch for dev env only
      dispatch(showLoader());
      const { tipologiaRuoli, nomeRuolo } = filters;
      const rolesListEndpoint = `/ruolo`;
      const res = await API.get(rolesListEndpoint, {
        params: { tipologiaRuoli, nomeRuolo },
      });
      if (res?.data) {
        dispatch(setRolesList({ list: res.data }));
      }
    } catch (error) {
      console.log('GetRolesListAction error', error);
    } finally {
      dispatch(hideLoader());
    }
  };

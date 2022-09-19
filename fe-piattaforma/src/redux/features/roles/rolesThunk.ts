import { Dispatch, Selector } from '@reduxjs/toolkit';
import API from '../../../utils/apiHelper';
import { hideLoader, showLoader } from '../app/appSlice';
import { setGroupsList, setRoleDetails, setRolesList } from './rolesSlice';
import { RootState } from '../../store';

const GetRolesListAction = { type: 'roles/GetRolesListValues' };
export const GetRolesListValues =
  (filters: { tipologiaRuoli?: string; filtroNomeRuolo?: string } = {}) =>
  async (dispatch: Dispatch) => {
    try {
      dispatch({ ...GetRolesListAction, filters }); // TODO manage dispatch for dev env only
      dispatch(showLoader());
      const { tipologiaRuoli, filtroNomeRuolo } = filters;
      const res = await API.get(`/ruolo${tipologiaRuoli ? '' : '/all'}`, {
        params: { tipologiaRuoli, filtroNomeRuolo },
      });
      if (res?.data) {
        dispatch(setRolesList({ list: res.data }));
      }
    } catch (error) {
      console.log('GetRolesListValues error', error);
    } finally {
      dispatch(hideLoader());
    }
  };

const GetRoleDetailsAction = { type: 'roles/GetRoleDetails' };
export const GetRoleDetails =
  (codiceRuolo: string) => async (dispatch: Dispatch) => {
    try {
      dispatch({ ...GetRoleDetailsAction, codiceRuolo }); // TODO manage dispatch for dev env only
      dispatch(showLoader());
      const res = await API.get(`/ruolo/${codiceRuolo}`);
      if (res?.data) {
        dispatch(setRoleDetails(res.data));
        return res.data;
      }
    } catch (error) {
      console.log('GetRoleDetails error', error);
    } finally {
      dispatch(hideLoader());
    }
  };

const CreateCustomRoleAction = { type: 'roles/CreateCustomRole' };
export const CreateCustomRole =
  (customRole: { nomeRuolo: string; codiciGruppi: string[] }) =>
  async (dispatch: Dispatch) => {
    try {
      dispatch({ ...CreateCustomRoleAction, customRole }); // TODO manage dispatch for dev env only
      dispatch(showLoader());
      if (customRole.nomeRuolo && customRole.codiciGruppi?.length) {
        const res = await API.post('/ruolo', customRole);
        if (res) {
          return true;
        }
      }
    } catch (error) {
      console.log('CreateCustomRole error', error);
      return false;
    } finally {
      dispatch(hideLoader());
    }
  };

const EditCustomRoleAction = { type: 'roles/EditCustomRole' };
export const EditCustomRole =
  (
    codiceRuolo: string,
    modifiedRole: {
      nomeRuolo: string;
      codiciGruppi: string[];
    }
  ) =>
  async (dispatch: Dispatch) => {
    try {
      dispatch({
        ...EditCustomRoleAction,
        ...{
          codiceRuolo,
          ...modifiedRole,
        },
      }); // TODO manage dispatch for dev env only
      dispatch(showLoader());
      if (
        codiceRuolo &&
        modifiedRole.nomeRuolo &&
        modifiedRole.codiciGruppi?.length
      ) {
        const res = await API.put(`/ruolo/${codiceRuolo}`, modifiedRole);
        if (res) {
          return true;
        }
      }
    } catch (error) {
      console.log('EditCustomRole error', error);
      return false;
    } finally {
      dispatch(hideLoader());
    }
  };

const DeleteCustomRoleAction = { type: 'roles/DeleteCustomRole' };
export const DeleteCustomRole =
  (codiceRuolo: string) => async (dispatch: Dispatch) => {
    try {
      dispatch({ ...DeleteCustomRoleAction, codiceRuolo }); // TODO manage dispatch for dev env only
      dispatch(showLoader());
      if (codiceRuolo) {
        const res = await API.delete(`/ruolo/${codiceRuolo}`);
        if (res) {
          return true;
        }
      }
    } catch (error) {
      console.log('DeleteCustomRole error', error);
    } finally {
      dispatch(hideLoader());
    }
  };

const GetGroupsListAction = { type: 'roles/GetGroupsListValues' };
export const GetGroupsListValues =
  () => async (dispatch: Dispatch, select: Selector) => {
    try {
      dispatch({ ...GetGroupsListAction }); // TODO manage dispatch for dev env only
      dispatch(showLoader());
      const {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        roles: { groups = [] },
      } = select((state: RootState) => state);
      if (!groups.length) {
        const res = await API.get('/gruppo/all');
        if (res?.data) {
          dispatch(setGroupsList({ list: res.data }));
        }
      }
    } catch (error) {
      console.log('GetGroupsListValues error', error);
    } finally {
      dispatch(hideLoader());
    }
  };

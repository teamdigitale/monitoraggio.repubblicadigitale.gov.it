import {Dispatch, Selector} from '@reduxjs/toolkit';
import API from '../../../utils/apiHelper';
import { hideLoader, showLoader } from '../app/appSlice';
import { login, setUserContext, setUserProfile } from './userSlice';
import { getSessionValues } from '../../../utils/sessionHelper';
import {RootState} from "../../store";

export const getUserHeaders = () => {
  const { codiceFiscale } = JSON.parse(getSessionValues('user'));
  const { codiceRuolo, idProgramma, idProgetto } = JSON.parse(getSessionValues('profile'));

  return ({
    codiceFiscale, codiceRuolo, idProgramma, idProgetto
  });
};

const SessionCheckAction = { type: 'user/SessionCheck' };
export const SessionCheck = () => async (dispatch: Dispatch) => {
  try {
    dispatch({ ...SessionCheckAction }); // TODO manage dispatch for dev env only
    dispatch(showLoader());
    const user = JSON.parse(getSessionValues('user'));
    if (user?.codiceFiscale) {
      dispatch(setUserContext(user));
      const profile = JSON.parse(getSessionValues('profile'));
      dispatch(
        setUserProfile(profile?.idProgramma ? profile : user.profiliUtente[0])
      );
      dispatch(login());
    }
  } catch (error) {
    console.log('SessionCheckAction error', error);
  } finally {
    dispatch(hideLoader());
  }
};

const CreateUserContextAction = { type: 'user/CreateUserContext' };
export const CreateUserContext =
  (codiceFiscale = 'UTENTE2') =>
  async (dispatch: Dispatch) => {
    try {
      dispatch({ ...CreateUserContextAction, codiceFiscale }); // TODO manage dispatch for dev env only
      dispatch(showLoader());
      const res = await API.post('/contesto', { codiceFiscale });

      if (res?.data) {
        dispatch(setUserContext(res.data));
        return true;
      }
    } catch (error) {
      console.log('CreateUserContext error', error);
      return false;
    } finally {
      dispatch(hideLoader());
    }
  };

const SelectUserRoleAction = { type: 'user/SelectUserRole' };
export const SelectUserRole = (profile: any) =>
  async (dispatch: Dispatch, select: Selector) => {
  try {
    dispatch({ ...SelectUserRoleAction }); // TODO manage dispatch for dev env only
    dispatch(showLoader());
    const {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      user: { user: { codiceFiscale } },
    } = select((state: RootState) => state);
    if (codiceFiscale && profile?.codiceRuolo) {
      const res = await API.post('/contesto/sceltaProfilo', {
        cfUtente: codiceFiscale,
        codiceRuolo: profile.codiceRuolo,
      });

      if (res) {
        dispatch(setUserProfile(profile));
        return true;
      }
    }
  } catch (error) {
    console.log('SelectUserRole error', error);
  } finally {
    dispatch(hideLoader());
  }
};

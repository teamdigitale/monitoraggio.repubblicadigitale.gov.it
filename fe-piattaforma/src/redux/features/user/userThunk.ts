import { Dispatch, Selector } from '@reduxjs/toolkit';
import API from '../../../utils/apiHelper';
import { hideLoader, showLoader } from '../app/appSlice';
import {
  login,
  logout,
  setUserContext,
  setUserProfile,
  UserProfileI,
} from './userSlice';
import { getSessionValues } from '../../../utils/sessionHelper';
import { RootState } from '../../store';
import {isActiveProvisionalLogin} from "../../../pages/common/Auth/auth";

export const getUserHeaders = () => {
  const { codiceFiscale } = JSON.parse(getSessionValues('user'));
  const { codiceRuolo, idProgramma, idProgetto } = JSON.parse(
    getSessionValues('profile')
  );

  return {
    codiceFiscale: isActiveProvisionalLogin ? codiceFiscale.toUpperCase() : undefined,
    codiceRuolo: isActiveProvisionalLogin ? codiceRuolo : undefined,
    idProgramma,
    idProgetto,
  };
};

export const SessionCheck = async (dispatch: any) => {
  try {
    dispatch(showLoader());
    const user = JSON.parse(getSessionValues('user'));
    if (user?.codiceFiscale) {
      const validContext = await dispatch(
        CreateUserContext(user.codiceFiscale)
      );
      if (validContext) {
        const profile = JSON.parse(getSessionValues('profile'));
        if (profile?.codiceRuolo) {
          const validProfile = await dispatch(SelectUserRole(profile));
          if (validProfile) {
            dispatch(login());
          } else {
            dispatch(logout());
          }
        } else {
          dispatch(logout());
        }
      } else {
        dispatch(logout());
      }
    } else {
      dispatch(logout());
    }
  } catch (error) {
    console.log('SessionCheckAction error', error);
  } finally {
    dispatch(hideLoader());
    // eslint-disable-next-line no-unsafe-finally
    return true;
  }
};

const CreateUserContextAction = { type: 'user/CreateUserContext' };
export const CreateUserContext =
  (codiceFiscale: string) => async (dispatch: Dispatch) => {
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
export const SelectUserRole =
  (profile: UserProfileI, saveSession = false) => async (dispatch: Dispatch, select: Selector) => {
    try {
      dispatch({ ...SelectUserRoleAction }); // TODO manage dispatch for dev env only
      dispatch(showLoader());
      const {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        user: {
          user: { codiceFiscale },
        },
      } = select((state: RootState) => state);
      if (codiceFiscale && profile?.codiceRuolo) {
        const { codiceRuolo, idProgramma, idProgetto } = profile;
        const res = await API.post('/contesto/sceltaProfilo', {
          cfUtente: codiceFiscale,
          codiceRuolo,
          idProgramma,
          idProgetto,
        });

        if (res) {
          dispatch(setUserProfile({ ...profile, saveSession }));
          return true;
        }
      }
    } catch (error) {
      console.log('SelectUserRole error', error);
    } finally {
      dispatch(hideLoader());
    }
  };

const EditUserAction = { type: 'user/EditUser' };
export const EditUser =
  (newUser: any) => async (dispatch: Dispatch, select: Selector) => {
    try {
      dispatch({ ...EditUserAction });
      dispatch(showLoader());
      const {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        user: {
          user: { codiceFiscale },
        },
      } = select((state: RootState) => state);
      if (newUser?.codiceFiscale === codiceFiscale) {
        const res = await API.post('/contesto/confermaIntegrazione', {
          ...newUser,
          abilitazioneConsensoTrattamentoDatiPersonali: true,
        });

        if (res) {
          return true;
        }
      }
    } catch (error) {
      console.log('EditUser error', error);
    } finally {
      dispatch(hideLoader());
    }
  };

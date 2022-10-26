import { Dispatch } from '@reduxjs/toolkit';
import { hideLoader, showLoader } from '../app/appSlice';
import axios from 'axios';

const GetSPIDTokenAction = { type: 'auth/GetSPIDToken' };
export const GetSPIDToken =
  (preAuthCode: string) => async (dispatch: Dispatch) => {
    try {
      dispatch({ ...GetSPIDTokenAction, preAuthCode }); // TODO manage dispatch for dev env only
      dispatch(showLoader());
      const params = new URLSearchParams();
      params.append('grant_type', 'authorization_code');
      params.append(
        'client_id',
        `${process?.env?.REACT_APP_COGNITO_CLIENT_ID}`
      );
      params.append(
        'client_secret',
        `${process?.env?.REACT_APP_COGNITO_CLIENT_SECRET}`
      );
      params.append(
        'redirect_uri',
        `${process?.env?.REACT_APP_COGNITO_FE_REDIRECT_URL}`
      );
      params.append('code', `${preAuthCode}`);
      const res = await axios
        .create({
          baseURL: `${process?.env?.REACT_APP_COGNITO_BASE_URL}`,
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Authorization: `Basic ${window.btoa(
              `${process?.env?.REACT_APP_COGNITO_CLIENT_ID}:${process?.env?.REACT_APP_COGNITO_CLIENT_SECRET}`
            )}`,
          },
          timeout: 10000,
        })
        .post('oauth2/token', params);

      if (res?.data) {
        return res.data;
      }
    } catch (error) {
      console.log('GetSPIDToken error', error);
      return false;
    } finally {
      dispatch(hideLoader());
    }
  };

export const RefreshSPIDToken = async (
  preAuthCode: string,
  refreshToken: string
) => {
  try {
    if (preAuthCode && refreshToken) {
      const params = new URLSearchParams();
      params.append('grant_type', 'refresh_token');
      params.append(
        'client_id',
        `${process?.env?.REACT_APP_COGNITO_CLIENT_ID}`
      );
      params.append(
        'client_secret',
        `${process?.env?.REACT_APP_COGNITO_CLIENT_SECRET}`
      );
      params.append(
        'redirect_uri',
        `${process?.env?.REACT_APP_COGNITO_FE_REDIRECT_URL}`
      );
      params.append('code', `${preAuthCode}`);
      params.append('refresh_token', refreshToken);
      const res = await axios
        .create({
          baseURL: `${process?.env?.REACT_APP_COGNITO_BASE_URL}`,
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Authorization: `Basic ${window.btoa(
              `${process?.env?.REACT_APP_COGNITO_CLIENT_ID}:${process?.env?.REACT_APP_COGNITO_CLIENT_SECRET}`
            )}`,
          },
          timeout: 10000,
        })
        .post('oauth2/token', params);

      if (res?.data) {
        return res.data;
      }
    }
    return false;
  } catch (error) {
    console.log('GetSPIDToken error', error);
    return false;
  }
};

/*export const getUserHeaders = () => {
  const { codiceFiscale } = JSON.parse(getSessionValues('user'));
  const { codiceRuolo, idProgramma, idProgetto } = JSON.parse(
    getSessionValues('profile')
  );

  return {
    codiceFiscale: codiceFiscale.toUpperCase(),
    codiceRuolo,
    idProgramma,
    idProgetto,
  };
};*/

/*export const SessionCheck = async (dispatch: any) => {
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
};*/

/*const CreateUserContextAction = { type: 'user/CreateUserContext' };
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
  };*/

/*const SelectUserRoleAction = { type: 'user/SelectUserRole' };
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
  };*/

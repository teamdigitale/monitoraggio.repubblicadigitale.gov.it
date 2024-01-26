import { Dispatch, Selector } from '@reduxjs/toolkit';
import API from '../../../utils/apiHelper';
import { hideLoader, showLoader } from '../app/appSlice';
import {
  login,
  logout,
  setUserContext,
  setUserNotifications,
  setUserNotificationsPreview,
  setUserNotificationsToRead,
  setUserProfile,
  UserProfileI,
} from './userSlice';
import {
  clearSessionValues,
  getSessionValues,
  setSessionValues,
} from '../../../utils/sessionHelper';
import { RootState } from '../../store';
import { isActiveProvisionalLogin } from '../../../pages/common/Auth/auth';
import { proxyCall } from '../forum/forumThunk';
import { transformFiltersToQueryParams } from '../../../utils/common';
import { setEntityPagination } from '../administrativeArea/administrativeAreaSlice';

export const getUserHeaders = () => {
  const { codiceFiscale, id: idUtente } = JSON.parse(getSessionValues('user'));
  const { codiceRuolo, idProgramma, idProgetto, idEnte } = JSON.parse(
    getSessionValues('profile')
  );

  return {
    codiceFiscale: isActiveProvisionalLogin
      ? codiceFiscale?.toUpperCase()
      : undefined,
    codiceRuolo: isActiveProvisionalLogin ? codiceRuolo : undefined,
    idProgramma,
    idProgetto,
    idUtente,
    idEnte,
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
  (cfUtenteLoggato ?: string) => async (dispatch: Dispatch) => {
    try {
      dispatch({ ...CreateUserContextAction, cfUtenteLoggato  }); // TODO manage dispatch for dev env only
      dispatch(showLoader());

      const res = await API.post(`${process?.env?.GESTIONE_UTENTE}contesto`, {cfUtenteLoggato});

      if (res?.data) {
        dispatch(setUserContext(res.data));
        return res.data;
      }
      return false;
    } catch (error) {
      console.log('CreateUserContext error', error);
      return false;
    } finally {
      dispatch(hideLoader());
    }
  };

const SelectUserRoleAction = { type: 'user/SelectUserRole' };
export const SelectUserRole =
  (profile: UserProfileI, saveSession = false) =>
  async (dispatch: Dispatch, select: Selector) => {
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
      let request;
      if (codiceFiscale && profile?.codiceRuolo) {
        const { codiceRuolo, idProgramma, idProgetto, idEnte } = profile;
        setSessionValues('profile', profile);
            request = {
              cfUtente: codiceFiscale,
              cfUtenteLoggato: codiceFiscale,
              codiceRuolo: codiceRuolo,
              codiceRuoloUtenteLoggato: codiceRuolo,
              idProgramma,
              idProgetto,
              idEnte,
            }
  
        }
        const res = await API.post(`${process?.env?.GESTIONE_UTENTE}contesto/sceltaProfilo`, request);
        if (res) {
          dispatch(setUserProfile({ ...profile, saveSession }));
          return true;
        }
    } catch (error) {
      console.log('SelectUserRole error', error);
      clearSessionValues('profile');
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
        const res = await API.post(`${process?.env?.GESTIONE_UTENTE}contesto/confermaIntegrazione`, {
          ...newUser,
          abilitazioneConsensoTrattamentoDatiPersonali: true,
        });

        if (res) {
          await new Promise((resolve) => setTimeout(resolve, 2000));
          return true;
        }
      }
    } catch (error) {
      console.log('EditUser error', error);
    } finally {
      dispatch(hideLoader());
    }
  };

const UploadUserPicAction = { type: 'user/UploadUserPic' };
export const UploadUserPic =
  (multipartifile: any, userId?: string) => async (dispatch: Dispatch) => {
    try {
      dispatch({ ...UploadUserPicAction }); // TODO manage dispatch for dev env only
      dispatch(showLoader());
      const { idUtente } = getUserHeaders();
      const formData = new FormData();
      formData.append('multipartifile', multipartifile, multipartifile.name);
      const res = await API.post(
        `/utente/upload/immagineProfilo/${userId || idUtente}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          timeout: 60000,
        }
      );

      return !!res?.data;
    } catch (error) {
      console.log('UploadUserPic error', error);
      return false;
    } finally {
      dispatch(hideLoader());
    }
  };

/* TO IMPLEMENT WHEN THE API WILL BE AVAILABLE */
const RemoveUserPicAction = { type: 'user/RemoveUserPic' };
export const RemoveUserPic =
  (userId?: string) => async (dispatch: Dispatch) => {
    try {
      dispatch({ ...RemoveUserPicAction }); // TODO manage dispatch for dev env only
      dispatch(showLoader());
      const { idUtente } = getUserHeaders();
      const formData = new FormData();
      formData.append('noImage', '');
      const res = await API.post(
        `/utente/upload/immagineProfilo/${userId || idUtente}`,
        formData,
        {
          headers: {
            'Content-Type': 'noImage/formData',
          },
        }
      );
      return res;
    } catch (error) {
      console.log('RemoveUserPic error', error);
      return false;
    } finally {
      dispatch(hideLoader());
    }
  };

const RocketChatLoginAction = { type: 'user/RocketChatLogin' };
export const RocketChatLogin = () => async (dispatch: Dispatch) => {
  try {
    dispatch({ ...RocketChatLoginAction });
    const { idUtente } = getUserHeaders();
    const res = await API.post(
      `/rocket-chat/auth/iframe/utente/${idUtente}`,
      {}
    );
    if (res) {
      return res;
    }
  } catch (error) {
    console.log('RocketChatLogin error', error);
    return false;
  }
};

const LogoutRedirectAction = { type: 'user/LogoutRedirect' };
export const LogoutRedirect = () => async (dispatch: Dispatch) => {
  try {
    dispatch({ ...LogoutRedirectAction }); // TODO manage dispatch for dev env only
    dispatch(showLoader());
    const logoutRedirectUrl =
      `${process?.env?.REACT_APP_COGNITO_BASE_URL}logout?client_id=${process?.env?.REACT_APP_COGNITO_CLIENT_ID}&logout_uri=${process?.env?.REACT_APP_COGNITO_FE_REDIRECT_URL}`.replace(
        '/auth',
        ''
      );
    clearSessionValues();
    console.log('Logout Redirect to', logoutRedirectUrl);
    window.location.replace(logoutRedirectUrl);
  } catch (error) {
    console.log('LogoutRedirect error', error);
  }
};

// NOTIFICATION

const GetNotificationsByUserAction = {
  type: 'forum/GetNotificationsByUser',
};

export const GetNotificationsByUser =
  (
    forcedFilters?: {
      [key: string]: {
        value: string | number;
      }[];
    },
    updateCount = false
  ) =>
  async (dispatch: Dispatch, select: Selector) => {
    try {
      dispatch(showLoader());
      dispatch({ ...GetNotificationsByUserAction });
      const {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        administrativeArea: { pagination },
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        forum: { filters },
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        user: {
          user: { id },
        },
      } = select((state: RootState) => state);

      if (id) {
        const body = {
          ...filters,
          sort:
            filters.sort[0].value === 'created'
              ? [{ label: 'created_desc', value: 'created_desc' }]
              : filters.sort,
          page: [{ value: Math.max(0, pagination.pageNumber - 1) }],
          items_per_page: [{ value: 9 }],
          ...forcedFilters,
        };

        // @ts-ignore
        const queryParam = transformFiltersToQueryParams(body).replace(
          'sort',
          'sort_by'
        );
        /*const res = await proxyCall(
          `/user/${id}/notifications${queryParam}`,
          'GET'
        )*/
        const res = {
          data: {
            data: {
              items: [],
              pager: {
                total_items: 1,
                total_pages: 1
              }
            }
          }
        }
        if (res) {
          if (updateCount) {
            dispatch(
              setUserNotificationsToRead(res.data.data.pager?.total_items || 0)
            );
            dispatch(setUserNotificationsPreview(res.data.data.items || []));
          } else {
            dispatch(setUserNotifications(res.data.data.items || []));
            dispatch(
              setEntityPagination({
                totalPages: res.data.data.pager?.total_pages || 0,
                totalElements: res.data.data.pager?.total_items || 0,
              })
            );
          }
        }
      }
    } catch (error) {
      console.log('GetNotificationsByUser error', error);
    } finally {
      dispatch(hideLoader());
    }
  };

const ReadNotificationAction = {
  type: 'forum/ReadNotification',
};

export const ReadNotification =
  (notificationsIds: string[]) => async (dispatch: Dispatch) => {
    try {
      dispatch(showLoader());
      dispatch({ ...ReadNotificationAction });
      if (notificationsIds.length) {
        await proxyCall(
          `/notification/${notificationsIds.join(';')}/read`,
          'POST',
          {}
        );
      }
    } catch (error) {
      console.log('ReadNotification error', error);
    } finally {
      dispatch(hideLoader());
    }
  };

const DeleteNotificationAction = {
  type: 'forum/DeleteNotification',
};

export const DeleteNotification =
  (notificationsIds: string[]) => async (dispatch: Dispatch) => {
    try {
      dispatch(showLoader());
      dispatch({ ...DeleteNotificationAction });
      if (notificationsIds.length) {
        await proxyCall(
          `/notification/${notificationsIds.join(';')}/delete`,
          'POST',
          {}
        );
      }
    } catch (error) {
      console.log('DeleteNotification error', error);
    } finally {
      dispatch(hideLoader());
    }
  };

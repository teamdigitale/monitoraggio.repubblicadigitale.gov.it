import { Dispatch } from '@reduxjs/toolkit';
import API from '../../../utils/apiHelper';
import { hideLoader, showLoader } from '../app/appSlice';
import {
  defaultNotify,
  emitNotify,
  NotifyI,
  removeNotify,
  setNotificationsList,
} from './notificationSlice';

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

const getDelayByDuration = (duration: NotifyI['duration'] = 'medium') => {
  switch (duration) {
    case 'slow':
      return 40000; 
    case 'medium':
      return 25000;
    case 'fast':
      return 10000;
    default:
      return duration;
  }
};

export const NewNotify = (payload?: NotifyI) => async (dispatch: Dispatch) => {
  const notify = {
    ...defaultNotify, 
    id: new Date().getTime(),
    ...payload,
  };
  if (notify?.message && notify?.status) {
    dispatch(emitNotify(notify));
    //if (!notify.closable) {
    await delay(getDelayByDuration(notify.duration));
    dispatch(removeNotify({ id: notify.id }));
    //} 
  }
};

const GetNotificationsListAction = { 
  type: 'notification/GetNotificationsList',
};
export const GetNotificationsList = () => async (dispatch: Dispatch) => {
  try {
    dispatch(showLoader());
    dispatch({ ...GetNotificationsListAction });

    const entityEndpoint = `/Notifications/all`; 

    const body = { 
      idProgramma: 0, //MOCK
      cfUtente: 'UTENTE1', //MOCK
      codiceRuolo: 'DTD', //MOCK DA MANTENERE SOLO NELL'HEADER 
    };

    const res = await API.post(entityEndpoint, body); 

    if (res?.data) { 
      dispatch(setNotificationsList(res.data));
    }
  } catch (error) { 
    console.log('GetNotificationsList error', error); 
  } finally { 
    dispatch(hideLoader()); 
  }
};

export const createTicketAssistenza = async (dispatch: Dispatch, payload?: any): Promise<boolean> => {
  try {
    dispatch(showLoader());
    const endpoint = `/assistenza/apriTicket`;
    const res = await API.post(endpoint, payload, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return res?.data === true;
  } catch (error) {
    console.log('createTicketAssistenza error', error);
    return false;
  } finally { 
    dispatch(hideLoader()); 
  }
};

export const getTematicheAssistenza = async (dispatch: Dispatch) => {
  try {
    dispatch(showLoader());
    const endpoint = `/assistenza/tematiche`;
    const res = await API.post(endpoint);

    return res?.data;
  } catch (error) {
    console.log('createTicketAssistenza error', error);
    return false;
  }finally { 
    dispatch(hideLoader()); 
  }
};

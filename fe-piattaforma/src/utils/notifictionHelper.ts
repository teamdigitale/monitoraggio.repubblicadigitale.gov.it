import store from '../redux/store';
import { NotifyI } from '../redux/features/notification/notificationSlice';
import { NewNotify } from '../redux/features/notification/notificationThunk';
import axios from 'axios';
import { LogoutRedirect } from '../redux/features/user/userThunk';

export const dispatchNotify = (notify?: NotifyI) => {
  store.dispatch(NewNotify(notify) as any);
};

const dispatchLogout = () => {
  console.error('401 unauthorized detected, should redirect to logout');
  store.dispatch(LogoutRedirect() as any);
};

/*
const getErrorMessage = ({ response }: any) => {
  console.log('response', response);
  switch (response?.status) {
    // TODO map here all error codes
    case 400:
      return 'Errore 400';
    case 500:
      return 'Errore 500';
    default:
      return 'Si è verificato un errore';
  }
};
*/
export const defaultErrorMessage = 'Si è verificato un errore';
const networkErrorPayload = {
  title: 'ERRORE DI RETE',
  message: 'Problemi di connessione, verificare la connettività',
};
const defaultErrorPayload = {
  title: 'ERRORE GENERICO',
  message: defaultErrorMessage,
};
export const getErrorMessage = async (errorCode: string) => {
  try {
    const res = await axios('/assets/errors/errors.json');
    if (res?.data) {
      const errorsList = { ...res.data.errors };
      if (errorsList[errorCode]) {
        return {
          message: `${errorsList[errorCode]} (${errorCode})`,
          title: 'ERRORE',
        };
      } else {
        return defaultErrorPayload;
      }
    }
  } catch (error) {
    return defaultErrorPayload;
  }
};

export const errorHandler = async (error: unknown) => {
  let errorData = defaultErrorPayload;
  // console.log('error', error);
  if (error instanceof TypeError) {
    // statements to handle TypeError exceptions
    console.log(1);
  } else if (error instanceof RangeError) {
    // statements to handle RangeError exceptions
    console.log(2);
  } else if (error instanceof EvalError) {
    // statements to handle EvalError exceptions
    console.log(3);
  } else if (error === 'Network Error') {
    // statements to handle Network Error exceptions
    errorData = networkErrorPayload;
  } else {
    // statements to handle any unspecified exceptions
    //console.log(4, error);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    if (error?.response?.status === 401) {
      dispatchLogout();
    }

    if (!errorData) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      errorData = await getErrorMessage(error?.response?.data?.errorCode);
    }

    dispatchNotify({
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      title: errorData.title,
      status: 'error',
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      message: errorData.message,
      closable: true,
      duration: 'slow',
    });
  }
};

import store from '../redux/store';
import { NotifyI } from '../redux/features/notification/notificationSlice';
import { NewNotify } from '../redux/features/notification/notificationThunk';
import axios from 'axios';
import { LogoutRedirect } from '../redux/features/user/userThunk';

export const dispatchNotify = (notify?: NotifyI) => {
  store.dispatch(NewNotify(notify) as any);
};

export const dispatchWarning = (title: string, message: string) => {
  dispatchNotify({
    title,
    status: 'warning',
    message,
    closable: true,
    duration: 'slow',
  });
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
export const defaultErrorMessage = 'Ti invitiamo a riprovare più tardi';
const networkErrorPayload = {
  title: 'ERRORE DI RETE',
  message: 'Si è verificato un problema di connessione a Facilita. Controlla le tue impostazioni di rete e riprova.',
};
const defaultErrorPayload = {
  title: 'SI È VERIFICATO UN ERRORE',
  message: defaultErrorMessage,
  status: 'error',
};
const getDrupalErrorMessage = (errorsList: any, errorMessage: string) => {
  try {
    if (errorMessage) {
      const errorCode = JSON.parse(
        decodeURI(errorMessage.replaceAll(' ', '').slice(1, -1))
      )?.data?.message?.split(':')?.[0];
      if (errorsList[errorCode]) {
        return {
          message: `${errorsList[errorCode]?.descrizione} (errore ${errorCode})`,
          title: errorsList[errorCode]?.titolo || 'ERRORE',
        };
      } else {
        return defaultErrorPayload;
      }
    }
    return defaultErrorPayload;
  } catch {
    return defaultErrorPayload;
  }
};
export const getErrorMessage = async (
  { errorCode, message = '' }: { errorCode: string; message?: string } = {
    errorCode: 'ERRORE',
  }
) => {
  try {
    const res = await axios('/assets/errors/errors.json');    
    if (res?.data) {
      const errorsList = { ...res.data.errors };
      if (errorCode === 'A02') {
        console.log('Errore A02');
        window.location.replace('/auth-redirect');
      } else if (errorCode === 'D01') {
        // return getDrupalErrorMessage(errorsList, message);
        return {title: '', message: ''};
      } else if (errorsList[errorCode]) {
        return {
          message: `${errorsList[errorCode]?.descrizione} (errore ${errorCode})`,
          title: errorsList[errorCode]?.titolo || 'ERRORE',
          status: errorsList[errorCode]?.status || 'error',
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
  let errorData;
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

    const urlForward = ['board', 'community', 'document'];
    if (!errorData) {
      try {
        errorData = await getErrorMessage({
          errorCode: (error as any)?.response?.data?.errorCode,
        });
      } catch (error) {
        console.error("Errore durante il recupero del messaggio:", error);
      }
      //aggiunto controllo per non mostrare messaggio di errore in caso di errore drupal forward 
      if (errorData && !(urlForward.some(keyword => JSON.parse((error as any)?.config.data).url?.includes(keyword)))) { 
        dispatchNotify({
          title: errorData.title,
          status: errorData.status,
          message: errorData.message,
          closable: true,
          duration: 'slow',
        });
      }
    } else {  //dispatch notify network error
      dispatchNotify({
        title: networkErrorPayload.title,
        status: 'error',
        message: networkErrorPayload.message,
        closable: true,
        duration: 'slow',
      });
    }
  }
};

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

export const getErrorMessage = async ({ response }: any) => {
  try {
    const res = await axios('/assets/errors/errors.json');
    if (res?.data) {
      const errorsList = { ...res.data.errors };
      const errorCode = response.data.errorCode;
      return errorsList[errorCode] || 'Si è verificato un errore';
    }
  } catch (error) {
    return 'Si è verificato un errore';
  }
};

export const errorHandler = async (error: unknown) => {
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
  } else {
    // statements to handle any unspecified exceptions
    //console.log(4, error);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    if (error?.response?.status === 401) {
      dispatchLogout();
    }
    dispatchNotify({
      status: 'error',
      message: await getErrorMessage(error),
      closable: true,
      duration: 'slow',
    });
  }
};

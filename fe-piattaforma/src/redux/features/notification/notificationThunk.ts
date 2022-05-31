import { Dispatch } from '@reduxjs/toolkit';
import {
  defaultNotify,
  emitNotify,
  NotifyI,
  removeNotify,
} from './notificationSlice';

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

const getDelayByDuration = (duration: NotifyI['duration'] = 'medium') => {
  switch (duration) {
    case 'slow':
      return 10000;
    case 'medium':
      return 5000;
    case 'fast':
      return 3000;
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
    if (!notify.closable) {
      await delay(getDelayByDuration(notify.duration));
      dispatch(removeNotify({ id: notify.id }));
    }
  }
};

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../../store';

export interface NotifyI {
  closable?: boolean;
  duration?: 'slow' | 'medium' | 'fast' | number;
  id?: number;
  message?: string;
  status?: 'error' | 'message' | 'success' | 'warning';
  name?: string;
  description?: string;
  object?: string;
  date?: string;
  icon?: string;
  hours?: string;
  iconColor?: string;
  iconPadding?: boolean;
  iconClass?: string;
  unread?: boolean;
}

export const defaultNotify: NotifyI = {
  closable: false,
  duration: 'medium',
  status: 'message',
  iconColor: 'white',
};

interface NotificationStateI {
  list: NotifyI[];
  listNotification: NotifyI[];
}

const initialState: NotificationStateI = {
  list: [],
  listNotification: []
};

export const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    emitNotify: (state, action: PayloadAction<NotifyI>) => {
      if (action.payload.id) {
        state.list.push(action.payload);
      }
    },
    removeNotify: (
      state,
      action: PayloadAction<{ id: string | number | undefined }>
    ) => {
      if (action.payload.id) {
        state.listNotification = state.listNotification.filter(
          (notify) => notify?.id?.toString() !== action.payload.id?.toString()
        );
      }
    },
    setNotificationsList: (state, action: PayloadAction<any>) => {
      state.listNotification = action.payload.data;
    },
  },
});

export const { emitNotify, removeNotify, setNotificationsList } =
  notificationSlice.actions;

export const selectNotification = (state: RootState) => state.notification.list;
export const selectNotificationList = (state: RootState) => state.notification.listNotification;

export default notificationSlice.reducer;

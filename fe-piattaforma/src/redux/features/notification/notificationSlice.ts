import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../../store';

export interface NotifyI {
  closable?: boolean;
  duration?: 'slow' | 'medium' | 'fast' | number;
  id?: string | number;
  message?: string;
  status?: 'error' | 'message' | 'success' | 'warning';
}

export const defaultNotify: NotifyI = {
  closable: false,
  duration: 'medium',
  status: 'message',
};

interface NotificationStateI {
  list: NotifyI[];
}

const initialState: NotificationStateI = {
  list: [],
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
        state.list = state.list.filter(
          (notify) => notify?.id !== action.payload.id
        );
      }
    },
  },
});

export const { emitNotify, removeNotify } = notificationSlice.actions;

export const selectNotification = (state: RootState) => state.notification.list;

export default notificationSlice.reducer;

import { createSlice } from '@reduxjs/toolkit';
import type { RootState } from '../../store';

interface UserStateI {
  isLogged: boolean;
  user?: {
    name: string;
    surname: string;
    role: string;
  };
  notification?: [];
}

const initialState: UserStateI = {
  isLogged: true,
  user: {
    name: 'Mario',
    surname: 'Rossi',
    role: 'Referente Ente gestore di progetto',
  },
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    login: (state) => {
      state.isLogged = true;
      state.user = {
        name: 'Luigi',
        surname: 'Bianchi',
        role: 'Referente Ente gestore di progetto',
      };
    },
    logout: (state) => {
      state.isLogged = false;
    },
  },
});

export const { login, logout } = userSlice.actions;

export const selectLogged = (state: RootState) => state.user.isLogged;
export const selectUser = (state: RootState) => state.user.user;
export const selectUserNotification = (state: RootState) =>
  state.user.notification;

export default userSlice.reducer;

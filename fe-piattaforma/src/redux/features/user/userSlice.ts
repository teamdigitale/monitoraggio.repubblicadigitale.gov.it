import { createSlice } from '@reduxjs/toolkit';
import type { RootState } from '../../store';
import { RolePermissionI } from '../roles/rolesSlice';

interface UserStateI {
  isLogged: boolean;
  user?: {
    name: string;
    surname: string;
    role: string;
    codiceFiscale: string;
  };
  notification?: [];
  permissions: RolePermissionI[];
  idProgramma: string;
  idProgetto: string[];
}

const initialState: UserStateI = {
  isLogged: true,
  user: {
    name: 'Mario',
    surname: 'Rossi',
    role: 'DTD',
    codiceFiscale: 'UTENTE1',
  },
  permissions: ['permission-1'],
  idProgramma: '0',
  idProgetto: ['0'],
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
        role: 'DTD',
        codiceFiscale: 'UTENTE1',
      };
      state.permissions = ['permission-1'];
    },
    logout: (state) => {
      state.isLogged = false;
    },
  },
});

export const { login, logout } = userSlice.actions;

export const selectLogged = (state: RootState) => state.user.isLogged;
export const selectUser = (state: RootState) => state.user.user;
export const selectPermissions = (state: RootState) => state.user.permissions;
export const selectUserNotification = (state: RootState) =>
  state.user.notification;

export default userSlice.reducer;

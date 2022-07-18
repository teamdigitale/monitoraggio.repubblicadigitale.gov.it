import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../../store';
import { RolePermissionI } from '../roles/rolesSlice';
import {
  clearSessionValues,
  setSessionValues,
} from '../../../utils/sessionHelper';

export interface UserStateI {
  isLogged: boolean;
  user?:
    | {
        name: string;
        nome?: string;
        surname: string;
        cognome?: string;
        role: string;
        codiceFiscale: string;
        profiliUtente?: any;
        integrazione: boolean;
      }
    | Record<string, never>;
  notification?: [];
  permissions: RolePermissionI[];
  idProgramma: string | null;
  idProgetto: string[] | null;
}

export interface UserProfileI {
  codiceRuolo: string;
  descrizioneRuolo: string;
  idProgetto: string;
  idProgramma: string;
  nomeEnte: string;
  nomeProgramma: string;
}

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const initialStateLogged: UserStateI = {
  isLogged: true,
  user: {
    name: 'Mario',
    surname: 'Rossi',
    role: 'DTD',
    codiceFiscale: 'UTENTE1',
    integrazione: true,
  },
  permissions: ['permission-1'],
  idProgramma: '0',
  idProgetto: ['0'],
};
const initialStateNotLogged: UserStateI = {
  isLogged: false,
  user: {},
  permissions: ['permission-1'],
  idProgramma: null,
  idProgetto: null,
};

const initialState: UserStateI = initialStateNotLogged;

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserContext: (state, action: PayloadAction<any>) => {
      state.user = {
        ...action.payload,
        role: action.payload?.profiliUtente?.[0]?.codiceRuolo,
      };
      //setSessionValues('user', state.user);
    },
    setUserProfile: (state, action: PayloadAction<any>) => {
      state.idProgramma = action.payload.idProgramma;
      state.idProgetto = [action.payload.idProgetto];
      setSessionValues('profile', action.payload);
    },
    login: (state) => {
      setSessionValues('user', state.user);
      state.isLogged = true;
    },
    logout: (state) => {
      state.isLogged = false;
      clearSessionValues();
    },
  },
});

export const { login, logout, setUserContext, setUserProfile } =
  userSlice.actions;

export const selectLogged = (state: RootState) => state.user.isLogged;
export const selectUser = (state: RootState) => state.user.user;
export const selectPermissions = (state: RootState) => state.user.permissions;
export const selectUserNotification = (state: RootState) =>
  state.user.notification;

export default userSlice.reducer;

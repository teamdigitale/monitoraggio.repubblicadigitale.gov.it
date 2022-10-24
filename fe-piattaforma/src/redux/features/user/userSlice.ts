import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../../store';
import { RolePermissionI } from '../roles/rolesSlice';
import {
  clearSessionValues,
  setSessionValues,
} from '../../../utils/sessionHelper';
import { isActiveProvisionalLogin } from '../../../pages/common/Auth/auth';

export interface UserStateI {
  isLogged: boolean;
  user?:
  | {
    id?: string;
    name?: string;
    nome?: string;
    surname?: string;
    cognome?: string;
    email?: string;
    role?: string;
    codiceFiscale: string;
    profiliUtente: UserProfileI[];
    integrazione: boolean;
    mostraBio: boolean;
    mostraTipoContratto: boolean;
    immagineProfilo?: string;
    utenteRegistratoInWorkdocs: boolean;
  }
  | Record<string, never>;
  notification: any[];
  notificationToRead: number;
  permissions: RolePermissionI[];
  idProgramma: string | null;
  idProgetto: string[] | null;
  idEnte: string | null;
  profilo?: UserProfileI | null;
  ruoli: {
    codiceRuolo: string;
    permessi: [];
  }[];
}

export interface UserProfileI {
  codiceRuolo: string;
  descrizioneRuolo: string;
  descrizioneRuoloCompleta?: string | undefined;
  idProgetto?: string;
  idProgramma?: string;
  idEnte?: string;
  nomeEnte?: string;
  nomeProgramma?: string;
  nomeProgettoBreve?: string;
}

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const initialStateLogged: UserStateI = {
  isLogged: true,
  user: {
    nome: 'Mario',
    cognome: 'Rossi',
    role: 'DTD',
    codiceFiscale: 'UTENTE1',
    email: 'mario.rossi@mail.com',
    integrazione: true,
    profiliUtente: [],
    mostraBio: false,
    mostraTipoContratto: false,
    utenteRegistratoInWorkdocs: false,
  },
  permissions: [],
  idProgramma: '0',
  idProgetto: ['0'],
  idEnte: '0',
  profilo: {
    codiceRuolo: 'REG',
    descrizioneRuolo: 'Referente',
  },
  ruoli: [],
  notification: [],
  notificationToRead: 0,
};
const initialStateNotLogged: UserStateI = {
  isLogged: false,
  user: {},
  permissions: [],
  idProgramma: null,
  idProgetto: null,
  idEnte: null,
  profilo: null,
  ruoli: [],
  notification: [],
  notificationToRead: 0,
};

const initialState: UserStateI = initialStateNotLogged;

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserContext: (state, action: PayloadAction<any>) => {
      state.user = {
        ...action.payload,
        ruoli: undefined,
      };
      state.ruoli = action.payload.ruoli;
      // setSessionValues('user', state.user);
    },
    setUserProfile: (state, action: PayloadAction<any>) => {
      const payload = { ...action.payload, saveSession: undefined };
      state.idProgramma = action.payload.idProgramma;
      state.idProgetto = [action.payload.idProgetto];
      state.idEnte = action.payload.idEnte;
      state.profilo = payload;
      if (state.ruoli?.length) {
        state.permissions = state.ruoli.filter(
          ({ codiceRuolo }) => codiceRuolo === action.payload.codiceRuolo
        )[0]?.permessi;
      }
      if (action.payload.saveSession) {
        setSessionValues('profile', payload);
      }
    },
    setUserNotifications: (state, action: PayloadAction<any>) => {
      state.notification = [...action.payload]
    },
    setUserNotificationsToRead: (state, action: PayloadAction<any>) => {
      state.notificationToRead = action.payload;
    },
    login: (state) => {
      setSessionValues('user', state.user);
      setSessionValues('profile', state.profilo);
      if (isActiveProvisionalLogin) {
        setSessionValues('auth', 'fguhbjinokj8765d578t9yvghugyftr646tg');
      }

      state.isLogged = true;
    },
    logout: (state) => {
      clearSessionValues();
      state.isLogged = false;
    },
  },
});

export const { login, logout, setUserContext, setUserProfile, setUserNotifications, setUserNotificationsToRead } =
  userSlice.actions;

export const selectLogged = (state: RootState) => state.user.isLogged;
export const selectUser = (state: RootState) => state.user.user;
export const selectProfile = (state: RootState) => state.user.profilo;
export const selectPermissions = (state: RootState) => state.user.permissions;
export const selectUserNotification = (state: RootState) => state.user.notification;
export const selectUserNotificationToRead = (state: RootState) =>
  state.user.notificationToRead;

export default userSlice.reducer;

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../../store';
import { RolePermissionI } from '../roles/rolesSlice';
import {
  clearSessionValues,
  setSessionValues,
} from '../../../utils/sessionHelper';

export interface UserStateI {
  isLogged: boolean;
  user?: {
        name?: string;
        nome?: string;
        surname?: string;
        cognome?: string;
        role?: string;
        codiceFiscale: string;
        profiliUtente: UserProfileI[];
        integrazione: boolean;
        mostraBio: boolean;
        mostraTipoContratto: boolean;
      }
    | Record<string, never>;
  notification?: [];
  permissions: RolePermissionI[];
  idProgramma: string | null;
  idProgetto: string[] | null;
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
    integrazione: true,
    profiliUtente: [],
    mostraBio: false,
    mostraTipoContratto: false,
  },
  permissions: [],
  idProgramma: '0',
  idProgetto: ['0'],
  profilo: {
    codiceRuolo: 'REG',
    descrizioneRuolo: 'Referente',
  },
  ruoli: [],
};
const initialStateNotLogged: UserStateI = {
  isLogged: false,
  user: {},
  permissions: [],
  idProgramma: null,
  idProgetto: null,
  profilo: null,
  ruoli: [],
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
      state.profilo = payload;
      if (state.ruoli?.length) {
        state.permissions = state.ruoli.filter(({ codiceRuolo }) => codiceRuolo === action.payload.codiceRuolo)[0]?.permessi
      }
      if (action.payload.saveSession) {
        setSessionValues('profile', payload);
      }
    },
    login: (state) => {
      setSessionValues('user', state.user);
      setSessionValues('profile', state.profilo);
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
export const selectProfile = (state: RootState) => state.user.profilo;
export const selectPermissions = (state: RootState) => state.user.permissions;
export const selectUserNotification = (state: RootState) =>
  state.user.notification;

export default userSlice.reducer;

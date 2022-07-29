import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../store';

export type RolePermissionI =
  // technical permissions
  | 'visible'
  | 'hidden'

  // BE permissions
  | 'tab.dshb'
  | 'view.dshb'
  | 'tab.am'
  | 'subtab.prgm'
  | 'subtab.prgt'
  | 'list.prgm'
  | 'list.prgt'
  | 'list.dwnl.prgm'
  | 'list.dwnl.prgt'
  | 'view.card.prgm.full'
  | 'new.prgm'
  | 'del.prgm'
  | 'end.prgm'
  | 'add.enti.gest.prgm'
  | 'upd.enti.card.prgm'
  | 'upd.enti.gest.prgm'
  | 'add.ref_del.gest.prgm'
  | 'upd.rel.quest_prgm'
  | 'del.ref_del.gest.prgm'
  // Surveys
  | 'subtab.quest'
  | 'upd.rel.quest_prgm'
  | 'list.quest.templ'
  | 'view.quest.templ'
  | 'upd.quest.templ'
  | 'del.quest.templ'
  | 'new.quest.templ'
  // Projects
  | 'add.prgt'
  | 'del.prgt'
  | 'act.prgt'
  | 'term.prgt'
  | 'upd.car.prgt'
  | 'add.enti.gest.prgt'
  | 'upd.enti.gest.prgt'
  | 'add.ente.partner'
  | 'upd.ente.partner'
  | 'del.ente.partner'
  | 'add.ref_del.gest.prgt'
  | 'del.ref_del.gest.prgt'
  | 'add.sede.gest.prgt'
  | 'upd.sede.gest.prgt'
  | 'add.ref_del.partner'
  | 'add.sede.partner'
  | 'upd.sede.partner'
  | 'del.ref_del.partner'
  // Authorities
  | 'list.dwnl.enti'
  | 'list.enti'
  | 'subtab.enti'
  | 'view.card.enti'
  | 'upd.card.enti'
  // Users
  | 'subtab.utenti'
  | 'list.utenti'
  | 'list.dwnl.utenti'
  | 'view.card.utenti'
  | 'upd.anag.utenti'
  | 'add.del.ruolo.utente'
  | 'upd.card.utenti'
  // Citizien
  | 'tab.citt'
  | 'list.citt'
  | 'list.dwnl.citt'
  // Headquarters
  | 'add.fac'
  // Roles
  | 'btn.gest.ruoli'
  | 'list.ruoli'
  | 'new.ruoli'
  | 'view.ruoli'
  | 'del.ruoli'
  | 'add.upd.permessi'
  // Services
  | 'subtab.serv'
  | 'list.serv'
  | 'new.serv'
  | 'del.serv'
  | 'upd.card.serv'
  | 'list.dwnl.serv'
  | 'view.card.serv';

interface RoleI {
  codiceRuolo: string;
  nomeRuolo: string;
  tipologiaRuolo: 'P' | 'NP';
}

interface PermissionI {
  id: string | number;
  codice: RolePermissionI;
  descrizione: string;
}

export interface GroupI {
  codice: string;
  descrizione: string;
  permessi: PermissionI[];
}

export interface RolesStateI {
  list: RoleI[];
  groups: GroupI[];
  role: {
    dettaglioRuolo?: {
      nome: string;
      stato: string;
      tipologia: string;
    };
    dettaglioGruppi?: {
      codice: string; // TODO RoleGroupI
      descrizione: string;
    }[];
  };
  pagination: {
    pageSize: number;
    pageNumber: number;
  };
}

const initialState: RolesStateI = {
  list: [],
  groups: [],
  role: {},
  pagination: {
    pageSize: 8,
    pageNumber: 1,
  },
};

export const rolesSlice = createSlice({
  name: 'roles',
  initialState,
  reducers: {
    setRolesList: (state, action: PayloadAction<any>) => {
      state.list = action.payload.list;
    },
    setRolesPagination: (state, action: PayloadAction<any>) => {
      state.pagination = {
        ...state.pagination,
        ...action.payload,
      };
    },
    setRoleDetails: (state, action: PayloadAction<any>) => {
      state.role = action.payload;
    },
    setGroupsList: (state, action: PayloadAction<any>) => {
      state.groups = action.payload.list;
    },
  },
});

export const {
  setRolesList,
  setRolesPagination,
  setRoleDetails,
  setGroupsList,
} = rolesSlice.actions;

export const selectRolesList = (state: RootState) => state.roles.list;
export const selectRolesPagination = (state: RootState) =>
  state.roles.pagination;
export const selectRoleDetails = (state: RootState) => state.roles.role;
export const selectGroupsList = (state: RootState) => state.roles.groups;

export default rolesSlice.reducer;

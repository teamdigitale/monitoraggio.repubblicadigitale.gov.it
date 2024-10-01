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
  | 'del.ref_del.gest.prgm'
  | 'vis.mntr'
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
  | 'new.utente'
  | 'del.utente'
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
  | 'add.fac.partner'
  | 'del.sede.gest.prgt'
  | 'del.sede.partner'
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
  | 'view.card.serv'
  // Dashboard
  | 'acc.self.dshb'
  | 'self.bi'
  // WAVE-3
  | 'btn.cat'
  | 'btn.cont'
  | 'btn.rprt'
  // Notifiche
  | 'list.ntf.nr'
  // Home
  | 'tab.home'
  // Bacheca
  | 'tab.bach'
  | 'list.news'
  | 'view.card.news'
  | 'new.news'
  | 'upd.news'
  | 'del.news'
  | 'rprt.news'
  // Comunity
  | 'tab.comm'
  | 'list.topic'
  | 'view.card.topic'
  | 'new.topic'
  | 'upd.topic'
  | 'del.topic'
  | 'rprt.topic'
  // Documenti
  | 'tab.doc'
  | 'list.doc'
  | 'view.card.doc'
  | 'new.doc'
  | 'upd.doc'
  | 'del.doc'
  | 'rprt.doc'
  // WorkDocs
  | 'acc.clb'
  // RocketChat
  | 'btn.chat';

interface RoleI {
  codiceRuolo: string;
  nomeRuolo: string;
  tipologiaRuolo: 'P' | 'NP';
  modificabile: boolean;
}

interface PermissionI {
  id: string | number;
  codice: RolePermissionI;
  descrizione: string;
}

export interface GroupI {
  gruppo: {
    codice: string;
    descrizione: string;
    permessi: PermissionI[];
    dataOraAggiornamento?: string | number;
    dataOraCreazione?: string | number;
  };
  ruoliAssociatiAlGruppo?: string[];
}

export interface RolesStateI {
  list: RoleI[];
  groups: GroupI[];
  role: {
    dettaglioRuolo?: {
      nome: string;
      stato: string;
      tipologia: string;
      modificabile: boolean;
    };
    dettaglioGruppi?: {
      codice: string; // TODO RoleGroupI
      descrizione: string;
    }[];
  };
}

const initialState: RolesStateI = {
  list: [],
  groups: [],
  role: {},
};

export const rolesSlice = createSlice({
  name: 'roles',
  initialState,
  reducers: {
    setRolesList: (state, action: PayloadAction<any>) => {
      state.list = action.payload.list;
    },
    setRoleDetails: (state, action: PayloadAction<any>) => {
      state.role = action.payload;
    },
    setGroupsList: (state, action: PayloadAction<any>) => {
      state.groups = action.payload.list;
    },
  },
});

export const { setRolesList, setRoleDetails, setGroupsList } =
  rolesSlice.actions;

export const selectRolesList = (state: RootState) => state.roles.list;
export const selectRoleDetails = (state: RootState) => state.roles.role;
export const selectGroupsList = (state: RootState) => state.roles.groups;

export default rolesSlice.reducer;

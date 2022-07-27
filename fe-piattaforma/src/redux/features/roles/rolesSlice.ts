import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../store';

export type RolePermissionI =
  // technical permissions
  | 'visible'
  | 'hidden'

  // BE permissions
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
  // Surveys
  | 'upd.rel.quest_prgm'
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
  // Citizien
  | 'tab.citt'
  | 'list.citt'
  | 'list.dwnl.citt';

interface RoleI {
  codiceRuolo: string;
  nomeRuolo: string;
}

interface RolesStateI {
  list: RoleI[];
  pagination: {
    pageSize: number;
    pageNumber: number;
  };
}

const initialState: RolesStateI = {
  list: [],
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
  },
});

export const { setRolesList, setRolesPagination } = rolesSlice.actions;

export const selectRolesList = (state: RootState) => state.roles.list;
export const selectRolesPagination = (state: RootState) =>
  state.roles.pagination;

export default rolesSlice.reducer;

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../store';

export type RolePermissionI = 'permission-1' | 'permission-2';

interface RoleI {
  name: string;
  id: string;
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

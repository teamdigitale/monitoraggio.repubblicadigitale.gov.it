import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { BreadcrumbI } from '../../../components/Breadcrumb/breadCrumb';
import type { RootState } from '../../store';

interface AppStateI {
  device: {
    mediaIsPhone?: boolean;
    mediaIsTablet?: boolean;
    //mediaIsLaptop?: boolean,
    mediaIsDesktop?: boolean;
  };
  loader: {
    isLoading: boolean;
    count: number;
  };
  customBreadCrumb: BreadcrumbI[];
  infoIdsBreadcrumb: { id: string | number; nome: string }[];
}

const initialState: AppStateI = {
  device: {},
  loader: {
    isLoading: false,
    count: 0,
  },
  customBreadCrumb: [],
  infoIdsBreadcrumb: [],
};

export const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    showLoader: (state) => {
      state.loader = {
        ...state.loader,
        count: state.loader.count + 1,
        isLoading: Math.max(0, state.loader.count + 1) > 0,
      };
    },
    hideLoader: (state) => {
      state.loader = {
        ...state.loader,
        count: Math.max(0, state.loader.count - 1),
        isLoading: Math.max(0, state.loader.count - 1) > 0,
      };
    },
    updateDevice: (state, action: PayloadAction<any>) => {
      state.device = action.payload;
    },
    updateCustomBreadcrumb: (state, action: PayloadAction<any>) => {
      state.customBreadCrumb = [...action.payload];
    },
    setInfoIdsBreadcrumb: (state, action: PayloadAction<any>) => {
      if (
        !state.infoIdsBreadcrumb.filter(
          (elem) => elem.id === action.payload?.id
        )[0]
      ) {
        state.infoIdsBreadcrumb.push(action.payload);
      } else if (action.payload?.updateRoleBreadcrumb) {
        // in role management: same id, update label realtime
        const index = state.infoIdsBreadcrumb.findIndex(
          (elem) =>
            elem.id === action.payload?.id && elem.nome !== action.payload?.nome
        );
        if (index >= 0) {
          state.infoIdsBreadcrumb[index].nome = action.payload?.nome;
        }
      }
    },
  },
});

export const {
  showLoader,
  hideLoader,
  updateDevice,
  updateCustomBreadcrumb,
  setInfoIdsBreadcrumb,
} = appSlice.actions;

export const selectLoader = (state: RootState) => state.app.loader;
export const selectDevice = (state: RootState) => state.app.device;
export const selectCustomBreadcrumb = (state: RootState) =>
  state.app.customBreadCrumb;
export const selectInfoIdsBreadcrumb = (state: RootState) =>
  state.app.infoIdsBreadcrumb;

export default appSlice.reducer;

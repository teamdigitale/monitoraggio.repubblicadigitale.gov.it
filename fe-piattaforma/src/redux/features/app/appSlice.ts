import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { BreadcrumbI } from '../../../components/Breadcrumb/breadCrumb';
import type { RootState } from '../../store';

export interface DeviceI {
  mediaIsPhone?: boolean;
  mediaIsTablet?: boolean;
  //mediaIsLaptop?: boolean,
  mediaIsDesktop?: boolean;
}

interface AppStateI {
  device: DeviceI;
  loader: {
    isLoading: boolean;
    count: number;
  };
  isBreadCrumbPresent: boolean;
  customBreadCrumb: BreadcrumbI[];
  infoIdsBreadcrumb: { id: string | number; nome: string }[];
  publishedContent?: boolean;
}

const initialState: AppStateI = {
  device: {},
  loader: {
    isLoading: false,
    count: 0,
  },
  isBreadCrumbPresent: true,
  customBreadCrumb: [],
  infoIdsBreadcrumb: [],
  publishedContent: false,
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
    resetCustomBreadcrumb: (state) => {
      state.customBreadCrumb = initialState.customBreadCrumb;
    },
    setInfoIdsBreadcrumb: (state, action: PayloadAction<any>) => {
      if (
        !state.infoIdsBreadcrumb.filter(
          (elem) => elem.id?.toString() === action.payload?.id?.toString()
        )[0]
      ) {
        state.infoIdsBreadcrumb.push(action.payload);
      } else if (action.payload?.updateRoleBreadcrumb) {
        // in role management: same id, update label realtime
        const index = state.infoIdsBreadcrumb.findIndex(
          (elem) =>
            elem.id?.toString() === action.payload?.id?.toString() &&
            elem.nome !== action.payload?.nome
        );
        if (index >= 0) {
          state.infoIdsBreadcrumb[index].nome = action.payload?.nome;
        }
      }
    },
    resetInfoIdsBreadcrumb: (state) => {
      state.infoIdsBreadcrumb = initialState.infoIdsBreadcrumb;
    },
    showBreadCrumb: (state) => {
      state.isBreadCrumbPresent = initialState.isBreadCrumbPresent;
    },
    hideBreadCrumb: (state) => {
      state.isBreadCrumbPresent = false;
    },
    setPublishedContent: (state, action: PayloadAction<any>) => {
      state.publishedContent = action.payload;
    },
    resetPublishedContentState: () => initialState,
  },
});

export const {
  showLoader,
  hideLoader,
  updateDevice,
  updateCustomBreadcrumb,
  resetCustomBreadcrumb,
  setInfoIdsBreadcrumb,
  resetInfoIdsBreadcrumb,
  showBreadCrumb,
  hideBreadCrumb,
  setPublishedContent,
  resetPublishedContentState,
} = appSlice.actions;

export const selectLoader = (state: RootState) => state.app.loader;
export const selectDevice = (state: RootState) => state.app.device;
export const selectCustomBreadcrumb = (state: RootState) =>
  state.app.customBreadCrumb;
export const selectInfoIdsBreadcrumb = (state: RootState) =>
  state.app.infoIdsBreadcrumb;
export const selectIsBreadcrumbPresent = (state: RootState) =>
  state.app.isBreadCrumbPresent;
export const selectPublishedContent = (state: RootState) =>
  state.app.publishedContent;

export default appSlice.reducer;

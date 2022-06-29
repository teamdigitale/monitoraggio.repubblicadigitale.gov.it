import { createSlice, PayloadAction } from '@reduxjs/toolkit';
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
}

const initialState: AppStateI = {
  device: {},
  loader: {
    isLoading: false,
    count: 0,
  },
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
  },
});

export const { showLoader, hideLoader, updateDevice } = appSlice.actions;

export const selectLoader = (state: RootState) => state.app.loader;
export const selectDevice = (state: RootState) => state.app.device;

export default appSlice.reducer;

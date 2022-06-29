import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../store';

export interface CittadinoInfoI {
  name?: string;
  lastName?: string;
  fiscalCode?: string;
  nDoc?: string;
  nationality?: string;
  age?: string;
  degree?: string;
  occupation?: string;
  email?: string;
  phone?: string;
  consensoOTP?: boolean;
  confModulo?: boolean;
  dataConf?: string;
  userId?: string;
  nome?: string;
  cognome?: string;
  codiceFiscale?: string;
  telefono?: string;
  message?: string;
}

export interface CittadinoI {
  info: CittadinoInfoI;
  questionari: any[];
}

interface AreaCittadiniStateI {
  list: any[];
  filters: {
    [key: string]:
      | { label: string; value: string | number | any[] }[]
      | undefined;
  };
  filterOptions: {
    [key: string]:
      | { label: string; value: string | number | any[] }[]
      | undefined;
  };
  pagination: {
    pageSize: number;
    pageNumber: number;
  };
  detail: CittadinoI;
  searchResult: CittadinoInfoI;
  multipleSearchResult: CittadinoInfoI[];
}

const initialState: AreaCittadiniStateI = {
  list: [],
  filters: {
    nameLike: [{ label: 'mario', value: 'mario_1' }],
  },
  filterOptions: {
    policy: [
      { label: 'RFD', value: 1 },
      { label: 'SCD', value: 2 },
    ],
  },
  pagination: {
    pageSize: 8,
    pageNumber: 1,
  },
  detail: { info: {}, questionari: [] },
  searchResult: {},
  multipleSearchResult: [],
};

export const citizensAreaSlice = createSlice({
  name: 'citizensArea',
  initialState,
  reducers: {
    resetAreaCittadiniState: () => initialState,
    cleanEntityFilters: (state, action: PayloadAction<any>) => {
      if (action.payload) {
        let newFilterValue = null;
        if (Array.isArray(state.filters[action.payload.filterKey])) {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          newFilterValue = state.filters[action.payload.filterKey].filter(
            (f: any) => f.value !== action.payload.value
          );
          if (!newFilterValue?.length) {
            newFilterValue = null;
          }
        }

        state.filters = {
          ...state.filters,
          [action.payload.filterKey]: newFilterValue,
        };
      } else {
        state.filters = initialState.filters;
      }
    },
    setEntityFilters: (state, action: PayloadAction<any>) => {
      console.log(action.payload);
      state.filters = {
        ...state.filters,
        ...action.payload,
      };
    },
    setEntityFilterOptions: (state, action: PayloadAction<any>) => {
      state.filterOptions = {
        ...state.filterOptions,
        ...action.payload,
      };
    },
    setEntityPagination: (state, action: PayloadAction<any>) => {
      state.pagination = {
        ...state.pagination,
        ...action.payload,
      };
    },
    setEntityValues: (state, action: PayloadAction<any>) => {
      state.list = action.payload.data.data.list;
    },
    getEntityDetail: (state, action: PayloadAction<any>) => {
      state.detail = action.payload;
    },
    getEntitySearch: (state, action: PayloadAction<any>) => {
      state.searchResult = action.payload;
    },
    getEntitySearchMultiple: (state, action: PayloadAction<any>) => {
      state.multipleSearchResult = action.payload;
    },
    clearInfoForm: (state) => {
      state.detail.info = {};
    },
  },
});

export const {
  resetAreaCittadiniState,
  cleanEntityFilters,
  setEntityFilters,
  setEntityFilterOptions,
  setEntityPagination,
  setEntityValues,
  getEntityDetail,
  getEntitySearch,
  clearInfoForm,
  getEntitySearchMultiple,
} = citizensAreaSlice.actions;

export const selectEntityList = (state: RootState) => state.citizensArea.list;
export const selectEntityFilters = (state: RootState) =>
  state.citizensArea.filters;
export const selectEntityFiltersOptions = (state: RootState) =>
  state.citizensArea.filterOptions;
export const selectEntityPagination = (state: RootState) =>
  state.citizensArea.pagination;
export const selectEntityDetail = (state: RootState) =>
  state.citizensArea.detail;
export const selectEntitySearchResponse = (state: RootState) =>
  state.citizensArea.searchResult;
export const selectEntitySearchMultiResponse = (state: RootState) =>
  state.citizensArea.multipleSearchResult;

export default citizensAreaSlice.reducer;

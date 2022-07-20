import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { formFieldI } from '../../../utils/formHelper';
import { RootState } from '../../store';
import { PaginationI } from '../administrativeArea/administrativeAreaSlice';

export interface CittadinoInfoI {
  idCittadino?: string;
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
  numeroQuestionariCompilati?: string;
  numeroServizi?: string;
}

export interface ServizioCittadinoI {
  idQuestionarioCompilato?: string;
  idServizio?: string;
  nomeCompletoFacilitatore?: string;
  nomeServizio?: string;
  statoQuestionario?: string;
}

export interface CittadinoI {
  dettaglioCittadino: { [key: string]: formFieldI['value'] | undefined };
  serviziCittadino: ServizioCittadinoI[];
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
  pagination: PaginationI;
  detail: CittadinoI;
  searchResult: CittadinoInfoI;
  multipleSearchResult: CittadinoInfoI[];
}

const initialState: AreaCittadiniStateI = {
  list: [],
  filters: {
    // nameLike: [{ label: 'mario', value: 'mario_1' }],
  },
  filterOptions: {},
  pagination: {
    pageSize: 8,
    pageNumber: 1,
    totalPages: 1,
    totalElements: 0,
  },
  detail: { dettaglioCittadino: {}, serviziCittadino: [] },
  searchResult: {},
  multipleSearchResult: [],
};

export const citizensAreaSlice = createSlice({
  name: 'citizensArea',
  initialState,
  reducers: {
    resetAreaCittadiniState: () => initialState,
    cleanEntityFiltersCitizen: (state, action: PayloadAction<any>) => {
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
      state.list = action.payload.data;
    },
    getEntityDetail: (state, action: PayloadAction<any>) => {
      if (action.payload.data) {
        state.detail = action.payload.data;
      } else {
        state.detail = action.payload;
      }
    },
    getEntitySearch: (state, action: PayloadAction<any>) => {
      state.searchResult = action.payload;
    },
    getEntitySearchMultiple: (state, action: PayloadAction<any>) => {
      state.multipleSearchResult = action.payload;
    },
    clearInfoForm: (state) => {
      state.detail.dettaglioCittadino = {};
    },
    clearCitizenSearch: (state) => {
      state.searchResult = {};
      state.multipleSearchResult = [];
    },
    deleteFiltroCriterioRicercaCitizen: (state) => {
      const newFilters = { ...state.filters };
      delete newFilters.criterioRicerca;
      state.filters = { ...newFilters };
    },
  },
});

export const {
  resetAreaCittadiniState,
  cleanEntityFiltersCitizen,
  setEntityFilters,
  setEntityFilterOptions,
  setEntityPagination,
  setEntityValues,
  getEntityDetail,
  getEntitySearch,
  clearInfoForm,
  getEntitySearchMultiple,
  clearCitizenSearch,
  deleteFiltroCriterioRicercaCitizen,
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

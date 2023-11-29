import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { formFieldI } from '../../../utils/formHelper';
import { RootState } from '../../store';
import { PaginationI } from '../administrativeArea/administrativeAreaSlice';

export interface CittadinoInfoI {
  idCittadino?: string | number;
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
  numeroDocumento?: string;
}

export interface ServizioCittadinoI {
  idQuestionarioCompilato?: string;
  idServizio?: string;
  /* nomeCompletoFacilitatore?: string; */
  nomeServizio?: string;
  statoQuestionario?: string;
  associatoAUtente?: boolean;
  nomeSede?: string;
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
  searchResult: CittadinoInfoI[];
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
  searchResult: [],
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
      state.pagination = initialState.pagination;
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
    setCitizenSearchResults: (state, action: PayloadAction<any>) => {
      state.searchResult = action.payload;
    },
    clearInfoForm: (state) => {
      state.detail.dettaglioCittadino = {};
    },
    clearCitizenSearch: (state) => {
      state.searchResult = [];
    },
    deleteFiltroCriterioRicercaCitizen: (state) => {
      const newFilters = { ...state.filters };
      delete newFilters.criterioRicerca;
      state.filters = { ...newFilters };
    },
    resetCitizenDetails: (state) => {
      state.detail = initialState.detail;
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
  clearInfoForm,
  setCitizenSearchResults,
  clearCitizenSearch,
  deleteFiltroCriterioRicercaCitizen,
  resetCitizenDetails,
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
export const selectCitizenSearchResponse = (state: RootState) =>
  state.citizensArea.searchResult;

export default citizensAreaSlice.reducer;

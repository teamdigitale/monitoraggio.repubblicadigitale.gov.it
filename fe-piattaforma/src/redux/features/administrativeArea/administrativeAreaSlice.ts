import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../store';
import { PaginatorI } from '../../../components/Paginator/paginator';
import {
  ProgramsLightI,
  //ProgrammaListResponseI,
} from './programs/programsThunk';
import { ProjectLightI } from './projects/projectsThunk';
import { UtentiLightI } from './user/userThunk';
import { AuthoritiesLightI } from './authorities/authoritiesThunk';
import { SurveyLightI } from './surveys/surveysThunk';

export interface AreaAmministrativaStateI {
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
  detail: {
    info?: { [key: string]: string };
    ref?: { name: string; status: string; id: string }[];
    del?: { name: string; status: string; id: string }[];
    pagination?: PaginatorI;
    list?: any[];
    idEnteGestore?: string;
  };
  programmi: {
    list: ProgramsLightI[];
    detail: any;
  };
  progetti: {
    list: ProjectLightI[];
    detail: any;
  };
  surveys: {
    list: SurveyLightI[];
    detail: any;
  };
  utenti: {
    list: UtentiLightI[];
    detail: any;
  };
  enti: {
    list: AuthoritiesLightI[];
    detail: any;
  };
  sedi: {
    detail: any;
  };
}

const initialState: AreaAmministrativaStateI = {
  list: [],
  filters: {
    criterioRicerca: [{ label: 'mario', value: 'mario_1' }],
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
  detail: {},
  programmi: {
    list: [],
    detail: {},
  },
  progetti: {
    list: [],
    detail: {},
  },
  surveys: {
    list: [],
    detail: {},
  },
  utenti: {
    list: [],
    detail: {},
  },
  enti: {
    list: [],
    detail: {},
  },
  sedi: {
    detail: {},
  },
};

export const administrativeAreaSlice = createSlice({
  name: 'administrativeArea',
  initialState,
  reducers: {
    resetEntityState: () => initialState,
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
    setEntityDetail: (state, action: PayloadAction<any>) => {
      state.detail = action.payload;
    },
    emptyDetail: (state) => {
      state.detail = {};
    },
    setProgramsList: (state, action: PayloadAction<any>) => {
      state.programmi.list = [...action.payload.data];
    },
    setProgettiList: (state, action: PayloadAction<any>) => {
      state.progetti.list = [...action.payload.data];
    },
    setSurveysList: (state, action: PayloadAction<any>) => {
      state.surveys.list = [...action.payload.data];
    },
    setUtentiList: (state, action: PayloadAction<any>) => {
      state.utenti.list = [...action.payload.data];
    },
    setEntiList: (state, action: PayloadAction<any>) => {
      state.enti.list = [...action.payload.data];
    },
    setEntiDetail: (state, action: PayloadAction<any>) => {
      state.enti.detail = { ...action.payload.data };
    },
    setProgrammaDetail: (state, action) => {
      state.programmi.detail = { ...action.payload.data };
    },
    setProgettoDetail: (state, action) => {
      state.progetti.detail = { ...action.payload.data };
    },
    setSurveyDetail: (state, action) => {
      state.surveys.detail = { ...action.payload.data };
    },
    setSedeDetail: (state, action) => {
      state.sedi.detail = { ...action.payload.data };
    },
    setUtenteDetail: (state, action) => {
      state.utenti.detail = { ...action.payload.data };
    },
  },
});

export const {
  resetEntityState,
  cleanEntityFilters,
  setEntityFilters,
  setEntityFilterOptions,
  setEntityPagination,
  setEntityValues,
  setEntityDetail,
  emptyDetail,
  setProgramsList,
  setProgettiList,
  setSurveysList,
  setUtentiList,
  setEntiList,
  setEntiDetail,
  setProgrammaDetail,
  setProgettoDetail,
  setSurveyDetail,
  setSedeDetail,
  setUtenteDetail,
} = administrativeAreaSlice.actions;

export const selectEntityList = (state: RootState) =>
  state.administrativeArea.list;
export const selectEntityFilters = (state: RootState) =>
  state.administrativeArea.filters;
export const selectEntityFiltersOptions = (state: RootState) =>
  state.administrativeArea.filterOptions;
export const selectEntityPagination = (state: RootState) =>
  state.administrativeArea.pagination;
export const selectEntityDetail = (state: RootState) =>
  state.administrativeArea.detail;
export const selectProgrammi = (state: RootState) =>
  state.administrativeArea.programmi;
export const selectProgetti = (state: RootState) =>
  state.administrativeArea.progetti;
export const selectSurveys = (state: RootState) =>
  state.administrativeArea.surveys;
export const selectUtenti = (state: RootState) =>
  state.administrativeArea.utenti;
export const selectEnti = (state: RootState) => state.administrativeArea.enti;
export const selectSedi = (state: RootState) => state.administrativeArea.sedi;

export default administrativeAreaSlice.reducer;

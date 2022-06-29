import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../store';
import { PaginatorI } from '../../../components/Paginator/paginator';
import { ProgramsLightI } from './programs/programsThunk';
import { ProjectLightI } from './projects/projectsThunk';
import { UtentiLightI } from './user/userThunk';
import { AuthoritiesLightI } from './authorities/authoritiesThunk';
import { SurveyLightI } from './surveys/surveysThunk';
import { CitizenI } from '../../../pages/administrator/AdministrativeArea/Entities/Services/citizensList';
import { ServicesI } from './services/servicesThunk';

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
  programs: {
    list: ProgramsLightI[];
    detail: any;
  };
  projects: {
    list: ProjectLightI[];
    detail: any;
  };
  surveys: {
    list: SurveyLightI[];
    detail: any;
  };
  users: {
    list: UtentiLightI[];
    detail: any;
  };
  authorities: {
    list: AuthoritiesLightI[];
    detail: any;
  };
  headquarters: {
    detail: any;
  };
  services: {
    list: ServicesI[];
    detail: { info: { [key: string]: string }; cittadini: CitizenI[] };
  };
}

const initialState: AreaAmministrativaStateI = {
  list: [],
  filters: {
    criterioRicerca: [{ label: 'policy', value: 'mario_1' }],
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
  programs: {
    list: [],
    detail: {},
  },
  projects: {
    list: [],
    detail: {},
  },
  surveys: {
    list: [],
    detail: {},
  },
  users: {
    list: [],
    detail: {},
  },
  authorities: {
    list: [],
    detail: {},
  },
  headquarters: {
    detail: {},
  },
  services: {
    list: [],
    detail: { info: {}, cittadini: [] },
  },
};

export const administrativeAreaSlice = createSlice({
  name: 'administrativeArea',
  initialState,
  reducers: {
    resetEntityState: () => initialState,
    resetFiltersState: (state) => {
      state.filters = initialState.filters;
    },
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
      state.programs.list = [...action.payload.data];
    },
    setProjectsList: (state, action: PayloadAction<any>) => {
      state.projects.list = [...action.payload.data];
    },
    setSurveysList: (state, action: PayloadAction<any>) => {
      state.surveys.list = [...action.payload.data];
    },
    setUsersList: (state, action: PayloadAction<any>) => {
      state.users.list = [...action.payload.data];
    },
    setAuthoritiesList: (state, action: PayloadAction<any>) => {
      state.authorities.list = [...action.payload.data];
    },
    setAuthoritiesDetails: (state, action: PayloadAction<any>) => {
      state.authorities.detail = { ...action.payload.data };
    },
    setProgramDetails: (state, action) => {
      state.programs.detail = { ...action.payload.data };
    },
    setProgramGeneralInfo: (state, action: PayloadAction<any>) => {
      if (action.payload.currentStep === 2) {
        state.programs.detail = {
          ...state.programs.detail,
          generalInfo: action.payload.newFormValues,
        };
      } else if (action.payload.currentStep === 3) {
        state.programs.detail = {
          ...state.programs.detail,
          facilitationNumber: action.payload.newFormValues,
        };
      } else if (action.payload.currentStep === 4) {
        state.programs.detail = {
          ...state.programs.detail,
          uniqueUsers: action.payload.newFormValues,
        };
      } else if (action.payload.currentStep === 5) {
        state.programs.detail = {
          ...state.programs.detail,
          services: action.payload.newFormValues,
        };
      } else {
        state.programs.detail = {
          ...state.programs.detail,
          facilitators: action.payload.newFormValues,
        };
      }
    },
    resetProgramDetails: (state) => {
      state.programs.detail = {};
    },
    setProjectDetails: (state, action) => {
      state.projects.detail = { ...action.payload.data };
    },
    setProjectGeneralInfo: (state, action: PayloadAction<any>) => {
      if (action.payload.currentStep === 2) {
        state.projects.detail = {
          ...state.projects.detail,
          generalInfo: action.payload.newFormValues,
        };
      } else if (action.payload.currentStep === 3) {
        state.projects.detail = {
          ...state.projects.detail,
          facilitationNumber: action.payload.newFormValues,
        };
      } else if (action.payload.currentStep === 4) {
        state.projects.detail = {
          ...state.projects.detail,
          uniqueUsers: action.payload.newFormValues,
        };
      } else if (action.payload.currentStep === 5) {
        state.projects.detail = {
          ...state.projects.detail,
          services: action.payload.newFormValues,
        };
      } else {
        state.projects.detail = {
          ...state.projects.detail,
          facilitators: action.payload.newFormValues,
        };
      }
    },
    resetProjectDetails: (state) => {
      state.projects.detail = {};
    },
    setSurveyDetail: (state, action) => {
      state.surveys.detail = { ...action.payload.data };
    },
    setHeadquartersDetails: (state, action) => {
      state.headquarters.detail = { ...action.payload.data };
    },
    setUserDetails: (state, action) => {
      state.users.detail = { ...action.payload.data };
    },
    setEventsList: (state, action: PayloadAction<any>) => {
      state.services.list = action.payload.data;
    },
    setServicesDetail: (state, action: PayloadAction<any>) => {
      state.services.detail = action.payload;
    },
    addCitizenToList: (state, action: PayloadAction<CitizenI>) => {
      state.services.detail.cittadini.push({ ...action.payload });
    },
  },
});

export const {
  resetEntityState,
  resetFiltersState,
  cleanEntityFilters,
  setEntityFilters,
  setEntityFilterOptions,
  setEntityPagination,
  setEntityValues,
  setEntityDetail,
  emptyDetail,
  setProgramsList,
  setProjectsList,
  setSurveysList,
  setUsersList,
  setAuthoritiesList,
  setAuthoritiesDetails,
  setProgramDetails,
  setProjectDetails,
  setSurveyDetail,
  setHeadquartersDetails,
  setUserDetails,
  setEventsList,
  setServicesDetail,
  setProgramGeneralInfo,
  resetProgramDetails,
  setProjectGeneralInfo,
  resetProjectDetails,
  addCitizenToList,
} = administrativeAreaSlice.actions;

export const selectEntityList = (state: RootState) =>
  state.administrativeArea.list;
export const selectEntityFilters = (state: RootState) =>
  state.administrativeArea.filters;
export const selectEntityFiltersOptions = (state: RootState) =>
  state.administrativeArea.filterOptions;
export const selectEntityPagination = (state: RootState) =>
  state.administrativeArea.pagination;
export const selectPrograms = (state: RootState) =>
  state.administrativeArea.programs;
export const selectProjects = (state: RootState) =>
  state.administrativeArea.projects;
export const selectSurveys = (state: RootState) =>
  state.administrativeArea.surveys;
export const selectUsers = (state: RootState) => state.administrativeArea.users;
export const selectAuthorities = (state: RootState) =>
  state.administrativeArea.authorities;
export const selectHeadquarters = (state: RootState) =>
  state.administrativeArea.headquarters;
export const selectServices = (state: RootState) =>
  state.administrativeArea.services;

export default administrativeAreaSlice.reducer;

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../store';
import { PaginatorI } from '../../../components/Paginator/paginator';
import { ProgramsLightI } from './programs/programsThunk';
import { ProjectLightI } from './projects/projectsThunk';
import { UtentiLightI } from './user/userThunk';
import { AuthoritiesLightI } from './authorities/authoritiesThunk';
import { SurveyLightI } from './surveys/surveysThunk';
import { CitizenListI, ServicesI } from './services/servicesThunk';
import { HeadquarterLight } from './headquarters/headquartersThunk';
import { SurveySectionPayloadI } from './surveys/surveysSlice';

export interface PaginationI {
  pageSize: number;
  pageNumber: number;
  totalPages: number;
  totalElements: number;
}

export interface AreaAmministrativaStateI {
  list: any;
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
    list: UtentiLightI[] | null;
    detail: any;
  };
  authorities: {
    list: AuthoritiesLightI[] | null;
    detail: any;
  };
  headquarters: {
    detail: any;
    list: HeadquarterLight[] | null;
  };
  services: {
    list: ServicesI[];
    detail: {
      dettaglioServizio: { [key: string]: string };
      sezioneQ3compilato: {
        [key: string]: string | { [key: string]: { [key: string]: string } };
      };
      questionarioTemplateSnapshot: {
        [key: string]: string | SurveySectionPayloadI[];
      };
      progettiAssociatiAlServizio: {
        id: string;
        nomeBreve: string;
        stato: string;
      }[];
      cittadini: CitizenListI;
      sezioniQuestionarioTemplateIstanze: {
        domandaRisposta: { json: string };
      }[];
    };
    dropdownsCreation: { [key: string]: any[] };
    dynamicSchemaFieldsCreation: any;
  };
}

const initialState: AreaAmministrativaStateI = {
  list: {},
  filters: {},
  filterOptions: {},
  pagination: {
    pageSize: 8,
    pageNumber: 1,
    totalPages: 1,
    totalElements: 0,
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
    list: null,
    detail: {},
  },
  headquarters: {
    detail: {},
    list: null,
  },
  services: {
    list: [],
    detail: {
      dettaglioServizio: {},
      sezioneQ3compilato: {},
      questionarioTemplateSnapshot: {},
      progettiAssociatiAlServizio: [],
      cittadini: { cittadini: [] },
      sezioniQuestionarioTemplateIstanze: [],
    },
    dropdownsCreation: {},
    dynamicSchemaFieldsCreation: {},
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
    resetPaginationState: (state) => {
      state.pagination = initialState.pagination;
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
      state.users.list = action.payload ? [...action.payload] : null;
    },
    setAuthoritiesList: (state, action: PayloadAction<any>) => {
      state.authorities.list = action.payload ? [...action.payload] : null;
    },
    resetAuthorityDetails: (state) => {
      state.authorities.detail = {};
    },
    setAuthorityDetails: (state, action: PayloadAction<any>) => {
      state.authorities.detail = { ...action.payload };
    },
    setProgramDetails: (state, action) => {
      state.programs.detail = { ...action.payload };
    },
    setAuthorityGeneralInfo: (state, action: PayloadAction<any>) => {
      state.authorities.detail = {
        ...state.authorities.detail,
        dettagliInfoEnte: {
          ...state.authorities.detail.dettagliInfoEnte,
          ...action.payload,
        },
      };
    },
    setProgramGeneralInfo: (state, action: PayloadAction<any>) => {
      let filteredDetails = { ...state.programs.detail.dettagliInfoProgramma };
      if (action.payload.currentStep === 0) {
        state.programs.detail = {
          ...state.programs.detail,
          dettagliInfoProgramma: {
            ...filteredDetails,
            ...action.payload.newFormValues,
          },
        };
      } else if (action.payload.currentStep === 1) {
        filteredDetails = Object.fromEntries(
          Object.entries(filteredDetails).filter(
            ([key]) => !key.includes('puntiFacilitazione')
          )
        );
        state.programs.detail = {
          ...state.programs.detail,
          dettagliInfoProgramma: {
            ...filteredDetails,
            ...action.payload.newFormValues,
          },
        };
      } else if (action.payload.currentStep === 2) {
        filteredDetails = Object.fromEntries(
          Object.entries(filteredDetails).filter(
            ([key]) => !key.includes('utentiUnici')
          )
        );
        state.programs.detail = {
          ...state.programs.detail,
          dettagliInfoProgramma: {
            ...filteredDetails,
            ...action.payload.newFormValues,
          },
        };
      } else if (action.payload.currentStep === 3) {
        filteredDetails = Object.fromEntries(
          Object.entries(filteredDetails).filter(
            ([key]) => !key.includes('servizi')
          )
        );
        state.programs.detail = {
          ...state.programs.detail,
          dettagliInfoProgramma: {
            ...filteredDetails,
            ...action.payload.newFormValues,
          },
        };
      } else if (action.payload.currentStep === 4) {
        filteredDetails = Object.fromEntries(
          Object.entries(filteredDetails).filter(
            ([key]) => !key.includes('facilitatori')
          )
        );
        state.programs.detail = {
          ...state.programs.detail,
          dettagliInfoProgramma: {
            ...filteredDetails,
            ...action.payload.newFormValues,
          },
        };
      }
    },
    resetProgramDetails: (state) => {
      state.programs.detail = {};
    },
    setProjectDetails: (state, action) => {
      state.projects.detail = { ...action.payload };
    },
    setProjectGeneralInfo: (state, action: PayloadAction<any>) => {
      let filteredDetails = { ...state.projects.detail.dettagliInfoProgetto };
      if (action.payload.currentStep === 0) {
        state.projects.detail = {
          ...state.projects.detail,
          dettagliInfoProgetto: {
            ...filteredDetails,
            ...action.payload.newFormValues,
          },
        };
      } else if (action.payload.currentStep === 1) {
        filteredDetails = Object.fromEntries(
          Object.entries(filteredDetails).filter(
            ([key]) => !key.includes('puntiFacilitazione')
          )
        );
        state.projects.detail = {
          ...state.projects.detail,
          dettagliInfoProgetto: {
            ...filteredDetails,
            ...action.payload.newFormValues,
          },
        };
      } else if (action.payload.currentStep === 2) {
        filteredDetails = Object.fromEntries(
          Object.entries(filteredDetails).filter(
            ([key]) => !key.includes('utentiUnici')
          )
        );
        state.projects.detail = {
          ...state.projects.detail,
          dettagliInfoProgetto: {
            ...filteredDetails,
            ...action.payload.newFormValues,
          },
        };
      } else if (action.payload.currentStep === 3) {
        filteredDetails = Object.fromEntries(
          Object.entries(filteredDetails).filter(
            ([key]) => !key.includes('servizi')
          )
        );
        state.projects.detail = {
          ...state.projects.detail,
          dettagliInfoProgetto: {
            ...filteredDetails,
            ...action.payload.newFormValues,
          },
        };
      } else if (action.payload.currentStep === 4) {
        filteredDetails = Object.fromEntries(
          Object.entries(filteredDetails).filter(
            ([key]) => !key.includes('facilitatori')
          )
        );
        state.projects.detail = {
          ...state.projects.detail,
          dettagliInfoProgetto: {
            ...filteredDetails,
            ...action.payload.newFormValues,
          },
        };
      }
    },
    resetProjectDetails: (state) => {
      state.projects.detail = {};
    },
    setSurveyDetail: (state, action) => {
      state.surveys.detail = { ...action.payload.data };
    },
    setHeadquartersList: (state, action) => {
      state.headquarters.list = action.payload ? [...action.payload] : null;
    },
    setHeadquarterDetails: (state, action) => {
      state.headquarters.detail = action.payload ? { ...action.payload } : null;
    },
    resetHeadquarterDetails: (state) => {
      state.headquarters.detail = {};
    },
    setUserDetails: (state, action) => {
      state.users.detail = { ...action.payload };
    },
    resetUserDetails: (state) => {
      state.users.detail = {};
    },
    setServicesList: (state, action: PayloadAction<any>) => {
      state.services.list = action.payload.data;
    },
    setServicesDetail: (state, action: PayloadAction<any>) => {
      state.services.detail.dettaglioServizio =
        action.payload.dettaglioServizio;
      state.services.detail.sezioneQ3compilato =
        action.payload.dettaglioServizio?.sezioneQ3compilato;
      state.services.detail.questionarioTemplateSnapshot =
        action.payload.dettaglioServizio?.questionarioTemplateSnapshot;
      state.services.detail.progettiAssociatiAlServizio =
        action.payload.progettiAssociatiAlServizio;
    },
    setServicesDropdownCreation: (state, action: PayloadAction<any>) => {
      state.services.dropdownsCreation = {
        ...state.services.dropdownsCreation,
        ...action.payload,
      };
    },
    setServicesSchemaFieldsCreation: (state, action: PayloadAction<any>) => {
      state.services.dynamicSchemaFieldsCreation =
        action.payload?.sezioniQuestionarioTemplate;
    },
    setServicesDetailCitizenList: (state, action: PayloadAction<any>) => {
      state.services.detail.cittadini = action.payload;
    },
    deleteFiltroCriterioRicerca: (state) => {
      const newFilters = { ...state.filters };
      if(newFilters?.filtroCriterioRicerca) delete newFilters?.filtroCriterioRicerca;
      if(newFilters?.criterioRicerca) delete newFilters?.criterioRicerca;
      state.filters = { ...newFilters };
    },
    setServiceQuestionarioTemplateIstanze: (
      state,
      action: PayloadAction<any>
    ) => {
      state.services.detail.sezioniQuestionarioTemplateIstanze = action.payload;
    },
  },
});

export const {
  resetEntityState,
  resetFiltersState,
  resetPaginationState,
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
  setAuthorityGeneralInfo,
  resetAuthorityDetails,
  setAuthorityDetails,
  setProgramDetails,
  setProjectDetails,
  setSurveyDetail,
  setHeadquartersList,
  setHeadquarterDetails,
  resetHeadquarterDetails,
  setUserDetails,
  resetUserDetails,
  setServicesList,
  setServicesDetail,
  setServicesDetailCitizenList,
  setProgramGeneralInfo,
  resetProgramDetails,
  setProjectGeneralInfo,
  resetProjectDetails,
  deleteFiltroCriterioRicerca,
  setServicesDropdownCreation,
  setServicesSchemaFieldsCreation,
  setServiceQuestionarioTemplateIstanze,
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
export const selectEnteGestoreProgramma = (state: RootState) =>
  state.administrativeArea.programs?.detail?.idEnteGestoreProgramma;
export const selectProjects = (state: RootState) =>
  state.administrativeArea.projects;
export const selectEnteGestoreProgetto = (state: RootState) =>
  state.administrativeArea.projects?.detail?.idEnteGestoreProgetto;
export const selectSurveys = (state: RootState) =>
  state.administrativeArea.surveys;
export const selectUsers = (state: RootState) => state.administrativeArea.users;
export const selectAuthorities = (state: RootState) =>
  state.administrativeArea.authorities;
export const selectHeadquarters = (state: RootState) =>
  state.administrativeArea.headquarters;
export const selectServices = (state: RootState) =>
  state.administrativeArea.services;
export const selectSezioneQ3compilato = (state: RootState) =>
  state.administrativeArea.services.detail.sezioneQ3compilato;
export const selectQuestionarioTemplateSnapshot = (state: RootState) =>
  state.administrativeArea.services.detail.questionarioTemplateSnapshot;
export const selectQuestionarioTemplateServiceCreation = (state: RootState) =>
  state.administrativeArea.services.dynamicSchemaFieldsCreation;
export const selectServiceQuestionarioTemplateIstanze = (state: RootState) =>
  state.administrativeArea.services.detail.sezioniQuestionarioTemplateIstanze;

export default administrativeAreaSlice.reducer;

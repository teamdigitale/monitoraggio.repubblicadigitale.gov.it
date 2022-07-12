/**
 * This file is unused, it is not deleted cause it has some functions and
 * interfaces that maybe can be reused in future
 */

import React from 'react';
import { BreadcrumbI } from '../components/Breadcrumb/breadCrumb';
import {
  AdministrativeArea,
  Documents,
  HomeFacilitator,
  Playground,
  Survey,
  Auth,
} from '../pages';
import CitizensArea from '../pages/administrator/CitizensArea/citizensArea';
import RoleManagement from '../pages/common/RoleManagement/roleManagement';
import RoleManagementDetails from '../pages/common/RoleManagement/RoleManagementDetails/roleManagementDetails';
import Onboarding from '../pages/facilitator/Onboarding/onboarding';
import { RolePermissionI } from '../redux/features/roles/rolesSlice';
import PrintSurvey from '../pages/administrator/AdministrativeArea/Entities/Surveys/printSurvey/printSurvey';
import Programs from '../pages/administrator/AdministrativeArea/Entities/Programs/programs';
import Authorities from '../pages/administrator/AdministrativeArea/Entities/Authorities/authorities';
import ProgramsDetails from '../pages/administrator/AdministrativeArea/Entities/Programs/programsDetails';
import ProjectsDetails from '../pages/administrator/AdministrativeArea/Entities/Projects/projectsDetails';
import UsersDetails from '../pages/administrator/AdministrativeArea/Entities/Users/usersDetails';
import AuthoritiesDetails from '../pages/administrator/AdministrativeArea/Entities/Authorities/authoritiesDetails';
import Projects from '../pages/administrator/AdministrativeArea/Entities/Projects/projects';
import HeadquartersDetails from '../pages/administrator/AdministrativeArea/Entities/Headquarters/HeadquartersDetail/headquartersDetails';
import Users from '../pages/administrator/AdministrativeArea/Entities/Users/users';
import CompileSurvey from '../pages/administrator/AdministrativeArea/Entities/Surveys/compileSurvey/compileSurvey';
import SurveyDetailsEdit from '../pages/administrator/AdministrativeArea/Entities/Surveys/surveyDetailsEdit/surveyDetailsEdit';
import Surveys from '../pages/administrator/AdministrativeArea/Entities/Surveys/surveys';
import Services from '../pages/administrator/AdministrativeArea/Entities/Services/services';
import ServicesDetails from '../pages/administrator/AdministrativeArea/Entities/Services/servicesDetails';
import Citizens from '../pages/administrator/CitizensArea/Entities/Citizens/citizens';
import CitizensDetail from '../pages/administrator/CitizensArea/Entities/Citizens/citizensDetail';

export enum layoutEnum {
  fullLayout = 'FULL_LAYOUT',
  mainLayout = 'MAIN_LAYOUT',
  none = 'NONE',
}

export interface AppRoutesI {
  scope: string;
  path: string;
  title?: string;
  element: JSX.Element;
  visibleTo?: RolePermissionI[] | undefined;
  outlet?: string | undefined;
  layout?: layoutEnum;
  isHeaderFull?: boolean | undefined;
  authenticated?: boolean | undefined;
  route_paths?: BreadcrumbI[] | undefined;
}

export const getRoutes = (isLogged: boolean, scope: string) => {
  return routes.filter(
    (r) => r.authenticated === isLogged && r.scope === scope
  );
};

const newRoute: (NewRoute: AppRoutesI) => AppRoutesI = ({
  scope = 'app',
  path,
  title = 'MITD',
  visibleTo,
  element,
  layout = layoutEnum.mainLayout,
  isHeaderFull = true,
  authenticated = true,
  outlet,
}) => ({
  scope,
  path,
  title,
  visibleTo,
  element,
  layout,
  isHeaderFull,
  authenticated,
  outlet,
});

const routes = [
  // App Routes
  newRoute({
    scope: 'app',
    path: '/',
    title: 'Home',
    visibleTo: ['permission-1'],
    element: <HomeFacilitator />,
    layout: layoutEnum.fullLayout,
    isHeaderFull: true,
  }),
  newRoute({
    scope: 'app',
    path: '/area-amministrativa',
    title: `Area amministrativa`,
    visibleTo: ['permission-1'],
    element: <AdministrativeArea />,
    outlet: 'administrative-area',
    layout: layoutEnum.fullLayout,
    isHeaderFull: true,
  }),
  // newRoute({
  //   scope: 'app',
  //   path: '/area-amministrativa/programmi',
  //   title: 'Dettaglio area amministrativa',
  //   element: <ProgramsDetails />,
  //   visibleTo: ['permission-1'],
  //   layout: layoutEnum.fullLayout,
  //   isHeaderFull: false,
  // }),
  newRoute({
    scope: 'app',
    path: '/area-cittadini',
    title: 'Area cittadini',
    element: <CitizensArea />,
    outlet: 'citizens-area',
    visibleTo: ['permission-1'],
    layout: layoutEnum.fullLayout,
    isHeaderFull: true,
  }),
  newRoute({
    scope: 'app',
    path: '/survey',
    title: 'Survey',
    element: <Survey />,
    visibleTo: ['permission-1'],
    layout: layoutEnum.fullLayout,
    isHeaderFull: false,
  }),
  newRoute({
    scope: 'app',
    path: '/documents',
    title: 'Documenti',
    element: <Documents />,
    visibleTo: ['permission-1'],
    layout: layoutEnum.fullLayout,
    isHeaderFull: true,
  }),
  newRoute({
    scope: 'app',
    path: '/gestione-ruoli',
    title: 'gestione-ruoli',
    element: <RoleManagement />,
    visibleTo: ['permission-1'],
    layout: layoutEnum.fullLayout,
    isHeaderFull: true,
  }),
  newRoute({
    scope: 'app',
    path: '/gestione-ruoli/:idRuoloUtente',
    title: 'Dettaglio gestione ruoli',
    element: <RoleManagementDetails />,
    visibleTo: ['permission-1'],
    layout: layoutEnum.fullLayout,
    isHeaderFull: false,
  }),
  newRoute({
    scope: 'app',
    path: '/onboarding',
    title: `Onboarding`,
    element: <Onboarding />,
    visibleTo: ['permission-1'],
    layout: layoutEnum.mainLayout,
    isHeaderFull: false,
  }),
  newRoute({
    scope: 'app',
    path: '/stampa-questionario',
    title: `Stampa Questionario`,
    element: <PrintSurvey />,
    visibleTo: [],
    layout: layoutEnum.none,
  }),
  newRoute({
    scope: 'app',
    path: '*',
    title: 'Playground',
    element: <Playground />,
    visibleTo: [],
    layout: layoutEnum.mainLayout,
    isHeaderFull: false,
  }),
  newRoute({
    scope: 'app',
    path: '/auth',
    title: 'Auth',
    element: <Auth />,
    layout: layoutEnum.none,
    authenticated: false,
  }),
  newRoute({
    scope: 'app',
    path: '*',
    title: 'Auth',
    element: <Auth />,
    layout: layoutEnum.none,
    authenticated: false,
  }),

  /**
   * ADMINISTRATIVE AREA OUTLET
   */

  // PROGRAMS ROUTES
  newRoute({
    scope: 'administrative-area',
    path: 'programmi',
    title: 'Programmi',
    element: <Programs />,
    visibleTo: [],
    layout: layoutEnum.none,
    isHeaderFull: false,
  }),
  // maybe useless
  newRoute({
    scope: 'administrative-area',
    path: 'programmi/:entityId',
    title: 'Programmi Dettaglio',
    element: <ProgramsDetails />,
    visibleTo: [],
    layout: layoutEnum.none,
    isHeaderFull: false,
  }),
  newRoute({
    scope: 'administrative-area',
    path: 'programmi/:entityId/info',
    title: 'Programmi Dettaglio',
    element: <ProgramsDetails />,
    visibleTo: [],
    layout: layoutEnum.none,
    isHeaderFull: false,
  }),
  newRoute({
    scope: 'administrative-area',
    path: 'programmi/:entityId/ente',
    title: 'Programmi Dettaglio',
    element: <ProgramsDetails />,
    visibleTo: [],
    layout: layoutEnum.none,
    isHeaderFull: false,
  }),
  newRoute({
    scope: 'administrative-area',
    path: 'programmi/:entityId/questionari',
    title: 'Programmi Dettaglio',
    element: <ProgramsDetails />,
    visibleTo: [],
    layout: layoutEnum.none,
    isHeaderFull: false,
  }),
  newRoute({
    scope: 'administrative-area',
    path: 'programmi/:entityId/progetti',
    title: 'Programmi Dettaglio',
    element: <ProgramsDetails />,
    visibleTo: [],
    layout: layoutEnum.none,
    isHeaderFull: false,
  }),
  newRoute({
    scope: 'administrative-area',
    path: 'programmi/:entityId/progetti/:projectId',
    title: 'Programmi Dettaglio',
    element: <ProjectsDetails />,
    visibleTo: [],
    layout: layoutEnum.none,
    isHeaderFull: false,
  }),
  newRoute({
    scope: 'administrative-area',
    path: 'programmi/:entityId/progetti/:projectId/info',
    title: 'Programmi Dettaglio',
    element: <ProjectsDetails />,
    visibleTo: [],
    layout: layoutEnum.none,
    isHeaderFull: false,
  }),
  newRoute({
    scope: 'administrative-area',
    path: 'programmi/:entityId/progetti/:projectId/ente-gestore',
    title: 'Programmi Dettaglio',
    element: <ProjectsDetails />,
    visibleTo: [],
    layout: layoutEnum.none,
    isHeaderFull: false,
  }),
  newRoute({
    scope: 'administrative-area',
    path: 'programmi/:entityId/progetti/:projectId/enti-partner',
    title: 'Programmi Dettaglio',
    element: <ProjectsDetails />,
    visibleTo: [],
    layout: layoutEnum.none,
    isHeaderFull: false,
  }),
  newRoute({
    scope: 'administrative-area',
    path: 'programmi/:entityId/progetti/:projectId/sedi',
    title: 'Programmi Dettaglio',
    element: <ProjectsDetails />,
    visibleTo: [],
    layout: layoutEnum.none,
    isHeaderFull: false,
  }),
  newRoute({
    scope: 'administrative-area',
    path: 'programmi/:entityId/:userType/:userId',
    title: 'Programmi Dettaglio',
    element: <UsersDetails />,
    visibleTo: [],
    layout: layoutEnum.none,
    isHeaderFull: false,
  }),
  newRoute({
    scope: 'administrative-area',
    path: 'programmi/:entityId/progetti/:projectId/:userType/:userId',
    title: 'Programmi Dettaglio',
    element: <UsersDetails />,
    visibleTo: [],
    layout: layoutEnum.none,
    isHeaderFull: false,
  }),
  newRoute({
    scope: 'administrative-area',
    path: 'programmi/:entityId/progetti/:projectId/enti/:enteId',
    title: 'Programmi Dettaglio',
    element: <AuthoritiesDetails />,
    visibleTo: [],
    layout: layoutEnum.none,
    isHeaderFull: false,
  }),
  // PROJECTS ROUTES
  newRoute({
    scope: 'administrative-area',
    path: 'progetti',
    title: 'Progetti',
    element: <Projects />,
    visibleTo: [],
    layout: layoutEnum.none,
    isHeaderFull: false,
  }),
  newRoute({
    scope: 'administrative-area',
    path: 'progetti/:entityId',
    title: 'Progetti',
    element: <ProjectsDetails />,
    visibleTo: [],
    layout: layoutEnum.none,
    isHeaderFull: false,
  }),
  newRoute({
    scope: 'administrative-area',
    path: 'progetti/:entityId/info',
    title: 'Progetti',
    element: <ProjectsDetails />,
    visibleTo: [],
    layout: layoutEnum.none,
    isHeaderFull: false,
  }),
  newRoute({
    scope: 'administrative-area',
    path: 'progetti/:entityId/ente-gestore-progetto',
    title: 'Progetti',
    element: <ProjectsDetails />,
    visibleTo: [],
    layout: layoutEnum.none,
    isHeaderFull: false,
  }),
  newRoute({
    scope: 'administrative-area',
    path: 'progetti/:entityId/enti-partner-progetto',
    title: 'Progetti',
    element: <ProjectsDetails />,
    visibleTo: [],
    layout: layoutEnum.none,
    isHeaderFull: false,
  }),
  newRoute({
    scope: 'administrative-area',
    path: 'progetti/:entityId/sedi',
    title: 'Progetti',
    element: <ProjectsDetails />,
    visibleTo: [],
    layout: layoutEnum.none,
    isHeaderFull: false,
  }),
  newRoute({
    scope: 'administrative-area',
    path: 'progetti/:entityId/enti/:enteId',
    title: 'Progetti',
    element: <AuthoritiesDetails />,
    visibleTo: [],
    layout: layoutEnum.none,
    isHeaderFull: false,
  }),
  newRoute({
    scope: 'administrative-area',
    path: 'progetti/:entityId/sedi/:sedeId',
    title: 'Progetti',
    element: <HeadquartersDetails />,
    visibleTo: [],
    layout: layoutEnum.none,
    isHeaderFull: false,
  }),
  newRoute({
    scope: 'administrative-area',
    path: 'progetti/:entityId/:userType/:userId',
    title: 'Progetti',
    element: <UsersDetails />,
    visibleTo: [],
    layout: layoutEnum.none,
    isHeaderFull: false,
  }),
  // ENTI ROUTES
  newRoute({
    scope: 'administrative-area',
    path: 'enti',
    title: 'Enti',
    element: <Authorities />,
    visibleTo: [],
    layout: layoutEnum.none,
    isHeaderFull: false,
  }),
  newRoute({
    scope: 'administrative-area',
    path: 'enti/:idEnte',
    title: 'Enti',
    element: <AuthoritiesDetails />,
    visibleTo: [],
    layout: layoutEnum.none,
    isHeaderFull: false,
  }),
  // ENTI ROUTES
  newRoute({
    scope: 'administrative-area',
    path: 'utenti',
    title: 'Utenti',
    element: <Users />,
    visibleTo: [],
    layout: layoutEnum.none,
    isHeaderFull: false,
  }),
  newRoute({
    scope: 'administrative-area',
    path: ':userType/:entityId',
    title: 'Utenti',
    element: <UsersDetails />,
    visibleTo: [],
    layout: layoutEnum.none,
    isHeaderFull: false,
  }),
  // HEADQUARTERS ROUTES
  newRoute({
    scope: 'administrative-area',
    path: 'sedi/:entityId',
    title: 'Sedi',
    element: <HeadquartersDetails />,
    visibleTo: [],
    layout: layoutEnum.none,
    isHeaderFull: false,
  }),
  // SURVEYS ROUTES
  newRoute({
    scope: 'administrative-area',
    path: 'questionari',
    title: 'Questionari',
    element: <Surveys />,
    visibleTo: [],
    layout: layoutEnum.none,
    isHeaderFull: false,
  }),
  newRoute({
    scope: 'administrative-area',
    path: 'questionari/compila',
    title: 'Questionari',
    element: <CompileSurvey />,
    visibleTo: [],
    layout: layoutEnum.none,
    isHeaderFull: false,
  }),
  newRoute({
    scope: 'administrative-area',
    path: 'questionari/:idQuestionario',
    title: 'Questionari',
    element: <SurveyDetailsEdit />,
    visibleTo: [],
    layout: layoutEnum.none,
    isHeaderFull: false,
  }),
  newRoute({
    scope: 'administrative-area',
    path: 'questionari/:idQuestionario/modifica',
    title: 'Questionari',
    element: <SurveyDetailsEdit editMode />,
    visibleTo: [],
    layout: layoutEnum.none,
    isHeaderFull: false,
  }),
  newRoute({
    scope: 'administrative-area',
    path: 'questionari/:idQuestionario/modifica',
    title: 'Questionari',
    element: <SurveyDetailsEdit editMode />,
    visibleTo: [],
    layout: layoutEnum.none,
    isHeaderFull: false,
  }),
  newRoute({
    scope: 'administrative-area',
    path: 'questionari/:idQuestionario/clona',
    title: 'Questionari',
    element: <SurveyDetailsEdit cloneMode />,
    visibleTo: [],
    layout: layoutEnum.none,
    isHeaderFull: false,
  }),
  newRoute({
    scope: 'administrative-area',
    path: 'questionari/:idQuestionario/info',
    title: 'Questionari',
    element: <SurveyDetailsEdit />,
    visibleTo: [],
    layout: layoutEnum.none,
    isHeaderFull: false,
  }),
  // SERVICES ROUTES
  newRoute({
    scope: 'administrative-area',
    path: 'servizi',
    title: 'Servizi',
    element: <Services />,
    visibleTo: [],
    layout: layoutEnum.none,
    isHeaderFull: false,
  }),
  newRoute({
    scope: 'administrative-area',
    path: 'servizi/:serviceId/info',
    title: 'Servizi',
    element: <ServicesDetails />,
    visibleTo: [],
    layout: layoutEnum.none,
    isHeaderFull: false,
  }),
  newRoute({
    scope: 'administrative-area',
    path: 'servizi/:serviceId/cittadini',
    title: 'Servizi',
    element: <ServicesDetails />,
    visibleTo: [],
    layout: layoutEnum.none,
    isHeaderFull: false,
  }),

  /**
   * CITIZENS AREA OUTLET
   */
  newRoute({
    scope: 'citizens-area',
    path: '/area-cittadini',
    title: 'Cittadini',
    element: <Citizens />,
    visibleTo: [],
    layout: layoutEnum.none,
    isHeaderFull: false,
  }),
  newRoute({
    scope: 'citizens-area',
    path: '/area-cittadini/:idCittadino',
    title: 'Cittadini',
    element: <CitizensDetail />,
    visibleTo: [],
    layout: layoutEnum.none,
    isHeaderFull: false,
  }),
];

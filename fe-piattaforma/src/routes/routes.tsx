import React from 'react';
import {
  AdministrativeArea,
  Documents,
  HomeFacilitator,
  Playground,
  Survey,
} from '../pages';
import { AreaAmministrativaRoutes } from '../pages/administrator/AdministrativeArea/administrativeArea';
import ProgramsDetails from '../pages/administrator/AdministrativeArea/Entities/Programs/programsDetails';
import CitizensArea, {
  AreaCittadiniRoutes,
} from '../pages/administrator/CitizensArea/Entities/citizensArea';
import RoleManagement from '../pages/common/RoleManagement/roleManagement';
import RoleManagementDetails from '../pages/common/RoleManagement/RoleManagementDetails/roleManagementDetails';
import Onboarding from '../pages/facilitator/Onboarding/onboarding';
import { AppRoutesI, layoutEnum } from '.';

const newRoute: (NewRoute: AppRoutesI) => AppRoutesI = ({
  path,
  title = 'MITD',
  visibleTo = [],
  element,
  layout = layoutEnum.mainLayout,
  isHeaderFull = true,
  authenticated = true,
  subRoutes,
}) => ({
  path,
  title,
  visibleTo,
  element,
  layout,
  isHeaderFull,
  authenticated,
  subRoutes,
});

const routes = [
  newRoute({
    path: '/',
    title: 'Home',
    visibleTo: ['Referente Ente gestore di progetto'],
    element: <HomeFacilitator />,
    layout: layoutEnum.fullLayout,
    isHeaderFull: true,
  }),
  newRoute({
    path: '/area-amministrativa',
    title: `Area amministrativa`,
    visibleTo: ['Referente Ente gestore di progetto'],
    element: <AdministrativeArea />,
    subRoutes: AreaAmministrativaRoutes,
    layout: layoutEnum.fullLayout,
    isHeaderFull: true,
  }),
  newRoute({
    path: '/area-amministrativa/programmi',
    title: 'Dettaglio area amministrativa',
    element: <ProgramsDetails />,
    visibleTo: ['Referente Ente gestore di progetto'],
    layout: layoutEnum.fullLayout,
    isHeaderFull: false,
  }),
  newRoute({
    path: '/area-cittadini',
    title: 'Area cittadini',
    element: <CitizensArea />,
    subRoutes: AreaCittadiniRoutes,
    visibleTo: ['Referente Ente gestore di progetto'],
    layout: layoutEnum.fullLayout,
    isHeaderFull: true,
  }),
  newRoute({
    path: '/survey',
    title: 'Survey',
    element: <Survey />,
    visibleTo: ['Referente Ente gestore di progetto'],
    layout: layoutEnum.fullLayout,
    isHeaderFull: false,
  }),
  newRoute({
    path: '/documents',
    title: 'Documenti',
    element: <Documents />,
    visibleTo: ['Referente Ente gestore di progetto'],
    layout: layoutEnum.fullLayout,
    isHeaderFull: true,
  }),
  newRoute({
    path: '/gestione-ruoli',
    title: 'gestione-ruoli',
    element: <RoleManagement />,
    visibleTo: ['Referente Ente gestore di progetto'],
    layout: layoutEnum.fullLayout,
    isHeaderFull: true,
  }),
  newRoute({
    path: '/gestione-ruoli/:idRuoloUtente',
    title: 'Dettaglio gestione ruoli',
    element: <RoleManagementDetails />,
    visibleTo: ['Referente Ente gestore di progetto'],
    layout: layoutEnum.fullLayout,
    isHeaderFull: false,
  }),
  newRoute({
    path: '/onboarding',
    title: `Onboarding`,
    element: <Onboarding />,
    visibleTo: ['Referente Ente gestore di progetto'],
    layout: layoutEnum.mainLayout,
    isHeaderFull: false,
  }),
  newRoute({
    path: '*',
    title: 'Playground',
    element: <Playground />,
    visibleTo: ['Referente Ente gestore di progetto'],
    layout: layoutEnum.mainLayout,
    isHeaderFull: false,
  }),
];

export default routes;

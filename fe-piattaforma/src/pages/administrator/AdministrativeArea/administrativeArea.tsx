import React, { lazy, useEffect } from 'react';
import { Container } from 'design-react-kit';
import {
  Route,
  Routes,
  useLocation,
  useNavigate,
  useParams,
} from 'react-router-dom';
import PageTitle from '../../../components/PageTitle/pageTitle';
//import { TabGroup } from '../../../components';
/*import ManageProgram from './Entities/Programs/manageProgram/manageProgram';
import ManageProgramManagerAuthority from './Entities/Programs/manageEnteGestoreProgramma/manageEnteGestoreProgramma';
import ManageEntiPartner from './Entities/Programs/manageEntiPartner/manageEntiPartner';
import ManageHeadquarter from './Entities/Programs/manageSedi/manageSedi';
import ManageProjectManagerAuthority from './Entities/Programs/manageEnteGestoreProgetto/manageEnteGestoreProgetto';*/
import ManageUsers from './Entities/modals/manageUsers';
import { useAppSelector } from '../../../redux/hooks';
import { selectDevice } from '../../../redux/features/app/appSlice';
import { LocationIndex } from '../../../components';
import { menuRoutes } from '../../../utils/common';
const Programs = lazy(() => import('./Entities/Programs/programs'));
const Projects = lazy(() => import('./Entities/Projects/projects'));
const Utenti = lazy(() => import('./Entities/Users/users'));
const Surveys = lazy(() => import('./Entities/Surveys/surveys'));
const Authorities = lazy(() => import('./Entities/Authorities/authorities'));
const CompileSurvey = lazy(
  () => import('./Entities/Surveys/compileSurvey/compileSurvey')
);
const ProgramsDetails = lazy(
  () => import('./Entities/Programs/programsDetails')
);
const ProjectsDetails = lazy(
  () => import('./Entities/Projects/projectsDetails')
);
const AuthoritiesDetails = lazy(
  () => import('./Entities/Authorities/authoritiesDetails')
);
const UsersDetails = lazy(() => import('./Entities/Users/usersDetails'));
const HeadquartersDetails = lazy(
  () => import('./Entities/Headquarters/HeadquartersDetail/headquartersDetails')
);
const Services = lazy(() => import('./Entities/Services/services'));
const ServicesDetails = lazy(
  () => import('./Entities/Services/servicesDetails')
);
const SurveyDetailsEdit = lazy(
  () => import('./Entities/Surveys/surveyDetailsEdit/surveyDetailsEdit')
);
import ProtectedComponent from '../../../hoc/AuthGuard/ProtectedComponent/ProtectedComponent';

interface PageTitleMockI {
  [key: string]: {
    title: string;
    textCta?: string;
    iconCta?: string;
  };
}

export const PageTitleMock: PageTitleMockI = {
  '/area-amministrativa/programmi': {
    title: 'Elenco Programmi',
    textCta: 'Crea nuovo programma',
    iconCta: 'it-plus',
  },
  '/area-amministrativa/progetti': {
    title: 'Elenco Progetti',
    textCta: 'Crea nuovo progetto',
    iconCta: 'it-plus',
  },
  '/area-amministrativa/utenti': {
    title: 'Elenco Utenti',
    textCta: 'Crea nuovo utente',
    iconCta: 'it-plus',
  },
  '/area-amministrativa/enti': {
    title: 'Elenco Enti',
    textCta: 'Crea nuovo ente',
    iconCta: 'it-plus',
  },
  '/area-amministrativa/questionari': {
    title: 'Elenco Questionari',
    textCta: 'Crea nuovo questionario',
    iconCta: 'it-plus',
  },
  '/area-amministrativa/servizi': {
    title: 'Elenco Servizi',
    textCta: 'Crea servizio',
    iconCta: 'it-plus',
  },
};

const tabs = [
  {
    label: 'Programmi',
    path: '/area-amministrativa/programmi',
    id: 'tab-admin-programmi',
  },
  {
    label: 'Progetti',
    path: '/area-amministrativa/progetti',
    id: 'tab-admin-projects',
  },
  {
    label: 'Enti',
    path: '/area-amministrativa/enti',
    id: 'tab-admin-authorities',
  },
  {
    label: 'Utenti',
    path: '/area-amministrativa/utenti',
    id: 'tab-admin-utenti',
  },
  {
    label: 'Surveys',
    path: '/area-amministrativa/questionari',
    id: 'tab-admin-questionari',
  },
];

const AdministrativeArea = () => {
  //const [activeTab, setActiveTab] = useState(tabs.at(0));
  const location = useLocation();
  const navigate = useNavigate();
  const { entityId } = useParams();

  const updateActiveTab = () => {
    if (location.pathname.split('/').length <= 2 && tabs.at(0)?.path) {
      navigate(tabs.at(0)?.path ?? '', {
        replace: false,
      });
    }
    /* setActiveTab(
      tabs.at(tabs.findIndex((tab) => tab.path === location.pathname) || 0)
    ); */
  };

  useEffect(() => {
    updateActiveTab();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

  const device = useAppSelector(selectDevice);

  const noDetailRoute = menuRoutes
    .find((x) => x.id === 'tab-admin')
    ?.subRoutes?.some((y) => y.path === location.pathname);

  return (
    <>
      {/*
      <div className='mb-5 mt-3'>
         <TabGroup arrayTabs={tabs} activeTab={activeTab?.id} /> 
      </div>
      */}
      {device.mediaIsPhone && noDetailRoute && (
        <div className='mt-2 px-3'>
          <LocationIndex
            title='Area amministrativa'
            routes={
              menuRoutes.find((x) => x.id === 'tab-admin')?.subRoutes || []
            }
          />
        </div>
      )}

      {location?.pathname &&
      location?.pathname !== '/area-amministrativa/questionari' &&
      !entityId ? (
        <PageTitle {...PageTitleMock[location?.pathname]} />
      ) : null}

      <Container>
        <Routes>{AreaAmministrativaRoutes}</Routes>
      </Container>
      <ManageUsers />
    </>
  );
};

export default AdministrativeArea;

const AreaAmministrativaRoutes = [
  <Route key='programmi' path='programmi' element={<Programs />} />,
  <Route
    key='programmi-dettaglio'
    path='programmi/:entityId'
    element={<ProgramsDetails />}
  />,
  <Route
    key='programmi-dettaglio-info'
    path='programmi/:entityId/info'
    element={
      <ProtectedComponent visibleTo={['permission-1']}>
        <ProgramsDetails />
      </ProtectedComponent>
    }
  />,
  <Route
    key='programmi-dettaglio-ente'
    path='programmi/:entityId/ente'
    element={<ProgramsDetails />}
  />,
  <Route
    key='programmi-dettaglio-questionari'
    path='programmi/:entityId/questionari'
    element={<ProgramsDetails />}
  />,
  <Route
    key='programmi-dettaglio-progetti'
    path='programmi/:entityId/progetti'
    element={<ProgramsDetails />}
  />,
  <Route
    key='programmi-dettaglio-progetti-dettaglio'
    path='programmi/:entityId/progetti/:projectId'
    element={<ProjectsDetails />}
  />,
  <Route
    key='programmi-dettaglio-progetti-dettaglio-info'
    path='programmi/:entityId/progetti/:projectId/info'
    element={<ProjectsDetails />}
  />,
  <Route
    key='programmi-dettaglio-progetti-dettaglio-ente-gestore'
    path='programmi/:entityId/progetti/:projectId/ente-gestore-progetto'
    element={<ProjectsDetails />}
  />,
  <Route
    key='programmi-dettaglio-progetti-dettaglio-enti-partner'
    path='programmi/:entityId/progetti/:projectId/enti-partner-progetto'
    element={<ProjectsDetails />}
  />,
  <Route
    key='programmi-dettaglio-progetti-dettaglio-sedi'
    path='programmi/:entityId/progetti/:projectId/sedi'
    element={<ProjectsDetails />}
  />,
  <Route
    key='programmi-dettaglio-utenti-dettaglio'
    path='programmi/:entityId/:userType/:userId'
    element={<UsersDetails />}
  />,
  <Route
    key='programmi-dettaglio-progetti-dettaglio-utenti-dettaglio'
    path='programmi/:entityId/progetti/:projectId/:userType/:userId'
    element={<UsersDetails />}
  />,
  <Route
    key='programmi-dettaglio-progetti-dettaglio-enti-dettaglio'
    path='programmi/:entityId/progetti/:projectId/enti/:enteId'
    element={<AuthoritiesDetails />}
  />,

  <Route key='progetti' path='progetti' element={<Projects />} />,
  <Route
    key='progetti-dettaglio'
    path='progetti/:entityId'
    element={<ProjectsDetails />}
  />,
  <Route
    key='progetti-dettaglio-info'
    path='progetti/:projectId/info'
    element={<ProjectsDetails />}
  />,
  <Route
    key='progetti-dettaglio-ente-gestore'
    path='progetti/:projectId/ente-gestore-progetto'
    element={<ProjectsDetails />}
  />,
  <Route
    key='progetti-dettaglio-enti-partner'
    path='progetti/:projectId/enti-partner-progetto'
    element={<ProjectsDetails />}
  />,
  <Route
    key='progetti-dettaglio-sedi'
    path='progetti/:projectId/sedi'
    element={<ProjectsDetails />}
  />,
  <Route
    key='progetti-dettaglio-enti-dettaglio'
    path='progetti/:entityId/enti/:enteId'
    element={<AuthoritiesDetails />}
  />,
  <Route
    key='progetti-dettaglio-sedi-dettaglio'
    path='progetti/:entityId/sedi/:sedeId'
    element={<HeadquartersDetails />}
  />,
  <Route
    key='progetti-dettaglio-utenti-dettaglio'
    path='progetti/:entityId/:userType/:userId'
    element={<UsersDetails />}
  />,
  <Route key='enti' path='enti' element={<Authorities />} />,
  <Route
    key='enti-dettaglio'
    path='enti/:idEnte'
    element={<AuthoritiesDetails />}
  />,
  <Route key='utenti' path='utenti' element={<Utenti />} />,
  <Route
    key='utenti-detail'
    path=':userType/:entityId'
    element={<UsersDetails />}
  />,
  <Route
    key='sedi-dettaglio'
    path='sedi/:entityId'
    element={<HeadquartersDetails />}
  />,
  <Route
    key='questionari-compila'
    path='questionari/compila'
    element={<CompileSurvey />}
  />,
  <Route
    key='questionari-modifica'
    path='questionari/:idQuestionario/modifica'
    element={<SurveyDetailsEdit editMode />}
  />,
  <Route key='questionari' path='questionari' element={<Surveys />} />,
  <Route
    key='questionari-clona'
    path='questionari/:idQuestionario/clona'
    element={<SurveyDetailsEdit cloneMode />}
  />,
  <Route
    key='questionari-dettaglio-info'
    path='questionari/:idQuestionario/info'
    element={<SurveyDetailsEdit />}
  />,
  <Route
    key='questionari-dettaglio'
    path='questionari/:idQuestionario'
    element={<SurveyDetailsEdit />}
  />,
  <Route
    key='area-amministrativa-servizi'
    element={<Services />}
    path='servizi'
  />,
  <Route
    key='area-amministrativa-servizi-dettaglio'
    element={<ServicesDetails />}
    path='servizi/:serviceId/info'
  />,
  <Route
    key='area-amministrativa-servizi-dettaglio-cittadini'
    element={<ServicesDetails />}
    path='servizi/:serviceId/cittadini'
  />,
];

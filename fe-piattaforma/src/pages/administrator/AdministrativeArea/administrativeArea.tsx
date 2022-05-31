import React, { useEffect } from 'react';
import { Container } from 'design-react-kit';
import {
  Outlet,
  Route,
  useLocation,
  useNavigate,
  useParams,
} from 'react-router-dom';
import Programs from './Entities/Programs/programs';
import PageTitle from '../../../components/PageTitle/pageTitle';
//import { TabGroup } from '../../../components';
import Projects from './Entities/Projects/projects';
import Utenti from './Entities/Users/users';
import Surveys from './Entities/Surveys/surveys';
import Enti from './Entities/Authorities/authorities';
/*import ManageProgram from './Entities/Programs/manageProgram/manageProgram';
import ManageProgramManagerAuthority from './Entities/Programs/manageEnteGestoreProgramma/manageEnteGestoreProgramma';
import ManageEntiPartner from './Entities/Programs/manageEntiPartner/manageEntiPartner';
import ManageHeadquarter from './Entities/Programs/manageSedi/manageSedi';
import ManageProjectManagerAuthority from './Entities/Programs/manageEnteGestoreProgetto/manageEnteGestoreProgetto';*/
import ManageUsers from './Entities/modals/manageUsers';
import CompileSurvey from './Entities/Surveys/compileSurvey/compileSurvey';
import ProgramsDetails from './Entities/Programs/programsDetails';
import ProjectsDetails from './Entities/Projects/projectsDetails';
import AuthoritiesDetails from './Entities/Authorities/authoritiesDetails';
import UsersDetails from './Entities/Users/usersDetails';
import HeadquartersDetails from './Entities/Headquarters/headquartersDetails';
import { useAppSelector } from '../../../redux/hooks';
import { selectDevice } from '../../../redux/features/app/appSlice';
import { LocationIndex } from '../../../components';
import { menuRoutes } from '../../../utils/common';
import clsx from 'clsx';
import SurveyDetails from './Entities/Surveys/surveyDetailsEdit/surveyDetailsEdit';

interface PageTitleMockI {
  [key: string]: {
    title: string;
    textCta?: string;
    iconCta?: string;
  };
}

export const PageTitleMock: PageTitleMockI = {
  '/area-amministrativa/programmi': {
    title: 'Programmi',
    textCta: 'Crea nuovo programma',
    iconCta: 'it-plus',
  },
  '/area-amministrativa/progetti': {
    title: 'Progetti',
    textCta: 'Crea nuovo progetto',
    iconCta: 'it-plus',
  },
  '/area-amministrativa/utenti': {
    title: 'Utenti',
    textCta: 'Crea nuovo utente',
    iconCta: 'it-plus',
  },
  '/area-amministrativa/enti': {
    title: 'Enti',
    textCta: 'Crea nuovo ente',
    iconCta: 'it-plus',
  },
  '/area-amministrativa/questionari': {
    title: 'Questionari',
    textCta: 'Crea nuovo questionario',
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

      <Container className={clsx(device.mediaIsPhone ? 'px-4' : 'px-0')}>
        <Outlet />
      </Container>
      <ManageUsers />
    </>
  );
};

export default AdministrativeArea;

export const AreaAmministrativaRoutes = [
  <Route key='programmi' path='programmi' element={<Programs />} />,
  <Route
    key='programmi-dettaglio'
    path='programmi/:entityId'
    element={<ProgramsDetails />}
  />,
  <Route
    key='programmi-dettaglio'
    path='programmi/:entityId/info'
    element={<ProgramsDetails />}
  />,
  <Route
    key='programmi-dettaglio'
    path='programmi/:entityId/ente'
    element={<ProgramsDetails />}
  />,
  <Route
    key='programmi-dettaglio'
    path='programmi/:entityId/questionari'
    element={<ProgramsDetails />}
  />,
  <Route
    key='programmi-dettaglio'
    path='programmi/:entityId/progetti'
    element={<ProgramsDetails />}
  />,
  <Route
    key='programmi-dettaglio'
    path='programmi/:entityId/progetti/:projectId'
    element={<ProjectsDetails />}
  />,
  <Route
    key='programmi-dettaglio-progetti-detail-info'
    path='programmi/:entityId/progetti/:projectId/info'
    element={<ProjectsDetails />}
  />,
  <Route
    key='programmi-dettaglio-progetti-detail-ente-gestore'
    path='programmi/:entityId/progetti/:projectId/ente-gestore-progetto'
    element={<ProjectsDetails />}
  />,
  <Route
    key='programmi-dettaglio-progetti-detail-enti-partner'
    path='programmi/:entityId/progetti/:projectId/enti-partner-progetto'
    element={<ProjectsDetails />}
  />,
  <Route
    key='programmi-dettaglio-progetti-detail-sedi'
    path='programmi/:entityId/progetti/:projectId/sedi'
    element={<ProjectsDetails />}
  />,
  <Route
    key='utenti-detail'
    path='programmi/:entityId/utenti/:userId'
    element={<UsersDetails />}
  />,
  <Route
    key='utenti-detail'
    path='programmi/:entityId/progetti/:projectId/utenti/:userId'
    element={<UsersDetails />}
  />,
  <Route
    key='enti-detail'
    path='programmi/:entityId/progetti/:projectId/enti/:enteId'
    element={<AuthoritiesDetails />}
  />,

  <Route key='progetti' path='progetti' element={<Projects />} />,
  <Route
    key='progetti-detail'
    path='progetti/:entityId'
    element={<ProjectsDetails />}
  />,
  <Route
    key='progetti-detail-info'
    path='progetti/:projectId/info'
    element={<ProjectsDetails />}
  />,
  <Route
    key='progetti-detail-ente-gestore'
    path='progetti/:projectId/ente-gestore-progetto'
    element={<ProjectsDetails />}
  />,
  <Route
    key='progetti-detail-enti-partner'
    path='progetti/:projectId/enti-partner-progetto'
    element={<ProjectsDetails />}
  />,
  <Route
    key='progetti-detail-sedi'
    path='progetti/:projectId/sedi'
    element={<ProjectsDetails />}
  />,
  <Route
    key='progetti-detail'
    path='progetti/:entityId/enti/:enteId'
    element={<AuthoritiesDetails />}
  />,
  <Route
    key='progetti-detail'
    path='progetti/:entityId/sedi/:sedeId'
    element={<HeadquartersDetails />}
  />,
  <Route
    key='progetti-detail'
    path='progetti/:entityId/utenti/:userId'
    element={<UsersDetails />}
  />,
  <Route key='enti' path='enti' element={<Enti />} />,
  <Route
    key='enti-detail'
    path='enti/:idEnte'
    element={<AuthoritiesDetails />}
  />,
  <Route key='utenti' path='utenti' element={<Utenti />} />,
  <Route
    key='utenti-detail'
    path='utenti/:entityId'
    element={<UsersDetails />}
  />,
  <Route
    key='sede-detail'
    path='sedi/:entityId'
    element={<HeadquartersDetails />}
  />,
  <Route
    key='questionari'
    path='questionari/compila'
    element={<CompileSurvey />}
  />,
  <Route
    key='questionari-modifica'
    path='questionari/:idQuestionario/modifica'
    element={<SurveyDetails editMode />}
  />,
  <Route key='questionari' path='questionari' element={<Surveys />} />,
  <Route
    key='questionari-clona'
    path='questionari/:idQuestionario/clona'
    element={<SurveyDetails cloneMode />}
  />,
  <Route
    key='questionari-detail'
    path='questionari/:idQuestionario/info'
    element={<SurveyDetails />}
  />,
  <Route
    key='questionari-detail'
    path='questionari/:idQuestionario'
    element={<SurveyDetails />}
  />,
];

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
import { useAppSelector } from '../../../redux/hooks';
import { selectDevice } from '../../../redux/features/app/appSlice';
import { LocationIndex } from '../../../components';
import { MenuRoutes } from '../../../utils/common';
const Monitoring = lazy(() => import('./monitoring'));
// const Users = lazy(() => import('./Entities/Users/users'));
// const Authorities = lazy(() => import('./Entities/Authorities/authorities'));
import ProtectedComponent from '../../../hoc/AuthGuard/ProtectedComponent/ProtectedComponent';

interface PageTitleMockI {
  [key: string]: {
    title: string;
    textCta?: string;
    iconCta?: string;
  };
}

export const PageTitleMock: PageTitleMockI = {
  '/area-dati/monitoraggio-caricamenti-massivi': {
    title: 'Monitoraggio dei caricamenti massivi',
    textCta: 'Monitoraggio dei caricamenti massivi',
    iconCta: 'it-plus',
  }
};

const tabs = [
  {
    label: 'Monitoraggio dei caricamenti massivi',
    path: '/area-dati/monitoraggio-caricamenti-massivi',
    id: 'tab-dashboard',
  }
];

const DataReports = () => {
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

  const noDetailRoute = MenuRoutes.find(
    (x) => x.id === 'tab-dashboard'
  )?.subRoutes?.some((y) => y.path === location.pathname);

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
              MenuRoutes.find((x) => x.id === 'tab-dashboard')?.subRoutes || []
            }
          />
        </div>
      )}

      {location?.pathname &&
      location?.pathname !== '/report-dati/questionari' &&
      !entityId ? (
        <PageTitle {...PageTitleMock[location?.pathname]} />
      ) : null}

      <Container>
        <Routes>{DataReportsRoutes}</Routes>
      </Container>
      {/* <ManageUsers /> */}
    </>
  );
};

export default DataReports;

const DataReportsRoutes = [
  <Route
    key='monitoring'
    path='monitoraggio-caricamenti-massivi'
    element={
      <ProtectedComponent visibleTo={['tab.dshb']}>
        <Monitoring />
      </ProtectedComponent>
    }
  />
];

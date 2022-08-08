import React, { lazy, Suspense, useEffect, useState } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useAppSelector } from '../redux/hooks';
import { selectLogged } from '../redux/features/user/userSlice';
import ProtectedComponent from '../hoc/AuthGuard/ProtectedComponent/ProtectedComponent';
import FullLayout from '../components/PageLayout/FullLayout/fullLayout';
import { Loader } from '../components';
import Notifications from '../pages/common/NotificationsPage/notifications';
import { SessionCheck } from '../redux/features/user/userThunk';

const HomeFacilitator = lazy(() => import('../pages/facilitator/Home/home'));
const AdministrativeArea = lazy(
  () => import('../pages/administrator/AdministrativeArea/administrativeArea')
);
const CitizenArea = lazy(
  () => import('../pages/administrator/CitizensArea/citizensArea')
);
const Documents = lazy(
  () => import('../pages/facilitator/Documents/documents')
);
const RoleManagement = lazy(
  () => import('../pages/common/RoleManagement/roleManagement')
);
const RoleManagementDetails = lazy(
  () =>
    import(
      '../pages/common/RoleManagement/RoleManagementDetails/roleManagementDetails'
    )
);
const Onboarding = lazy(
  () => import('../pages/facilitator/Onboarding/onboarding')
);
const PrintSurvey = lazy(
  () =>
    import(
      '../pages/administrator/AdministrativeArea/Entities/Surveys/printSurvey/printSurvey'
    )
);
const Playground = lazy(() => import('../pages/playground'));
const Auth = lazy(() => import('../pages/common/Auth/auth'));
const Dashboard = lazy(
  () => import('../pages/administrator/Dashboard/dashboard')
);
const UserProfile = lazy(
  () => import('../pages/common/UserProfile/userProfile')
);

const OpenData = lazy(
  () => import('../pages/common/OpenData/openData')
);

/**
 The "routes.tsx" file is now useless, lazy loading is implemented for every 
 routes and this file is the top of the routes tree.
 In the way to implement lazy loading and to semplify further changes, routes are expandend
 in this component
 */

const AppRoutes: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isLogged = useAppSelector(selectLogged);
  const [validSession, setValidSession] = useState(false);

  const checkSession = async () => {
    const checkSession = await SessionCheck(dispatch);
    setValidSession(Boolean(checkSession));
  };

  useEffect(() => {
    checkSession();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (validSession && isLogged) navigate('/');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLogged]);

  if (!validSession) return <Loader />;

  return (
    // This fix is need cause Loader will cause a wdyr error if used here
    <Suspense fallback={<Loader />}>
      <Routes>
        {process.env.NODE_ENV === 'development' ? (
          <Route path='/' element={<FullLayout isFull />}>
            <Route
              path='/'
              element={
                <ProtectedComponent visibleTo={[]} redirect='/auth'>
                  <HomeFacilitator />
                </ProtectedComponent>
              }
            />
          </Route>
        ) : null}
        <Route path='/' element={<FullLayout />}>
          <Route
            path='/open-data'
            element={<OpenData />}
          />
          <Route
            path='/area-amministrativa/*'
            element={
              <ProtectedComponent visibleTo={['tab.am']} redirect='/'>
                <AdministrativeArea />
              </ProtectedComponent>
            }
          />
          <Route
            path='/area-cittadini/*'
            element={
              <ProtectedComponent visibleTo={[]} redirect='/'>
                <CitizenArea />
              </ProtectedComponent>
            }
          />
          <Route
            path='/documenti'
            element={
              <ProtectedComponent visibleTo={[]} redirect='/'>
                <Documents />
              </ProtectedComponent>
            }
          />
          <Route
            path='/gestione-ruoli/crea-nuovo'
            element={
              <ProtectedComponent visibleTo={[]} redirect='/'>
                <RoleManagementDetails creation />
              </ProtectedComponent>
            }
          />
          <Route
            path='/gestione-ruoli/:codiceRuolo/modifica'
            element={
              <ProtectedComponent visibleTo={[]} redirect='/'>
                <RoleManagementDetails edit />
              </ProtectedComponent>
            }
          />
          <Route
            path='/gestione-ruoli/:codiceRuolo'
            element={
              <ProtectedComponent
                visibleTo={['view.ruoli']}
                redirect='/gestione-ruoli'
              >
                <RoleManagementDetails />
              </ProtectedComponent>
            }
          />
          <Route
            path='/gestione-ruoli'
            element={
              <ProtectedComponent visibleTo={['list.ruoli']} redirect='/'>
                <RoleManagement />
              </ProtectedComponent>
            }
          />
          {process.env.NODE_ENV === 'development' ? (
            <Route
              path='/notifiche'
              element={
                <ProtectedComponent visibleTo={[]} redirect='/'>
                  <Notifications />
                </ProtectedComponent>
              }
            />
          ) : null}
          <Route path='/onboarding' element={<Onboarding />} />
          <Route
            path='/dashboard'
            element={
              <ProtectedComponent
                visibleTo={['tab.dshb', 'view.dshb']}
                redirect='/'
              >
                <Dashboard />
              </ProtectedComponent>
            }
          />
          <Route
            path='/area-personale'
            element={
              <ProtectedComponent visibleTo={[]} redirect='/'>
                <UserProfile />
              </ProtectedComponent>
            }
          />
          {process.env.NODE_ENV === 'development' ? (
            <Route path='/playground' element={<Playground />} />
          ) : null}
          <Route
            path='/'
            element={
              <Navigate to={isLogged ? '/area-amministrativa' : '/auth'} />
            }
          />
          <Route
            path='*'
            element={
              <Navigate to={isLogged ? '/area-amministrativa' : '/auth'} />
            }
          />
        </Route>
        <Route path='/stampa-questionario' element={<PrintSurvey />} />
        <Route
          path='/auth'
          element={isLogged ? <Navigate to='/area-amministrativa' /> : <Auth />}
        />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;

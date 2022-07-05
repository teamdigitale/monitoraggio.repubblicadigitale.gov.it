import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAppSelector } from '../redux/hooks';
import { selectLogged } from '../redux/features/user/userSlice';
import ProtectedComponent from '../hoc/AuthGuard/ProtectedComponent/ProtectedComponent';
import FullLayout from '../components/PageLayout/FullLayout/fullLayout';
import { Loader } from '../components';

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

/**
 The "routes.tsx" file is now useless, lazy loading is implemented for every 
 routes and this file is the top of the routes tree.
 In the way to implement lazy loading and to semplify further changes, routes are expandend
 in this component
 */

const AppRoutes: React.FC = () => {
  const isLogged = useAppSelector(selectLogged);

  return (
    // This fix is need cause Loader will cause a wdyr error if used here
    <Suspense fallback={<Loader />}>
      <Routes>
        <Route path='/' element={<FullLayout />}>
          <Route
            path='/'
            element={
              <ProtectedComponent visibleTo={[]} redirect='/auth'>
                <HomeFacilitator />
              </ProtectedComponent>
            }
          />
          <Route
            path='area-amministrativa/*'
            element={
              <ProtectedComponent visibleTo={['permission-1']} redirect='/'>
                <AdministrativeArea />
              </ProtectedComponent>
            }
          />
          <Route
            path='area-cittadini/*'
            element={
              <ProtectedComponent visibleTo={['permission-1']} redirect='/'>
                <CitizenArea />
              </ProtectedComponent>
            }
          />
          <Route
            path='/documents'
            element={
              <ProtectedComponent visibleTo={['permission-1']} redirect='/'>
                <Documents />
              </ProtectedComponent>
            }
          />
          <Route
            path='/gestione-ruoli'
            element={
              <ProtectedComponent visibleTo={['permission-1']} redirect='/'>
                <RoleManagement />
              </ProtectedComponent>
            }
          />
          <Route
            path='/gestione-ruoli/:idRuoloUtente'
            element={
              <ProtectedComponent visibleTo={['permission-1']} redirect='/'>
                <RoleManagementDetails />
              </ProtectedComponent>
            }
          />
          <Route
            path='/onboarding'
            element={
              <ProtectedComponent visibleTo={[]} redirect='/'>
                <Onboarding />
              </ProtectedComponent>
            }
          />
          <Route
            path='/dashboard'
            element={
              <ProtectedComponent visibleTo={[]} redirect='/'>
                <Dashboard />
              </ProtectedComponent>
            }
          />
          <Route
            path='*'
            element={
              <ProtectedComponent visibleTo={[]} redirect='/'>
                <Playground />
              </ProtectedComponent>
            }
          />
        </Route>
        <Route path='/stampa-questionario' element={<PrintSurvey />} />
        <Route
          path='/auth'
          element={isLogged ? <Navigate to='/' /> : <Auth />}
        />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;

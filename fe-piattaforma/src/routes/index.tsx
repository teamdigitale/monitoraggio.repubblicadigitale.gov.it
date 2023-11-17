import React, { lazy, Suspense, useEffect, useState } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useAppSelector } from '../redux/hooks';
import { selectLogged } from '../redux/features/user/userSlice';
import ProtectedComponent from '../hoc/AuthGuard/ProtectedComponent/ProtectedComponent';
import FullLayout from '../components/PageLayout/FullLayout/fullLayout';
import { Loader } from '../components';
import Notifications from '../pages/common/NotificationsPage/notifications';
import {
  // GetNotificationsByUser,
  SessionCheck,
} from '../redux/features/user/userThunk';
import ErrorPage from '../pages/common/Error/errorPage';

// TODO import with lazy
import DocumentsDetails from '../pages/facilitator/Documents/documentsDetails';
import BachecaDetails from '../pages/facilitator/Home/components/BachecaDigitaleWidget/BachecaDetails';
import BachecaDigitale from '../pages/facilitator/Home/components/BachecaDigitaleWidget/BachecaDigitale';
import HomeSearch from '../pages/common/HomeSearch/homeSearch';
import UserPublishedContentsPage from '../pages/common/UserPublishedContentsPage/userPublishedContentsPage';
import { selectModalState } from '../redux/features/modal/modalSlice';

const AuthRedirect = lazy(() => import('../pages/common/Auth/authRedirect'));

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

const OpenData = lazy(() => import('../pages/common/OpenData/openData'));
const Accessibility = lazy(
  () => import('../pages/common/Accessibility/accessibility')
);
const SurveyOnline = lazy(
  () => import('../pages/common/SurveyOnline/surveyOnline')
);

// WAVE 3
const Reports = lazy(() => import('../pages/common/Reports/reports'));
const Community = lazy(() => import('../pages/common/Community/community'));
const Category = lazy(() => import('../pages/facilitator/Categories/category'));
const CommunityDetails = lazy(
  () => import('../pages/common/Community/communityDetails')
);

/**
 The "routes.tsx" file is now useless, lazy loading is implemented for every 
 routes and this file is the top of the routes tree.
 In the way to implement lazy loading and to semplify further changes, routes are expandend
 in this component
 */

export const defaultRedirectUrl = '/';
export const redirectUrlSurveyOnline = 'https://repubblicadigitale.gov.it/it/';

const AppRoutes: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isLogged = useAppSelector(selectLogged);
  const modalOpen = useAppSelector(selectModalState);
  const [validSession, setValidSession] = useState(false);

  useEffect(() => {
    if (modalOpen) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }
  }, [modalOpen]);

  const checkSession = async () => {
    const checkSession = await SessionCheck(dispatch);
    setValidSession(Boolean(checkSession));
    // if (checkSession) {
    //   dispatch(
    //     GetNotificationsByUser(
    //       { status: [{ value: 0 }], items_per_page: [{ value: 9 }] },
    //       true
    //     )
    //   );
    // }
  };

  useEffect(() => {
    checkSession();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (validSession && isLogged)
      navigate(defaultRedirectUrl, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLogged]);

  if (!validSession) return <Loader />;

  return (
    // This fix is need cause Loader will cause a wdyr error if used here
    <Suspense fallback={<Loader />}>
      <Routes>
        <Route path='/auth-redirect' element={<AuthRedirect />} />
        <Route path='/errore/:errorCode' element={<ErrorPage />} />
        <Route path='/errore' element={<ErrorPage />} />
        <Route path='/open-data' element={<OpenData />} />
        {process.env.NODE_ENV === 'development' ? (
          <Route path='/playground' element={<Playground />} />
        ) : null}
        {isLogged ? (
          <>
            <Route
              path='/area-amministrativa/servizi/:serviceId/stampa-questionario/:idQuestionario'
              element={<PrintSurvey />}
            />
            <Route path='/' element={<FullLayout isFull />}>
              <Route
                path='/community/:id'
                element={
                  <ProtectedComponent visibleTo={['view.card.topic']}>
                    <CommunityDetails />
                  </ProtectedComponent>
                }
              />
              <Route
                path='/community'
                element={
                  <ProtectedComponent visibleTo={['tab.comm', 'list.topic']}>
                    <Community />
                  </ProtectedComponent>
                }
              />
              <Route
                path='/documenti/:id'
                element={
                  <ProtectedComponent visibleTo={['view.card.doc']}>
                    <DocumentsDetails />
                  </ProtectedComponent>
                }
              />
              <Route
                path='/documenti'
                element={
                  <ProtectedComponent visibleTo={['tab.doc', 'list.doc']}>
                    <Documents />
                  </ProtectedComponent>
                }
              />
              <Route
                path='/bacheca/:id'
                element={
                  <ProtectedComponent
                    visibleTo={['view.card.news']}
                    redirect='/'
                  >
                    <BachecaDetails />
                  </ProtectedComponent>
                }
              />
              <Route
                path='/bacheca'
                element={
                  <ProtectedComponent
                    visibleTo={['tab.bach', 'list.news']}
                    redirect='/'
                  >
                    <BachecaDigitale />
                  </ProtectedComponent>
                }
              />
              <Route
                path='/'
                element={
                  <ProtectedComponent visibleTo={['tab.home']}>
                    <HomeFacilitator />
                  </ProtectedComponent>
                }
              />
              <Route
                path='/'
                element={<Navigate replace to={defaultRedirectUrl} />}
              />
            </Route>
            <Route path='/' element={<FullLayout withBreadcrumb />}>
              <Route path='/legal' element={<Accessibility />} />
              <Route
                path='/area-personale/contenuti-pubblicati'
                element={
                  <ProtectedComponent visibleTo={['btn.cont']}>
                    <UserPublishedContentsPage />
                  </ProtectedComponent>
                }
              />
              <Route
                path='/area-personale'
                element={
                  <ProtectedComponent visibleTo={[]}>
                    <UserProfile />
                  </ProtectedComponent>
                }
              />
              <Route
                path='/area-gestionale/gestione-segnalazioni'
                element={
                  <ProtectedComponent visibleTo={['btn.rprt']}>
                    <Reports />
                  </ProtectedComponent>
                }
              />
              <Route
                path='/area-gestionale/gestione-categorie'
                element={
                  <ProtectedComponent visibleTo={['btn.cat']}>
                    <Category />
                  </ProtectedComponent>
                }
              />
              <Route
                path='/gestione-ruoli/crea-nuovo'
                element={
                  <ProtectedComponent
                    visibleTo={['list.ruoli']}
                    redirect='/gestione-ruoli'
                  >
                    <RoleManagementDetails creation />
                  </ProtectedComponent>
                }
              />
              <Route
                path='/gestione-ruoli/:codiceRuolo/modifica'
                element={
                  <ProtectedComponent
                    visibleTo={['list.ruoli']}
                    redirect='/gestione-ruoli'
                  >
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
                  <ProtectedComponent visibleTo={['list.ruoli']}>
                    <RoleManagement />
                  </ProtectedComponent>
                }
              />
              <Route
                path='/notifiche'
                element={
                  <ProtectedComponent visibleTo={['list.ntf.nr']}>
                    <Notifications />
                  </ProtectedComponent>
                }
              />
              <Route
                path='/home/cerca'
                element={
                  <ProtectedComponent visibleTo={[]}>
                    <HomeSearch />
                  </ProtectedComponent>
                }
              />
              <Route
                path='/report-dati'
                element={
                  <ProtectedComponent visibleTo={['tab.dshb', 'view.dshb']}>
                    <Dashboard />
                  </ProtectedComponent>
                }
              />
              <Route
                path='/area-amministrativa/*'
                element={
                  <ProtectedComponent visibleTo={['tab.am']}>
                    <AdministrativeArea />
                  </ProtectedComponent>
                }
              />
              <Route
                path='/area-cittadini/*'
                element={
                  <ProtectedComponent visibleTo={[]}>
                    <CitizenArea />
                  </ProtectedComponent>
                }
              />
            </Route>
          </>
        ) : (
          <>
            <Route path='/auth/:token' element={<Auth />} />
            <Route path='/auth' element={<Auth />} />
            <Route path='/report-dati' element={<Dashboard />} />
            <Route path='/' element={<FullLayout />}>
              {/* Public Paths */}
              <Route path='/onboarding' element={<Onboarding />} />
              <Route path='/' element={<AuthRedirect />} />
            </Route>
            <Route path='/' element={<FullLayout withBreadcrumb={false} />}>
              <Route path='/legal' element={<Accessibility />} />
              <Route
                path='/servizi/questionario/:idQuestionario/online/:token'
                element={<SurveyOnline />}
              />
              <Route path='/' element={<AuthRedirect />} />
            </Route>
          </>
        )}
        {/*
        <Route
          path='/'
          element={<Navigate replace to={defaultRedirectUrl} />}
        />
        <Route
          path='*'
          element={<Navigate replace to={defaultRedirectUrl} />}
        />*/}
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;

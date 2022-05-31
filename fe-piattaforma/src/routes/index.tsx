import React from 'react';
import { Routes, Route } from 'react-router-dom';
import MainLayout from '../components/PageLayout/mainLayout';
import FullLayout from '../components/PageLayout/fullLayout';
import { Auth } from '../pages';
import { useAppSelector } from '../redux/hooks';
import { selectLogged, selectUser } from '../redux/features/user/userSlice';
import { BreadcrumbI } from '../components/Breadcrumb/breadCrumb';
import PrintSurvey from '../pages/administrator/AdministrativeArea/Entities/Surveys/printSurvey/printSurvey';

export enum layoutEnum {
  fullLayout = 'FULL_LAYOUT',
  mainLayout = 'MAIN_LAYOUT',
  none = 'NONE',
}

export interface AppRoutesI {
  path: string;
  title?: string;
  element: JSX.Element;
  visibleTo?: string[];
  subRoutes?: JSX.Element[] | undefined;
  layout?: layoutEnum;
  isHeaderFull?: boolean | undefined;
  authenticated?: boolean | undefined;
  route_paths?: BreadcrumbI[] | undefined;
}

interface AppRouteProps {
  routes: AppRoutesI[];
}

const AppRoutes: React.FC<AppRouteProps> = (props) => {
  const { routes } = props;
  const isLogged = useAppSelector(selectLogged);
  const user = useAppSelector(selectUser);

  return (
    <Routes>
      {isLogged && user ? (
        <>
          {routes
            .filter((item) => item.authenticated)
            .map((route, index) =>
              route.layout === layoutEnum.fullLayout ? (
                <Route
                  key={index}
                  path='/'
                  element={<FullLayout isHeaderFull={route.isHeaderFull} />}
                >
                  <Route path={route.path} element={route.element}>
                    {route.subRoutes?.map((r: JSX.Element) => r)}
                  </Route>
                </Route>
              ) : (
                <Route
                  key={index}
                  path='/'
                  element={<MainLayout isHeaderFull={route.isHeaderFull} />}
                >
                  <Route path={route.path} element={route.element}>
                    {route.subRoutes?.map((r: JSX.Element) => r)}
                  </Route>
                </Route>
              )
            )}
          <Route path='/stampa-questionario' element={<PrintSurvey />} />
        </>
      ) : (
        <>
          {routes
            .filter((item) => !item.authenticated)
            .map((route, index) =>
              route.layout === layoutEnum.fullLayout ? (
                <Route
                  key={index}
                  path='/'
                  element={<FullLayout isHeaderFull={route.isHeaderFull} />}
                >
                  <Route path={route.path} element={route.element}>
                    {route.subRoutes?.map((r: JSX.Element) => r)}
                  </Route>
                </Route>
              ) : (
                <Route
                  key={index}
                  path='/'
                  element={<MainLayout isHeaderFull={route.isHeaderFull} />}
                >
                  <Route path={route.path} element={route.element}>
                    {route.subRoutes?.map((r: JSX.Element) => r)}
                  </Route>
                </Route>
              )
            )}
          <Route path='/auth' element={<Auth />} />
          <Route path='*' element={<Auth />} />
        </>
      )}
    </Routes>
  );
};

export default AppRoutes;

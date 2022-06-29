import React from 'react';
import { Footer, Header } from '../index';
import { Outlet } from 'react-router-dom';
import { AppRoutesI } from '../../routes';
import Breadcrumb from '../Breadcrumb/breadCrumb';
import { selectDevice, selectLoader } from '../../redux/features/app/appSlice';
import { useAppSelector } from '../../redux/hooks';
import Loader from '../Loader/loader';
import LocationInterceptor from '../locationInterceptor';

export interface LayoutProp {
  isHeaderFull?: AppRoutesI['isHeaderFull'];
  breadcrumbArray?: AppRoutesI['route_paths'];
}

const MainLayout: React.FC<LayoutProp> = (props) => {
  const { isHeaderFull = true } = props;
  const loader = useAppSelector(selectLoader);
  const device = useAppSelector(selectDevice);

  return (
    <>
      <LocationInterceptor />
      <Header isHeaderFull={isHeaderFull} />
      {location.pathname !== '/' && !device.mediaIsPhone && <Breadcrumb />}
      {loader.isLoading && <Loader />}
      <main
        className='container main-container main-container__content-container'
        id='main'
        tabIndex={-1}
      >
        <Outlet />
      </main>
      <Footer />
    </>
  );
};

export default MainLayout;

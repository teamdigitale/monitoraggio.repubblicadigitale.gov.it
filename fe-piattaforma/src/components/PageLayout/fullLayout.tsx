import React from 'react';
import { Footer, Header, Loader } from '../index';
import { Outlet } from 'react-router-dom';
import { LayoutProp } from './mainLayout';
import Breadcrumb from '../Breadcrumb/breadCrumb';
import { useAppSelector } from '../../redux/hooks';
import { selectDevice, selectLoader } from '../../redux/features/app/appSlice';
import LocationInterceptor from '../locationInterceptor';

const FullLayout: React.FC<LayoutProp> = (props) => {
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
        className='main-container main-container__content-container'
        id='main'
        tabIndex={-1}
      >
        <Outlet />
      </main>

      <Footer />
    </>
  );
};

export default FullLayout;

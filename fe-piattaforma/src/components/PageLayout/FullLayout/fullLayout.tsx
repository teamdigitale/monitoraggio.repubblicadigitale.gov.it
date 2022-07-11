import React from 'react';
import { Footer, Header, Loader } from '../../index';
import Breadcrumb from '../../Breadcrumb/breadCrumb';
import { useAppSelector } from '../../../redux/hooks';
import {
  selectDevice,
  selectLoader,
} from '../../../redux/features/app/appSlice';
import LocationInterceptor from '../../locationInterceptor';
import { Outlet, useLocation } from 'react-router-dom';
import clsx from 'clsx';

/**
 * The component has been modified to pass routes guard.
 * Outlet is no more used and the component rendere is children.
 * Now this is the only layout, the header conditionally render can be managed directly in this
 * component using recognizing location path
 */

export interface LayoutProp {
  isHeaderFull?: boolean;
  isFull?: boolean;
  children?: JSX.Element;
}

const FullLayout: React.FC<LayoutProp> = (props) => {
  const { isHeaderFull = true, children, isFull = false } = props;
  const loader = useAppSelector(selectLoader);
  const device = useAppSelector(selectDevice);
  const location = useLocation();

  return (
    <>
      <LocationInterceptor />
      <Header isHeaderFull={isHeaderFull} />
      {location.pathname !== '/' && !device.mediaIsPhone && <Breadcrumb />}
      {loader.isLoading && <Loader />}
      <main
        className={clsx(
          'main-container',
          'main-container__content-container',
          !device.mediaIsDesktop || isFull ? null : 'container'
        )}
        id='main'
        tabIndex={-1}
      >
        {children ? children : <Outlet />}
      </main>
      <Footer />
    </>
  );
};

export default FullLayout;

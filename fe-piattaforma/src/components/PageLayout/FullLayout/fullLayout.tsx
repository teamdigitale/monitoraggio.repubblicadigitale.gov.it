import React from 'react';
import { Footer, Header, Loader } from '../../index';
import Breadcrumb from '../../Breadcrumb/breadCrumb';
import { useAppSelector } from '../../../redux/hooks';
import {
  selectDevice,
  selectLoader,
  selectPublishedContent,
} from '../../../redux/features/app/appSlice';
import LocationInterceptor from '../../locationInterceptor';
import { Outlet, useLocation } from 'react-router-dom';
import clsx from 'clsx';
import UserPublishedContents from '../../UserPublishedContents/userPublishedContents';

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
  withBreadcrumb?: boolean;
}

const FullLayout: React.FC<LayoutProp> = (props) => {
  const {
    isHeaderFull = true,
    children,
    isFull = false,
    withBreadcrumb = true,
  } = props;
  const loader = useAppSelector(selectLoader);
  const device = useAppSelector(selectDevice);
  const location = useLocation();
  const publishedContent = useAppSelector(selectPublishedContent);

  return (
    <>
      <LocationInterceptor />
      <Header isHeaderFull={isHeaderFull} />
      {location.pathname !== '/' && !device.mediaIsPhone && (
        <div className={clsx(publishedContent && 'lightgrey-bg-b4')}>
          <div
            className={clsx(
              publishedContent && 'd-flex justify-content-around container'
            )}
          >
            <Breadcrumb />
            {publishedContent && <UserPublishedContents />}
          </div>
        </div>
      )}
      {loader.isLoading && <Loader />}
      <main
        className={clsx(
          'main-container',
          'main-container__content-container',
          !device.mediaIsDesktop || isFull ? null : 'container',
          !withBreadcrumb && 'mt-5'
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

// High-order components must use the spreading operator
// to pass the props down to the real one.
/* eslint-disable react/jsx-props-no-spreading */
import React, { useEffect, useLayoutEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useAppSelector } from '../redux/hooks';
import { selectDevice, updateDevice } from '../redux/features/app/appSlice';

const breakpoint = {
  mobile: 375,
  tablet: 768,
  //laptop: 1024,
  desktop: 1200,
};

const defaultScreenSize = {
  height: window.innerHeight,
  width: window.innerWidth,
};
let deviceWidth = defaultScreenSize.width;

const defaultMediaQueries = {
  mediaIsPhone:
    defaultScreenSize.width >= breakpoint.mobile &&
    defaultScreenSize.width < breakpoint.tablet,
  mediaIsTablet:
    defaultScreenSize.width >= breakpoint.tablet &&
    defaultScreenSize.width < breakpoint.desktop,
  /*mediaIsLaptop:
    defaultScreenSize.width >= breakpoint.laptop &&
    defaultScreenSize.width < breakpoint.desktop,*/
  mediaIsDesktop: defaultScreenSize.width >= breakpoint.desktop,
};

interface withMediaQueriesProps {
  height?: number;
  width?: number;
  mediaIsPhone?: boolean;
  mediaIsTablet?: boolean;
  //mediaIsLaptop?: boolean,
  mediaIsDesktop?: boolean;
}
const resizeThreshold = 100;

const withMediaQueries =
  <P extends object>(
    Component: React.ComponentType<P>
  ): React.FC<P & withMediaQueriesProps> =>
  // eslint-disable-next-line react/display-name
  (props: withMediaQueriesProps) => {
    const [mediaQueries, setMediaQueries] = useState(defaultMediaQueries);
    //const [screenSizes, setScreenSizes] = useState(defaultScreenSize);
    const device = useAppSelector(selectDevice);
    const dispatch = useDispatch();

    useEffect(() => {
      if (device !== mediaQueries) dispatch(updateDevice(mediaQueries));
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [device, mediaQueries]);

    const updateSize = () => {
      if (Math.abs(deviceWidth - window.innerWidth) >= resizeThreshold) {
        setMediaQueries({
          ...mediaQueries,
          mediaIsPhone:
            //window.innerWidth >= breakpoint.mobile &&
            window.innerWidth < breakpoint.tablet,
          mediaIsTablet:
            window.innerWidth >= breakpoint.tablet &&
            window.innerWidth < breakpoint.desktop,
          //mediaIsLaptop:
          //window.innerWidth >= breakpoint.laptop
          //&& window.innerWidth < breakpoint.desktop,
          mediaIsDesktop: window.innerWidth >= breakpoint.desktop,
        });

        deviceWidth = window.innerWidth;

        /*setScreenSizes({
          ...screenSizes,
          height: window.innerHeight,
          width: window.innerWidth,
        });*/
      }
    };

    useLayoutEffect(() => {
      window.addEventListener('resize', updateSize);
      return () => window.removeEventListener('resize', updateSize);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
      <Component
        {...(props as P)}
        {...device}
        //{...mediaQueries}
        //{...screenSizes}
      />
    );
  };

export default withMediaQueries;

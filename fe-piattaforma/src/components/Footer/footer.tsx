import React, { memo } from 'react';
import { selectDevice } from '../../redux/features/app/appSlice';
import { useAppSelector } from '../../redux/hooks';
import FooterDesktop from './view/footerDesktop';
import FooterMobile from './view/footerMobile';

const Footer: React.FC = () => {
  const device = useAppSelector(selectDevice);

  if (device.mediaIsPhone) {
    return <FooterMobile />;
  }
  return <FooterDesktop />;
};

export default memo(Footer);

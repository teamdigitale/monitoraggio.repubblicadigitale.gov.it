import React, { memo } from 'react';
import { selectDevice } from '../../redux/features/app/appSlice';
import { useAppSelector } from '../../redux/hooks';
import FooterDesktop from './view/footerDesktop';
import FooterMobile from './view/footerMobile';
import { isEmpty } from 'lodash';

const Footer: React.FC = () => {
  const device = useAppSelector(selectDevice);

  return isEmpty(device) ? null : device.mediaIsPhone ? (
    <FooterMobile />
  ) : (
    <FooterDesktop />
  );
};

export default memo(Footer);

import React, { memo } from 'react';
import { useAppSelector } from '../../redux/hooks';
import {
  selectUserNotification,
  selectUser,
} from '../../redux/features/user/userSlice';
import { useDispatch } from 'react-redux';
import { selectDevice } from '../../redux/features/app/appSlice';
import HeaderMobile from './view/headerMobile';
import HeaderDesktop from './view/headerDesktop';

export interface HeaderI {
  isHeaderFull?: boolean | undefined;
  dispatch: (payload: unknown) => void;
  user: { name: string; surname: string; role: string } | undefined;
  isLogged: boolean;
  notification?: [] | undefined;
}

export interface HeaderProp {
  isHeaderFull?: boolean;
}

const Header: React.FC<HeaderProp> = (props) => {
  const { isHeaderFull } = props;

  const isLogged = useAppSelector((state) => state.user.isLogged);
  const user = useAppSelector(selectUser);
  const dispatch = useDispatch();

  const notification = useAppSelector(selectUserNotification);

  const device = useAppSelector(selectDevice);

  const componentProps = {
    notification,
    isLogged,
    user,
    dispatch,
    isHeaderFull,
  };

  if (!device?.mediaIsDesktop) {
    return <HeaderMobile {...componentProps} />;
  }
  return <HeaderDesktop {...componentProps} />;
};
export default memo(Header);

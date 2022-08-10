import React, { memo, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { isEmpty } from 'lodash';
import { useAppSelector } from '../../redux/hooks';
import {
  selectUserNotification,
  selectUser,
  UserStateI,
  selectProfile,
  UserProfileI,
} from '../../redux/features/user/userSlice';
import { selectDevice } from '../../redux/features/app/appSlice';
import HeaderMobile from './view/headerMobile';
import HeaderDesktop from './view/headerDesktop';
import SwitchProfileModal from '../Modals/SwitchProfileModal/switchProfileModal';
import { MenuItem, MenuRoutes } from '../../utils/common';
import { userRoles } from '../../pages/administrator/AdministrativeArea/Entities/utils';

export interface HeaderI {
  isHeaderFull?: boolean | undefined;
  dispatch: (payload: unknown) => void;
  user: UserStateI['user'];
  userProfile: UserStateI['profilo'];
  isLogged: boolean;
  notification?: [] | undefined;
  menuRoutes: MenuItem[];
}

export interface HeaderProp {
  isHeaderFull?: boolean;
}

const parseMenuRoute = (menuRoute: MenuItem, userProfile: UserProfileI) => {
  switch (userProfile?.codiceRuolo) {
    case userRoles.REG: {
      if (userProfile?.idProgramma && menuRoute.path === '/area-amministrativa/programmi') {
        return {
          ...menuRoute,
          label: 'Programma',
          path: `/area-amministrativa/programmi/${userProfile.idProgramma}/info`,
        };
      }
      return menuRoute;
    }
    case userRoles.REGP: {
      if (userProfile?.idProgetto && menuRoute.path === '/area-amministrativa/progetti') {
        return {
          ...menuRoute,
          label: 'Progetto',
          path: `/area-amministrativa/progetti/${userProfile.idProgetto}/info`,
        };
      } else if (userProfile?.idProgramma && menuRoute.path === '/area-amministrativa/programmi') {
        return {
          ...menuRoute,
          label: 'Programma',
          path: `/area-amministrativa/programmi/${userProfile.idProgramma}/info`,
        };
      }
      return menuRoute;
    }
    default:
      return menuRoute;
  }
};

const getRoleMenuRoutes = (userProfile?: UserProfileI | null) => {
  let roleMenuRoutes: MenuItem[] = MenuRoutes;
  if (userProfile) {
    roleMenuRoutes = MenuRoutes.map((menuRoute) => {
      if (menuRoute.subRoutes?.length) {
        return {
          ...parseMenuRoute(menuRoute, userProfile),
          subRoutes: menuRoute.subRoutes.map((subRoute) =>
            parseMenuRoute(subRoute, userProfile)
          ),
        };
      }
      return parseMenuRoute(menuRoute, userProfile);
    });
  }
  return roleMenuRoutes;
};

const Header: React.FC<HeaderProp> = (props) => {
  const { isHeaderFull } = props;
  const [menuRoutes, setMenuRoutes] = useState<MenuItem[]>(MenuRoutes);
  const isLogged = useAppSelector((state) => state.user.isLogged);
  const user = useAppSelector(selectUser);
  const userProfile = useAppSelector(selectProfile);
  const dispatch = useDispatch();

  const notification = useAppSelector(selectUserNotification);

  const device = useAppSelector(selectDevice);

  useEffect(() => {
    if (isLogged) setMenuRoutes(getRoleMenuRoutes(userProfile));
  }, [isLogged, userProfile]);

  const componentProps = {
    notification,
    isLogged,
    user,
    userProfile,
    dispatch,
    isHeaderFull,
    menuRoutes,
  };

  return (
    <>
      {isEmpty(device) ? null : device.mediaIsDesktop ? (
        <HeaderDesktop {...componentProps} />
      ) : (
        <HeaderMobile {...componentProps} />
      )}
      <SwitchProfileModal />
    </>
  );
};
export default memo(Header);

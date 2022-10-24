import React, { memo, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { isEmpty } from 'lodash';
import { useAppSelector } from '../../redux/hooks';
import {
  selectUserNotificationToRead,
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
import { openModal } from '../../redux/features/modal/modalSlice';
import RocketChatModal from '../Modals/RocketChatModal/rocketChatModal';
import useGuard from '../../hooks/guard';

export interface HeaderI {
  isHeaderFull?: boolean | undefined;
  dispatch: (payload: unknown) => void;
  user: UserStateI['user'];
  userProfile: UserStateI['profilo'];
  isLogged: boolean;
  notification: number | undefined;
  menuRoutes: MenuItem[];
  profilePicture: string | undefined;
  handleOpenRocketChat?: () => void;
}

export interface HeaderProp {
  isHeaderFull?: boolean;
}

const parseMenuRoute = (menuRoute: MenuItem, userProfile: UserProfileI) => {
  switch (userProfile?.codiceRuolo) {
    case userRoles.REG:
    case userRoles.DEG: {
      if (
        userProfile?.idProgramma &&
        menuRoute.path === '/area-amministrativa/programmi'
      ) {
        return {
          ...menuRoute,
          label: 'Programma',
          path: `/area-amministrativa/programmi/${userProfile.idProgramma}/info`,
        };
      }
      return menuRoute;
    }
    case userRoles.REGP:
    case userRoles.DEGP:
    case userRoles.VOL:
    case userRoles.FAC: {
      if (
        userProfile?.idProgetto &&
        menuRoute.path === '/area-amministrativa/progetti'
      ) {
        return {
          ...menuRoute,
          label: 'Progetto',
          path: `/area-amministrativa/progetti/${userProfile.idProgetto}/info`,
        };
      } else if (
        userProfile?.idProgramma &&
        menuRoute.path === '/area-amministrativa/programmi'
      ) {
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
  const { hasUserPermission } = useGuard();

  const notification = useAppSelector(selectUserNotificationToRead);

  const device = useAppSelector(selectDevice);

  useEffect(() => {
    if (isLogged) setMenuRoutes(getRoleMenuRoutes(userProfile));
  }, [isLogged, userProfile]);

  const handleOpenRocketChat = () => {
    if (hasUserPermission(['btn.chat'])) {
      dispatch(
        openModal({
          id: 'rocketChatModal',
        })
      );
    }
  };

  const componentProps = {
    notification: hasUserPermission(['list.ntf.nr']) ? notification : undefined,
    isLogged,
    user,
    userProfile,
    dispatch,
    isHeaderFull,
    menuRoutes,
    profilePicture: user?.immagineProfilo,
    handleOpenRocketChat,
  };

  return (
    <>
      {isEmpty(device) ? null : device.mediaIsDesktop ? (
        <HeaderDesktop {...componentProps} />
      ) : (
        <HeaderMobile {...componentProps} />
      )}
      <SwitchProfileModal isOnboarding={!isLogged} />
      {hasUserPermission(['btn.chat']) ? <RocketChatModal /> : null}
    </>
  );
};
export default memo(Header);

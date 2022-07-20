import { useMemo } from 'react';
import { RolePermissionI } from '../redux/features/roles/rolesSlice';
import {
  selectPermissions,
  selectLogged,
  selectUser,
} from '../redux/features/user/userSlice';
import { useAppSelector } from '../redux/hooks';

/**
 * This custom hook allow to verify user permissions in a certain area.
 * It return a function that accepts required permissions and check if
 * the user permissions (Saved in store at login) contains the first ones
 * When it will be clear how the user auth status will be managed the hook
 * can be improved
 */

const useGuard = () => {
  const isLogged = useAppSelector(selectLogged);
  const user = useAppSelector(selectUser);
  const permissions = useAppSelector(selectPermissions);

  const hasUserPermission = useMemo(
    () => (requiredPermissions: RolePermissionI[]) => {
      if (!isLogged || !user) return false;
      return requiredPermissions.every((p) => p === 'visible' || permissions.includes(p));
    },
    [user, isLogged, permissions]
  );

  return { hasUserPermission };
};

export default useGuard;

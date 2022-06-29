import React, { memo } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import useGuard from '../../../hooks/guard';
import { RolePermissionI } from '../../../redux/features/roles/rolesSlice';

/**
 * This Wrpper/HOC  allow to guard routes and
 * conditionally render components, maybe in some parts
 * of the code will be necessary to use the useGuard() hook
 * directly.
 */
interface ProtectedRouteI {
  visibleTo?: RolePermissionI[] | undefined;
  children?: JSX.Element;
  redirect?: string | undefined;
}

const ProtectedComponent = ({
  visibleTo,
  children,
  redirect,
}: ProtectedRouteI) => {
  const { hasUserPermission } = useGuard();

  /**
   * If "visibleTo" parameter is undefined the component
   * simply return the children
   * If "redirect" parameter is passed with a path, when permissions check fail
   * navigation to the redirect path is triggered (Guarding routes)
   */
  if (visibleTo && !hasUserPermission(visibleTo))
    return redirect ? <Navigate to={redirect} replace /> : null;

  return children ? children : <Outlet />;
};

export default memo(ProtectedComponent);

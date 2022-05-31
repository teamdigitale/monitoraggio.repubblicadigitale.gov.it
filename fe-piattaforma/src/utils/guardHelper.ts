// TODO define roles list
export type RolesI = ('admin' | 'facilitator' | 'guest')[];

// TODO bind user role instead of static
const userRole = 'admin';

export const guard = (Component: JSX.Element, roles: RolesI = []) => {
  if (roles.length && roles.includes(userRole)) {
    return Component;
  }
  return null;
};

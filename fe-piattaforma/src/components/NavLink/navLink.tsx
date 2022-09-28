import React from 'react';
import { NavLink as NavReactDom, To, useNavigate } from 'react-router-dom';
import clsx from 'clsx';

interface NavLinkI {
  onClick?: () => void;
  active?: boolean;
  to?: string;
  enteGestore?: boolean;
}

const NavLink: React.FC<NavLinkI> = ({
  onClick,
  children,
  active,
  to,
  enteGestore = false,
}) => {
  const navigate = useNavigate();

  return to && !onClick ? (
    <NavReactDom
      to={to as To}
      onKeyDown={() => navigate(to)}
      className={clsx(
        active ? 'nav-link active' : 'nav-link',
        !enteGestore && 'margin-for-border'
      )}
    >
      {children}
    </NavReactDom>
  ) : (
    <div
      tabIndex={0}
      role='button'
      onKeyDown={onClick}
      onClick={onClick}
      className={clsx('nav-link-custom', 'nav-link', !active && 'active')}
    >
      {children}
    </div>
  );
};

export default NavLink;

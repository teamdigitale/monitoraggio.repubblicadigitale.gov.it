import React from 'react';
import { NavLink as NavReactDom, To, useNavigate } from 'react-router-dom';
import clsx from 'clsx';
import { focusId } from '../../utils/common';

interface NavLinkI {
  onClick?: () => void;
  onKeyDown?: () => void;
  active?: boolean;
  to?: string;
  enteGestore?: boolean;
  role?: string;
}

const NavLink: React.FC<NavLinkI> = ({
  onClick,
  onKeyDown,
  children,
  active,
  to,
  enteGestore = false,
  role,
}) => {
  const navigate = useNavigate();

  return to && !onClick ? (
    <NavReactDom
      to={to as To}
      onKeyDown={(e) => {
        if (e.key === ' ') {
          e.preventDefault();
          if (onKeyDown) onKeyDown();
          navigate(to);
          focusId('content-tab');
        }
      }}
      className={clsx(
        active ? 'nav-link active' : 'nav-link',
        !enteGestore && 'margin-for-border'
      )}
      role={role || ''}
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

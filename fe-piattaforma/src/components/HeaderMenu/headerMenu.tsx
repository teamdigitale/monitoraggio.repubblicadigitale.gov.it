import clsx from 'clsx';
import {
  Button,
  DropdownMenu,
  DropdownToggle,
  Icon,
  UncontrolledDropdown,
} from 'design-react-kit';
import React, { memo, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { MenuItem } from '../../utils/common';
import useGuard from '../../hooks/guard';

interface HeaderMenuI {
  isHeaderFull: boolean;
  menuRoutes: MenuItem[];
}

const HeaderMenu: React.FC<HeaderMenuI> = (props) => {
  const { isHeaderFull, menuRoutes = [] } = props;
  const { hasUserPermission } = useGuard();

  const updateActiveTab = () => {
    const activeRoute = menuRoutes
      .filter(({ path }) => window.location.pathname.includes(path))
      .reduce((a, b) => (a.path.length > b.path.length ? a : b));
    if (activeRoute?.id === 'tab-home') {
      return window.location.pathname === activeRoute?.path
        ? activeRoute?.id
        : undefined;
    }
    return window.location.pathname.includes(activeRoute?.path)
      ? activeRoute?.id
      : undefined;
  };

  const [activeTab, setActiveTab] = useState(updateActiveTab());
  const { t } = useTranslation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [dropdownEventsOpen, setDropdownEventsOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setActiveTab(updateActiveTab());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [menuRoutes, window.location.pathname]);

  const navDropDown: React.FC<MenuItem> = (li) => {
    const toggle = (dropdown: string) => {
      dropdown.toLowerCase() !== 'area cittadini'
        ? setDropdownOpen((prevState) => !prevState)
        : setDropdownEventsOpen((prevState) => !prevState);
    };
    const onLinkClick = () => {
      setActiveTab(li.id || li.label);
      toggle(li.label);
    };

    return (
      <>
        <UncontrolledDropdown
          inNavbar
          isOpen={
            li.label.toLowerCase() === 'area cittadini'
              ? dropdownEventsOpen
              : dropdownOpen
          }
          toggle={() => toggle(li.label)}
        >
          <DropdownToggle
            nav
            caret
            className={clsx(
              'text-white',
              'font-weight-semibold',
              'pb-0',
              'mb-1'
            )}
            aria-expanded={
              li.label.toLowerCase() === 'area cittadini'
                ? dropdownEventsOpen
                : dropdownOpen
            }
          >
            {li.label}
            <Icon
              icon='it-expand'
              size='sm'
              color='white'
              aria-label='Espandi'
              aria-hidden
            />
          </DropdownToggle>
          <DropdownMenu role='menu' tag='ul'>
            {(li.subRoutes || [])
              .filter(({ visible = ['hidden'] }) => hasUserPermission(visible))
              .map((link: MenuItem, index) => (
                <li
                  key={index}
                  role='none'
                  className={clsx(
                    index === 0 ? 'px-4 mb-4 mt-2' : 'px-4 mb-4',
                    'pb-0'
                  )}
                >
                  <Link
                    to={link.path}
                    className='primary-color-b1 py-2'
                    role='menuitem'
                    onClick={() => onLinkClick()}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
          </DropdownMenu>
        </UncontrolledDropdown>
        <div
          className={clsx(
            activeTab === li.id && 'bg-white header-menu-container__tab-bar',
            activeTab !== li.id &&
              'bg-transparent header-menu-container__tab-bar'
          )}
        />
      </>
    );
  };

  return (
    <nav
      className={clsx(
        'header-menu-container',
        'container',
        'text-white',
        !isHeaderFull && 'd-flex align-items-baseline'
      )}
      aria-label={t('site_navigation_bar')}
      id='menu'
      tabIndex={-1}
    >
      <ul className='d-flex align-items-end mb-0' role='menu'>
        {menuRoutes
          .filter(({ visible = [] }) => hasUserPermission(visible))
          .map((li) => (
            <li
              key={li.path}
              className={clsx(
                'position-relative',
                li.subRoutes?.length && 'mr-2',
                'text-nowrap'
              )}
              role='none'
            >
              {li.subRoutes?.length ? (
                navDropDown(li)
              ) : (
                <>
                  <Link
                    id={li.id}
                    to={li.path}
                    onClick={() => setActiveTab(li.id)}
                    onKeyDown={(e) => {
                      if (e.key === ' ') {
                        setActiveTab(li.id);
                        navigate(li.path);
                      }
                    }}
                    className='h6 text-white mb-2'
                    role='menuitem'
                  >
                    {li.label}
                  </Link>
                  <div
                    className={clsx(
                      activeTab === li.id
                        ? 'bg-white header-menu-container__tab-bar mt-1'
                        : 'bg-transparent header-menu-container__tab-bar mt-1'
                    )}
                  />
                </>
              )}
            </li>
          ))}
      </ul>
      {!isHeaderFull && (
        <Button
          className='p-0 header-container__icon-container ml-2'
          aria-label='Ricerca barra di navigazione'
        >
          <Icon
            icon='it-search'
            color='white'
            size='xs'
            aria-label='Ricerca barra di navigazione'
            aria-hidden
          />
        </Button>
      )}
    </nav>
  );
};

export default memo(HeaderMenu);

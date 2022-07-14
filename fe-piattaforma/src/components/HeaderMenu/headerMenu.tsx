import clsx from 'clsx';
import {
  Button,
  DropdownMenu,
  DropdownToggle,
  Icon,
  UncontrolledDropdown,
} from 'design-react-kit';
import React, { memo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';

interface MenuItem {
  label: string;
  path: string;
  id?: string;
  subRoutes?: MenuItem[];
  visible?: boolean;
}

const newMenuItem = ({
  label,
  path,
  id = label,
  visible = true,
  subRoutes = [],
}: MenuItem) => ({
  label,
  path,
  id,
  visible,
  subRoutes,
});
const MenuList = [
  newMenuItem({
    label: 'Home',
    path: '/',
    id: 'tab-home',
  }),
  newMenuItem({
    label: 'Area amministrativa',
    path: '/area-amministrativa',
    id: 'tab-admin',
    //visible: // TODO implement condition based on role permission
    subRoutes: [
      newMenuItem({
        label: 'Programmi',
        path: '/area-amministrativa/programmi',
      }),
      newMenuItem({
        label: 'Progetti',
        path: '/area-amministrativa/progetti',
      }),
      newMenuItem({
        label: 'Enti',
        path: '/area-amministrativa/enti',
      }),
      newMenuItem({
        label: 'Utenti',
        path: '/area-amministrativa/utenti',
      }),
      newMenuItem({
        label: 'Questionari',
        path: '/area-amministrativa/questionari',
      }),
      newMenuItem({
        label: 'Servizi',
        path: '/area-amministrativa/servizi',
      }),
    ],
  }),
  newMenuItem({
    label: 'Area cittadini',
    path: '/area-cittadini',
    id: 'tab-citizen',
    //visible: // TODO implement condition based on role permission
  }),
  newMenuItem({
    label: 'Dashboard',
    path: '/dashboard',
    id: 'tab-dashboard',
    visible: process.env.NODE_ENV === 'development',
  }),
  newMenuItem({
    label: 'Community',
    path: '/community',
    id: 'tab-community',
    visible: process.env.NODE_ENV === 'development',
  }),
  newMenuItem({
    label: 'Bacheca digitale',
    path: '/bacheca-digitale',
    id: 'tab-bacheca-digitale',
    visible: process.env.NODE_ENV === 'development',
  }),
  newMenuItem({
    label: 'Documenti',
    path: '/documents',
    id: 'tab-documenti',
    visible: process.env.NODE_ENV === 'development',
  }),
];

interface HeaderMenuI {
  isHeaderFull: boolean;
}

const HeaderMenu: React.FC<HeaderMenuI> = (props) => {
  const { isHeaderFull } = props;
  const [activeTab, setActiveTab] = useState(
    MenuList.filter(({ path }) =>
      window.location.pathname.includes(path)
    ).reduce((a, b) => (a.path.length > b.path.length ? a : b)).id
  );
  const { t } = useTranslation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [dropdownEventsOpen, setDropdownEventsOpen] = useState(false);
  const navigate = useNavigate();

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
            {li.label}{' '}
            <Icon icon='it-expand' size='sm' color='white' aria-label='Apri' />
          </DropdownToggle>
          <DropdownMenu role='menu' tag='ul'>
            {(li.subRoutes || [])
              .filter(({ visible }) => visible)
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
        {MenuList?.length &&
          MenuList.filter(({ visible }) => visible).map((li) => (
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
                      activeTab === li.id &&
                        'bg-white header-menu-container__tab-bar mt-1',
                      activeTab !== li.id &&
                        'bg-transparent header-menu-container__tab-bar mt-1'
                    )}
                  />
                </>
              )}
            </li>
          ))}
      </ul>
      {!isHeaderFull && (
        <Button className='p-0' aria-label='bottone-ricerca-navbar'>
          <div className='header-container__icon-container ml-2'>
            <Icon
              icon='it-search'
              color='white'
              size='xs'
              aria-label='Ricerca barra di navigazione'
            />
          </div>
        </Button>
      )}
    </nav>
  );
};

export default memo(HeaderMenu);

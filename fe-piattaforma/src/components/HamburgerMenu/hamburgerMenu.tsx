import React, { useEffect, useState } from 'react';
import clsx from 'clsx';
import { Button, Collapse, Icon, LinkList } from 'design-react-kit';
import { Link, NavLink } from 'react-router-dom';
import './hamburgerMenu.scss';
import ClickOutside from '../../hoc/ClickOutside';
import { focusId, MenuItem } from '../../utils/common';
import useGuard from '../../hooks/guard';
import { defaultRedirectUrl } from '../../routes';

interface HBMenuProps {
  open: boolean;
  setOpen: (state: boolean) => void;
  menuRoutes: MenuItem[];
}

const HamburgerMenu: React.FC<HBMenuProps> = (props) => {
  const { open, setOpen, menuRoutes = [] } = props;
  const { hasUserPermission } = useGuard();

  const [collapseOpen, setCollapseOpen] = useState<string | null>(null);

  const toggleCollapse = (menuId: string) => {
    setCollapseOpen((prev) => (prev === menuId ? null : menuId));
  };

  useEffect(() => {
    const body = document.querySelector('body') as HTMLBodyElement;
    if (open) {
      focusId('hamburger');
      body.style.overflowY = 'hidden';
    } else {
      body.style.overflowY = 'unset';
    }
  }, [open]);

  const filteredMenuRoutes = menuRoutes.filter(({ visible = [] }) => hasUserPermission(visible)).some(route => route.path === '/area-dati') 
  ? menuRoutes.filter(route => route.path !== '/area-dati/report-dati')
  : menuRoutes;

  return (
    <ClickOutside callback={() => setOpen(false)}>
      <div className={clsx('hamburger_nav', 'mr-2', !open && 'invisible')}>
        <div className={`menuNav ${open ? 'showMenu' : ''}`}>
          <div
            className={clsx('px-0', 'py-0', 'd-flex', 'flex-column-reverse')}
            id='hamburger'
          >
            <ul>
              {filteredMenuRoutes
                .filter(({ visible = [] }) => hasUserPermission(visible))
                .map((link, index: number) => {
                  return link.subRoutes?.length ? (
                    <React.Fragment key={index}>
                      <li
                        className={clsx(
                          'right-icon',
                          'd-flex',
                          'justify-content-between',
                          'pr-3',
                          'flex-column'
                        )}
                        aria-expanded={collapseOpen === link.id}
                        id={link.id}
                      >
                        <Button
                          className={clsx(
                            'primary-color d-flex',
                            'd-flex',
                            'justify-content-between',
                            'align-items-center',
                            'anchor-button'
                          )}
                          onClick={() => toggleCollapse(link.id ?? '')}
                        >
                          {link.label}
                          <Icon
                            className='right'
                            icon='it-expand'
                            color='primary'
                            aria-hidden
                            aria-label='freccia destra'
                          />
                        </Button>
                      </li>
                      <li
                        className={clsx(
                          collapseOpen !== link.id && 'd-none',
                          'sublist-container'
                        )}
                      >
                        <Collapse isOpen={collapseOpen === link.id}>
                          <LinkList sublist>
                            {link.subRoutes
                              .filter(({ visible = ['hidden'] }) =>
                                hasUserPermission(visible)
                              )
                              .map((sub, index) => (
                                <li key={`sub-${index}`}>
                                  <Link
                                    className='ml-2 font-weight-normal'
                                    to={sub.path}
                                    onClick={() => {
                                      setOpen(false);
                                      setCollapseOpen(null);
                                    }}
                                  >
                                    {sub.label}
                                  </Link>
                                </li>
                              ))}
                          </LinkList>
                        </Collapse>
                      </li>
                    </React.Fragment>
                  ) : (
                    <li key={index} id={link.id}>
                      <Link
                        to={link.path}
                        onClick={() => {
                          setOpen(false);
                          setCollapseOpen(null);
                        }}
                      >
                        {link.label}
                      </Link>
                    </li>
                  );
                })}
              {hasUserPermission(['btn.gest.ruoli']) ||
              hasUserPermission(['btn.cat']) ||
              hasUserPermission(['btn.rprt']) ? (
                <li className='manage-profile-container'>
                  <div>
                    <div className='nav-divider primary-bg-a6'></div>
                    <div className='primary-color manage-profile mt-4'>
                      <Icon
                        className='mr-3'
                        icon='it-settings'
                        color='primary'
                        aria-label='Area gestionale'
                        aria-hidden
                      />
                      <strong>Area gestionale</strong>
                      <div className='pl-2'>
                        {hasUserPermission(['btn.gest.ruoli']) ? (
                          <Link
                            to='/gestione-ruoli'
                            className='primary-color manage-profile font-weight-normal'
                          >
                            Gestione ruoli
                          </Link>
                        ) : null}
                        {hasUserPermission(['view.conf.min']) ? (
                          <Link
                            to='/gestione-configurazioni'
                            className='primary-color manage-profile font-weight-normal'
                          >
                            Gestione configurazioni
                          </Link>
                        ) : null}
                        {hasUserPermission(['btn.cat']) ? (
                          <Link
                            to='/area-gestionale/gestione-categorie'
                            className='primary-color manage-profile font-weight-normal'
                          >
                            Gestione categorie
                          </Link>
                        ) : null}
                        {hasUserPermission(['btn.rprt']) ? (
                          <Link
                            to='/area-gestionale/gestione-segnalazioni'
                            className='primary-color manage-profile font-weight-normal'
                          >
                            Gestione segnalazioni
                          </Link>
                        ) : null}
                      </div>
                    </div>
                  </div>
                </li>
              ) : null}
            </ul>

            <div className={clsx('primary-bg-a6', 'p-4', 'pl-0', 'mb-3')}>
              <NavLink to={defaultRedirectUrl} replace>
                <div className='h3 text-white'>Facilita</div>
              </NavLink>
              <Button
                className={clsx('button-close-ham')}
                onClick={() => setOpen(false)}
                aria-hidden={!open}
              >
                <Icon
                  icon='it-close'
                  size=''
                  color='primary'
                  className={clsx(
                    'rounded-circle',
                    'mr-3',
                    'mt-2',
                    'close_nav',
                    'white',
                    !open && 'd-none'
                  )}
                  aria-label='chiudi'
                />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </ClickOutside>
  );
};

export default HamburgerMenu;
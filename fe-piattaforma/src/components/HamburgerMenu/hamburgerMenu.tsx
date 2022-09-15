/* TODO fix this file!! */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/anchor-is-valid */

import React, { useEffect, useState } from 'react';
import clsx from 'clsx';
import { Button, Collapse, Icon, LinkList } from 'design-react-kit';
import { Link } from 'react-router-dom';
import './hamburgerMenu.scss';
import ClickOutside from '../../hoc/ClickOutside';
import LogoSmall from '/public/assets/img/logo-mobile.png';
import { focusId, MenuItem } from '../../utils/common';
import useGuard from '../../hooks/guard';

interface HBMenuProps {
  open: boolean;
  setOpen: (state: boolean) => void;
  menuRoutes: MenuItem[];
}

const HamburgerMenu: React.FC<HBMenuProps> = (props) => {
  const { open, setOpen, menuRoutes = [] } = props;
  const { hasUserPermission } = useGuard();

  const [collapseOpen, setCollapseOpen] = useState(false);

  const expanded = {
    'aria-expanded': true,
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

  return (
    <ClickOutside callback={() => setOpen(false)}>
      <div className={clsx('hamburger_nav', 'mr-2', !open && 'invisible')}>
        <div className={`menuNav ${open ? 'showMenu' : ''}`}>
          <div
            className={clsx('px-0', 'py-0', 'd-flex', 'flex-column-reverse')}
            id='hamburger'
          >
            <ul>
              {menuRoutes
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
                        {...(collapseOpen ? expanded : {})}
                        id={link.id}
                      >
                        <Button
                          className={clsx(
                            'primary-color d-flex',
                            'd-flex',
                            'justify-content-between',
                            'anchor-button'
                          )}
                          onClick={() => setCollapseOpen(!collapseOpen)}
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
                          !collapseOpen && 'd-none',
                          'sublist-container'
                        )}
                      >
                        <Collapse isOpen={collapseOpen}>
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
                                      setCollapseOpen(false);
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
                          setCollapseOpen(false);
                        }}
                      >
                        {link.label}
                      </Link>
                    </li>
                  );
                })}
              {hasUserPermission(['btn.gest.ruoli']) ? (
                <li className='manage-profile-container'>
                  <div>
                    <div className='nav-divider primary-bg-a6'></div>
                    <Link
                      to='/gestione-ruoli'
                      className='primary-color manage-profile mt-4'
                    >
                      <Icon
                        className='mr-3'
                        icon='it-settings'
                        color='primary'
                        aria-label='icona ingranaggio'
                      />
                      Gestione Profili
                    </Link>
                  </div>
                </li>
              ) : null}
            </ul>

            <div className={clsx('primary-bg-a6', 'p-4', 'pl-0', 'mb-3')}>
              <img src={LogoSmall} alt='' />
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

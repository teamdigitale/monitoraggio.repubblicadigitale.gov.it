import React, { memo, useState } from 'react';
import clsx from 'clsx';
import { Link } from 'react-router-dom';
import {
  Badge,
  Button,
  Dropdown,
  DropdownMenu,
  DropdownToggle,
  Icon,
} from 'design-react-kit';
import LogoMobile from '/public/assets/img/logo-mobile.png';
import Bell from '/public/assets/img/campanella.png';

import { HeaderI } from '../header';
import { logout } from '../../../redux/features/user/userSlice';

import HamburgerMenu from '../../HamburgerMenu/hamburgerMenu';
import SwitchProfileModal from '../../Modals/SwitchProfileModal/switchProfileModal';
import { openModal } from '../../../redux/features/modal/modalSlice';

import AvatarInitials, {
  AvatarSizes,
  AvatarTextSizes,
} from '../../AvatarInitials/avatarInitials';
import { getRoleLabel } from '../../../utils/roleHelper';

const HeaderMobile: React.FC<HeaderI> = ({
  dispatch,
  user,
  isLogged,
  notification,
}) => {
  const [openUser, setOpenUser] = useState<boolean>(false);
  //const navigate = useNavigate();

  const userDropdownOptions = [
    { optionName: 'Il mio profilo', action: () => console.log('i tuoi dati') },
    {
      optionName: 'Cambia ruolo',
      action: () => dispatch(openModal({ id: 'switchProfileModal' })),
    },
    { optionName: 'Esci', action: () => dispatch(logout()) },
  ];

  const userDropDown = () => (
    <Dropdown
      className='p-0 header-container__top__user-dropdown mr-4'
      isOpen={openUser}
      toggle={() => setOpenUser(!openUser)}
      direction='down'
    >
      <DropdownToggle caret className='complementary-1-color-a1 shadow-none'>
        <div
          className={clsx(
            'd-flex',
            'flex-row',
            'align-items-center',
            'justify-content-start',
            'text.white',
            'primary-bg-b2'
          )}
        >
          <div>
            <AvatarInitials
              user={{ uName: user?.name, uSurname: user?.surname }}
              size={AvatarSizes.Small}
              font={AvatarTextSizes.Small}
            />
          </div>
          <div className='d-flex flex-row justify-content-start'>
            <p className='h6 text-wrap font-weight-light'>
              <em>{getRoleLabel(user?.role)}</em>
            </p>
          </div>
        </div>
      </DropdownToggle>
      <DropdownMenu role='menu' tag='ul'>
        {userDropdownOptions.map((item, index) => (
          <li key={index} role='none' className='px-4'>
            <Button
              className={clsx(
                'primary-color-b1',
                'py-2',
                'w-100',
                'd-flex',
                'justify-content-between'
              )}
              role='menuitem'
              onClick={item.action}
            >
              <span>{item.optionName}</span>
              <Icon
                icon='it-chevron-right'
                color='primary'
                size='sm'
                aria-label='Apri'
              />
            </Button>
          </li>
        ))}
      </DropdownMenu>
    </Dropdown>
  );

  const [isOpen, setIsOpen] = useState(false);

  return (
    <header
      className={clsx('header-container', isLogged && 'user-logged', 'w-100')}
    >
      <div
        className={clsx(
          'container',
          'header-container__top',
          'd-flex',
          'justify-content-between',
          'align-items-center',
          isLogged ? 'text.white primary-bg-b2' : '',
          'w-100'
        )}
      >
        {isLogged && <HamburgerMenu open={isOpen} setOpen={setIsOpen} />}

        <div
          className={clsx(
            'd-flex',
            'align-items-center',
            'justify-content-between',
            'my-0',
            'mobile-top-container',
            'w-100'
          )}
        >
          {isLogged ? (
            <>
              {userDropDown()}
              <div className='ml-auto pr-3'>
                <Icon
                  color='white'
                  icon={Bell}
                  size='sm'
                  aria-label='Menu utente'
                />
                {notification?.length ? (
                  <Badge>{notification.length}</Badge>
                ) : null}
              </div>
            </>
          ) : null}
        </div>
      </div>
      <div
        className={clsx(
          'header-container__main',
          'd-flex',
          'align-items-center',
          'justify-content-between',
          'w-100',
          'primary-bg'
        )}
      >
        <div className='container d-flex align-items-center'>
          <Button
            onClick={() => setIsOpen(true)}
            className='primary-bg-a6 px-2'
          >
            <Icon
              icon='it-burger'
              size='sm'
              color='white'
              aria-label='hamburger menu'
            />
          </Button>

          <div
            className={clsx(
              'flex-direction-row',
              'justify-content-between',
              'mr-auto',
              'py-3',
              'ml-2'
            )}
          >
            <Link to='/'>
              <img src={LogoMobile} alt='logo' />
            </Link>
          </div>
          {isLogged ? (
            <div className='header-container__main__search ml-auto'>
              <Button
                className={clsx(
                  'primary-color-b1',
                  'd-flex',
                  'flex-row',
                  'justify-content-center',
                  'align-items-center',
                  'p-0'
                )}
              >
                <div className='header-container__icon-container ml-2'>
                  <Icon
                    icon='it-search'
                    color='white'
                    size='sm'
                    aria-label='cerca'
                  />
                </div>
              </Button>
            </div>
          ) : null}
        </div>
      </div>
      <SwitchProfileModal
        profiles={[
          { name: ' "ente partner"', programName: 'Programma 1' },
          {
            name: ' "ente gestore di progetto"',
            programName: 'Programma 2',
          },
        ]}
        currentProfile=' "ente partner"'
      />
    </header>
  );
};

export default memo(HeaderMobile);

import React, { memo, useState } from 'react';
import clsx from 'clsx';
import { Link, useNavigate } from 'react-router-dom';
import {
  Button,
  Dropdown,
  DropdownMenu,
  DropdownToggle,
  Icon,
} from 'design-react-kit';
//import LogoMobile from '/public/assets/img/logo-mobile.png';
import LogoMobile from '/public/assets/img/logo_tmp3.png';
import Bell from '/public/assets/img/campanella.png';
import RocketChatIcon from '/public/assets/img/rocketchat.png';
import { HeaderI } from '../header';
import HamburgerMenu from '../../HamburgerMenu/hamburgerMenu';
import { openModal } from '../../../redux/features/modal/modalSlice';
import {
  AvatarSizes,
  AvatarTextSizes,
} from '../../Avatar/AvatarInitials/avatarInitials';
import { defaultRedirectUrl } from '../../../routes';

import UserAvatar from '../../Avatar/UserAvatar/UserAvatar';
import { LogoutRedirect } from '../../../redux/features/user/userThunk';
import useGuard from '../../../hooks/guard';
import NotificationsPreview from '../../NotificationsPreview/notificationsPreview';

const HeaderMobile: React.FC<HeaderI> = ({
  dispatch,
  user,
  userProfile,
  isLogged,
  notification,
  menuRoutes,
  profilePicture,
  handleOpenRocketChat = () => ({}),
  chatToRead,
}) => {
  const [openUser, setOpenUser] = useState<boolean>(false);
  const navigate = useNavigate();
  const { hasUserPermission } = useGuard();
  const userDropdownOptions = [
    { optionName: 'Il mio profilo', action: () => navigate('/area-personale') },
  ];

  const userDropDown = () => (
    <Dropdown
      className='p-0 header-container__top__user-dropdown mr-4 position-relativ'
      isOpen={openUser}
      toggle={() => setOpenUser(!openUser)}
      direction='down'
    >
      <div
        className={clsx(
          'header-container__top__user',
          'd-inline-flex',
          'align-items-center',
          'text.white',
          'primary-bg-b2',
          'header-panel-btn',
          'border-right',
          'complementary-1-color-a1',
          'shadow-none'
        )}
        id='dropdownMenuButtonMobile'
        role='button'
        aria-haspopup='true'
        data-toggle='dropdown'
        aria-expanded={openUser}
        onClick={() => setOpenUser(!openUser)}
        onKeyDown={(e) => {
          if (e.key === ' ') {
            setOpenUser(!openUser);
          }
        }}
        tabIndex={0}
      >
        <UserAvatar
          avatarImage={profilePicture}
          user={{ uSurname: user?.cognome, uName: user?.nome }}
          size={AvatarSizes.Small}
          font={AvatarTextSizes.Small}
          lightColor
        />
        <div
          className={clsx(
            'd-flex',
            'flex-row',
            'justify-content-start',
            'user-description'
          )}
        >
          <span className='h6 font-weight-light'>
            {/*<em>{getRoleLabel(userProfile?.codiceRuolo)}</em>*/}
            <em>{`${userProfile?.descrizioneRuolo}${
              userProfile?.nomeEnte ? ` ${userProfile.nomeEnte}` : ''
            }`}</em>
          </span>
        </div>
        <div className='ml-2'>
          <Icon
            size=''
            color='white'
            icon='it-expand'
            role='button'
            aria-label='Espandi menù'
          />
        </div>
      </div>
      <DropdownToggle caret className='d-none' aria-hidden={true} />
      <div className='position-relative w-100'>
        <DropdownMenu
          role='menu'
          className='header-container__dropdown'
          tag='ul'
        >
          {userDropdownOptions.map((item, index) => (
            <li
              key={index}
              role='none'
              className='px-4'
              onClick={() => setOpenUser(!openUser)}
            >
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
                  aria-label='Seleziona'
                  aria-hidden
                />
              </Button>
            </li>
          ))}
          {(user?.profiliUtente?.length || 0) > 1 ? (
            <li role='none' className='px-4'>
              <Button
                className={clsx(
                  'primary-color-b1',
                  'py-2',
                  'w-100',
                  'd-flex',
                  'justify-content-between'
                )}
                role='menuitem'
                onClick={() =>
                  dispatch(openModal({ id: 'switchProfileModal' }))
                }
              >
                <span>Cambia ruolo</span>
                <Icon
                  icon='it-chevron-right'
                  color='primary'
                  size='sm'
                  aria-label='Seleziona'
                  aria-hidden
                />
              </Button>
            </li>
          ) : null}
          {hasUserPermission(['btn.cont']) ? (
            <li role='none' className='px-4'>
              <Button
                className={clsx(
                  'primary-color-b1',
                  'py-2',
                  'w-100',
                  'd-flex',
                  'justify-content-between'
                )}
                role='menuitem'
                onClick={() => navigate('/area-personale/contenuti-pubblicati')}
              >
                Contenuti pubblicati
              </Button>
            </li>
          ) : null}
          {isLogged ? (
            <li role='none' className='px-4 header-container__divider'>
              <Button
                className={clsx(
                  'primary-color-b1',
                  'py-2',
                  'w-100',
                  'd-flex',
                  'justify-content-between'
                )}
                role='menuitem'
                onClick={() => {
                  dispatch(LogoutRedirect());
                }}
              >
                <span>Esci</span>
                <Icon
                  icon='it-external-link'
                  color='primary'
                  size='sm'
                  aria-label='Esci'
                  aria-hidden
                />
              </Button>
            </li>
          ) : null}
        </DropdownMenu>
      </div>
    </Dropdown>
  );
  const [isOpen, setIsOpen] = useState(false);
  const [notificationsIsOpen, setNotificationsIsOpen] = useState(false);
  return (
    <header
      className={clsx('header-container', isLogged && 'user-logged', 'w-100')}
    >
      {isLogged && (
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
          <HamburgerMenu
            open={isOpen}
            setOpen={setIsOpen}
            menuRoutes={menuRoutes}
          />
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
                <div className='d-flex align-items-center'>
                  {hasUserPermission(['btn.chat']) && handleOpenRocketChat ? (
                    <Button
                      onClick={handleOpenRocketChat}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          handleOpenRocketChat();
                        }
                      }}
                      className='mr-3 position-relative p-0'
                      aria-label={`${chatToRead} messaggi da leggere su Rocketchat`}
                    >
                      <Icon
                        color='white'
                        icon={RocketChatIcon}
                        size='sm'
                        aria-label='RocketChat'
                        aria-hidden
                      />
                      {chatToRead ? (
                        <span className='chat-notifications'>{chatToRead}</span>
                      ) : null}
                    </Button>
                  ) : null}
                  <Button
                    onClick={() => setNotificationsIsOpen(true)}
                    className='primary-bg-a6 px-2 bg-transparent position-relative'
                  >
                    <Icon
                      color='white'
                      icon={Bell}
                      size='sm'
                      aria-label='Notifiche'
                    />
                    {notification ? (
                      <span className='badge-notifications'>
                        {notification}
                      </span>
                    ) : null}
                  </Button>
                  <NotificationsPreview
                    open={notificationsIsOpen}
                    setOpen={setNotificationsIsOpen}
                    menuRoutes={menuRoutes}
                  />
                </div>
              </>
            ) : null}
          </div>
        </div>
      )}
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
          {isLogged && (
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
          )}
          <div
            className={clsx(
              'flex-direction-row',
              'justify-content-between',
              'mr-auto',
              'py-3',
              'ml-2'
            )}
          >
            <Link to={defaultRedirectUrl} replace>
              <img
                src={LogoMobile}
                alt='logo'
                style={{ width: 'auto', height: '74px' }}
              />
            </Link>
          </div>
          {isLogged ? (
            <div className='header-container__main__search ml-auto'>
              <div
                className={clsx(
                  'primary-color-b1',
                  'd-flex',
                  'flex-row',
                  'justify-content-center',
                  'align-items-center',
                  'ml-5'
                )}
                role='button'
                tabIndex={0}
                onClick={() => navigate('/home/cerca')}
                onKeyDown={(e) => {
                  if (e.key === ' ') {
                    e.preventDefault();
                    navigate('/home/cerca');
                  }
                }}
              >
                <div className='header-container__icon-container ml-2'>
                  <Icon
                    icon='it-search'
                    color='white'
                    size='sm'
                    aria-label='Cerca'
                  />
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
};
export default memo(HeaderMobile);

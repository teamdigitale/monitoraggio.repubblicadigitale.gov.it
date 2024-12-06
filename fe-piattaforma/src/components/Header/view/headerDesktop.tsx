import React, { memo, useState } from 'react';
import clsx from 'clsx';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  Button,
  Dropdown,
  DropdownMenu,
  DropdownToggle,
  Icon,
  LinkList,
} from 'design-react-kit';
//import Logo from '/public/assets/img/logo_tmp3.png';
import Bell from '/public/assets/img/campanella.png';
import RocketChatIcon from '/public/assets/img/rocketchat-2x.png';
import { useTranslation } from 'react-i18next';
import { HeaderI } from '../header';
import HeaderMenu from '../../HeaderMenu/headerMenu';
import { openModal } from '../../../redux/features/modal/modalSlice';
import {
  AvatarSizes,
  AvatarTextSizes,
} from '../../Avatar/AvatarInitials/avatarInitials';
import useGuard from '../../../hooks/guard';
import { defaultRedirectUrl } from '../../../routes';
import { NotificationsPreview } from '../../index';
import UserAvatar from '../../Avatar/UserAvatar/UserAvatar';
import { LogoutRedirect } from '../../../redux/features/user/userThunk';

const HeaderDesktop: React.FC<HeaderI> = ({
  isHeaderFull = true,
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
  //const languages = ['ITA', 'ENG'];

  //const [open, toggle] = useState(false);
  //const [language, setLanguage] = useState(languages[0]);
  const { t } = useTranslation();
  const [openUser, setOpenUser] = useState<boolean>(false);
  const navigate = useNavigate();
  const [notificationsIsOpen, setNotificationsIsOpen] = useState(false);
  const [openManagementArea, setOpenManagementArea] = useState<boolean>(false);

  const { hasUserPermission } = useGuard();

  const userDropdownOptions = [
    {
      optionName: 'Il mio profilo',
      action: () => navigate('/area-personale'),
    },
  ];

  const userDropDown = () => (
    <Dropdown
      className='p-0 header-container__top__user-dropdown position-relative'
      isOpen={openUser}
      toggle={() => setOpenUser(!openUser)}
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
          'shadow-none',
          'px-3'
        )}
        id='dropdownMenuButtonDesktop'
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
        />
        <div
          className={clsx(
            'd-flex',
            'flex-column',
            'align-items-start',
            'user-description'
          )}
        >
          <span className='h6 m-0 text-sans-serif'>
            {user?.cognome}&nbsp;{user?.nome}
          </span>
          <span className='h6 font-weight-light text-nowrap pr-1'>
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
            aria-hidden
          />
        </div>
      </div>
      <DropdownToggle caret className='d-none' aria-hidden={true} />
      <div className='position-relative w-100 link-list-wrapper'>
        <DropdownMenu
          role='menu'
          className='header-container__dropdown py-2'
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
                aria-label='Il mio profilo'
              >
                {item.optionName}
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
                onClick={() => {
                  navigate('/area-personale/contenuti-pubblicati');
                  setOpenUser(false);
                }}
              >
                Contenuti pubblicati
              </Button>
            </li>
          ) : null}
          <li role='none' className='px-4 header-container__divider'>
            <Button
              className={clsx(
                'primary-color-b1',
                'd-flex',
                'justify-content-between',
                'align-items-center',
                'w-100',
                'mt-2'
              )}
              role='menuitem'
              onClick={() => {
                dispatch(LogoutRedirect());
              }}
            >
              Esci
              <Icon
                icon='it-external-link'
                color='primary'
                size='sm'
                aria-label='Esci'
                aria-hidden
              />
            </Button>
          </li>
        </DropdownMenu>
      </div>
    </Dropdown>
  );

  const userDropDownAreaGestionale = () =>
    hasUserPermission(['btn.gest.ruoli']) ||
    hasUserPermission(['btn.cat']) ||
    hasUserPermission(['btn.rprt']) ? (
      <Dropdown
        className='p-0 header-container__top__user-dropdown'
        isOpen={openManagementArea}
        toggle={() => setOpenManagementArea(!openManagementArea)}
      >
        <DropdownToggle caret className='complementary-1-color-a1 shadow-none'>
          <div
            className={clsx(
              'header-container__top',
              'd-inline-flex',
              'align-items-center',
              'text.white',
              'primary-bg-b2',
              'header-panel-btn',
              'border-right',
              'border-left',
              'px-3'
            )}
          >
            <div className='d-flex flew-row align-items-center'>
              <Icon
                icon='it-settings'
                size='sm'
                color='white'
                aria-label='Gestione profili'
                aria-hidden
              />
              <h6
                className={clsx(
                  'm-0',
                  'ml-2',
                  'font-weight-light',
                  'text-nowrap'
                )}
              >
                Area gestionale
              </h6>
              <div className='ml-2'>
                <Icon
                  size=''
                  color='white'
                  icon='it-expand'
                  aria-label='Espandi'
                  aria-hidden
                />
              </div>
            </div>
          </div>
        </DropdownToggle>
        <DropdownMenu role='menu'>
          <LinkList role='list'>
            {hasUserPermission(['btn.gest.ruoli']) ? (
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
                  onClick={() => {
                    navigate('/gestione-ruoli');
                    setOpenManagementArea(false);
                  }}
                  aria-label='Gestione ruoli'
                >
                  <span> {t('role_management')}</span>
                </Button>
              </li>
            ) : null}
            {hasUserPermission(['btn.cat']) ? (
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
                  onClick={() => {
                    navigate('/area-gestionale/gestione-categorie');
                    setOpenManagementArea(false);
                  }}
                  aria-label='Gestione categorie'
                >
                  <span> Gestione categorie</span>
                </Button>
              </li>
            ) : null}
            {hasUserPermission(['btn.rprt']) ? (
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
                  onClick={() => {
                    navigate('/area-gestionale/gestione-segnalazioni');
                    setOpenManagementArea(false);
                  }}
                  aria-label='Gestione segnalazioni'
                >
                  <span> Gestione segnalazioni</span>
                </Button>
              </li>
            ) : null}
          </LinkList>
        </DropdownMenu>
      </Dropdown>
    ) : null;

  return (
    <header
      className={clsx('header-container', isLogged && 'user-logged', 'w-100')}
    >
      {isLogged && (
        <div
          className={clsx(
            'header-container__top',
            'd-flex',
            'justify-content-end',
            'text.white primary-bg-b2'
          )}
        >
          <div
            className={clsx(
              'container',
              'd-flex',
              'align-items-center',
              'justify-content-end',
              'my-0',
              'position-relative'
            )}
          >
            <a
              href='https://innovazione.gov.it/'
              target='_blank'
              rel='noreferrer'
              className={clsx('logo-url', 'text-white', 'position-absolute')}
              style={{
                left: '6px',
                fontSize: '0.8rem',
                textDecoration: 'none',
              }}
            >
              Dipartimento per la trasformazione digitale
            </a>
            {/* <div className='mr-auto'>
          {isHeaderFull ? (
            <p className='h6 m-0'>Repubblica Digitale</p>
          ) : (
            <a href='/'>
              <img src={LogoSmall} alt='Repubblica Digital' />
            </a>
          )}
        </div> */}
            {userDropDownAreaGestionale()}

            {isLogged ? (
              <>
                {userDropDown()}
                {hasUserPermission(['btn.chat']) && handleOpenRocketChat ? (
                  <div className='ml-4'>
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
                  </div>
                ) : null}
                {hasUserPermission(['list.ntf.nr']) ? (
                  <div className='ml-4'>
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
                ) : null}
              </>
            ) : null}
          </div>
        </div>
      )}
      {isHeaderFull && (
        <div
          className={clsx(
            'header-container__main',
            'd-flex',
            'align-items-center',
            'w-100',
            'primary-bg'
          )}
        >
          <div className='container d-flex align-items-center'>
            <div
              className={clsx(
                'header-container__main__logo',
                'mr-auto',
                'pt-3'
              )}
            >
              <NavLink to={defaultRedirectUrl} replace className='anchor-reset'>
                {/*<img
                  src={Logo}
                  alt='logo'
                  style={{width: 'auto', height: '74px'}}
                />*/}
                <div className='h3 text-white m-0'>Facilita</div>
                <div className='text-white m-0'>
                  La piattaforma dei servizi di facilitazione digitale
                </div>
              </NavLink>
            </div>
            {/* <div
              className={clsx(
                'header-container__main__social',
                'd-inline-flex',
                'align-items-center'
              )}
            >
              <span className='text-white mr-3'>Seguici su: </span>
              <Icon icon='it-github' size='sm' color='white' className='mx-2' />
              <Icon
                icon='it-twitter'
                size='sm'
                color='white'
                className='ml-1 mr-2'
              />
              <Icon
                icon='it-facebook'
                color='white'
                size='sm'
                className='ml-1 mr-2'
              />
            </div> */}
            {isLogged ? (
              <div className='header-container__main__search ml-auto'>
                {/* <SearchBox onClick={(v) => console.log('output:', v)} /> */}
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
                  <span className='mr-2 text-white font-weight-light'>
                    Cerca
                  </span>
                  <div className='header-container__icon-container bg-white ml-2'>
                    <Icon
                      icon='it-search'
                      color='primary'
                      size='sm'
                      aria-label='Cerca'
                      aria-hidden
                    />
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      )}
      {isLogged ? (
        <div className='header-container__nav primary-bg pt-2'>
          <HeaderMenu isHeaderFull={isHeaderFull} menuRoutes={menuRoutes} />
        </div>
      ) : null}
    </header>
  );
};

export default memo(HeaderDesktop);

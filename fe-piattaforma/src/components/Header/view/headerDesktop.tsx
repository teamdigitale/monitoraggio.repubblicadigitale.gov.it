import React, { memo, useState } from 'react';
import clsx from 'clsx';
import { Link, useNavigate } from 'react-router-dom';
import {
  Badge,
  Button,
  Dropdown,
  DropdownMenu,
  DropdownToggle,
  Icon,
  LinkList,
  LinkListItem,
} from 'design-react-kit';
import Logo from '/public/assets/img/logo.png';
//import LogoSmall from '/public/assets/img/logo-small.png';
import Bell from '/public/assets/img/campanella.png';
import { useTranslation } from 'react-i18next';
import { HeaderI } from '../header';
import { logout } from '../../../redux/features/user/userSlice';
import HeaderMenu from '../../HeaderMenu/headerMenu';
import { openModal } from '../../../redux/features/modal/modalSlice';
import {
  AvatarSizes,
  AvatarTextSizes,
} from '../../Avatar/AvatarInitials/avatarInitials';
import useGuard from '../../../hooks/guard';
import { defaultRedirectUrl } from '../../../routes';
import UserAvatar from '../../Avatar/UserAvatar/UserAvatar';

const HeaderDesktop: React.FC<HeaderI> = ({
  isHeaderFull = true,
  dispatch,
  user,
  userProfile,
  isLogged,
  notification,
  menuRoutes,
  profilePicture,
}) => {
  //const languages = ['ITA', 'ENG'];

  //const [open, toggle] = useState(false);
  //const [language, setLanguage] = useState(languages[0]);
  const { t } = useTranslation();
  const [openUser, setOpenUser] = useState<boolean>(false);
  const navigate = useNavigate();

  const { hasUserPermission } = useGuard();

  const userDropdownOptions = [
    {
      optionName: 'Il mio profilo',
      action: () => navigate('/area-personale'),
    },
  ];

  const userDropDown = () => (
    <Dropdown
      className='p-0 header-container__top__user-dropdown mr-4'
      isOpen={openUser}
      toggle={() => setOpenUser(!openUser)}
    >
      <DropdownToggle caret className='complementary-1-color-a1 shadow-none'>
        <div
          className={clsx(
            'header-container__top__user',
            'd-inline-flex',
            'align-items-center',
            'text.white',
            'primary-bg-b2',
            'header-panel-btn',
            'border-right'
          )}
        >
          <div>
            <UserAvatar
              avatarImage={profilePicture}
              user={{ uSurname: user?.cognome, uName: user?.nome }}
              size={AvatarSizes.Small}
              font={AvatarTextSizes.Small}
            />
          </div>
          <div className='d-flex flex-column align-items-start'>
            <h6 className='m-0 text-sans-serif'>
              {user?.cognome}&nbsp;{user?.nome}
            </h6>
            <h6 className='font-weight-light text-nowrap'>
              {/*<em>{getRoleLabel(userProfile?.codiceRuolo)}</em>*/}
              <em>{`${userProfile?.descrizioneRuolo}${
                userProfile?.nomeEnte ? ` ${userProfile.nomeEnte}` : ''
              }`}</em>
            </h6>
          </div>
          <div className='ml-2'>
            <Icon size='' color='white' icon='it-expand' />
          </div>
        </div>
      </DropdownToggle>
      <DropdownMenu role='menu' tag='ul'>
        <LinkList role='none'>
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
                Cambia ruolo
              </Button>
            </li>
          ) : null}
          <LinkListItem divider role='menuitem' aria-hidden={true} />
          <li role='none' className='px-4'>
            <Button
              className={clsx(
                'primary-color-b1',
                'd-flex',
                'justify-content-between',
                'align-items-center',
                'w-100'
              )}
              role='menuitem'
              onClick={() => dispatch(logout())}
            >
              <strong>Esci</strong>
              <Icon
                icon='it-external-link'
                color='primary'
                size='sm'
                aria-label='esci'
              />
            </Button>
          </li>
        </LinkList>
      </DropdownMenu>
    </Dropdown>
  );

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
              'my-0'
            )}
          >
            {/* <div className='mr-auto'>
          {isHeaderFull ? (
            <p className='h6 m-0'>Repubblica Digitale</p>
          ) : (
            <a href='/'>
              <img src={LogoSmall} alt='logo' />
            </a>
          )}
        </div> */}

            {hasUserPermission(['btn.gest.ruoli']) ? (
              <div
                className={clsx(
                  'mr-2',
                  'px-3',
                  'border-left',
                  'border-right',
                  'd-inline-flex',
                  'flex-row',
                  'align-items-center',
                  'primary-bg-b2',
                  'header-panel-btn'
                )}
              >
                <a
                  href='/gestione-ruoli'
                  className='text-decoration-none text-white'
                >
                  <div className='d-flex flew-row'>
                    <Icon
                      icon='it-settings'
                      size='sm'
                      color='white'
                      aria-label='Gestione profili'
                    />
                    <h6
                      className={clsx(
                        'm-0',
                        'ml-2',
                        'font-weight-light',
                        'text-nowrap'
                      )}
                    >
                      {t('role_management')}
                    </h6>
                  </div>
                </a>
              </div>
            ) : null}

            {/* <div>
            <Dropdown
              className={clsx(
                'mr-3',
                'd-flex',
                'header-panel-btn-small',
                'border-right',
                'header-panel-btn'
              )}
              isOpen={open}
              toggle={() => toggle(!open)}
            >
              <DropdownToggle
                caret
                className={clsx(
                  'primary-bg-b2',
                  'my-auto',
                  'complementary-1-color-a1',
                  'border-0 shadow-none'
                )}
                size='xs'
              >
                {language}
                <Icon
                  icon='it-expand'
                  size='sm'
                  className='color-white ml-2'
                  color='white'
                  aria-label='Apri'
                />
              </DropdownToggle>
              <DropdownMenu role='menu' tag='ul'>
                {languages.map((lang, i) => (
                  <li key={i} role='none' className='px-4'>
                    <Button
                      className={clsx(
                        'primary-color-b1',
                        'px-0',
                        'py-2',
                        'w-100',
                        'd-flex justify-content-start'
                      )}
                      role='menuitem'
                      onClick={() => setLanguage(lang)}
                    >
                      {lang}
                    </Button>
                  </li>
                ))}
              </DropdownMenu>
            </Dropdown>
          </div> */}

            {
              isLogged ? (
                <>
                  {userDropDown()}
                  <div className='mx-4 pr-2'>
                    {/* <Icon
                    color='white'
                    icon='campanella'
                    size='sm'
                    aria-label='Menu utente'
                    focusable={false}
                  /> */}
                    <a href='/notifiche'>
                      <Icon
                        color='white'
                        icon={Bell}
                        size='sm'
                        aria-label='Notifiche'
                      />
                    </a>
                    {notification?.length ? (
                      <Badge>{notification.length}</Badge>
                    ) : null}
                  </div>
                </>
              ) : null
              // <div className='d-inline-flex align-items-center px-4'>
              //   <h6 className='m-0'>ITA</h6>
              //   <Icon
              //     color='white'
              //     icon='it-expand'
              //     size='sm'
              //     aria-label='Selezione lingua'
              //   />
              // </div>
            }
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
              <Link to={defaultRedirectUrl} replace>
                <img src={Logo} alt='logo' />
              </Link>
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
                <Button
                  className={clsx(
                    'primary-color-b1',
                    'd-flex',
                    'flex-row',
                    'justify-content-center',
                    'align-items-center',
                    'ml-5'
                  )}
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
                    />
                  </div>
                </Button>
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

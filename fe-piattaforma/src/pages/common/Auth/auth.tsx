import React, { memo, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import clsx from 'clsx';
import { useNavigate, useParams } from 'react-router-dom';
import LogoScrittaBlu from '/public/assets/img/logo-scritta-blu-x2.png';
import { Footer, Input, Loader } from '../../../components';
import { Button, Card, Icon } from 'design-react-kit';
import Authicon from '/public/assets/img/auth-box-icon.png';
import { useAppSelector } from '../../../redux/hooks';
import {
  selectDevice,
  selectLoader,
  showLoader,
} from '../../../redux/features/app/appSlice';
import { CreateUserContext } from '../../../redux/features/user/userThunk';
import withFormHandler, {
  withFormHandlerProps,
} from '../../../hoc/withFormHandler';
import { newForm, newFormField } from '../../../utils/formHelper';
import { getUrlParameter } from '../../../utils/common';
import { GetSPIDToken } from '../../../redux/features/auth/authThunk';
import { setSessionValues } from '../../../utils/sessionHelper';

const COGNITO_HREF = `${process?.env?.REACT_APP_COGNITO_BASE_URL}oauth2/authorize?client_id=${process?.env?.REACT_APP_COGNITO_CLIENT_ID}&redirect_uri=${process?.env?.REACT_APP_COGNITO_FE_REDIRECT_URL}&scope=openid&response_type=code`;

export const isActiveProvisionalLogin = false;

const Auth: React.FC<withFormHandlerProps> = ({
  form = {},
  onInputChange = () => ({}),
}) => {
  const device = useAppSelector(selectDevice);
  const loader = useAppSelector(selectLoader);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token } = useParams();

  const cognitoRedirect = () => {
    dispatch(showLoader());
    window.location.replace(COGNITO_HREF);
  };

  const createContext = async () => {
    const validUser = await dispatch(
      CreateUserContext(form.mockUser?.value?.toString())
    );
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    if (validUser === true) {
      navigate('/onboarding');
    } else {
      console.log('manage context error', validUser, validUser);
      navigate(
        `/errore${
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          validUser?.response?.data?.errorCode
            ? // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore
              `/${validUser?.response?.data?.errorCode}`
            : ''
        }`,
        { replace: true }
      );
    }
  };

  const getToken = async (preAuthCode: string) => {
    if (preAuthCode) {
      const res = await dispatch(GetSPIDToken(preAuthCode));
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      if (res) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        setSessionValues('auth', { ...res, preAuthCode });
        createContext();
      } else {
        cognitoRedirect();
      }
    }
  };

  useEffect(() => {
    if (!isActiveProvisionalLogin && token) {
      getToken(token);
    } else if (!isActiveProvisionalLogin && window.location.search) {
      const preAuthCode = getUrlParameter('code');
      if (preAuthCode) {
        getToken(preAuthCode);
      }
    } else if (!isActiveProvisionalLogin) {
      cognitoRedirect();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isActiveProvisionalLogin, window.location, token]);

  const handleFakeLogin = () => {
    if (isActiveProvisionalLogin && form.mockUser?.value) {
      createContext();
    }
  };

  if (!isActiveProvisionalLogin) {
    return <Loader />;
  }

  return (
    <>
      {loader.isLoading && <Loader />}
      <div className='mt-0 py-3 primary-bg '>
        <div className='mr-auto'>
          <p className={clsx('h6', 'm-0', 'pl-5', 'text-white')}>
            Repubblica Digitale
          </p>
        </div>
      </div>

      <main
        className={clsx(
          'container',
          'main-container',
          'main-container__content-container'
        )}
        id='main'
        tabIndex={-1}
      >
        <div className={clsx('auth-container')}>
          <div className={clsx('w-100', 'text-center', 'mb-5')}>
            <img
              src={LogoScrittaBlu}
              alt='Repubblica Digitale'
              className='auth-container__logo'
            />
          </div>
          <div
            className={clsx(
              'auth-container__box',
              'w-100',
              'row',
              'justify-content-center',
              'pt-2'
            )}
          >
            <div className='col-10'>
              <Card
                spacing
                className={clsx(
                  'card-bg',
                  'text-center',
                  'd-flex',
                  'align-items-center'
                )}
              >
                <div
                  className={clsx(
                    'rounded-circle',
                    'primary-bg-a7',
                    'auth-container__top-icon-container',
                    'd-flex',
                    'align-items-center',
                    'justify-content-center',
                    'mb-3'
                  )}
                >
                  <Icon
                    icon={Authicon}
                    color='white'
                    size='sm'
                    aria-label='Autenticazione'
                  />
                </div>
                {device.mediaIsPhone || device.mediaIsTablet ? (
                  <h1
                    className={clsx(
                      'h3',
                      'font-weight-semibold',
                      'text-secondary',
                      'text-center',
                      'text-nowrap'
                    )}
                  >
                    Accedi con la tua <br /> identità digitale
                  </h1>
                ) : (
                  <h1
                    className={clsx(
                      'h3',
                      'font-weight-semibold',
                      'text-secondary'
                    )}
                  >
                    Accedi con la tua identità digitale
                  </h1>
                )}
                {device.mediaIsPhone || device.mediaIsTablet ? (
                  <p
                    className={clsx(
                      'font-weight-semibold',
                      'text-secondary',
                      'mb-0',
                      'mt-3',
                      'text-center',
                      'text-nowrap'
                    )}
                  >
                    Utilizza una delle seguenti modalità <br /> per accedere al
                    sito e ai suoi servizi
                  </p>
                ) : (
                  <p className='font-weight-semibold text-secondary mb-0'>
                    Utilizza una delle seguenti modalità per accedere al sito e
                    ai suoi servizi
                  </p>
                )}
                <div
                  className={clsx(
                    'auth-container__box__button-group',
                    'd-flex',
                    'flex-column',
                    'mt-5',
                    'w-100',
                    'mx-3'
                  )}
                >
                  <Button
                    className={clsx(
                      'mx-auto',
                      'mb-3',
                      'w-100',
                      'd-flex',
                      'align-items-center',
                      'justify-content-center',
                      'mx-auto',
                      device.mediaIsPhone ? 'btn-xs px-4' : 'btn-sm'
                    )}
                    color='primary'
                    onClick={cognitoRedirect}
                    size='xs'
                  >
                    <span
                      className={clsx(
                        'rounded-circle',
                        'd-flex',
                        'align-items-center',
                        'justify-content-center',
                        'bg-white',
                        'mr-1'
                      )}
                    >
                      <Icon
                        size=''
                        icon='it-user'
                        color='primary'
                        padding
                        aria-label='Utente'
                      />
                    </span>
                    <span
                      className={clsx(
                        'ml-2',
                        device.mediaIsPhone && 'text-nowrap'
                      )}
                    >
                      Entra con SPID
                    </span>
                  </Button>
                  <Button
                    className={clsx(
                      'mx-auto',
                      'w-100',
                      device.mediaIsPhone ? 'btn-xs px-4' : 'btn-sm',
                      'mb-3'
                    )}
                    color='primary'
                    onClick={cognitoRedirect}
                  >
                    Entra con CIE
                  </Button>
                </div>
                {isActiveProvisionalLogin ? (
                  <div className='my-5'>
                    <hr />
                    <p className='h4 py-2'>Provisional Login</p>
                    {/* TODO Remove next block, it's for dev purpose only*/}
                    <Input
                      {...form.mockUser}
                      label='Codice fiscale'
                      onInputChange={onInputChange}
                    />
                    <Button
                      className={clsx(
                        'mx-auto',
                        'w-100',
                        device.mediaIsPhone ? 'btn-xs px-4' : 'btn-sm'
                      )}
                      color='secondary'
                      onClick={handleFakeLogin}
                    >
                      Provisional Login
                    </Button>
                  </div>
                ) : null}
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

// TODO for DEV purpose only, to remove!
const form = newForm(
  isActiveProvisionalLogin
    ? [
        newFormField({
          field: 'mockUser',
        }),
      ]
    : []
);
export default memo(withFormHandler({ form }, Auth));

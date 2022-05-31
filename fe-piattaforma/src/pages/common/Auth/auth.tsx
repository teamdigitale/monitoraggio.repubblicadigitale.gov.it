import React, { memo } from 'react';
import LogoScrittaBlu from '/public/assets/img/LogoScrittaBlu.png';
import { Footer } from '../../../components';
import clsx from 'clsx';
import { Button, Card, Icon } from 'design-react-kit';
import Authicon from '/public/assets/img/auth-box-icon.png';

const Auth = () => {
  const handleClick = () => {
    console.log('clicked');
  };

  return (
    <>
      <div className='mt-0 py-3 primary-bg '>
        <div className='mr-auto'>
          <p className='h6 m-0 pl-5 text-white'>Repubblica Digitale</p>
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
            <img src={LogoScrittaBlu} alt='' className='auth-container__logo' />
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
                  'text-center, d-flex, align-items-center'
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
                <h1 className='h3 font-weight-semibold text-secondary'>
                  Accedi con la tua identità digitale
                </h1>
                <p className='font-weight-semibold text-secondary mb-0'>
                  Utilizza una delle seguenti modalità per accedere al sito e ai
                  suoi servizi
                </p>
                <div
                  className={clsx(
                    'auth-container__box__button-group',
                    'd-flex',
                    'flex-column',
                    'mt-5',
                    'w-100'
                  )}
                >
                  <Button
                    className={clsx(
                      'mx-auto',
                      'mb-3',
                      'w-100',
                      'd-flex, align-items-center',
                      'btn-sm'
                    )}
                    color='primary'
                    onClick={handleClick}
                  >
                    <div className='d-flex align-items-center justify-content-center mx-auto'>
                      <div
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
                      </div>
                      <span className='ml-2'>Entra con SPID</span>
                    </div>
                  </Button>
                  <Button
                    className='mx-auto w-100 btn-sm'
                    color='primary'
                    onClick={handleClick}
                  >
                    Entra con CIE
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default memo(Auth);

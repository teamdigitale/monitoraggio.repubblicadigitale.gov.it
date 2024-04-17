import clsx from 'clsx';
import React, { useEffect, useState } from 'react';
import { Card, Icon } from 'design-react-kit';
import { useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import Authicon from '/public/assets/img/auth-box-icon.png';
import { Footer } from '../../../components';
import { selectDevice } from '../../../redux/features/app/appSlice';
import { useAppSelector } from '../../../redux/hooks';
import {
  defaultErrorMessage,
  getErrorMessage,
} from '../../../utils/notifictionHelper';
import { LogoutRedirect } from '../../../redux/features/user/userThunk';

const ErrorPage = () => {
  const [errorMessage, setErrorMessage] = useState(defaultErrorMessage);
  const [errorTitle, setErrorTitle] = useState<string>();
  const device = useAppSelector(selectDevice);
  const dispatch = useDispatch();
  const { errorCode = 'empty' } = useParams();

  useEffect(() => {
    setTimeout(() => {
      dispatch(LogoutRedirect());
    }, 55000);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleGetErrorMessage = async () => {
    const error = await getErrorMessage({ errorCode });
    if (error?.message) setErrorMessage(error.message);
    if(error?.title) setErrorTitle(error.title);
  };

  useEffect(() => {
    handleGetErrorMessage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [errorCode]);

  return (
    <div>
      <div className='mt-0 py-3 primary-bg '>
        <a
          href='https://innovazione.gov.it/'
          target='_blank'
          rel='noreferrer'
          style={{ textDecoration: 'none' }}
        >
          <div className='mr-auto'>
            <p className={clsx('h6', 'm-0', 'pl-5', 'text-white')}>
              Dipartimento per la trasformazione digitale
            </p>
          </div>
        </a>
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
          <div className={clsx('w-100', 'text-center', 'mb-5', 'text-primary')}>
            <p className='h1' style={{ marginBottom: '0' }}>
              Facilita
            </p>
            <p>La piattaforma dei servizi di facilitazione digitale</p>
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
                <div className= {clsx(
                    'h2',
                    'font-weight-semibold',
                    'text-primary',
                    'text-center text-wrap'
                )}>
                  {errorTitle}
                </div>
                <h5
                  className={clsx(
                    'h5',
                    'font-weight-semibold',
                    'text-secondary',
                    (device.mediaIsPhone || device.mediaIsTablet) &&
                      'text-center text-wrap'
                  )}
                >
                  {errorMessage}
                </h5>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ErrorPage;

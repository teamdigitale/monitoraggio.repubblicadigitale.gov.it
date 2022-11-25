import React, { memo } from 'react';
import clsx from 'clsx';
import { selectDevice } from '../../redux/features/app/appSlice';
import { useAppSelector } from '../../redux/hooks';
import Logo1 from '/public/assets/img/logo-rd-white.png';
import Logo2 from '/public/assets/img/mitd-logo_tmp.png';
import Logo3 from '/public/assets/img/logo-dpgscu.png';
import Logo4 from '/public/assets/img/logo-eu-pnrr-white.png';
import { Icon } from 'design-react-kit';

const Footer: React.FC = () => {
  const device = useAppSelector(selectDevice);

  return (
    <footer className={clsx('footer-container', 'w-100')}>
      <div
        className={clsx(
          'container',
          'footer-content',
          'd-flex',
          'flex-row',
          'align-items-center',
          'py-3',
          'flex-wrap'
        )}
      >
        <div
          className={clsx(
            'footer-content__partner',
            'd-flex',
            'flex-row',
            'flex-grow-1',
            'pb-4'
          )}
        >
          <div
            className={clsx(
              'd-flex',
              'flex-row',
              'w-100',
              device.mediaIsDesktop ? 'flex-nowrap' : 'flex-wrap'
            )}
          >
            <a
              aria-label='repubblica digitale'
              href='https://repubblicadigitale.innovazione.gov.it/it/'
              target='_blank'
              rel='noreferrer'
            >
              <img alt='repubblica digitale' src={Logo1} />
            </a>
            <a
              aria-label='dipartimento per la trasformazione digitale'
              href='https://innovazione.gov.it/'
              target='_blank'
              rel='noreferrer'
            >
              <img
                alt='dipartimento per la trasformazione digitale'
                src={Logo2}
              />
            </a>
            <a
              aria-label='servizio civile digitale'
              href='https://www.scelgoilserviziocivile.gov.it/cerca-il-progetto/servizio-civile-digitale/'
              target='_blank'
              rel='noreferrer'
            >
              <img alt='servizio civile digitale' src={Logo3} />
            </a>
            <a
              aria-label="finanziato dall'unione europea"
              href='https://ec.europa.eu/info/index_it'
              target='_blank'
              rel='noreferrer'
            >
              <img alt="finanziato dall'unione europea" src={Logo4} />
            </a>
          </div>
        </div>
        <div className={clsx('footer-content__assistenza', 'w-100', 'py-4')}>
          <div className='h6'>Assistenza</div>
          <p>
            Per richieste di supporto scrivi a<br />
            <a href='mailto:supporto-facilita@repubblicadigitale.gov.it'>
              supporto-facilita@repubblicadigitale.gov.it
            </a>
          </p>
        </div>
      </div>
      <div className={clsx('sub-footer-container', 'w-100', 'py-3')}>
        <div
          className={clsx(
            'container',
            'w-100',
            'd-flex',
            'position-relative',
            device.mediaIsPhone ? 'flex-wrap' : 'flex-nowrap'
          )}
        >
          <a
            href='/legal#note'
            target='_blank'
            className='mr-lg-5 mr-md-3 mr-2'
          >
            Note legali
          </a>
          <a
            href='/legal#cookie'
            target='_blank'
            className='mr-lg-5 mr-md-3 mr-2'
          >
            Cookie policy
          </a>
          <a
            href='/dichiarazione-accessibilita'
            target='_blank'
            className='mr-lg-5 mr-md-3 mr-2'
          >
            Dichiarazione d&apos;accessibilità
            <Icon
              color='white'
              icon='it-external-link'
              size='xs'
              aria-label='link esterno'
              aria-hidden
              className='ml-1'
            />
          </a>
          <a
            href='https://italiadomani.gov.it/it/home.html'
            rel='noreferrer'
            target='_blank'
            className={clsx(
              'mr-lg-5 mr-md-3 mr-2',
              device.mediaIsDesktop ? 'position-absolute' : 'position-relative'
            )}
            style={{ right: device.mediaIsDesktop ? '0' : '' }}
          >
            Italia domani
            <Icon
              color='white'
              icon='it-external-link'
              size='xs'
              aria-label='link esterno'
              aria-hidden
              className='ml-1'
            />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default memo(Footer);

import React, { memo } from 'react';
import { Icon } from 'design-react-kit';
import clsx from 'clsx';
import Mitd from '/public/assets/img/mtid-mobile.png';
import Logo from '/public/assets/img/logo-rep-mob.png';
import { useTranslation } from 'react-i18next';

const FooterMobile: React.FC = () => {
  const { t } = useTranslation();

  return (
    <footer className='footer-container'>
      <div className='container'>
        <div className='mb-3 pt-4 container'>
          <p className='footer-container__small-text mb-4'>
            {t('designed_by')}
          </p>
          <div className='mr-auto mt-3 mb-2'>
            <img src={Logo} alt='logo' />
          </div>
          <p className='h5 mt-4 font-weight-bold'>
            {
              "Ministero per l'innovazione tecnologica e la transizione digitale"
            }
          </p>
          <p className='footer-container__xs-text mt-4 font-weight-bold'>
            Presidenza del Consiglio dei Ministri
          </p>

          <div className='mb-3'>
            <div className='mr-auto'>
              <img src={Mitd} alt='mitd' />
            </div>
          </div>

          <div
            className={clsx(
              'footer-container__assistance',
              'border-top',
              'pt-4',
              'mt-5'
            )}
          >
            <p
              className={clsx(
                'h6',
                'text-uppercase',
                'mb-md-0',
                'mb-lg-3',
                'mt-2'
              )}
            >
              {t('assistance_contacts')}
            </p>
            <p className='footer-container__assistance__text'>
              {t('call_us_for_any_question')}
            </p>
            <p
              className={clsx(
                'd-inline-flex',
                'align-items-center',
                'mt-3',
                'mb-5'
              )}
            >
              <Icon
                className='mr-3'
                color='white'
                icon='it-telephone'
                size='sm'
                aria-label='Telefono'
              />
              <span className='font-weight-bold'>800 123 456</span>
            </p>
          </div>
        </div>
      </div>

      <div className='analogue-1-bg-a12'>
        <div className={clsx('text-center', 'col-12', 'py-3', 'container')}>
          <p
            className={clsx(
              'text-left',
              'text-white',
              'footer-container__bottom-text',
              'container'
            )}
          >
            Ut pretium sem id blandit tincidunt. Proin accumsan vulputate
            turpis, eu elementum lectus sagittis in:
          </p>
        </div>
      </div>
    </footer>
  );
};

export default memo(FooterMobile);

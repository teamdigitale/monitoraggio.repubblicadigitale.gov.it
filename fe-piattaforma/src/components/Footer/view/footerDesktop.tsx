import React, { memo } from 'react';
import { Icon } from 'design-react-kit';
import clsx from 'clsx';
import Mitd from '/public/assets/img/mitd-logo.png';
import SkillLogo from '/public/assets/img/digital-skills.png';
import { useTranslation } from 'react-i18next';

const FooterDesktop: React.FC = () => {
  const { t } = useTranslation();

  return (
    <footer
      className={clsx(
        'footer-container',
        'd-flex',
        'align-items-between',
        'w-100',
        'flex-column',
        'overflow-hidden',
        'primary-bg-a10'
      )}
    >
      <div className={clsx('row', 'px-5', 'mb-auto', 'mt-5')}>
        <div className='col-7'>
          <div className='row justify-content-around'>
            <div className=''>
              <p className='h6'>{t('designed_by')}</p>
              <div className='mr-auto mt-3'>
                <img src={Mitd} alt='logo' />
              </div>
            </div>
            <div className='ml-lg-5 ml-md-3 ml-sm-0'>
              <p className='h6'>{t('in_collaboration_with')}</p>
              <div className='mr-auto'>
                <img src={SkillLogo} alt='logo' />
              </div>
            </div>
          </div>
        </div>

        <div
          className={clsx(
            'footer-container__assistance',
            'position-relative',
            'col-5',
            'd-lg-block',
            'd-md-flex',
            'align-items-md-center',
            'justify-content-md-between',
            'assistance-column__desktop',
            'py-2'
          )}
        >
          <p className={clsx('h6', 'text-uppercase', 'mb-md-0', 'mb-lg-3')}>
            {t('assistance_contacts')}
          </p>
          <p className='footer-container__assistance__text'>
            {t('call_us_for_any_question')}
          </p>
          <span
            className={clsx(
              'd-inline-flex',
              'align-items-center',
              'mt-lg-3',
              'mt-md-0'
            )}
          >
            <Icon
              className='mr-3'
              color='white'
              icon='it-telephone'
              size='sm'
              aria-label='Telefono'
            />
            800 123 456
          </span>
        </div>
      </div>
      <div className='row'>
        <div
          className={clsx(
            'text-center',
            'col-12',
            'mt-4',
            'py-3',
            'analogue-1-bg-a12',
            'row',
            'px-5'
          )}
        >
          <p className='h6'>
            Ut pretium sem id blandit tincidunt. Proin accumsan vulputate
            turpis, eu elementum lectus sagittis in:
          </p>
        </div>
      </div>
    </footer>
  );
};

export default memo(FooterDesktop);

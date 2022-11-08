import React, { memo } from 'react';
import { Icon } from 'design-react-kit';
import clsx from 'clsx';
//import Mitd from '/public/assets/img/mitd-logo.png';
import Mitd from '/public/assets/img/mitd-logo_tmp.png';
//import SkillLogo from '/public/assets/img/digital-skills.png';
import SkillLogo from '/public/assets/img/scd-logo_tmp.png';
import { useTranslation } from 'react-i18next';

const FooterDesktop: React.FC = () => {
  const { t } = useTranslation();

  return (
    <footer
      className={clsx(
        'footer-container',
        'd-flex',
        'flex-column',
        'overflow-hidden',
        'primary-bg-a10'
      )}
    >
      <div className='container overflow-hidden'>
        <div className={clsx('row', 'mb-auto', 'mt-5')}>
          <div
            className={clsx(
              'col-7',
              'd-flex',
              'flex-row',
              'justify-content-lg-center'
            )}
          >
            <div className='row w-100'>
              <div className='mr-lg-4'>
                {/*<p className='h6'>{t('designed_by')}</p>*/}
                <div className='mr-auto mt-3'>
                  <img
                    src={Mitd}
                    alt='logo'
                    style={{ width: 'auto', height: '60px' }}
                  />
                </div>
              </div>
              <div className='ml-sm-0'>
                {/*<p className='h6'>{t('in_collaboration_with')}</p>*/}
                <div className='mr-auto mt-3'>
                  <img
                    src={SkillLogo}
                    alt='logo'
                    style={{ width: 'auto', height: '60px' }}
                  />
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
              'flex-md-column',
              'align-items-md-start',
              'justify-content-md-center',
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
          <p
            className={clsx(
              'h6',
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

export default memo(FooterDesktop);

import React from 'react';
import clsx from 'clsx';
import { Icon } from 'design-react-kit';
import { useTranslation } from 'react-i18next';

export default function ExistingEnteInfo() {
  const { t } = useTranslation();

  return (
      <div
      className={clsx(
        'd-flex',
        'flex-row',
        'align-items-center',
        'justify-content-center',
        'no-results-found'
      )}
    >
      <div>
        <Icon
          icon='it-warning-circle'
          className='no-results-found__icon mb-4'
          aria-label='Avvertimento no risultati'
        />
      </div>
      <div>
        <h3 className='h5 no-results-found__title' style={{ marginTop: '15px' }}>
          {t('existing_ente_form')}
        </h3>
        <h4 className='mt-0 no-results-found__subtitle'>
        {t('existing_citizen_form_subtitle')}
        </h4>
      </div>
    </div>);

};
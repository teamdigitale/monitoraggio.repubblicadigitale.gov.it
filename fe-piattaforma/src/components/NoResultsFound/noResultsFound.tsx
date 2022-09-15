import React from 'react';
import { Icon } from 'design-react-kit';
import fileIcon from '/public/assets/img/file_upload.png';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';

const NoResultsFound: React.FC = () => {
  const { t } = useTranslation();

  return (
    <>
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
          <h4 className='h5 no-results-found__title'>
            {t('citizen_not_found')}
          </h4>
          <h5 className='h6 no-results-found__title'>
            {t('make_a_new_research')}
          </h5>
        </div>
      </div>
      <div className='card-bg no-results-found__first-access'>
        <div>
          <h4 className='h5 first-access-title'>Nuovo cittadino?</h4>
          <h5 className='h6 first-access-subtitle analogue-1-color-a12-'>
            Aggiungi i dati anagrafici del nuovo cittadino
          </h5>
        </div>
        <div>
          <img src={fileIcon} alt='icon' />
        </div>
      </div>
    </>
  );
};

export default NoResultsFound;

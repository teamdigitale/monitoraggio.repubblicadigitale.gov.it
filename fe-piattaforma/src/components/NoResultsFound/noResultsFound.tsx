import React from 'react';
import { Icon } from 'design-react-kit';
import fileIcon from '/public/assets/img/file_upload.png';
import { useTranslation } from 'react-i18next';

const NoResultsFound: React.FC<null> = () => {
  const { t } = useTranslation();

  return (
    <>
      <div className='d-flex flex-column align-items-center no-results-found'>
        <Icon
          icon='it-warning-circle'
          className='no-results-found__icon mb-4'
          aria-label='Avvertimento no risultati'
        />
        <h4 className='no-results-found__title'>{t('citizen_not_found')}</h4>
        <h5 className='no-results-found__title'>{t('make_a_new_research')}</h5>
      </div>
      <div className='card-bg no-results-found__first-access'>
        <div>
          <h4 className='first-access-title'>Primo accesso?</h4>
          <h5 className='first-access-subtitle analogue-1-color-a12-'>
            Procedi con la compilazione del questionario
          </h5>
        </div>
        <div>
          <img src={fileIcon} />
        </div>
      </div>
    </>
  );
};

export default NoResultsFound;

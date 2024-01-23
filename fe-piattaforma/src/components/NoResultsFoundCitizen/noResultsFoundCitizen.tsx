import React from 'react';
import { Button, Icon } from 'design-react-kit';
import fileIcon from '/public/assets/img/file_upload.png';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';

interface NoResultsFoundCitizenI {
  onClickCta?: () => void;
}

const NoResultsFoundCitizen: React.FC<NoResultsFoundCitizenI> = ({
  onClickCta,
}) => {
  const { t } = useTranslation();

  return (
    <>
      <div className={'try-again-search'}>
        <h3 className={'try-again-search__error-label'}>
          {t('make_a_new_research_try_the_other_search_field')}
        </h3>
      </div>
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
          {onClickCta && (
            <Button onClick={onClickCta} color='primary' type='button'>
              Aggiungi il cittadino cliccando qui
            </Button>
          )}
        </div>
        <div>
          <img src={fileIcon} alt='icon' />
        </div>
      </div>
    </>
  );
};

export default NoResultsFoundCitizen;

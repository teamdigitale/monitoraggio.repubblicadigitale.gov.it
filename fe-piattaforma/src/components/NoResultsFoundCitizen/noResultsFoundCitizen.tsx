import React from 'react';
import { Button} from 'design-react-kit';
import fileIcon from '/public/assets/img/file_upload.png';

interface NoResultsFoundCitizenI {
  onClickCta?: () => void;
}

const NoResultsFoundCitizen: React.FC<NoResultsFoundCitizenI> = ({
  onClickCta,
}) => {

  return (
    <>
      <div className={'try-again-search'}>
        <h3 className={'try-again-search__error-label'}>
          {t('make_a_new_research_try_the_other_search_field')}
        </h3>
      </div>
      <div className='card-bg no-results-found__first-access'>
        <div>
          <h4 className='h5 first-access-title'>Il cittadino non risulta registrato sulla piattaforma</h4>
          <h4 className='h5 no-results-found__subtitle' >Compila una nuova scheda per aggiungerlo al servizio</h4>
          {onClickCta && (
            <Button onClick={onClickCta} color='primary' type='button' style={{ width: '200px' }}>
              Compila
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

import React from 'react';
import SearchBar from '../SearchBar/searchBar';
import { Form } from '..';
import { FormGroup, Label } from 'design-react-kit';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import clsx from 'clsx';
import { GetEntitySearchResult } from '../../redux/features/citizensArea/citizensAreaThunk';
import Input from '../Form/input';
import { setCitizenSearchResults } from '../../redux/features/citizensArea/citizensAreaSlice';

interface SearchBarOptionsI {
  setCurrentStep: (value: string) => void;
  setRadioFilter: (value: string) => void;
  currentStep: string | undefined;
  steps: { [key: string]: string };
  alreadySearched?: (param: boolean) => void;
  resetModal?: () => void;
}

const SearchBarOptionsCitizen: React.FC<SearchBarOptionsI> = ({
  setCurrentStep,
  setRadioFilter,
  currentStep,
  steps,
  alreadySearched,
  resetModal,
}) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const handleSearchReset = () => {
    dispatch(setCitizenSearchResults([]));
    if (resetModal) resetModal();
  };

  return (
    <div
      className={clsx(
        'neutral-1-bg-a1',
        'py-2',
        'px-5',
        'd-block',
        'search-bar-options-custom'
      )}
    >
      <div>
        <Form id='form-searchbar-opt' className='m-3'>
          <FormGroup check className='justify-content-around'>
            {Object.keys(steps).map((item, index) => (
              <div key={index} className='d-flex align-items-center'>
                <Input
                  name='docType'
                  type='radio'
                  id={`current-step-${index}`}
                  checked={currentStep === steps[item]}
                  onClick={() => {
                    setCurrentStep(steps[item]);
                    setRadioFilter(steps[item]);
                  }}
                  onInputChange={() => {
                    setCurrentStep(steps[item]);
                    setRadioFilter(steps[item]);
                  }}
                />
                <Label check htmlFor={`current-step-${index}`}>
                  {t(steps[item])}
                </Label>
              </div>
            ))}
          </FormGroup>
        </Form>
      </div>
      <SearchBar
        placeholder='Inserisci i dati del tipo di documento selezionato'
        onSubmit={(data) => {
          if (resetModal) resetModal();
          if (data) {
            dispatch(
              GetEntitySearchResult(data, currentStep ? currentStep : '')
            );
            if (alreadySearched) alreadySearched(true);
          }
        }}
        onReset={handleSearchReset}
      />
    </div>
  );
};

export default SearchBarOptionsCitizen;

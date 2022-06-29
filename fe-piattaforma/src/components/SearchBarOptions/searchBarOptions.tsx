import React from 'react';
import SearchBar from '../SearchBar/searchBar';
import { Form } from '../../components';
import { FormGroup, Label, Input } from 'design-react-kit';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import clsx from 'clsx';
import { GetEntitySearchResult } from '../../redux/features/citizensArea/citizensAreaThunk';

interface SearchBarOptionsI {
  setCurrentStep: (value: string) => void;
  currentStep: string | undefined;
  steps: { [key: string]: string };
}

const SearchBarOptions: React.FC<SearchBarOptionsI> = ({
  setCurrentStep,
  currentStep,
  steps,
}) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
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
        <Form className='m-3'>
          <fieldset>
            <FormGroup check>
              {Object.keys(steps).map((item, index) => (
                <div
                  role='button'
                  tabIndex={0}
                  key={index}
                  onKeyPress={() => {
                    setCurrentStep(steps[item]);
                  }}
                  onClick={() => {
                    setCurrentStep(steps[item]);
                  }}
                  className='search-bar-options-custom__items'
                >
                  <Input
                    name='docType'
                    type='radio'
                    id={`current-step-${index}`}
                    checked={currentStep === steps[item]}
                  />
                  <Label check htmlFor={`current-step-${index}`}>
                    {t(steps[item])}
                  </Label>
                </div>
              ))}
            </FormGroup>
          </fieldset>
        </Form>
      </div>
      <SearchBar
        placeholder='Inserisci i dati del tipo di documento selezionato'
        onSubmit={(data) => {
          dispatch(GetEntitySearchResult(data, currentStep ? currentStep : ''));
        }}
      />
    </div>
  );
};

export default SearchBarOptions;

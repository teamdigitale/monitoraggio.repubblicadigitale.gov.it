import React, { useCallback, useState } from 'react';
import SearchBar from '../SearchBar/searchBar';
import { Form } from '..';
import { FormGroup, Label } from 'design-react-kit';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import clsx from 'clsx';
import { GetEntitySearchResult } from '../../redux/features/citizensArea/citizensAreaThunk';
import Input from '../Form/input';
import { setCitizenSearchResults } from '../../redux/features/citizensArea/citizensAreaSlice';
import { SearchValue } from '../../pages/forms/models/searchValue.model';
import { Buffer } from 'buffer';

interface SearchBarOptionsI {
  setCurrentStep: (value: string) => void;
  setRadioFilter: (value: string) => void;
  currentStep: string | undefined;
  steps: { [key: string]: string };
  alreadySearched?: (param: boolean) => void;
  setSearchValue: (param: { type: string; value: string }) => void;
  resetModal?: () => void;
}

const SearchBarOptionsCitizen: React.FC<SearchBarOptionsI> = ({
  setCurrentStep,
  setRadioFilter,
  currentStep,
  steps,
  alreadySearched,
  setSearchValue,
  resetModal,
}) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const handleSearchReset = () => {
    dispatch(setCitizenSearchResults([]));
    if (resetModal) resetModal();
  };

  const [canSubmit, setCanSubmit] = useState<boolean>(false);
  const [query, setQuery] = useState<string>('');
  const [mustValidateCf, setMustValidateCf] = useState<boolean>(true);

  const isValidFiscalCode = useCallback((query: string) => {
    return /^[A-Z]{6}[0-9]{2}[A-Z][0-9]{2}[A-Z][0-9]{3}[A-Z]$/i.test(query);
  }, []);

  const onRadioChange = useCallback((value: string) => {
    setCurrentStep(value);
    setRadioFilter(value);
    setMustValidateCf(value === 'codiceFiscale');
    setCanSubmit(value !== 'codiceFiscale' || isValidFiscalCode(query));
  }, [setCurrentStep, setRadioFilter, query]);

  const onQueryChange = useCallback(((query: string) => {
    setCanSubmit(mustValidateCf ? isValidFiscalCode(query) : true);
    setQuery(query);
  }), [isValidFiscalCode, mustValidateCf]);

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
        <Form id='form-searchbar-opt' className='m-3' showMandatory={false}>
          <FormGroup check className='justify-content-around'>
            {Object.keys(steps).map((item, index) => (
              <div key={item} className='d-flex align-items-center'>
                <Input
                  name='docType'
                  type='radio'
                  id={`current-step-${index}`}
                  checked={currentStep === steps[item]}
                  onClick={() => {
                    onRadioChange(steps[item]);
                  }}
                  onInputChange={() => {
                    onRadioChange(steps[item]);
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
            const crypted = Buffer.from(data).toString('base64');
            const searchValue: SearchValue = {
              type: currentStep as string,
              value: data,
            };
            setSearchValue(searchValue);
            dispatch(
              GetEntitySearchResult(crypted, currentStep ? currentStep : '')
            );
            if (alreadySearched) alreadySearched(true);
          }
        }}
        onReset={handleSearchReset}
        onQueryChange={onQueryChange}
        disableSubmit={!canSubmit}
      />
    </div>
  );
};

export default SearchBarOptionsCitizen;

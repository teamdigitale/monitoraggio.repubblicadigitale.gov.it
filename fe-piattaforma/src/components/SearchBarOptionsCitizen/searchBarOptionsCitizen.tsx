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
import { emitNotify } from '../../redux/features/notification/notificationSlice';
import moment from 'moment';
import { Parser, Validator } from '@marketto/codice-fiscale-utils';

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

  const handleSearchReset = useCallback(() => {
    dispatch(setCitizenSearchResults([]));
    if (resetModal) resetModal();
  }, [dispatch, resetModal]);

  const [canSubmit, setCanSubmit] = useState<boolean>(false);
  const [query, setQuery] = useState<string>('');
  const [mustValidateCf, setMustValidateCf] = useState<boolean>(true);

  const isMaggiorenne = useCallback((cf: string): boolean => {
    return moment().diff(Parser.cfToBirthDate(cf), 'years', false) >= 18;
  }, []);

  const dispatchNotify = useCallback(
    (id, title, status, message, duration) => {
      dispatch(
        emitNotify({ id, title, status, message, closable: true, duration })
      );
    },
    [dispatch]
  );

  const isValidFiscalCode = useCallback(
    (query: string) => {
      const fiscalCodeValid = Validator.codiceFiscale(query).valid;

      if (fiscalCodeValid) {
        const isAdult = isMaggiorenne(query);
        if (!isAdult) {
          dispatchNotify(
            1,
            'ERRORE',
            'error',
            'Il codice fiscale risulta essere di un minorenne',
            'medium'
          );
        }
        return isAdult;
      }

      return false;
    },
    [dispatchNotify, isMaggiorenne]
  );

  const onRadioChange = useCallback(
    (value: string) => {
      handleSearchReset();
      setCurrentStep(value);
      setRadioFilter(value);
      setMustValidateCf(value === 'codiceFiscale');
      setCanSubmit(value !== 'codiceFiscale' || isValidFiscalCode(query));
    },
    [
      handleSearchReset,
      setCurrentStep,
      setRadioFilter,
      isValidFiscalCode,
      query,
    ]
  );

  const onQueryChange = useCallback(
    (query: string) => {
      const upperCaseQuery = query.toUpperCase();
      setCanSubmit(mustValidateCf ? isValidFiscalCode(upperCaseQuery) : true);
      setQuery(upperCaseQuery);
    },
    [isValidFiscalCode, mustValidateCf]
  );

  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const AES256 = require('aes-everywhere');

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
                  disabled={steps[item] === 'numeroDoc'}
                />
                <Label check htmlFor={`current-step-${index}`}
                       className={clsx({'label-disabled': steps[item] === 'numeroDoc'})}>
                  {t(steps[item])}
                </Label>
              </div>
            ))}
          </FormGroup>
        </Form>
      </div>
      <SearchBar
        placeholder='Inserisci il codice fiscale'
        searchType={currentStep ?? ''}
        onSubmit={(data) => {
          if (resetModal) resetModal();
          if (data) {
            const encrypted = AES256.encrypt(
              data.toUpperCase(),
              process?.env?.AES256_KEY
            );
            const searchValue: SearchValue = {
              type: currentStep as string,
              value: data,
            };
            setSearchValue(searchValue);
            dispatch(
              GetEntitySearchResult(encrypted, currentStep ? currentStep : '')
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

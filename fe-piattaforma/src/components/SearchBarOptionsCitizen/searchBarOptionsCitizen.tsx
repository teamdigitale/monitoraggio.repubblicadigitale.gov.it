import { Parser } from '@marketto/codice-fiscale-utils';
import clsx from 'clsx';
import moment from 'moment';
import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { useFiscalCodeValidation } from '../../hooks/useFiscalCodeValidation';
import { SearchValue } from '../../pages/forms/models/searchValue.model';
import { setCitizenSearchResults } from '../../redux/features/citizensArea/citizensAreaSlice';
import { GetEntitySearchResult } from '../../redux/features/citizensArea/citizensAreaThunk';
import { emitNotify } from '../../redux/features/notification/notificationSlice';
import SearchBar from '../SearchBar/searchBar';
import { dispatchWarning } from '../../utils/notifictionHelper';

interface SearchBarOptionsI {
  setCurrentStep: (value: string) => void;
  setRadioFilter: (value: string) => void;
  currentStep: string | undefined;
  steps: { [key: string]: string };
  alreadySearched?: (param: boolean) => void;
  setSearchValue: (param: { type: string; value: string }) => void;
  resetModal?: () => void;
  flgAbilitatoAMinori?: boolean;
  dataDecorrenza?: Date;
}

const SearchBarOptionsCitizen: React.FC<SearchBarOptionsI> = ({
  setCurrentStep,
  setRadioFilter,
  currentStep,
  steps,
  alreadySearched,
  setSearchValue,
  resetModal,
  flgAbilitatoAMinori = false,
  dataDecorrenza
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
  const { isValidFiscalCode: isCodiceFiscaleValido } = useFiscalCodeValidation();

  const isMaggiorenne = useCallback((cf: string): boolean => {
    return moment().diff(Parser.cfToBirthDate(cf), 'years', false) >= 18;
  }, []);

  const isMaggiore14Anni = useCallback((cf: string): boolean => {
    return moment().diff(Parser.cfToBirthDate(cf), 'years', false) >= 14;
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
      if (isCodiceFiscaleValido(query)) {
        const isAdult = isMaggiorenne(query);
        if (!isAdult) {
          if(flgAbilitatoAMinori){
            if(isMaggiore14Anni(query)){
              if(moment().isAfter(dataDecorrenza)){
                dispatchWarning(
                  'ATTENZIONE',
                  'Il codice fiscale risulta essere di un minore con più di 14 anni')
                return true;
              }else{
                dispatchNotify(
                  1,
                  'ERRORE',
                  'error',
                  'Data decorrenza futura',
                  'medium'
                );
              }
            }else{
              dispatchNotify(
                1,
                'ERRORE',
                'error',
                'Il codice fiscale risulta essere di un minorenne con meno di 14 anni',
                'medium'
              );
              return false;
            }
          }else{
            dispatchNotify(
              1,
              'ERRORE',
              'error',
              'Il cittadino deve essere maggiorenne',
              'medium'
            );
            return false;
          }        
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
        'py-2',
        'px-5',
        'd-block',
        'search-bar-options-custom'
      )}
    >
      {/* <div>
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
      </div> */}
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
              GetEntitySearchResult(encrypted, currentStep ? currentStep : '', alreadySearched)
            );
            if (alreadySearched) alreadySearched(false);
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

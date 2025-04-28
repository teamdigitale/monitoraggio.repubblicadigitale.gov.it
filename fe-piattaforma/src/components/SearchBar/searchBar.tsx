/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, {useCallback, useEffect, useState} from 'react';
import clsx from 'clsx';
import {Button, Icon} from 'design-react-kit';
import AsyncSelect from 'react-select/async';
import {components, ControlProps, MultiValue, SingleValue,} from 'react-select';
import {OptionType, SelectI} from '../Form/select';
import {Input} from '../index';
import {focusId} from '../../utils/common';
import {useAppSelector} from '../../redux/hooks';
import {selectDevice} from '../../redux/features/app/appSlice';
import {useDispatch} from 'react-redux';
import {deleteFiltroCriterioRicerca} from '../../redux/features/administrativeArea/administrativeAreaSlice';
import {deleteFiltroCriterioRicercaCitizen} from '../../redux/features/citizensArea/citizensAreaSlice';
import {selectedSteps} from '../../pages/administrator/CitizensArea/Entities/SearchCitizenModal/searchCitizenModal';
import { useFiscalCodeValidation } from '../../hooks/useFiscalCodeValidation';

interface SearchBarI extends Omit<SelectI, 'onInputChange'> {
  autocomplete?: boolean;
  field?: string;
  filterOptions?: (inputValue: string) => Promise<OptionType[]>;
  minLength?: number | undefined;
  onInputChange?: (
    value:
      | SingleValue<OptionType | undefined>
      | MultiValue<OptionType | undefined>,
    field: string
  ) => void;
  onSubmit?: (search: string) => void;
  placeholder?: string;
  title?: string;
  className?: string;
  searchButton?: boolean;
  description?: string;
  id?: string;
  entityToRefresh?: string | undefined;
  search?: boolean;
  onReset?: (() => void) | undefined;
  tooltip?: boolean;
  tooltipText?: string;
  infoText?: string;
  onQueryChange?: (query: string) => void;
  disableSubmit?: boolean;
  searchType?: string;
  interventoCheckbox?: boolean;
  onInterventoChange?: (value: string) => void;
}

const SearchBar: React.FC<SearchBarI> = (props) => {
  const {
    autocomplete = false,
    className,
    field = 'searchBar',
    filterOptions,
    minLength = 3,
    onInputChange,
    onSubmit,
    placeholder = '',
    searchButton = false,
    id = 'search',
    title = 'Cerca',
    search = false,
    onReset = () => ({}),
    // tooltip = false,
    // tooltipText = '',
    infoText = '',
    searchType,
    interventoCheckbox = false,
    onInterventoChange
  } = props;
  const dispatch = useDispatch();
  const [selectedOption, setSelectedOption] = useState<
    SingleValue<OptionType | undefined> | MultiValue<OptionType | undefined>
  >();
  const [isFiscalCodeValid, setIsFiscalCodeValid] = useState<boolean | null>(
    null
  );

  const [searchValue, setSearchValue] = useState<string>('');
  const [hasSearchValue, setHasSearchValue] = useState<boolean>(false);
  const { isValidFiscalCode } = useFiscalCodeValidation();

  const [interventoOption, setinterventoOption] = useState('RFD');

  const handleInterventoOptionChange = (value: string) => {
    setinterventoOption(value);
    if (props.onInterventoChange) {
      props.onInterventoChange(value);
    }
  };

  const handleInputChange = (newValue: string) => newValue.replace(/\W/g, '');

  const loadOptions = (inputValue: string) => {
    if (inputValue.length >= minLength && filterOptions) {
      return filterOptions(inputValue);
    }
    return inputValue;
  };

  const onInputQueryChange = useCallback(
    (search) => {
      if (!search) {
        setSearchValue('');
        setIsFiscalCodeValid(null);
        return;
      }

      const formattedFiscalCode = search.toUpperCase();
      setSearchValue(formattedFiscalCode);

      if (searchType === selectedSteps.FISCAL_CODE) {
        setIsFiscalCodeValid(isValidFiscalCode(formattedFiscalCode));
      }

      if (props.onQueryChange) {
        props.onQueryChange(formattedFiscalCode);
      }
    },
    [searchType, props]
  );

  useEffect(() => {
    if (
      // searchType === selectedSteps.DOC_NUMBER ||
      searchType === selectedSteps.FISCAL_CODE
    ) {
      setSearchValue('');
      setIsFiscalCodeValid(null);
    }
  }, [searchType]);

  useEffect(() => {
    if (onInputChange && selectedOption) onInputChange(selectedOption, field);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedOption]);

  const handleChange = (
    newValue:
      | SingleValue<OptionType | undefined>
      | MultiValue<OptionType | undefined>
  ) => {
    if (newValue) setSelectedOption(newValue || '');
  };

  const handleOnSubmit = () => {
    if (props.disableSubmit) return;
    if (!autocomplete && onSubmit) {
      onSubmit(searchValue);
      setSearchValue(searchValue);
      setHasSearchValue(true);
    }
  };

  const clearSearch = () => {
    setSearchValue('');
    setHasSearchValue(false);
    dispatch(deleteFiltroCriterioRicerca());
    dispatch(deleteFiltroCriterioRicercaCitizen());
    setSearchValue('');
    setSearchValue('');
    setIsFiscalCodeValid(null);
    if (onReset) onReset();
  };

  const AutocompleteDropdownIndicator = useCallback(
    (props) => (
      <components.DropdownIndicator {...props} className='p-0'>
        {searchButton ? (
          <Button onClick={handleOnSubmit} color='primary'>
            Cerca
          </Button>
        ) : (
          <Button onClick={handleOnSubmit}>
            <Icon
              icon='it-search'
              aria-hidden
              size=''
              color='primary'
              aria-label='Cerca'
            />
          </Button>
        )}
      </components.DropdownIndicator>
    ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const Control = ({ children, ...props }: ControlProps<any>) => {
    return (
      <components.Control {...props}>
        {hasSearchValue && (
          <Button
            onClick={clearSearch}
            className={clsx('border-0', 'p-0', 'py-2')}
          >
            <Icon
              icon='it-close-big'
              aria-hidden
              size='xs'
              color='primary'
              aria-label='Chiudi'
            />
          </Button>
        )}
        {children}
      </components.Control>
    );
  };

  // const [openOne, toggleOne] = useState(false);

  const focusOfSearch = () => {
    focusId(id);
  };

  const device = useAppSelector(selectDevice);

  return (
    <div className={clsx(className, 'search-bar-custom')}>
      {!device.mediaIsPhone && search ? (
        <h1 className='search-bar-title primary-color mb-3'> {title} </h1>
      ) : null}
      <div className={clsx('d-inline-flex', 'w-100', 'mb-1')}>
        {autocomplete ? (
          <AsyncSelect
            className={clsx('search-bar-container', 'w-100')}
            classNamePrefix='search-bar'
            cacheOptions
            loadOptions={loadOptions}
            defaultOptions
            onInputChange={handleInputChange}
            onChange={handleChange}
            components={{
              DropdownIndicator: AutocompleteDropdownIndicator,
              IndicatorSeparator: null,
              Control,
            }}
          />
        ) : (
          <div style={{ width: '100%' }}>
            {interventoCheckbox && (
                /* Radio Buttons */
                <div className='d-flex mb-2 justify-content-center'>
                <span style={{ fontSize: '20px', marginRight: '150px', marginLeft: '150px' }}>
                  <input
                  type='radio'
                  name='searchType'
                  value='RFD'
                  checked={interventoOption === 'RFD'}
                  onChange={(event) => handleInterventoOptionChange(event.target.value)}
                  style={{ marginRight: '5px' }}
                  />
                   RFD
                </span>
                <span style={{ fontSize: '20px', marginRight: '150px' }}>
                  <input
                  type='radio'
                  name='searchType'
                  value='SCD'
                  checked={interventoOption === 'SCD'}
                  onChange={(event) => handleInterventoOptionChange(event.target.value)}
                  style={{ marginRight: '5px' }}
                  />
                  SCD
                </span>
                </div>
              )}
          <div
            className={clsx(
              'input-group',
              // 'mb-3',
                'search-bar-custom__input-group'
              )}
              >
            <div className='search-bar-custom__left-section'>
              <Input
                addon
                className={clsx(
                  'mb-0',
                  'input-border',
                  'input-search',
                  hasSearchValue && 'input-text-bold',
                  'position-relative',
                  'bg-transparent',
                  'mr-5',
                  {
                    'is-valid': isFiscalCodeValid,
                    'is-invalid': isFiscalCodeValid === false,
                  },
                  device.mediaIsPhone && 'pl-0'
                )}
                field={id}
                onInputChange={onInputQueryChange}
                placeholder={placeholder}
                value={searchValue}
                maximum={
                  searchType === selectedSteps.FISCAL_CODE ? 16 : undefined
                }
                withLabel={false}
                // aria-label='Input per la ricerca'
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleOnSubmit();
                  }
                }}
                tabIndex={0}
                minimum={minLength}
              />
              {searchValue &&
                searchType === selectedSteps.FISCAL_CODE &&
                (isFiscalCodeValid ? (
                  <div className='valid-feedback'>
                    <i className='it-check-circle'></i>
                  </div>
                ) : (
                  <div className='invalid-feedback'>
                    <i className='it-close-circle'></i>
                  </div>
                ))}

              {!hasSearchValue && device.mediaIsPhone && (
                <span id='placeholder-icon' className='d-flex flex-row'>
                  <span
                    className='font-weight-normal primary-color-a12 mr-2 word-spacing'
                    onClick={focusOfSearch}
                    onKeyDown={(e) => {
                      if (e.key === ' ') {
                        focusOfSearch();
                      }
                    }}
                  >
                  </span>
                  {/* {tooltip && (
                    <div id='search-tooltip'>
                      <Tooltip
                        placement='bottom'
                        target='search-tooltip'
                        isOpen={openOne}
                        toggle={() => toggleOne(!openOne)}
                      >
                        {tooltipText}
                      </Tooltip>
                      <Icon
                        icon='it-warning-circle'
                        size='xs'
                        aria-label='Avviso'
                        aria-hidden
                      />
                    </div>
                  )} */}
                </span>
              )}
            </div>
            {searchValue && (
              <div className='input-group-append input-button'>
                <Button
                  onClick={clearSearch}
                  className='border-0 px-0'
                  id='button-addon1'
                  aria-label={`Elimina filtro ${searchValue}`}
                >
                  <Icon
                    icon='it-close-big'
                    aria-hidden
                    size='xs'
                    color='primary'
                    aria-label='elimina filtro'
                  />
                </Button>
              </div>
            )}
            <div className='input-group-append input-button'>
              {searchButton ? (
                <Button
                  className='border-0'
                  onClick={handleOnSubmit}
                  color='primary'
                  disabled={props.disableSubmit}
                >
                  Cerca
                </Button>
              ) : (
                <Button
                  className='border-0'
                  onClick={handleOnSubmit}
                  aria-label='Avvia ricerca'
                  disabled={props.disableSubmit}
                >
                  <Icon
                    icon='it-search'
                    aria-hidden
                    size=''
                    color='primary'
                    aria-label='Cerca'
                    className='pl-1'
                  />
                </Button>
              )}
            </div>
          </div>
          </div>
        )}
      </div>
      {infoText ? <small className='text-muted'>{infoText}</small> : null}
    </div>
  );
};

export default SearchBar;

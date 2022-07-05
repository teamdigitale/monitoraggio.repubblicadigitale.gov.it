/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { useCallback, useEffect, useState } from 'react';
import clsx from 'clsx';
import { Button, Icon, Tooltip } from 'design-react-kit';
import AsyncSelect from 'react-select/async';
import { MultiValue, SingleValue } from 'react-select';
import { OptionType, SelectI } from '../Form/select';
import { Input } from '../index';
import { components, ControlProps } from 'react-select';
import { focusId } from '../../utils/common';
import { useAppSelector } from '../../redux/hooks';
import { selectDevice } from '../../redux/features/app/appSlice';
import { useDispatch } from 'react-redux';
import { deleteFiltroCriterioRicerca } from '../../redux/features/administrativeArea/administrativeAreaSlice';

interface SearchBarI extends Omit<SelectI, 'onInputChange'> {
  autocomplete?: boolean;
  field?: string;
  filterOptions?: (inputValue: string) => Promise<OptionType[]>;
  minLength?: number;
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
  } = props;
  const dispatch = useDispatch();
  const [selectedOption, setSelectedOption] = useState<
    SingleValue<OptionType | undefined> | MultiValue<OptionType | undefined>
  >();
  const [searchValue, setSearchValue] = useState<string>('');
  const [hasSearchValue, setHasSearchValue] = useState<boolean>(false);

  const handleInputChange = (newValue: string) => newValue.replace(/\W/g, '');

  const loadOptions = (inputValue: string) => {
    if (inputValue.length >= minLength && filterOptions) {
      return filterOptions(inputValue);
    }
    return inputValue;
  };

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
      // eslint-disable-next-line react-hooks/exhaustive-deps
    ),
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
            ></Icon>
          </Button>
        )}
        {children}
      </components.Control>
    );
  };

  const [openOne, toggleOne] = useState(false);

  const focusOfSearch = () => {
    focusId(id);
  };

  const device = useAppSelector(selectDevice);

  return (
    <div className={`${className} search-bar-custom`}>
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
          <div
            className={clsx(
              'input-group',
              'mb-3',
              'search-bar-custom__input-group'
            )}
          >
            <div className='search-bar-custom__left-section'>
              {searchValue && (
                <div className='input-group-append input-button'>
                  <Button
                    onClick={clearSearch}
                    className='border-0 px-0'
                    id='button-addon1'
                  >
                    <Icon
                      icon='it-close-big'
                      aria-hidden
                      size='xs'
                      color='primary'
                      aria-label='Chiudi'
                    />
                  </Button>
                </div>
              )}

              <Input
                addon
                className={clsx(
                  'mb-0',
                  'input-border',
                  'input-search',
                  hasSearchValue && 'input-text-bold',
                  'position-relative',
                  'bg-transparent',
                  'mr-5'
                )}
                field={id}
                onInputChange={(search) =>
                  setSearchValue((search || '').toString())
                }
                placeholder={device.mediaIsPhone ? '' : placeholder}
                value={searchValue}
                withLabel={false}
                aria-label={id}
              />

              {!hasSearchValue && device.mediaIsPhone && (
                <span id='placeholder-icon'>
                  <span
                    className='placeholder-label font-weight-normal primary-color-a12'
                    onClick={focusOfSearch}
                    onKeyDown={(e) => {
                      if (e.key === ' ') {
                        focusOfSearch();
                      }
                    }}
                  >
                    {title}
                  </span>
                  <span id='search-tooltip' className='ml-2'>
                    <Icon
                      icon='it-info-circle'
                      size='xs'
                      color='primary-color-a12'
                      aria-label='icona info'
                    />
                  </span>
                </span>
              )}
            </div>
            <div className='input-group-append input-button'>
              {searchButton ? (
                <Button
                  className='border-0'
                  onClick={handleOnSubmit}
                  color='primary'
                >
                  Cerca
                </Button>
              ) : (
                <Button
                  className='border-0'
                  onClick={handleOnSubmit}
                  aria-label='Pulsante cerca'
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
        )}
        {!hasSearchValue && device.mediaIsPhone && (
          <Tooltip
            placement='top'
            target='search-tooltip'
            isOpen={openOne}
            toggle={() => toggleOne(!openOne)}
          >
            {placeholder}
          </Tooltip>
        )}
      </div>
    </div>
  );
};

export default SearchBar;

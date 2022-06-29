import { Button, FormGroup, Icon, Label, Popover } from 'design-react-kit';
import React, { memo, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';
import { Form, Input } from '../index';
import { focusId } from '../../utils/common';
import { formFieldI } from '../../utils/formHelper';
import ClickOutside from '../../hoc/ClickOutside';
import isEqual from 'lodash.isequal';

export interface FilterI {
  label: string;
  value: string | number | any[];
}

export interface DropdownFilterI {
  filterName?: string;
  options: FilterI[] | undefined;
  onOptionsChecked?: ((value: FilterI[]) => void) | undefined;
  values?: FilterI[] | undefined;
  className?: string;
  id: string;
  handleOnSearch?: (searchKey: formFieldI['value']) => void;
  valueSearch?: formFieldI['value'] | undefined;
}

let focusedInput = -1;
const DropdownFilter: React.FC<DropdownFilterI> = (props) => {
  const {
    filterName,
    options,
    onOptionsChecked,
    values = [],
    className,
    id,
    handleOnSearch,
    valueSearch,
  } = props;
  const [open, setOpen] = useState(false);
  const [checkedOptions, setCheckedOptions] = useState<FilterI[]>(values);
  const idListOptions = `filter-options-list-${id}`;
  const popoverRef = useRef(null);
  const { t } = useTranslation();

  const manageKeyEvent = (e: KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowDown': {
        e.preventDefault();
        document
          .getElementById(
            `input-checkbox-${id}-${Math.max(
              Math.min(focusedInput + 1, (options || [])?.length - 1),
              0
            )}`
          )
          ?.focus();
        focusedInput = Math.max(
          Math.min(focusedInput + 1, (options || [])?.length - 1),
          0
        );
        break;
      }
      case 'ArrowUp': {
        e.preventDefault();
        document
          .getElementById(
            `input-checkbox-${id}-${Math.max(
              Math.min(focusedInput - 1, (options || [])?.length - 1),
              0
            )}`
          )
          ?.focus();
        focusedInput = Math.max(
          Math.min(focusedInput - 1, (options || [])?.length - 1),
          0
        );
        break;
      }
      case 'Escape': {
        e.preventDefault();
        setOpen(!open);
        focusId(`filter-${id}`);
        break;
      }
      case 'Tab':
        if (focusedInput === (options || [])?.length - 1) {
          e.preventDefault();
          setOpen(!open);
          focusId(`filter-${id}`);
          break;
        } else {
          e.preventDefault();
          document
            .getElementById(
              `input-checkbox-${id}-${Math.max(
                Math.min(focusedInput + 1, (options || [])?.length - 1),
                0
              )}`
            )
            ?.focus();
          focusedInput = Math.max(
            Math.min(focusedInput + 1, (options || [])?.length - 1),
            0
          );
          break;
        }
      default:
    }
  };

  useEffect(() => {
    if (open) {
      focusId(idListOptions, false);
      document.addEventListener('keydown', manageKeyEvent);
    }

    return () => {
      document.removeEventListener('keydown', manageKeyEvent);
      focusedInput = -1;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  useEffect(() => {
    if (!isEqual(values, checkedOptions)) {
      setCheckedOptions(values || []);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values]);

  useEffect(() => {
    if (!isEqual(values, checkedOptions) && onOptionsChecked) {
      onOptionsChecked(checkedOptions);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checkedOptions]);

  const handleOnChange = (filter: FilterI, val: formFieldI['value']) => {
    let checkedArray = [...checkedOptions];
    if (Array.isArray(checkedArray)) {
      if (val !== '') {
        if (val && checkedOptions.filter((f) => f.value !== filter.value)) {
          checkedArray.push(filter);
        } else {
          checkedArray = [
            ...checkedArray.filter((f) => f.value !== filter.value),
          ];
        }
      }
    }
    if (checkedArray.length !== checkedOptions.length) {
      setCheckedOptions(checkedArray.filter((v, i, a) => a.indexOf(v) === i));
    }
  };

  return (
    <div
      className={clsx(
        className,
        'dropdown-filter-container',
        'mr-lg-4',
        'mr-2',
        'mt-4'
      )}
    >
      <Button
        color='primary'
        outline
        onClick={() => setOpen(!open)}
        className='d-flex flex-row justify-content-between w-100'
        id={`filter-${id}`}
        innerRef={popoverRef}
      >
        {filterName}{' '}
        <Icon
          color='primary'
          icon='it-expand'
          size='sm'
          aria-label='Apertura dropdown filtro'
        />
      </Button>
      <span id={`descrizione-popover-dropdown-${id}`} className='d-none'>
        {t('tooltip_formed_by_search_bar_and_checkboxed_options')}
      </span>
      <Popover
        isOpen={open}
        placement='bottom'
        target={popoverRef}
        className='dropdown-filter-container__popover'
        toogle={() => setOpen(!open)}
        id={`popover-filter-options-${id}`}
        aria-describedby={`descrizione-popover-dropdown-${id}`}
        role='combobox'
        aria-owns={idListOptions}
      >
        {options?.length && options?.length > 5 ? (
          <div className='border-bottom d-flex flex-row'>
            <Icon
              color='primary'
              icon='it-search'
              size=''
              aria-label='Cerca tra le opzioni del filtro'
            />
            <fieldset>
              <legend className='dropdown-filter-container__search-tooltip'>
                <Input
                  id={`search-input-dropdown-${id}`}
                  label={`search-input-dropdown-${id}`}
                  aria-controls={idListOptions}
                  aria-autocomplete='both'
                  field=''
                  bsSize='sm'
                  placeholder='Cerca'
                  className='shadow-none border-bottom-0'
                  onInputChange={handleOnSearch}
                  value={
                    valueSearch && typeof valueSearch === 'string'
                      ? valueSearch
                      : ''
                  }
                />
              </legend>
            </fieldset>
          </div>
        ) : null}
        <ClickOutside callback={() => setOpen(false)}>
          <Form>
            <span id='descrizione-lista' className='sr-only'>
              {'Il filtro presenta ' + (options?.length || 0) + ' opzioni'}
            </span>
            {(options || []).length === 0 ? (
              <p>Non ci sono opzioni per questo filtro</p>
            ) : (
              <ul
                id={idListOptions}
                tabIndex={0}
                role='listbox'
                aria-label='filter-options-list'
                aria-multiselectable='true'
                className='dropdown-filter-container__list'
                aria-describedby='descrizione-lista'
              >
                {(options || []).map((opt, index) => (
                  <li
                    key={`option-${index}`}
                    id={`group-checkbox-${id}-${index}`}
                    role='option'
                    aria-selected='false'
                    tabIndex={-1}
                    aria-label={opt.label}
                  >
                    <FormGroup check className='form-check-group shadow-none'>
                      <Input
                        id={`input-checkbox-${id}-${index}`}
                        field=''
                        label={opt.label}
                        type='checkbox'
                        checked={
                          !!checkedOptions.filter((f) => f.value === opt.value)
                            .length
                        }
                        withLabel={false}
                        onInputChange={(checked) => {
                          handleOnChange(opt, checked);
                        }}
                        className='dropdown-filter-container__input'
                        tabIndex={-1}
                        aria-labelledby={`input-checkbox-${id}-${index}Description`}
                      />
                      <Label
                        id={`input-checkbox-${id}-${index}Description`}
                        check
                        className='primary-color-b1'
                      >
                        {opt.label}
                      </Label>
                    </FormGroup>
                  </li>
                ))}
              </ul>
            )}
          </Form>
        </ClickOutside>
      </Popover>
    </div>
  );
};

export default memo(
  DropdownFilter,
  (prevProps, currentProps) =>
    JSON.stringify(prevProps) === JSON.stringify(currentProps)
);

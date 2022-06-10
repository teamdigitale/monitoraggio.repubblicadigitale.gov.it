import React, { memo, useState } from 'react';
import clsx from 'clsx';
import { FormGroup, Input, Label } from 'design-react-kit';
import './filtersAside.scss';

interface FilterI {
  label: string;
  value: string;
}

interface FiltersAsideI {
  title?: string;
  multiFilter?: boolean;
  type?: string; // checkbox - category - ...
  filterOptions?: FilterI[];
}

const FiltersAside: React.FC<FiltersAsideI> = (props) => {
  const { title, multiFilter, filterOptions } = props;
  const arrayFilters: FilterI[] = [];
  const [filterSelected, setFilterSelected] = useState('');

  const handleOnChangeMulti = (filter: FilterI, checked: boolean) => {
    if (checked) {
      arrayFilters.push(filter);
    } else {
      arrayFilters.splice(
        arrayFilters.findIndex((f) => f.value === filter.value),
        1
      );
    }
  };

  const handleOnChangeSingle = (filter: FilterI) => {
    setFilterSelected(filter.value);
  };

  return (
    <aside className='filters-aside'>
      {multiFilter && (
        <>
          <h2 className='h5 primary-color-b1'>{title}</h2>
          <div className='mt-4 filters-aside__content'>
            {(filterOptions || []).map((option, i) => (
              <FormGroup
                check
                className='form-check-group pb-3'
                key={'option-' + i}
              >
                <Input
                  id={'group-checkbox' + i}
                  type='checkbox'
                  onChange={(e) =>
                    handleOnChangeMulti(option, e.target.checked)
                  }
                />
                <Label for={'group-checkbox' + i} check>
                  {option.label}
                </Label>
              </FormGroup>
            ))}
          </div>
        </>
      )}
      {!multiFilter && (
        <>
          <h2 className='h5 primary-color-b1'>{title}</h2>
          <div className='mt-4 filters-aside__content'>
            {(filterOptions || []).map((option, i) => (
              <div key={'option-' + i}>
                {/* eslint-disable-next-line jsx-a11y/click-services-have-key-services */}
                <div
                  className={clsx(
                    'py-2',
                    option.value !== filterSelected && 'bg-white',
                    option.value === filterSelected &&
                      'filters-aside__content__selection font-weight-bold'
                  )}
                  role='button'
                  tabIndex={0}
                  onClick={() => handleOnChangeSingle(option)}
                >
                  <p
                    className={clsx(
                      option.value === filterSelected
                        ? 'my-2 pl-4 primary-color-b1'
                        : 'my-2 pl-4 complementary-1-color-b8 '
                    )}
                  >
                    {option.label}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </aside>
  );
};

export default memo(FiltersAside);

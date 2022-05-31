import React, { memo, useState } from 'react';
import clsx from 'clsx';
import './sideSelection.scss';

interface FilterI {
  label: string;
  value: string;
}

interface SideSelectionI {
  title?: string;
  filterOptions?: FilterI[];
  onFilterChange?: (arg: FilterI) => void;
  defaultOption?: FilterI;
}

const SideSelection: React.FC<SideSelectionI> = (props) => {
  const { title, filterOptions, onFilterChange, defaultOption } = props;
  const [filterSelected, setFilterSelected] = useState(
    defaultOption ? defaultOption.value : ''
  );

  const handleOnChangeSingle = (filter: FilterI) => {
    if (onFilterChange) {
      onFilterChange(filter);
    }
    setFilterSelected(filter.value);
  };

  return (
    <aside className='side-selection'>
      {title && <h2 className='h5 primary-color-b1'>{title}</h2>}
      <div className='mt-4 side-selection__content'>
        {(filterOptions || []).map((option, i) => (
          <div key={'option-' + i}>
            {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events */}
            <div
              className={clsx(
                'py-2',
                option.value !== filterSelected && 'bg-white',
                option.value === filterSelected &&
                  'side-selection__content__selection font-weight-bold'
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
    </aside>
  );
};

export default memo(
  SideSelection,
  (prevProps, currentProps) =>
    JSON.stringify(prevProps) === JSON.stringify(currentProps)
);

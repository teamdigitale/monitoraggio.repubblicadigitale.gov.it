import React, { memo } from 'react';
import { CardReadMore } from 'design-react-kit';
import clsx from 'clsx';
import './cardsWrapper.scss';

interface CardsWrapperI {
  children?: JSX.Element | JSX.Element[];
  title?: string;
  wrapperClassName?: string;
}

const CardsWrapper: React.FC<CardsWrapperI> = (props) => {
  const { title, children, wrapperClassName } = props;

  return (
    <div
      className={clsx(
        'cards-wrapper',
        'py-5',
        'd-flex',
        'flex-wrap',
        wrapperClassName
      )}
    >
      <div
        className={clsx(
          'cards-wrapper__title',
          'd-flex',
          'justify-content-between',
          'w-100'
        )}
      >
        <h2 className='h3 text-primary mb-3'>{title}</h2>
        <CardReadMore
          text='Archivio questionari'
          iconName='it-arrow-right'
          href=''
        />
      </div>
      {children ? (
        <div
          className={clsx(
            'cards-wrapper',
            'pt-3',
            'd-flex',
            'flex-nowrap',
            'justify-content-between',
            'w-100',
            wrapperClassName
          )}
        >
          {children}
        </div>
      ) : null}
    </div>
  );
};

export default memo(CardsWrapper);

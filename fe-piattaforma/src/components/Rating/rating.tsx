import clsx from 'clsx';
import { Icon } from 'design-react-kit';
import React, { useEffect, useState } from 'react';

interface RatingI {
  rating?: number;
  className?: string;
  maxRating?: number;
  onChange?: (rate: number) => void;
}

const Rating: React.FC<RatingI> = (props) => {
  const { rating = 0, className, maxRating = 5, onChange } = props;
  const [rate, setRate] = useState<number>(rating);

  useEffect(() => {
    if (onChange) onChange(rate);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rate]);

  const handleChangeRate = (newRate: number = rate) => {
    setRate(Math.max(1, Math.min(maxRating, newRate + 1)));
  };

  return (
    <div className={clsx(className, 'd-flex', 'flex-row')}>
      {Array.from(Array(maxRating).keys()).map((index) => (
        <div
          className='mr-2 rate-star'
          key={'rate-' + (index + 1)}
          id={'rate-' + (index + 1)}
        >
          {index + 1 <= rate ? (
            <Icon
              className='full'
              color='primary'
              icon='it-star-full'
              size='sm'
              onClick={() => handleChangeRate(index)}
              aria-label='Stella piena rating'
            />
          ) : null}
          {index + 1 > rate ? (
            <Icon
              className='empty'
              color='primary'
              icon='it-star-outline'
              size='sm'
              onClick={() => handleChangeRate(index)}
              aria-label='Stella vuota rating'
            />
          ) : null}
        </div>
      ))}
    </div>
  );
};

export default Rating;

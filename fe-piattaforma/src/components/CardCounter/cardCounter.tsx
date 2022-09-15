import clsx from 'clsx';
import { Icon } from 'design-react-kit';
import React, { memo } from 'react';
import { selectDevice } from '../../redux/features/app/appSlice';
import { useAppSelector } from '../../redux/hooks';
import './cardCounter.scss';

export interface CardCounterI {
  title: string;
  counter: number;
  icon: string;
  className?: string;
}

const CardCounter: React.FC<CardCounterI> = (props) => {
  const { title, counter, icon, className } = props;
  const device = useAppSelector(selectDevice);

  return (
    <div
      className={clsx(
        className,
        'd-flex',
        'flex-row',
        'card-counter',
        'px-3',
        'py-3',
        device.mediaIsPhone && 'my-2 w-100'
      )}
    >
      <Icon
        className='mr-2'
        icon={icon}
        size='sm'
        aria-label={title}
        color='primary'
      />
      <span className='mr-2'>
        <strong>{counter}</strong>
      </span>
      <span>{title}</span>
    </div>
  );
};

export default memo(CardCounter);

import React, { memo } from 'react';
import { Icon } from 'design-react-kit';
import './notificationCard.scss';
import clsx from 'clsx';

interface NotificationCardI {
  className?: string;
  icon?: string;
  title: string;
  value: number | string;
  ariaLabel?: string;
}

const NotificationCard: React.FC<NotificationCardI> = (props) => {
  const { className, icon, title, value, ariaLabel } = props;
  return (
    <div
      className={clsx(
        'notification-card',
        'bg-white',
        'shadow-sm',
        'w-100',
        className
      )}
    >
      <div
        className={clsx(
          'd-inline-flex',
          'align-items-center',
          'primary-color-b6'
        )}
      >
        {icon ? (
          <Icon
            icon={icon}
            size='sm'
            className='mr-3'
            color='primary'
            aria-label={ariaLabel}
          />
        ) : null}
        <div className={clsx('value', 'mb-0', 'primary-color-b6', 'mr-3')}>
          {value}
        </div>
      </div>
      {title}
    </div>
  );
};

export default memo(NotificationCard);

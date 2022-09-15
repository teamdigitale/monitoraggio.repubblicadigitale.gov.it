import React, { memo } from 'react';
import { Icon } from 'design-react-kit';
import './dashboardCard.scss';
import clsx from 'clsx';

interface DashboardCardI {
  className?: string;
  icon?: string;
  title: string;
  value: number | string;
  ariaLabel?: string;
}

const DashboardCard: React.FC<DashboardCardI> = (props) => {
  const { className, icon, title, value, ariaLabel } = props;
  return (
    <div
      className={clsx(
        'dashboard-card',
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
            size='xs'
            className='mr-1'
            color='primary'
            aria-label={ariaLabel}
          />
        ) : null}
        {title}
      </div>
      <div className={clsx('h4', 'mb-0', 'primary-color-b6')}>{value}</div>
    </div>
  );
};

export default memo(DashboardCard);

import { Button, Icon } from 'design-react-kit';
import React from 'react';
import clsx from 'clsx';
import './userPublishedContents.scss';
import { useNavigate } from 'react-router-dom';
import useGuard from '../../hooks/guard';
import { usePathContent } from '../../utils/functionHelper';

const UserPublishedContents = () => {
  const navigate = useNavigate();
  const { hasUserPermission } = useGuard();
  const pathName = location.pathname;
  const { title } = usePathContent(pathName);

  const navigateTo = () => {
    navigate('/area-personale/contenuti-pubblicati');
  };

  if (!hasUserPermission(['btn.cont'])) {
    return null;
  }

  return (
    <div
      className={clsx(
        'user-published-container',
        'd-flex',
        'flex-column',
        'align-items-end',
        'pt-2',
        'position-absolute'
      )}
    >
      <div
        className={clsx(
          'd-flex',
          'flex-row',
          'justify-content-around',
          'align-items-center'
        )}
      >
        <Button
          size='xs'
          className={clsx(
            'd-flex',
            'flex-row',
            'align-items-center',
            'px-0',
            'py-1'
          )}
          onClick={navigateTo}
        >
          <Icon
            icon='it-user'
            color='primary'
            aria-label='utente'
            aria-hidden
          />
          <p className='primary-color ml-2 text-nowrap'>{title}</p>
        </Button>
        <Icon
          icon='it-chevron-right'
          color='primary'
          className='pt-1 pr-1'
          aria-label='dettaglio'
          aria-hidden
        />
      </div>
    </div>
  );
};

export default UserPublishedContents;

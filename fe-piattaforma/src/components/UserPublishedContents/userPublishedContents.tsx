import { Button, Icon } from 'design-react-kit';
import React from 'react';
import clsx from 'clsx';
import './userPublishedContents.scss';
import { useAppSelector } from '../../redux/hooks';
import { selectDevice } from '../../redux/features/app/appSlice';
import { useNavigate } from 'react-router-dom';
import useGuard from "../../hooks/guard";

const UserPublishedContents = () => {
  const device = useAppSelector(selectDevice);
  const navigate = useNavigate();
  const { hasUserPermission } = useGuard();

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
          <Icon icon='it-user' color='primary' />
          <p className='primary-color ml-2 text-nowrap'>CONTENUTI PUBBLICATI</p>
        </Button>
        <Icon icon='it-chevron-right' color='primary' className='pt-1 pr-1' />
      </div>
      {!device.mediaIsPhone ? (
        <p className='text-style mr-3 text-nowrap'>
          Gestisci tutti i contenuti pubblicati da te
        </p>
      ) : null}
    </div>
  );
};

export default UserPublishedContents;

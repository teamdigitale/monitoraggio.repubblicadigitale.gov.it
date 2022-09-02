import { Button, Container, Icon } from 'design-react-kit';
import React, { memo, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Paginator } from '../../../components';
import PageTitle from '../../../components/PageTitle/pageTitle';
import {
  selectDevice,
  updateBreadcrumb,
} from '../../../redux/features/app/appSlice';
import { selectEntityPagination } from '../../../redux/features/citizensArea/citizensAreaSlice';
import { useAppSelector } from '../../../redux/hooks';
import NotificationCard from './components/NotificationCards/notificationCard';
import NotificationsList from './components/NotificationsList/notificationsList';
import './notifications.scss';
import { setEntityPagination } from '../../../redux/features/administrativeArea/administrativeAreaSlice';
import clsx from 'clsx';
import { GetNotificationsList } from '../../../redux/features/notification/notificationThunk';
import { selectNotification } from '../../../redux/features/notification/notificationSlice';

const NotificationCardPropsMock = [
  {
    icon: 'it-inbox',
    title: 'Da leggere',
    value: 4,
    ariaLabel: 'da leggere',
  },
  {
    icon: 'it-files',
    title: 'Lette',
    value: 61,
    ariaLabel: 'lette',
  },
];

const Notifications: React.FC = () => {
  const device = useAppSelector(selectDevice);
  const isMobile = device.mediaIsPhone;
  const [isClicked, setIsClicked] = useState<boolean>(false);
  const notificationsList = useAppSelector(selectNotification);

  const dispatch = useDispatch();
  const pagination = useAppSelector(selectEntityPagination);

  const handleOnChangePage = (pageNumber: number = pagination?.pageNumber) => {
    dispatch(setEntityPagination({ pageNumber }));
  };

  useEffect(() => {
    dispatch(setEntityPagination({ pageSize: 3 }));
    dispatch(
      updateBreadcrumb([
        {
          label: 'Area notifiche',
          url: '/notifiche',
          link: false,
        },
      ])
    );
    dispatch(GetNotificationsList());
  }, []);

  return (
    <>
      {isMobile ? (
        <>
          <div
            className={clsx(
              'mt-5',
              isMobile && 'd-flex justify-content-center'
            )}
          >
            <PageTitle title='Area notifiche' />
          </div>
          <div
            className={clsx(
              'notifications-buttons-container',
              'd-flex',
              'justify-content-center',
              'mt-4',
              'btn'
            )}
          >
            <Button
              className={clsx('mr-3', 'notification-btn')}
              onClick={() => setIsClicked(false)}
              color='primary'
              outline={isClicked}
            >
              Tutte
            </Button>
            <Button
              className={clsx('notification-btn')}
              onClick={() => setIsClicked(true)}
              color='primary'
              outline={!isClicked}
            >
              Non lette
            </Button>
          </div>
        </>
      ) : (
        <>
          <PageTitle title='Le Tue Notifiche' />
          {NotificationCardPropsMock?.length ? (
            <div className='notifications-card-container pt-4 d-flex'>
              {NotificationCardPropsMock.map((notificationElement, i) => (
                <NotificationCard key={i} {...notificationElement} />
              ))}
            </div>
          ) : null}
        </>
      )}

      <Container className='pb-lg-5'>
        {notificationsList.length
          ? isClicked === true
            ? notificationsList
                .filter(
                  (notificationsList) => notificationsList.unread === true
                )
                .map((list, i) => (
                  <div key={i} role='button'>
                    <NotificationsList
                      // TODO update key with a unique value
                      {...list}
                      id={list.id || `${new Date().getTime()}`}
                      iconColor={list.iconColor || ''}
                      iconClass={list.iconClass || ''}
                      iconPadding={list.iconPadding || false}
                      unread
                    />
                  </div>
                ))
            : notificationsList.map((list, i) => (
                <div key={i} role='button'>
                  <NotificationsList
                    // TODO update key with a unique value
                    {...list}
                    id={list.id || `${new Date().getTime()}`}
                    iconPadding={list.iconPadding || false}
                    iconColor={list.iconColor || ''}
                    iconClass={list.iconClass || ''}
                    unread
                  />
                </div>
              ))
          : null}
      </Container>
      {isMobile ? (
        <div
          className='d-flex justify-content-center primary-color align-items-center py-4'
          role='button'
        >
          VEDI TUTTO ({notificationsList.length})
          <Icon
            icon='it-chevron-right'
            size='sm'
            className='ml-2'
            color='primary'
          />
        </div>
      ) : pagination?.pageNumber ? (
        <Paginator
          pageSize={notificationsList.length}
          activePage={pagination?.pageNumber}
          center
          refID='#notification'
          total={pagination.pageNumber}
          onChange={handleOnChangePage}
        />
      ) : null}
    </>
  );
};

export default memo(Notifications);

import { Button, Container, Icon } from 'design-react-kit';
import React, { memo, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Paginator } from '../../../components';
import PageTitle from '../../../components/PageTitle/pageTitle';
import { selectDevice } from '../../../redux/features/app/appSlice';
import { selectEntityPagination } from '../../../redux/features/citizensArea/citizensAreaSlice';
import { useAppSelector } from '../../../redux/hooks';
import './notifications.scss';
import { setEntityPagination } from '../../../redux/features/administrativeArea/administrativeAreaSlice';
import clsx from 'clsx';
import { GetNotificationsList } from '../../../redux/features/notification/notificationThunk';
import {
  removeNotify,
  selectNotificationList,
} from '../../../redux/features/notification/notificationSlice';
import Input from '../../../components/Form/input';
import MailRead from '/public/assets/img/mail-open.png';
import MailReadCheck from '/public/assets/img/mail-open-check.png';
import Delete from '/public/assets/img/delete.png';
import DeleteCheck from '/public/assets/img/delete-check.png';
import PillDropDown from '../../../components/PillDropDown/pillDropDown';
import Notification from './components/Notifications/notification';

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
  const [isClicked] = useState<boolean>(false);
  const notificationsList = useAppSelector(selectNotificationList);
  const dispatch = useDispatch();
  const pagination = useAppSelector(selectEntityPagination);
  const [newArray, setNewArray] = useState<string[]>([]);
  const temp: string[] = [];

  const handleOnChange = (value: string | number | boolean) => {
    const valueIndex = newArray.findIndex((v) => v === value.toString());
    if (valueIndex !== -1) {
      const newValues = [...newArray];
      newValues.splice(valueIndex, 1);
      setNewArray(newValues);
    } else {
      setNewArray([...newArray, value.toString()]);
    }
  };

  const handleDeleteNotifications = () => {
    if (newArray) {
      newArray.map((selectNotify) =>
        dispatch(removeNotify({ id: selectNotify }))
      );
    }
  };

  const alreadyRead = () => {
    //to be defined later
  };

  const handleOnChangeAll = (
    value: string | number | boolean | Date | string[] | undefined
  ) => {
    if (value) {
      notificationsList?.map((notification) => {
        if (notification.id) {
          temp.push(notification.id.toString());
        }
      });
      setNewArray(temp);
    } else {
      setNewArray([]);
    }
  };

  const notificationRender = notificationsList.length
    ? isClicked
      ? notificationsList
          .filter((notificationsList) => notificationsList.unread === true)
          .map((list, i) => (
            <div key={i} role='button' className='notifications-card-unread'>
              <Notification
                // TODO update key with a unique value
                {...list}
                icon={list.icon || ''}
                id={list.id || 0}
                iconColor={list.iconColor || ''}
                iconClass={list.iconClass || ''}
                iconPadding={list.iconPadding || false}
                unread={list.unread}
                handleOnChange={(value: string | number) => {
                  handleOnChange(value);
                }}
                notificationsPreview={false}
                isChecked={
                  newArray?.filter(
                    (id) => id?.toString() === list.id?.toString()
                  )?.length > 0
                }
              />
            </div>
          ))
      : notificationsList.map((list, i) => (
          <div key={i} role='button'>
            <Notification
              // TODO update key with a unique value
              {...list}
              icon={list.icon || ''}
              id={list.id || 0}
              iconPadding={list.iconPadding || false}
              iconColor={list.iconColor || ''}
              iconClass={list.iconClass || ''}
              unread={list.unread}
              handleOnChange={(value: string | number) => {
                handleOnChange(value);
              }}
              notificationsPreview={false}
              isChecked={
                newArray?.filter((id) => id?.toString() === list.id?.toString())
                  ?.length > 0
              }
            />
          </div>
        ))
    : null;

  const handleOnChangePage = (pageNumber: number = pagination?.pageNumber) => {
    dispatch(setEntityPagination({ pageNumber }));
  };
  useEffect(() => {
    dispatch(setEntityPagination({ pageSize: 3 }));
    dispatch(GetNotificationsList());
  }, []);

  return (
    <>
      {isMobile ? (
        <>
          <div className={clsx('mt-5', 'justify-content-center', 'container')}>
            <PageTitle title='Le Tue Notifiche' badge={true} />
            <div className='container'>
              <PillDropDown isNotifications={true} />
            </div>
          </div>
          {NotificationCardPropsMock?.length ? (
            <div className='notifications-card-container d-flex container'>
              <div className={clsx('d-flex')}>
                <div className='d-flex'>
                  <Button
                    className={clsx(
                      newArray.length
                        ? 'primary-color-b1'
                        : 'neutral-1-color-a4'
                    )}
                    onClick={alreadyRead}
                  >
                    {newArray.length ? (
                      <Icon
                        icon={MailReadCheck}
                        size='sm'
                        aria-label='Segna come letto'
                        className='mr-1'
                      />
                    ) : (
                      <Icon
                        icon={MailRead}
                        size='sm'
                        aria-label='Segna come letto'
                        className='mr-1'
                      />
                    )}
                  </Button>
                </div>
                <div className='d-flex'>
                  <Button
                    className={clsx(
                      newArray.length
                        ? 'primary-color-b1'
                        : 'neutral-1-color-a4'
                    )}
                    onClick={handleDeleteNotifications}
                  >
                    {newArray.length ? (
                      <Icon
                        icon={DeleteCheck}
                        size='sm'
                        aria-label='Elimina'
                        className='mr-1'
                      />
                    ) : (
                      <Icon
                        icon={Delete}
                        size='sm'
                        aria-label='Elimina'
                        className='mr-1'
                      />
                    )}
                  </Button>
                </div>
              </div>
              <Input
                className='notification-card-checkbar'
                type='checkbox'
                onInputChange={(value) => handleOnChangeAll(value)}
                checked={
                  newArray?.length === notificationsList.length &&
                  newArray.length > 0
                }
              />
            </div>
          ) : null}
        </>
      ) : (
        <>
          <div className='d-flex justify-content-between container'>
            <PageTitle title='Le Tue Notifiche' badge={true} />
            <PillDropDown isNotifications={true} />
          </div>
          {NotificationCardPropsMock?.length ? (
            <div className='notifications-card-container container d-flex'>
              <Input
                className='notification-card-checkbar'
                type='checkbox'
                onInputChange={(value) => handleOnChangeAll(value)}
                checked={
                  newArray?.length === notificationsList.length &&
                  newArray.length > 0
                }
              />
              <div className={clsx('d-flex')}>
                <div className='d-flex mr-5'>
                  <Button
                    className={clsx(
                      newArray.length
                        ? 'primary-color-b1'
                        : 'neutral-1-color-a4'
                    )}
                    onClick={alreadyRead}
                  >
                    {newArray.length ? (
                      <Icon
                        icon={MailReadCheck}
                        size='sm'
                        aria-label='Segna come letto'
                        className='mr-1'
                      />
                    ) : (
                      <Icon
                        icon={MailRead}
                        size='sm'
                        aria-label='Segna come letto'
                        className='mr-1'
                      />
                    )}
                    Segna come già letto
                  </Button>
                </div>
                <div className='d-flex mr-5'>
                  <Button
                    className={clsx(
                      newArray.length
                        ? 'primary-color-b1'
                        : 'neutral-1-color-a4'
                    )}
                    onClick={handleDeleteNotifications}
                  >
                    {newArray.length ? (
                      <Icon
                        icon={DeleteCheck}
                        size='sm'
                        aria-label='Elimina'
                        className='mr-1'
                      />
                    ) : (
                      <Icon
                        icon={Delete}
                        size='sm'
                        aria-label='Elimina'
                        className='mr-1'
                      />
                    )}
                    Elimina
                  </Button>
                </div>
              </div>
            </div>
          ) : null}
        </>
      )}
      <Container className='pb-lg-5 pb-5'>{notificationRender}</Container>
      {!isMobile && pagination?.pageNumber ? (
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

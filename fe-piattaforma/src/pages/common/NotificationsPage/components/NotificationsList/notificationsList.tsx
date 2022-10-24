import {
  Button,
  Icon,
  DropdownMenu,
  LinkList,
  Dropdown,
  DropdownToggle,
} from 'design-react-kit';
import React, { memo, useState } from 'react';
import './notificationsList.scss';
import clsx from 'clsx';
import { useAppSelector } from '../../../../../redux/hooks';
import { selectDevice } from '../../../../../redux/features/app/appSlice';
import { removeNotify } from '../../../../../redux/features/notification/notificationSlice';
import { useDispatch } from 'react-redux';
export interface NotificationsListI {
  name?: string;
  description?: string;
  object?: string;
  date?: string;
  icon?: string;
  hours?: string;
  id: string | number;
  iconColor: string;
  iconPadding: boolean;
  iconClass: string;
  unread: boolean;
}

const MessageList: React.FC<NotificationsListI> = (props) => {
  const {
    icon,
    name,
    description,
    object,
    date,
    hours,
    iconColor = 'white',
    iconPadding,
    iconClass,
    id,
  } = props;

  const [openUser, setOpenUser] = useState<boolean>(false);
  const dispatch = useDispatch();

  const handleRemoveNotify = () => {
    dispatch(removeNotify({ id: id }));
  };

  const userDropDown = () => (
    <Dropdown
      className={clsx(
        'p-0',
        'header-container__top__user-dropdown',
        'd-flex',
        'notifications-list-container__more-items',
        'justify-content-end'
      )}
      isOpen={openUser}
      toggle={() => setOpenUser(!openUser)}
    >
      <DropdownToggle
        caret
        className='complementary-1-color-a1 shadow-none btn-secondary-none'
      >
        <div className='d-flex notifications-list-container__more-items justify-content-end'>
          <Icon
            icon='it-more-items'
            size='lg'
            className='mr-2'
            color='primary'
          />
        </div>
      </DropdownToggle>
      <DropdownMenu role='menu' tag='ul'>
        <LinkList role='none'>
          <li role='none' className='d-flex align-items-center px-4'>
            <Icon
              className='pr-2'
              color='primary'
              icon='it-check-circle'
              size='sm'
            />
            <Button
              className={clsx(
                'primary-color-b1',
                'py-2',
                'w-100',
                'd-flex',
                'justify-content-between'
              )}
              role='menuitem'
            >
              Segna come letta
            </Button>
          </li>
          <li role='none' className='d-flex align-items-center px-4'>
            <Icon
              className='pr-2'
              color='primary'
              icon='it-close-circle'
              size='sm'
            />
            <Button
              className={clsx(
                'primary-color-b1',
                'py-2',
                'w-100',
                'd-flex',
                'justify-content-between'
              )}
              onClick={handleRemoveNotify}
            >
              Rimuovi notifica
            </Button>
          </li>
        </LinkList>
      </DropdownMenu>
    </Dropdown>
  );

  const device = useAppSelector(selectDevice);
  const isMobile = device.mediaIsPhone;
  return (
    <div
      className={clsx(
        'd-flex',
        'flex-column',
        'notifications-list-container',
        'mt-3'
      )}
    >
      <div className='d-flex'>
        <div className={isMobile ? 'ml-2' : ''}>
          {icon ? (
            <Icon
              icon={icon}
              size='lg'
              className={iconClass}
              color={iconColor}
              padding={iconPadding}
            />
          ) : null}
        </div>
        <div
          className={clsx(
            isMobile
              ? 'd-flex flex-column ml-1'
              : 'd-flex flex-row justify-content-between notifications-list-container__text'
          )}
        >
          <p className='neutral-1-color-a8'>
            <strong className='notifications-list-container__name'>
              {name}
            </strong>
            {description} <strong>{object}</strong>
          </p>
        </div>
        {userDropDown()}
      </div>
      {isMobile ? (
        <div
          className={clsx(
            'd-flex',
            'align-items-center',
            'pl-5',
            'pb-2',
            'mt-3',
            'ml-2'
          )}
        >
          <Icon icon='it-calendar' size='xs' color='primary' />
          <p className='neutral-1-color-a8 px-2 mr-4'>{date}</p>
        </div>
      ) : (
        <div
          className={clsx(
            'd-flex',
            'align-items-center',
            'pl-5',
            'pb-2',
            'ml-2'
          )}
        >
          <Icon icon='it-calendar' size='xs' color='primary' />
          <p className='neutral-1-color-a8 px-2 mr-4'>{date}</p>
          <Icon icon='it-clock' size='xs' color='primary' />
          <p className='neutral-1-color-a8 px-2'>{hours}</p>
        </div>
      )}
    </div>
  );
};

export default memo(MessageList);

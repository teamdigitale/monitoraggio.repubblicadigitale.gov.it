import {
  Button,
  Icon,
  DropdownMenu,
  LinkList,
  Dropdown,
  DropdownToggle,
} from 'design-react-kit';
import React, { memo, useState } from 'react';
import './notification.scss';
import clsx from 'clsx';
import { useAppSelector } from '../../../../../redux/hooks';
import { selectDevice } from '../../../../../redux/features/app/appSlice';
import { removeNotify } from '../../../../../redux/features/notification/notificationSlice';
import { useDispatch } from 'react-redux';
import Input from '../../../../../components/Form/input';
export interface NotificationI {
  name?: string;
  description?: string;
  object?: string;
  date?: string;
  icon?: string;
  hours?: string;
  iconColor?: string;
  iconPadding?: boolean;
  iconClass?: string;
  unread?: boolean | undefined;
  id: number;
  handleOnChange?: (value: string | number) => void;
  notificationsPreview?: boolean;
  isChecked?: boolean;
  onClick?: () => void;
}

const Notification: React.FC<NotificationI> = (props) => {
  const {
    icon = '',
    name,
    description,
    object,
    date,
    hours,
    iconColor = 'white',
    iconPadding = true,
    iconClass = '',
    id = 0,
    unread,
    handleOnChange,
    notificationsPreview = true,
    isChecked = false,
    onClick = () => ({}),
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
        'justify-content-end',
        'notifications-list-container__more-items',
        unread && 'notifications-list-container__more-items-unread'
      )}
      isOpen={openUser}
      toggle={() => setOpenUser(!openUser)}
    >
      <DropdownToggle
        caret
        className='complementary-1-color-a1 shadow-none btn-secondary-none bg-transparent'
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
            <Button
              className={clsx(
                'primary-color-b1',
                'py-2',
                'w-100',
                'd-flex',
                'justify-content-between'
              )}
              role='menuitem'
              onClick={onClick}
            >
              <Icon
                className='pr-2'
                color='primary'
                icon='it-check-circle'
                size='sm'
              />
              Segna come letta
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
        'pt-3',
        unread && 'notifications-list-container__unread'
      )}
    >
      <div className='d-flex justify-content-between align-items-center'>
        <div className='d-flex'>
          {!isMobile && !notificationsPreview ? (
            <Input
              className='notification-list-checkbar'
              type='checkbox'
              onInputChange={() => {
                if (handleOnChange) {
                  handleOnChange(id);
                }
              }}
              checked={isChecked}
            />
          ) : null}
          <div
            className={clsx(
              isMobile ? 'ml-2' : '',
              notificationsPreview && 'ml-3'
            )}
          >
            <Icon
              icon={icon}
              size=''
              className={iconClass}
              color={iconColor}
              padding={iconPadding}
            />
          </div>
          <div
            className={clsx(
              isMobile
                ? 'd-flex flex-column ml-1'
                : 'd-flex flex-row justify-content-between notifications-list-container__text',
              notificationsPreview && 'ml-3'
            )}
          >
            <p className='neutral-1-color-a8'>
              <strong className='notifications-list-container__name'>
                {name}
              </strong>{' '}
              {description} <strong>{object}</strong>
            </p>
          </div>
        </div>
        {notificationsPreview ? (
          userDropDown()
        ) : isMobile && !notificationsPreview ? (
          <div>
            <Input
              className='notification-list-checkbar'
              type='checkbox'
              onInputChange={() => {
                if (handleOnChange) {
                  handleOnChange(id);
                }
              }}
              checked={isChecked}
            />
          </div>
        ) : (
          <div className='notifications-list-container__icon-close'>
            <Icon
              color='primary'
              icon='it-close'
              size='lg'
              onClick={handleRemoveNotify}
            />
          </div>
        )}
      </div>
      <div
        className={clsx('d-flex', 'align-items-center', 'pl-5', 'pb-2', 'ml-4')}
      >
        <Icon icon='it-calendar' size='xs' color='primary' />
        <p className='neutral-1-color-a8 px-2 mr-4'>{date}</p>
        <Icon icon='it-clock' size='xs' color='primary' />
        <p className='neutral-1-color-a8 px-2'>{hours}</p>
      </div>
    </div>
  );
};

export default memo(Notification);

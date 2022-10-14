import clsx from 'clsx';
import {
  Button,
  Dropdown,
  DropdownMenu,
  DropdownToggle,
  Icon,
  LinkList,
} from 'design-react-kit';
import React, { useState } from 'react';
import { selectDevice } from '../../redux/features/app/appSlice';
import { useAppSelector } from '../../redux/hooks';
import AvatarInitials, {
  AvatarSizes,
  AvatarTextSizes,
} from '../Avatar/AvatarInitials/avatarInitials';

interface ReportCardI {
  id: string;
  author: string;
  reason: string;
  date: string;
}

const ReportCard: React.FC<ReportCardI> = ({ reason, date }) => {

  const device = useAppSelector(selectDevice);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const commentDropdownOptions = [
    {
      optionName: 'ELIMINA',
      DropdowniIcon: {
        icon: 'it-delete',
        color: 'primary',
      },
      // action: () => deleteComment()
    },
    {
      optionName: 'MODIFICA',
      DropdowniIcon: {
        icon: 'it-pencil',
        color: 'primary',
      },
      // action: () => editComment
    },
  ];

  const reportDropdown = () => (
    <Dropdown
      className='comment-container__comment-dropdown'
      isOpen={isOpen}
      toggle={() => setIsOpen(!isOpen)}
    >
      <DropdownToggle caret className='bg-white shadow-none'>
        <div
          className={clsx('d-inline-flex', 'align-items-center', 'text.white')}
        >
          <div>
            <Button>
              <Icon icon='it-more-items' color='primary' />
            </Button>
          </div>
        </div>
      </DropdownToggle>
      <DropdownMenu role='menu' tag='ul'>
        <LinkList role='none'>
          {commentDropdownOptions.map((item, i) => (
            <li key={i} role='none' onClick={() => setIsOpen(!isOpen)}>
              <Button
                className={clsx('primary-color-b1', 'py-2', 'w-100')}
                role='menuitem'
                onClick={() => console.log(item.optionName)}
              >
                <div
                  className={clsx(
                    'd-flex',
                    'flex-row',
                    'justify-content-around',
                    'align-items-center'
                  )}
                >
                  <div>
                    <Icon
                      icon={item.DropdowniIcon.icon}
                      color={item.DropdowniIcon.color}
                    />
                  </div>
                  <div>{item.optionName}</div>
                </div>
              </Button>
            </li>
          ))}
        </LinkList>
      </DropdownMenu>
    </Dropdown>
  );

  return (
    <div className='report-card-container__card py-4 pl-4'>
      <div className='d-flex flex-column'>
        <div
          className={clsx(
            'comment-container',
            'd-flex',
            'flex-row',
            'justify-content-between',
            'align-items-center',
            'w-100'
          )}
        >
          <div
            className={clsx(
              'd-flex',
              'flex-row',
              'justify-content-start',
              'align-items-center'
            )}
          >
            <div className='mr-2'>
              <AvatarInitials
                user={{ uName: 'Tizio', uSurname: 'Caio' }}
                size={AvatarSizes.Big}
                font={AvatarTextSizes.Big}
              />
            </div>
            <div className='d-flex flex-column align-items-start'>
              <div
                className={clsx(
                  'd-flex',
                  device.mediaIsDesktop ? 'flex-row' : 'flex-column',
                  'align-items-center',
                  'justify-content-start'
                )}
              >
                <span className='text-nowrap'>
                  <strong>
                    Tizio Caio
                  </strong>
                </span>
                {' - '}
                <span>
                  {date}
                </span>

              </div>
              <p>
                {' '}
                Ha segnalato il commento di <strong>Mario Rossi</strong> con la
                seguente motivazione:{' '}
              </p>
            </div>
          </div>
          <div className='d-flex flex-row justify-content-end align-items-center'>
            <Icon icon='it-error' color='danger' />
            {reportDropdown()}
          </div>
        </div>
        <div className='report-card-container__report-section p-4 my-4 ml-5'>
          <p>{reason}</p>
        </div>
        <div className='report-border ml-5' />
      </div>

      <div className='p-2'>
        <Button
          size='xs'
          className='like-and-comment-buttons d-flex flex-row justify-content-around'
        >
          <p className='primary-color font-weight-bold pl-4 text-nowrap'>
            VAI AL DETTAGLIO
          </p>
          <Icon icon='it-chevron-right' color='primary' size='' />
        </Button>
      </div>
    </div>
  );
};

export default ReportCard;

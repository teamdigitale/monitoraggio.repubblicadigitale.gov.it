import {
  Icon,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  LinkList,
  Button,
  Chip,
  ChipLabel,
} from 'design-react-kit';
import React, { useState } from 'react';
import iconFile from '../../../public/assets/img/icon-file-blue-medium.png';
import DetailCard from '../DetailCard/detailCard';
import './documentDetail.scss';
import clsx from 'clsx';
//import { useLocation } from 'react-router-dom';
import SocialBar from '../Comments/socialBar';
import { useAppSelector } from '../../redux/hooks';
import { selectDevice } from '../../redux/features/app/appSlice';
import { openModal } from '../../redux/features/modal/modalSlice';
import { useDispatch } from 'react-redux';
import { selectUser } from '../../redux/features/user/userSlice';
import { GetItemDetail, ManageItemEvent } from '../../redux/features/forum/forumThunk';

export interface CardDocumentDetailI {
  id?: string;
  author: string;
  title: string;
  category_label: string;
  date: string;
  description: string;
  comment_count: number;
  attachment?: string;
  external_link?: string;
  entity?: string;
  entity_type?: string;
  intervention?: string;
  program_label?: string;
  tags?: string;
  downloads?: number;
  user_like?: boolean;
  likes?: number;
  views?: number;
  section?: 'community' | 'documents';
  onDeleteClick?: () => void;
  onEditClick?: () => void;
  onReportClick?: () => void;
}

const SectionDetail: React.FC<CardDocumentDetailI> = (props) => {
  const {
    // author,
    id,
    title,
    category_label,
    date,
    description,
    comment_count,
    attachment,
    entity,
    entity_type,
    external_link,
    intervention,
    program_label,
    tags,
    downloads,
    user_like,
    likes,
    views,
    section,
    onDeleteClick = () => ({}),
    onEditClick = () => ({}),
    onReportClick = () => ({}),
  } = props;
  //const location = useLocation();
  const device = useAppSelector(selectDevice);
  const dispatch = useDispatch();
  const userId = useAppSelector(selectUser)?.id
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const documentDetailDropdownOptions = [
    {
      optionName: 'ELIMINA',
      DropdownIcon: {
        icon: 'it-delete',
        color: 'primary',
      },
      action: () => onDeleteClick(),
    },
    {
      optionName: 'MODIFICA',
      DropdownIcon: {
        icon: 'it-pencil',
        color: 'primary',
      },
      action: () => onEditClick(),
    },
    {
      optionName: 'SEGNALA',
      DropdownIcon: {
        icon: 'it-error',
        color: 'danger',
      },
      action: () => onReportClick(),
    },
  ];

  const documentDetailDropdown = () => (
    <Dropdown
      className='document-card-detail-container__document-detail-dropdown'
      isOpen={isOpen}
      toggle={() => setIsOpen(!isOpen)}
    >
      <DropdownToggle caret className='bg-white'>
        <div
          className={clsx('d-inline-flex', 'align-items-center', 'text.white')}
        >
          <div>
            <Icon icon='it-more-items' color='primary' />
          </div>
        </div>
      </DropdownToggle>
      <DropdownMenu role='menu' tag='ul'>
        <LinkList role='none'>
          {documentDetailDropdownOptions.map((item, i) => (
            <li key={i} role='none' onClick={() => setIsOpen(!isOpen)}>
              <Button
                className={clsx('primary-color-b1', 'px-4', 'w-75')}
                role='menuitem'
                onClick={() => item.action && item.action()}
              >
                <div
                  className={clsx(
                    'd-flex',
                    'flex-row',
                    'justify-content-start',
                    'align-items-center'
                  )}
                >
                  <div className='pr-2'>
                    <Icon
                      icon={item.DropdownIcon.icon}
                      color={item.DropdownIcon.color}
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
    <div
      className={clsx(
        'document-card-detail-container',
        device.mediaIsPhone ? 'p-3' : 'px-5 py-4',
        'mb-4'
      )}
    >
      <div
        className={clsx(
          'd-flex',
          'align-items-center',
          'justify-content-between',
          'mb-4'
        )}
      >
        <div>
          {
            <div className='document-card-detail-container__typology'>
              <span className='font-weight-bold'>{category_label}</span>
              <span> - </span>
              <span>{date}</span>
            </div>
          }
        </div>
        {documentDetailDropdown()}
      </div>
      <p className='document-card-detail-container__title mb-4 font-weight-bold'>
        {title}
      </p>
      <div
        className={clsx(
          device.mediaIsPhone ? 'd-flex flex-column' : 'd-flex',
          'align-items-center',
          'mb-3'
        )}
      >
        {section === 'documents' ? (
          <img
            src={iconFile}
            alt='icon-file'
            className={clsx(
              device.mediaIsPhone
                ? 'mb-4'
                : 'document-card-detail-container__img-icon-file mr-4'
            )}
          />
        ) : null}
        <p>{description}</p>
      </div>
      {!device.mediaIsPhone ? (
        <div className='mb-4'>
          {attachment ? (
            <>
              <Icon icon='it-download' size='sm' color='primary' />
              <Button color='link' className='btn-download-file'>
                <b>
                  <u>Scarica allegato</u>
                </b>
              </Button>{' '}
            </>
          ) : null}
          {external_link ? (
            <>
              <Icon icon='it-external-link' size='sm' color='primary' />
              <Button color='link' className='btn-external-link'>
                <b>
                  <u>Link esterno</u>
                </b>
              </Button>{' '}
            </>
          ) : null}
        </div>
      ) : (
        <div className='mb-4'>
          <Icon icon='it-download' size='sm' color='primary' />
          <Button color='link' className='btn-download-file'>
            <b>
              <u>Scarica allegato</u>
            </b>
          </Button>
        </div>
      )}
      {tags ? (
        <div className='d-flex flex-row w-100 mb-4 align-items-center'>
          <b className='mr-2'>TAG:</b>
          <div className='d-flex align-items-center'>
            {tags.split(';').map((tag, i) => (
              <Chip key={i} className='mr-2'>
                <ChipLabel>{tag}</ChipLabel>
              </Chip>
            ))}
          </div>
        </div>
      ) : null}
      <DetailCard
        isCommunity={section === 'community'}
        entity={entity}
        entity_type={entity_type}
        intervention={intervention}
        program_label={program_label}
      />
      <div className='border-box-container pt-5 mb-4'></div>
      <SocialBar
        comments={comment_count}
        likes={likes}
        views={views}
        downloads={downloads}
        onLike={section === 'community' ? async () => {
          if (id) {
            if (user_like as boolean) {
              await dispatch(ManageItemEvent(id, 'unlike'))
            } else {
              await dispatch(ManageItemEvent(id, 'like'))
            }
            userId && dispatch(GetItemDetail(id, userId, 'community'))
          }
        } : undefined}
        onComment={() =>
          dispatch(
            openModal({
              id: 'comment-modal',
              payload: {
                title: 'Aggiungi commento',
                action: 'comment',
                entity: section === 'community' ? 'community' : 'document'
              },
            })
          )
        }
      />
    </div>
  );
};

export default SectionDetail;

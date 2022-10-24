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
import React, { useEffect, useState } from 'react';
import iconFile from '../../../public/assets/img/icon-file-blue-medium.png';
import DetailCard from '../DetailCard/detailCard';
import './documentDetail.scss';
import clsx from 'clsx';
import SocialBar from '../Comments/socialBar';
import { useAppSelector } from '../../redux/hooks';
import { selectDevice } from '../../redux/features/app/appSlice';
import { openModal } from '../../redux/features/modal/modalSlice';
import { useDispatch } from 'react-redux';
import { selectUser } from '../../redux/features/user/userSlice';
import {
  ActionTracker,
  GetItemDetail,
  ManageItemEvent,
} from '../../redux/features/forum/forumThunk';
import { cleanDrupalFileURL } from '../../utils/common';
import { formatDate } from '../../utils/datesHelper';
import useGuard from '../../hooks/guard';

export interface CardDocumentDetailI {
  id?: string;
  author?: string;
  title: string;
  category: string;
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
  isDocument?: boolean | undefined;
  onDeleteClick?: () => void;
  onEditClick?: () => void;
  onReportClick?: () => void;
}

const SectionDetail: React.FC<CardDocumentDetailI> = (props) => {
  const {
    author,
    id,
    title,
    category,
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
    isDocument,
    section,
    onDeleteClick = () => ({}),
    onEditClick = () => ({}),
    onReportClick = () => ({}),
  } = props;

  const [detailDropdownOptions, setDetailDropdownOptions] = useState<any[]>([]);
  const device = useAppSelector(selectDevice);
  const dispatch = useDispatch();
  const userId = useAppSelector(selectUser)?.id;
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { hasUserPermission } = useGuard();

  const trackDownload = () => {
    if (id) {
      dispatch(ManageItemEvent(id, 'downloaded'));
      dispatch(
        ActionTracker({
          target: 'tnd',
          action_type: 'VISUALIZZAZIONE-DOWNLOAD',
          event_type: 'DOCUMENTI',
          category,
        })
      );
    }
  };

  const deleteOption = {
    optionName: 'ELIMINA',
    DropdownIcon: {
      icon: 'it-delete',
      color: 'primary',
    },
    action: onDeleteClick,
  };

  const editOption = {
    optionName: 'MODIFICA',
    DropdownIcon: {
      icon: 'it-pencil',
      color: 'primary',
    },
    action: onEditClick,
  };

  const reportOption = {
    optionName: 'SEGNALA',
    DropdownIcon: {
      icon: 'it-error',
      color: 'danger',
    },
    action: onReportClick,
  };

  const setDetailDropdownOptionsByPermission = () => {
    const authorizedOption = [];
    if (
      hasUserPermission([
        section === 'documents' || isDocument
          ? 'del.doc'
          : section === 'community'
          ? 'del.topic'
          : 'hidden',
      ]) && author?.toString() === userId?.toString()
    ) {
      authorizedOption.push(deleteOption);
    }
    if (
      hasUserPermission([
        section === 'documents' || isDocument
          ? 'upd.doc'
          : section === 'community'
          ? 'upd.topic'
          : 'hidden',
      ]) && author?.toString() === userId?.toString()
    ) {
      authorizedOption.push(editOption);
    }
    if (
      hasUserPermission([
        section === 'documents' || isDocument
          ? 'rprt.doc'
          : section === 'community'
          ? 'rprt.topic'
          : 'hidden',
      ])
    ) {
      authorizedOption.push(reportOption);
    }
    setDetailDropdownOptions(authorizedOption);
  };

  useEffect(() => {
    setDetailDropdownOptionsByPermission();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [section, author, userId]);

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
          {detailDropdownOptions.map((item, i) => (
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
              <span>{date && formatDate(date, 'shortDate')}</span>
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
        {section === 'documents' || isDocument ? (
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
            <div className='d-flex justify-content-start'>
              <Button
                className={clsx(
                  'primary-color-b1',
                  'd-flex',
                  'justify-content-start',
                  'px-0',
                  'pb-5'
                )}
                onClick={trackDownload}
              >
                <div className='d-flex align-items-center'>
                  <Icon
                    icon='it-download'
                    color='primary'
                    size='sm'
                    aria-label='Scarica allegato'
                  />
                  <a
                    href={cleanDrupalFileURL(attachment)}
                    download
                    target='_blank'
                    rel='noreferrer'
                    className='ml-2'
                  >
                    <p className='font-weight-bold h6 mb-0'>Scarica allegato</p>
                  </a>
                </div>
              </Button>
            </div>
          ) : null}
          {external_link ? (
            <div className='d-flex justify-content-start'>
              <Button
                className={clsx(
                  'primary-color-b1',
                  'd-flex',
                  'justify-content-start',
                  'px-0',
                  'pb-5'
                )}
              >
                <div className='d-flex align-items-center'>
                  <Icon
                    icon='it-external-link'
                    color='primary'
                    size='sm'
                    aria-label='Link esterno'
                  />
                  <a
                    href={cleanDrupalFileURL(external_link)}
                    target='_blank'
                    rel='noreferrer'
                    className='ml-2'
                  >
                    <p className='font-weight-bold h6 mb-0'>Link esterno</p>
                  </a>
                </div>
              </Button>
            </div>
          ) : null}
        </div>
      ) : attachment ? (
        <div className='mb-4'>
          <Button
            className={clsx(
              'primary-color-b1',
              'd-flex',
              'justify-content-start',
              'px-0',
              'pb-5'
            )}
            onClick={trackDownload}
          >
            <div className='d-flex align-items-center'>
              <Icon
                icon='it-download'
                color='primary'
                size='sm'
                aria-label='Scarica allegato'
              />
              <a
                href={cleanDrupalFileURL(attachment)}
                download
                target='_blank'
                rel='noreferrer'
                className='ml-2'
              >
                <p className='font-weight-bold h6 mb-0'>Scarica allegato</p>
              </a>
            </div>
          </Button>
        </div>
      ) : null}
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
        user_like={user_like}
        onLike={
          section === 'community'
            ? async () => {
                if (id) {
                  if (user_like as boolean) {
                    await dispatch(ManageItemEvent(id, 'unlike'));
                  } else {
                    await dispatch(ManageItemEvent(id, 'like'));
                    dispatch(
                      ActionTracker({
                        target: 'tnd',
                        action_type: 'LIKE',
                        event_type: 'TOPIC',
                        category,
                      })
                    );
                  }
                  userId && dispatch(GetItemDetail(id, userId, 'community'));
                }
              }
            : undefined
        }
        onComment={() =>
          dispatch(
            openModal({
              id: 'comment-modal',
              payload: {
                title: 'Aggiungi commento',
                action: 'comment',
                entity: section === 'community' ? 'community' : 'document',
              },
            })
          )
        }
      />
    </div>
  );
};

export default SectionDetail;

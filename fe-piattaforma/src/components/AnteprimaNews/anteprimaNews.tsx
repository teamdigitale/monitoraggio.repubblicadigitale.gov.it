import React, { useEffect, useState } from 'react';
import './anteprimaNews.scss';
import {
  Button,
  Dropdown,
  DropdownMenu,
  DropdownToggle,
  Icon,
  LinkList,
} from 'design-react-kit';
import { DetailCard } from '../index';
import clsx from 'clsx';
import { useAppSelector } from '../../redux/hooks';
import { selectDevice } from '../../redux/features/app/appSlice';
import SocialBar from '../Comments/socialBar';
import { useDispatch } from 'react-redux';
import { openModal } from '../../redux/features/modal/modalSlice';
import coverPlaceholder from '/public/assets/img/img-bacheca-digitale-dettaglio.png';
import HTMLParser from '../General/HTMLParser/HTMLParse';
import {
  ActionTracker,
  GetItemDetail,
  ManageItemEvent,
} from '../../redux/features/forum/forumThunk';
import { selectUser } from '../../redux/features/user/userSlice';
import { cleanDrupalFileURL } from '../../utils/common';
import { formatDate } from '../../utils/datesHelper';
import useGuard from '../../hooks/guard';

export interface AnteprimaBachecaNewsI {
  author?: string;
  id?: string;
  category?: string;
  category_label?: string;
  date?: string;
  title?: string;
  description?: string;
  program_label?: string | undefined;
  intervention?: string;
  entity?: string | undefined;
  entity_type?: string | undefined;
  attachment?: string;
  cover?: string;
  enable_comments?: boolean;
  likes?: number;
  views?: number;
  user_like?: boolean;
  comment_count?: number;
  isModalPreview?: boolean;
  onDeleteNews?: () => void;
  onEditNews?: () => void;
  onReportNews?: () => void;
}

const AnteprimaBachecaNews: React.FC<AnteprimaBachecaNewsI> = (props) => {
  const {
    author,
    id,
    category,
    category_label,
    date,
    title,
    cover,
    description,
    attachment,
    program_label,
    intervention,
    entity,
    entity_type,
    likes,
    views,
    user_like,
    enable_comments,
    comment_count,
    isModalPreview,
    onDeleteNews = () => ({}),
    onEditNews = () => ({}),
    onReportNews = () => ({}),
  } = props;

  const [newsDetailDropdownOptions, setNewsDetailDropdownOptions] = useState<
    any[]
  >([]);
  const device = useAppSelector(selectDevice);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const dispatch = useDispatch();
  const userId = useAppSelector(selectUser)?.id;
  const { hasUserPermission } = useGuard();

  const deleteOption = {
    optionName: 'ELIMINA',
    DropdownIcon: {
      icon: 'it-delete',
      color: 'primary',
    },
    action: onDeleteNews,
  };

  const editOption = {
    optionName: 'MODIFICA',
    DropdownIcon: {
      icon: 'it-pencil',
      color: 'primary',
    },
    action: onEditNews,
  };

  const reportOption = {
    optionName: 'SEGNALA',
    DropdownIcon: {
      icon: 'it-error',
      color: 'danger',
    },
    action: onReportNews,
  };

  const setNewsDetailDropdownOptionsByPermission = () => {
    const authorizedOption = [];
    if (
      hasUserPermission(['del.news']) &&
      author?.toString() === userId?.toString()
    ) {
      authorizedOption.push(deleteOption);
    }
    if (
      hasUserPermission(['upd.news']) &&
      author?.toString() === userId?.toString()
    ) {
      authorizedOption.push(editOption);
    }
    if (hasUserPermission(['rprt.news'])) {
      authorizedOption.push(reportOption);
    }
    setNewsDetailDropdownOptions(authorizedOption);
  };

  useEffect(() => {
    setNewsDetailDropdownOptionsByPermission();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [author, userId]);

  const newsDetailDropdown = () => (
    <Dropdown
      className='anteprima-news-container__news-dropdown'
      isOpen={isOpen}
      toggle={() => setIsOpen(!isOpen)}
    >
      <DropdownToggle caret className='shadow-none bg-white'>
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
      <DropdownMenu role='none' tag='ul'>
        <LinkList role='none'>
          {newsDetailDropdownOptions.map((item, i) => (
            <li key={i} role='none' onClick={() => setIsOpen(!isOpen)}>
              <Button
                className={clsx('primary-color-b1', 'py-2', 'w-100')}
                role='menuitem'
                onClick={() => item.action && item.action()}
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
    <div className={clsx(device.mediaIsPhone ? 'ml-3' : null)}>
      <div
        className={clsx(
          'bg-image' /*  device.mediaIsPhone ? 'mr-3' : device.mediaIsTablet ? 'mx-1': null */
        )}
        style={{
          backgroundImage: `url(${
            cover ? cleanDrupalFileURL(cover) : coverPlaceholder
          })`,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          zIndex: '0',
          backgroundSize: '100%',
        }}
      />

      <div
        className={clsx(
          'anteprima-news-container',
          !device.mediaIsPhone ? 'px-5 pt-5 pb-4 mx-auto' : 'px-3 py-3',
          'position-relative'
        )}
      >
        <div>
          <div className='d-flex justify-content-between align-items-center'>
            <div className='anteprima-news-container__category'>
              <span className='font-weight-bold'>{category_label}</span>
              {date ? ' - ' : ''}
              <span>{date && formatDate(date, 'shortDate')}</span>
            </div>
            {!isModalPreview && (
              <div className='d-flex flex-row'>{newsDetailDropdown()}</div>
            )}
          </div>
          <p className='anteprima-news-container__title pt-4 pb-5'>
            <b>{title}</b>
          </p>
          <div className='pb-4'>
            <HTMLParser html={description} />
          </div>
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
          <DetailCard
            program_label={program_label}
            intervention={intervention}
            entity={entity}
            entity_type={entity_type}
          />
          {!isModalPreview && (
            <>
              <div className='border-box-container pt-5 mb-3'></div>
              <SocialBar
                views={views}
                likes={likes}
                comments={comment_count}
                user_like={user_like}
                onLike={async () => {
                  if (id) {
                    if (user_like as boolean) {
                      await dispatch(ManageItemEvent(id, 'unlike'));
                    } else {
                      await dispatch(ManageItemEvent(id, 'like'));
                      dispatch(
                        ActionTracker({
                          target: 'tnd',
                          action_type: 'LIKE',
                          event_type: 'NEWS',
                          category,
                        })
                      );
                    }
                    userId && dispatch(GetItemDetail(id, userId, 'board'));
                  }
                }}
                onComment={
                  enable_comments
                    ? () =>
                        dispatch(
                          openModal({
                            id: 'comment-modal',
                            payload: {
                              title: 'Aggiungi commento',
                              action: 'comment',
                              entity: 'board',
                              category,
                            },
                          })
                        )
                    : undefined
                }
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AnteprimaBachecaNews;

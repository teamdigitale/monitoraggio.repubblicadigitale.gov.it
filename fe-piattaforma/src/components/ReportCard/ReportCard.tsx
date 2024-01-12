import clsx from 'clsx';
import {
  Button,
  Dropdown,
  DropdownMenu,
  DropdownToggle,
  Icon,
  LinkList,
} from 'design-react-kit';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  getAnagraphicID,
  selectAnagraphics,
} from '../../redux/features/anagraphic/anagraphicSlice';
import { selectDevice } from '../../redux/features/app/appSlice';
import {
  DeleteReport,
  GetReportsList,
} from '../../redux/features/forum/reports/reportsThunk';
import { useAppSelector } from '../../redux/hooks';
import { formatDate } from '../../utils/datesHelper';
import AvatarInitials, {
  AvatarSizes,
  AvatarTextSizes,
} from '../Avatar/AvatarInitials/avatarInitials';

interface ReportCardI {
  id: string;
  author?: string;
  item_author: string;
  comment_author: string;
  comment_post_date?: string;
  item_id: string;
  item_title?: string;
  item_type: 'board_item' | 'forum_item' | 'document_item';
  reason: string;
  date: string;
}

const ReportCard: React.FC<ReportCardI> = ({
  author,
  item_author,
  comment_author,
  comment_post_date,
  reason,
  date,
  id,
  item_type,
  item_id,
  item_title,
}) => {
  const device = useAppSelector(selectDevice);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const usersAnagraphic = useAppSelector(selectAnagraphics);

  const authorAnagraphic = usersAnagraphic[author || 0] || {
    nome: 'Utente',
    cognome: 'Anonimo',
  };

  useEffect(() => {
    if (author && !authorAnagraphic?.id) {
      dispatch(getAnagraphicID({ id: author }));
    }

    if (item_author && !usersAnagraphic[item_author]?.id) {
      dispatch(getAnagraphicID({ id: item_author }));
    }

    if (comment_author && !usersAnagraphic[comment_author]?.id) {
      dispatch(getAnagraphicID({ id: comment_author }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authorAnagraphic, usersAnagraphic]);

  const commentDropdownOptions = [
    {
      optionName: 'RIMUOVI SEGNALAZIONE',
      action: async () => {
        await dispatch(DeleteReport(id));
        dispatch(GetReportsList());
      },
    },
  ];

  const getItemType = (short = false) => {
    switch (item_type) {
      case 'board_item':
        return short ? 'news' : 'la news';
      case 'forum_item':
        return short ? 'topic' : 'il topic';
      case 'document_item':
        return short ? 'documento' : 'il documento';
      default:
        return '';
    }
  };

  const reportDropdown = () => (
    <Dropdown
      className='comment-container__comment-dropdown'
      isOpen={isOpen}
      toggle={() => setIsOpen(!isOpen)}
    >
      <DropdownToggle
        caret
        className='bg-white shadow-none'
        aria-label='toggle menu azioni'
      >
        <div
          className={clsx('d-inline-flex', 'align-items-center', 'text.white')}
        >
          <Icon
            icon='it-more-items'
            color='primary'
            aria-label='Mostra azioni'
            aria-hidden
          />
        </div>
      </DropdownToggle>
      <DropdownMenu role='menu' tag='ul'>
        <LinkList role='list' style={{ width: '190px' }}>
          {commentDropdownOptions.map((item, i) => (
            <li key={i} role='none' onClick={() => setIsOpen(!isOpen)}>
              <Button
                className={clsx(
                  'primary-color-b1',
                  'py-2',
                  'w-100',
                  'd-flex',
                  'flex-row',
                  'justify-content-around',
                  'align-items-center'
                )}
                role='menuitem'
                onClick={() => item.action()}
              >
                {/* <Icon
                  icon={item.DropdowniIcon.icon}
                  color={item.DropdowniIcon.color}
                  aria-label={item.optionName}
                  aria-hidden
                /> */}
                <span>{item.optionName}</span>
              </Button>
            </li>
          ))}
        </LinkList>
      </DropdownMenu>
    </Dropdown>
  );

  return (
    <div className='report-card-container__card py-4'>
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
                user={{
                  uName: authorAnagraphic?.nome,
                  uSurname: authorAnagraphic?.cognome,
                }}
                size={AvatarSizes.Medium}
                font={AvatarTextSizes.Medium}
              />
            </div>
            <div
              className={clsx(
                'd-flex align-items-start justify-content-start',
                device.mediaIsPhone && 'flex-column'
              )}
            >
              <span>
                <strong>
                  {authorAnagraphic?.nome}&nbsp;{authorAnagraphic?.cognome}
                </strong>
              </span>
              {!device.mediaIsPhone && <span>&nbsp;—&nbsp;</span>}
              <div className='d-flex align-items-center'>
                <span>{date && formatDate(date, 'shortDate')}</span>
              </div>
            </div>
          </div>
          <div className='d-flex align-items-center'>
            <Icon
              icon='it-error'
              color='danger'
              aria-label='Contenuto segnalato'
              aria-hidden
              className='mb-1'
            />
            {reportDropdown()}
          </div>
        </div>
        <div className='report-card-container__report-description d-flex'>
          <p>
            <span>
              Ha segnalato&nbsp;
              {comment_author
                ? 'il commento, aggiunto da'
                : `${getItemType()} di`}
              &nbsp;
            </span>
            <strong>
              {usersAnagraphic[comment_author || item_author]?.nome}&nbsp;
              {usersAnagraphic[comment_author || item_author]?.cognome}
              &nbsp;
            </strong>
            {comment_author ? (
              <span>
                al contenuto di tipo&nbsp;<strong>{getItemType(true)}</strong>
                {item_title ? (
                  <>
                    , dal titolo&nbsp;<strong>{item_title}</strong>&nbsp;
                    {comment_post_date ? (
                      <>
                        in data&nbsp;
                        <strong>
                          {formatDate(comment_post_date, 'dateTime')}
                        </strong>
                        ,&nbsp;
                      </>
                    ) : null}
                  </>
                ) : null}
              </span>
            ) : null}
            con la seguente motivazione:
          </p>
        </div>
        <div className='report-card-container__report-reason p-4 my-4'>
          <p>{reason}</p>
        </div>
        <div className='report-card-container__report-border' />
      </div>

      <div className='py-2 report-card-container__detail-btn'>
        <Button
          size='xs'
          className='like-and-comment-buttons d-flex align-items-center pl-0'
          onClick={() => {
            switch (item_type) {
              case 'board_item':
                navigate(`/bacheca/${item_id}`);
                break;
              case 'forum_item':
                navigate(`/forum/${item_id}`);
                break;
              case 'document_item':
                navigate(`/documenti/${item_id}`);
                break;
              default:
                break;
            }
          }}
          aria-label='Vai al dettaglio della segnalazione'
        >
          <p className='primary-color font-weight-bold text-nowrap'>
            VAI AL DETTAGLIO
          </p>
          <Icon
            icon='it-chevron-right'
            color='primary'
            size=''
            aria-label='dettaglio segnalazione'
            aria-hidden
          />
        </Button>
      </div>
    </div>
  );
};

export default ReportCard;

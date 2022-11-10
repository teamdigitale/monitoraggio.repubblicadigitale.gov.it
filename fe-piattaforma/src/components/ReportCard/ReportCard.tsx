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
  item_id: string;
  item_type: 'board_item' | 'community_item' | 'document_item';
  reason: string;
  date: string;
}

const ReportCard: React.FC<ReportCardI> = ({
  author,
  item_author,
  comment_author,
  reason,
  date,
  id,
  item_type,
  item_id,
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
      optionName: 'ELIMINA',
      DropdowniIcon: {
        icon: 'it-delete',
        color: 'primary',
      },
      action: async () => {
        await dispatch(DeleteReport(id));
        dispatch(GetReportsList());
      },
    },
    // {
    //   optionName: 'MODIFICA',
    //   DropdowniIcon: {
    //     icon: 'it-pencil',
    //     color: 'primary',
    //   },
    //   // action: () => editComment
    // },
  ];

  const getItemType = () => {
    switch (item_type) {
      case 'board_item':
        return 'la news';
      case 'community_item':
        return 'il topic';
      case 'document_item':
        return 'il documento';
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
        <LinkList role='list'>
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
                <Icon
                  icon={item.DropdowniIcon.icon}
                  color={item.DropdowniIcon.color}
                  aria-label={item.optionName}
                  aria-hidden
                />
                <span>{item.optionName}</span>
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
                user={{
                  uName: authorAnagraphic?.nome,
                  uSurname: authorAnagraphic?.cognome,
                }}
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
                    {authorAnagraphic?.nome}&nbsp;{authorAnagraphic?.cognome}
                  </strong>
                </span>
                &nbsp;-&nbsp;
                <span>{date && formatDate(date, 'shortDate')}</span>
              </div>
              <p>
                <span>
                  Ha segnalato {comment_author ? 'il commento' : getItemType()}{' '}
                  di{' '}
                </span>
                <strong>
                  {usersAnagraphic[comment_author || item_author]?.nome}&nbsp;
                  {usersAnagraphic[comment_author || item_author]?.cognome}
                </strong>{' '}
                con la seguente motivazione:
              </p>
            </div>
          </div>
          <div className='d-flex flex-row justify-content-end align-items-center'>
            <Icon
              icon='it-error'
              color='danger'
              aria-label='Contenuto segnalato'
              aria-hidden
              className='mb-1 mr-2'
            />
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
          onClick={() => {
            switch (item_type) {
              case 'board_item':
                navigate(`/bacheca/${item_id}`);
                break;
              case 'community_item':
                navigate(`/community/${item_id}`);
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
          <p className='primary-color font-weight-bold pl-4 text-nowrap'>
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

import React, { memo } from 'react';
import './cardDocument.scss';
import iconFile from '../../../public/assets/img/icon-file-blue.png';
/* import PDF from '/public/assets/img/pdf-icon-test.png';
import MP4 from '/public/assets/img/mp4-icon-test.png';*/
import { Col, Icon } from 'design-react-kit';
import PublishingAuthority from './PublishingAuthority';
import clsx from 'clsx';
import { useAppSelector } from '../../redux/hooks';
import { selectDevice } from '../../redux/features/app/appSlice';
import { useNavigate } from 'react-router-dom';
import { formatDate } from '../../utils/datesHelper';
import { ForumCardsI } from '../CardShowcase/cardShowcase';
/* import File from '/public/assets/img/icon-file-fill.png'; */

/* interface CardDocumentI {
  id?: string;
  category_label?: string;
  date?: string;
  title?: string;
  description?: string;
  fileType?: string;
  entity?: string;
  downloads?: number;
  comment_count?: number;
  isHome?: boolean;
} */

const CardDocument: React.FC<ForumCardsI> = (props) => {
  const {
    id,
    category_label,
    date,
    title,
    description,
    /* fileType, */ entity,
    downloads,
    comment_count,
    isHome,
  } = props;

  const device = useAppSelector(selectDevice);

  /* const getFileIcon = (type: string) => {
    switch (type) {
      case 'PDF':
        return PDF;
      case 'MP4':
        return MP4;
      // case 'PPT':
      // case 'EXCEL':
      // case 'WORD':
      default:
        return '';
    } 
  }; */
  const navigate = useNavigate();
  const navigateTo = () => {
    navigate(`/documenti/${id}`);
  };

  return (
    <div
      role='button'
      className={clsx(
        'document-card-container p-4',
        !device.mediaIsPhone && 'pt-2',
        isHome
          ? 'document-card-container__home-document-card'
          : 'document-card-container__page-document-card'
      )}
      onClick={navigateTo}
      onKeyDown={(e) => {
        if (e.key === ' ') {
          e.preventDefault();
          navigateTo();
        }
      }}
      tabIndex={0}
      aria-label={`Categoria: ${category_label}. Data: ${
        date && formatDate(date, 'shortDate')
      }. Titolo documento: ${title}. Descrizione: ${description}. Editore: ${entity}. ${downloads} download. ${comment_count} ${
        Number(comment_count) === 1 ? 'commento' : 'commenti'
      }`}
    >
      <Col className='text-left'>
        <div className='document-card-container__pre-title'>
          <span className='font-weight-bold'>
            {category_label}
            {/*  —  */}
          </span>
        </div>
        <p
          className={clsx(
            'document-card-container__title',
            'mt-2',
            'mb-3',
            'h5',
            'font-weight-bold'
          )}
        >
          {title}
        </p>
        <div className='d-flex align-items-center my-3'>
          <img src={iconFile} alt='icon-file' className='mr-3' />
          <p className='document-card-container__description text-serif'>
            {description}
          </p>
        </div>
      </Col>
      {!isHome ? (
        <div className='d-flex flex-column'>
          <PublishingAuthority authority={entity} isDocument />
          <div
            className={clsx(
              'd-flex',
              'justify-content-between',
              'align-items-center',
              'mt-1'
            )}
          >
            <span className='document-card-container__date'>
              {date && formatDate(date, 'shortDate')}
            </span>
            <div className='d-flex align-items-center'>
              <Icon
                icon='it-download'
                size='sm'
                color='primary'
                aria-label='Downloads'
                aria-hidden
              />
              <span className='document-card-container__span-icons ml-1 mr-2'>
                {downloads}
              </span>
              <Icon
                icon='it-comment'
                size='sm'
                color='primary'
                aria-label='Comments'
                aria-hidden
              />
              <span className='document-card-container__span-icons ml-1'>
                {comment_count}
              </span>
            </div>
          </div>
        </div>
      ) : (
        <div className='d-flex'>
          <span className='document-card-container__date'>
            {date && formatDate(date, 'shortDate')}
          </span>
        </div>
      )}
    </div>
  );
};

export default memo(CardDocument);

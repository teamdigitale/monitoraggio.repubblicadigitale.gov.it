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
/* import File from '/public/assets/img/icon-file-fill.png'; */

interface CardDocumentI {
  typology?: string;
  date?: string;
  title?: string;
  description?: string;
  fileType?: string;
  authority?: string;
  downloads?: number;
  comment_count?: number;
  isHome?: boolean;
}

const CardDocument: React.FC<CardDocumentI> = (props) => {
  const {
    typology,
    date,
    title,
    description,
    /* fileType, */ authority,
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
    navigate('/documenti/dettaglio');
  };

  return (
    <div
      role='button'
      className={clsx(
        'document-card-container p-4',
        !device.mediaIsPhone && 'pt-2'
      )}
      onClick={navigateTo}
      onKeyDown={navigateTo}
      tabIndex={0}
    >
      <Col className='text-left'>
        <div className='document-card-container__pre-title'>
          <span className='font-weight-bold'>{typology}</span> - {date}
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
      {!isHome && (
        <div className='d-flex flex-column'>
          <PublishingAuthority authority={authority} />
          <div className='d-flex justify-content-end align-items-center'>
            <Icon icon='it-download' size='sm' color='primary' />
            <span className='document-card-container__span-icons ml-1 mr-2'>
              {downloads}
            </span>
            <Icon icon='it-comment' size='sm' color='primary' />
            <span className='document-card-container__span-icons ml-1'>
              {comment_count}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default memo(CardDocument);

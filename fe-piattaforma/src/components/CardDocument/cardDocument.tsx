import React, { memo } from 'react';
import './cardDocument.scss';
import PDF from '/public/assets/img/pdf-icon-test.png';
import MP4 from '/public/assets/img/mp4-icon-test.png';

interface CardDocumentI {
  title?: string;
  description?: string;
  fileType?: string;
}

const CardDocument: React.FC<CardDocumentI> = (props) => {
  const { title, description, fileType } = props;

  const getFileIcon = (type: string) => {
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
  };

  return (
    <div className='d-flex flex-row my-5'>
      <div className='d-flex flex-row mr-5'>
        <img
          src={getFileIcon(fileType || '')}
          alt='file-type'
          className='mr-2 document-card__file-icon document-card__vertical'
        />
        <span className='document-card__vertical neutral-1-color-a8'>
          {fileType}
        </span>
      </div>
      <div className='d-flex flex-column'>
        <p className='document-card__maxLinesTitle primary-color-b1'>
          <strong>{title}</strong>
        </p>
        <p className='document-card__maxLinesParagraph mb-0 neutral-1-color-a8'>
          {description}
        </p>
      </div>
    </div>
  );
};

export default memo(CardDocument);

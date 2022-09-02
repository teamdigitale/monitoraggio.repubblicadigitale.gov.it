import React, { memo } from 'react';
import './singleMessage.scss';

interface SingleMessageI {
  title?: string;
  description?: string;
  fileType?: string;
  object?: string;
  date?: string;
}

const SingleMessage: React.FC<SingleMessageI> = (props) => {
  const { title, description, object, date } = props;

  return (
    <div className='d-flex flex-row my-5 singleMessage'>
      <div className='d-flex flex-column pl-5'>
        <h5 className='primary-color-b1'>
          <strong>Da: {title}</strong>
        </h5>
        <p className='singleMessage__date neutral-1-color-a8'>{date}</p>
        <h6 className='mb-0 primary-color-b1'>Oggetto: {object}</h6>
        <p className='neutral-1-color-a8 mt-4 mb-4'>{description}</p>
      </div>
    </div>
  );
};

export default memo(SingleMessage);

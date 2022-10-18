import { Icon } from 'design-react-kit';
import React, { memo } from 'react';
import './messageList.scss';

interface MessageListI {
  title?: string;
  description?: string;
  object?: string;
  date?: string;
  icon?: string;
}

const MessageList: React.FC<MessageListI> = (props) => {
  const { title, description, object, date, icon } = props;

  return (
    <div className='d-flex flex-column messageList-card-container mt-3'>
      <div className='d-flex'>
        <div>
          {icon ? (
            <Icon
              icon={icon}
              size='lg'
              className='mr-3 messageList-card-container__icon-fill'
              color='primary'
            />
          ) : null}
        </div>
        <div className='d-flex flex-column'>
          <p className='primary-color-b1'>Da: {title}</p>
          <p className='singleMessage__date neutral-1-color-a8'>{date}</p>
          <p className='mb-0 primary-color-b1'>Oggetto: {object}</p>
        </div>
      </div>
      <p className='messageList-card-container__description neutral-1-color-a8 mt-4 mb-4'>
        {description}
      </p>
    </div>
  );
};

export default memo(MessageList);

import clsx from 'clsx';
import { CardProps, CardText, CardTitle, Col, Icon } from 'design-react-kit';
import React, { memo } from 'react';
import Heart from '/public/assets/img/heart.png';
import './cardCommunity.scss';
import { useNavigate } from 'react-router-dom';
import PublishingAuthority from '../CardDocument/PublishingAuthority';
import { formatDate } from '../../utils/datesHelper';

interface CommentI {
  user?: string;
  picture?: string;
  commmentText?: string;
  commentDate?: string;
}

interface CardCommunityI extends CardProps {
  id?: string;
  title?: string;
  community?: string;
  description?: string;
  colorLeft?: string;
  date?: string;
  likes?: string;
  comment_count?: number;
  comments?: CommentI[];
  category_label?: string;
  views?: string;
  region?: string;
  onClick?: () => void;
}

const CardCommunity: React.FC<CardCommunityI> = (props) => {
  const {
    id,
    title,
    description,
    date,
    likes,
    comment_count,
    category_label,
    views,
    region,
  } = props;
  const navigate = useNavigate();

  const navigateTo = () => {
    navigate(`/community/${id}`);
  };

  return (
    <div
      role='button'
      className={clsx(
        'card-community',
        'bg-white',
        'px-4',
        'pb-3',
        'pt-4',
        'd-flex',
        'flex-column'
      )}
      onKeyDown={navigateTo}
      onClick={navigateTo}
      tabIndex={0}
    >
      <Col className='text-left'>
        {category_label ? (
          <div className='mb-2 card-community__pre-title'>
            <span className='font-weight-bold'>{category_label} —</span>{' '}
            {date && formatDate(date, 'shortDate')}
          </div>
        ) : null}
        {title ? (
          <CardTitle
            tag='p'
            className='card-community__title font-weight-bold mb-3'
          >
            {title}
          </CardTitle>
        ) : null}
        {description ? (
          <CardText className='card-community__text mb-3 text-serif'>
            {description}
          </CardText>
        ) : null}
        {region ? <PublishingAuthority authority={region} /> : null}
      </Col>
      <div
        className={clsx('d-flex', 'flex-row', 'mt-2', 'justify-content-end')}
      >
        <div
          className={clsx(
            'd-flex',
            'align-items-center',
            'category-top',
            'mr-2'
          )}
        >
          <Icon
            color='primary'
            icon={Heart}
            size='xs'
            aria-label='calendario'
          />
          <span className='card-community__span-icons pl-1'>{likes}</span>
        </div>
        <div
          className={clsx(
            'd-flex',
            'align-items-center',
            'category-top',
            'mr-2'
          )}
        >
          <Icon
            color='primary'
            icon='it-comment'
            size='sm'
            aria-label='commenti'
          />
          <span className='card-community__span-icons pl-1'>
            {comment_count}
          </span>
        </div>
        <div
          className={clsx(
            'd-flex',
            'align-items-center',
            'category-top',
            'mr-2'
          )}
        >
          <Icon
            color='primary'
            icon='it-password-visible'
            size='sm'
            aria-label='stella rating'
          />
          <span className='card-community__span-icons pl-1'>{views}</span>
        </div>
      </div>
    </div>
  );
};

export default memo(CardCommunity);

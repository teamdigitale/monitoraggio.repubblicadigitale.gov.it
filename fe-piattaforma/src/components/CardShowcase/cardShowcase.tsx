import clsx from 'clsx';
import { CardProps, CardText, CardTitle, Col, Icon } from 'design-react-kit';
import React, { memo } from 'react';
import Heart from '/public/assets/img/heart.png';
import bookmark from '/public/assets/img/bookmark.png';
import './cardShowcase.scss';
import { useAppSelector } from '../../redux/hooks';
import { selectDevice } from '../../redux/features/app/appSlice';
import PublishingAuthority from '../CardDocument/PublishingAuthority';
import { useNavigate } from 'react-router-dom';
import HTMLParser from '../General/HTMLParser/HTMLParse';
import coverPlaceholder from '/public/assets/img/img-bacheca-digitale-dettaglio.png'
import _ from 'lodash';

interface CommentI {
  user?: string;
  picture?: string;
  commmentText?: string;
  commentDate?: string;
}

interface CardShowcaseI extends CardProps {
  id?: string,
  title?: string;
  community?: string;
  description?: string;
  entity?: string;
  colorLeft?: string;
  date?: string;
  likes?: string;
  comment_count?: number;
  comments?: CommentI[];
  cover?: string;
  category_label?: string;
  views?: string;
  marked?: boolean;
}

const CardShowcase: React.FC<CardShowcaseI> = (props) => {
  const {
    id,
    title,
    description,
    entity,
    date,
    likes,
    comment_count,
    cover,
    category_label,
    views,
    marked,
  } = props;

  const device = useAppSelector(selectDevice);
  const isMobile = device.mediaIsPhone;
  const navigate = useNavigate();
  const navigateTo = () => {
    navigate(`/bacheca-digitale/${id}`);
  };

  return (
    <div
      role='button'
      className={clsx(
        'showcase-card bg-white',
        marked ? 'showcase-card__marked' : null
      )}
      onKeyDown={navigateTo}
      onClick={navigateTo}
      tabIndex={0}
    >
      <div className='position-relative'>
        <div className='responsive'>
          <img
            src={cover ? cover : coverPlaceholder}
            title='img title'
            alt='imagealt'
            className='responsive'
          />
        </div>
        {marked ? (
          <div className='showcase-card__bookmark'>
            <Icon
              color='primary'
              icon={bookmark}
              size='lg'
              aria-label='bookmark'
              className='showcase-card__icon-bookmark'
            />
          </div>
        ) : null}
      </div>
      <div
        className={clsx(
          'bg-white',
          isMobile ? 'mx-4' : 'px-4',
          'pb-2',
          'd-flex',
          'flex-column',
          marked ? 'showcase-card__body' : null
        )}
      >
        <Col>
          {category_label ? (
            <div
              className={clsx(
                'showcase-card__pre-title',
                marked ? 'my-4 pt-4' : 'mb-4 mt-3 pt-1'
              )}
            >
              <span className='font-weight-bold'>{category_label}</span> -{' '}
              {date}
            </div>
          ) : null}
          {title ? (
            <CardTitle
              tag='p'
              className='showcase-card__title font-weight-bold my-3'
            >
              {title}
            </CardTitle>
          ) : null}
          {description ? (
            <CardText className='showcase-card__text mb-3 text-serif'>
              <HTMLParser html={description} />
            </CardText>
          ) : null}
          {entity ? (<div>
            <PublishingAuthority authority={_.capitalize(entity.toLowerCase())} />
          </div>) : null}
        </Col>
        <div
          className={clsx('d-flex', 'flex-row', 'my-3', 'justify-content-end')}
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
            <span className='showcase-card__span-icons pl-1'>{likes}</span>
          </div>
          <div
            className={clsx(
              'category-top',
              'mr-2',
              'd-flex',
              'align-items-center'
            )}
          >
            <Icon
              color='primary'
              icon='it-comment'
              size='sm'
              aria-label='commenti'
            />
            <span className='showcase-card__span-icons pl-1'>
              {comment_count}
            </span>
          </div>
          <div
            className={clsx(
              'category-top',
              'mr-2',
              'd-flex',
              'align-items-center'
            )}
          >
            <Icon
              color='primary'
              icon='it-password-visible'
              size='sm'
              aria-label='stella rating'
            />
            <span className='showcase-card__span-icons pl-1'>{views}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(CardShowcase);

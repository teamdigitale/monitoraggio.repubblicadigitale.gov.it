import clsx from 'clsx';
import {
  Button,
  CardProps,
  CardText,
  CardTitle,
  Col,
  Icon,
} from 'design-react-kit';
import React, { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { selectDevice } from '../../redux/features/app/appSlice';
import { useAppSelector } from '../../redux/hooks';
import './cardCommunity.scss';
import Avatar from '/public/assets/img/avatar-icon-test.png';

interface CommentI {
  user?: string;
  picture?: string;
  commmentText?: string;
  commentDate?: string;
}

interface CardCommunityI extends CardProps {
  title?: string;
  community?: string;
  text?: string;
  colorLeft?: string;
  date?: string;
  likes?: string;
  commentsTot?: number;
  fullCard?: boolean;
  comments?: CommentI[];
}

const CardCommunity: React.FC<CardCommunityI> = (props) => {
  const {
    title,
    community,
    text,
    colorLeft,
    date,
    likes,
    commentsTot,
    fullCard,
    comments,
  } = props;

  const { t } = useTranslation();

  const device = useAppSelector(selectDevice);

  return (
    <>
      <div
        className={clsx(
          'community-card',
          colorLeft && 'colorLeft',
          !colorLeft && 'complementary-3-bg-a8',
          fullCard && 'w-100',
          !fullCard && device.mediaIsDesktop && 'community-card__maxWidthCard'
        )}
      >
        <div className='ml-2 bg-white px-4 py-4 h-100 d-flex flex-column community-card__white-card'>
          <Col>
            {title ? (
              <CardTitle
                tag='p'
                className='h5 mb-2 community-card__maxLinesTitle'
              >
                {title}
              </CardTitle>
            ) : null}
            <div className='d-flex flex-row'>
              <p className='mb-2 neutral-1-color-a8'>
                <span className='community-card__dots mr-2'> </span>
                {community}
              </p>
            </div>
            {text ? (
              <CardText className='community-card__maxLinesParagraph'>
                {text}
              </CardText>
            ) : null}
          </Col>
          <div
            className={clsx(
              'd-flex flex-row mt-4',
              !fullCard && 'justify-content-between'
            )}
          >
            <div className='category-top'>
              <Icon
                color='primary'
                icon='it-calendar'
                size='sm'
                aria-label='calendario'
              />
              <span className='pl-1'>{date}</span>
            </div>
            <div className={clsx('category-top', fullCard && 'ml-4')}>
              <Icon
                color='primary'
                icon='it-star-outline'
                size='sm'
                aria-label='stella rating'
              />
              <span className='pl-1'>{likes}</span>
            </div>
            <div className={clsx('category-top', fullCard && 'ml-4')}>
              <Icon
                color='primary'
                icon='it-comment'
                size='sm'
                aria-label='commenti'
              />
              <span className='pl-1'>{commentsTot}</span>
            </div>
          </div>
        </div>
      </div>
      {fullCard && (
        <>
          <div className='d-flex justify-content-center'>
            <hr className='community-card__line' />
          </div>
          <div className='w-100 bg-white px-4 py-4 h-100 community-card__last-comment community-card__white-card'>
            <a href='/' className='ml-2'>
              {t('visualize_previous_answers').toUpperCase()} (
              {(commentsTot || 1) - 1})
            </a>
            <div className='mt-4 ml-2 d-flex flex-row justify-content-between'>
              <img
                src={Avatar}
                alt='avatar'
                className='community-card__picture-comment mr-3'
              />
              <div className='d-flex flex-column'>
                <p>
                  <strong>{comments && comments[0].user}</strong>
                </p>
                <p>{comments && comments[0].commmentText}</p>
              </div>
              <p>{comments && comments[0].commentDate}</p>
            </div>
            <div className='ml-2 d-flex flex-row justify-content-end'>
              <Button className='px-2' onClick={() => console.log('send like')}>
                <Icon
                  color='primary'
                  icon='it-star-outline'
                  size='sm'
                  aria-label='stella rating'
                />
              </Button>
              <Button
                className='px-2'
                onClick={() => console.log('share link')}
              >
                <Icon
                  color='primary'
                  icon='it-link'
                  size='sm'
                  aria-label='stella rating'
                />
              </Button>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default memo(CardCommunity);

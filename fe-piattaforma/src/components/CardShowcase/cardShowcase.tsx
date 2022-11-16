import React from 'react';
import clsx from 'clsx';
import { CardProps, CardText, CardTitle, Col, Icon } from 'design-react-kit';
import Heart from '/public/assets/img/heart.png';
import bookmark from '/public/assets/img/bookmark.png';
import './cardShowcase.scss';
import { useAppSelector } from '../../redux/hooks';
import { selectDevice } from '../../redux/features/app/appSlice';
import PublishingAuthority from '../CardDocument/PublishingAuthority';
import { useNavigate } from 'react-router-dom';
import HTMLParser from '../General/HTMLParser/HTMLParse';
import coverPlaceholder from '/public/assets/img/img-bacheca-digitale-dettaglio.png';
import _ from 'lodash';
import { cleanDrupalFileURL } from '../../utils/common';
import { formatDate } from '../../utils/datesHelper';

export interface CommentI {
  user?: string;
  picture?: string;
  commmentText?: string;
  commentDate?: string;
}

export interface ForumCardsI extends CardProps {
  id?: string | undefined;
  title?: string | undefined;
  community?: string | undefined;
  description?: string | undefined;
  entity?: string | undefined;
  colorLeft?: string | undefined;
  date?: string | undefined;
  likes?: string | undefined;
  comment_count?: number | undefined;
  comments?: CommentI[] | undefined;
  cover?: string | undefined;
  category_label?: string | undefined;
  views?: string | undefined;
  highlighted?: boolean | undefined;
  onClick?: () => void | undefined;
  isHome?: boolean | undefined;
  fileType?: string | undefined;
  downloads?: number | undefined;
  isDocument?: boolean | undefined;
  isNews?: boolean | undefined;
  isCommunity?: boolean | undefined;
}

const CardShowcase: React.FC<ForumCardsI> = (props) => {
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
    highlighted,
  } = props;

  const device = useAppSelector(selectDevice);
  const isMobile = device.mediaIsPhone;
  const navigate = useNavigate();
  const navigateTo = () => {
    navigate(`/bacheca/${id}`);
  };

  return (
    <div
      role='button'
      className={clsx(
        'showcase-card bg-white',
        highlighted ? 'showcase-card__marked' : null
      )}
      onKeyDown={(e) => {
        if (e.key === ' ') {
          e.preventDefault();
          navigateTo();
        }
      }}
      onClick={navigateTo}
      tabIndex={0}
      aria-label={`Categoria: ${category_label}. Data: ${
        date && formatDate(date, 'shortDate')
      }. Titolo news: ${title}. Descrizione: ${description?.replace(
        /<[^>]+>/g,
        ''
      )}. Editore: ${entity}. ${likes} like. ${comment_count} ${
        Number(comment_count) === 1 ? 'commento' : 'commenti'
      }. ${views} ${
        Number(views) === 1 ? 'visualizzazione' : 'visualizzazioni'
      }`}
    >
      <div className='position-relative img-height-placeholder'>
        <div className='w-100'>
          <img
            src={cover ? cleanDrupalFileURL(cover) : coverPlaceholder}
            title='img title'
            alt={`anteprima ${title}`}
            aria-hidden
            className='responsive'
          />
        </div>
        {highlighted ? (
          <div className='showcase-card__bookmark'>
            <Icon
              color='primary'
              icon={bookmark}
              size='lg'
              aria-label='bookmark'
              aria-hidden
              className='showcase-card__icon-bookmark'
            />
          </div>
        ) : null}
      </div>
      <div
        className={clsx(
          'bg-white',
          isMobile ? 'mx-4' : 'px-4',
          'd-flex',
          'flex-column',
          highlighted ? 'showcase-card__body' : null
        )}
      >
        <Col className='text-left'>
          {category_label ? (
            <div
              className={clsx(
                'showcase-card__pre-title',
                highlighted
                  ? 'my-4 pt-4 showcase-card__highlighted-pre-title'
                  : 'mb-4 mt-3 pt-1'
              )}
            >
              <span className='font-weight-bold'>
                {category_label}
                {/*  —  */}
              </span>
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
          {entity ? (
            <PublishingAuthority authority={entity} />
          ) : (
            <div className='pt-4 pb-3'></div>
          )}
        </Col>
        <div
          className={clsx(
            'd-flex',
            'flex-row',
            'justify-content-between',
            'showcase-card__icon-container-alignment'
          )}
        >
          <span className='showcase-card__date'>
            {date && formatDate(date, 'shortDate')}
          </span>
          <div className='d-flex'>
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
                aria-label='Like'
                aria-hidden
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
                aria-label='Commento'
                aria-hidden
              />
              <span className='showcase-card__span-icons pl-1'>
                {comment_count}
              </span>
            </div>
            <div
              className={clsx('category-top', 'd-flex', 'align-items-center')}
            >
              <Icon
                color='primary'
                icon='it-password-visible'
                size='sm'
                aria-label='Views'
                aria-hidden
              />
              <span className='showcase-card__span-icons pl-1'>{views}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardShowcase;

import clsx from 'clsx';
import { CardText, CardTitle, Col, Icon } from 'design-react-kit';
import React, { memo } from 'react';
import Heart from '/public/assets/img/hollow-grey-heart.png';
import './cardForum.scss';
import { useNavigate } from 'react-router-dom';
import PublishingAuthority from '../CardDocument/PublishingAuthority';
import { formatDate } from '../../utils/datesHelper';
import { ForumCardsI } from '../CardShowcase/cardShowcase';

const CardForum: React.FC<ForumCardsI> = (props) => {
  const {
    id,
    title,
    description,
    date,
    likes,
    comment_count,
    category_label,
    views,
    entity,
  } = props;
  const navigate = useNavigate();

  const navigateTo = () => {
    navigate(`/forum/${id}`);
  };

  return (
    <div
      role='button'
      className={clsx(
        'card-forum',
        'bg-white',
        'px-4',
        'pb-3',
        'pt-4',
        'd-flex',
        'flex-column'
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
      }. Titolo topic: ${title}. Descrizione: ${description}. Editore: ${entity}. ${likes} like. ${comment_count} ${
        Number(comment_count) === 1 ? 'commento' : 'commenti'
      }. ${views} ${
        Number(views) === 1 ? 'visualizzazione' : 'visualizzazioni'
      }`}
    >
      <Col className='text-left'>
        {category_label ? (
          <div className='mb-2 card-forum__pre-title'>
            <span className='font-weight-bold'>
              {category_label}
              {/* &nbsp;—&nbsp; */}
            </span>
          </div>
        ) : null}
        {title ? (
          <CardTitle
            tag='p'
            className='card-forum__title font-weight-bold mb-3'
          >
            {title}
          </CardTitle>
        ) : null}
        {description ? (
          <CardText className='card-forum__text mb-3 text-serif'>
            {description}
          </CardText>
        ) : null}
        {entity ? <PublishingAuthority authority={entity} /> : null}
      </Col>
      <div
        className={clsx(
          'd-flex',
          'flex-row',
          'mt-2',
          'justify-content-between',
          'align-items-center'
        )}
      >
        <span className='card-forum__date'>
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
              color='note'
              icon={Heart}
              size='xs'
              aria-label='Likes'
              aria-hidden
            />
            <span className='card-forum__span-icons pl-1'>{likes}</span>
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
              color='note'
              icon='it-comment'
              size='sm'
              aria-label='Comments'
              aria-hidden
            />
            <span className='card-forum__span-icons pl-1'>{comment_count}</span>
          </div>
          <div className={clsx('d-flex', 'align-items-center', 'category-top')}>
            <Icon
              color='note'
              icon='it-password-visible'
              size='sm'
              aria-label='Views'
              aria-hidden
            />
            <span className='card-forum__span-icons pl-1'>{views}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(CardForum);

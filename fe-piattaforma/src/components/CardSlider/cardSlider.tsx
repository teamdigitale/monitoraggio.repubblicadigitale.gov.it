import { Icon } from 'design-react-kit';
import React from 'react';
import './cardSlider.scss';
import CuoreVuoto from '../../../public/assets/img/hollow-grey-heart.png';
import clsx from 'clsx';
import { useNavigate } from 'react-router-dom';
import { formatDate } from '../../utils/datesHelper';
import { ForumCardsI } from '../CardShowcase/cardShowcase';

const CardSlider: React.FC<ForumCardsI> = (props) => {
  const {
    id = '',
    category_label,
    date,
    title,
    downloads = '0',
    comment_count = '0',
    likes = '0',
    views = '0',
    isDocument = false,
    isNews = false,
    isForum = false,
    /*  rightArrow,
            leftArrow,
            increment,
            decrement, */
  } = props;
  const navigate = useNavigate();

  const navigateByType = () => {
    if (id) {
      if (isNews) {
        navigate(`/bacheca/${id}`);
      } else if (isForum) {
        navigate(`/forum/${id}`);
      } else if (isDocument) {
        navigate(`/documenti/${id}`);
      }
    }
  };

  return (
    <div
      role='button'
      onKeyDown={(e) => {
        if (e.key === ' ') {
          e.preventDefault();
          navigateByType();
        }
      }}
      onClick={navigateByType}
      tabIndex={0}
      className={clsx('card-slider-container', 'py-3', 'px-4')}
      aria-label={`Categoria: ${category_label}. Data: ${
        date && formatDate(date, 'shortDate')
      }. Titolo ${
        isDocument ? 'documento' : isNews ? 'annuncio' : 'topic'
      }: ${title}. ${likes} like. ${comment_count} ${
        Number(comment_count) === 1 ? 'commento' : 'commenti'
      }. ${downloads} download. ${views} ${
        Number(views) === 1 ? 'visualizzazione' : 'visualizzazioni'
      }`}
    >
      <div className='pl-1'>
        <div className='card-slider-container__pre-title'>
          <span className='font-weight-bold'>
            {category_label}
            {/* &nbsp;—&nbsp; */}
          </span>
        </div>
        <p className='card-slider-container__title my-2 font-weight-bold'>
          {title}
        </p>
        <div
          className={clsx(
            'd-flex',
            'justify-content-between',
            'align-items-center',
            'pt-4'
          )}
        >
          <span className='card-slider-container__date'>
            {date && formatDate(date, 'shortDate')}
          </span>
          <div className='d-flex'>
            {!isDocument ? (
              <div className='d-flex align-items-center'>
                <Icon
                  icon={CuoreVuoto}
                  size='xs'
                  color='note'
                  aria-label='Like'
                  aria-hidden
                />
                <span className='card-slider-container__span-icons ml-1 mr-2'>
                  {likes}
                </span>
              </div>
            ) : null}
            <div className='d-flex align-items-center'>
              <Icon
                icon='it-comment'
                size='sm'
                color='note'
                aria-label='Commento'
                aria-hidden
              />
              <span className='card-slider-container__span-icons ml-1 mr-2'>
                {comment_count}
              </span>
            </div>
            {isDocument ? (
              <div className='d-flex align-items-center'>
                <Icon
                  icon='it-download'
                  size='sm'
                  color='note'
                  aria-label='Download'
                  aria-hidden
                />
                <span className='card-slider-container__span-icons ml-1'>
                  {downloads}
                </span>
              </div>
            ) : null}
            {!isDocument ? (
              <div className='d-flex align-items-center'>
                <Icon
                  icon='it-password-visible'
                  size='sm'
                  color='note'
                  aria-label='Views'
                  aria-hidden
                />
                <span className='card-slider-container__span-icons ml-1'>
                  {views}
                </span>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardSlider;

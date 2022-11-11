import { Icon } from 'design-react-kit';
import React from 'react';
import './cardSlider.scss';
import CuoreBluVuoto from '../../../public/assets/img/hollow-blue-heart.png';
import clsx from 'clsx';
import { useNavigate } from 'react-router-dom';
import { formatDate } from '../../utils/datesHelper';
import { ForumCardsI } from '../CardShowcase/cardShowcase';
/* 
import { useAppSelector } from '../../redux/hooks';
import { selectDevice } from '../../redux/features/app/appSlice';
 */
/* interface CardSliderI {
  id: string | number;
  category_label?: string;
  date?: string;
  title?: string;
  downloads?: number;
  comment_count?: number;
  likes?: number;
  views?: number;
  isDocument?: boolean;
  isNews?: boolean;
  isCommunity?: boolean; */
/*  rightArrow?: boolean;
  leftArrow?: boolean;
  increment?: () => void;
  decrement?: () => void; */
/* } */

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
    isCommunity = false,
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
      } else if (isCommunity) {
        navigate(`/community/${id}`);
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
        isDocument ? 'documento' : isNews ? 'news' : 'topic'
      }: ${title}. ${likes} like. ${comment_count} ${
        Number(comment_count) === 1 ? 'commento' : 'commenti'
      }. ${downloads} download. ${views} ${
        Number(views) === 1 ? 'visualizzazione' : 'visualizzazioni'
      }`}
    >
      <div className='pl-1'>
        <div className='card-slider-container__pre-title'>
          <span className='font-weight-bold'>
            {category_label}&nbsp;—&nbsp;
          </span>
          {date && formatDate(date, 'shortDate')}
        </div>
        <p className='card-slider-container__title my-2 font-weight-bold'>
          {title}
        </p>
        <div className={clsx('d-flex', 'justify-content-end', 'pt-4')}>
          {!isDocument ? (
            <div className='d-flex align-items-center'>
              <Icon
                icon={CuoreBluVuoto}
                size='xs'
                color='primary'
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
              color='primary'
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
                color='primary'
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
                color='primary'
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
  );
};

export default CardSlider;

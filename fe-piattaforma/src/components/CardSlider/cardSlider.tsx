import { Icon } from 'design-react-kit';
import React from 'react';
import './cardSlider.scss';
import CuoreBluVuoto from '../../../public/assets/img/hollow-blue-heart.png';
import clsx from 'clsx';
/* 
import { useAppSelector } from '../../redux/hooks';
import { selectDevice } from '../../redux/features/app/appSlice';
 */
interface CardSliderI {
  typology?: string;
  date?: string;
  title?: string;
  download?: number;
  comment?: number;
  likes?: number;
  views?: number;
  isDocument?: boolean;
  /*  rightArrow?: boolean;
  leftArrow?: boolean;
  increment?: () => void;
  decrement?: () => void; */
}

const CardSlider: React.FC<CardSliderI> = (props) => {
  const {
    typology,
    date,
    title,
    download,
    comment,
    likes,
    views,
    isDocument,
    /*  rightArrow,
    leftArrow,
    increment,
    decrement, */
  } = props;
  /*  const device = useAppSelector(selectDevice);
  const isMobile = device.mediaIsPhone; */
  return (
    <div className={clsx('card-slider-container', 'py-3', 'pl-4', 'pr-5')}>
      <div className='card-slider-container__pre-title'>
        <span className='font-weight-bold'>{typology}</span> {date}
      </div>
      <p className='card-slider-container__title my-2 font-weight-bold'>
        {title}
      </p>
      <div className={clsx('d-flex', 'justify-content-end', 'pt-4')}>
        {!isDocument ? (
          <div className='d-flex align-items-center'>
            <Icon icon={CuoreBluVuoto} size='xs' color='primary' />
            <span className='card-slider-container__span-icons ml-1 mr-2'>
              {likes}
            </span>
          </div>
        ) : null}
        <div className='d-flex align-items-center'>
          <Icon icon='it-comment' size='sm' color='primary' />
          <span className='card-slider-container__span-icons ml-1 mr-2'>
            {comment}
          </span>
        </div>
        {isDocument ? (
          <div className='d-flex align-items-center'>
            <Icon icon='it-download' size='sm' color='primary' />
            <span className='card-slider-container__span-icons ml-1'>
              {download}
            </span>
          </div>
        ) : null}
        {!isDocument ? (
          <div className='d-flex align-items-center'>
            <Icon icon='it-password-visible' size='sm' color='primary' />
            <span className='card-slider-container__span-icons ml-1'>
              {views}
            </span>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default CardSlider;

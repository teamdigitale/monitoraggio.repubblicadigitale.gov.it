import { Button } from 'design-react-kit';
import React, { memo, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import './bachecaDigitaleWidget.scss';
import CardShowcase from '../../../../../components/CardShowcase/cardShowcase';
import { useAppSelector } from '../../../../../redux/hooks';
import { selectDevice } from '../../../../../redux/features/app/appSlice';
import { GetNewsList } from '../../../../../redux/features/forum/forumThunk';
import { selectNewsList } from '../../../../../redux/features/forum/forumSlice';
import {
  selectEntityPagination,
  setEntityPagination,
} from '../../../../../redux/features/administrativeArea/administrativeAreaSlice';
import Slider, {
  formatSlides,
} from '../../../../../components/General/Slider/Slider';
import { getMediaQueryDevice } from '../../../../../utils/common';

/*
const ShowcasePropsMock = [
  {
    title: 'La Digital Skills and Jobs Platform: un anno da festeggiare',
    text: 'I compleanni sono sempre un momento da celebrare. Anche quando si tratta del  ...',
    date: '20/07/2022',
    likes: '21',
    views: '65',
    commentsTot: 484,
    img: 'https://picsum.photos/seed/picsum/380/150',
    categories: 'CATEGORIA - ',
    marked: true,
  },
  {
    title: 'La Digital Skills and Jobs Platform: un anno da festeggiare',
    text: 'I compleanni sono sempre un momento da celebrare. Anche quando si tratta del  ...',
    date: '20/07/2022',
    likes: '21',
    views: '65',
    commentsTot: 484,
    img: 'https://picsum.photos/seed/picsum/380/150',
    categories: 'CATEGORIA - ',
    marked: true,
  },
  {
    title: 'La Digital Skills and Jobs Platform: un anno da festeggiare',
    text: 'I compleanni sono sempre un momento da celebrare. Anche quando si tratta del  ...',
    date: '20/07/2022',
    likes: '21',
    views: '65',
    commentsTot: 484,
    img: 'https://picsum.photos/seed/picsum/380/150',
    categories: 'CATEGORIA - ',
    marked: false,
  },
  {
    title: 'La Digital Skills and Jobs Platform: un anno da festeggiare',
    text: 'I compleanni sono sempre un momento da celebrare. Anche quando si tratta del  ...',
    date: '20/07/2022',
    likes: '21',
    views: '65',
    commentsTot: 484,
    img: 'https://picsum.photos/seed/picsum/380/150',
    categories: 'CATEGORIA - ',
    marked: false,
  },
  {
    title: 'La Digital Skills and Jobs Platform: un anno da festeggiare',
    text: 'I compleanni sono sempre un momento da celebrare. Anche quando si tratta del  ...',
    date: '20/07/2022',
    likes: '21',
    views: '65',
    commentsTot: 484,
    img: 'https://picsum.photos/seed/picsum/380/150',
    categories: 'CATEGORIA - ',
    marked: false,
  },
  {
    title: 'La Digital Skills and Jobs Platform: un anno da festeggiare',
    text: 'I compleanni sono sempre un momento da celebrare. Anche quando si tratta del  ...',
    date: '20/07/2022',
    likes: '21',
    views: '65',
    commentsTot: 484,
    img: 'https://picsum.photos/seed/picsum/380/150',
    categories: 'CATEGORIA - ',
    marked: false,
  },
];
*/

const newsPagination = {
  desktop: 24,
  mobile: 8,
  tablet: 12,
};

const BachecaDigitaleWidget = () => {
  const device = useAppSelector(selectDevice);
  const newsList = useAppSelector(selectNewsList);
  const pagination = useAppSelector(selectEntityPagination);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(
      setEntityPagination({
        pageSize: newsPagination[getMediaQueryDevice(device)],
      })
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [device]);

  useEffect(() => {
    if (pagination?.pageSize === newsPagination[getMediaQueryDevice(device)]) {
      dispatch(GetNewsList());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination?.pageSize]);

  const navigate = useNavigate();
  const navigateTo = () => {
    navigate('/bacheca-digitale');
  };

  return (
    <div className='py-5'>
      {device.mediaIsPhone ? (
        <div className='container'>
          <h2 className='h3 text-primary mb-3'>Bacheca Digitale</h2>
          <div className='title-border-box my-3'></div>
          <div className='mb-4'>
            <p className='text-primary'>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam
              ipsum velit, tempor at luctus quis, congue eget justo.
            </p>
          </div>
        </div>
      ) : (
        <div className='container'>
          <h2 className='h3 text-primary mb-3'>Bacheca</h2>
          <div className='mb-5 d-flex justify-content-between align-items-center'>
            <p className='text-primary responsive-width'>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam
              ipsum velit, tempor at luctus quis, congue eget justo. Quisque
              auctor massa non dapibus varius.
            </p>
            <Button color='primary' onClick={navigateTo}>
              Leggi tutte le news
            </Button>
          </div>
        </div>
      )}
      <div className='container row'>
        <span className='sr-only'>
          {'La bacheca presenta ' + (newsList?.length || 0) + ' news'}
        </span>
        <Slider>
          {formatSlides(newsList, 6).map((el, i) => (
            <div
              key={`slide-${i}`}
              style={{
                flexWrap: 'wrap',
                display: 'flex',
                width: '100%',
                justifyContent: 'space-between',
              }}
            >
              {el.map((e: any, index: any) => (
                <div
                  key={`card-${i}-${index}`}
                  style={{
                    height: 'auto',
                    // maxWidth: '365px',
                    width: device.mediaIsDesktop ? '30%' : '100%',
                  }}
                >
                  <CardShowcase {...e}></CardShowcase>
                </div>
              ))}
            </div>
          ))}
        </Slider>
      </div>
      {device.mediaIsPhone && (
        <div className='d-flex justify-content-center'>
          <Button color='primary' onClick={navigateTo}>
            Leggi tutte le news
          </Button>
        </div>
      )}
    </div>
  );
};

export default memo(BachecaDigitaleWidget);

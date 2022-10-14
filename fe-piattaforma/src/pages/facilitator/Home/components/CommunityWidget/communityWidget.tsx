import clsx from 'clsx';
import { Button } from 'design-react-kit';
import React, { memo, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { CardCommunity } from '../../../../../components';
import { selectDevice } from '../../../../../redux/features/app/appSlice';
import { useAppSelector } from '../../../../../redux/hooks';
import '../../../../../pages/facilitator/Home/components/BachecaDigitaleWidget/bachecaDigitaleWidget.scss';
import { useNavigate } from 'react-router-dom';
import { selectTopicsList } from '../../../../../redux/features/forum/forumSlice';
import { GetItemsList } from '../../../../../redux/features/forum/forumThunk';

/* export const CommunityPropsMock = [
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
    region: 'Regione Lombardia',
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
    region: 'Regione Lombardia',
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
    region: 'Regione Lombardia',
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
    region: 'Regione Lombardia',
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
    region: 'Regione Lombardia',
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
    region: 'Regione Lombardia',
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
    region: 'Regione Lombardia',
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
    region: 'Regione Lombardia',
  },
]; */

const CommunityWidget = () => {
  const dispatch = useDispatch();
  const device = useAppSelector(selectDevice);
  const topicsList = useAppSelector(selectTopicsList);

  useEffect(() => {
    dispatch(GetItemsList('community'));
  }, []);
  const navigate = useNavigate();
  const navigateTo = () => {
    navigate('/community');
  };

  return (
    <div className='py-5'>
      <div className='container'>
        <h2 className='h3 text-primary mb-3'>Community</h2>
        {device.mediaIsPhone ? (
          <>
            <div className='title-border-box my-3'></div>
            <p className='text-primary pb-3'>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam
              ipsum velit, tempor at luctus quis.
            </p>
          </>
        ) : (
          <div className='mb-5 d-flex justify-content-between align-items-center'>
            <p className='text-primary responsive-width'>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam
              ipsum velit, tempor at luctus quis, congue eget justo. Quisque
              auctor massa non dapibus varius.
            </p>
            <Button color='primary' onClick={navigateTo}>
              Esplora tutti i topic
            </Button>
          </div>
        )}
      </div>
      <div className='container row'>
        {topicsList.slice(0, 6).map((communityElement, i) => (
          <div
            key={i}
            className={clsx(
              'col-12',
              'col-md-6',
              'col-lg-4',
              'my-2',
              'align-cards'
            )}
          >
            <CardCommunity {...communityElement} />
          </div>
        ))}
      </div>
      {device.mediaIsPhone && (
        <>
          <div className='slider pb-4 pl-4'>
            <a href='#slide-1'> </a>
            <a href='#slide-2'> </a>
            <a href='#slide-3'> </a>
            <a href='#slide-4'> </a>
          </div>
          <div className='d-flex justify-content-center'>
            <Button color='primary' onClick={navigateTo}>
              Esplora tutti i topic
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default memo(CommunityWidget);

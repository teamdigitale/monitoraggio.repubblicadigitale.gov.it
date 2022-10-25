import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { CardCommunity } from '../../../../../components';
import { selectDevice } from '../../../../../redux/features/app/appSlice';
import { useAppSelector } from '../../../../../redux/hooks';
import '../../../../../pages/facilitator/Home/components/BachecaDigitaleWidget/bachecaDigitaleWidget.scss';
import { GetTopicsList } from '../../../../../redux/features/forum/forumThunk';
import Slider, {
  formatSlides,
} from '../../../../../components/General/Slider/Slider';
import { getMediaQueryDevice } from '../../../../../utils/common';
import clsx from 'clsx';

const communityPagination = {
  desktop: 6,
  mobile: 1,
  tablet: 3,
};

const carouselPagination = {
  desktop: 1,
  mobile: 6,
  tablet: 3,
};

const CommunityWidget = () => {
  const dispatch = useDispatch();
  const device = useAppSelector(selectDevice);
  const [topicsList, setTopicsList] = useState([]);

  const topicWidgetSet = async () => {
    const itemPerPage = communityPagination.desktop.toString();
    const res = await dispatch(
      GetTopicsList(
        {
          page: [{ label: '0', value: '0' }],
          items_per_page: [{ label: itemPerPage, value: itemPerPage }],
        },
        false
      )
    );
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    setTopicsList(res?.data?.data?.items || []);
  };

  useEffect(() => {
    topicWidgetSet();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const cardArray: any[] = [
    topicsList.slice(0, communityPagination[getMediaQueryDevice(device)]),
  ];

  return (
    <div className='py-5'>
      <div className='container'>
        <h2 className='h3 text-primary mb-3'>Community</h2>
        {device.mediaIsPhone && <div className='title-border-box my-3' />}
        <div
          className={clsx(
            !device.mediaIsPhone &&
              'mb-5 d-flex justify-content-between align-items-center'
          )}
        >
          <p
            className={clsx(
              'text-primary',
              device.mediaIsPhone ? 'pb-3' : 'responsive-width'
            )}
          >
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam
            ipsum velit, tempor at luctus quis.
          </p>
          {!device.mediaIsPhone && (
            <a className='btn btn-primary' role='button' href='/community'>
              Esplora tutti i topic
            </a>
          )}
        </div>
      </div>
      <div className='container'>
        {!device.mediaIsPhone ? (
          cardArray.map((el: any, i: number) => (
            <div key={`slide-${i}`} className='row'>
              {el.map((e: any, index: any) => (
                <div
                  key={`card-${i}-${index}`}
                  className={clsx(
                    'col-12',
                    'col-md-6',
                    'col-lg-4',
                    'mb-2',
                    'align-cards'
                  )}
                >
                  <CardCommunity {...e} />
                </div>
              ))}
            </div>
          ))
        ) : (
          <Slider isItemsHome>
            {formatSlides(
              topicsList.slice(
                0,
                communityPagination[getMediaQueryDevice(device)]
              ),
              carouselPagination[getMediaQueryDevice(device)]
            ).map((el, i) => (
              <div
                key={`slide-${i}`}
                className='d-flex flex-wrap justify-content-between align-cards w-100'
              >
                {el.map((e: any, index: any) => (
                  <div key={`card-${i}-${index}`} className='flex-grow-0 my-2'>
                    <CardCommunity {...e} />
                  </div>
                ))}
              </div>
            ))}
          </Slider>
        )}
      </div>
      {device.mediaIsPhone && (
        <div className='d-flex justify-content-center mt-5'>
          <a role='button' className='btn btn-primary' href='/community'>
            Esplora tutti i topic
          </a>
        </div>
      )}
    </div>
  );
};

export default CommunityWidget;

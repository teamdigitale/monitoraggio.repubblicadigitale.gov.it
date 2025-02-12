import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import clsx from 'clsx';
import './bachecaDigitaleWidget.scss';
import CardShowcase from '../../../../../components/CardShowcase/cardShowcase';
import { useAppSelector } from '../../../../../redux/hooks';
import { selectDevice } from '../../../../../redux/features/app/appSlice';
import { GetNewsList } from '../../../../../redux/features/forum/forumThunk';
import Slider, {
  formatSlides,
} from '../../../../../components/General/Slider/Slider';
import { getMediaQueryDevice } from '../../../../../utils/common';
import { EmptySection } from '../../../../../components';
import { Link } from 'react-router-dom';

const newsPagination = {
  desktop: 24,
  mobile: 8,
  tablet: 12,
};

const carouselPagination = {
  desktop: 6,
  mobile: 1,
  tablet: 3,
};

const BachecaDigitaleWidget = () => {
  const device = useAppSelector(selectDevice);
  const dispatch = useDispatch();
  const [newsList, setNewsList] = useState([]);
  const [titleEmptySection, setTitleEmptySection] = useState<string>('Caricamento in corso');

  const newsWidgetSet = async () => {
    const itemPerPage = newsPagination[getMediaQueryDevice(device)].toString();
    const res = null;
    // const res = await dispatch(
    //   GetNewsList(
    //     {
    //       page: [{ label: '0', value: '0' }],
    //       items_per_page: [{ label: itemPerPage, value: itemPerPage }],
    //     },
    //     false
    //   )
    // );
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const newsItems = res?.data?.data?.items || [];
    setNewsList(newsItems);
    if (newsItems.length === 0 && !!res) {
      setTitleEmptySection('Non ci sono annunci');
    } else if (!res) {
      setTitleEmptySection("Non è stato possibile accedere ai contenuti. Accedi alla sezione Bacheca");
    }
  };

  useEffect(() => {
    newsWidgetSet();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className='py-5'>
      <div className='container'>
        <h2 className='h3 text-primary mb-3'>Bacheca</h2>
        {device.mediaIsPhone && <div className='title-border-box my-3' />}
        <div
          className={clsx(
            !device.mediaIsPhone
              ? 'mb-5 d-flex justify-content-between align-items-center'
              : 'mb-4'
          )}
        >
          <p
            className={clsx(
              'text-primary',
              !device.mediaIsPhone && 'responsive-width'
            )}
          >
            Scopri gli annunci da non perdere rivolti alla community dei
            facilitatori.
          </p>
          {!device.mediaIsPhone && (
            <Link className='btn btn-primary' role='button' to='/bacheca'>
              Vai agli annunci
            </Link>
          )}
        </div>
      </div>
      <div className='container'>
        <span className='sr-only'>
          {'La bacheca presenta ' + (newsList?.length || 0) + ' annunci'}
        </span>
        {newsList?.length ? (
          <Slider isItemsHome={!device.mediaIsPhone} widgetType='news'>
            {formatSlides(
              newsList.slice(0, newsPagination[getMediaQueryDevice(device)]),
              carouselPagination[getMediaQueryDevice(device)]
            ).map((el, i) => (
              <div key={`slide-${i}`} className='d-flex flex-wrap align-cards w-100'>
                {el.map((e: any, index: any) => (
                  <div key={`card-${i}-${index}`} className='flex-grow-0 mt-2 mb-3 mr-2'>
                    <CardShowcase {...e}></CardShowcase>
                  </div>
                ))}
              </div>
            ))}
          </Slider>
        ) : (
          <EmptySection title={titleEmptySection} />
        )}
      </div>
      {device.mediaIsPhone && (
        <div className='d-flex justify-content-center mt-5'>
          <a className='btn btn-primary' role='button' href='/bacheca'>
            Leggi tutti gli annunci
          </a>
        </div>
      )}
    </div>
  );
};

export default BachecaDigitaleWidget;

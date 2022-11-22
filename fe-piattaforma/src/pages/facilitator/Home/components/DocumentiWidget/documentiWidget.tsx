import clsx from 'clsx';
import React, { memo, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import CardDocument from '../../../../../components/CardDocument/cardDocument';
import { selectDevice } from '../../../../../redux/features/app/appSlice';
import { useAppSelector } from '../../../../../redux/hooks';
import '../../../../../pages/facilitator/Home/components/BachecaDigitaleWidget/bachecaDigitaleWidget.scss';
import { GetDocumentsList } from '../../../../../redux/features/forum/forumThunk';
import Slider, {
  formatSlides,
} from '../../../../../components/General/Slider/Slider';
import { getMediaQueryDevice } from '../../../../../utils/common';
import { EmptySection } from '../../../../../components';
import { Link } from 'react-router-dom';

const docsPagination = {
  desktop: 4,
  mobile: 8,
  tablet: 2,
};

const carouselPagination = {
  desktop: 4,
  mobile: 1,
  tablet: 2,
};

const DocumentsWidget = () => {
  const dispatch = useDispatch();
  const device = useAppSelector(selectDevice);
  const [docsList, setDocsList] = useState([]);

  const docsWidgetSet = async () => {
    const itemsPerPage = docsPagination[getMediaQueryDevice(device)].toString();
    const res = await dispatch(
      GetDocumentsList(
        {
          page: [{ label: '0', value: '0' }],
          items_per_page: [{ label: itemsPerPage, value: itemsPerPage }],
        },
        false
      )
    );
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    setDocsList(res?.data?.data?.items || []);
  };

  useEffect(() => {
    docsWidgetSet();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [device]);

  const cardArray: any[] = [
    docsList.slice(0, docsPagination[getMediaQueryDevice(device)]),
  ];

  return (
    <div
      className={clsx('d-flex', 'py-5', !device.mediaIsDesktop && 'flex-wrap')}
    >
      <div className={clsx(device.mediaIsDesktop ? 'col-4' : 'col-12')}>
        <h2 className='h3 text-primary'>Documenti</h2>

        {device.mediaIsPhone && <div className='title-border-box my-3' />}
        <p
          className={clsx(
            'text-primary',
            device.mediaIsPhone ? 'pb-3' : 'py-3'
          )}
        >
          Scopri risorse e informazioni utili per la gestione dei servizi a cui
          partecipi.
        </p>
        {device.mediaIsDesktop && (
          <div>
            <p
              className={clsx(
                'text-primary',
                'py-3',
                !device.mediaIsPhone ? 'mb-4' : 'mb-3'
              )}
            >
              Collabora in linea con altri facilitatori per creare e condividere
              nuovi documenti.
            </p>
            <Link role='button' className='btn btn-primary' to='/documenti'>
              Vai ai documenti
            </Link>
          </div>
        )}
      </div>
      <div className={clsx(device.mediaIsDesktop ? 'col-8' : 'col-12')}>
        <div className='container d-flex flex-wrap'>
          {docsList?.length ? (
            !device.mediaIsPhone ? (
              cardArray.map((el: any, i: number) => (
                <div key={`slide-${i}`} className='row'>
                  {el.map((e: any, index: any) => (
                    <div
                      key={`card-${i}-${index}`}
                      className={clsx(
                        'col-12',
                        'col-md-7',
                        'col-lg-6',
                        'mb-2',
                        'd-flex',
                        'flex-wrap',
                        el.length === 1
                          ? 'justify-content-between'
                          : 'justify-content-around'
                      )}
                    >
                      <CardDocument {...e} isHome />
                    </div>
                  ))}
                </div>
              ))
            ) : (
              <Slider isItemsHome widgetType='documents'>
                {formatSlides(
                  docsList.slice(
                    0,
                    docsPagination[getMediaQueryDevice(device)]
                  ),
                  carouselPagination[getMediaQueryDevice(device)]
                ).map((el, i) => (
                  <div
                    key={`slide-${i}`}
                    className='d-flex flex-wrap justify-content-between align-cards w-100'
                  >
                    {el.map((e: any, index: any) => (
                      <div
                        key={`card-${i}-${index}`}
                        className='flex-grow-0 my-2'
                      >
                        <CardDocument {...e} isHome />
                      </div>
                    ))}
                  </div>
                ))}
              </Slider>
            )
          ) : (
            <EmptySection title='Non ci sono documenti' />
          )}
        </div>
      </div>
      {!device.mediaIsDesktop && (
        <div className='d-flex justify-content-center mt-5 w-100'>
          <Link role='button' className='btn btn-primary' to='/documenti'>
            Accedi alla sezione
          </Link>
        </div>
      )}
    </div>
  );
};

export default memo(DocumentsWidget);

import clsx from 'clsx';
import React, { memo } from 'react';
import { Card } from '../../../../../components';
import { selectDevice } from '../../../../../redux/features/app/appSlice';
import { useAppSelector } from '../../../../../redux/hooks';

const BachecaDigitaleWidget = () => {
  const device = useAppSelector(selectDevice);

  return (
    <div className='bacheca-digitale-widget py-5'>
      <h2 className='h3 text-primary mb-3'>Bacheca Digitale</h2>
      <div className='d-flex flex-lg-row flex-column'>
        <div className='' style={{ maxWidth: '376px' }}>
          <Card
            category='Richiesta'
            cta='Leggi di più'
            img='https://via.placeholder.com/310x94/0066cc/FFFFFF/?text=IMMAGINE%20DI%20ESEMPIO'
            text='Si richiede agli enti le indicazioni per la candidatura al Servizio civile digitale, con annessi documenti inerenti i prerequisiti di base necessari alla candidatura.'
            title='Servizio Civile Digitale'
            wrapperClassName='h-100 mr-4'
          />
        </div>
        <div className='d-flex flex-wrap'>
          <div
            className={clsx(
              device.mediaIsPhone ? 'd-flex flex-column' : 'd-flex'
            )}
          >
            <Card
              category='Annuncio'
              cta='Rispondi'
              ctaHref='/'
              text='Sono disponibile per aiutare nuovi facilitatori a compilare i primi questionari e fare rete.'
              title='Successo completamento questionari'
              wrapperClassName='mr-4'
            />
            <Card
              category='Annuncio'
              cta='Rispondi'
              ctaHref='/'
              text='Cerco supporto di altri facilitatori per l’analisi di risposta dei questionari e la percentuale di riuscita nella loro compilazione.'
              title='Collaborazione nuovi facilitatori'
            />
          </div>
          <div className='d-flex'>
            <Card
              big
              cta='Esplora la sezione annunci'
              ctaOnClick={() => console.log('cliccato')}
              inline
              text='Vogliamo favorire la comunicazione e la creazione di vere e proprie community tra i facilitatori digitali, abbattendo le distanze territoriali.'
              title='Comunica con tutti gli utenti'
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(BachecaDigitaleWidget);

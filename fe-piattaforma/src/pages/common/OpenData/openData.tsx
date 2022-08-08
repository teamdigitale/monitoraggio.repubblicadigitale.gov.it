import React, { memo, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import clsx from 'clsx';
import { Container } from 'design-react-kit';
import PageTitle from '../../../components/PageTitle/pageTitle';
import { hideLoader, showLoader } from '../../../redux/features/app/appSlice';
import API from '../../../utils/apiHelper';
import { InfoPanel, Table } from '../../../components';
import { newTable } from '../../../components/Table/table';
import { staticValues, TableHeading } from './utils';
import moment from 'moment';

const tableValues = newTable(TableHeading, staticValues);

const OpenData = () => {
  const dispatch = useDispatch();
  const [totalCount, setTotalCount] = useState<string>('-');
  const [docHref, setDocHref] = useState<string>();

  const getOpenData = async () => {
    try {
      dispatch(showLoader());
      const resCount = await API.get('open-data/count/download');
      setTotalCount(resCount.data.toString());
      const resDoc = await API.get('open-data/presigned/download');
      setDocHref(resDoc.data.toString());
    } catch (error) {
      console.log('getOpenData error', error);
    } finally {
      dispatch(hideLoader());
    }
  };

  useEffect(() => {
    getOpenData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Container>
      <PageTitle
        title='Open Data'
        subtitle="Nell'ambito dell'iniziativa di Repubblica Digitale sono erogati servizi di facilitazione e formazione ai cittadini al fine di incrementare le loro competenze digitali.
Tali servizi sono erogati a livello nazionale presso le sedi designate a tale scopo; inoltre sono rilevate le principali caratteristiche della popolazione partecipante e della tipologia di servizio erogato."
      />
      <InfoPanel
        list={[
          'Nome Dataset: Statistiche del Piano Operativo per le Competenze Digitali',
          'Copertura temporale: 2022',
          'Data ultima pubblicazione: 23/12/2021',
          'Periodicità rilevazione: Semestrale',
          'Copertura geografica: Nazionale',
        ]}
      />
      <a
        className={clsx('btn', 'btn-primary', !docHref && 'disabled')}
        href={docHref}
        download
      >
        Scarica CSV (6 Mb)
      </a>
      <div className={clsx('mt-5')}>
        <Table {...tableValues} />
        <div>
          {moment().format('DD/MM/yyyy')} {totalCount}
        </div>
      </div>
    </Container>
  );
};

export default memo(OpenData);

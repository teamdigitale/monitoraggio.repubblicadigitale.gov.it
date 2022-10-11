import React, { memo, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import clsx from 'clsx';
import { Button, Container, Icon } from 'design-react-kit';
import PageTitle from '../../../components/PageTitle/pageTitle';
import {
  hideLoader,
  selectDevice,
  showLoader,
} from '../../../redux/features/app/appSlice';
import API from '../../../utils/apiHelper';
import { InfoPanel, Table } from '../../../components';
import { newTable } from '../../../components/Table/table';
import { staticValues, TableHeading } from './utils';
import {
  openDataBody,
  openDataSubtitle,
} from '../../../components/SectionInfo/bodies';
import { downloadFile } from '../../../utils/common';
import { useAppSelector } from '../../../redux/hooks';

const tableValues = newTable(TableHeading, staticValues);

const OpenData = () => {
  const dispatch = useDispatch();
  const [totalCount, setTotalCount] = useState<string>('-');
  const [dateCoverage, setDateCoverage] = useState<string>('-');
  const [lastDate, setLastDate] = useState<string>('-');
  const [docSize, setDocSize] = useState<number>(0);
  const device = useAppSelector(selectDevice);

  const getDocumentUrl = async () => {
    try {
      dispatch(showLoader());
      const resDoc = await API.get('open-data/presigned/download');
      downloadFile(resDoc.data.toString(), 'opendata_cittadini.csv');
    } catch (error) {
      console.log('getDocumentUrl error', error);
    } finally {
      dispatch(hideLoader());
    }
  };

  const getOpenData = async () => {
    try {
      dispatch(showLoader());
      const resCount = await API.get('open-data/count/download');
      setTotalCount(resCount.data?.conteggioDownload?.toString());
      setDateCoverage(resCount.data?.anniCopertura?.toString());
      setLastDate(resCount.data?.dataUltimaPubblicazione?.toString());
      setDocSize(
        Math.max(1, Math.floor(Number(resCount.data?.dimensioneFile) / 1000))
      );
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
  useEffect(() => {
    getOpenData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dateCoverage, lastDate]);


  return (
    <Container className='py-5'>
      <PageTitle
        title='Open data: servizi di facilitazione e formazione per i cittadini'
        innerHTML
        HTMLsubtitle={openDataSubtitle}
      />
      <InfoPanel openData HTMLlist body={openDataBody(dateCoverage, lastDate)} colsNo={0} />
      <div
        className={clsx(
          'd-flex',
          device.mediaIsPhone ? 'flex-column' : 'flex-row',
          'justify-content-between',
          'align-items-center',
          'pr-2',
          'py-2',
          'mt-5'
        )}
      >
        <div className='d-flex'>
          <span>Scarica i dati</span>
        </div>
        <div className='d-flex'>
          <Button color='primary' onClick={getDocumentUrl}>
            Scarica CSV {docSize ? `(${docSize} Kb)` : null}
          </Button>
        </div>
        <div className={clsx('d-flex', 'flex-row', 'align-items-center')}>
          <Icon icon='it-download' color='primary' size='' className='pr-2' />
          {totalCount} Download
        </div>
      </div>
      <div className={clsx('mt-5')}>
        <div
          className={clsx(
            'd-flex',
            'flex-column',
            'lightgrey-bg-a1',
            'align-items-center',
            'text-center',
            'my-3',
            'py-4'
          )}
        >
          <strong>Servizi di facilitazione e formazione</strong>
          Modello di lettura del file di dati con elenco delle colonne e
          relative descrizioni
        </div>
        <Table {...tableValues} />
      </div>
    </Container>
  );
};

export default memo(OpenData);

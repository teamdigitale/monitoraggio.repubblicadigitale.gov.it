import React, { memo, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import clsx from 'clsx';
import { Button, Container, Icon } from 'design-react-kit';
import PageTitle from '../../../components/PageTitle/pageTitle';
import { hideLoader, showLoader } from '../../../redux/features/app/appSlice';
import API from '../../../utils/apiHelper';
import { InfoPanel, Table } from '../../../components';
import { newTable } from '../../../components/Table/table';
import { staticValues, TableHeading } from './utils';
import moment from 'moment';
import {
  openDataBody,
  openDataSubtitle,
} from '../../../components/SectionInfo/bodies';
import { downloadFile } from '../../../utils/common';

const tableValues = newTable(TableHeading, staticValues);

const OpenData = () => {
  const dispatch = useDispatch();
  const [totalCount, setTotalCount] = useState<string>('-');
  const [docSize, setDocSize] = useState<number>(0);

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
      setDocSize(Math.floor(Number(resCount.data?.dimensioneFile) / 1000));
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
      <PageTitle title='Open Data' innerHTML HTMLsubtitle={openDataSubtitle} />
      <InfoPanel openData HTMLlist body={openDataBody} colsNo={0} />
      <div className='d-flex justify-content-end pt-4'>
        <Button color='primary' onClick={getDocumentUrl}>
          Scarica CSV {docSize ? `(${docSize} Kb)` : null}
        </Button>
      </div>
      <div className={clsx('mt-5')}>
        <Table {...tableValues} />
        <div
          className={clsx(
            'd-flex',
            'flex-row',
            'justify-content-end',
            'pr-2',
            'py-2'
          )}
        >
          <div
            className={clsx(
              'pr-4',
              'd-flex',
              'flex-row',
              'justify-content-end',
              'align-items-center'
            )}
          >
            <Icon icon='it-calendar' color='primary' size='' className='pr-2' />
            {moment().format('DD/MM/yyyy')}
          </div>
          <div
            className={clsx(
              'd-flex',
              'flex-row',
              ',justify-content-end',
              'align-items-center'
            )}
          >
            <Icon icon='it-download' color='primary' size='' className='pr-2' />
            {totalCount}
          </div>
        </div>
      </div>
    </Container>
  );
};

export default memo(OpenData);

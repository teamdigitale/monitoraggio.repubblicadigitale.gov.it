import React, { memo, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import clsx from 'clsx';
import { Container, Icon } from 'design-react-kit';
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
      <PageTitle title='Open Data' innerHTML HTMLsubtitle={openDataSubtitle} />
      <InfoPanel openData HTMLlist body={openDataBody} colsNo={0} />
      <div className='d-flex justify-content-end pt-4'>
        <a
          className={clsx('btn', 'btn-primary', !docHref && 'disabled')}
          href={docHref}
          download
        >
          Scarica CSV (6 Mb)
        </a>
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

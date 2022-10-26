import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { EmptySection } from '../../../components';
import PageTitle from '../../../components/PageTitle/pageTitle';
import ReportCard from '../../../components/ReportCard/ReportCard';
import { selectReportsList } from '../../../redux/features/forum/forumSlice';
import { GetReportsList } from '../../../redux/features/forum/reports/reportsThunk';
import { useAppSelector } from '../../../redux/hooks';

const Reports = () => {
  const reportsList = useAppSelector(selectReportsList);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(GetReportsList());
  }, []);

  return (
    <div className='container'>
      <div className='d-flx flex-column align-items-start'>
        <PageTitle title='Gestione segnalazioni' />
        <p className='my-4 primary-color-a9'>
          Lorem ipsum dolor sit, amet consectetur adipisicing elit. Facilis
          veritatis ipsa veniam ullam impedit quibusdam iusto ad? Totam iste
          sint a assumenda sapiente, omnis fuga, tempora quidem amet odio
          cumque!
        </p>
        {reportsList?.length ? (
          reportsList.map((report, i) => <ReportCard key={i} {...report} />)
        ) : (
          <EmptySection
            title='Non sono presenti segnalazioni'
            icon='it-note'
            withIcon
          />
        )}
      </div>
    </div>
  );
};

export default Reports;

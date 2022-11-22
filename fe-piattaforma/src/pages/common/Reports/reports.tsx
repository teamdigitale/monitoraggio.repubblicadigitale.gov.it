import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { EmptySection } from '../../../components';
import PageTitle from '../../../components/PageTitle/pageTitle';
import ReportCard from '../../../components/ReportCard/ReportCard';
import { selectReportsList } from '../../../redux/features/forum/forumSlice';
import { GetReportsList } from '../../../redux/features/forum/reports/reportsThunk';
import { useAppSelector } from '../../../redux/hooks';
import IconNote from '/public/assets/img/it-note-primary.png';

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
          Gestisci le segnalazioni, verifica le motivazioni inviate dagli utenti
          e modera i commenti
        </p>
        {reportsList?.length ? (
          reportsList.map((report, i) => <ReportCard key={i} {...report} />)
        ) : (
          <EmptySection
            title='Non sono presenti segnalazioni'
            icon={IconNote}
            withIcon
          />
        )}
      </div>
    </div>
  );
};

export default Reports;

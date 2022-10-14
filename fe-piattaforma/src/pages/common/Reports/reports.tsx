import React from 'react';
// import { ReportCard } from '../../../components';
import PageTitle from '../../../components/PageTitle/pageTitle';

const Reports = () => {
  return (
    <div className='container'>
      <div className='d-flx flex-column align-items-start'>
        <PageTitle title='Gestione segnalazioni' />
        <p className='my-4'>
          Lorem ipsum dolor sit, amet consectetur adipisicing elit. Facilis
          veritatis ipsa veniam ullam impedit quibusdam iusto ad? Totam iste
          sint a assumenda sapiente, omnis fuga, tempora quidem amet odio
          cumque!
        </p>
        {/* {comments.map((item, i) => (
          <ReportCard
            key={i}
            writingUser={item.answer.user}
            commentDate={item.answer.commentDate}
            commentBody={item.answer.commentBody}
          />
        ))} */}
      </div>
    </div>
  );
};

export default Reports;

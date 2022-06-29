import clsx from 'clsx';
import React from 'react';
import { SurveyQuestionI } from '../../../../../../../redux/features/administrativeArea/surveys/surveysSlice';
import './printFields.scss';

export interface PrintFieldI {
  info: SurveyQuestionI;
  className?: string;
}

const PrintTextField: React.FC<PrintFieldI> = (props) => {
  const { info, className } = props;

  return (
    <div
      className={clsx(
        className,
        'print-fields-container__text-field',
        info.form['question-description'].value.length > 50
          ? 'w-100'
          : 'print-fields-container__half-width'
      )}
    >
      <p className='d-flex flex-column mb-3'>
        <strong>{info.form['question-description'].value}</strong>
        <input className='border-0' />
      </p>
    </div>
  );
};

export default PrintTextField;

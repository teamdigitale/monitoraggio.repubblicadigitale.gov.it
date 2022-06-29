import React, { useEffect, useState } from 'react';
import {
  SurveyQuestionI,
  SurveySectionI,
  SurveyStateI,
} from '../../../../../../redux/features/administrativeArea/surveys/surveysSlice';
import { transformJsonToForm } from '../../../../../../utils/jsonFormHelper';
import PrintCheckboxField from './components/printCheckboxField';
import PrintSelectField from './components/printSelectField';
import PrintTextField from './components/printTextField';

const PrintSurvey: React.FC = () => {
  const [formMock, setFormMock] = useState<SurveyStateI>();

  const loadMock = async () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const response = await import('/mock/responseQuestionario.json');
    setFormMock(transformJsonToForm(response?.default));
  };

  useEffect(() => {
    loadMock();
  }, []);

  const getAnswerType = (question: SurveyQuestionI) => {
    switch (question.form['question-type'].value) {
      case 'select':
        return (
          <PrintSelectField
            info={question}
            className='d-inline-block mr-3 mb-3'
          />
        );
      case 'checkbox':
        return (
          <PrintCheckboxField
            info={question}
            className='d-inline-block mr-3 mb-3'
          />
        );
      case 'date':
      default:
        return (
          <PrintTextField
            info={question}
            className='d-inline-block mr-3 mb-3'
          />
        );
    }
  };

  return (
    <div className='container my-3 py-5'>
      {(formMock?.sections || []).map((section: SurveySectionI, i: number) => (
        <div key={i} className='mb-5'>
          <h1 className='h2 primary-color-a6 mb-3'>{section.sectionTitle}</h1>
          <div>
            {(section.questions || []).map((question: SurveyQuestionI) => (
              <>{getAnswerType(question)}</>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default PrintSurvey;

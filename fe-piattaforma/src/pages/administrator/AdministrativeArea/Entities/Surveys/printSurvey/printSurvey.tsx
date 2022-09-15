import clsx from 'clsx';
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import {
  selectPrintSurveySections,
  SurveySectionI,
} from '../../../../../../redux/features/administrativeArea/surveys/surveysSlice';
import { formFieldI } from '../../../../../../utils/formHelper';
import PrintBoxField from './components/printBoxField';
import PrintSelectField from './components/printSelectField';
import PrintTextField from './components/printTextField';
import { GetSurveyInfo } from '../../../../../../redux/features/administrativeArea/surveys/surveysThunk';
import { useAppSelector } from '../../../../../../redux/hooks';
import PrintFieldRating from './components/printFieldRating';

export interface PrintSurveyQuestionI extends Omit<formFieldI, 'type'> {
  type: string;
  title: string;
  enum: string[];
  properties: { [key: string]: { [key: string]: string } };
}

interface PrintSuveySectionI {
  id: string;
  type: string;
  sectionTitle: string;
  questions: {
    [key: string]: PrintSurveyQuestionI;
  }
}

const PrintSurvey: React.FC = () => {
  const dispatch = useDispatch();
  const { idQuestionario } = useParams();
  const sections = useAppSelector(selectPrintSurveySections);

  useEffect(() => {
    if (idQuestionario) dispatch(GetSurveyInfo(idQuestionario, true));
  }, [idQuestionario]);

  const getAnswerType = (question: PrintSurveyQuestionI, section: PrintSuveySectionI) => {
    switch (question.type) {
      case 'range':
        return (
          <PrintFieldRating
            info={question}
            className='d-inline-block mr-3 mb-5'
          />
        );
      case 'object':
        if (question?.properties) {
          return (
            <PrintSelectField
              info={question}
              className={clsx(
                'd-inline-block',
                'mr-3',
                'mb-5',
                question.flag && 'align-bottom'
              )}
              noLabel={question.flag ? true : false}
              halfWidth={question.flag ? true : false}
            />
          );
        } else if (question?.enumLevel1 && question?.enumLevel2) {
          return (
            <PrintBoxField
              info={question}
              className='d-inline-block mr-3 mb-5'
              optionsLevel2={question.enumLevel2}
            />
          );
        } else if (
          question?.enumLevel1 &&
          !question?.enumLevel2 &&
          question?.relatedTo
        ) {
          return (
            <PrintBoxField
              info={question}
              className='d-inline-block mr-3 mb-5'
              optionsLevel2={
                section.questions?.[question.relatedTo]?.enumLevel2 || []
              }
            />
          );
        } else {
          return null;
        }
      case 'multiple':
      case 'string':
        if (question?.enum?.length) {
          return (
            <PrintSelectField
              info={question}
              className={clsx(
                'd-inline-block',
                'mr-3',
                'mb-5',
              )}
            />
          );
        } else {
          return (
            <PrintTextField
              info={question}
              className='d-inline-block mr-3 mb-5'
            />
          );
        }
      case 'date':
      case 'number':
      case 'time':
      default:
        return (
          <PrintTextField
            info={question}
            className='d-inline-block mr-3 mb-5'
          />
        );
    }
  };

  return (
    <div className='container my-3 py-5'>
      {(sections || []).map((section: SurveySectionI, i: number) => (
        <div key={i} className='mb-5'>
          <h1 className='h2 primary-color-a6 mb-5'>{section?.sectionTitle}</h1>
          {section?.questions &&
            Object.keys(section?.questions).map((key) => (
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore
              <>{getAnswerType(section?.questions?.[key], section)}</>
            ))}
        </div>
      ))}
    </div>
  );
};

export default PrintSurvey;

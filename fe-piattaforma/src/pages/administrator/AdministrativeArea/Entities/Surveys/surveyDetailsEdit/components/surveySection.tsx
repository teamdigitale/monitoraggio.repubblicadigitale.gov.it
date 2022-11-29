import { Col } from 'design-react-kit';
import React from 'react';
import SurveyQuestion from './SurveyQuestion/surveyQuestion';
import {
  SurveyQuestionI,
  SurveySectionI,
} from '../../../../../../../redux/features/administrativeArea/surveys/surveysSlice';
import clsx from 'clsx';
import { useAppSelector } from '../../../../../../../redux/hooks';
import { selectDevice } from '../../../../../../../redux/features/app/appSlice';

const SurveySection: React.FC<SurveySectionI> = (props) => {
  const {
    id,
    sectionTitle,
    questions = [],
    editMode = false,
    cloneMode = false,
    isModal = false,
  } = props;

  const device = useAppSelector(selectDevice);

  return (
    <section aria-label={sectionTitle}>
      <h2
        className={clsx(
          'primary-color-a6',
          'mb-4',
          !isModal && 'h4',
          isModal && 'survey-section-container__section-title-modal'
        )}
      >
        {sectionTitle}
        <span className='survey-section-container__section-title-items'>
          &nbsp;({questions.length})
        </span>
      </h2>
      <Col>
        {questions.map((question: SurveyQuestionI, i: number) => (
          <div
            key={`section-${id}-question-${i}`}
            className={clsx(device.mediaIsPhone && 'position-relative')}
          >
            <SurveyQuestion
              {...question}
              sectionID={id}
              position={i}
              editMode={editMode}
              cloneMode={cloneMode}
            />
          </div>
        ))}
      </Col>
    </section>
  );
};

export default SurveySection;

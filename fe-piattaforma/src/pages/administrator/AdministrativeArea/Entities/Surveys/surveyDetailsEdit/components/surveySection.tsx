import { Col } from 'design-react-kit';
import React from 'react';
import SurveyQuestion from './SurveyQuestion/surveyQuestion';
import {
  SurveyQuestionI,
  SurveySectionI,
} from '../../../../../../../redux/features/administrativeArea/surveys/surveysSlice';

const SurveySection: React.FC<SurveySectionI> = (props) => {
  const {
    id,
    sectionTitle,
    questions = [],
    editMode = false,
    cloneMode = false,
  } = props;

  return (
    <section aria-label={sectionTitle}>
      <h2 className='h4 primary-color-a6 mb-3'>
        {sectionTitle} ({questions.length})
      </h2>
      <Col>
        {questions.map((question: SurveyQuestionI, i: number) => (
          <React.Fragment key={`section-${id}-question-${i}`}>
            <SurveyQuestion
              {...question}
              sectionID={id}
              position={i}
              editMode={editMode}
              cloneMode={cloneMode}
            />
          </React.Fragment>
        ))}
      </Col>
    </section>
  );
};

export default SurveySection;

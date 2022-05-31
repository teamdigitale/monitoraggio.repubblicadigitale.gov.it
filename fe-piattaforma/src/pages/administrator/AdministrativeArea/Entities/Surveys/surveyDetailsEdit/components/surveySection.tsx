import { Col } from 'design-react-kit';
import React, { useEffect, useState } from 'react';
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
    handleActiveSection = () => ({}),
    isSectionActive = false,
    editMode = false,
    cloneMode = false,
  } = props;
  const [activeQuestionIndex, setActiveQuestionIndex] = useState<
    number | undefined
  >(undefined);

  useEffect(() => {
    if (questions && questions.length - 1 !== activeQuestionIndex) {
      setActiveQuestionIndex(questions.length - 1);
    }
  }, [questions.length]);

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
              isOpenFromSection={i === activeQuestionIndex && isSectionActive}
              handleEditQuestion={(activeQuestion, activeSection) => {
                setActiveQuestionIndex(activeQuestion);
                handleActiveSection(activeSection);
              }}
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

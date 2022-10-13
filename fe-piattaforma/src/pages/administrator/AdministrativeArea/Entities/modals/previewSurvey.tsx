import clsx from 'clsx';
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import GenericModal from '../../../../../components/Modals/GenericModal/genericModal';
import { GetSurveyInfo } from '../../../../../redux/features/administrativeArea/surveys/surveysThunk';
import { closeModal } from '../../../../../redux/features/modal/modalSlice';
import SurveyTemplate from '../Surveys/surveyDetailsEdit/components/surveyTemplate';

const id = 'previewSurveyModal';

interface PreviewSurveyI {
  surveyId?: string;
  onClose: () => void;
  primaryCtaAction?: () => void;
  secondaryCtaAction?: () => void;
}

const PreviewSurvey: React.FC<PreviewSurveyI> = ({
  surveyId = '',
  onClose,
  // primaryCtaAction = () => ({}),
  // secondaryCtaAction = () => ({}),
}) => {
  const dispatch = useDispatch();

  useEffect(() => {
    if (surveyId) dispatch(GetSurveyInfo(surveyId));
  }, [surveyId]);

  return (
    <GenericModal
      id={id}
      primaryCTA={{
        label: 'Chiudi',
        onClick: () => dispatch(closeModal()),
      }}
      onClose={onClose}
    >
      <div
        className={clsx(
          'd-flex',
          'justify-content-center',
          'flex-column',
          'mx-3',
          'mb-4'
        )}
      >
        <SurveyTemplate isModal />
      </div>
    </GenericModal>
  );
};

export default PreviewSurvey;

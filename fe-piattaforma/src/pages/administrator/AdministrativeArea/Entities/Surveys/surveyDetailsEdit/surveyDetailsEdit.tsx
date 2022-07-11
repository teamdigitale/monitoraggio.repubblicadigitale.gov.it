import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import clsx from 'clsx';
import { useAppSelector } from '../../../../../../redux/hooks';
import { FormHelper, FormI } from '../../../../../../utils/formHelper';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import {
  selectDevice,
  updateBreadcrumb,
} from '../../../../../../redux/features/app/appSlice';
import DetailLayout from '../../../../../../components/DetailLayout/detailLayout';
import {
  SurveySectionI,
  selectSurveySections,
  SurveyQuestionI,
  selectSurveyForm,
} from '../../../../../../redux/features/administrativeArea/surveys/surveysSlice';
import {
  SetSurveyCreation,
  GetSurveyInfo,
} from '../../../../../../redux/features/administrativeArea/surveys/surveysThunk';
import SurveyTemplate from './components/surveyTemplate';
import ButtonsBar, {
  ButtonInButtonsBar,
} from '../../../../../../components/ButtonsBar/buttonsBar';
import Sticky from 'react-sticky-el';

interface SurveyDetailsEditI {
  editMode?: boolean;
  cloneMode?: boolean;
}

const SurveyDetailsEdit: React.FC<SurveyDetailsEditI> = ({
  editMode = false,
  cloneMode = false,
}) => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const form = useAppSelector(selectSurveyForm);
  const sections = useAppSelector(selectSurveySections) || [];
  const [editModeState, setEditModeState] = useState<boolean>(editMode);
  const [cloneModeState, setCloneModeState] = useState<boolean>(cloneMode);

  const { idQuestionario } = useParams();

  useEffect(() => {
    if (form['survey-name'].value && idQuestionario) {
      dispatch(
        updateBreadcrumb([
          {
            label: 'Area Amministrativa',
            url: '/area-amministrativa',
            link: false,
          },
          {
            label: 'Questionari',
            url: '/area-amministrativa/questionari',
            link: true,
          },
          {
            label: form['survey-name'].value,
            url: `/area-amministrativa/questionari/${idQuestionario}`,
            link: false,
          },
        ])
      );
    }
  }, [idQuestionario]);

  useEffect(() => {
    const locationSplit = location.pathname.split('/');
    let surveyId = '';
    if (locationSplit.length > 0) {
      switch (locationSplit[locationSplit.length - 1]) {
        case 'modifica':
        case 'clona':
        case 'info':
          surveyId = locationSplit[locationSplit?.length - 2];
          break;
        default:
          surveyId = locationSplit[locationSplit?.length - 1];
          break;
      }
    }
    dispatch(GetSurveyInfo(surveyId));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleOnSubmit = () => {
    dispatch(SetSurveyCreation(false));
  };

  const checkValidityQuestions = (questions: SurveyQuestionI[]) => {
    let isValid = true;
    if (questions?.length > 0) {
      questions.map((question: SurveyQuestionI) => {
        FormHelper.isValidForm(question.form) === false
          ? (isValid = false)
          : '';

        if (
          (question.form['question-type'].value === 'select' ||
            question.form['question-type'].value === 'checkbox') &&
          question.form['question-values'].value === ''
        ) {
          isValid = false;
        }
      });
    }
    return isValid;
  };

  const checkValidityPreviousSections = (section: SurveySectionI) => {
    const isSectionValid = true;
    let questionsValid = true;
    // isSectionValid = FormHelper.isValidForm(section?.form);
    if (section?.questions && section.questions?.length > 0) {
      questionsValid = checkValidityQuestions(section.questions);
    }
    return isSectionValid && questionsValid;
  };

  const checkValidityForm = (form: FormI) => {
    const isValidForm = FormHelper.isValidForm(form);
    let sectionsValid = true;
    if (sections) {
      sections.map((section: SurveySectionI) =>
        checkValidityPreviousSections(section) === false
          ? (sectionsValid = false)
          : ''
      );
    }
    return isValidForm && sectionsValid;
  };

  const device = useAppSelector(selectDevice);

  const cancelSaveButtons: ButtonInButtonsBar[] = [
    {
      text: 'Annulla',
      color: 'primary',
      outline: true,
      onClick: () => {
        setEditModeState(false);
        setCloneModeState(false);
      },
    },
    {
      text: 'Salva Questionario',
      color: 'primary',
      disabled: !checkValidityForm(form),
      onClick: () => {
        handleOnSubmit;
      },
    },
  ];

  const cloneEditButtons: ButtonInButtonsBar[] = [
    {
      text: 'Duplica',
      color: 'primary',
      outline: true,
      onClick: () => {
        setCloneModeState(true);
        setEditModeState(false);
        dispatch(SetSurveyCreation(true));
        navigate(`/area-amministrativa/questionari/${1}/clona`);
      },
    },
    {
      text: 'Modifica',
      color: 'primary',
      onClick: () => {
        setEditModeState(true);
        setCloneModeState(false);
        navigate(`/area-amministrativa/questionari/${1}/modifica`);
      },
    },
  ];

  return (
    <div className='mb-5'>
      <DetailLayout
        titleInfo={{
          title: 'Nome questionario',
          status: '',
          upperTitle: { icon: 'it-file', text: 'Questionario' },
        }}
        formButtons={[]} // TODO?
        buttonsPosition='TOP'
        goBackTitle='Torna indietro'
        goBackPath='/area-amministrativa/questionari'
      />

      <SurveyTemplate editMode={editModeState} cloneMode={cloneModeState} />

      <div
        className={clsx(
          'd-flex',
          'flex-row',
          device.mediaIsPhone
            ? 'justify-content-around'
            : 'justify-content-end',
          'w-100',
          'mt-3'
        )}
      >
        {editModeState || cloneModeState ? (
          <div aria-hidden='true' className='mt-5 w-100'>
            <Sticky mode='bottom' stickyClassName='sticky bg-white container'>
              <ButtonsBar buttons={cancelSaveButtons} />
            </Sticky>
          </div>
        ) : (
          <div aria-hidden='true' className='mt-5 w-100'>
            <Sticky mode='bottom' stickyClassName='sticky bg-white container'>
              <ButtonsBar buttons={cloneEditButtons} />
            </Sticky>
          </div>
        )}
      </div>
    </div>
  );
};

export default SurveyDetailsEdit;

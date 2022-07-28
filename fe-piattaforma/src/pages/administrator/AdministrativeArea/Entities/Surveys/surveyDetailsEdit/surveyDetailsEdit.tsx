import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import clsx from 'clsx';
import { useAppSelector } from '../../../../../../redux/hooks';
import { FormHelper, FormI } from '../../../../../../utils/formHelper';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import {
  selectDevice,
  setInfoIdsBreadcrumb,
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
import useGuard from '../../../../../../hooks/guard';

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
  const { hasUserPermission } = useGuard();

  useEffect(() => {
    if (idQuestionario) dispatch(GetSurveyInfo(idQuestionario));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idQuestionario]);

  useEffect(() => {
    if (form['survey-name']?.value && idQuestionario) {
      dispatch(
        setInfoIdsBreadcrumb({
          id: idQuestionario,
          nome: form['survey-name'].value,
        })
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idQuestionario, form['survey-name']?.value]);

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

  const createUpdateSurvey = async () => {
    setEditModeState(false);
    setCloneModeState(false);
    const res = await dispatch(SetSurveyCreation(cloneModeState));
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    if (res?.data?.['survey-id']) {
      navigate(
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        `/area-amministrativa/questionari/${res?.data?.['survey-id']}`,
        { replace: true }
      );
    } else if (idQuestionario) {
      navigate(`/area-amministrativa/questionari/${idQuestionario}`, {
        replace: true,
      });
      dispatch(GetSurveyInfo(idQuestionario));
    }
  };

  const cancelSaveButtons: ButtonInButtonsBar[] = [
    {
      text: 'Annulla',
      color: 'primary',
      outline: true,
      buttonClass: 'btn-secondary',
      onClick: () => {
        setEditModeState(false);
        setCloneModeState(false);
        navigate(`/area-amministrativa/questionari/${idQuestionario}`, {
          replace: true,
        });
        if (idQuestionario) dispatch(GetSurveyInfo(idQuestionario));
      },
    },
    {
      text: cloneModeState ? 'Crea questionario' : 'Salva Questionario',
      color: 'primary',
      disabled: !checkValidityForm(form),
      onClick: () => createUpdateSurvey(),
    },
  ];

  const cloneEditButtons: ButtonInButtonsBar[] = hasUserPermission([
    'new.quest.templ',
    'upd.quest.templ',
  ])
    ? [
        {
          text: 'Duplica',
          color: 'primary',
          buttonClass: 'btn-secondary',
          outline: true,
          onClick: () => {
            setCloneModeState(true);
            setEditModeState(false);
            navigate(`/area-amministrativa/questionari/${idQuestionario}/clona`);
          },
        },
        {
          text: 'Modifica',
          color: 'primary',
          onClick: () => {
            setEditModeState(true);
            setCloneModeState(false);
            navigate(`/area-amministrativa/questionari/${idQuestionario}/modifica`);
          },
        },
      ]
    : hasUserPermission(['new.quest.templ'])
    ? [
        {
          text: 'Duplica',
          color: 'primary',
          outline: true,
          onClick: () => {
            setCloneModeState(true);
            setEditModeState(false);
            navigate(`/area-amministrativa/questionari/${idQuestionario}/clona`);
          },
        },
      ]
    : hasUserPermission(['upd.quest.templ'])
    ? [
        {
          text: 'Modifica',
          color: 'primary',
          onClick: () => {
            setEditModeState(true);
            setCloneModeState(false);
            navigate(`/area-amministrativa/questionari/${idQuestionario}/modifica`);
          },
        },
      ]
    : [];

  return (
    <div className='mb-5'>
      <DetailLayout
        titleInfo={{
          title: form['survey-name']?.value,
          status: '',
          upperTitle: { icon: 'it-file', text: 'Questionario' },
        }}
        buttonsPosition='BOTTOM'
        goBackTitle={
          location.pathname.includes('programmi')
            ? 'Torna indietro'
            : 'Elenco questionari'
        }
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

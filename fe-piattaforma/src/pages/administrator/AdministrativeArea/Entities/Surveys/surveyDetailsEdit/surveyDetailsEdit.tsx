import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import clsx from 'clsx';
import Sticky from 'react-sticky-el';
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
  selectSurveyStatus,
} from '../../../../../../redux/features/administrativeArea/surveys/surveysSlice';
import {
  SetSurveyCreation,
  GetSurveyInfo,
} from '../../../../../../redux/features/administrativeArea/surveys/surveysThunk';
import SurveyTemplate from './components/surveyTemplate';
import ButtonsBar, {
  ButtonInButtonsBar,
} from '../../../../../../components/ButtonsBar/buttonsBar';
import useGuard from '../../../../../../hooks/guard';
import { GetProgramDetail } from '../../../../../../redux/features/administrativeArea/programs/programsThunk';
import { selectPrograms } from '../../../../../../redux/features/administrativeArea/administrativeAreaSlice';
import { entityStatus } from '../../utils';
import {
  closeModal,
  openModal,
} from '../../../../../../redux/features/modal/modalSlice';
import DeleteEntityModal from '../../../../../../components/AdministrativeArea/Entities/General/DeleteEntityModal/DeleteEntityModal';
import { DeleteEntity } from '../../../../../../redux/features/administrativeArea/administrativeAreaThunk';

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
  const surveyStatus = useAppSelector(selectSurveyStatus);
  const [editModeState, setEditModeState] = useState<boolean>(editMode);
  const [cloneModeState, setCloneModeState] = useState<boolean>(cloneMode);
  const { idQuestionario, entityId } = useParams();
  const { hasUserPermission } = useGuard();
  const programName =
    useAppSelector(selectPrograms).detail?.dettagliInfoProgramma?.nomeBreve;

  useEffect(() => {
    if (idQuestionario && !(cloneModeState && form['survey-name']?.value))
      dispatch(GetSurveyInfo(idQuestionario));

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idQuestionario]);

  useEffect(() => {
    // For breadcrumb
    if (!programName && entityId) {
      dispatch(GetProgramDetail(entityId));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // For breadcrumb
    if (entityId && programName) {
      dispatch(
        setInfoIdsBreadcrumb({
          id: entityId,
          nome: programName,
        })
      );
    }
    if (form['survey-name']?.value && idQuestionario) {
      dispatch(
        setInfoIdsBreadcrumb({
          id: idQuestionario,
          nome: form['survey-name'].value,
        })
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idQuestionario, form['survey-name']?.value, programName]);

  const checkValidityQuestions = (questions: SurveyQuestionI[]) => {
    let isValid = true;
    if (questions?.length > 0) {
      questions.map((question: SurveyQuestionI) => {
        !FormHelper.isValidForm(question.form) ? (isValid = false) : '';

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
        !checkValidityPreviousSections(section) ? (sectionsValid = false) : ''
      );
    }
    return isValidForm && sectionsValid;
  };

  const device = useAppSelector(selectDevice);

  const createUpdateSurvey = async () => {
    const res = await dispatch(SetSurveyCreation(cloneModeState));
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    if (res?.data?.['survey-id']) {
      // clona questionario
      setEditModeState(false);
      setCloneModeState(false);
      navigate(
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        `/area-amministrativa/questionari/${res?.data?.['survey-id']}`,
        { replace: true }
      );
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
    } else if (res) {
      // modifica questionario
      navigate(-1);
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
        if (
          location.pathname ===
            `/area-amministrativa/questionari/${idQuestionario}/clona` ||
          location.pathname ===
            `/area-amministrativa/questionari/${idQuestionario}/modifica`
        ) {
          navigate(`/area-amministrativa/questionari/${idQuestionario}`, {
            replace: true,
          });
        } else {
          navigate(-1);
        }
      },
    },
    {
      text: cloneModeState ? 'Crea questionario' : 'Salva Questionario',
      color: 'primary',
      disabled: !checkValidityForm(form),
      onClick: () => createUpdateSurvey(),
    },
  ];

  const deleteButton = {
    outline: true,
    color: 'danger',
    text: 'Elimina',
    disabled: surveyStatus !== entityStatus.NON_ATTIVO,
    onClick: () =>
      dispatch(
        openModal({
          id: 'delete-entity',
          payload: {
            text: 'Confermi di voler eliminare il questionario?',
            entity: 'survey',
          },
        })
      ),
  };

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
            entityId
              ? navigate(location.pathname + '/clona')
              : navigate(
                  `/area-amministrativa/questionari/${idQuestionario}/clona`
                );
          },
        },
        {
          text: 'Modifica',
          color: 'primary',
          onClick: () => {
            setEditModeState(true);
            setCloneModeState(false);
            entityId
              ? navigate(location.pathname + '/modifica')
              : navigate(
                  `/area-amministrativa/questionari/${idQuestionario}/modifica`
                );
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
            entityId
              ? navigate(location.pathname + '/clona')
              : navigate(
                  `/area-amministrativa/questionari/${idQuestionario}/clona`
                );
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
            entityId
              ? navigate(location.pathname + '/modifica')
              : navigate(
                  `/area-amministrativa/questionari/${idQuestionario}/modifica`
                );
          },
        },
      ]
    : [];

  const handleOnSurveyDelete = async () => {
    try {
      if (surveyStatus === entityStatus.NON_ATTIVO && idQuestionario) {
        const res = await dispatch(
          DeleteEntity('questionarioTemplate', idQuestionario)
        );
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        if (res) {
          dispatch(closeModal());
          dispatch(navigate(-1));
        }
      }
    } catch (err) {
      console.log('Survey delete error', err);
    }
  };

  return (
    <div className='mb-5 container'>
      <div className='container'>
        <DetailLayout
          titleInfo={{
            title: form['survey-name']?.value,
            status: '',
            upperTitle: { icon: 'it-file', text: 'Questionario' },
          }}
          buttonsPosition='BOTTOM'
          goBackTitle={entityId ? 'Torna indietro' : 'Elenco questionari'}
          goBackPath='/area-amministrativa/questionari'
        />

        <SurveyTemplate editMode={editModeState} cloneMode={cloneModeState} />

        {!entityId && (
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
                <Sticky
                  mode='bottom'
                  stickyClassName='sticky bg-white container'
                >
                  <ButtonsBar buttons={cancelSaveButtons} />
                </Sticky>
              </div>
            ) : (
              <div aria-hidden='true' className='mt-5 w-100'>
                <Sticky
                  mode='bottom'
                  stickyClassName='sticky bg-white container'
                >
                  <ButtonsBar
                    buttons={
                      surveyStatus === entityStatus.NON_ATTIVO
                        ? [deleteButton, ...cloneEditButtons]
                        : cloneEditButtons
                    }
                  />
                </Sticky>
              </div>
            )}
          </div>
        )}
      </div>
      <DeleteEntityModal
        onClose={() => dispatch(closeModal())}
        onConfirm={handleOnSurveyDelete}
      />
    </div>
  );
};

export default SurveyDetailsEdit;

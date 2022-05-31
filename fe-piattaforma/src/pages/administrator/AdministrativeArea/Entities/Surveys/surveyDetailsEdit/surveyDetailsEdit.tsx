import React, { useEffect, useState } from 'react';
import { Button, Icon } from 'design-react-kit';
import { useDispatch } from 'react-redux';
import clsx from 'clsx';
import { Form, Input } from '../../../../../../components';
import SurveySection from './components/surveySection';
import { useAppSelector } from '../../../../../../redux/hooks';
import { FormHelper, FormI } from '../../../../../../utils/formHelper';
import { useLocation, useNavigate } from 'react-router-dom';
import { selectDevice } from '../../../../../../redux/features/app/appSlice';
import DetailLayout from '../../../../../../components/DetailLayout/detailLayout';
import {
  SurveySectionI,
  selectSurveySections,
  SurveyQuestionI,
  selectSurveyForm,
  setSurveyFormFieldValue,
} from '../../../../../../redux/features/administrativeArea/surveys/surveysSlice';
import {
  SetSurveyCreation,
  GetSurveyInfo,
  SetSurveyQuestion,
} from '../../../../../../redux/features/administrativeArea/surveys/surveysThunk';

interface SurveyDetailsI {
  editMode?: boolean;
  cloneMode?: boolean;
}

const SurveyDetails: React.FC<SurveyDetailsI> = ({
  editMode = false,
  cloneMode = false,
}) => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const form = useAppSelector(selectSurveyForm);
  const sections = useAppSelector(selectSurveySections) || [];
  const [activeSectionId, setActiveSectionId] = useState<string>(''); // sections[sections?.length - 1]?.id || ''
  const [editModeState, setEditModeState] = useState<boolean>(editMode);
  const [cloneModeState, setCloneModeState] = useState<boolean>(cloneMode);
  const [cloneSurveyTitle, setCloneSurveyTitle] = useState(
    form['survey-name'].value + ' clone'
  );

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

  // useEffect(() => {
  //   // if (sections && sections[sections.length - 1].id !== activeSectionId) {
  //   //   setActiveSectionId(sections[sections.length - 1].id || '');
  //   // }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [sections.length]);

  const handleOnInputChange = (
    value: string | number | boolean | Date | undefined,
    field: string | undefined,
    isTitle: boolean
  ) => {
    if (isTitle && typeof value === 'string') {
      setCloneSurveyTitle(value);
    }
    dispatch(
      setSurveyFormFieldValue({
        form: FormHelper.onInputChange(form, value, field),
      })
    );
  };

  // const handleNewSection = () => {
  //   dispatch(SetSurveySection());
  // };

  const handleNewQuestion = (sectionId: string) => {
    dispatch(SetSurveyQuestion({ sectionId: sectionId }));
  };

  const handleOnSubmit = () => {
    dispatch(SetSurveyCreation());
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

  return (
    <div className='mb-5'>
      <DetailLayout
        titleInfo={{
          title: 'Configurazione questionario',
          status: '',
          upperTitle: { icon: 'it-file', text: 'Questionario' },
        }}
        formButtons={[]} // TODO?
        buttonsPosition='TOP'
        goBackTitle='Vai alla Lista questionari'
      />
      <Form className='pt-5'>
        <Form.Row>
          <Input
            {...form['survey-name']}
            value={
              cloneModeState ? cloneSurveyTitle : form['survey-name'].value
            }
            col='col-6'
            label='Nome'
            onInputChange={(value, field) =>
              handleOnInputChange(value, field, true)
            }
            placeholder='Inserici nome questionario'
            disabled={!cloneModeState}
          />
          <Input
            {...form['survey-description']}
            col='col-6'
            label='Descrizione'
            onInputBlur={handleOnInputChange}
            placeholder='Inserici una descrizione del questionario'
            disabled={!editModeState && !cloneModeState}
          />
        </Form.Row>
      </Form>
      {sections.map((section: SurveySectionI, i: number) => (
        <>
          <React.Fragment key={section.id}>
            <SurveySection
              {...section}
              positionSection={i}
              sectionTitle={`${i + 1}. ${section.sectionTitle}`}
              handleActiveSection={(activeSection) =>
                setActiveSectionId(activeSection)
              }
              isSectionActive={section.id === activeSectionId}
              editMode={editModeState}
              cloneMode={cloneModeState}
            />
          </React.Fragment>
          <div
            className={clsx(
              device.mediaIsPhone
                ? 'flex-column d-flex'
                : 'd-flex justify-content-end',
              'w-100'
            )}
          >
            {section.id !== 'anagraphic-citizen-section' &&
              section.id !== 'anagraphic-booking-section' && (
                <Button
                  onClick={() => handleNewQuestion(section?.id || '')}
                  className={clsx(
                    device.mediaIsPhone
                      ? 'd-flex text-nowrap'
                      : 'd-flex justify-content-between ml-3 text-nowrap'
                  )}
                  disabled={
                    !checkValidityQuestions(section.questions || []) ||
                    !(editModeState || cloneModeState)
                  }
                >
                  <Icon
                    color='primary'
                    icon='it-plus-circle'
                    size='sm'
                    className='mr-2'
                    aria-label='Aggiungi domanda'
                  />
                  Aggiungi domanda
                </Button>
              )}
          </div>
          {i !== sections?.length - 1 && <hr />}
        </>
      ))}
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
          <>
            <Button
              className='mr-3 text-nowrap'
              color='secondary'
              onClick={() => {
                setEditModeState(false);
                setCloneModeState(false);
              }}
            >
              Annulla
            </Button>
            <Button
              color='primary'
              onClick={handleOnSubmit}
              disabled={!checkValidityForm(form)}
              className='text-nowrap'
            >
              Salva questionario
            </Button>
          </>
        ) : (
          <>
            <Button
              className='mr-3 text-nowrap'
              color='secondary'
              onClick={() => {
                setCloneModeState(true);
                setEditModeState(false);
                navigate(`/area-amministrativa/questionari/${1}/clona`);
              }}
            >
              Clona questionario
            </Button>
            <Button
              color='primary'
              onClick={() => {
                setEditModeState(true);
                setCloneModeState(false);
                navigate(`/area-amministrativa/questionari/${1}/modifica`);
              }}
              className='text-nowrap'
            >
              Modifica questionario
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default SurveyDetails;

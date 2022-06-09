import { Button, Icon } from 'design-react-kit';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Sticky from 'react-sticky-el';
import { ButtonsBar, Stepper } from '../../../../../../components';
import { ButtonInButtonsBar } from '../../../../../../components/ButtonsBar/buttonsBar';
import withFormHandler, {
  withFormHandlerProps,
} from '../../../../../../hoc/withFormHandler';
import SectionTitle from '../../../../../../components/SectionTitle/sectionTitle';
import {
  selectCompilingSurveyForms,
  setCompilingSurveyForm,
} from '../../../../../../redux/features/administrativeArea/surveys/surveysSlice';
import {
  /* PostFormCompletedByCitizen,*/ SurveyCreationBodyI,
} from '../../../../../../redux/features/administrativeArea/surveys/surveysThunk';
import { useAppSelector } from '../../../../../../redux/hooks';
import { FormHelper, FormI, newForm } from '../../../../../../utils/formHelper';
import { generateForm } from '../../../../../../utils/jsonFormHelper';
import JsonFormRender from '../components/jsonFormRender';
import isEqual from 'lodash.isequal';
import clsx from 'clsx';

interface CompileSurveyI extends withFormHandlerProps {
  publicLink?: boolean;
}

const CompileSurvey: React.FC<CompileSurveyI> = (props) => {
  const {
    publicLink = false,
    onInputChange = () => ({}),
    updateForm = () => ({}),
    form = {},
  } = props;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [sections, setSections] = useState<SurveyCreationBodyI['sections']>();
  const [activeSection, setActiveSection] = useState(0);
  const surveyStore = useAppSelector(selectCompilingSurveyForms);
  const [flag, setFlag] = useState<string>('');

  useEffect(() => {
    if (sections?.length) {
      updateForm(
        {
          ...generateForm(JSON.parse(sections[activeSection].schema), true),
          ...surveyStore[activeSection],
        },
        true
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeSection, sections]);

  const changeRequiredFlag = (form: FormI, flag: string) => {
    const tmpForm = form;
    if (form[flag].value === '') {
      Object.keys(tmpForm).forEach((field) => {
        if (tmpForm[field].dependencyNotFlag === flag)
          tmpForm[field].required = true;
        if (
          tmpForm[field].dependencyFlag !== '' &&
          tmpForm[field].dependencyFlag === flag
        )
          tmpForm[field].required = false;
      });
    } else {
      Object.keys(tmpForm).forEach((field) => {
        if (tmpForm[field].dependencyNotFlag === flag)
          tmpForm[field].required = false;
        if (
          tmpForm[field].dependencyFlag !== '' &&
          tmpForm[field].dependencyFlag === flag
        )
          tmpForm[field].required = true;
      });
    }
    return tmpForm;
  };

  useEffect(() => {
    if (activeSection === 0) {
      setFlag(Object.keys(form)?.filter((f) => f.includes('flag'))[0]);
      if (flag) {
        const newForm = changeRequiredFlag(form, flag);

        if (!isEqual(form, newForm)) {
          updateForm(newForm);
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form]);

  const generateFormCompleted = (surveyStore: FormI[]) => {
    const body = surveyStore.map((section) =>
      FormHelper.getFormValues(section)
    );
    body.forEach(
      (section: {
        [key: string]: string | number | boolean | Date | string[] | undefined | { [key: string]: boolean };
      }) => {
        Object.keys(section).forEach((answerId: string) => {
          if (Array.isArray(section[answerId])) {
            const newAnswer: { [key: string]: boolean } = {};
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore // Keep the ignore here because there's already a check before.
            (section[answerId]).map((val: string) => {
              newAnswer[val] = true;
            });
            section[answerId] = newAnswer;
          }
        });
      }
    );
    console.log('invia questionario', body);
    // dispatch(PostFormCompletedByCitizen({body}));
  };

  const buttonsForBar: ButtonInButtonsBar[] = [
    {
      size: 'xs',
      outline: true,
      color: 'primary',
      className: 'mr-auto',
      text: 'Step precedente',
      onClick: () => {
        setActiveSection(activeSection - 1);
      },
    },
    {
      size: 'xs',
      color: 'primary',
      className: 'mr-4',
      text: 'Step successivo',
      disabled: !FormHelper.isValidForm(form),
      onClick: () => {
        dispatch(setCompilingSurveyForm({ id: activeSection, form }));
        setActiveSection(activeSection + 1);
      },
    },
    {
      size: 'xs',
      color: 'primary',
      className: 'mr-4',
      text: 'Invia Questionario',
      disabled: !FormHelper.isValidForm(form),
      onClick: () => {
        generateFormCompleted(surveyStore);
      },
    },
  ];

  const buttonsToRender = (stepNumber: number) => {
    if (stepNumber <= 0) {
      return buttonsForBar.slice(1, -1);
    } else if (stepNumber > 0 && stepNumber < 3) {
      return buttonsForBar.slice(0, -1);
    }
    const newButtonsForBar = [];
    newButtonsForBar.push(buttonsForBar[0]);
    newButtonsForBar.push(buttonsForBar[2]);
    return newButtonsForBar;
  };

  const loadMock = async () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const response = await import('/mock/responseQuestionario.json');
    if (response) {
      setSections(response.sections);
    }
  };

  useEffect(() => {
    loadMock();
  }, []);

  if (!sections?.length) return null;

  const getTitle = (currentStep: number) => {
    switch (currentStep) {
      case 0:
        return 'Compila i dati anagrafici e procedi con il questionario';
      case 1:
        return 'Compila i dati della prenotazione e procedi con il questionario';
      case 2:
        return 'Compila i dati del servizio e procedi con il questionario';
      case 3:
        return 'Compila i dati dei contenuti del servizio e invia con il questionario';
      default:
        break;
    }
  };

  return (
    <div>
      {!publicLink && (
        <>
          <Button onClick={() => navigate(-1)} className='px-0'>
            <Icon
              icon='it-chevron-left'
              color='primary'
              aria-label='Torna indietro'
            />
            <span className='primary-color'> Torna Indietro </span>
          </Button>
          <SectionTitle
            title='Compilazione Questionario'
            upperTitle={{ icon: 'it-file', text: 'QUESTIONARIO' }}
          />
          <div className='my-5 d-flex justify-content-center'>
            <Stepper nSteps={4} currentStep={activeSection + 1} />
          </div>
          <p className='h5 primary-color lightgrey-bg-c2 mb-4 p-3 font-weight-bold'>
            {sections[activeSection].title}
          </p>
        </>
      )}
      <div className='pt-3'>
        {publicLink && (
          <>
            <h1 className='h4 text-primary'>{getTitle(activeSection)}</h1>
            {activeSection === 0 && (
              <p className='mt-4'>
                Per completare l’anagrafica abbiamo bisogno di alcuni tuoi dati.
              </p>
            )}
            <p className={clsx('mb-4', activeSection !== 0 && 'mt-4')}>
              {' '}
              Completa i campi obbligatori per procedere.
            </p>
          </>
        )}
        <div className='pt-3'>
          <JsonFormRender
            form={form}
            onInputChange={onInputChange}
            currentStep={activeSection}
          />
        </div>
        <Sticky mode='bottom'>
          <ButtonsBar buttons={buttonsToRender(activeSection)} />
        </Sticky>
      </div>
    </div>
  );
};

const form = newForm();

export default withFormHandler({ form }, CompileSurvey);

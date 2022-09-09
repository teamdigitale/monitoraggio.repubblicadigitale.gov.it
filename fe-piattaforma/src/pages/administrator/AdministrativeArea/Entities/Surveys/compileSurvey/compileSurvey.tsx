import { Button, Icon } from 'design-react-kit';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import Sticky from 'react-sticky-el';
import { ButtonsBar, ProgressBar, Stepper } from '../../../../../../components';
import { ButtonInButtonsBar } from '../../../../../../components/ButtonsBar/buttonsBar';
import withFormHandler, {
  withFormHandlerProps,
} from '../../../../../../hoc/withFormHandler';
import SectionTitle from '../../../../../../components/SectionTitle/sectionTitle';
import {
  selectCompilingSurveyForms,
  setCompilingSurveyForm,
  SurveySectionPayloadI,
} from '../../../../../../redux/features/administrativeArea/surveys/surveysSlice';
import { useAppSelector } from '../../../../../../redux/hooks';
import { FormHelper, FormI, newForm } from '../../../../../../utils/formHelper';
import { generateForm } from '../../../../../../utils/jsonFormHelper';
import JsonFormRender from '../components/jsonFormRender';
import isEqual from 'lodash.isequal';
import clsx from 'clsx';
import {
  selectDevice,
  setInfoIdsBreadcrumb,
} from '../../../../../../redux/features/app/appSlice';
import {
  selectQuestionarioTemplateSnapshot,
  selectServiceQuestionarioTemplateIstanze,
  selectServices,
} from '../../../../../../redux/features/administrativeArea/administrativeAreaSlice';
import {
  GetCompiledSurveyCitizenService,
  GetServicesDetail,
} from '../../../../../../redux/features/administrativeArea/services/servicesThunk';
import { formatAndParseJsonString } from '../../../../../../utils/common';
import { PostFormCompletedByCitizen } from '../../../../../../redux/features/administrativeArea/surveys/surveysThunk';
import { OptionType } from '../../../../../../components/Form/select';

const CompileSurvey: React.FC<withFormHandlerProps> = (props) => {
  const {
    onInputChange = () => ({}),
    updateForm = () => ({}),
    form = {},
  } = props;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { serviceId, idQuestionarioCompilato } = useParams();
  const [sections, setSections] = useState<SurveySectionPayloadI[]>([]);
  const [activeSection, setActiveSection] = useState(0);
  const surveyStore: string | SurveySectionPayloadI[] = useAppSelector(
    selectQuestionarioTemplateSnapshot
  )?.sezioniQuestionarioTemplate;
  const compiledSurveyCitizen = useAppSelector(
    selectServiceQuestionarioTemplateIstanze
  );
  const [flag, setFlag] = useState<string>('');
  const surveyAnswersToSave = useAppSelector(selectCompilingSurveyForms);
  const serviceDetails = useAppSelector(selectServices)?.detail;

  useEffect(() => {
    // For breadcrumb
    if (serviceId && serviceDetails?.dettaglioServizio?.nomeServizio) {
      dispatch(
        setInfoIdsBreadcrumb({
          id: serviceId,
          nome: serviceDetails?.dettaglioServizio?.nomeServizio,
        })
      );
    }
  }, [serviceId, serviceDetails]);

  useEffect(() => {
    if (surveyStore?.length && typeof surveyStore !== 'string')
      setSections(surveyStore); // le sezioni sono del questionario associato al servizio
  }, [surveyStore]);

  useEffect(() => {
    // se refresh get service detail per recuperare surveyStore
    dispatch(GetServicesDetail(serviceId));
  }, []);

  const getValuesSurvey = (section: {
    id: string;
    properties: string[] | { [key: string]: string[] }[];
    title: string;
  }) => {
    let values = {};
    const valuesInArray = section?.properties || section;
    (valuesInArray || []).map((value: string | { [key: string]: string[] }) => {
      if (typeof value === 'object') {
        Object.keys(value).map((id: string) => {
          values = {
            ...values,
            ...{
              [id]:
                value[id]?.length > 1 || id === '25' || id === '26'
                  ? value[id]
                  : value[id][0],
            },
          };
        });
      } else if (typeof value === 'string') {
        const val = JSON.parse(decodeURI(value).replaceAll("'", '"'));
        Object.keys(val).map((id: string) => {
          values = {
            ...values,
            ...{
              [id]:
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                value[id]?.length > 1 || id === '25' || id === '26'
                  ? val[id]
                  : val[id][0],
            },
          };
        });
      }
    });
    return values;
  };

  useEffect(() => {
    if (idQuestionarioCompilato)
      dispatch(GetCompiledSurveyCitizenService(idQuestionarioCompilato));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idQuestionarioCompilato]);

  useEffect(() => {
    if (surveyAnswersToSave?.length > 0 && surveyAnswersToSave[activeSection]) {
      // upload answers when step back
      updateForm(
        {
          ...surveyAnswersToSave[activeSection],
        },
        true
      );
    } else {
      // create form and prefill the sections
      if (sections?.length) {
        const newForm = generateForm(
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          JSON.parse(sections[activeSection].schema?.json),
          true
        );

        if (
          activeSection < 3 &&
          compiledSurveyCitizen?.length &&
          compiledSurveyCitizen?.[activeSection]?.domandaRisposta?.json
        ) {
          const sectionParsed: {
            id: string;
            properties: string[];
            title: string;
          } = formatAndParseJsonString(
            compiledSurveyCitizen?.[activeSection]?.domandaRisposta?.json
          );
          const values: { [key: string]: string } =
            getValuesSurvey(sectionParsed);
          Object.keys(newForm).map((key: string) => {
            key === '20'
              ? (newForm[key].value = ['SI', 'Si', 'si'].includes(values[key])
                  ? 'Sì'
                  : 'No')
              : (newForm[key].value = values[key]);
            if (activeSection === 1 || activeSection === 2) {
              newForm[key].disabled = true;
            }
            if (key === '18') {
              if (!newForm[key].value || newForm[key].value === '$consenso')
                newForm[key].value = '';
              const options: OptionType[] = [];
              newForm[key].options?.map((opt: OptionType) => {
                options?.push({
                  label: opt.label,
                  value: opt.value.toString().toUpperCase(),
                });
              });
              newForm[key].value === ''
                ? (newForm[key].options = options?.filter(
                    (opt: OptionType) => opt.value !== 'ONLINE'
                  ))
                : newForm[key].value === 'ONLINE'
                ? (newForm[key].options = options?.filter(
                    (opt: OptionType) => opt.value === 'ONLINE'
                  ))
                : options;
              newForm[key].disabled = newForm[key].value === '' ? false : true;
            }
            if (key === '19') delete newForm[key];
          });
        }
        updateForm(
          {
            ...newForm,
          },
          true
        );
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeSection, sections, compiledSurveyCitizen]);

  const device = useAppSelector(selectDevice);

  const progressSteps = () => {
    const allSteps: string[] = [];
    sections?.map((section) => {
      if (section?.titolo) allSteps.push(section.titolo);
    });
    return allSteps;
  };

  const changeRequiredFlag = (form: FormI, flag: string) => {
    const tmpForm = form;
    if (form[flag]?.value === '') {
      Object.keys(tmpForm).forEach((field) => {
        if (tmpForm[field]?.dependencyNotFlag === flag)
          tmpForm[field].required = true;
        if (
          tmpForm[field]?.dependencyFlag !== '' &&
          tmpForm[field]?.dependencyFlag === flag
        )
          tmpForm[field].required = false;
      });
    } else {
      Object.keys(tmpForm).forEach((field) => {
        if (tmpForm[field]?.dependencyNotFlag === flag)
          tmpForm[field].required = false;
        if (
          tmpForm[field]?.dependencyFlag !== '' &&
          tmpForm[field]?.dependencyFlag === flag
        )
          tmpForm[field].required = true;
      });
    }
    return tmpForm;
  };

  useEffect(() => {
    if (activeSection === 0) {
      setFlag(Object.keys(form)?.filter((f) => f.includes('flag'))[0]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form]);

  useEffect(() => {
    if (flag) {
      const newForm = changeRequiredFlag(form, flag);
      if (!isEqual(form, newForm)) {
        updateForm(newForm);
      }
    }
  }, [flag, form]);

  const generateFormCompleted = async (surveyStore: FormI[]) => {
    const body = surveyStore.map((section) =>
      FormHelper.getFormValues(section)
    );
    await dispatch(PostFormCompletedByCitizen(idQuestionarioCompilato, body));
    navigate(`/area-amministrativa/servizi/${serviceId}/cittadini`);
  };

  const buttonsForBar: ButtonInButtonsBar[] = [
    {
      size: 'xs',
      outline: true,
      color: 'primary',
      className: 'mr-auto',
      buttonClass: 'btn-secondary',
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
        generateFormCompleted(surveyAnswersToSave);
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

  const mobileButtons = () => {
    return (
      <div className='bg-white'>
        <div className='d-flex justify-content-between align-items-center'>
          <div
            className={clsx(
              'd-flex',
              'flex-row',
              'justify-content-start',
              'align-items-center'
            )}
          >
            <Icon
              icon='it-chevron-left'
              color='primary'
              aria-label='Icona step precedente'
            />
            <Button
              onClick={() => {
                setActiveSection(activeSection - 1);
              }}
              size='xs'
              disabled={activeSection === 0}
              className='pl-0 pr-5'
              aria-label='Step Precedente'
            >
              <span className='mr-2'> Precedente </span>
            </Button>
          </div>
          <div
            className={clsx(
              'd-flex',
              'flex-row',
              'justify-content-around',
              'align-items-center'
            )}
          >
            <Button
              onClick={() => {
                setActiveSection(activeSection + 1);
              }}
              size='xs'
              disabled={activeSection === 3}
              className='mb-1'
              aria-label='Step successivo'
            >
              <span className='primary-color'> Successivo </span>
            </Button>
            <Icon
              icon='it-chevron-right'
              color='primary'
              className='ml-2'
              aria-label='Icona step Successivo'
            />
          </div>
        </div>
        <div className='d-flex justify-content-around'>
          <Button
            size='xs'
            color='primary'
            className='mx-3 mt-2 mb-3'
            onClick={() => {
              generateFormCompleted(surveyAnswersToSave);
            }}
            disabled={!FormHelper.isValidForm(form)}
            aria-label='Invio Questionario'
          >
            Invia Questionario
          </Button>
        </div>
      </div>
    );
  };

  if (!sections?.length) return null;

  return (
    <div className='container'>
      <Button
        onClick={() => navigate(-1)}
        className={clsx(device.mediaIsPhone && 'mb-5', 'px-0')}
      >
        <Icon
          icon='it-chevron-left'
          color='primary'
          aria-label='Torna indietro'
        />
        <span className='primary-color'> Vai alla lista cittadini </span>
      </Button>
      <SectionTitle
        title='Compilazione Questionario'
        upperTitle={{ icon: 'it-file', text: 'QUESTIONARIO' }}
      />
      <div
        className={clsx(
          device.mediaIsPhone ? 'mb-0 mt-5' : 'my-5',
          'd-flex',
          'justify-content-center'
        )}
      >
        {device.mediaIsPhone ? (
          <ProgressBar
            currentStep={activeSection + 1}
            steps={progressSteps()}
          />
        ) : (
          <Stepper nSteps={4} currentStep={activeSection} />
        )}
      </div>
      {device.mediaIsPhone ? null : (
        <p
          className={clsx(
            'h5',
            'primary-color',
            'lightgrey-bg-c2',
            'mb-4',
            'p-3',
            'font-weight-bold'
          )}
        >
          {sections[activeSection].titolo}
        </p>
      )}
      <div className='pt-3'>
        <div className={clsx(device.mediaIsPhone && 'pt-0', 'pt-3')}>
          <JsonFormRender
            form={form}
            onInputChange={onInputChange}
            currentStep={activeSection}
          />
        </div>
      </div>
      <Sticky mode='bottom' stickyClassName='sticky bg-white'>
        {device.mediaIsPhone ? (
          <div className='container'>{mobileButtons()}</div>
        ) : (
          <div className='container'>
            <ButtonsBar buttons={buttonsToRender(activeSection)} />
          </div>
        )}
      </Sticky>
    </div>
  );
};

const form = newForm();

export default withFormHandler({ form }, CompileSurvey);

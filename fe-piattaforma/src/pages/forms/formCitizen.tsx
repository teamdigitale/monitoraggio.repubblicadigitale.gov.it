import clsx from 'clsx';
import isEqual from 'lodash.isequal';
import React, { useEffect, useState } from 'react';
import { Form, Input, Select, SelectMultiple } from '../../components';
import CheckboxGroup from '../../components/Form/checkboxGroup';
import withFormHandler, {
  withFormHandlerProps,
} from '../../hoc/withFormHandler';
import { SurveySectionI } from '../../redux/features/administrativeArea/surveys/surveysSlice';
import { selectDevice } from '../../redux/features/app/appSlice';
import { useAppSelector } from '../../redux/hooks';
import { formFieldI, FormHelper, FormI, newForm } from '../../utils/formHelper';
import { generateForm } from '../../utils/jsonFormHelper';

interface FormCitizenI {
  formDisabled?: boolean;
  sendNewValues?: (param?: { [key: string]: formFieldI['value'] }) => void;
  isFormValid?: (param: boolean) => void;
  creation?: boolean;
  info?: any;
}

interface FormEnteGestoreProgettoFullInterface
  extends withFormHandlerProps,
    FormCitizenI {}

const form = newForm([]);

const FormCitizen: React.FC<FormEnteGestoreProgettoFullInterface> = (props) => {
  const {
    // setFormValues = () => ({}),
    form,
    onInputChange = () => ({}),
    sendNewValues,
    // isValidForm,
    isFormValid = () => ({}),
    getFormValues,
    updateForm = () => ({}),
    creation = false,
    // info,
  } = props;

  const device = useAppSelector(selectDevice);
  const formDisabled = !!props.formDisabled;
  const [flag, setFlag] = useState<string>('');

  const loadMock = async () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const response = await import('/mock/responseQuestionario.json');
    if (response.default) {
      const schema = response.default.sections.filter(
        (section: SurveySectionI) => section.id === 'anagraphic-citizen-section'
      )[0]?.schema;
      const formFromSchema = generateForm(JSON.parse(schema));
      Object.keys(formFromSchema).forEach((key: string) => {
        formFromSchema[key].label = formFromSchema[key].value?.toString() || '';
        formFromSchema[key].value = '';
      });
      if (creation) {
        const privacyFields = Object.keys(formFromSchema)?.filter(
          (f) => formFromSchema[f].privacy === true
        );
        (privacyFields || []).map(
          (field) => (formFromSchema[field].required = false)
        );
      }
      updateForm({ ...formFromSchema }, true);
    }
  };

  useEffect(() => {
    loadMock();
  }, []);

  useEffect(() => {
    if (form && Object.keys(form).length > 0 && FormHelper.isValidForm(form)) {
      if (isFormValid) {
        isFormValid(true);
        sendNewValues?.(getFormValues?.());
      }
    }
  }, [form]);

  const updateFormToOrder = () => {
    if (form) {
      return Object.keys(form).sort(
        (a, b) => Number(form[a].order) - Number(form[b].order)
      );
    }
  };

  const orderQuestions = updateFormToOrder();

  const changeRequiredFlag = (form: FormI, flag: string) => {
    const tmpForm = form;
    if (form[flag].value === '') {
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
    if (form) {
      setFlag(Object.keys(form)?.filter((f) => f.includes('flag'))[0]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form]);

  useEffect(() => {
    if (flag && form) {
      const newForm = changeRequiredFlag(form, flag);
      if (!isEqual(form, newForm)) {
        updateForm(newForm);
      }
    }
  }, [flag, form]);

  const isMobile = device.mediaIsPhone;

  const getAnswerType = (field: formFieldI) => {
    if (creation && field?.privacy) {
      return null;
    }
    switch (field.type) {
      case 'date':
      case 'number':
      case 'time':
      case 'text': {
        return (
          <Input
            {...field}
            id={`input-${field.field}`}
            label={field.label}
            type={field.type}
            required={field.required || false}
            wrapperClassName={clsx(
              field.label && field.label?.length > 30
                ? 'd-inline-block w-100'
                : 'd-inline-block  mr-2',
              isMobile ? 'w-100' : 'compile-survey-container__half-width'
            )}
            onInputChange={onInputChange}
            placeholder={`Inserisci ${field.label?.toLowerCase()}`}
          />
        );
      }
      case 'select': {
        return (
          <Select
            id={`input-${field.field}`}
            label={field.label || ''}
            field={field.field}
            col='col-12 col-lg-6'
            required={field.required || false}
            onInputChange={onInputChange}
            placeholder={`Inserisci ${field.label?.toLowerCase()}`}
            wrapperClassName={clsx(
              'd-inline-block',
              'compile-survey-container__select-margin',
              'mr-2',
              isMobile ? 'w-100' : 'compile-survey-container__half-width'
            )}
            options={field.options}
            isDisabled={formDisabled}
            value={field.value}
          />
        );
      }
      case 'checkbox': {
        if (field.format === 'multiple-select' && field.relatedFrom !== '') {
          return null;
        }
        if (field.format === 'multiple-select' && field.relatedTo !== '') {
          const multiSelectOptions: {
            label: string;
            options: { label: string; value: string; upperLevel: string }[];
          }[] = [];
          if (field.enumLevel1) {
            (field.enumLevel1 || []).forEach((opt) => {
              multiSelectOptions.push({
                label: opt,
                options: [],
              });
            });
          }
          if (
            form &&
            field?.relatedTo &&
            form[field.relatedTo].enumLevel2 &&
            multiSelectOptions?.length > 0
          ) {
            (form[field.relatedTo].enumLevel2 || []).forEach(
              ({ label, value, upperLevel }) => {
                const index = multiSelectOptions.findIndex(
                  (v) => v.label === upperLevel
                );
                multiSelectOptions[index].options.push({
                  label: label,
                  value: value,
                  upperLevel: upperLevel,
                });
              }
            );
          }
          return (
            <SelectMultiple
              field={field.field}
              secondLevelField={field.relatedTo}
              id={`multiple-select-${field.id}`}
              label={`${field?.label}`}
              aria-label={`${field?.label}`}
              options={multiSelectOptions}
              required={field.required || false}
              onInputChange={onInputChange}
              onSecondLevelInputChange={onInputChange}
              placeholder='Seleziona'
              wrapperClassName={clsx(
                device.mediaIsPhone || device.mediaIsTablet
                  ? 'd-flex w-100 flex-column mt-1 py-2'
                  : 'd-inline-block',
                'compile-survey-container__half-width',
                'compile-survey-container__select-margin',
                'mr-3',
                'mb-3'
              )}
            />
          );
        }
        if (field.options?.length) {
          return (
            <CheckboxGroup
              {...field}
              className={clsx(
                'd-inline-block',
                'compile-survey-container__half-width',
                'compile-survey-container__select-margin',
                'mr-3',
                'mb-3'
              )}
              onInputChange={onInputChange}
              label={`${field?.label}`}
              styleLabelForm
              noLabel={field.flag === true ? true : false}
            />
          );
        }
        return (
          <Input
            {...field}
            className={clsx(
              'd-inline-block',
              'compile-survey-container__half-width',
              'mr-3',
              'mb-3'
            )}
            onInputChange={onInputChange}
            label={`${field?.label}`}
            required={field.required || false}
          />
        );
      }
      default:
        return '';
    }
  };

  return (
    <Form className='mt-5' formDisabled={formDisabled}>
      <div>
        {form &&
          (orderQuestions || []).map((key) => <>{getAnswerType(form[key])}</>)}
      </div>
    </Form>
  );
};

export default withFormHandler({ form }, FormCitizen);

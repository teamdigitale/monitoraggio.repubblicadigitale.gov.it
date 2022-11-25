import clsx from 'clsx';
import React, { useEffect, useState } from 'react';
import { Form, Input, PrefixPhone, Select } from '../../../components';
import CheckboxGroup from '../../../components/Form/checkboxGroup';
import { OptionType } from '../../../components/Form/select';
import withFormHandler, {
  withFormHandlerProps,
} from '../../../hoc/withFormHandler';
import { selectQuestionarioTemplateSnapshot } from '../../../redux/features/administrativeArea/administrativeAreaSlice';
import { selectEntityDetail } from '../../../redux/features/citizensArea/citizensAreaSlice';
// import { selectDevice } from '../../redux/features/app/appSlice';
import { useAppSelector } from '../../../redux/hooks';
import { formatDate } from '../../../utils/datesHelper';
import {
  formFieldI,
  FormHelper,
  FormI,
  newForm,
} from '../../../utils/formHelper';
import { generateForm } from '../../../utils/jsonFormHelper';
import { RegexpType } from '../../../utils/validator';
import { FormCitizenI } from '../formCitizen';

interface FormEnteGestoreProgettoFullInterface
  extends withFormHandlerProps,
    FormCitizenI {}

const FormServiceCitizenFull: React.FC<FormEnteGestoreProgettoFullInterface> = (
  props
) => {
  const {
    setFormValues = () => ({}),
    form,
    onInputChange = () => ({}),
    sendNewValues = () => ({}),
    // isValidForm,
    setIsFormValid = () => ({}),
    getFormValues,
    updateForm = () => ({}),
    creation = false,
    legend = '',
  } = props;

  // const device = useAppSelector(selectDevice);
  const formDisabled = !!props.formDisabled;
  const formData: {
    [key: string]: formFieldI['value'] | undefined;
  } = useAppSelector(selectEntityDetail)?.dettaglioCittadino;
  const [dynamicForm, setDynamicForm] = useState<FormI>({});
  const surveyTemplateQ1: any = useAppSelector(
    selectQuestionarioTemplateSnapshot
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
  )?.sezioniQuestionarioTemplate?.[0];

  useEffect(() => {
    if (surveyTemplateQ1) {
      const formFromSchema = generateForm(
        JSON.parse(surveyTemplateQ1.schema.json)
      );
      // delete formFromSchema['19']; // data consenso non parte dell'anagrafica
      Object.keys(formFromSchema).forEach((key: string) => {
        formFromSchema[key].label = formFromSchema[key].value?.toString() || '';
        formFromSchema[key].value = '';
        if (key === '1' || key === '2') {
          formFromSchema[key].regex = RegexpType.NAME_SURNAME;
        }
        if (key === '3') {
          formFromSchema[key].regex = RegexpType.FISCAL_CODE;
        }
        if (key === '4' || key === '5' || key === '6') {
          formFromSchema[key].required = false;
        }
        if (key === '8') {
          formFromSchema[key].minimum = 1920;
          formFromSchema[key].maximum = 2020;
        }
        if (key === '14') {
          formFromSchema[key].regex = RegexpType.EMAIL;
        }
        if (key === '15') {
          formFromSchema[key].value = '+39';
        }
        if (key === '16') {
          formFromSchema[key].regex = RegexpType.MOBILE_PHONE;
        }
        if (key === '17') {
          formFromSchema[key].regex = RegexpType.TELEPHONE;
        }
        if (key === '18') {
          if (creation) {
            formFromSchema[key].options = [
              { label: "Gestita dall'ente", value: '$consenso' },
            ];
          } else {
            formFromSchema[key].options = formFromSchema[key]?.options?.map(
              (opt: OptionType) => ({
                label: opt.label,
                value: opt.value.toString().toUpperCase(),
              })
            );
            formFromSchema[key].keyBE = 'tipoConferimentoConsenso';
          }
        }
        if (key === '19') {
          formFromSchema[key].keyBE = 'dataConferimentoConsenso';
        }
      });
      setDynamicForm(formFromSchema);
    }
  }, [surveyTemplateQ1 && Object.keys(surveyTemplateQ1)?.length]);

  useEffect(() => {
    if (dynamicForm) updateForm(dynamicForm);
  }, [dynamicForm]);

  useEffect(() => {
    if (!creation && formData && form && Object.keys(form)?.length) {
      const newValues: { [key: string]: formFieldI['value'] } = {};
      Object.keys(form).map((key: string) => {
        const keyBE = form[key]?.keyBE;
        if (keyBE) newValues[key] = formData[keyBE];
        if (key === '18' && (!newValues[key] || newValues[key] === '')) {
          newValues[key] = '$consenso';
        }
      });
      if (formData?.codiceFiscale === '') {
        newValues['4'] = 'Codice fiscale non disponibile';
        handleCheckboxChange('Codice fiscale non disponibile', '4');
      }
      setFormValues(newValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData]);

  const handleCheckboxChange = (
    value?: formFieldI['value'],
    field?: formFieldI['field']
  ) => {
    const tmpForm = FormHelper.onInputChange(form, value, field);
    const referenceBoolean = !tmpForm[4]?.value;
    tmpForm[3].required = referenceBoolean;
    tmpForm[3].disabled = !referenceBoolean;
    if (referenceBoolean === false) {
      tmpForm[3].valid = true;
      tmpForm[3].value = '';
    }
    tmpForm[5].required = !referenceBoolean;
    tmpForm[6].required = !referenceBoolean;
    updateForm(tmpForm);
  };

  const onInputDataChange = (
    value: formFieldI['value'],
    field?: formFieldI['field']
  ) => {
    onInputChange(value, field);
    setIsFormValid(FormHelper.isValidForm(form));
  };

  useEffect(() => {
    sendNewValues(getFormValues?.());
    setIsFormValid(FormHelper.isValidForm(form));
  }, [form]);

  useEffect(() => {
    // form[3] = codiceFiscale, form[8] = annoNascita
    if (
      creation &&
      form &&
      form[3]?.value &&
      form[3]?.valid &&
      form[3]?.value?.toString().length === 16 &&
      !form[8]?.value
    ) {
      onInputDataChange(
        `19${form[3]?.value?.toString().slice(6, 8)}`,
        form[8]?.field
      );
    }
  }, [form, creation]);

  const renderPrefix = (field: formFieldI) => {
    if (field?.keyBE === 'prefisso') {
      return <PrefixPhone {...field} onInputChange={onInputDataChange} />;
    }
    return;
  };

  const getAnswerType = (field: formFieldI): any => {
    switch (field.type) {
      case 'date':
      case 'time':
      case 'number':
      case 'text': {
        if (field?.keyBE === 'prefisso') {
          return renderPrefix(field);
        }
        if (field.keyBE === 'dataConferimentoConsenso') {
          if (field.value)
            return (
              <Input
                {...field}
                col='col-12 col-lg-6'
                disabled
                value={
                  formatDate(
                    Number(formData?.dataConferimentoConsenso),
                    'snakeDate'
                  ) || ''
                }
              />
            );
          else return null;
        }

        return (
          <Input
            {...field}
            id={`input-${field.field}`}
            col={
              field.keyBE === 'numeroCellulare'
                ? 'col-8 col-lg-4'
                : field.label && field.label?.length > 30
                ? 'col-12'
                : 'col-12 col-lg-6'
            }
            label={field.label}
            type={field.type}
            required={field.required || false}
            onInputChange={onInputDataChange}
            placeholder={`${field.label}`}
          />
        );
      }
      case 'select': {
        return (
          <Select
            {...field}
            id={`input-${field}`}
            field={field.field}
            label={field.label || ''}
            col={field.field === '9' ? 'col-12' : 'col-12 col-lg-6'}
            required={field.required || false}
            onInputChange={onInputDataChange}
            placeholder={`Seleziona ${field.label?.toLowerCase()}`}
            options={field.options}
            isDisabled={formDisabled}
            value={field.value}
            wrapperClassName='mb-5 pr-lg-3'
          />
        );
      }
      case 'checkbox': {
        // checkbox if options
        if (field.options && field.options?.length) {
          return (
            <CheckboxGroup
              {...field}
              id={`input-${field}`}
              field={field.field}
              className={clsx(
                field.field !== '18' && 'col-12 col-lg-6',
                field.field === '18' &&
                  'compile-survey-container__checkbox-margin'
              )}
              label={
                field.field === '18'
                  ? 'Presa visione dell’informativa privacy'
                  : ''
              }
              noLabel={field.field === '4'}
              options={
                field.field === '18' && field.value === '$consenso'
                  ? [{ label: "Gestita dall'ente", value: '$consenso' }]
                  : field.options
              }
              onInputChange={handleCheckboxChange}
              styleLabelForm
              classNameLabelOption='pl-5'
              disabled={!creation && field.field === '18'}
            />
          );
        }
        return (
          <Input
            {...field}
            className={clsx('mr-3', 'mb-3')}
            col='col-12 col-lg-6'
            onInputBlur={onInputChange}
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
    <Form
      legend={legend}
      id='form-citizen'
      className='mt-3 pt-3'
      formDisabled={formDisabled}
      marginShowMandatory={false}
      customMargin='ml-2'
    >
      <div className='d-inline-flex flex-wrap w-100'>
        {form &&
          Object.keys(form).map((key) => (
            <React.Fragment key={key}>
              {getAnswerType(form[key])}
            </React.Fragment>
          ))}
      </div>
    </Form>
  );
};

const form = newForm([]);

export default withFormHandler({ form }, FormServiceCitizenFull);

/*
// OLD MULTIPLE SELECT - DELETE
// multiple select if enumLevel1 & enumLevel2
        if (
          form &&
          field.format === 'multiple-select' &&
          field.enumLevel1?.length &&
          field.enumLevel2?.length
        ) {
          let relatedTo = '';
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
          Object.keys(form).forEach((key: string) => {
            if (form[key].field === field.relatedTo)
              relatedTo = form[key].field || '';
          });
          if (
            form &&
            field?.relatedTo &&
            form[relatedTo]?.enumLevel2 &&
            multiSelectOptions?.length
          ) {
            (form[relatedTo]?.enumLevel2 || []).forEach(
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
          // mappa valori
          const valuesSecondLevel = form[relatedTo]?.value;
          const values: OptionTypeMulti[] = [];
          Array.isArray(valuesSecondLevel) &&
            (valuesSecondLevel || []).map((val: string) => {
              let upperLevel = '';
              Object.keys(multiSelectOptions).forEach((key: any) => {
                if (
                  multiSelectOptions[key].options.filter((x) => x.label === val)
                    ?.length
                ) {
                  upperLevel = multiSelectOptions[key].label;
                }
              });
              values.push({
                label: val,
                value: val,
                upperLevel: upperLevel,
              });
            });
          return (
            <SelectMultiple
              {...field}
              field={field.field}
              secondLevelField={relatedTo}
              id={`multiple-select-${field.id}`}
              col='col-12'
              label={`${field?.label}`}
              aria-label={`${field?.label}`}
              options={multiSelectOptions}
              required={field.required || false}
              onInputChange={(value: formFieldI['value'], field) => {
                const values: string[] = [];
                if (Array.isArray(value))
                  value.map((val: string) => values.push(val));
                onInputDataChange(value, field);
              }}
              //   onSecondLevelInputChange --> non serve
              placeholder='Seleziona'
              isDisabled={formDisabled}
              value={values}
              wrapperClassName='mb-5 pr-lg-3'
            />
          );
        }
 
 */

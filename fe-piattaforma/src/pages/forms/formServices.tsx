import clsx from 'clsx';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Form, Input, Select, SelectMultiple } from '../../components';
import CheckboxGroup from '../../components/Form/checkboxGroup';
import { OptionTypeMulti } from '../../components/Form/selectMultiple';
// import { serviceScopeOptions } from '../../components/Form/multipleSelectConstants';
import withFormHandler, {
  withFormHandlerProps,
} from '../../hoc/withFormHandler';
import { selectServices } from '../../redux/features/administrativeArea/administrativeAreaSlice';
import { GetServicesDetail } from '../../redux/features/administrativeArea/services/servicesThunk';
import { SurveySectionI } from '../../redux/features/administrativeArea/surveys/surveysSlice';
import { selectDevice } from '../../redux/features/app/appSlice';
import { useAppSelector } from '../../redux/hooks';
import {
  formFieldI,
  FormHelper,
  newForm,
  newFormField,
} from '../../utils/formHelper';
import { generateForm } from '../../utils/jsonFormHelper';
import { RegexpType } from '../../utils/validator';

interface FormServicesI {
  formDisabled?: boolean;
  sendNewValues?: (param?: { [key: string]: formFieldI['value'] }) => void;
  setIsFormValid?: (param: boolean | undefined) => void;
  creation?: boolean;
}

interface FormEnteGestoreProgettoFullInterface
  extends withFormHandlerProps,
    FormServicesI {}

const form = newForm([
  newFormField({
    field: 'nome',
    label: 'Nome',
    required: true,
    order: 1,
  }),
  newFormField({
    field: 'ente',
    label: 'Ente',
    required: true,
    order: 2,
  }),
  newFormField({
    field: 'sede',
    label: 'Sede',
    required: true,
    order: 3,
  }),
  newFormField({
    field: 'durataServizio',
    label: 'Durata servizio',
    type: 'time',
    regex: RegexpType.TIME,
    required: true,
    order: 4,
  }),
]);

const Services: React.FC<FormEnteGestoreProgettoFullInterface> = (props) => {
  const {
    setFormValues = () => ({}),
    form,
    onInputChange,
    sendNewValues,
    // isValidForm,
    setIsFormValid,
    getFormValues,
    creation = false,
    updateForm = () => ({}),
  } = props;
  const [loadingCompleted, setLoadingCompleted] = useState<boolean>(false);

  const device = useAppSelector(selectDevice);
  const formDisabled = !!props.formDisabled;
  const formData = useAppSelector(selectServices)?.detail?.info;
  const dispatch = useDispatch();

  const loadMock = async () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const response = await import('/mock/responseQuestionario.json');
    if (response.default) {
      const schema = response.default.sections.filter(
        (section: SurveySectionI) => section.id === 'anagraphic-service-section'
      )[0]?.schema;
      const formFromSchema = generateForm(JSON.parse(schema));
      Object.keys(formFromSchema).forEach((key: string) => {
        // rinomino chiavi
        const tmpKey = key;
        const tmpObj = formFromSchema[key];
        delete formFromSchema[key];
        formFromSchema[tmpObj.keyService || tmpKey] = tmpObj;
      });
      Object.keys(formFromSchema).forEach((key: string, index: number) => {
        formFromSchema[key].label = formFromSchema[key].value?.toString() || '';
        formFromSchema[key].value = '';
        formFromSchema[key].order = 5 + index; // todo: 4 è il numero dei field del form
      });
      updateForm({ ...form, ...formFromSchema }, true);
      setLoadingCompleted(true);
    }
  };

  useEffect(() => {
    loadMock();
  }, []);

  useEffect(() => {
    if (!creation) {
      dispatch(GetServicesDetail('idSede'));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [creation]);

  useEffect(() => {
    if (formData && loadingCompleted && !creation) {
      setFormValues(formData);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData, loadingCompleted]);

  const updateFormToOrder = () => {
    if (form) {
      return Object.keys(form).sort(
        (a, b) => Number(form[a].order) - Number(form[b].order)
      );
    }
  };

  const orderQuestions = updateFormToOrder();

  const onInputDataChange = (
    value: formFieldI['value'],
    field?: formFieldI['field']
  ) => {
    onInputChange?.(value, field);
    sendNewValues?.(getFormValues?.());
    setIsFormValid?.(FormHelper.isValidForm(form));
  };

  const isMobile = device.mediaIsPhone;

  const getAnswerType = (field: formFieldI) => {
    switch (field.type) {
      case 'date':
      case 'time':
      case 'text': {
        return (
          <Input
            {...field}
            id={`input-${field.field}`}
            label={field.label}
            type={field.type}
            required
            wrapperClassName={clsx(
              field.label && field.label?.length > 20
                ? 'd-inline-block w-100'
                : 'd-inline-block  mr-2',
              isMobile ? 'w-100' : 'compile-survey-container__half-width'
            )}
            onInputChange={(value, field) => {
              onInputDataChange(value, field);
            }}
            placeholder={`Inserisci ${field.label?.toLowerCase()}`}
          />
        );
      }
      case 'select': {
        return (
          <Select
            id={`input-${field}`}
            label={field.label || ''}
            col='col-12 col-lg-6'
            required
            onInputChange={onInputChange}
            placeholder={`Inserisci ${field.label?.toLowerCase()}`}
            wrapperClassName={clsx(
              'd-inline-block',
              'compile-survey-container__select-margin',
              'mr-2',
              isMobile ? 'w-100' : 'compile-survey-container__half-width'
            )}
            options={[
              { label: 'Tipo 1', value: '1' },
              { label: 'Tipo 2', value: '2' },
            ]}
            isDisabled={formDisabled}
            value={field.value}
          />
        );
      }
      case 'checkbox': {
        //nascondi field level2
        if (field.format === 'multiple-select' && field.relatedFrom !== '') {
          return null;
        }
        // visualizza field level1 e mappa opzioni
        if (
          form &&
          field.format === 'multiple-select' &&
          field.relatedTo !== ''
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
              relatedTo = form[key].keyService || '';
          });
          if (
            form &&
            field?.relatedTo &&
            form[relatedTo].enumLevel2 &&
            multiSelectOptions?.length > 0
          ) {
            (form[relatedTo].enumLevel2 || []).forEach(
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
          const valuesSecondLevel = form[relatedTo].value;
          const values: OptionTypeMulti[] = [];
          Array.isArray(valuesSecondLevel) &&
            (valuesSecondLevel || []).map((val: string) => {
              let upperLevel = '';
              Object.keys(multiSelectOptions).forEach((key: string) => {
                if (
                  multiSelectOptions[Number(key)].options.filter(
                    (x: { label: string; value: string; upperLevel: string }) =>
                      x.label === val
                  )?.length > 0
                ) {
                  upperLevel = multiSelectOptions[Number(key)].label;
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
              field={field.keyService || field.field}
              secondLevelField={relatedTo}
              id={`multiple-select-${field.id}`}
              label={`${field?.label}`}
              aria-label={`${field?.label}`}
              options={multiSelectOptions}
              required={field.required || false}
              onInputChange={onInputDataChange}
              onSecondLevelInputChange={onInputDataChange}
              placeholder='Seleziona'
              wrapperClassName={clsx('d-inline-block', 'w-100', 'mb-5')}
              isDisabled={formDisabled}
              value={values}
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
            onInputBlur={onInputChange}
            label={`${field?.label}`}
          />
        );
      }
      default:
        return '';
    }
  };

  return (
    <Form className='my-5' formDisabled={formDisabled}>
      <div className={clsx(isMobile && 'mx-3', !isMobile && 'mx-5')}>
        {form &&
          (orderQuestions || []).map((key) => <>{getAnswerType(form[key])}</>)}
      </div>
    </Form>
  );
};

export default withFormHandler({ form }, Services);

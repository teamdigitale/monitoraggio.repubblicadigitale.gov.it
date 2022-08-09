import clsx from 'clsx';
import React, { useEffect } from 'react';
import { Form, Input, Select, SelectMultiple } from '../../../components';
import { OptionTypeMulti } from '../../../components/Form/selectMultiple';
import withFormHandler, {
  withFormHandlerProps,
} from '../../../hoc/withFormHandler';
import { selectServices } from '../../../redux/features/administrativeArea/administrativeAreaSlice';
// import { selectDevice } from '../../../redux/features/app/appSlice';
import { useAppSelector } from '../../../redux/hooks';
import { formatDate } from '../../../utils/datesHelper';
import {
  formFieldI,
  FormHelper,
  FormI,
  newForm,
} from '../../../utils/formHelper';

interface FormServicesI {
  formDisabled?: boolean;
  sendNewValues?: (param?: { [key: string]: formFieldI['value'] }) => void;
  setIsFormValid?: (param: boolean) => void;
  creation?: boolean;
  dynamicFormQ3?: FormI;
}

interface FormEnteGestoreProgettoFullInterface
  extends withFormHandlerProps,
    FormServicesI {}

const FormServiceDynamic: React.FC<FormEnteGestoreProgettoFullInterface> = (
  props
) => {
  const {
    setFormValues = () => ({}),
    form,
    onInputChange,
    sendNewValues,
    setIsFormValid = () => ({}),
    getFormValues,
    creation = false,
    updateForm = () => ({}),
    dynamicFormQ3,
  } = props;
  // const device = useAppSelector(selectDevice);
  // const isMobile = device.mediaIsPhone;
  const formData = useAppSelector(selectServices)?.detail?.dettaglioServizio;
  const formDisabled = !!props.formDisabled;

  useEffect(() => {
    if (dynamicFormQ3) updateForm(dynamicFormQ3);
  }, [dynamicFormQ3]);

  useEffect(() => {
    if (formData && !creation) {
      const values = { ...formData };
      const formattedDate = formatDate(formData?.data?.toString(), 'snakeDate');
      if (formattedDate) values.dataConferimentoConsenso = formattedDate;
      setFormValues(values); // TODO: precompilare ????
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData]);

  useEffect(() => {
    if (
      form &&
      formDisabled &&
      Object.entries(form).some(([_key, value]) => !value.disabled)
    ) {
      updateForm(
        Object.fromEntries(
          Object.entries(form).map(([key, value]) => [
            key,
            { ...value, disabled: formDisabled },
          ])
        ),
        true
      );
    }
  }, [formDisabled, form]);

  useEffect(() => {
    sendNewValues?.(getFormValues?.());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form]);

  const onInputDataChange = (
    value: formFieldI['value'],
    field?: formFieldI['field']
  ) => {
    onInputChange?.(value, field);
    setIsFormValid?.(FormHelper.isValidForm(form));
  };

  const getAnswerType = (field: formFieldI) => {
    switch (field.type) {
      case 'date':
      case 'time':
      case 'text': {
        return (
          <Input
            {...field}
            id={`input-${field.field}`}
            col={
              field.label && field.label?.length > 20
                ? 'col-12'
                : 'col-12 col-lg-6'
            }
            label={field.label}
            type={field.type}
            required
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
            field={field.field}
            label={field.label || ''}
            col='col-12 col-lg-6'
            required
            onInputChange={(value, field) => {
              onInputDataChange(value, field);
            }}
            placeholder={`Inserisci ${field.label?.toLowerCase()}`}
            options={field.options}
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
              relatedTo = form[key].field || '';
          });
          if (
            form &&
            field?.relatedTo &&
            form[relatedTo]?.enumLevel2 &&
            multiSelectOptions?.length > 0
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
                    ?.length > 0
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
              field={field.field}
              secondLevelField={relatedTo}
              id={`multiple-select-${field.id}`}
              col='col-12'
              label={`${field?.label}`}
              aria-label={`${field?.label}`}
              options={multiSelectOptions}
              required={field.required || false}
              onInputChange={onInputDataChange}
              onSecondLevelInputChange={onInputDataChange}
              placeholder='Seleziona'
              isDisabled={formDisabled}
              value={values}
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
          />
        );
      }
      default:
        return '';
    }
  };

  return (
    <Form id='form-service-dynamic' formDisabled={formDisabled}>
      <div className='d-inline-flex flex-wrap w-100'>
        {dynamicFormQ3 &&
          Object.keys(dynamicFormQ3).map((key) => (
            <>{getAnswerType(dynamicFormQ3[key])}</>
          ))}
      </div>
    </Form>
  );
};

const form = newForm([]);

export default withFormHandler({ form }, FormServiceDynamic);

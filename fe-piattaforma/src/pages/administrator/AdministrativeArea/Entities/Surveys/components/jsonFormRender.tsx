import React, { useEffect, useState } from 'react';
import {
  Form,
  Input,
  PrefixPhone,
  Rating,
  Select,
} from '../../../../../../components';
import { formFieldI, FormI } from '../../../../../../utils/formHelper';
import CheckboxGroup from '../../../../../../components/Form/checkboxGroup';
import clsx from 'clsx';
import '../compileSurvey/compileSurvey.scss';
import { setCompilingSurveyForm } from '../../../../../../redux/features/administrativeArea/surveys/surveysSlice';
import { useDispatch } from 'react-redux';
import { Label } from 'design-react-kit';
import SelectMultipleCheckbox from '../../../../../../components/Form/selectMultipleCheckbox';

interface JsonFormRenderI {
  form: FormI;
  onInputChange?: (
    value: formFieldI['value'],
    field?: formFieldI['field']
  ) => void;
  currentStep?: number;
  viewMode?: boolean;
}

const JsonFormRender: React.FC<JsonFormRenderI> = (props) => {
  const {
    form = {},
    onInputChange = () => ({}),
    currentStep,
    viewMode = false,
  } = props;
  const dispatch = useDispatch();
  //const device = useAppSelector(selectDevice);

  useEffect(() => {
    if (currentStep === 3) {
      // last step
      dispatch(setCompilingSurveyForm({ id: currentStep, form }));
    }
  }, [currentStep, form]);

  const updateFormToOrder = () => {
    return Object.keys(form).sort(
      (a, b) => Number(form[a].order) - Number(form[b].order)
    );
  };
  const [orderedForm, setOrderedForm] = useState(updateFormToOrder());

  useEffect(() => {
    setOrderedForm(updateFormToOrder());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form]);

  const renderPrefix = (field: formFieldI) => {
    if (field?.keyBE === 'prefisso') {
      return (
        <PrefixPhone
          {...field}
          onInputChange={onInputChange}
          disabled={field?.disabled || viewMode}
        />
      );
    }
    return;
  };

  const renderInputByType = (formField: formFieldI) => {
    switch (formField?.type) {
      case 'text':
      default: {
        if (formField?.keyBE?.toLowerCase() === 'prefisso') {
          return renderPrefix(formField);
        }
        if (
          formField?.field === '19' &&
          (formField?.value === '' || formField?.value === 'Invalid date')
        ) {
          return null;
        }

        return (
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          <Input
            {...formField}
            // className={clsx(
            //   (device.mediaIsPhone || device.mediaIsTablet) &&
            //     'd-flex w-100 flex-column mt-1'
            // )}
            col={clsx(
              formField?.keyBE?.toLowerCase() === 'numerocellulare'
                ? 'col-8 col-lg-4'
                : 'col-12 col-lg-6',
              formField?.field === '19' && 'mt-4'
            )}
            label={formField?.label}
            onInputBlur={onInputChange}
            disabled={formField?.disabled || viewMode}
            placeholder={`${formField?.label}`}
          />
        );
      }
      case 'select': {
        if (formField.options?.length) {
          return (
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            <Select
              {...formField}
              col='col-12 col-lg-6'
              onInputChange={onInputChange}
              placeholder={`Seleziona ${
                (formField?.label || '')?.length < 20
                  ? formField?.label?.toLowerCase()
                  : ''
              }`}
              aria-label={`Seleziona ${
                (formField?.label || '')?.length < 20
                  ? formField?.label?.toLowerCase()
                  : ''
              }`}
              label={`${formField?.label}`}
              isDisabled={formField?.disabled || viewMode}
            />
          );
        }
        break;
      }
      case 'checkbox': {
        if (
          formField.format === 'multiple-select' &&
          formField.relatedFrom !== ''
        ) {
          return null;
        }
        if (
          formField.format === 'multiple-select' &&
          formField.relatedTo !== ''
        ) {
          const multiSelectOptions: {
            label: string;
            options: { label: string; value: string; upperLevel: string }[];
          }[] = [];
          if (formField.enumLevel1) {
            (formField.enumLevel1 || []).forEach((opt) => {
              multiSelectOptions.push({
                label: opt,
                options: [],
              });
            });
          }
          if (
            formField?.relatedTo &&
            form[formField.relatedTo].enumLevel2 &&
            multiSelectOptions?.length
          ) {
            (form[formField.relatedTo].enumLevel2 || []).forEach(
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
          const valuesSecondLevel =
            formField?.relatedTo && form[formField?.relatedTo]?.value;
          return (
            <SelectMultipleCheckbox
              field={formField.field}
              secondLevelField={formField.relatedTo}
              id={`multiple-select-${formField.id}`}
              label={`${formField?.label}`}
              aria-label={`${formField?.label}`}
              options={multiSelectOptions}
              required={formField.required || false}
              placeholder='Seleziona'
              col='col-12'
              isDisabled={formField?.disabled || viewMode}
              valueSecondLevelString={
                Array.isArray(valuesSecondLevel)
                  ? valuesSecondLevel?.join('§')
                  : undefined
              }
              // value={values} // OLD MULTIPLE SELECT - DELETE
            />
          );
        }
        if (formField.options?.length) {
          if (viewMode && Array.isArray(formField?.value)) {
            formField.value = formField?.value.join('§');
          }
          return (
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            <CheckboxGroup
              {...formField}
              className={'col-12 col-lg-6'}
              onInputChange={onInputChange}
              label={`${formField?.label}`}
              styleLabelForm
              noLabel={formField.flag}
              disabled={formField?.disabled || viewMode}
              optionsInColumn={formField.field !== '18'}
              separator='§'
              singleSelection={formField.field === '18'}
            />
          );
        }
        return (
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          <Input
            {...formField}
            col='col-12 col-lg-6'
            onInputBlur={onInputChange}
            label={`${formField?.label}`}
            disabled={formField?.disabled || viewMode}
            placeholder={`${formField?.label}`}
          />
        );
      }
      case 'range':
        return (
          <div className='d-flex flex-column align-items-start'>
            <Label className='rating-label'>
              {formField?.label} {formField?.required && '*'}
            </Label>
            <Rating
              className='col-12 col-lg-6'
              onChange={(val) => onInputChange(val, formField.field)}
              value={Number(formField?.value)}
              disabled={formField?.disabled || viewMode}
            />
          </div>
        );
    }
  };

  return (
    <Form
      id='compile-survey-form'
      showMandatory={currentStep === 0 || currentStep === 3}
      marginShowMandatory={false}
      customMargin={
        currentStep === 0
          ? 'ml-2 mb-3 pb-3d'
          : currentStep === 3
          ? 'ml-2 mb-3'
          : ''
      }
    >
      <div
        className={clsx('d-inline-flex flex-wrap w-100', viewMode && 'pt-5')}
      >
        {orderedForm.map((field) => (
          <React.Fragment key={field}>
            {renderInputByType(form[field])}
          </React.Fragment>
        ))}
      </div>
    </Form>
  );
};

export default JsonFormRender;

/*

// OLD MULTIPLE SELECT - DELETE
// mappa valori
          const valuesSecondLevel =
            formField?.relatedTo && form[formField?.relatedTo]?.value;
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
              field={formField.field}
              secondLevelField={formField.relatedTo}
              id={`multiple-select-${formField.id}`}
              label={`${formField?.label}`}
              aria-label={`${formField?.label}`}
              options={multiSelectOptions}
              required={formField.required || false}
              // only field 25 and it is not editable
              // onInputChange={onInputChange}
              // onSecondLevelInputChange={onInputChange}
              placeholder='Seleziona'
              col='col-12'
              value={values}
              isDisabled={formField?.disabled || viewMode}
            />
          );
        }

*/

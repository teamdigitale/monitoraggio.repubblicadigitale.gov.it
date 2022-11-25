import clsx from 'clsx';
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Form, Input, Select } from '../../../components';
import withFormHandler, {
  withFormHandlerProps,
} from '../../../hoc/withFormHandler';
import { selectServices } from '../../../redux/features/administrativeArea/administrativeAreaSlice';
import { GetValuesDropdownServiceCreation } from '../../../redux/features/administrativeArea/services/servicesThunk';
import { useAppSelector } from '../../../redux/hooks';
import {
  formFieldI,
  FormHelper,
  newForm,
  newFormField,
} from '../../../utils/formHelper';
import { getSessionValues } from '../../../utils/sessionHelper';

interface FormServicesI {
  formDisabled?: boolean;
  sendNewValues?: (param?: { [key: string]: formFieldI['value'] }) => void;
  setIsFormValid?: (param: boolean) => void;
  creation?: boolean;
  legend?: string | undefined;
}

interface FormEnteGestoreProgettoFullInterface
  extends withFormHandlerProps,
    FormServicesI {}

const FormServiceStatic: React.FC<FormEnteGestoreProgettoFullInterface> = (
  props
) => {
  const {
    setFormValues = () => ({}),
    form,
    onInputChange,
    sendNewValues = () => ({}),
    setIsFormValid = () => ({}),
    getFormValues = () => ({}),
    updateForm = () => ({}),
    creation = false,
    legend = '',
  } = props;
  const dropdownOptions = useAppSelector(selectServices)?.dropdownsCreation;
  const formData = useAppSelector(selectServices)?.detail?.dettaglioServizio;
  const formDisabled = !!props.formDisabled;
  const dispatch = useDispatch();
  const { idEnte, nomeEnte } = JSON.parse(getSessionValues('profile'));

  useEffect(() => {
    if (form?.idEnte?.value) {
      dispatch(
        GetValuesDropdownServiceCreation({
          dropdownType: 'sedi',
          idEnte: idEnte,
        })
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idEnte]);

  useEffect(() => {
    if (formData && !creation) {
      const values = {
        nomeServizio: formData?.nomeServizio,
        idEnte: dropdownOptions?.enti?.filter(
          (opt) => opt.label === formData?.nomeEnte
        )[0]?.value,
        idSede: dropdownOptions?.sedi?.filter(
          (opt) => opt.label === formData?.nomeSede
        )[0]?.value,
      };
      setFormValues(values);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData, dropdownOptions]);

  useEffect(() => {
    if (creation) {
      const values = {
        nomeServizio: form?.nomeServizio?.value,
        idEnte: form?.idEnte?.value,
        idSede: form?.idSede?.value,
      };
      if (!values.idEnte && dropdownOptions?.enti?.length) {
        values.idEnte = idEnte;
      }
      if (dropdownOptions?.sedi?.length === 1) {
        values.idSede = dropdownOptions.sedi[0].value;
      }
      setFormValues(values);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dropdownOptions?.enti, dropdownOptions?.sedi]);

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

  const onInputDataChange = (
    value: formFieldI['value'],
    field?: formFieldI['field']
  ) => {
    onInputChange?.(value, field);
    setIsFormValid?.(FormHelper.isValidForm(form));
  };

  useEffect(() => {
    sendNewValues(getFormValues());
    setIsFormValid(FormHelper.isValidForm(form));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form]);

  return (
    <Form
      legend={legend}
      id='form-service-static'
      formDisabled={formDisabled}
      marginShowMandatory={false}
      customMargin='mb-3 pb-3'
    >
      <Form.Row className={clsx(!formDisabled && 'mt-3')}>
        <Input
          {...form?.nomeServizio}
          col='col-12'
          placeholder={`${form?.nomeServizio?.label}`}
          onInputChange={onInputDataChange}
        />
        <Input
          {...form?.idEnte}
          disabled
          col='col-12 col-lg-6'
          // className='pr-lg-3'
          value={nomeEnte}
        />
        <Select
          {...form?.idSede}
          col='col-12 col-lg-6'
          placeholder={`Seleziona ${form?.idSede?.label?.toLowerCase()}`}
          onInputChange={onInputDataChange}
          options={dropdownOptions['sedi']}
          wrapperClassName='pl-0 pr-lg-3'
          isDisabled={formDisabled || dropdownOptions?.sedi?.length === 1}
        />
      </Form.Row>
    </Form>
  );
};

const form = newForm([
  newFormField({
    field: 'nomeServizio',
    id: 'nomeServizio',
    label: 'Nome',
    type: 'text',
    required: true,
  }),
  newFormField({
    field: 'idEnte',
    id: 'nomeEnte',
    label: 'Ente',
    type: 'text',
    required: true,
    disabled: true,
    value: JSON.parse(getSessionValues('profile'))?.idEnte,
  }),
  newFormField({
    field: 'idSede',
    id: 'nomeSede',
    label: 'Sede',
    type: 'text',
    required: true,
  }),
]);

export default withFormHandler({ form }, FormServiceStatic);

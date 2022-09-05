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

interface FormServicesI {
  formDisabled?: boolean;
  sendNewValues?: (param?: { [key: string]: formFieldI['value'] }) => void;
  setIsFormValid?: (param: boolean) => void;
  creation?: boolean;
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
    sendNewValues,
    setIsFormValid = () => ({}),
    getFormValues,
    updateForm = () => ({}),
    creation = false,
  } = props;
  const dropdownOptions = useAppSelector(selectServices)?.dropdownsCreation;
  const formData = useAppSelector(selectServices)?.detail?.dettaglioServizio;
  const formDisabled = !!props.formDisabled;
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(GetValuesDropdownServiceCreation({dropdownType: 'enti'}));
  },[]);

  useEffect(() => {
    if(form?.idEnte?.value){
      dispatch(GetValuesDropdownServiceCreation({dropdownType: 'sedi', idEnte: Number(form?.idEnte?.value)}));
    }
  },[form?.idEnte?.value]);

  useEffect(() => {
    if (formData && !creation) {
      const values = {
        nomeServizio: formData?.nomeServizio,
        idEnte: dropdownOptions['enti']?.filter(opt => opt.label === formData?.nomeEnte)[0]?.value,
        idSede: dropdownOptions['sedi']?.filter(opt => opt.label === formData?.nomeSede)[0]?.value,
      };
      setFormValues(values);
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

  const onInputDataChange = (
    value: formFieldI['value'],
    field?: formFieldI['field']
  ) => {
    onInputChange?.(value, field);
    setIsFormValid?.(FormHelper.isValidForm(form));
  };

  useEffect(() => {
    sendNewValues?.(getFormValues?.());
    setIsFormValid?.(FormHelper.isValidForm(form));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form]);

  return (
    <Form id='form-service-static' formDisabled={formDisabled}>
      <Form.Row>
        <Input
          {...form?.nomeServizio}
          col='col-12'
          placeholder={`Inserisci ${form?.nomeServizio?.label?.toLowerCase()}`}
          onInputChange={onInputDataChange}
        />
        <Select
          {...form?.idEnte}
          col='col-12 col-lg-6'
          placeholder={`Inserisci ${form?.idEnte?.label?.toLowerCase()}`}
          onInputChange={onInputDataChange}
          options={dropdownOptions['enti']}
          wrapperClassName='mb-5 pr-lg-3'
          isDisabled={formDisabled}
        />
        <Select
          {...form?.idSede}
          col='col-12 col-lg-6'
          placeholder={`Inserisci ${form?.idSede?.label?.toLowerCase()}`}
          onInputChange={onInputDataChange}
          options={dropdownOptions['sedi']}
          wrapperClassName='mb-5 pr-lg-3'
          isDisabled={formDisabled}
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

import React, { useEffect } from 'react';
import { Form, Input } from '../../../components';
import withFormHandler, {
  withFormHandlerProps,
} from '../../../hoc/withFormHandler';
import { selectServices } from '../../../redux/features/administrativeArea/administrativeAreaSlice';
import { useAppSelector } from '../../../redux/hooks';
import { formatDate } from '../../../utils/datesHelper';
import {
  formFieldI,
  FormHelper,
  newForm,
  newFormField,
} from '../../../utils/formHelper';
import { RegexpType } from '../../../utils/validator';

interface FormServicesI {
  formDisabled?: boolean;
  sendNewValues?: (param?: { [key: string]: formFieldI['value'] }) => void;
  setIsFormValid?: (param: boolean) => void;
  creation?: boolean;
}

interface FormEnteGestoreProgettoFullInterface
  extends withFormHandlerProps,
    FormServicesI {}

const FormServiceStatic: React.FC<FormEnteGestoreProgettoFullInterface> = (props) => {
  const {
    setFormValues = () => ({}),
    form,
    onInputChange,
    sendNewValues,
    setIsFormValid = () => ({}),
    getFormValues,
    creation = false,
  } = props;
  const formData = useAppSelector(selectServices)?.detail?.dettaglioServizio;
  const formDisabled = !!props.formDisabled;

  useEffect(() => {
    if (formData && !creation) {
      const values = { ...formData };
      const formattedDate = formatDate(
        formData?.data?.toString(),
        'snakeDate'
      );
      if (formattedDate) values.dataConferimentoConsenso = formattedDate;
      setFormValues(values);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData]);

  const onInputDataChange = (
    value: formFieldI['value'],
    field?: formFieldI['field']
  ) => {
    onInputChange?.(value, field);
    setIsFormValid?.(FormHelper.isValidForm(form));
  };

  useEffect(() => {
    sendNewValues?.(getFormValues?.());
  }, [form]);

  return (
    <Form formDisabled={formDisabled}>
      <Form.Row>
        <Input
          {...form?.nomeServizio}
          col='col-12 col-lg-6'
          placeholder={`Inserisci ${form?.nomeServizio?.label?.toLowerCase()}`}
          onInputChange={onInputDataChange}
        />
        <Input
          {...form?.nomeEnte}
          col='col-12 col-lg-6'
          placeholder={`Inserisci ${form?.nomeEnte?.label?.toLowerCase()}`}
          onInputChange={onInputDataChange}
        />
      </Form.Row>
      <Form.Row>
        <Input
          {...form?.nomeSede}
          col='col-12 col-lg-6'
          placeholder={`Inserisci ${form?.nomeSede?.label?.toLowerCase()}`}
          onInputChange={onInputDataChange}
        />
        <Input
          {...form?.durataServizio}
          col='col-12 col-lg-6'
          placeholder={`Inserisci ${form?.durataServizio?.label?.toLowerCase()}`}
          onInputChange={onInputDataChange}
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
    field: 'nomeEnte',
    id: 'nomeEnte',
    label: 'Ente',
    type: 'text',
    required: true,
  }),
  newFormField({
    field: 'nomeSede',
    id: 'nomeSede',
    label: 'Sede',
    type: 'text',
    required: true,
  }),
  newFormField({
    field: 'durataServizio',
    id: 'durataServizio',
    label: 'Durata servizio',
    type: 'time',
    regex: RegexpType.TIME,
    required: true,
  }),
]);

export default withFormHandler({ form }, FormServiceStatic);

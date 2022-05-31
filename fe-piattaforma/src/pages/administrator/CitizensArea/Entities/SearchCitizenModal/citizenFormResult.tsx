import React, { useEffect } from 'react';
import withFormHandler, {
  withFormHandlerProps,
} from '../../../../../hoc/withFormHandler';
import { newForm, newFormField } from '../../../../../utils/formHelper';
import { RegexpType } from '../../../../../utils/validator';
import { Form, Input } from '../../../../../components';
import { CittadinoInfoI } from '../../../../../redux/features/citizensArea/citizensAreaSlice';

interface CitizenFormDataI {
  data: CittadinoInfoI;
}

interface CitizenFormResultI extends CitizenFormDataI, withFormHandlerProps {}

const form = newForm([
  newFormField({
    field: 'nome',
  }),
  newFormField({
    field: 'cognome',
  }),
  newFormField({
    field: 'codiceFiscale',
  }),
  newFormField({
    field: 'email',
    regex: RegexpType.EMAIL,
  }),
  newFormField({
    field: 'phone',
  }),
]);

const CitizenFormResult: React.FC<CitizenFormResultI> = (props) => {
  const { setFormValues = () => ({}), form = {}, data } = props;

  useEffect(() => {
    setFormValues(data as { [key: string]: string });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  return (
    <Form formDisabled>
      <Form.Row>
        <Input {...form.nome} col='col-6' label='Nome' />
        <Input {...form.cognome} col='col-6' label='Cognome' />
      </Form.Row>
      <Form.Row>
        <Input {...form.codiceFiscale} col='col-6' label='Codice fiscale' />
        <Input {...form.email} col='col-6' label='Indirizzo email' />
      </Form.Row>
      <Form.Row>
        <Input {...form.phone} col='col-6' label='Telefono' />
      </Form.Row>
    </Form>
  );
};

export default withFormHandler({ form }, CitizenFormResult);

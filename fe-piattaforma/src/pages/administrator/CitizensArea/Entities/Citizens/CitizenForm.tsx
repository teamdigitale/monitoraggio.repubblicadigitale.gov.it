import React, { useEffect } from 'react';
import withFormHandler, {
  withFormHandlerProps,
} from '../../../../../hoc/withFormHandler';
import { newForm, newFormField } from '../../../../../utils/formHelper';
import { RegexpType } from '../../../../../utils/validator';
import { Form, Input } from '../../../../../components';
import { CittadinoInfoI } from '../../../../../redux/features/citizensArea/citizensAreaSlice';
import { FormGroup, Label } from 'design-react-kit';
import { Input as InputKit } from 'design-react-kit';
import { useAppSelector } from '../../../../../redux/hooks';
import { selectDevice } from '../../../../../redux/features/app/appSlice';
import clsx from 'clsx';

interface CitizenFormI {
  info: CittadinoInfoI;
}

interface CitizenFormFullI extends CitizenFormI, withFormHandlerProps {}

const form = newForm([
  newFormField({
    field: 'name',
  }),
  newFormField({
    field: 'lastName',
  }),
  newFormField({
    field: 'fiscalCode',
  }),
  newFormField({
    field: 'nDoc',
  }),
  newFormField({
    field: 'nationality',
  }),
  newFormField({
    field: 'age',
  }),
  newFormField({
    field: 'degree',
  }),
  newFormField({
    field: 'occupation',
  }),
  newFormField({
    field: 'phone',
  }),
  newFormField({
    field: 'consensoOTP',
    type: 'checkbox',
  }),
  newFormField({
    field: 'confModulo',
    type: 'checkbox',
  }),
  newFormField({
    field: 'email',
    regex: RegexpType.EMAIL,
  }),
  newFormField({
    field: 'dataConf',
    regex: RegexpType.DATE,
    required: true,
    type: 'date',
  }),
]);

const CitizenForm: React.FC<CitizenFormFullI> = (props) => {
  const { setFormValues, form = {}, info } = props;

  useEffect(() => {
    setFormValues?.(info as { [key: string]: string });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [info]);

  const device = useAppSelector(selectDevice);

  const mobileCol = device.mediaIsPhone ? 'col-12' : 'col-6';

  return (
    <Form formDisabled className='my-5'>
      <Form.Row>
        <Input {...form.name} col={mobileCol} label='Nome' />
        <Input {...form.lastName} col={mobileCol} label='Cognome' />
      </Form.Row>
      <Form.Row>
        <Input {...form.fiscalCode} col={mobileCol} label='Codice fiscale' />
        <Input {...form.nDoc} col={mobileCol} label='Numero documento' />
      </Form.Row>
      <Form.Row>
        <Input {...form.nationality} col={mobileCol} label='Nazionalità' />
        <Input {...form.age} col={mobileCol} label='Età' />
      </Form.Row>
      <Form.Row>
        <Input {...form.degree} col={mobileCol} label='Titolo di studio' />
        <Input {...form.occupation} col={mobileCol} label='Occupazione' />
      </Form.Row>
      <Form.Row>
        <Input {...form.email} col={mobileCol} label='Indirizzo email' />
        <Input {...form.phone} col={mobileCol} label='Telefono' />
      </Form.Row>
      <Form.Row>
        <div
          className={clsx(
            mobileCol,
            'd-flex flex-column',
            device.mediaIsPhone && 'mb-5'
          )}
        >
          <Label check>Consenso al trattamento dei dati</Label>
          <FormGroup check inline>
            <InputKit
              id='checkbox-otp'
              type='checkbox'
              checked={
                form.consensoOTP?.value === 'true' || !!form.consensoOTP?.value
              }
              readOnly={true}
            />
            <Label for='checkbox-otp' check>
              OTP
            </Label>
            <InputKit
              id='checkbox-modulo'
              type='checkbox'
              checked={
                form.confModulo?.value === 'true' || !!form.confModulo?.value
              }
              readOnly={true}
            />
            <Label for='checkbox-modulo' check>
              Modulo cartaceo
            </Label>
          </FormGroup>
        </div>
        <Input
          {...form.dataConf}
          col={mobileCol}
          label='Data di conferimento consenso'
        />
      </Form.Row>
    </Form>
  );
};

export default withFormHandler({ form }, CitizenForm);

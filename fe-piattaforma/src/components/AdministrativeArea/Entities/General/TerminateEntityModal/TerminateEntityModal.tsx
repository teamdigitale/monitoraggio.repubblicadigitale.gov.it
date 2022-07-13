import React, { useEffect, useState } from 'react';
import { Icon } from 'design-react-kit';
import withFormHandler, {
  withFormHandlerProps,
} from '../../../../../hoc/withFormHandler';
import { newForm, newFormField } from '../../../../../utils/formHelper';
import Form from '../../../../Form/form';
import Input from '../../../../Form/input';
import GenericModal from '../../../../Modals/GenericModal/genericModal';
import { RegexpType } from '../../../../../utils/validator';

const id = 'terminate-entity';

interface TerminateEntityModalI {
  onConfirm: (date: string) => void;
  onClose: () => void;
  text: string;
}

interface TerminateEntityModalFullI
  extends TerminateEntityModalI,
    withFormHandlerProps {}

const form = newForm([
  newFormField({
    field: 'date',
    id: 'date',
    regex: RegexpType.DATE,
    type: 'date',
  }),
]);

const TerminateEntityModal = ({
  onConfirm,
  onClose,
  text,
  form,
  onInputChange = () => ({}),
  getFormValues = () => ({}),
}: TerminateEntityModalFullI) => {
  const [terminationDate, setTerminationDate] = useState('');

  useEffect(() => {
    const newDate = getFormValues()['date'] as string;

    newDate && isDateValid(newDate) && setTerminationDate(formatDate(newDate));
  }, [form]);

  const isDateValid = (date: string) => {
    const newDate = new Date(date);

    if (newDate.getFullYear() > new Date().getFullYear()) return false;
    if (newDate.getFullYear() === new Date().getFullYear()) {
      if (newDate.getMonth() > new Date().getMonth()) return false;
      if (newDate.getMonth() === new Date().getMonth()) {
        if (newDate.getDate() > new Date().getDate()) return false;
      }
    }

    return true;
  };

  const formatDate = (date: string) => {
    const newDate = new Date(date);
    const day = newDate.getDate() + '';
    const month = newDate.getMonth() + 1 + '';
    const year = newDate.getFullYear() + '';

    return `${day.padStart(2, '0')}-${month.padStart(2, '0')}-${year}`;
  };

  return (
    <GenericModal
      id={id}
      primaryCTA={{
        label: 'Conferma',
        disabled: !terminationDate,
        onClick: () => terminationDate && onConfirm(terminationDate),
      }}
      secondaryCTA={{
        label: 'Annulla',
        onClick: onClose,
      }}
      centerButtons
      onClose={onClose}
    >
      <div className='d-flex flex-column justify-content-center'>
        <div className='d-flex justify-content-center mb-4'>
          <Icon
            icon='it-error'
            style={{ width: '111px', height: '111px', fill: '#FF9900' }}
            aria-label='Errore'
          />
        </div>
        <div className='text-center pb-3'>{text}</div>
        <Form>
          <Form.Row>
            <div className='col'></div>
            <Input
              {...form?.date}
              col='col-6'
              max={new Date().toISOString().split('T')[0]}
              placeholder='Seleziona Data'
              onInputChange={(value, field) => {
                onInputChange(value, field);
              }}
            />
            <div className='col'></div>
          </Form.Row>
        </Form>
      </div>
    </GenericModal>
  );
};

export default withFormHandler({ form }, TerminateEntityModal);

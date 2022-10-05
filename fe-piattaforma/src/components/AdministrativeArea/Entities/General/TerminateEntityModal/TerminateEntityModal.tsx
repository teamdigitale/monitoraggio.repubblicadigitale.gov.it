import React, { useEffect, useState } from 'react';
import { Icon } from 'design-react-kit';
import { useDispatch } from 'react-redux';
import withFormHandler, {
  withFormHandlerProps,
} from '../../../../../hoc/withFormHandler';
import { newForm, newFormField } from '../../../../../utils/formHelper';
import Form from '../../../../Form/form';
import Input from '../../../../Form/input';
import GenericModal from '../../../../Modals/GenericModal/genericModal';
import { RegexpType } from '../../../../../utils/validator';
import { useAppSelector } from '../../../../../redux/hooks';
import {
  closeModal,
  selectModalPayload,
} from '../../../../../redux/features/modal/modalSlice';
import { formatDate } from '../../../../../utils/common';

const id = 'terminate-entity';

interface TerminateEntityModalI {
  onConfirm: (entity: 'program' | 'project', date: string, id?: string) => void;
  onClose?: () => void;
  maxDate?: string | undefined;
  minDate?: string | undefined;
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
  form,
  //clearForm = () => ({}),
  onInputChange = () => ({}),
  getFormValues = () => ({}),
  updateForm = () => ({}),
  maxDate = new Date().toISOString().split('T')[0],
  minDate,
  isValidForm,
}: TerminateEntityModalFullI) => {
  const [terminationDate, setTerminationDate] = useState('');
  const payload = useAppSelector(selectModalPayload);
  const dispatch = useDispatch();

  const resetModal = () => {
    onInputChange('', form?.date?.field);
    setTerminationDate('');
    if (onClose) onClose();
    dispatch(closeModal());
  };

  useEffect(() => {
    if ((maxDate || minDate) && form) {
      console.log('passa da qua');
      updateForm({
        ...form,
        date: {
          ...form?.date,
          minimum: formatDate(minDate as string),
          maximum: formatDate(maxDate as string),
        },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [maxDate, minDate]);

  useEffect(() => {
    const newDate = getFormValues()?.date as string;

    newDate &&
      isDateValid(newDate) &&
      setTerminationDate(formatLocalDate(newDate));
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  const formatLocalDate = (date: string) => {
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
        disabled: !(isValidForm && terminationDate),
        onClick: () =>
          terminationDate &&
          onConfirm(
            payload?.entity,
            terminationDate,
            payload?.entity === 'project' ? payload?.projectId : undefined
          ),
      }}
      secondaryCTA={{
        label: 'Annulla',
        onClick: resetModal,
      }}
      centerButtons
    >
      <div className='d-flex flex-column justify-content-center'>
        <div className='d-flex justify-content-center mb-4'>
          <Icon
            icon='it-error'
            style={{ width: '111px', height: '111px', fill: '#FF9900' }}
            aria-label='Errore'
          />
        </div>
        <div className='text-center pb-3'>{payload?.text}</div>
        <Form id='form-terminate-entity'>
          <Form.Row>
            <div className='col'></div>
            <Input
              {...form?.date}
              col='col-6'
              placeholder='Seleziona Data'
              onInputChange={onInputChange}
            />
            <div className='col'></div>
          </Form.Row>
        </Form>
      </div>
    </GenericModal>
  );
};

export default withFormHandler({ form }, TerminateEntityModal);

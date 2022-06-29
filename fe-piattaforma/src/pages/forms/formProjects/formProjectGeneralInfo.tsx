import clsx from 'clsx';
import React, { useEffect } from 'react';

import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { Form, Input } from '../../../components';
import withFormHandler, {
  withFormHandlerProps,
} from '../../../hoc/withFormHandler';
import { selectProjects } from '../../../redux/features/administrativeArea/administrativeAreaSlice';
import { GetProjectDetail } from '../../../redux/features/administrativeArea/projects/projectsThunk';
import { useAppSelector } from '../../../redux/hooks';
import { formFieldI, newForm, newFormField } from '../../../utils/formHelper';
import { RegexpType } from '../../../utils/validator';

interface ProgramInformationI {
  formDisabled?: boolean;
  sendNewValues?: (param?: { [key: string]: formFieldI['value'] }) => void;
  setIsFormValid?: (param?: boolean | undefined) => void;
  creation?: boolean;
}

interface FormEnteGestoreProgettoFullInterface
  extends withFormHandlerProps,
    ProgramInformationI {
  intoModal?: boolean;
}
const FormProjectGeneralInfo: React.FC<FormEnteGestoreProgettoFullInterface> = (
  props
) => {
  const {
    setFormValues = () => ({}),
    form,
    onInputChange,
    sendNewValues,
    isValidForm,
    setIsFormValid = () => false,
    getFormValues = () => ({}),
    creation = false,
    updateForm = () => ({}),
    intoModal = false,
  } = props;
  const { firstParam } = useParams();

  const formDisabled = !!props.formDisabled;

  const formData: { [key: string]: string } | undefined =
    useAppSelector(selectProjects).detail?.dettaglioProgetto?.generalInfo;
  const dispatch = useDispatch();

  useEffect(() => {
    if (!creation) {
      dispatch(GetProjectDetail(firstParam || ''));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [creation]);

  useEffect(() => {
    setIsFormValid?.(isValidForm);
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form]);

  useEffect(() => {
    if (formData && !creation) {
      setFormValues(formData);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData]);

  const onInputDataChange = (
    value: formFieldI['value'],
    field?: formFieldI['field']
  ) => {
    onInputChange?.(value, field);
    setIsFormValid?.(isValidForm);
  };

  useEffect(() => {
    sendNewValues?.(getFormValues?.());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form]);

  const updateRequiredFields = () => {
    if (form) {
      const newFormList: formFieldI[] = [];
      const values = getFormValues();
      Object.keys(values).forEach((field) => {
        newFormList.push(
          newFormField({
            ...form[field],
            field: field,
            id: intoModal ? `modal-${field}` : field,
          })
        );
      });
      updateForm(newForm(newFormList));
    }
  };

  useEffect(() => {
    updateRequiredFields();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [intoModal]);

  return (
    <Form className='mt-5' formDisabled={formDisabled}>
      <Form.Row
        className={clsx('justify-content-between', 'px-0', 'px-lg-5', 'mx-5')}
      >
        <Input
          {...form?.codice}
          col='col-12 col-lg-6'
          label='ID'
          onInputChange={(value, field) => {
            onInputDataChange(value, field);
          }}
          className='pr-lg-3'
        />
        <Input
          {...form?.nomeProgetto}
          col='col-12 col-lg-6'
          label='Nome progetto'
          onInputChange={(value, field) => {
            onInputDataChange(value, field);
          }}
          className='pr-lg-3'
        />
      </Form.Row>
      <Form.Row
        className={clsx('justify-content-between', 'px-0', 'px-lg-5', 'mx-5')}
      >
        <Input
          {...form?.nomeBreve}
          col='col-12 col-lg-6'
          label='Nome breve'
          onInputChange={(value, field) => {
            onInputDataChange(value, field);
          }}
          className='pr-lg-3'
        />
        <Input
          {...form?.CUP}
          label='CUP - Codice Unico Progetto'
          col='col-12 col-lg-6'
          onInputChange={(value, field) => {
            onInputDataChange(value, field);
          }}
          className='pr-lg-3'
        />
      </Form.Row>
      <Form.Row
        className={clsx('justify-content-between', 'px-0', 'px-lg-5', 'mx-5')}
      >
        <Input
          {...form?.dataInizioProgetto}
          label='Data inizio'
          col='col-12 col-lg-6'
          onInputChange={(value, field) => {
            onInputDataChange(value, field);
          }}
          className='pr-lg-3'
        />
        <Input
          {...form?.dataFineProgetto}
          label='Data fine'
          col='col-12 col-lg-6'
          onInputChange={(value, field) => {
            onInputDataChange(value, field);
          }}
          className='pr-lg-3'
        />
      </Form.Row>
    </Form>
  );
};

const form = newForm([
  newFormField({
    field: 'nomeProgetto',
    type: 'text',
    id: 'project-name',
  }),
  newFormField({
    field: 'codice',
    id: 'project-id',
  }),
  newFormField({
    field: 'nomeBreve',
    type: 'text',
    id: 'short-name',
  }),
  newFormField({
    field: 'CUP',
    type: 'text',
  }),
  newFormField({
    field: 'dataInizioProgetto',
    regex: RegexpType.DATE,
    type: 'date',
  }),
  newFormField({
    field: 'dataFineProgetto',
    regex: RegexpType.DATE,
    type: 'date',
  }),
]);

export default withFormHandler({ form }, FormProjectGeneralInfo);

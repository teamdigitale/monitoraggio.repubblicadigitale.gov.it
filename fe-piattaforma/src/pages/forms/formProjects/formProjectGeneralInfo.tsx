import React, { useEffect } from 'react';

import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { Form, Input } from '../../../components';
import withFormHandler, {
  withFormHandlerProps,
} from '../../../hoc/withFormHandler';
import { selectProgetti } from '../../../redux/features/administrativeArea/administrativeAreaSlice';
import { GetProjectDetail } from '../../../redux/features/administrativeArea/projects/projectsThunk';
import { useAppSelector } from '../../../redux/hooks';
import { formFieldI, newForm, newFormField } from '../../../utils/formHelper';

interface ProgramInformationI {
  formDisabled?: boolean;
  sendNewValues?: (param?: { [key: string]: formFieldI['value'] }) => void;
  setIsFormValid?: (param?: boolean | undefined) => void;
  creation?: boolean;
}

interface FormEnteGestoreProgettoFullInterface
  extends withFormHandlerProps,
    ProgramInformationI {}
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
    getFormValues,
    creation = false,
  } = props;
  const { firstParam } = useParams();

  const formDisabled = !!props.formDisabled;

  const formData: { [key: string]: string } | undefined =
    useAppSelector(selectProgetti).detail?.dettaglioProgetto?.generalInfo;
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
  }, [form]);

  return (
    <Form className='mt-5 mb-5' formDisabled={formDisabled}>
      <Form.Row className='justify-content-between px-0 px-lg-5 mx-5'>
        <Input
          {...form?.id}
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
          label='Nome Progetto'
          onInputChange={(value, field) => {
            onInputDataChange(value, field);
          }}
          className='pl-lg-3'
        />
      </Form.Row>
      <Form.Row className='justify-content-between px-0 px-lg-5 mx-5'>
        <Input
          {...form?.nomeBreve}
          col='col-12 col-lg-6'
          label='Nome breve'
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
    field: 'id',
  }),
  newFormField({
    field: 'nomeProgetto',
    type: 'text',
  }),
  newFormField({
    field: 'nomeBreve',
    type: 'text',
  }),
]);

export default withFormHandler({ form }, FormProjectGeneralInfo);

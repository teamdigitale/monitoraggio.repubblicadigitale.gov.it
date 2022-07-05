// import clsx from 'clsx';
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
  const { projectId } = useParams();

  const formDisabled = !!props.formDisabled;

  const formData: { [key: string]: string } | undefined =
    useAppSelector(selectProjects).detail?.dettagliInfoProgetto;
  const dispatch = useDispatch();

  useEffect(() => {
    if (!creation && projectId) {
      dispatch(GetProjectDetail(projectId));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [creation, projectId]);

  useEffect(() => {
    setIsFormValid?.(isValidForm);
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form]);

  useEffect(() => {
    if (formData && !creation) {
      setFormValues(
        Object.fromEntries(
          Object.entries(formData).filter(
            ([key, _val]) => !key.includes('Target') && !key.includes('id')
          )
        )
      );
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
      <Form.Row>
        {/* <Input
          {...form?.codice}
          col='col-12 col-lg-6'
          label='ID'
          onInputChange={(value, field) => {
            onInputDataChange(value, field);
          }}
          className='pr-lg-3'
        /> */}
        <Input
          {...form?.nome}
          col='col-12'
          label='Nome progetto'
          onInputChange={(value, field) => {
            onInputDataChange(value, field);
          }}
        />
      </Form.Row>
      <Form.Row>
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
          {...form?.cup}
          label='CUP - Codice Unico Progetto'
          col='col-12 col-lg-6'
          onInputChange={(value, field) => {
            onInputDataChange(value, field);
          }}
          className='pl-lg-3'
        />
      </Form.Row>
      <Form.Row>
        <Input
          {...form?.dataInizio}
          label='Data inizio'
          col='col-12 col-lg-6'
          onInputChange={(value, field) => {
            onInputDataChange(value, field);
          }}
          className='pr-lg-3'
        />
        <Input
          {...form?.dataFine}
          label='Data fine'
          col='col-12 col-lg-6'
          onInputChange={(value, field) => {
            onInputDataChange(value, field);
          }}
          className='pl-lg-3'
        />
      </Form.Row>
    </Form>
  );
};

const form = newForm([
  newFormField({
    field: 'nome',
    type: 'text',
    id: 'project-name',
  }),
  newFormField({
    field: 'nomeBreve',
    type: 'text',
    id: 'short-name',
  }),
  newFormField({
    field: 'cup',
    type: 'text',
  }),
  newFormField({
    field: 'dataInizio',
    regex: RegexpType.DATE,
    type: 'date',
  }),
  newFormField({
    field: 'dataFine',
    regex: RegexpType.DATE,
    type: 'date',
  }),
]);

export default withFormHandler({ form }, FormProjectGeneralInfo);

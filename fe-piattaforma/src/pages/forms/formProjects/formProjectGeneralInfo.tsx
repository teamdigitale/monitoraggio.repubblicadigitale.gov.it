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
import { formatDate } from '../../../utils/common';
import { formFieldI, newForm, newFormField } from '../../../utils/formHelper';
import { RegexpType } from '../../../utils/validator';

interface ProgramInformationI {
  formDisabled?: boolean;
  sendNewValues?: (param?: { [key: string]: formFieldI['value'] }) => void;
  setIsFormValid?: (param?: boolean | undefined) => void;
  creation?: boolean;
  program?: { dataInizio: string; dataFine: string } | undefined;
}

interface FormProjectGeneralInfoInterface
  extends withFormHandlerProps,
    ProgramInformationI {
  intoModal?: boolean;
}
const FormProjectGeneralInfo: React.FC<FormProjectGeneralInfoInterface> = (
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
    program,
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
    setIsFormValid(isValidForm);
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form]);

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

  const bootClass = 'justify-content-between px-0 px-lg-5 mx-2';

  return (
    <Form id='form-project-general-info' className='mt-5' formDisabled={formDisabled}>
      <Form.Row className={bootClass}>
        {/* <Input
          {...form?.codice}
          col='col-12 col-lg-6'
          label='ID'
          onInputChange={(value, field) => {
            onInputDataChange(value, field);
          }}
        /> */}
        <Input
          {...form?.nome}
          required
          col='col-12'
          label='Nome progetto'
          onInputChange={(value, field) => {
            onInputDataChange(value, field);
          }}
        />
        <Input
          {...form?.nomeBreve}
          required
          col='col-12 col-lg-6'
          label='Nome breve'
          onInputChange={(value, field) => {
            onInputDataChange(value, field);
          }}
        />
        <Input
          {...form?.cup}
          label='CUP - Codice Unico Progetto'
          col='col-12 col-lg-6'
          onInputChange={(value, field) => {
            onInputDataChange(value, field);
          }}
        />
        <Input
          {...form?.dataInizio}
          required
          label='Data inizio'
          minimum={creation ? program?.dataInizio : undefined}
          maximum={
            creation
              ? form?.dataFine.value
                ? formatDate(form?.dataFine.value as string)
                : program?.dataFine
              : formatDate(form?.dataFine.value as string)
          }
          col='col-12 col-lg-6'
          onInputChange={(value, field) => {
            onInputDataChange(value, field);
          }}
        />
        <Input
          {...form?.dataFine}
          required
          label='Data fine'
          minimum={
            creation
              ? form?.dataInizio.value
                ? formatDate(form?.dataInizio.value as string)
                : program?.dataInizio
              : formatDate(form?.dataInizio.value as string)
          }
          maximum={creation ? program?.dataFine : undefined}
          col='col-12 col-lg-6'
          onInputChange={(value, field) => {
            onInputDataChange(value, field);
          }}
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

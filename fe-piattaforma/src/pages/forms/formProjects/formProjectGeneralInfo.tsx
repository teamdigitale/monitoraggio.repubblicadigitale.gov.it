import React, { useEffect } from 'react';
import { Form, Input } from '../../../components';
import withFormHandler, {
  withFormHandlerProps,
} from '../../../hoc/withFormHandler';
import { selectProjects } from '../../../redux/features/administrativeArea/administrativeAreaSlice';
import { useAppSelector } from '../../../redux/hooks';
import { formatDate } from '../../../utils/common';
import {
  formFieldI,
  FormHelper,
  FormI,
  newForm,
  newFormField,
} from '../../../utils/formHelper';
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
    form,
    onInputChange = () => ({}),
    sendNewValues = () => ({}),
    isValidForm,
    setIsFormValid = () => false,
    getFormValues = () => ({}),
    creation = false,
    updateForm = () => ({}),
    program,
  } = props;

  const formDisabled = !!props.formDisabled;

  const projectDetails: { [key: string]: string } | undefined =
    useAppSelector(selectProjects).detail?.dettagliInfoProgetto;
  const programProjectDetails =
    useAppSelector(selectProjects).detail?.dettagliInfoProgramma;
  const programDetails = programProjectDetails || program;

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formDisabled, form]);

  useEffect(() => {
    if (projectDetails && form) {
      const currentFormFieldList: formFieldI[] = Object.entries(projectDetails)
        .filter(
          ([key, _val]) => !key.includes('Target') && !key.includes('stato')
        )
        .map(([key, value]) =>
          newFormField({
            ...form[key],
            value: value,
          })
        );

      let filledForm: FormI = newForm(currentFormFieldList);

      if (
        programDetails?.dataInizio &&
        !(filledForm?.dataInizio?.minimum || filledForm?.dataInizio?.maximum)
      ) {
        filledForm = {
          ...filledForm,
          dataInizio: {
            ...filledForm.dataInizio,
            touched: false,
            minimum: formatDate(programDetails.dataInizio),
            maximum: formatDate(programDetails.dataFine),
          },
          dataFine: {
            ...filledForm.dataFine,
            touched: false,
            minimum: formatDate(programDetails.dataInizio),
            maximum: formatDate(programDetails.dataFine),
          },
        };
      }

      updateForm(filledForm);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectDetails]);

  const onInputDataChange = (
    value: formFieldI['value'],
    field?: formFieldI['field']
  ) => {
    onInputChange(value, field);
  };

  const onDateChange = (
    value: formFieldI['value'],
    field?: formFieldI['field']
  ) => {
    if (value && field && form) {
      let newForm = {
        ...form,
        [field]: {
          ...form[field],
          value,
        },
      };

      newForm = FormHelper.onInputChange(
        {
          ...newForm,
          dataInizio: {
            ...form.dataInizio,
            minimum: creation
              ? program?.dataInizio
              : programDetails
              ? formatDate(programDetails.dataInizio)
              : undefined,
            maximum: creation
              ? form?.dataFine.value
                ? formatDate(form?.dataFine.value as string)
                : program?.dataFine
              : formatDate(form?.dataFine.value as string),
          },
          dataFine: {
            ...form.dataFine,
            minimum: creation
              ? form?.dataInizio.value
                ? formatDate(form?.dataInizio.value as string)
                : program?.dataInizio
              : formatDate(form?.dataInizio.value as string),
            maximum: creation
              ? program?.dataFine
              : programDetails
              ? formatDate(programDetails.dataFine)
              : undefined,
          },
        },
        value,
        field
      );

      updateForm({
        ...newForm,
        dataInizio: {
          ...newForm.dataInizio,
          minimum: creation
            ? program?.dataInizio
            : programDetails
            ? formatDate(programDetails.dataInizio)
            : undefined,
          maximum: creation
            ? newForm?.dataFine.value
              ? formatDate(newForm?.dataFine.value as string)
              : program?.dataFine
            : formatDate(newForm?.dataFine.value as string),
        },
        dataFine: {
          ...newForm.dataFine,
          minimum: creation
            ? newForm?.dataInizio.value
              ? formatDate(newForm?.dataInizio.value as string)
              : program?.dataInizio
            : formatDate(newForm?.dataInizio.value as string),
          maximum: creation
            ? program?.dataFine
            : programDetails
            ? formatDate(programDetails.dataFine)
            : undefined,
        },
      });
    }
  };

  useEffect(() => {
    if (form?.dataInizio?.maximum || form?.dataInizio?.minimum)
      onDateChange(form?.dataInizio?.value, form?.dataInizio?.field);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form?.dataInizio?.maximum, form?.dataInizio?.minimum]);
  useEffect(() => {
    if (form?.dataFine?.maximum || form?.dataFine?.minimum)
      onDateChange(form?.dataFine?.value, form?.dataFine?.field);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form?.dataFine?.maximum, form?.dataFine?.minimum]);

  useEffect(() => {
    sendNewValues(getFormValues());
    setIsFormValid(isValidForm);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form]);

  useEffect(() => {
    if (
      creation &&
      form &&
      !projectDetails &&
      programDetails?.dataInizio &&
      !(form?.dataInizio?.minimum || form?.dataInizio?.maximum)
    ) {
      updateForm({
        ...form,
        dataInizio: {
          ...form.dataInizio,
          touched: false,
          minimum: formatDate(programDetails.dataInizio),
          maximum: formatDate(programDetails.dataFine),
        },
        dataFine: {
          ...form.dataFine,
          touched: false,
          minimum: formatDate(programDetails.dataInizio),
          maximum: formatDate(programDetails.dataFine),
        },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    programDetails?.dataInizio,
    form?.dataInizio?.maximum,
    form?.dataInizio?.minimum,
    creation,
  ]);

  const bootClass = 'justify-content-between px-0 px-lg-5 mx-2';

  return (
    <Form
      id='form-project-general-info'
      className='mt-5'
      formDisabled={formDisabled}
    >
      <Form.Row className={bootClass}>
        {formDisabled ? (
          <Input
            {...form?.id}
            col='col-12 col-lg-6'
            label='ID'
            onInputChange={onInputDataChange}
          />
        ) : (
          <span className='sr-only' />
        )}
        <Input
          {...form?.nome}
          required
          col='col-12 col-lg-6'
          label='Nome progetto'
          onInputChange={onInputDataChange}
        />
        <Input
          {...form?.nomeBreve}
          required
          col='col-12 col-lg-6'
          label='Nome breve'
          onInputChange={onInputDataChange}
        />
        <Input
          {...form?.cup}
          label='CUP - Codice Unico Progetto'
          col='col-12 col-lg-6'
          onInputChange={onInputDataChange}
        />
        <Input
          {...form?.dataInizio}
          required
          label='Data inizio'
          col='col-12 col-lg-6'
          onInputChange={onDateChange}
        />
        <Input
          {...form?.dataFine}
          required
          label='Data fine'
          col='col-12 col-lg-6'
          onInputChange={onDateChange}
        />
      </Form.Row>
    </Form>
  );
};

const form = newForm([
  newFormField({
    field: 'id',
    type: 'text',
    id: 'project-name',
  }),
  newFormField({
    field: 'nome',
    type: 'text',
    id: 'project-name',
    required: true,
  }),
  newFormField({
    field: 'nomeBreve',
    type: 'text',
    id: 'short-name',
    required: true,
  }),
  newFormField({
    field: 'cup',
    type: 'text',
  }),
  newFormField({
    field: 'dataInizio',
    regex: RegexpType.DATE,
    type: 'date',
    required: true,
  }),
  newFormField({
    field: 'dataFine',
    regex: RegexpType.DATE,
    type: 'date',
    required: true,
  }),
]);

export default withFormHandler({ form }, FormProjectGeneralInfo);

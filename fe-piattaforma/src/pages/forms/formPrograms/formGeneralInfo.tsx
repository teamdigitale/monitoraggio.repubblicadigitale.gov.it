import clsx from 'clsx';
import React, { useEffect } from 'react';
import { Form, Input, Select } from '../../../components';
import withFormHandler, {
  withFormHandlerProps,
} from '../../../hoc/withFormHandler';
import { selectPrograms } from '../../../redux/features/administrativeArea/administrativeAreaSlice';
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
const FormGeneralInfo: React.FC<FormEnteGestoreProgettoFullInterface> = (
  props
) => {
  const {
    setFormValues = () => ({}),
    form,
    updateForm = () => ({}),
    onInputChange,
    sendNewValues,
    isValidForm,
    setIsFormValid = () => false,
    getFormValues = () => ({}),
    creation = false,
    intoModal = false,
  } = props;
  const programDetails: { [key: string]: string } | undefined =
    useAppSelector(selectPrograms).detail.dettagliInfoProgramma;

  const formDisabled = !!props.formDisabled;

  // useEffect(() => {
  //   if (!creation) {
  //     dispatch(GetProgramDetail(entityId || ''));
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [creation]);

  /*

  useEffect(() => {
    if (formData) console.log(formData);
  }, [formData]);

  */

  useEffect(() => {
    setIsFormValid?.(isValidForm);
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form]);

  useEffect(() => {
    if (programDetails && !creation) {
      setFormValues(
        Object.fromEntries(
          Object.entries(programDetails).filter(
            ([key, _val]) => !key.includes('Target') && !key.includes('stato')
          )
        )
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [programDetails]);

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
          label='Nome programma'
          onInputChange={(value, field) => {
            onInputDataChange(value, field);
          }}
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
          {...form?.cup}
          label='CUP - Codice Unico Progetto'
          col='col-12 col-lg-6'
          onInputChange={(value, field) => {
            onInputDataChange(value, field);
          }}
          className='pl-lg-3'
        />
      </Form.Row>
      <Form.Row
        className={clsx('justify-content-between', 'px-0', 'px-lg-5', 'mx-5')}
      >
        <Input
          {...form?.bando}
          label='Bando'
          col='col-12 col-lg-6'
          onInputChange={(value, field) => {
            onInputDataChange(value, field);
          }}
          className='pr-lg-3'
        />
        {formDisabled ? (
          <Input
            {...form?.policy}
            label='Policy'
            col='col-12 col-lg-6'
            onInputChange={(value, field) => {
              onInputDataChange(value, field);
            }}
            className='pl-lg-3'
          />
        ) : (
          <Select
            {...form?.policy}
            value={form?.policy.value as string}
            col='col-12 col-lg-6'
            label='Policy *'
            placeholder='Inserisci policy'
            options={[
              { label: 'RFD', value: 'RFD' },
              { label: 'SCD', value: 'SCD' },
            ]}
            onInputChange={(value, field) => {
              onInputDataChange(value, field);
            }}
            wrapperClassName='mb-5'
            aria-label='policy'
            className='pl-lg-3'
          />
        )}
      </Form.Row>
      <Form.Row
        className={clsx('justify-content-between', 'px-0', 'px-lg-5', 'mx-5')}
      >
        <Input
          {...form?.dataInizio}
          label='Data inizio'
          type={'date'}
          col='col-12 col-lg-6'
          onInputChange={(value, field) => {
            onInputDataChange(value, field);
          }}
          className='pr-lg-3'
        />

        <Input
          {...form?.dataFine}
          label='Data fine'
          type={'date'}
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
    field: 'cup',
    type: 'text',
  }),
  newFormField({
    field: 'nome',
    type: 'text',
  }),
  newFormField({
    field: 'bando',
    type: 'text',
  }),
  newFormField({
    field: 'policy',
    type: 'text',
  }),
  newFormField({
    field: 'nomeBreve',
    type: 'text',
  }),
  newFormField({
    field: 'dataInizio',
    regex: RegexpType.DATE,
    required: true,
    type: 'date',
  }),
  newFormField({
    field: 'dataFine',
    regex: RegexpType.DATE,
    required: true,
    type: 'date',
  }),
]);

export default withFormHandler({ form }, FormGeneralInfo);

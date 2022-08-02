import React, { useEffect } from 'react';
import { Form, Input, Select } from '../../../components';
import withFormHandler, {
  withFormHandlerProps,
} from '../../../hoc/withFormHandler';
import { selectPrograms } from '../../../redux/features/administrativeArea/administrativeAreaSlice';
import { selectProfile } from '../../../redux/features/user/userSlice';
import { useAppSelector } from '../../../redux/hooks';
import { formFieldI, newForm, newFormField } from '../../../utils/formHelper';
import { RegexpType } from '../../../utils/validator';

interface ProgramInformationI {
  formDisabled?: boolean;
  sendNewValues?: (param?: { [key: string]: formFieldI['value'] }) => void;
  setIsFormValid?: (param?: boolean | undefined) => void;
  creation?: boolean;
  edit?: boolean;
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
    // setFormValues = () => ({}),
    form,
    updateForm = () => ({}),
    onInputChange,
    sendNewValues,
    isValidForm,
    setIsFormValid = () => false,
    getFormValues = () => ({}),
    creation = true,
    // intoModal = false,
    edit = false,
  } = props;
  const programDetails: { [key: string]: string } | undefined =
    useAppSelector(selectPrograms).detail.dettagliInfoProgramma;

  const formDisabled = !!props.formDisabled;

  const userRole = useAppSelector(selectProfile)?.codiceRuolo;

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
  }, [formDisabled]);

  useEffect(() => {
    if (programDetails) {
      // setFormValues(
      //   Object.fromEntries(
      //     Object.entries(programDetails).filter(
      //       ([key, _val]) => !key.includes('Target') && !key.includes('stato')
      //     )
      //   )
      // );

      if (form) {
        const currentFormFieldList: formFieldI[] = Object.entries(
          programDetails
        )
          .filter(
            ([key, _val]) => !key.includes('Target') && !key.includes('stato')
          )
          .map(([key, value]) =>
            newFormField({
              ...form[key],
              value: value,
            })
          );

        updateForm(newForm(currentFormFieldList));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [programDetails]);

  useEffect(() => {
    if (userRole && form && creation) {
      if (userRole === 'DSCU') onInputDataChange('SCD', 'policy');
    }
  }, [userRole]);

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

  // const updateRequiredFields = () => {
  //   if (form) {
  //     const newFormList: formFieldI[] = [];
  //     const values = getFormValues();
  //     Object.keys(values).forEach((field) => {
  //       newFormList.push(
  //         newFormField({
  //           ...form[field],
  //           field: field,
  //           id: intoModal ? `modal-${field}` : field,
  //         })
  //       );
  //     });
  //     updateForm(newForm(newFormList));
  //   }
  // };

  // useEffect(() => {
  //   updateRequiredFields();
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [intoModal]);

  //  className={clsx('justify-content-between', 'px-0', 'px-lg-5', 'mx-5')}

  const bootClass = 'justify-content-between px-0 px-lg-5 mx-2';

  return (
    <Form className='mt-5' formDisabled={formDisabled}>
      <Form.Row className={bootClass}>
        <Input
          {...form?.codice}
          required
          col='col-12 col-lg-6'
          label='ID'
          onInputChange={(value, field) => {
            onInputDataChange(value, field);
          }}
          className='pr-lg-3'
        />

        <Input
          {...form?.nome}
          required
          col='col-12 col-lg-6'
          label='Nome programma'
          onInputChange={(value, field) => {
            onInputDataChange(value, field);
          }}
          className='pl-lg-3'
        />
      </Form.Row>
      <Form.Row className={bootClass}>
        <Input
          {...form?.nomeBreve}
          required
          col='col-12 col-lg-6'
          label='Nome breve'
          onInputChange={(value, field) => {
            onInputDataChange(value, field);
          }}
          className='pr-lg-3'
        />
        {formDisabled ? (
          <Input
            {...form?.policy}
            label='Intervento'
            col='col-12 col-lg-6'
            onInputChange={(value, field) => {
              onInputDataChange(value, field);
            }}
            className='pl-lg-3'
          />
        ) : (
          <Select
            isDisabled={(!creation && !edit) || userRole === 'DSCU'}
            {...form?.policy}
            required
            value={form?.policy.value as string}
            col='col-12 col-lg-6'
            label='Intervento'
            placeholder='Inserisci intervento'
            options={[
              { label: 'RFD', value: 'RFD' },
              { label: 'SCD', value: 'SCD' },
            ]}
            onInputChange={(value, field) => {
              onInputDataChange(value, field);
            }}
            wrapperClassName='mb-5'
            aria-label='intervento'
            className='pl-lg-3'
          />
        )}
      </Form.Row>
      <Form.Row className={bootClass}>
        {form?.policy?.value === 'SCD' || !form?.policy?.value ? (
          <Input
            {...form?.bando}
            label='Bando'
            col='col-12 col-lg-6'
            onInputChange={(value, field) => {
              onInputDataChange(value, field);
            }}
            className='pr-lg-3'
          />
        ) : (
          <span></span>
        )}
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
      <Form.Row className={bootClass}>
        <Input
          {...form?.dataInizio}
          required
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
          required
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
    field: 'codice',
    type: 'text',
    id: 'codice',
  }),
  newFormField({
    field: 'stato',
    type: 'text',
    id: 'stato',
  }),
  newFormField({
    field: 'cup',
    type: 'text',
    id: 'cup',
  }),
  newFormField({
    field: 'nome',
    type: 'text',
    id: 'nome',
  }),
  newFormField({
    field: 'bando',
    type: 'text',
    id: 'bando',
  }),
  newFormField({
    field: 'policy',
    type: 'text',
    id: 'policy',
  }),
  newFormField({
    field: 'nomeBreve',
    type: 'text',
    id: 'nomeBreve',
  }),
  newFormField({
    field: 'dataInizio',
    regex: RegexpType.DATE,
    required: true,
    type: 'date',
    id: 'dataInizio',
  }),
  newFormField({
    field: 'dataFine',
    regex: RegexpType.DATE,
    required: true,
    type: 'date',
    id: 'dataFine',
  }),
]);

export default withFormHandler({ form }, FormGeneralInfo);

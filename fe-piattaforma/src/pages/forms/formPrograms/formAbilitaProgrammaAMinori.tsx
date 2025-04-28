import React, { useEffect } from 'react';
import { Form, Input } from '../../../components';
import withFormHandler, {
  withFormHandlerProps,
} from '../../../hoc/withFormHandler';
import { selectPrograms } from '../../../redux/features/administrativeArea/administrativeAreaSlice';
import { useAppSelector } from '../../../redux/hooks';
import {
  formFieldI,
  newForm,
  newFormField,
} from '../../../utils/formHelper';
import { RegexpType } from '../../../utils/validator';

interface ProgramInformationI {
  formDisabled?: boolean;
  sendNewValues?: (param?: { [key: string]: formFieldI['value'] }) => void;
  setIsFormValid?: (param?: boolean | undefined) => void;
  creation?: boolean;
  edit?: boolean;
  legend?: string | undefined;
  // idProgramma?: string;
  initialValues?: { [key: string]: formFieldI['value'] };
}

interface FormEnteGestoreProgettoFullInterface
  extends withFormHandlerProps,
    ProgramInformationI {
  intoModal?: boolean;
}
const FormAbilitaProgrammaAMinori: React.FC<FormEnteGestoreProgettoFullInterface> = (
  props
) => {
  const {
    form,
    updateForm = () => ({}),
    onInputChange = () => ({}),
    sendNewValues = () => ({}),
    isValidForm,
    setIsFormValid = () => false,
    getFormValues = () => ({}),
    formDisabled = false,
    legend = '',
    // idProgramma, //utilizzato con la modale in fase di abilita programma
    initialValues //utilizzato con la modale in fase di modifica abilitazione
  } = props;
  const programDetails: { [key: string]: string } | undefined =
    useAppSelector(selectPrograms).detail.dettagliInfoProgramma;    

  useEffect(() => {
    setIsFormValid(isValidForm);    
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formDisabled]);

  useEffect(() => {
    if (programDetails && form) {     
      const formattedDataDecorrenza = initialValues?.dataDecorrenza
      ? typeof initialValues.dataDecorrenza === 'string'
        ? initialValues.dataDecorrenza.split('/').reverse().join('-') // Cambia formato da DD/MM/YYYY a YYYY-MM-DD
        : ''
      : '';       
      const currentFormFieldList: formFieldI[] = Object.entries({
        ...programDetails,
        // id: idProgramma ? idProgramma : initialValues?.id_prog ?? '',
        id: programDetails?.codice ?? '',
        dataDecorrenza: formattedDataDecorrenza
      }).map(([key, value]) =>
        newFormField({
          ...form[key],
          value: value || '',
        })
      );

      updateForm(newForm(currentFormFieldList));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [programDetails]);

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

    if (field === 'dataDecorrenza' && form?.dataFine?.value) {
      const dataDecorrenzaDate = new Date(value as string);
      const dataFineDate = new Date(form.dataFine.value as string);
      const dataInizioProgramma = new Date(programDetails?.dataInizio as string);
      
      if (dataDecorrenzaDate >= dataFineDate || dataDecorrenzaDate < dataInizioProgramma) {        
        newForm = {
        ...newForm,
        [field]: {
          ...newForm[field],
          valid: false,
        },
        };
      } else {
        newForm = {
        ...newForm,
        [field]: {
          ...newForm[field],
          valid: true,
        },
        };
      }
    }

    updateForm(newForm);
    }
  };
  
  useEffect(() => {
    sendNewValues(getFormValues());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form]);

  const bootClass = 'justify-content-between px-0 px-lg-5 mx-2';

  return (
    <Form
      legend={legend}
      id='form-general-info'
      customMargin='mb-3 pb-3 ml-3'
    >
      <Form.Row className={bootClass}>
        <Input
          {...form?.nome}
          required
          col='col-12 col-lg-6'
          label='Nome programma'
          onInputChange={onInputDataChange}
          disabled={formDisabled}
        />
        <Input
          {...form?.id}
          required
          col='col-12 col-lg-6'
          label='ID programma'
          onInputChange={onInputDataChange}
          disabled={formDisabled}
        />
        <Input
          {...form?.policy}
          label='Intervento'
          col='col-12 col-lg-6'
          onInputChange={onInputDataChange}
          disabled={formDisabled}
        />
        <Input
          {...form?.dataFine}
          required
          label='Data fine programma'
          type='date'
          col='col-12 col-lg-6'
          onInputChange={onDateChange}
          disabled={formDisabled}
        />
        <Input
          {...form?.dataDecorrenza}
          required
          disabled={false}
          label='Data di decorrenza dell’abilitazione'
          type='date'
          col='col-12 col-lg-6 mt-5'
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
    id: 'id',
    required: true,
  }),
  newFormField({
    field: 'nome',
    type: 'text',
    id: 'nome',
    required: true,
  }),
  newFormField({
    field: 'policy',
    type: 'text',
    id: 'policy',
    required: true,
  }),
  newFormField({
    field: 'dataFine',
    regex: RegexpType.DATE,
    required: true,
    type: 'date',
    id: 'dataFine',
  }),
  newFormField({
    field: 'dataDecorrenza',
    required: true,
    type: 'date',
    id: 'dataDecorrenza',
  }),
]);

export default withFormHandler({ form }, FormAbilitaProgrammaAMinori);

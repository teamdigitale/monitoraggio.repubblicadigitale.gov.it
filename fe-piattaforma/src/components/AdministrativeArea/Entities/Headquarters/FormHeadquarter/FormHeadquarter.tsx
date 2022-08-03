import React, { useEffect } from 'react';
// import { useDispatch } from 'react-redux';
import { Form, Input, Select } from '../../../..';
import withFormHandler, {
  withFormHandlerProps,
} from '../../../../../hoc/withFormHandler';
import { selectHeadquarters } from '../../../../../redux/features/administrativeArea/administrativeAreaSlice';
// import { GetHeadquarterDetails } from '../../../../../redux/features/administrativeArea/headquarters/headquartersThunk';
import { useAppSelector } from '../../../../../redux/hooks';
import {
  formFieldI,
  newForm,
  newFormField,
} from '../../../../../utils/formHelper';

interface ProgramInformationI {
  formDisabled?: boolean;
  sendNewValues?: (param?: { [key: string]: formFieldI['value'] }) => void;
  setIsFormValid?: (param: boolean | undefined) => void;
  creation?: boolean;
}

interface FormEnteGestoreProgettoFullInterface
  extends withFormHandlerProps,
    ProgramInformationI {}

const form = newForm([
  newFormField({
    field: 'id',
    id: 'id',
  }),
  newFormField({
    field: 'nome',
    id: 'nome',
  }),
  newFormField({
    field: 'serviziErogati',
    id: 'servizi-erogati',
  }),
  newFormField({
    field: 'enteDiRiferimento',
    id: 'ente-di-riferimento',
  }),
]);

const Sedi: React.FC<FormEnteGestoreProgettoFullInterface> = (props) => {
  const {
    setFormValues = () => ({}),
    form,
    onInputChange = () => ({}),
    sendNewValues = () => ({}),
    isValidForm,
    setIsFormValid = () => ({}),
    getFormValues = () => ({}),
    clearForm = () => ({}),
    updateForm = () => ({}),
    // creation = false,
    formDisabled,
  } = props;

  const formData: { [key: string]: string } | undefined =
    useAppSelector(selectHeadquarters)?.detail?.dettagliInfoSede;
  // const dispatch = useDispatch();

  // useEffect(() => {
  //   if (!creation) {
  //     dispatch(GetHeadquarterDetails('idSede'));
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [creation]);

  useEffect(() => {
    if (formData) {
      setFormValues(formData);
    } else {
      clearForm();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData]);

  useEffect(() => {
    sendNewValues(getFormValues());
  }, [form]);

  const onInputDataChange = (
    value: formFieldI['value'],
    field?: formFieldI['field']
  ) => {
    onInputChange(value, field);
    setIsFormValid(isValidForm);
  };

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
            { ...value, disabled: formDisabled ? formDisabled : false },
          ])
        ),
        true
      );
    }
  }, [formDisabled, form]);

  return (
    <Form className='mt-5' formDisabled={formDisabled ? formDisabled : false}>
      <Form.Row className='justify-content-between'>
        {formDisabled ? (
          <Input
            {...form?.id}
            required
            label='ID'
            col='col-12 col-lg-6'
            onInputChange={onInputDataChange}
            // placeholder='Inserisci nome programma'
          />
        ) : (
          <span></span>
        )}
        <Input
          {...form?.nome}
          required
          label='Nome Sede'
          col='col-12 col-lg-6'
          onInputChange={onInputDataChange}
          // placeholder='Inserisci nome programma'
        />
        {/* Facilitazione, Formazione, Facilitazione e Formazione */}
        {formDisabled ? (
          <Input
            {...form?.serviziErogati}
            label='Servizi Erogati'
            col='col-12 col-lg-6'
            onInputChange={(value, field) => {
              onInputDataChange(value, field);
            }}
          />
        ) : (
          <Select
            {...form?.serviziErogati}
            required
            value={form?.serviziErogati.value as string}
            col='col-12 col-lg-6'
            label='Servizi Erogati'
            options={[
              { label: 'Facilitazione', value: 'Facilitazione' },
              { label: 'Formazione', value: 'Formazione' },
              {
                label: 'Facilitazione e Formazione',
                value: 'Facilitazione e Formazione',
              },
            ]}
            onInputChange={onInputDataChange}
            wrapperClassName='mb-5 pr-lg-3'
            aria-label='servizi'
          />
        )}
        {formDisabled ? (
          <Input
            {...form?.enteDiRiferimento}
            required
            label='Ente di riferimento'
            col='col-12 col-lg-6'
            onInputChange={onInputDataChange}
            placeholder='Inserisci ente di riferimento'
          />
        ) : (
          <span></span>
        )}
      </Form.Row>
    </Form>
  );
};

export default withFormHandler({ form }, Sedi);

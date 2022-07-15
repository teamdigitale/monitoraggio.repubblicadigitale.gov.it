import React, { useEffect } from 'react';
// import { useDispatch } from 'react-redux';
import { Form, Input } from '../../../..';
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
  }),
  newFormField({
    field: 'nome',
  }),
  newFormField({
    field: 'serviziErogati',
  }),
  newFormField({
    field: 'enteDiRiferimento',
  }),
]);

const Sedi: React.FC<FormEnteGestoreProgettoFullInterface> = (props) => {
  const {
    setFormValues = () => ({}),
    form,
    onInputChange,
    sendNewValues,
    isValidForm,
    setIsFormValid,
    getFormValues,
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
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData]);

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    () => {};
  }, []);

  const onInputDataChange = (
    value: formFieldI['value'],
    field?: formFieldI['field']
  ) => {
    onInputChange?.(value, field);
    sendNewValues?.(getFormValues?.());
    setIsFormValid?.(isValidForm);
  };

  return (
    <Form
      className='my-5 mx-5'
      formDisabled={formDisabled ? formDisabled : false}
    >
      <Form.Row className='justify-content-between'>
        <Input
          {...form?.id}
          label='ID'
          col='col-12 col-lg-6'
          onInputChange={onInputDataChange}
          placeholder='Inserisci nome programma'
        />
        <Input
          {...form?.nome}
          label='Nome'
          col='col-12 col-lg-6'
          onInputChange={onInputDataChange}
          placeholder='Inserisci nome programma'
        />
        <Input
          {...form?.serviziErogati}
          label='Servizi Erogati'
          col='col-12 col-lg-6'
          onInputChange={onInputDataChange}
        />
        <Input
          {...form?.enteDiRiferimento}
          label='Ente di riferimento'
          col='col-12 col-lg-6'
          onInputChange={onInputDataChange}
          placeholder='Inserisci ente di riferimento'
        />
      </Form.Row>
    </Form>
  );
};

export default withFormHandler({ form }, Sedi);

import React, { useEffect, useState } from 'react';
import withFormHandler, {
  withFormHandlerProps,
} from '../../../../../hoc/withFormHandler';
import FormUser from '../../../../../pages/forms/formUser';
import { selectUsers } from '../../../../../redux/features/administrativeArea/administrativeAreaSlice';
import { useAppSelector } from '../../../../../redux/hooks';
import {
  formFieldI,
  newForm,
  newFormField,
} from '../../../../../utils/formHelper';
import Input from '../../../../Form/input';
import Select from '../../../../Form/select';
import { contractTypes } from '../../../../../pages/administrator/AdministrativeArea/Entities/utils';

interface FacilitatorI {
  creation?: boolean;
  formDisabled?: boolean;
  sendNewValues?: (param?: { [key: string]: formFieldI['value'] }) => void;
  setIsFormValid?: (param: boolean | undefined) => void;
  legend?: string | undefined;
  initialFiscalCode?: string;
}

interface FacilitatorFormI extends FacilitatorI, withFormHandlerProps {}

const FormFacilitator: React.FC<FacilitatorFormI> = (props) => {
  const {
    setFormValues = () => ({}),
    form,
    onInputChange = () => ({}),
    sendNewValues = () => ({}),
    isValidForm,
    setIsFormValid = () => ({}),
    getFormValues = () => ({}),
    creation = false,
    formDisabled = false,
    legend = '',
    initialFiscalCode = '',
  } = props;

  const [newFormValues, setNewFormValues] = useState<{
    [key: string]: formFieldI['value'];
  }>({});
  const userDetails = useAppSelector(selectUsers).detail?.dettaglioUtente;
  const [isFormUserValid, setIsFormUserValid] = useState<boolean>(false);

  useEffect(() => {
    if (form && newFormValues)
      sendNewValues({ ...newFormValues, ...getFormValues() });
    setIsFormValid(isValidForm && isFormUserValid);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form, newFormValues]);

  useEffect(() => {
    if (userDetails) {
      setFormValues(userDetails);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userDetails]);

  const onInputDataChange = (
    value: formFieldI['value'],
    field?: formFieldI['field']
  ) => {
    onInputChange(value, field);
    setIsFormValid(isValidForm && isFormUserValid);
  };

  return (
    <FormUser
      creation={creation}
      formDisabled={formDisabled}
      sendNewValues={(newData?: { [key: string]: formFieldI['value'] }) =>
        setNewFormValues({ ...newData })
      }
      setIsFormValid={(value: boolean | undefined) =>
        setIsFormUserValid(!!value)
      }
      fieldsToHide={['ruolo', 'mansione', 'tipoContratto']}
      legend={legend}
      initialFiscalCode={initialFiscalCode}
    >
      {formDisabled ? (
        <Input
          {...form?.tipoContratto}
          label='Tipo di Contratto'
          col='col-12 col-lg-6'
          // placeholder='Tipologia di contratto'
          onInputChange={(value, field) => {
            onInputDataChange(value, field);
          }}
        />
      ) : (
        <Select
          {...form?.tipoContratto}
          value={form?.tipoContratto.value as string}
          col='col-12 col-lg-6'
          label='Tipo di Contratto'
          placeholder='Seleziona tipo di contratto'
          position='top'
          options={contractTypes}
          onInputChange={onInputDataChange}
          wrapperClassName='mb-5'
          aria-label='contratto'
        />
      )}
    </FormUser>
  );
};

const form = newForm([
  newFormField({
    field: 'tipoContratto',
    id: 'tipoContratto',
  }),
]);

export default withFormHandler({ form }, FormFacilitator);

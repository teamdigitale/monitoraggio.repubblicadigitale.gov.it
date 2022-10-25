import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { Form, Input, Select } from '../../components';
import withFormHandler, {
  withFormHandlerProps,
} from '../../hoc/withFormHandler';
import { selectUsers } from '../../redux/features/administrativeArea/administrativeAreaSlice';
import { GetUserDetails } from '../../redux/features/administrativeArea/user/userThunk';
import { useAppSelector } from '../../redux/hooks';
import {
  CommonFields,
  formFieldI,
  newForm,
  newFormField,
} from '../../utils/formHelper';
import { RegexpType } from '../../utils/validator';
import { selectRolesList } from '../../redux/features/roles/rolesSlice';
import { GetRolesListValues } from '../../redux/features/roles/rolesThunk';
import {
  contractTypes,
  userRoles,
} from '../administrator/AdministrativeArea/Entities/utils';

interface UserInformationI {
  /*formData:
    | {
        name?: string;
        lastName?: string;
        role?: string;
        userId?: string;
        fiscalCode?: string;
        email?: string;
        phone?: string;
      }
    | undefined;*/
  formDisabled?: boolean;
  sendNewValues?: (param?: { [key: string]: formFieldI['value'] }) => void;
  setIsFormValid?: (param: boolean | undefined) => void;
  creation?: boolean;
  fieldsToHide?: ('ruolo' | 'mansione' | 'tipoContratto')[];
}

interface UserFormI extends withFormHandlerProps, UserInformationI {}
const FormUser: React.FC<UserFormI> = (props) => {
  const {
    setFormValues = () => ({}),
    form,
    isValidForm,
    onInputChange = () => ({}),
    sendNewValues = () => ({}),
    setIsFormValid = () => ({}),
    getFormValues = () => ({}),
    updateForm = () => ({}),
    clearForm = () => ({}),
    creation = false,
    fieldsToHide = [],
    children,
  } = props;

  const dispatch = useDispatch();
  const { userId } = useParams();
  const userDetails = useAppSelector(selectUsers)?.detail;
  const formData = userDetails?.dettaglioUtente;
  const ruoliList = useAppSelector(selectRolesList);
  const [showTipoContratto, setShowTipoContratto] = useState(false);
  const [showMansione, setShowMansione] = useState(false);

  const formDisabled = !!props.formDisabled;

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
    if (!creation) {
      userId && dispatch(GetUserDetails(userId));
    } else if (!fieldsToHide.includes('ruolo')) {
      dispatch(GetRolesListValues({ tipologiaRuoli: 'NP' }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [creation]);

  useEffect(() => {
    if (formData) {
      setFormValues(formData);
    } else {
      clearForm();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData]);

  useEffect(() => {
    setShowTipoContratto(
      !fieldsToHide.includes('tipoContratto') &&
        !!(userDetails?.dettaglioRuolo || []).filter(
          ({ codiceRuolo }: { codiceRuolo: string }) =>
            codiceRuolo === userRoles.FAC || codiceRuolo === userRoles.VOL
        ).length
    );
    setShowMansione(
      !fieldsToHide.includes('mansione') &&
        (creation ||
          !!(userDetails?.dettaglioRuolo || []).filter(
            ({ codiceRuolo }: { codiceRuolo: string }) =>
              codiceRuolo === userRoles.REG ||
              codiceRuolo === userRoles.REGP ||
              codiceRuolo === userRoles.DEG ||
              codiceRuolo === userRoles.DEGP ||
              codiceRuolo === userRoles.REPP ||
              codiceRuolo === userRoles.DEPP
          ).length)
    );
  }, [userDetails, fieldsToHide.length, creation]);

  useEffect(() => {
    setIsFormValid(isValidForm);
    sendNewValues(getFormValues());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form]);

  const bootClass = 'justify-content-between px-0 px-lg-5 mx-2';

  return (
    <Form id='form-user' className='mt-5 mb-0' formDisabled={formDisabled}>
      <Form.Row className={bootClass}>
        <>
          <Input
            {...form?.nome}
            required
            col='col-lg-6 col-12'
            label='Nome'
            // placeholder='Inserisci nome utente'
            onInputChange={onInputChange}
          />
          <Input
            {...form?.cognome}
            required
            col='col-12 col-lg-6'
            label='Cognome'
            // placeholder='Inserisci cognome utente'
            onInputChange={onInputChange}
          />
          {formDisabled ? (
            <Input {...form?.id} col='col-12 col-lg-6' label='ID' />
          ) : null}
          {creation && !fieldsToHide.includes('ruolo') ? (
            <Select
              {...form?.ruolo}
              value={form?.ruolo.value as string}
              col='col-12 col-lg-6'
              label='Ruolo'
              placeholder='Seleziona ruolo'
              options={ruoliList.map((role) => ({
                value: role.codiceRuolo,
                label: role.nomeRuolo,
              }))}
              onInputChange={onInputChange}
              wrapperClassName='mb-5'
              aria-label='ruolo'
              required
            />
          ) : null}
          <Input
            {...form?.codiceFiscale}
            required
            label='Codice fiscale'
            col='col-12 col-lg-6'
            // placeholder='Inserisci codice fiscale'
            onInputChange={onInputChange}
          />
          <Input
            {...form?.email}
            label='Indirizzo email'
            col='col-12 col-lg-6'
            // placeholder='Inserisci email'
            onInputChange={onInputChange}
          />
          <Input
            {...form?.telefono}
            //required
            col='col-12 col-lg-6'
            label='Telefono'
            // placeholder='Inserisci telefono'
            onInputChange={onInputChange}
          />
          {showMansione ? (
            <Input
              {...form?.mansione}
              label='Posizione Lavorativa'
              col='col-12 col-lg-6'
              // placeholder='Inserisci bio'
              onInputChange={onInputChange}
            />
          ) : (
            <span />
          )}
          {showTipoContratto ? (
            formDisabled ? (
              <Input
                {...form?.tipoContratto}
                label='Tipo di Contratto'
                col='col-12 col-lg-6'
                // placeholder='Tipologia di contratto'
                onInputChange={onInputChange}
              />
            ) : (
              <Select
                {...form?.tipoContratto}
                value={form?.tipoContratto?.value as string}
                col='col-12 col-lg-6'
                label='Tipo di Contratto'
                placeholder='Seleziona tipo di contratto'
                options={contractTypes}
                onInputChange={onInputChange}
                wrapperClassName='mb-5'
                aria-label='contratto'
                position='top'
              />
            )
          ) : (
            <span />
          )}
          {/*<Input
          {...form?.authorityRef}
          col='col-12 col-lg-6'
          label='Ente di riferimento'
          placeholder='Inserisci ente di riferimento'
          onInputChange={onInputChange}
        />*/}
          {children}
        </>
      </Form.Row>
    </Form>
  );
};

const form = newForm([
  newFormField({
    ...CommonFields.NOME,
    field: 'nome',
    id: 'nome',
    required: true,
  }),
  newFormField({
    ...CommonFields.COGNOME,
    field: 'cognome',
    id: 'cognome',
    required: true,
  }),
  newFormField({
    field: 'ruolo',
    id: 'ruolo',
    type: 'select',
    //required: true,
  }),
  newFormField({
    field: 'id',
    id: 'id',
  }),
  newFormField({
    ...CommonFields.CODICE_FISCALE,
    field: 'codiceFiscale',
    id: 'codiceFiscale',
    required: true,
  }),
  newFormField({
    ...CommonFields.EMAIL,
    field: 'email',
    id: 'email',
    required: true,
  }),
  newFormField({
    field: 'telefono',
    id: 'telefono',
    regex: RegexpType.TELEPHONE,
    //required: true,
    minimum: 9,
    maximum: 20,
  }),
  /*
  newFormField({
    field: 'authorityRef',
    id: 'authorityRef',
  }),
  */
  newFormField({
    field: 'mansione',
    id: 'mansione',
    //required: true,
    maximum: 160,
  }),
  newFormField({
    field: 'tipoContratto',
    id: 'tipoContratto',
  }),
]);
export default withFormHandler({ form }, FormUser);

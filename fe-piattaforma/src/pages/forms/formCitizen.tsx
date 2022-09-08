import React, { useEffect } from 'react';
import {Form, Input, PrefixPhone, Select} from '../../components';
import CheckboxGroup from '../../components/Form/checkboxGroup';
import withFormHandler, {
  withFormHandlerProps,
} from '../../hoc/withFormHandler';
import {
  CittadinoInfoI,
  selectCitizenSearchResponse,
  selectEntityDetail,
} from '../../redux/features/citizensArea/citizensAreaSlice';
// import { selectDevice } from '../../redux/features/app/appSlice';
import { useAppSelector } from '../../redux/hooks';
import { formatDate } from '../../utils/datesHelper';
import {
  CommonFields,
  formFieldI,
  FormHelper,
  newForm,
  newFormField,
} from '../../utils/formHelper';
import { RegexpType } from '../../utils/validator';
import { citizenFormDropdownOptions } from './constantsFormCitizen';

export interface FormCitizenI {
  formDisabled?: boolean;
  sendNewValues?: (param?: { [key: string]: formFieldI['value'] }) => void;
  setIsFormValid?: (param: boolean) => void;
  creation?: boolean;
  info?: CittadinoInfoI;
}

interface FormEnteGestoreProgettoFullInterface
  extends withFormHandlerProps,
    FormCitizenI {}

const FormCitizen: React.FC<FormEnteGestoreProgettoFullInterface> = (props) => {
  const {
    // setFormValues = () => ({}),
    form,
    onInputChange = () => ({}),
    sendNewValues,
    // isValidForm,
    setIsFormValid = () => ({}),
    getFormValues,
    setFormValues = () => ({}),
    updateForm = () => ({}),
    //creation = false,
  } = props;

  // const device = useAppSelector(selectDevice);
  const formDisabled = !!props.formDisabled;
  const formData: {
    [key: string]: formFieldI['value'] | undefined;
  } = useAppSelector(selectEntityDetail)?.dettaglioCittadino;
  const formDataService: CittadinoInfoI = useAppSelector(
    selectCitizenSearchResponse
  )?.[0];

  useEffect(() => {
    if (formData) {
      const values = { ...formData };
      const formattedDate = formatDate(
        formData?.dataConferimentoConsenso?.toString(),
        'snakeDate'
      );
      if (formattedDate) values.dataConferimentoConsenso = formattedDate;
      if(values.tipoConferimentoConsenso === '' || values.tipoConferimentoConsenso === null) values.tipoConferimentoConsenso = 'ONLINE';
      setFormValues(values);
    }
    if (formDataService) {
      const values = { ...formDataService };
      setFormValues(values);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData]);

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

  const handleCheckboxChange = (
    value?: formFieldI['value'],
    field?: formFieldI['field']
  ) => {
    if (field === 'codiceFiscaleNonDisponibile') {
      const tmpForm = FormHelper.onInputChange(form, value, field);
      const referenceBoolean = !tmpForm?.codiceFiscaleNonDisponibile?.value;
      tmpForm.codiceFiscale.required = referenceBoolean;
      tmpForm.tipoDocumento.required = !referenceBoolean;
      tmpForm.numeroDocumento.required = !referenceBoolean;
      updateForm(tmpForm);
    }
  };

  const onInputDataChange = (
    value: formFieldI['value'],
    field?: formFieldI['field']
  ) => {
    onInputChange?.(value, field);
    setIsFormValid?.(FormHelper.isValidForm(form));
  };

  useEffect(() => {
    sendNewValues?.(getFormValues?.());
    setIsFormValid?.(FormHelper.isValidForm(form));
  }, [form]);

  return (
    <Form id='form-citizen' className='mt-5' formDisabled={formDisabled}>
      <Form.Row>
        <Input
          {...form?.nome}
          col='col-12 col-lg-6'
          placeholder={`Inserisci ${form?.nome?.label?.toLowerCase()}`}
          onInputChange={onInputDataChange}
        />
        <Input
          {...form?.cognome}
          col='col-12 col-lg-6'
          placeholder={`Inserisci ${form?.cognome?.label?.toLowerCase()}`}
          onInputChange={onInputDataChange}
        />
        <Input
          {...form?.codiceFiscale}
          col='col-12 col-lg-6'
          label='Codice fiscale'
          placeholder='Inserisci codice fiscale'
          onInputChange={onInputDataChange}
        />
        <CheckboxGroup     // TODO: fix accessibilità onkeydown
          {...form?.codiceFiscaleNonDisponibile}
          className='col-12 col-lg-6'
          options={citizenFormDropdownOptions['codiceFiscaleNonDisponibile']}
          onInputChange={handleCheckboxChange}
          noLabel
          classNameLabelOption='pl-5'
        />
        <Select
          {...form?.tipoDocumento}
          placeholder={`Inserisci ${form?.tipoDocumento?.label?.toLowerCase()}`}
          onInputChange={onInputDataChange}
          col='col-12 col-lg-6'
          options={citizenFormDropdownOptions['tipoDocumento']}
          isDisabled={formDisabled}
          wrapperClassName='mb-5 pr-lg-3'
        />
        <Input
          {...form?.numeroDocumento}
          col='col-12 col-lg-6'
          placeholder={`Inserisci ${form?.numeroDocumento?.label?.toLowerCase()}`}
          onInputChange={onInputDataChange}
        />
        <Select
          {...form?.genere}
          placeholder={`Inserisci ${form?.genere?.label?.toLowerCase()}`}
          onInputChange={onInputDataChange}
          col='col-12 col-lg-6'
          options={citizenFormDropdownOptions['genere']}
          isDisabled={formDisabled}
          wrapperClassName='mb-5 pr-lg-3'
        />
        <Input
          {...form?.annoNascita}
          col='col-12 col-lg-6'
          placeholder={`Inserisci ${form?.annoNascita?.label?.toLowerCase()}`}
          onInputChange={onInputDataChange}
        />
        <Select
          {...form?.titoloStudio}
          placeholder={`Seleziona ${form?.titoloStudio?.label?.toLowerCase()}`}
          onInputChange={onInputDataChange}
          col='col-12 col-lg-6'
          options={citizenFormDropdownOptions['titoloStudio']}
          isDisabled={formDisabled}
          wrapperClassName='mb-5 pr-lg-3'
        />
        <Select
          {...form?.statoOccupazionale}
          placeholder={`Seleziona ${form?.statoOccupazionale?.label?.toLowerCase()}`}
          onInputChange={onInputDataChange}
          col='col-12 col-lg-6'
          options={citizenFormDropdownOptions['statoOccupazionale']}
          isDisabled={formDisabled}
          wrapperClassName='mb-5 pr-lg-3'
        />
        <Select
          {...form?.cittadinanza}
          placeholder={`Inserisci ${form?.cittadinanza?.label?.toLowerCase()}`}
          onInputChange={onInputDataChange}
          col='col-12 col-lg-6'
          options={citizenFormDropdownOptions['cittadinanza']}
          isDisabled={formDisabled}
          wrapperClassName='mb-5 pr-lg-3'
        />
        <Input
          {...form?.comuneDomicilio}
          col='col-12 col-lg-6'
          placeholder={`Inserisci ${form?.comuneDomicilio?.label?.toLowerCase()}`}
          onInputChange={onInputDataChange}
        />
        <Select
          {...form?.categoriaFragili}
          placeholder={`Inserisci ${form?.categoriaFragili?.label?.toLowerCase()}`}
          onInputChange={onInputDataChange}
          col='col-12 col-lg-6'
          options={citizenFormDropdownOptions['categoriaFragili']}
          isDisabled={formDisabled}
          wrapperClassName='mb-5 pr-lg-3'
        />
        <Input
          {...form?.email}
          col='col-12 col-lg-6'
          placeholder={`Inserisci ${form?.email?.label?.toLowerCase()}`}
          onInputChange={onInputDataChange}
          required
        />

        <PrefixPhone
          {...form?.prefisso}
          placeholder={`Inserisci ${form?.prefisso?.label?.toLowerCase()}`}
          onInputChange={onInputDataChange}
        />
        <Input
          {...form?.numeroCellulare}
          col='col-8 col-lg-4'
          placeholder={`Inserisci ${form?.numeroCellulare?.label?.toLowerCase()}`}
          onInputChange={onInputDataChange}
        />
        <Input
          {...form?.telefono}
          col='col-12 col-lg-6'
          placeholder={`Inserisci ${form?.telefono?.label?.toLowerCase()}`}
          onInputChange={onInputDataChange}
        />
        {/* <CheckboxGroup
          {...form?.tipoConferimentoConsenso}
          className={clsx(
            'col-12 col-lg-6',
            'compile-survey-container__checkbox-margin'
          )}
          options={citizenFormDropdownOptions['tipoConferimentoConsenso']}
          onInputChange={onInputDataChange}
          styleLabelForm
          classNameLabelOption='pl-5'
          disabled
        />
        <Input
          {...form?.dataConferimentoConsenso}
          col='col-12 col-lg-6'
          placeholder={`Inserisci ${form?.dataConferimentoConsenso?.label?.toLowerCase()}`}
          onInputChange={onInputDataChange}
        /> */}
      </Form.Row>
    </Form>
  );
};

const form = newForm([
  newFormField({
    ...CommonFields.NOME,
    field: 'nome',
    label: 'Nome',
    id: 'name',
    required: true,
  }),
  newFormField({
    ...CommonFields.COGNOME,
    field: 'cognome',
    label: 'Cognome',
    id: 'surname',
    required: true,
  }),
  newFormField({
    ...CommonFields.CODICE_FISCALE,
    field: 'codiceFiscale',
    id: 'codiceFiscale',
    label: 'Codice fiscale',
    required: true,
  }),
  newFormField({
    field: 'codiceFiscaleNonDisponibile',
    id: 'codiceFiscaleNonDisponibile',
    type: 'checkbox',
    required: false,
  }),
  newFormField({
    field: 'tipoDocumento',
    id: 'tipoDocumento',
    label: 'Tipo documento',
    type: 'select',
    required: false,
  }),
  newFormField({
    field: 'numeroDocumento',
    id: 'numeroDocumento',
    label: 'Numero documento',
    type: 'text',
    required: false,
  }),
  newFormField({
    field: 'genere',
    id: 'genere',
    label: 'Genere',
    type: 'select',
    required: true,
  }),
  newFormField({
    field: 'annoNascita',
    id: 'annoNascita',
    regex: RegexpType.NUMBER,
    label: 'Anno di nascita',
    type: 'number',
    required: true,
  }),
  newFormField({
    field: 'titoloStudio',
    id: 'titoloStudio',
    label: 'Titolo di studio (livello più alto raggiunto)',
    type: 'select',
    required: true,
  }),
  newFormField({
    field: 'statoOccupazionale',
    id: 'statoOccupazionale',
    label: 'Stato occupazionale',
    type: 'select',
    required: true,
  }),
  newFormField({
    field: 'cittadinanza',
    id: 'cittadinanza',
    label: 'Cittadinanza',
    type: 'select',
    required: true,
  }),
  newFormField({
    field: 'comuneDomicilio',
    id: 'comuneDomicilio',
    label: 'Comune di domicilio',
    type: 'text',
    required: true,
  }),
  newFormField({
    field: 'categoriaFragili',
    id: 'categoriaFragili',
    label: 'Categorie fragili',
    type: 'select',
    required: true,
  }),
  newFormField({
    ...CommonFields.EMAIL,
    field: 'email',
    id: 'email',
    label: 'Email',
    required: true,
  }),
  newFormField({
    field: 'prefisso',
    id: 'prefisso',
    regex: RegexpType.MOBILE_PHONE_PREFIX,
    label: 'Prefisso',
    type: 'text',
    required: true,
  }),
  newFormField({
    field: 'numeroCellulare',
    id: 'numeroCellulare',
    regex: RegexpType.TELEPHONE,
    label: 'Cellulare',
    type: 'text',
    required: true,
  }),
  newFormField({
    field: 'telefono',
    id: 'telefono',
    regex: RegexpType.TELEPHONE,
    label: 'Telefono',
    type: 'text',
    required: true,
  }),
  // newFormField({
  //   field: 'tipoConferimentoConsenso',
  //   id: 'tipoConferimentoConsenso',
  //   label: 'Tipo conferimento consenso',
  //   type: 'checkbox',
  //   required: true,
  // }),
  // newFormField({
  //   field: 'dataConferimentoConsenso',
  //   id: 'dataConferimentoConsenso',
  //   regex: RegexpType.DATE,
  //   label: 'Data conferimento consenso',
  //   type: 'date',
  //   required: true,
  // }),
]);

export default withFormHandler({ form }, FormCitizen);

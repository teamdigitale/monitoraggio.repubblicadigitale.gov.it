import clsx from 'clsx';
import React, { useEffect } from 'react';
import { Form, Input, Select, SelectMultiple } from '../../components';
import CheckboxGroup from '../../components/Form/checkboxGroup';
import { OptionTypeMulti } from '../../components/Form/selectMultiple';
import withFormHandler, {
  withFormHandlerProps,
} from '../../hoc/withFormHandler';
import {
  CittadinoInfoI,
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

interface FormCitizenI {
  formDisabled?: boolean;
  sendNewValues?: (param?: { [key: string]: formFieldI['value'] }) => void;
  isFormValid?: (param: boolean) => void;
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
    isFormValid = () => ({}),
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

  useEffect(() => {
    if (formData) {
      const values = { ...formData };
      const formattedDate = formatDate(
        formData?.dataConferimentoConsenso?.toString(),
        'snakeDate'
      );
      if (formattedDate) values.dataConferimentoConsenso = formattedDate;
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
    if (field === 'flag-codice-fiscale') {
      const tmpForm = FormHelper.onInputChange(form, value, field);
      const referenceBoolean = !tmpForm?.['flag-codice-fiscale']?.value;
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
    sendNewValues?.(getFormValues?.());
  };

  useEffect(() => {
    isFormValid?.(FormHelper.isValidForm(form));
  }, [form]);

  const optionsOccupazione:
    | { label: string; options: OptionTypeMulti[] }[]
    | undefined = [];

  (citizenFormDropdownOptions['statoOccupazionale'] || []).forEach((opt) => {
    optionsOccupazione.push({
      label: opt,
      options: [],
    });
  });

  if (optionsOccupazione?.length) {
    (citizenFormDropdownOptions['occupazione'] || []).forEach(
      ({ label, value, upperLevel }) => {
        const index = optionsOccupazione.findIndex(
          (v) => v.label === upperLevel
        );
        optionsOccupazione[index].options.push({
          label: label,
          value: value,
          upperLevel: upperLevel,
        });
      }
    );
  }

  const getMultiSelectValue = () => {
    const multiVal: OptionTypeMulti[] = [];
    if (Array.isArray(form?.occupazione.value)) {
      (form?.occupazione.value || []).map((val: string) =>
        multiVal.push(
          citizenFormDropdownOptions['occupazione']?.filter(
            (v) => v.label === val
          )[0]
        )
      );
    }
    return multiVal;
  };

  return (
    <Form className='mt-5' formDisabled={formDisabled}>
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
        <CheckboxGroup
          {...form?.['flag-codice-fiscale']}
          className='col-12 col-lg-6'
          options={citizenFormDropdownOptions['flag-codice-fiscale']}
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
          {...form?.annoDiNascita}
          col='col-12 col-lg-6'
          placeholder={`Inserisci ${form?.annoDiNascita?.label?.toLowerCase()}`}
          onInputChange={onInputDataChange}
        />
        <Select
          {...form?.titoloDiStudio}
          placeholder={`Inserisci ${form?.titoloDiStudio?.label?.toLowerCase()}`}
          onInputChange={onInputDataChange}
          col='col-12 col-lg-6'
          options={citizenFormDropdownOptions['titoloDiStudio']}
          isDisabled={formDisabled}
          wrapperClassName='mb-5 pr-lg-3'
        />
        <SelectMultiple
          {...form?.statoOccupazionale}
          aria-label={`${form?.statoOccupazionale.label}`}
          secondLevelField={form?.occupazione.field}
          options={optionsOccupazione}
          onInputChange={(value: formFieldI['value'], field) => {
            // format value for form StatoOccupazionale
            const values: string[] = [];
            if (Array.isArray(value))
              value.map((val: string) => values.push(val));
            onInputDataChange(value, field);
          }}
          onSecondLevelInputChange={(
            value: string | number | boolean | Date | string[] | undefined,
            field
          ) => {
            const values: string[] = [];
            if (Array.isArray(value))
              value.map((val: string) => values.push(val));
            onInputDataChange(value, field);
          }}
          placeholder='Seleziona'
          col='col-12 col-lg-6'
          wrapperClassName='mb-5 pr-lg-3'
          value={getMultiSelectValue()}
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
          {...form?.comuneDiDomicilio}
          col='col-12 col-lg-6'
          placeholder={`Inserisci ${form?.comuneDiDomicilio?.label?.toLowerCase()}`}
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
        />
        <Input
          {...form?.prefissoTelefono}
          col='col-12 col-lg-2'
          placeholder={`Inserisci ${form?.prefissoTelefono?.label?.toLowerCase()}`}
          onInputChange={onInputDataChange}
        />
        <Input
          {...form?.numeroDiCellulare}
          col='col-12 col-lg-4'
          placeholder={`Inserisci ${form?.numeroDiCellulare?.label?.toLowerCase()}`}
          onInputChange={onInputDataChange}
        />
        <Input
          {...form?.telefono}
          col='col-12 col-lg-6'
          placeholder={`Inserisci ${form?.telefono?.label?.toLowerCase()}`}
          onInputChange={onInputDataChange}
        />
        <CheckboxGroup
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
        />
      </Form.Row>
    </Form>
  );
};

const form = newForm([
  newFormField({
    ...CommonFields.NOME,
    field: 'nome',
    required: true,
    id: 'name',
  }),
  newFormField({
    ...CommonFields.COGNOME,
    field: 'cognome',
    required: true,
    id: 'surname',
  }),
  newFormField({
    ...CommonFields.CODICE_FISCALE,
    field: 'codiceFiscale',
    id: 'codiceFiscale',
    label: 'Codice fiscale',
    required: true,
  }),
  newFormField({
    field: 'flag-codice-fiscale',
    id: 'flag-codice-fiscale',
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
    field: 'annoDiNascita',
    id: 'annoDiNascita',
    regex: RegexpType.NUMBER,
    label: 'Anno di nascita',
    type: 'number',
    required: true,
  }),
  newFormField({
    field: 'titoloDiStudio',
    id: 'titoloDiStudio',
    label: 'Titolo di studio (livello più alto raggiunto)',
    type: 'select',
    required: true,
  }),
  newFormField({
    // Level2: non visualizzare
    field: 'occupazione',
    id: 'occupazione',
    label: 'Occupazione',
    type: 'select',
    required: true,
  }),
  newFormField({
    // Level1: visualizzare
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
    field: 'comuneDiDomicilio',
    id: 'comuneDiDomicilio',
    label: 'Comune di domicilio',
    type: 'text',
    required: true,
  }),
  newFormField({
    field: 'categoriaFragili',
    id: 'categoriaFragili',
    label: 'Categorie fragili',
    type: 'select',
    required: false,
  }),
  newFormField({
    ...CommonFields.EMAIL,
    field: 'email',
    id: 'email',
    label: 'Email',
    required: true,
  }),
  newFormField({
    field: 'prefissoTelefono',
    id: 'prefissoTelefono',
    regex: RegexpType.MOBILE_PHONE_PREFIX,
    label: 'Prefisso telefono',
    type: 'text',
    required: true,
  }),
  newFormField({
    field: 'numeroDiCellulare',
    id: 'numeroDiCellulare',
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
  newFormField({
    field: 'tipoConferimentoConsenso',
    id: 'tipoConferimentoConsenso',
    label: 'Tipo conferimento consenso',
    type: 'checkbox',
    required: true,
  }),
  newFormField({
    field: 'dataConferimentoConsenso',
    id: 'dataConferimentoConsenso',
    regex: RegexpType.DATE,
    label: 'Data conferimento consenso',
    type: 'date',
    required: true,
  }),
]);

export default withFormHandler({ form }, FormCitizen);

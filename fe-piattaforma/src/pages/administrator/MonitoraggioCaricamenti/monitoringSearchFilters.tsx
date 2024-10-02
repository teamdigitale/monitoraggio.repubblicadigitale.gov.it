import React, { useEffect, useState } from 'react';
import { Button } from 'design-react-kit';
import { useTranslation } from 'react-i18next';
import { Form, Input, Select } from '../../../components';
import { formFieldI, FormHelper, newForm, newFormField } from '../../../utils/formHelper';
import withFormHandler, { withFormHandlerProps } from '../../../hoc/withFormHandler';
import { set } from 'react-hook-form';

export interface SearchInformationI {
  onHandleSearch?: (searchValue: string) => void;
  placeholder: string;
  title: string;
  autocomplete: boolean;
  isClearable: boolean;
  onReset?: () => void;
}

interface GenericSearchFilterTableLayoutI extends withFormHandlerProps{
  formDisabled?: boolean;
  newFormValues: { [key: string]: any };
  sendNewValues?: (param?: { [key: string]: formFieldI['value'] }) => void;
  setIsFormValid?: (param: boolean | undefined) => void;
  creation?: boolean;
}

const monitoringSearchFilters: React.FC<GenericSearchFilterTableLayoutI> = (
  props
) => {
  console.log('props', props);
  const {
    form,
    newFormValues,
    onInputChange = () => ({}),
    getFormValues = () => ({}),
    sendNewValues = () => ({}),
    clearForm = () => ({}),
    setFormValues = () => ({}),
    updateForm = () => ({}),
  } = props;
  const { t } = useTranslation();
  const bootClass = 'justify-content-between px-0 px-lg-5 mx-2';

  useEffect(() => {
    // Verifica se le date sono state passate tramite i props
    if (newFormValues.dataInizio && newFormValues.dataFine) {
      let newForm = { ...form };
      const dataInizio = new Date(newFormValues.dataInizio);
      const dataFine = new Date(newFormValues.dataFine);
      // Imposta il minimo per dataFine basato su dataInizio
      if (dataInizio && (!newForm.dataFine.minimum || new Date(newForm.dataFine.minimum) < dataInizio)) {
        newForm.dataFine.minimum = formatDate(dataInizio.toISOString());
      }
      // Imposta il massimo per dataInizio basato su dataFine
      if (dataFine && (!newForm.dataInizio.maximum || new Date(newForm.dataInizio.maximum) > dataFine)) {
        newForm.dataInizio.maximum = formatDate(dataFine.toISOString());
      }
      updateForm(newForm); // Aggiorna il form con i valori min/max impostati
      setFormValues(newFormValues); // Imposta i valori del form
    }
    
  }, [newFormValues]); 
  
  const applicaFiltri = () => {
    console.log("applica");
  };

  const cancellaFiltri = () => {
    clearForm(); // Resetta il form
  };

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
    // Verifica se il valore è una stringa o un numero prima di usarlo in new Date()
    const isValidDateValue =
      typeof value === 'string' || typeof value === 'number' || value instanceof Date;

    if (!isValidDateValue) {
      console.error('Valore non valido per la data:', value);
      return; // Interrompe l'esecuzione se il valore non è valido
    }
    const formattedDate = formatDate(value as string); // Converti la data in formato YYYY-MM-DD
    let newForm = { ...form};

    if (field === 'dataInizio') {
      // Controlla se dataFine è inferiore a dataInizio
      if (newForm.dataFine.value && (typeof newForm.dataFine.value === 'string' || typeof newForm.dataFine.value === 'number' || newForm.dataFine.value instanceof Date) && new Date(newForm.dataFine.value) < new Date(formattedDate)) {
        newForm.dataFine.value = ''; // Resetta dataFine se è inferiore a dataInizio
      }
      newForm = {
        ...newForm,
        dataInizio: {
          ...form.dataInizio,
          value: formattedDate,
        },
        dataFine: {
          ...form.dataFine,
          minimum: formattedDate,
        },
      };
    } else if (field === 'dataFine') {
      // Controlla se dataFine è inferiore a dataInizio
      if (newForm.dataInizio.value && new Date(formattedDate) < new Date(newForm.dataInizio.value as string | number | Date)) {
        console.error('La data di fine non può essere inferiore alla data di inizio');
        return;
      }
      newForm = {
        ...newForm,
        dataFine: {
          ...form.dataFine,
          value: formattedDate,
        },
        dataInizio: {
          ...form.dataInizio,
          maximum: formattedDate,
        },
      };
    }
    updateForm(newForm);
  }
};

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  return (
    <Form
      id='form-categories'
      className='mt-3 mb-5 pb-5'
      customMargin='mb-3 pb-3'
    >
      <Form.Row className={bootClass}>
        <Input
          {...form?.ente}
          col='col-12 col-lg-6'
          label='Ente'
          onInputChange={onInputDataChange}
          placeholder="Inizia a scrivere il nome dell'ente"
        />
        <Select
          {...form?.intervento}
          col='col-12 col-lg-6'
          label='Intervento'
          onInputChange={onInputDataChange}
          options={[
            { value: '', label: 'Seleziona' },
            { value: 'rfd', label: 'RFD' },
            { value: 'scd', label: 'SCD' },
          ]}
          >
        </Select>
      </Form.Row>
      <Form.Row className={bootClass}>
        <Input
          {...form?.dataInizio}
          type='date'
          col='col-12 col-lg-6'
          label='Data inizio'
          min={form?.dataInizio?.minimum}
          max={form?.dataInizio?.maximum}
          onInputChange={onDateChange}
        />
        <Input
          {...form?.dataFine}
          type='date'
          col='col-12 col-lg-6'
          label='Data fine'
          min={form?.dataFine?.minimum}
          max={form?.dataFine?.maximum}
          onInputChange={onDateChange}
        />
      </Form.Row>
      <Form.Row className={bootClass}>
        <Select
          {...form?.progetto}
          col='col-12 col-lg-6'
          label='Progetto'
          onInputChange={onInputDataChange}
          options={[
            { value: '', label: 'Seleziona' },
            { value: 'progetto1', label: 'Progetto 1' },
            { value: 'progetto2', label: 'Progetto 2' },
          ]}

        />
        <Select
          {...form?.programma}
          col='col-12 col-lg-6'
          label='Programma'
          onInputChange={onInputDataChange}
          options={[
            { value: '', label: 'Seleziona' },
            { value: 'programma1', label: 'Programma 1' },
            { value: 'programma2', label: 'Programma 2' },
          ]}
          >
        </Select>
      </Form.Row>
      <Form.Row className='justify-content-end'>
        <Button color='secondary' className='mr-2' onClick={cancellaFiltri}>Cancella filtri</Button>
        <Button color='primary' onClick={applicaFiltri}>Applica filtri</Button>
      </Form.Row>
    </Form>
  );
};

const form = newForm([
  newFormField({
    field: 'ente',
    id: 'ente',
    required: false,
    maximum: 55,
    minimum: 2,
  }),
  newFormField({
    field: 'intervento',
    id: 'intervento',
    type: 'select',
    required: false,
  }),
  newFormField({
    field: 'programma',
    id: 'programma',
    type: 'select',
    required: false,
  }),
  newFormField({
    field: 'progetto',
    id: 'progetto',
    type: 'select',
    required: false,
  }),
  newFormField({
    field: 'dataInizio',
    id: 'dataInizio',
    type: 'date',
    required: false,
  }),
  newFormField({
    field: 'dataFine',
    id: 'dataFine',
    type: 'date',
    required: false,
  }),
]);

export default withFormHandler({ form }, monitoringSearchFilters);
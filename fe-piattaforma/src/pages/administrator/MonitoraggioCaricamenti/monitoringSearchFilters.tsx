import React, { useEffect, useState } from 'react';
import { Button } from 'design-react-kit';
import { Form, Input, Select } from '../../../components';
import withFormHandler, { withFormHandlerProps } from '../../../hoc/withFormHandler';
import { formFieldI, newForm, newFormField } from '../../../utils/formHelper';
import { Select as SelectKit, SelectProps } from 'design-react-kit';
import clsx from 'clsx';

export type OptionType = {
  value: string | number;
  label: string;
};

interface MonitoringSearchFilterI {
  formDisabled?: boolean;
  sendNewValues?: (param: { [key: string]: formFieldI['value'] }) => void;
  onSearch?: (param: { [key: string]: formFieldI['value'] }) => void;
  clearForm?: () => void;
}

type DateField = {
  value: any;
  minimum?: string;
  maximum?: string;
};

const initialFormValues = {
  ente: '',
  programma: {
    value: '',
    label: 'Seleziona',
  } as OptionType,
  intervento: {
    value: '',
    label: 'Seleziona',
  } as OptionType,
  progetto: {
    value: '',
    label: 'Seleziona',
  } as OptionType,
  dataInizio: {
    value: new Date().toISOString().split('T')[0],
  } as DateField,
  dataFine: {
    value: new Date().toISOString().split('T')[0],
  } as DateField,
};

// const formSchema: { [key: string]: formFieldI } = newForm([
//   newFormField({
//     field: 'ente',
//     id: 'ente',
//     required: false,
//     maximum: 55,
//     minimum: 2,
//   }),
//   newFormField({
//     field: 'intervento',
//     id: 'intervento',
//     type: 'select',
//     required: false,
//   }),
//   newFormField({
//     field: 'programma',
//     id: 'programma',
//     type: 'select',
//     required: false,
//   }),
//   newFormField({
//     field: 'progetto',
//     id: 'progetto',
//     type: 'select',
//     required: false,
//   }),
//   newFormField({
//     field: 'dataInizio',
//     id: 'dataInizio',
//     type: 'date',
//     required: false,
//   }),
//   newFormField({
//     field: 'dataFine',
//     id: 'dataFine',
//     type: 'date',
//     required: false,
//   }),
// ]);

const MonitoringSearchFilters: React.FC<MonitoringSearchFilterI> = ({
  // sendNewValues = () => {},
  onSearch = () => {},
  // updateForm = () => {},
  // clearForm = () => {},
}) => {
  const isDisabled = false;
  const shortDropdownMenu = false;
  const isSearchable = false;
  const withLabel = true;
  const required = false;
  const [formValues, setFormValues] = useState<typeof initialFormValues>(initialFormValues);

  const handleInputChange = (value: formFieldI['value'], field: string) => {
    console.log('field prima', field);
    console.log('value prima', value);
    console.log('formValues prima', formValues);
    
    setFormValues((prevValues) => {
      const newValues = { ...prevValues, [field]: value as string | number | boolean | Date | OptionType };
      return newValues;
    });

  };

  const handleSelectChange = (option: OptionType, name: any) => {
    setFormValues((prevValues) => ({ ...prevValues, [name?.name]: option }));
  };

  const handleClearForm = () => {
    setFormValues(initialFormValues);

    // clearForm();
  };

  // GESTIONE DATE DA RIVEDERE
      
  //  useEffect(() => {
  //   // Verifica se le date sono state passate tramite i props
  //   if (formValues.dataInizio && formValues.dataFine) {
  //     let newForm = { ...formValues };
  //     const dataInizio = new Date(formValues.dataInizio.value);
  //     const dataFine = new Date(formValues.dataFine.value);
  
  //     // Imposta il minimo per dataFine basato su dataInizio
  //     if (dataInizio && (!newForm.dataFine.minimum || new Date(newForm.dataFine.minimum) < dataInizio)) {
  //       newForm.dataFine.minimum = dataInizio.toISOString().split('T')[0];
  //     }
  
  //     // Imposta il massimo per dataInizio basato su dataFine
  //     if (dataFine && (!newForm.dataInizio.maximum || new Date(newForm.dataInizio.maximum) > dataFine)) {
  //       newForm.dataInizio.maximum = dataFine.toISOString().split('T')[0];
  //     }
  
  //     //updateForm(newForm); // Aggiorna il form con i valori min/max impostati
  //     setFormValues(newForm); // Imposta i valori del form
  //   }
  // }, [formValues.dataInizio, formValues.dataFine]);

  // const onDateChange = (
  //   value: formFieldI['value'],
  //   field?: formFieldI['field']
  // ) => {
  //   if (value && field && formValues) {
  //     // Verifica se il valore è una stringa o un numero prima di usarlo in new Date()
  //     const isValidDateValue =
  //       typeof value === 'string' || typeof value === 'number' || value instanceof Date;
  
  //     if (!isValidDateValue) {
  //       console.error('Valore non valido per la data:', value);
  //       return; // Interrompe l'esecuzione se il valore non è valido
  //     }
  //     const formattedDate = formatDate(value as string); // Converti la data in formato YYYY-MM-DD
  //     let newForm = { ...formValues};
  
  //     if (field === 'dataInizio') {
  //       // Controlla se dataFine è inferiore a dataInizio
  //       if (newForm.dataFine.value && (typeof newForm.dataFine.value === 'string' || typeof newForm.dataFine.value === 'number' || newForm.dataFine.value instanceof Date) && new Date(newForm.dataFine.value) < new Date(formattedDate)) {
  //         newForm.dataFine.value = ''; // Resetta dataFine se è inferiore a dataInizio
  //       }
  //       newForm = {
  //         ...newForm,
  //         dataInizio: {
  //           ...formValues.dataInizio,
  //           value: formattedDate,
  //         },
  //         dataFine: {
  //           ...formValues.dataFine,
  //           minimum: formattedDate,
  //         },
  //       };
  //     } else if (field === 'dataFine') {
  //       // Controlla se dataFine è inferiore a dataInizio
  //       if (newForm.dataInizio.value && new Date(formattedDate) < new Date(newForm.dataInizio.value as string | number | Date)) {
  //         console.error('La data di fine non può essere inferiore alla data di inizio');
  //         return;
  //       }
  //       newForm = {
  //         ...newForm,
  //         dataFine: {
  //           ...formValues.dataFine,
  //           value: formattedDate,
  //         },
  //         dataInizio: {
  //           ...formValues.dataInizio,
  //           maximum: formattedDate,
  //         },
  //       };
  //     }
  //     setFormValues(newForm);
  //   }
  // };
  
  //   const formatDate = (dateString: string) => {
  //     const date = new Date(dateString);
  //     const year = date.getFullYear();
  //     const month = String(date.getMonth() + 1).padStart(2, '0');
  //     const day = String(date.getDate()).padStart(2, '0');
  //     return `${year}-${month}-${day}`;
  //   };

  const renderSelect = (
    field: keyof typeof initialFormValues,
    label: string,
    options: Array<{ value: string; label: string }>
  ) => (
    // <Select
    //   col="col-12 col-lg-6"
    //   label={label}
    //   onInputChange={(value) => handleInputChange(value, field)}
    //   options={options}
    //   field={field}
    //   value={formValues[field]} // Usa i valori attuali dello stato
    // />
    <div
      className={clsx(
        'bootstrap-select-wrapper',
        'form-group',
        'col-12 col-lg-6',
        // wrapperClassName
      )}
    >
      {withLabel ? (
        <label
          id={`${(label || 'label select').replace(/\s/g, '-')}`}
          className='text-decoration-none'
        >
          {label}
          {required && !isDisabled ? ' *' : ''}
        </label>
      ) : null}
      <SelectKit
        // {...BaseProps}
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        onChange={handleSelectChange}
        name={field}
        id={field}
        options={options}
        value={formValues[field]}
        menuPlacement={'auto'}
        //onMenuScrollToBottom={onMenuScrollToBottom}
        // color='primary'
        className={clsx(
          (formValues[field] && !isDisabled ? 'border-select-value' : '') ||
            (isDisabled ? 'deleteArrowInSelect' : '')
        )}
        classNamePrefix={clsx(
          shortDropdownMenu ? 'bootstrap-select-short' : 'bootstrap-select'
        )}
        aria-labelledby={`${(label || 'label select').replace(/\s/g, '-')}`}
        isDisabled={isDisabled}
        isSearchable={isSearchable}
      />
    </div>
  );

  return (
    <Form id="form-categories" className="mt-3 mb-5 pb-5">
      <Form.Row className="justify-content-between px-0 px-lg-5 mx-2">
        <Input
          value={formValues.ente} // Usa il valore attuale dello stato
          col="col-12 col-lg-6"
          label="Ente"
          onInputChange={(value) => handleInputChange(value, 'ente')}
          placeholder="Inizia a scrivere il nome dell'ente"
        />
        {renderSelect('intervento', 'Intervento', [
          { value: '', label: 'Seleziona' },
          { value: 'rfd', label: 'RFD' },
          { value: 'scd', label: 'SCD' },
        ])}
      </Form.Row>

      <Form.Row className="justify-content-between px-0 px-lg-5 mx-2">
        <Input
          value={formValues.dataInizio.value} // Usa il valore attuale dello stato
          type="date"
          col="col-12 col-lg-6"
          label="Data inizio"
          onInputChange={(value) => handleInputChange(value, 'dataInizio')}
        />
        <Input
          value={formValues.dataFine.value} // Usa il valore attuale dello stato
          type="date"
          col="col-12 col-lg-6"
          label="Data fine"
          onInputChange={(value) => handleInputChange(value, 'dataFine')}
        />
      </Form.Row>

      <Form.Row className="justify-content-between px-0 px-lg-5 mx-2">
        {renderSelect('progetto', 'Progetto', [
          { value: '', label: 'Seleziona' },
          { value: 'progetto1', label: 'Progetto 1' },
          { value: 'progetto2', label: 'Progetto 2' },
        ])}
        {renderSelect('programma', 'Programma', [
          { value: '', label: 'Seleziona' },
          { value: 'programma1', label: 'Programma 1' },
          { value: 'programma2', label: 'Programma 2' },
        ])}
      </Form.Row>

      <Form.Row className="justify-content-end">
        <Button color="secondary" className="mr-2" onClick={handleClearForm}>
          Cancella filtri
        </Button>
        <Button color="primary" /*onClick={handleSubmit}*/>
          Applica filtri
        </Button>
      </Form.Row>
    </Form>
  );
};

export default  MonitoringSearchFilters;

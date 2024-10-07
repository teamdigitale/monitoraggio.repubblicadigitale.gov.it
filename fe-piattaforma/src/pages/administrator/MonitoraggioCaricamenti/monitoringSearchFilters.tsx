import React, { useEffect, useState } from 'react';
import { Button } from 'design-react-kit';
import { Form, Input } from '../../../components';
import { formFieldI } from '../../../utils/formHelper';
import { Select as SelectKit } from 'design-react-kit';
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
    value: '',
  } as DateField,
  dataFine: {
    value: '',
  } as DateField,
};

const MonitoringSearchFilters: React.FC<MonitoringSearchFilterI> = () => {
  const isDisabled = false;
  const shortDropdownMenu = false;
  const isSearchable = false;
  const withLabel = true;
  const required = false;
  const [formValues, setFormValues] = useState<typeof initialFormValues>(initialFormValues);
  const [isDateValid, setIsDateValid] = useState<{ dataInizio?: boolean; dataFine?: boolean }>({});

  console.log('isDateValid', isDateValid);

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    setFormValues((prevValues) => ({
      ...prevValues,
      dataInizio: { value: today, maximum: today },
      dataFine: { value: today, minimum: today },
    }));
  }, []);

  const handleInputChange = (value: formFieldI['value'], field: string) => {
    setFormValues((prevValues) => {
      const newValues = { ...prevValues, [field]: value as string | number | boolean | Date | OptionType };
      return newValues;
    });

  };

    const handleDateInputChange = (value: any, field: string) => {
    const formattedDate = typeof value === 'string' ? value : new Date(value).toISOString().split('T')[0];
  
    setFormValues((prevValues) => {
      let newForm = { ...prevValues };
      let newDateValid = { ...isDateValid };
      console.log('newDateValid', newDateValid);

      if (field === 'dataInizio') {
        newForm = {
          ...newForm,
          dataInizio: { ...prevValues.dataInizio, value: formattedDate },
          dataFine: { ...prevValues.dataFine, minimum: formattedDate },
        };
        if (new Date(prevValues.dataFine.value) < new Date(formattedDate)) {
          newForm.dataFine.value = '';
          newDateValid.dataFine = true;
        } else {
          newDateValid.dataFine = false;
        }
      } else if (field === 'dataFine') {
        if (new Date(formattedDate) < new Date(prevValues.dataInizio.value)) {
          console.error('La data di fine non può essere inferiore alla data di inizio');
          newDateValid.dataFine = true
          return prevValues;
        } else {
          newDateValid.dataFine = false;
        }
        newForm = {
          ...newForm,
          dataFine: { ...prevValues.dataFine, value: formattedDate },
          dataInizio: { ...prevValues.dataInizio, maximum: formattedDate },
        };
      }
      setIsDateValid(newDateValid);
      return newForm;
    });
  };
  
  const handleSelectChange = (option: OptionType, name: any) => {
    setFormValues((prevValues) => ({ ...prevValues, [name?.name]: option }));
  };

  const handleClearForm = () => {
    setFormValues(initialFormValues);
  };

  const renderSelect = (
    field: keyof typeof initialFormValues,
    label: string,
    options: Array<{ value: string; label: string }>
  ) => (
    <div
      className={clsx(
        'bootstrap-select-wrapper',
        'form-group',
        'col-12 col-lg-6',
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
    <Form id='form-categories' className='mt-3 mb-5 pb-5'>
      <Form.Row className='justify-content-between px-0 px-lg-5 mx-2'>
        <Input
          value={formValues.ente}
          col='col-12 col-lg-6'
          label='Ente'
          onInputChange={(value) => handleInputChange(value, 'ente')}
          placeholder="Inizia a scrivere il nome dell'ente"
          // isAutocomplete={true} // Attiva l'autocompletamento
          // options={[]} // Passa le opzioni di autocompletamento
        />
        {renderSelect('intervento', 'Intervento', [
          { value: 'rfd', label: 'RFD' },
          { value: 'scd', label: 'SCD' },
        ])}
      </Form.Row>

      <Form.Row className='justify-content-between px-0 px-lg-5 mx-2'>
        <Input
          value={formValues.dataInizio.value}
          type='date'
          col='col-12 col-lg-6'
          label='Data inizio'
          onInputChange={(value) => handleDateInputChange(value, 'dataInizio')}
          minimum={formValues.dataInizio.minimum}
          maximum={formValues.dataInizio.maximum}
          // className={isDateValid.dataInizio ? 'is-invalid' : 'is-valid'}
          // valid = {isDateValid?.dataInizio}
          {...(isDateValid.dataInizio ? { valid: false } : { valid: true })}
        />
        <Input
          value={formValues.dataFine.value}
          type='date'
          col='col-12 col-lg-6'
          label='Data fine'
          onInputChange={(value) => handleDateInputChange(value, 'dataFine')}
          minimum={formValues.dataFine.minimum}
          maximum={formValues.dataFine.maximum}
          {...(isDateValid.dataFine ? { valid: false } : { valid: true })}
          // className= 'is-invalid'
          // valid = {isDateValid?.dataFine}
        />
      </Form.Row>

      <Form.Row className='justify-content-between px-0 px-lg-5 mx-2'>
        {renderSelect('progetto', 'Progetto', [
          { value: 'progetto1', label: 'Progetto 1' },
          { value: 'progetto2', label: 'Progetto 2' },
        ])}
        {renderSelect('programma', 'Programma', [
          { value: 'programma1', label: 'Programma 1' },
          { value: 'programma2', label: 'Programma 2' },
        ])}
      </Form.Row>

      <Form.Row className='justify-content-end'>
        <Button color='secondary' className='mr-2' onClick={handleClearForm}>
          Cancella filtri
        </Button>
        <Button color='primary' /*onClick={handleSubmit}*/>
          Applica filtri
        </Button>
      </Form.Row>
    </Form>
  );
};

export default  MonitoringSearchFilters;

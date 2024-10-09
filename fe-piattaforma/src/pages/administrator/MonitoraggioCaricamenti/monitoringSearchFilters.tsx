import React, { useEffect, useState } from 'react';
import { Button, Chip, ChipLabel } from 'design-react-kit';
import { Form, Input } from '../../../components';
import { formFieldI } from '../../../utils/formHelper';
import { Select as SelectKit } from 'design-react-kit';
import clsx from 'clsx';
import AutocompleteComponent from '../../../components/Form/autocomplete';

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
  const [chips, setChips] = useState<string[]>([]);
  const [formValues, setFormValues] = useState<typeof initialFormValues>(initialFormValues);
  const [isDateValid, setIsDateValid] = useState<{ dataInizio?: boolean; dataFine?: boolean }>({});
  const [multiOptions, setMultiOptions] = useState<OptionType[]>([
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' },
    // Add more options as needed
  ]);

  console.log('isDateValid', isDateValid);

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    setFormValues((prevValues) => ({
      ...prevValues,
      dataInizio: { value: today, maximum: today },
      dataFine: { value: today, minimum: today },
    }));
  }, []);

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
          setIsDateValid(() => ({ dataInizio: false, dataFine: false }));
          return prevValues;
        } else {
          setIsDateValid(() => ({ dataInizio: true, dataFine: true }));
        }
      } else if (field === 'dataFine') {
        if (new Date(formattedDate) < new Date(prevValues.dataInizio.value)) {
          console.error('La data di fine non può essere inferiore alla data di inizio');
          setIsDateValid(() => ({ dataFine: false, dataInizio: false }));
          return prevValues;
        } else {
          setIsDateValid(() => ({ dataFine: true, dataInizio: true }));
        }
        newForm = {
          ...newForm,
          dataFine: { ...prevValues.dataFine, value: formattedDate },
          dataInizio: { ...prevValues.dataInizio, maximum: formattedDate },
        };
      }
      return newForm;
    });
  };

  const handleSelectChange = (option: OptionType, name: any) => {
    setFormValues((prevValues) => ({ ...prevValues, [name?.name]: option }));
  };


  const suggest = (query: any, populateResults: any) => {
    const filteredResults = multiOptions.filter((i) => i.label.toLowerCase().includes(query.toLowerCase()));
    let data = filteredResults.map((item) => {
      return item.label;
    });
    populateResults(data);
  };

  const handleClearForm = () => {
    setFormValues(initialFormValues);
    setIsDateValid({});
    setChips([]);
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

  useEffect(() => {
    const newChips: string[] = [];
    if (formValues.programma.value) {
      newChips.push(`Programma: ${formValues.programma.label}`);
    }
    if (formValues.intervento.value) {
      newChips.push(`Intervento: ${formValues.intervento.label}`);
    }
    if (formValues.progetto.value) {
      newChips.push(`Progetto: ${formValues.progetto.label}`);
    }
    if (formValues.dataInizio.value && formValues.dataFine.value) {
      const dataInizioFormattata = formValues.dataInizio.value.split('-').reverse().join('/');
      const dataFineFormattata = formValues.dataFine.value.split('-').reverse().join('/');
      newChips.push(`Periodo: ${dataInizioFormattata} - ${dataFineFormattata}`);
    }
    setChips(newChips);
  }, [formValues]);


  return (
    <Form id='form-categories' className='mt-3 pb-5'>
      <Form.Row className='justify-content-between px-0 px-lg-5 mx-2'>
        <AutocompleteComponent
          label='Ente'
          placeholder="Inizia a scrivere il nome dell'ente"
          col='col-12 col-lg-6'
          source={suggest}
          id='autocomplete'
          defaultValue={''}
          displayMenu={'inline'}
          tNoResults={() => 'Nessun risultato'}
        // inputClasses={"form-group "}         
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
          {...(isDateValid.dataInizio !== undefined ? { valid: isDateValid.dataInizio } : {})}
        />
        <Input
          value={formValues.dataFine.value}
          type='date'
          col='col-12 col-lg-6'
          label='Data fine'
          onInputChange={(value) => handleDateInputChange(value, 'dataFine')}
          minimum={formValues.dataFine.minimum}
          maximum={formValues.dataFine.maximum}
          {...(isDateValid.dataFine !== undefined ? { valid: isDateValid.dataFine } : {})}
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

      <Form.Row className='justify-content-start mt-5 chipsRow'>
        {chips.map((chip, index) => (
          <Chip key={index} className='mr-2 rounded-pill'>
            <ChipLabel className='mx-1 my-1'>
              {chip}
            </ChipLabel>
          </Chip>
        ))}
      </Form.Row>

    </Form>
  );
};

export default MonitoringSearchFilters;

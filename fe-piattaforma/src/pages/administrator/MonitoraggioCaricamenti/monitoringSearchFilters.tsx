import React, { useState } from 'react';
import { Button } from 'design-react-kit';
import { Form, Input, Select } from '../../../components';
import withFormHandler, { withFormHandlerProps } from '../../../hoc/withFormHandler';
import { formFieldI, newForm, newFormField } from '../../../utils/formHelper';

interface MonitoringSearchFilterI {
  formDisabled?: boolean;
  sendNewValues?: (param: { [key: string]: formFieldI['value'] }) => void;
  onSearch?: (param: { [key: string]: formFieldI['value'] }) => void;
  clearForm?: () => void;
}

const initialFormValues = {
  ente: '',
  programma: '',
  intervento: '',
  progetto: '',
  dataInizio: new Date().toISOString().split('T')[0],
  dataFine: new Date().toISOString().split('T')[0],
};

const formSchema: { [key: string]: formFieldI } = newForm([
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

const MonitoringSearchFilters: React.FC<MonitoringSearchFilterI> = ({
  // sendNewValues = () => {},
  onSearch = () => {},
  // updateForm = () => {},
  // clearForm = () => {},
}) => {
  const [formValues, setFormValues] = useState<{ [key: string]: formFieldI['value'] }>(initialFormValues);

  const handleInputChange = (value: formFieldI['value'], field: formFieldI['field']) => {
    console.log('field prima', field);
    console.log('value prima', value);
    console.log('formValues prima', formValues);
    
    setFormValues((prevValues) => {
      const newValues = { ...prevValues, [field]: value };
      console.log('prevValues', prevValues);
      console.log('newValues', newValues);
      return newValues;
    });

  };

  const handleClearForm = () => {
    setFormValues(initialFormValues);

    // clearForm();
  };

  const handleSubmit = () => {
    // sendNewValues(formValues);
    onSearch(formValues);
  };

  const renderSelect = (field: string, label: string, options: Array<{ value: string; label: string }>) => (
    <Select
      col="col-12 col-lg-6"
      label={label}
      onInputChange={(value) => handleInputChange(value, field)}
      options={options}
      field={field}
      value={formValues[field]} // Usa i valori attuali dello stato
    />
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
          value={formValues.dataInizio} // Usa il valore attuale dello stato
          type="date"
          col="col-12 col-lg-6"
          label="Data inizio"
          onInputChange={(value) => handleInputChange(value, 'dataInizio')}
        />
        <Input
          value={formValues.dataFine} // Usa il valore attuale dello stato
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
        <Button color="primary" onClick={handleSubmit}>
          Applica filtri
        </Button>
      </Form.Row>
    </Form>
  );
};

export default  MonitoringSearchFilters;

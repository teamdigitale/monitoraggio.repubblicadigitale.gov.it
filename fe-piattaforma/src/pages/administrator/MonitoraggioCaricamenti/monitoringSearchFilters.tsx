import React, { useEffect, useState } from 'react';
import { Button } from 'design-react-kit';
import { Form, Input } from '../../../components';
import { Select as SelectKit } from 'design-react-kit';
import clsx from 'clsx';
import { useDispatch, useSelector } from 'react-redux';
import { selectEntityFiltersOptions } from '../../../redux/features/administrativeArea/administrativeAreaSlice';
import { GetAllEntityValues, GetProgettiDropdownList, GetProgrammiDropdownList } from '../../../redux/features/administrativeArea/administrativeAreaThunk';
import './monitoring.scss';

export type OptionType = {
  value: string;
  label: string;
  policy?: string;
  idProgramma?: string;
};

interface MonitoringSearchFilterI {
  formDisabled?: boolean;
  onSearch: () => void;
  formValues: { ente: OptionType; programma: OptionType; intervento: OptionType; progetto: OptionType; dataInizio: DateField; dataFine: DateField; };
  setFormValues: (formValues: any) => void;
  chips: string[];
  setChips: (chips: string[]) => void;
}

type DateField = {
  value: any;
  minimum?: string;
  maximum?: string;
};

export const initialFormValues = {
  ente: {
    value: '',
    label: 'Inizia a scrivere il nome dell\'ente',
  } as OptionType,
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
    minimum: '0001-01-01',
    maximum: '9999-12-31'
  } as DateField,
  dataFine: {
    value: '',
    minimum: '0001-01-01',
    maximum: '9999-12-31',
  } as DateField,
};

const MonitoringSearchFilters: React.FC<MonitoringSearchFilterI> = ({ formValues, setFormValues, onSearch, chips, setChips }) => {
  const [isDateValid, setIsDateValid] = useState<{ dataInizio?: boolean; dataFine?: boolean }>({ dataInizio: true, dataFine: true });
  const [isFiltersChanged, setIsFiltersChanged] = useState(false); // Nuovo stato per monitorare le modifiche
  const [shouldSearch, setShouldSearch] = useState(false);
  const dispatch = useDispatch();
  const dropdownFilterOptions = useSelector(selectEntityFiltersOptions);
  

  const [programTypes, setProgramTypes] = useState<OptionType[]>();
  const [projectTypes, setProjectTypes] = useState<OptionType[]>();

  useEffect(() => {
    dispatch(retrieveProgramma);
    dispatch(retrieveProgetto);
    dispatch(retrieveEnte);
  }, [dispatch]);


  useEffect(() => {
    if (dropdownFilterOptions['programmi']) {
      const mappedProgramTypes = dropdownFilterOptions['programmi'].map((program: any) => ({
        value: program.value,
        label: program.label,
        policy: program.policy,
      }));
      setProgramTypes(mappedProgramTypes);
    }
    if (dropdownFilterOptions['progetti']) {
      const mappedProjectTypes = dropdownFilterOptions['progetti'].map((project: any) => ({
        value: project.value,
        label: project.label,
        policy: project.policy,
        idProgramma: project.idProgramma,
      }));
      setProjectTypes(mappedProjectTypes);
    }
  }, [dropdownFilterOptions]);

  const [enteMultiOptions, setEnteMultiOptions] = useState<OptionType[]>([]);


  const retrieveProgramma = async (policy: string) => {
    const payload = {
      filtroRequest: {
        ...(policy && { filtroPolicies: [policy] }),
      }
    }
    try {
      const response = await GetProgrammiDropdownList(payload)(dispatch);      
      const mappedProgramTypes = response.map((program: any) => ({
        value: program.id,
        label: program.nome,
        policy: program.policy,
      }));
      setProgramTypes(mappedProgramTypes);
    } catch (error) {
      console.error("Network error:", error);
    }
  };

  const retrieveProgetto = async (policy: string, idProgramma?: number) => {
    const payload = {
      filtroRequest: {
        ...(policy && { filtroPolicies: [policy] }),
        ...(idProgramma !== 0 && { idsProgrammi: [idProgramma] })
      },
      ...(idProgramma !== 0 && { idProgramma })
    };
    try {
      const response = await GetProgettiDropdownList(payload)(dispatch);
      const mappedProjectTypes = response.map((project: any) => ({
        value: project.id,
        label: project.nome,
        policy: project.policy,
        idProgramma: project.idProgramma,
      }));
      setProjectTypes(mappedProjectTypes);
    } catch (error) {
      console.error("Network error:", error);
    }
  };

  const retrieveEnte = async () => {  
    const payload = {
      filtroRequest: {
      ...(formValues.intervento.value != '' && { filtroPolicies: [formValues.intervento.value] }),
      ...(formValues.programma.value != '' && { idsProgrammi: [formValues.programma.value] }),
      ...(formValues.progetto.value != '' && { idsProgetti: [formValues.progetto.value] }),
      }
    }
    try{      
      const response = await GetAllEntityValues(payload)(dispatch); 
      if(response != undefined){
        const mappedEnteOptions = response.map((ente: any) => ({
          value: ente.id.toString(),
          label: ente.nome,
        }));      
        setEnteMultiOptions(mappedEnteOptions);
      }
    }catch(error){
      console.error("Error:", error);
    }
    
  }

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    setFormValues((prev: any) => ({
      ...prev,
      dataInizio: { value: today, maximum: today },
      dataFine: { value: today, minimum: today },
    }));
  }, []);
  

  const handleDateInputChange = (value: any, field: string) => {
    const formattedDate = typeof value === 'string' ? value : new Date(value).toISOString().split('T')[0];

    setFormValues(() => {
      let newForm = { ...formValues };
      // let newDateValid = { ...isDateValid };

      if (field === 'dataInizio') {
        newForm = {
          ...newForm,
          dataInizio: { ...formValues.dataInizio, value: formattedDate },
          dataFine: { ...formValues.dataFine, minimum: formattedDate },
        };
        if (new Date(formValues.dataFine.value) < new Date(formattedDate)) {
          setIsDateValid(() => ({ dataInizio: false, dataFine: false }));
        } else {
          setIsDateValid(() => ({ dataInizio: true, dataFine: true }));
        }
      } else if (field === 'dataFine') {
        if (new Date(formattedDate) < new Date(formValues.dataInizio.value)) {
          console.error('La data di fine non può essere inferiore alla data di inizio');
          setIsDateValid(() => ({ dataFine: false, dataInizio: false }));
        } else {
          setIsDateValid(() => ({ dataFine: true, dataInizio: true }));
        }
        newForm = {
          ...newForm,
          dataFine: { ...formValues.dataFine, value: formattedDate },
          dataInizio: { ...formValues.dataInizio, maximum: formattedDate },
        };
      }
      setIsFiltersChanged(true); // Imposta a true quando l'utente cambia i filtri
      return newForm;
    });
  };

  const RFD = "Rete dei servizi di Facilitazione Digitale";
  const SCD = "Servizio Civile Digitale";

  const getProgramLabelById = (idProgramma: string): string => {
    const program = programTypes?.find((program) => program.value.toString() === idProgramma.toString());
    return program ? program.label : 'Seleziona';
  };

  const handleSelectChange = (option: OptionType, name: any) => {
    setFormValues(() => ({ ...formValues, [name?.name]: option }));
    setIsFiltersChanged(true);
    if (name?.name === 'intervento') {
      retrieveProgramma(option.value);
      retrieveProgetto(option.value, 0);
      setFormValues(() => ({ ...formValues, programma: { value: '', label: 'Seleziona' }, progetto: { value: '', label: 'Seleziona' }, intervento: option }));
    }
    if (name?.name === 'programma') {
      setFormValues(() => ({ ...formValues, progetto: { value: '', label: 'Seleziona' }, programma: option, intervento: { value: option.policy === RFD ? "RFD": "SCD", label: option.policy === RFD ? "RFD": "SCD" } }));
      if (formValues.intervento.value.length > 0)
        retrieveProgetto(formValues.intervento.value, Number(option.value));
      else
        retrieveProgetto('', Number(option.value));
    }
    if(name?.name === 'progetto'){
      const programLabel = option.idProgramma ? getProgramLabelById(option.idProgramma) : 'Seleziona';
      setFormValues(() => ({ ...formValues, progetto: option, intervento: { value: option.policy, label: option.policy},
        programma: { value: option.idProgramma, label: programLabel } }));
    }
    if(name?.name === 'ente'){
      //richiamare gli EP che popolano Intervento,Programma,Progetto inviando anche idEnte,
      //questi restituiranno i valori filtrati ANCHE per idEnte
    }
  };

  const handleClearForm = () => {
    setFormValues(initialFormValues);
    setIsDateValid({ dataInizio: true, dataFine: true });
    setChips([]);
    setIsFiltersChanged(false);
    dispatch(retrieveProgramma);
    dispatch(retrieveProgetto);
    dispatch(retrieveEnte);
    setShouldSearch(true);
  };

  useEffect(() => {
    if (shouldSearch) {
      onSearch();
      setShouldSearch(false); // Resetta il trigger dopo la ricerca
    }
  }, [shouldSearch, onSearch]);

  const [enteInputValue, setEnteInputValue] = useState('');

  const handleCrossButtonClick = () => {
    setFormValues(() => ({ ...formValues, ente: { value: '', label: 'Inizia a scrivere il nome dell\'ente' } }));
    setEnteInputValue('');
  };

  const renderSelect = (
    field: keyof typeof initialFormValues,
    label: string,
    options: Array<{ value: string; label: string }>,
    isSearchable = false,
    onChange?: (option: OptionType, name: any) => void,
    placeholder = 'Seleziona',
    isDisabled = false,
    required = false,
    withLabel = true,
    shortDropdownMenu = false,
  ) => {
    return (
      <div
        className={clsx(
          {
            'd-flex flex-row': !isSearchable
          },
          'col-12 col-lg-6',
          'form-group',
          'bootstrap-select-wrapper'
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
          onChange={onChange || handleSelectChange}
          name={field}
          id={field}
          options={options}
          value={formValues[field].value !== '' ? formValues[field] : null}
          menuPlacement={'auto'}
          placeholder={isDisabled ? '-' : placeholder}
          //onMenuScrollToBottom={onMenuScrollToBottom}
          // color='primary'
          className={clsx(
            {
              'deleteArrowInSelect': isDisabled || isSearchable || !isSearchable,
              'customArrowSelect': !isSearchable && !isDisabled,
              'customCrossSelect': isSearchable,
              'customCrossSelectDisabled': isSearchable && isDisabled
            },
            'col-12 pl-0'
          )}
          classNamePrefix={clsx(
            shortDropdownMenu ? 'bootstrap-select-short' : 'bootstrap-select'
          )}
          aria-labelledby={`${(label || 'label select').replace(/\s/g, '-')}`}
          isDisabled={isDisabled}
          isSearchable={isSearchable}
          openMenuOnClick={!isSearchable}
          {...(isSearchable && { menuIsOpen: enteInputValue.length > 3 })}
          {...(isSearchable && { noOptionsMessage: () => 'Non ci sono opzioni per questo filtro'})}
          onInputChange={(value) => setEnteInputValue(value)}
        />
        {isSearchable && (
          <div 
            className="clickable-cross-area"
            onClick={handleCrossButtonClick}
          />
        )}
      </div>
    )
  };

  useEffect(() => {
    if (formValues.dataInizio.value && formValues.dataFine.value) {
      const dataInizioFormattata = formValues.dataInizio.value.split('-').reverse().join('/');
      const dataFineFormattata = formValues.dataFine.value.split('-').reverse().join('/');
      setChips([`Periodo: ${dataInizioFormattata} - ${dataFineFormattata}`]);
    } else {
      setChips([]);
    }
  }, [formValues.dataInizio.value, formValues.dataFine.value]);
  

  function handleSubmitFiltri(): void {
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
    if (formValues.ente.value) {
      newChips.push(`Ente: ${formValues.ente.label}`);
    }
  console.log("formValues", formValues);
  
    setChips(newChips);
    onSearch();
  }
  

  return (
    <Form id='form-categories' className='mt-3 pb-5'>
      <Form.Row className='justify-content-between px-0 px-lg-5 mx-2'>
        {renderSelect('ente', 'Ente', enteMultiOptions, true, handleSelectChange,
          "Inizia a scrivere il nome dell'ente...",
          false)}
        {renderSelect('intervento', 'Intervento', [
          { value: 'rfd', label: 'RFD' },
          { value: 'scd', label: 'SCD' },
        ], false, handleSelectChange, "Seleziona", false)}
      </Form.Row>

      <Form.Row className='justify-content-between px-0 px-lg-5 mx-2'>
      {renderSelect('programma', 'Programma', (programTypes || []).map((type: any) => ({
          value: type.value,
          label: type.label,
          policy: type.policy,
        })), false, handleSelectChange, "Seleziona", programTypes?.length === 0)}
        {renderSelect('progetto', 'Progetto', (projectTypes || []).map((type: any) => ({
          value: type.value,
          label: type.label,
          policy: type.policy,
          idProgramma: type.idProgramma
        })), false, handleSelectChange, "Seleziona", projectTypes?.length === 0)}
      </Form.Row>

      <Form.Row className='justify-content-between px-0 px-lg-5 mx-2'>
        <Input
          value={formValues.dataInizio.value}
          type='date'
          label='Data inizio'
          col='col-12 col-lg-6'
          onInputChange={(value) => handleDateInputChange(value, 'dataInizio')}
          minimum={formValues.dataInizio.minimum}
          maximum={formValues.dataInizio.maximum}
          id='dateInputDataInizio'
          className={
            isDateValid.dataInizio === false 
              ? 'dateInputDataInizio--isNotValid' 
              : formValues.dataInizio.value !== '' 
                ? 'dateInputDataInizio' 
                : 'dateInputDataInizio--empty'
          }
          invalid={isDateValid.dataInizio === false}
        />
        <Input
          value={formValues.dataFine.value}
          type='date'
          label='Data fine'
          col='col-12 col-lg-6'
          onInputChange={(value) => handleDateInputChange(value, 'dataFine')}
          minimum={formValues.dataFine.minimum}
          maximum={formValues.dataFine.maximum}
          id='dateInputDataFine'
          className={
            isDateValid.dataFine === false 
              ? 'dateInputDataFine--isNotValid' 
              : formValues.dataFine.value !== '' 
                ? 'dateInputDataFine' 
                : 'dateInputDataFine--empty'
          }          
          invalid={isDateValid.dataFine === false}
          validationText={formValues.dataFine.value !== '' && formValues.dataFine.value < formValues.dataInizio.value ? 'La data di fine non può essere antecedente alla data di inizio' : ''}
        />

      </Form.Row>

      <Form.Row className='justify-content-end'>
        <Button color='secondary' className='mr-2' id='cancellaFiltri' onClick={handleClearForm}>
          Cancella filtri
        </Button>
        <Button color='primary' id='applicaFiltri' onClick={handleSubmitFiltri} disabled={!isDateValid.dataInizio || !isDateValid.dataFine || !isFiltersChanged}>
          Applica filtri
        </Button>
      </Form.Row>


    </Form>
  );
};

export default MonitoringSearchFilters;

import React, { useEffect, useState } from 'react';
import { Button, Chip, ChipLabel, Icon } from 'design-react-kit';
import { Form, Input } from '../../../components';
import { Select as SelectKit } from 'design-react-kit';
import clsx from 'clsx';
import { useDispatch, useSelector } from 'react-redux';
import { selectEntityFiltersOptions, selectEntityList } from '../../../redux/features/administrativeArea/administrativeAreaSlice';
import { GetEntitySearchValues, GetProgettiDropdownList, GetProgrammiDropdownList } from '../../../redux/features/administrativeArea/administrativeAreaThunk';
import { useAppSelector } from '../../../redux/hooks';
import './monitoring.scss';

export type OptionType = {
  value: string;
  label: string;
};

interface MonitoringSearchFilterI {
  formDisabled?: boolean;
  onSearch: () => void;
  formValues: { ente: OptionType; programma: OptionType; intervento: OptionType; progetto: OptionType; dataInizio: DateField; dataFine: DateField; };
  setFormValues: (formValues: any) => void;
  chips: string[];
  setChips: (chips: string[]) => void;
  areChipsVisible?: boolean;
  setChipsVisible: (areChipVisible: boolean) => void;
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

const MonitoringSearchFilters: React.FC<MonitoringSearchFilterI> = ({ formValues, setFormValues, onSearch, chips, setChips, areChipsVisible, setChipsVisible}) => {
  const [isDateValid, setIsDateValid] = useState<{ dataInizio?: boolean; dataFine?: boolean }>({ dataInizio: true, dataFine: true });
  const dispatch = useDispatch();
  const dropdownFilterOptions = useSelector(selectEntityFiltersOptions);
  const entiList = useAppSelector(selectEntityList);


  const [programTypes, setProgramTypes] = useState<OptionType[]>();
  const [projectTypes, setProjectTypes] = useState<OptionType[]>();

  useEffect(() => {
    dispatch(retriveProgramma);
    dispatch(retriveProgetto);
    dispatch(GetEntitySearchValues({ entity: 'ente', criterioRicerca: "%" }));
  }, [dispatch]);


  useEffect(() => {
    if (dropdownFilterOptions['programmi']) {
      const mappedProgramTypes = dropdownFilterOptions['programmi'].map((program: any) => ({
        value: program.value,
        label: program.label,
      }));
      setProgramTypes(mappedProgramTypes);
    }
    if (dropdownFilterOptions['progetti']) {
      const mappedProjectTypes = dropdownFilterOptions['progetti'].map((project: any) => ({
        value: project.value,
        label: project.label,
      }));
      setProjectTypes(mappedProjectTypes);
    }
  }, [dropdownFilterOptions]);

  const [multiOptions, setMultiOptions] = useState<OptionType[]>([]);

  useEffect(() => {
    if (entiList.length > 0) {
      const mappedOptions = entiList.map((ente: { id: any; nome: any; }) => ({
        value: ente.id.toString(),
        label: ente.nome,
      }));
      setMultiOptions(mappedOptions);
    }
  }, [entiList]);


  const retriveProgramma = async (policy: string) => {
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
      }));
      setProgramTypes(mappedProgramTypes);
    } catch (error) {
      console.error("Network error:", error);
    }
  };

  const retriveProgetto = async (policy: string, idProgramma: number) => {
    const payload = {
      filtroRequest: {
        ...(policy && { filtroPolicies: [policy] }),
        ...(idProgramma !== 0 && { idsProgrammi: [idProgramma] })
      },
      ...(idProgramma !== 0 && { idProgramma })
    };
    try {
      const response = await GetProgettiDropdownList(payload)(dispatch);
      const mappedProjectTypes = response.map((program: any) => ({
        value: program.id,
        label: program.nome,
      }));
      setProjectTypes(mappedProjectTypes);
    } catch (error) {
      console.error("Network error:", error);
    }
  };

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    setFormValues(() => ({
      ...formValues,
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
      return newForm;
    });
  };

  const handleSelectChange = (option: OptionType, name: any) => {
    setFormValues(() => ({ ...formValues, [name?.name]: option }));
    if (name?.name === 'intervento') {
      retriveProgramma(option.value);
      retriveProgetto(option.value, 0);
      setFormValues(() => ({ ...formValues, programma: { value: '', label: 'Seleziona' }, progetto: { value: '', label: 'Seleziona' }, intervento: option }));
    }
    if (name?.name === 'programma') {
      setFormValues(() => ({ ...formValues, progetto: { value: '', label: 'Seleziona' }, programma: option }));
      if (formValues.intervento.value.length > 0)
        retriveProgetto(formValues.intervento.value, Number(option.value));
      else
        retriveProgetto('', Number(option.value));
    }
  };

  const handleClearForm = () => {
    setFormValues(initialFormValues);
    setIsDateValid({ dataInizio: true, dataFine: true });
    setChips([]);
    dispatch(retriveProgramma);
    dispatch(retriveProgetto);
    dispatch(GetEntitySearchValues({ entity: 'ente', criterioRicerca: "%" }));
    setChipsVisible(false);
  };

  const [enteInputValue, setEnteInputValue] = useState('');

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
          value={formValues[field]}
          menuPlacement={'auto'}
          placeholder={placeholder}
          //onMenuScrollToBottom={onMenuScrollToBottom}
          // color='primary'
          className={clsx(
            {
              'col-12 pl-0 ': isSearchable,
              'col-12 pl-0  ': !isSearchable,
              'deleteArrowInSelect': isDisabled || isSearchable || !isSearchable,
              'customArrowSelect': !isSearchable && !isDisabled
            }
          )}
          classNamePrefix={clsx(
            shortDropdownMenu ? 'bootstrap-select-short' : 'bootstrap-select'
          )}
          aria-labelledby={`${(label || 'label select').replace(/\s/g, '-')}`}
          isDisabled={isDisabled}
          isSearchable={isSearchable}
          openMenuOnClick={!isSearchable}
          {...(isSearchable && { menuIsOpen: enteInputValue.length > 3 })}
          onInputChange={(value) => setEnteInputValue(value)}
        />
      </div>
    )
  };

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
    if (formValues.ente.value) {
      newChips.push(`Ente: ${formValues.ente.label}`);
    }
    setChips(newChips);
  }, [formValues]);


  function handleSubmitFiltri(): void {
    onSearch();
    setChipsVisible(true);
  }

  return (
    <Form id='form-categories' className='mt-3 pb-5'>
      <Form.Row className='justify-content-between px-0 px-lg-5 mx-2'>
        {renderSelect('ente', 'Ente', multiOptions, true, handleSelectChange,
           "Inizia a scrivere il nome dell'ente...",
            formValues?.intervento?.value != '' || formValues?.programma?.value != '' || formValues?.progetto?.value != '')}
        {renderSelect('intervento', 'Intervento', [
          { value: 'rfd', label: 'RFD' },
          { value: 'scd', label: 'SCD' },
        ], false, handleSelectChange, "Seleziona", formValues?.ente?.value?.length > 0)}
      </Form.Row>

      <Form.Row className='justify-content-between px-0 px-lg-5 mx-2'>
        {renderSelect('progetto', 'Progetto', (projectTypes || []).map((type: any) => ({
          value: type.value,
          label: type.label,
        })), false, handleSelectChange, "Seleziona", formValues?.ente?.value?.length > 0)}
        {renderSelect('programma', 'Programma', (programTypes || []).map((type: any) => ({
          value: type.value,
          label: type.label,
        })), false, handleSelectChange, "Seleziona", formValues?.ente?.value?.length > 0)}
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
            {...(isDateValid.dataInizio !== undefined ? { valid: isDateValid.dataInizio } : {})}
            id='dateInputDataInizio'
            className={isDateValid.dataInizio === false ? 'dateInputDataInizio--isNotValid' : 'dateInputDataInizio'}
          />
          <Input
            value={formValues.dataFine.value}
            type='date'
            label='Data fine'
            col='col-12 col-lg-6'
            onInputChange={(value) => handleDateInputChange(value, 'dataFine')}
            minimum={formValues.dataFine.minimum}
            maximum={formValues.dataFine.maximum}
            {...(isDateValid.dataFine !== undefined ? { valid: isDateValid.dataFine } : {})}
            id='dateInputDataFine'
            className={isDateValid.dataFine === false ? 'dateInputDataFine--isNotValid' : 'dateInputDataFine mb-2'}
            validationText='La data di fine non può essere antecendente alla data di inizio'
            />
      </Form.Row>

      <Form.Row className='justify-content-end'>
        <Button color='secondary' className='mr-2' id='cancellaFiltri' onClick={handleClearForm}>
          Cancella filtri
        </Button>
        <Button color='primary' id='applicaFiltri' onClick={handleSubmitFiltri} disabled={!isDateValid.dataInizio || !isDateValid.dataFine}>
          Applica filtri
        </Button>
      </Form.Row>


    </Form>
  );
};

export default MonitoringSearchFilters;

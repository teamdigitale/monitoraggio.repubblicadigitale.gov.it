import React, { useEffect } from 'react';
import { Form, Input, Select } from '../../../components';
import withFormHandler, {
  withFormHandlerProps,
} from '../../../hoc/withFormHandler';
import { selectPrograms } from '../../../redux/features/administrativeArea/administrativeAreaSlice';
import { selectProfile } from '../../../redux/features/user/userSlice';
import { useAppSelector } from '../../../redux/hooks';
import { formatDateAsMomentString } from '../../../utils/common';
import {
  formFieldI,
  FormHelper,
  newForm,
  newFormField,
} from '../../../utils/formHelper';
import { RegexpType } from '../../../utils/validator';
import { useDispatch } from 'react-redux';
import { GetConfigurazioneMinorenni } from '../../../redux/features/citizensArea/citizensAreaThunk';
import { useParams } from 'react-router-dom';
import { Button, FormGroup, Icon, Label, UncontrolledTooltip } from 'design-react-kit';

interface ProgramInformationI {
  formDisabled?: boolean;
  sendNewValues?: (param?: { [key: string]: formFieldI['value'] }) => void;
  setIsFormValid?: (param?: boolean | undefined) => void;
  creation?: boolean;
  edit?: boolean;
  legend?: string | undefined;
}

interface FormEnteGestoreProgettoFullInterface
  extends withFormHandlerProps,
    ProgramInformationI {
  intoModal?: boolean;
}
const FormGeneralInfo: React.FC<FormEnteGestoreProgettoFullInterface> = (
  props
) => {
  const {
    form,
    updateForm = () => ({}),
    onInputChange = () => ({}),
    sendNewValues = () => ({}),
    isValidForm,
    setIsFormValid = () => false,
    getFormValues = () => ({}),
    creation = true,
    edit = false,
    formDisabled = false,
    legend = '',
  } = props;
  const programDetails: { [key: string]: string } | undefined =
    useAppSelector(selectPrograms).detail.dettagliInfoProgramma;

  const { entityId } = useParams();
  const userRole = useAppSelector(selectProfile)?.codiceRuolo;
  const dispatch = useDispatch();
  const [showMinorenni, setShowMinorenni] = React.useState(false);

  useEffect(() => {
    setIsFormValid(isValidForm);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form]);

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
  }, [formDisabled]);

  useEffect(() => {
    if (programDetails && form) {
      const currentFormFieldList: formFieldI[] = Object.entries(programDetails)
        .filter(
          ([key, _val]) => !key.includes('Target') && !key.includes('stato')
        )
        .map(([key, value]) =>
          newFormField({
            ...form[key],
            value: value,
          })
        );

      updateForm(newForm(currentFormFieldList));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [programDetails]);

  useEffect(() => {
    if (userRole && form && creation) {
      if (userRole === 'DSCU') onInputDataChange('SCD', 'policy');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userRole]);

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
      let newForm = {
        ...form,
        [field]: {
          ...form[field],
          value,
        },
      };

      newForm = FormHelper.onInputChange(
        {
          ...newForm,
          dataInizio: {
            ...form.dataInizio,
            maximum: formatDateAsMomentString(form?.dataFine.value as string),
          },
          dataFine: {
            ...form.dataFine,
            minimum: formatDateAsMomentString(form?.dataInizio.value as string),
          },
        },
        value,
        field
      );

      updateForm({
        ...newForm,
        dataInizio: {
          ...newForm.dataInizio,
          maximum: formatDateAsMomentString(newForm?.dataFine.value as string),
        },
        dataFine: {
          ...newForm.dataFine,
          minimum: formatDateAsMomentString(newForm?.dataInizio.value as string),
        },
      });
    }
  };

  useEffect(() => {
    if (form?.dataInizio?.maximum)
      onInputDataChange(form?.dataInizio?.value, form?.dataInizio?.field);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form?.dataInizio?.maximum]);
  useEffect(() => {
    if (form?.dataFine?.minimum)
      onInputDataChange(form?.dataFine?.value, form?.dataFine?.field);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form?.dataFine?.minimum]);

  useEffect(() => {
    sendNewValues(getFormValues());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form]);

  const getMinorenniInfo = async () => {
      if(entityId){
        const config = await GetConfigurazioneMinorenni(undefined, entityId)(dispatch);
        const today = new Date();
        const decorrenzaDate = new Date(config.dataDecorrenza);
        if (config.id != null && today >= decorrenzaDate) {
          setShowMinorenni(true);
        }
      }
  };

  useEffect(() => {
    getMinorenniInfo();
  }, []);

  const bootClass = 'justify-content-between px-0 px-lg-5 mx-2';

  return (
    <Form
      legend={legend}
      id='form-general-info'
      className={formDisabled ? 'mt-5 mb-5' : 'mt-3'}
      formDisabled={formDisabled}
      customMargin='mb-3 pb-3 ml-3'
    >
      <Form.Row className={bootClass}>
        <Input
          {...form?.codice}
          required
          col='col-12 col-lg-6'
          label='ID'
          onInputChange={onInputDataChange}
        />
        <Input
          {...form?.nome}
          required
          col='col-12 col-lg-6'
          label='Nome programma'
          onInputChange={onInputDataChange}
        />
        <Input
          {...form?.nomeBreve}
          required
          col='col-12 col-lg-6'
          label='Nome breve'
          onInputChange={onInputDataChange}
        />
        {formDisabled ? (
          <Input
            {...form?.policy}
            label='Intervento'
            col='col-12 col-lg-6'
            onInputChange={onInputDataChange}
          />
        ) : (
          <Select
            isDisabled={(!creation && !edit) || userRole === 'DSCU'}
            {...form?.policy}
            required
            value={form?.policy.value as string}
            col='col-12 col-lg-6'
            label='Intervento'
            placeholder='Inserisci intervento'
            options={[
              { label: 'RFD', value: 'RFD' },
              { label: 'SCD', value: 'SCD' },
            ]}
            onInputChange={onInputDataChange}
            wrapperClassName='mb-5 pr-lg-3'
            aria-label='intervento'
          />
        )}
        {form?.policy?.value === 'SCD' || !form?.policy?.value ? (
          <Input
            {...form?.bando}
            label='Bando'
            col='col-12 col-lg-6'
            onInputChange={onInputDataChange}
          />
        ) : (
          <span></span>
        )}
        <Input
          {...form?.cup}
            label={programDetails && programDetails.cupManipolato ? 'CUP - Codice Unico Progetto (manipolato da sistema)' :'CUP - Codice Unico Progetto'}
            col='col-12 col-lg-6'
            onInputChange={(value, field) => {
            if (typeof value === 'string') {
              const formattedValue = value.trim().replace(/\s+/g, '').toUpperCase();              
              onInputChange(formattedValue, field);
            } else {
              onInputChange(value, field);
            }
            }}
          />
          <Input
          {...form?.dataInizio}
          required
          label='Data inizio'
          type='date'
          col='col-12 col-lg-6'
          onInputChange={onDateChange}
        />
        <Input
          {...form?.dataFine}
          required
          label='Data fine'
          type='date'
          col='col-12 col-lg-6'
          onInputChange={onDateChange}
        />
        {showMinorenni ? (
          <FormGroup check className='col-12 col-lg-12'>
            <Input
              checked={true}
              disabled
              id="disabled-checkbox2"
              type="checkbox"
            />
            <Label
              check
              for="disabled-checkbox2"
            >
              Gestione CF minori
            </Label>
            <Button
              className='p-0'
              aria-label='Informazioni'
              id='icon-info'
              style={{ minWidth: '30px' }}
            >
              <Icon
              icon='it-info-circle'
              color='primary'
              aria-label='Info'
              aria-hidden
              style={{ width: '20px'}}
              />
            </Button>
            <UncontrolledTooltip
              placement='top'
              target='icon-info'
            >
              Indica che è possibile associare ai servizi cittadini a partire dai 14 anni di età
            </UncontrolledTooltip>
          </FormGroup>
        ) : <></>}
      </Form.Row>
    </Form> 
  );
};

const form = newForm([
  newFormField({
    field: 'codice',
    type: 'text',
    id: 'codice',
    required: true,
  }),
  newFormField({
    field: 'stato',
    type: 'text',
    id: 'stato',
  }),
  newFormField({
    field: 'cup',
    type: 'text',
    id: 'cup',
  }),
  newFormField({
    field: 'nome',
    type: 'text',
    id: 'nome',
    required: true,
  }),
  newFormField({
    field: 'bando',
    type: 'text',
    id: 'bando',
  }),
  newFormField({
    field: 'policy',
    type: 'text',
    id: 'policy',
    required: true,
  }),
  newFormField({
    field: 'nomeBreve',
    type: 'text',
    id: 'nomeBreve',
    required: true,
    maximum: 25,
    //minimum: 6,
  }),
  newFormField({
    field: 'dataInizio',
    regex: RegexpType.DATE,
    required: true,
    type: 'date',
    id: 'dataInizio',
  }),
  newFormField({
    field: 'dataFine',
    regex: RegexpType.DATE,
    required: true,
    type: 'date',
    id: 'dataFine',
  }),
]);

export default withFormHandler({ form }, FormGeneralInfo);

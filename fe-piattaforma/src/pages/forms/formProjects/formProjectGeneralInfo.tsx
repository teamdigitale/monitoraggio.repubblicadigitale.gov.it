import React, { useEffect } from 'react';
import { Form, Input } from '../../../components';
import withFormHandler, {
  withFormHandlerProps,
} from '../../../hoc/withFormHandler';
import { selectProjects } from '../../../redux/features/administrativeArea/administrativeAreaSlice';
import { useAppSelector } from '../../../redux/hooks';
import { formatDateAsMomentString } from '../../../utils/common';
import {
  formFieldI,
  FormHelper,
  FormI,
  newForm,
  newFormField,
} from '../../../utils/formHelper';
import { RegexpType } from '../../../utils/validator';
import { useDispatch } from 'react-redux';
import { GetConfigurazioneMinorenni } from '../../../redux/features/citizensArea/citizensAreaThunk';
import { Button, FormGroup, Icon, Label, UncontrolledTooltip } from 'design-react-kit';

interface ProgramInformationI {
  formDisabled?: boolean;
  sendNewValues?: (param?: { [key: string]: formFieldI['value'] }) => void;
  setIsFormValid?: (param?: boolean | undefined) => void;
  creation?: boolean;
  program?: { dataInizio: string; dataFine: string } | undefined;
  legend?: string | undefined;
}

interface FormProjectGeneralInfoInterface
  extends withFormHandlerProps,
    ProgramInformationI {
  intoModal?: boolean;
}
const FormProjectGeneralInfo: React.FC<FormProjectGeneralInfoInterface> = (
  props
) => {
  const {
    form,
    onInputChange = () => ({}),
    sendNewValues = () => ({}),
    isValidForm,
    setIsFormValid = () => false,
    getFormValues = () => ({}),
    creation = false,
    updateForm = () => ({}),
    program,
    legend = '',
  } = props;

  const formDisabled = !!props.formDisabled;

  const projectDetails: { [key: string]: string } | undefined =
    useAppSelector(selectProjects).detail?.dettagliInfoProgetto;
  const programProjectDetails =
    useAppSelector(selectProjects).detail?.dettagliInfoProgramma;
  const programDetails = programProjectDetails || program;

  

  const dispatch = useDispatch();
  const [showMinorenni, setShowMinorenni] = React.useState(false);

  const getMinorenniInfo = async () => {
    if (programDetails) {
      const config = await GetConfigurazioneMinorenni(undefined, programDetails.id)(dispatch);
      const today = new Date();
      const decorrenzaDate = new Date(config.dataDecorrenza);
      if (config.id != null && today >= decorrenzaDate) {
        setShowMinorenni(true);
      }
    }
  };

  useEffect(() => {
    getMinorenniInfo();
  }, [programDetails]);

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
  }, [formDisabled, form]);

  useEffect(() => {
    if (projectDetails && form) {
      const currentFormFieldList: formFieldI[] = Object.entries(projectDetails)
        .filter(
          ([key, _val]) => !key.includes('Target') && !key.includes('stato')
        )
        .map(([key, value]) =>
          newFormField({
            ...form[key],
            value: value,
          })
        );

      let filledForm: FormI = newForm(currentFormFieldList);

      if (
        programDetails?.dataInizio &&
        !(filledForm?.dataInizio?.minimum || filledForm?.dataInizio?.maximum)
      ) {
        filledForm = {
          ...filledForm,
          dataInizio: {
            ...filledForm.dataInizio,
            touched: false,
            minimum: formatDateAsMomentString(programDetails.dataInizio),
            maximum: formatDateAsMomentString(programDetails.dataFine),
          },
          dataFine: {
            ...filledForm.dataFine,
            touched: false,
            minimum: formatDateAsMomentString(programDetails.dataInizio),
            maximum: formatDateAsMomentString(programDetails.dataFine),
          },
        };
      }

      updateForm(filledForm);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectDetails]);

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
            minimum: creation
              ? program?.dataInizio
              : programDetails
              ? formatDateAsMomentString(programDetails.dataInizio)
              : undefined,
            maximum: creation
              ? form?.dataFine.value
                ? formatDateAsMomentString(form?.dataFine.value as string)
                : program?.dataFine
              : formatDateAsMomentString(form?.dataFine.value as string),
          },
          dataFine: {
            ...form.dataFine,
            minimum: creation
              ? form?.dataInizio.value
                ? formatDateAsMomentString(form?.dataInizio.value as string)
                : program?.dataInizio
              : formatDateAsMomentString(form?.dataInizio.value as string),
            maximum: creation
              ? program?.dataFine
              : programDetails
              ? formatDateAsMomentString(programDetails.dataFine)
              : undefined,
          },
        },
        value,
        field
      );

      updateForm({
        ...newForm,
        dataInizio: {
          ...newForm.dataInizio,
          minimum: creation
            ? program?.dataInizio
            : programDetails
            ? formatDateAsMomentString(programDetails.dataInizio)
            : undefined,
          maximum: creation
            ? newForm?.dataFine.value
              ? formatDateAsMomentString(newForm?.dataFine.value as string)
              : program?.dataFine
            : formatDateAsMomentString(newForm?.dataFine.value as string),
        },
        dataFine: {
          ...newForm.dataFine,
          minimum: creation
            ? newForm?.dataInizio.value
              ? formatDateAsMomentString(newForm?.dataInizio.value as string)
              : program?.dataInizio
            : formatDateAsMomentString(newForm?.dataInizio.value as string),
          maximum: creation
            ? program?.dataFine
            : programDetails
            ? formatDateAsMomentString(programDetails.dataFine)
            : undefined,
        },
      });
    }
  };

  useEffect(() => {
    if (form?.dataInizio?.maximum || form?.dataInizio?.minimum)
      onDateChange(form?.dataInizio?.value, form?.dataInizio?.field);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form?.dataInizio?.maximum, form?.dataInizio?.minimum]);
  useEffect(() => {
    if (form?.dataFine?.maximum || form?.dataFine?.minimum)
      onDateChange(form?.dataFine?.value, form?.dataFine?.field);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form?.dataFine?.maximum, form?.dataFine?.minimum]);

  useEffect(() => {
    sendNewValues(getFormValues());
    setIsFormValid(isValidForm);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form]);

  useEffect(() => {
    if (
      creation &&
      form &&
      !projectDetails &&
      programDetails?.dataInizio &&
      !(form?.dataInizio?.minimum || form?.dataInizio?.maximum)
    ) {
      updateForm({
        ...form,
        dataInizio: {
          ...form.dataInizio,
          touched: false,
          minimum: formatDateAsMomentString(programDetails.dataInizio),
          maximum: formatDateAsMomentString(programDetails.dataFine),
        },
        dataFine: {
          ...form.dataFine,
          touched: false,
          minimum: formatDateAsMomentString(programDetails.dataInizio),
          maximum: formatDateAsMomentString(programDetails.dataFine),
        },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    programDetails?.dataInizio,
    form?.dataInizio?.maximum,
    form?.dataInizio?.minimum,
    creation,
  ]);

  const bootClass = 'justify-content-between px-0 px-lg-5 mx-2';

  return (
    <Form
      id='form-project-general-info'
      className={formDisabled ? 'mt-5 mb-5' : 'mt-3'}
      formDisabled={formDisabled}
      legend={legend}
      customMargin='mb-3 pb-3 ml-3'
    >
      <Form.Row className={bootClass}>
        {formDisabled ? (
          <Input
            {...form?.id}
            col='col-12 col-lg-6'
            label='ID'
            onInputChange={onInputDataChange}
          />
        ) : (
          <span className='sr-only' />
        )}
        <Input
          {...form?.nome}
          required
          col='col-12 col-lg-6'
          label='Nome progetto'
          onInputChange={onInputDataChange}
        />
        <Input
          {...form?.nomeBreve}
          required
          col='col-12 col-lg-6'
          label='Nome breve'
          onInputChange={onInputDataChange}
        />
        <Input
          {...form?.cup}
          label={projectDetails && projectDetails.cupManipolato ? 'CUP - Codice Unico Progetto (manipolato da sistema)' :'CUP - Codice Unico Progetto'}
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
          col='col-12 col-lg-6'
          onInputChange={onDateChange}
        />
        <Input
          {...form?.dataFine}
          required
          label='Data fine'
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
                style={{ width: '20px' }}
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
    field: 'id',
    type: 'text',
    id: 'project-name',
  }),
  newFormField({
    field: 'nome',
    type: 'text',
    id: 'project-name',
    required: true,
  }),
  newFormField({
    field: 'nomeBreve',
    type: 'text',
    id: 'short-name',
    required: true,
    maximum: 25,
    //minimum: 6,
  }),
  newFormField({
    field: 'cup',
    type: 'text',
  }),
  newFormField({
    field: 'dataInizio',
    regex: RegexpType.DATE,
    type: 'date',
    required: true,
  }),
  newFormField({
    field: 'dataFine',
    regex: RegexpType.DATE,
    type: 'date',
    required: true,
  }),
]);

export default withFormHandler({ form }, FormProjectGeneralInfo);
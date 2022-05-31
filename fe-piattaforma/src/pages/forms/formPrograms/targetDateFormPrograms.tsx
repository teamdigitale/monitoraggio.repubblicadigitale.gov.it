import clsx from 'clsx';
import isEqual from 'lodash.isequal';
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { Form, Input } from '../../../components';
import withFormHandler, {
  withFormHandlerProps,
} from '../../../hoc/withFormHandler';
import { selectProgrammi } from '../../../redux/features/administrativeArea/administrativeAreaSlice';
import { GetProgramDetail } from '../../../redux/features/administrativeArea/programs/programsThunk';
import { useAppSelector } from '../../../redux/hooks';
import { formFieldI, newForm, newFormField } from '../../../utils/formHelper';
import { RegexpType } from '../../../utils/validator';

interface ProgramInformationI {
  formDisabled?: boolean;
  sendNewValues?: (param?: { [key: string]: formFieldI['value'] }) => void;
  setIsFormValid?: (param: boolean | undefined) => void;
  creation?: boolean;
}

export enum formForSectionEnum {
  facilitationNumber = 'facilitationNumber',
  uniqueUsers = 'uniqueUsers',
  services = 'services',
  facilitators = 'facilitators',
}

interface TargetDateFormProgramsI
  extends withFormHandlerProps,
    ProgramInformationI {
  formForSection:
    | 'facilitationNumber'
    | 'uniqueUsers'
    | 'services'
    | 'facilitators';
}

const TargetDateFormPrograms: React.FC<TargetDateFormProgramsI> = (props) => {
  const {
    setFormValues = () => ({}),
    form,
    formForSection,
    onInputChange,
    sendNewValues,
    isValidForm,
    setIsFormValid,
    getFormValues = () => ({}),
    creation = false,
    updateForm = () => ({}),
    clearForm = () => ({}),
  } = props;
  const { firstParam } = useParams();

  const formDisabled = !!props.formDisabled;

  const formData: { [key: string]: string } | undefined =
    useAppSelector(selectProgrammi).detail?.dettaglioProgramma?.[
      formForSection
    ];

  const dispatch = useDispatch();

  useEffect(() => {
    clearForm();
  }, [formForSection]);

  useEffect(() => {
    if (!creation) {
      dispatch(GetProgramDetail(firstParam || ''));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [creation]);

  useEffect(() => {
    setIsFormValid?.(isValidForm);
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form]);

  useEffect(() => {
    if (formData && !creation) {
      setFormValues(formData);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData]);

  const onInputDataChange = (
    value: formFieldI['value'],
    field?: formFieldI['field']
  ) => {
    onInputChange?.(value, field);
    setIsFormValid?.(isValidForm);
  };

  const updateRequiredFields = () => {
    if (form) {
      const newFormList: formFieldI[] = [];
      const values = getFormValues();
      Object.keys(values).forEach((field) => {
        const manageField = `${
          field.includes('data')
            ? `${field.replace('data', '')}`
            : `${field}data`
        }`;
        newFormList.push(
          newFormField({
            ...form[manageField],
            field: manageField,
            required: !!values[field],
          })
        );
      });
      if (!isEqual(form, newForm(newFormList))) {
        updateForm(newForm(newFormList));
      }
    }
  };

  useEffect(() => {
    updateRequiredFields();
  }, []);
  useEffect(() => {
    sendNewValues?.(getFormValues?.());
    updateRequiredFields();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form]);

  const disabledFormClass = 'px-0 mr-lg-5 pr-lg-5 pl-lg-4 mr-3';
  const activeFormClass = 'justify-content-between px-0 px-lg-5 mx-5';

  return (
    <div>
      <Form
        className={clsx(formDisabled ? 'mt-3 pb-1' : 'mt-4 pb-1')}
        formDisabled={formDisabled}
      >
        <Form.Row
          className={clsx(formDisabled ? disabledFormClass : activeFormClass)}
        >
          <Input
            {...form?.targetMesi1}
            col='col-12 col-lg-6'
            label='Valore Target a 1 mese'
            onInputChange={(value, field) => {
              onInputDataChange(value, field);
            }}
            className='pr-lg-4'
          />
          <Input
            {...form?.targetMesi1data}
            col='col-12 col-lg-6'
            label='Seleziona data'
            onInputChange={(value, field) => {
              onInputDataChange(value, field);
            }}
            className='pl-lg-4'
          />
        </Form.Row>
        <Form.Row
          className={clsx(formDisabled ? disabledFormClass : activeFormClass)}
        >
          <Input
            {...form?.targetMesi18}
            col='col-12 col-lg-6'
            label='Valore Target a 18 mesi'
            onInputChange={(value, field) => {
              onInputDataChange(value, field);
            }}
            className='pr-lg-4'
          />
          <Input
            {...form?.targetMesi18data}
            label='Seleziona data'
            col='col-12 col-lg-6'
            onInputChange={(value, field) => {
              onInputDataChange(value, field);
            }}
            className='pl-lg-4'
          />
        </Form.Row>
        <Form.Row
          className={clsx(formDisabled ? disabledFormClass : activeFormClass)}
        >
          <Input
            {...form?.targetMesi30}
            label='Valore Target a 30 mesi'
            col='col-12 col-lg-6'
            onInputChange={(value, field) => {
              onInputDataChange(value, field);
            }}
            className='pr-lg-4'
          />

          <Input
            {...form?.targetMesi30data}
            label='Seleziona data'
            col='col-12 col-lg-6'
            onInputChange={(value, field) => {
              onInputDataChange(value, field);
            }}
            className='pl-lg-4'
          />
        </Form.Row>
        <Form.Row
          className={clsx(formDisabled ? disabledFormClass : activeFormClass)}
        >
          <Input
            {...form?.targetMesi42}
            label='Valore Target a 42 mesi'
            col='col-12 col-lg-6'
            onInputChange={(value, field) => {
              onInputDataChange(value, field);
            }}
            className='pr-lg-4'
          />

          <Input
            {...form?.targetMesi42data}
            label='Seleziona data'
            col='col-12 col-lg-6'
            onInputChange={(value, field) => {
              onInputDataChange(value, field);
            }}
            className='pl-lg-4'
          />
        </Form.Row>
        <Form.Row
          className={clsx(formDisabled ? disabledFormClass : activeFormClass)}
        >
          <Input
            {...form?.targetGiugno2025}
            label='Valore Target a giugno 2025'
            col='col-12 col-lg-6'
            onInputChange={(value, field) => {
              onInputDataChange(value, field);
            }}
            className='pr-lg-4'
          />

          <Input
            {...form?.targetGiugno2025data}
            label='Seleziona data'
            col='col-12 col-lg-6'
            onInputChange={(value, field) => {
              onInputDataChange(value, field);
            }}
            className='pl-lg-4'
          />
        </Form.Row>
      </Form>
    </div>
  );
};

const form = newForm([
  newFormField({
    field: 'targetMesi1',
    type: 'text',
    regex: RegexpType.STRING,
  }),
  newFormField({
    field: 'targetMesi1data',
    regex: RegexpType.DATE,
    type: 'date',
  }),
  newFormField({
    field: 'targetMesi18',
    type: 'text',
    regex: RegexpType.STRING,
  }),
  newFormField({
    field: 'targetMesi18data',
    regex: RegexpType.DATE,
    type: 'date',
  }),
  newFormField({
    field: 'targetMesi30',
    type: 'text',
    regex: RegexpType.STRING,
  }),
  newFormField({
    field: 'targetMesi30data',
    regex: RegexpType.DATE,
    type: 'date',
  }),
  newFormField({
    field: 'targetMesi42',
    type: 'text',
    regex: RegexpType.STRING,
  }),
  newFormField({
    field: 'targetMesi42data',
    regex: RegexpType.DATE,
    type: 'date',
  }),
  newFormField({
    field: 'targetGiugno2025',
    type: 'text',
    regex: RegexpType.STRING,
  }),
  newFormField({
    field: 'targetGiugno2025data',
    regex: RegexpType.DATE,
    type: 'date',
  }),
]);

export default withFormHandler({ form }, TargetDateFormPrograms);

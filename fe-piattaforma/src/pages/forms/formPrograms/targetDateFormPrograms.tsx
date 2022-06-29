import clsx from 'clsx';
import isEqual from 'lodash.isequal';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { Form, Input, EmptySection } from '../../../components';
import withFormHandler, {
  withFormHandlerProps,
} from '../../../hoc/withFormHandler';
import { selectPrograms } from '../../../redux/features/administrativeArea/administrativeAreaSlice';
import { GetProgramDetail } from '../../../redux/features/administrativeArea/programs/programsThunk';
import { useAppSelector } from '../../../redux/hooks';
import { formFieldI, newForm, newFormField } from '../../../utils/formHelper';
import { RegexpType } from '../../../utils/validator';
import { ButtonInButtonsBar } from '../../../components/ButtonsBar/buttonsBar';
import { useTranslation } from 'react-i18next';
import { Button, Icon } from 'design-react-kit';
import { selectDevice } from '../../../redux/features/app/appSlice';

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
  intoModal?: boolean;
}
const form = newForm([]);

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
    intoModal = false,
  } = props;
  const { firstParam } = useParams();

  const { t } = useTranslation();

  const formDisabled = !!props.formDisabled;

  const formData: { [key: string]: string } | undefined =
    useAppSelector(selectPrograms).detail?.dettaglioProgramma?.[formForSection];

  const dispatch = useDispatch();

  const device = useAppSelector(selectDevice);

  useEffect(() => {
    clearForm();
    setCount(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formForSection]);

  useEffect(() => {
    if (!creation) {
      dispatch(GetProgramDetail(firstParam || ''));
      const newFormList: formFieldI[] = [];
      newFormList.push(
        newFormField({
          field: `valoreObiettivo${count + 1}`,
          required: true,
          id: `${intoModal && 'modal-'}${formForSection}-valoreObiettivo${
            count + 1
          }`,
        }),
        newFormField({
          field: `valoreObiettivo${count + 1}data`,
          regex: RegexpType.DATE,
          required: true,
          type: 'date',
          id: `valoreObiettivo${count + 1}data`,
        })
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [creation]);

  useEffect(() => {
    if (form && Object.keys(form)?.length === 0) {
      setIsFormValid?.(!isValidForm);
    } else {
      setIsFormValid?.(isValidForm);
    }
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

  useEffect(() => {
    sendNewValues?.(getFormValues?.());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form]);

  const [count, setCount] = useState(0);

  const disabledFormClass = 'px-0 mr-lg-5 pr-lg-5 pl-lg-4 mr-3';
  const activeFormClass = 'justify-content-between px-0 px-lg-5 mx-5';

  const addMilestone = () => {
    setCount(count + 1);
    if (form) {
      const newFormList: formFieldI[] = [];
      newFormList.push(
        newFormField({
          field: `valoreObiettivo${count + 1}`,
          required: true,
          id: `${intoModal && 'modal-'}${formForSection}-valoreObiettivo${
            count + 1
          }`,
          label: `valore Obiettivo`,
          order: count + 1,
        }),
        newFormField({
          field: `valoreObiettivo${count + 1}data`,
          regex: RegexpType.DATE,
          required: true,
          type: 'date',
          id: `valoreObiettivo${count + 1}data`,
          label: `Data Obiettivo`,
          order: count + 1,
        })
      );
      if (!isEqual(form, newForm(newFormList))) {
        updateForm(newForm(newFormList));
      }
    }
  };

  const removeMilestone = (row: string) => {
    if (form) {
      const fieldToDelete = [row, row.replace('data', '')];
      const newFormList = { ...form };
      fieldToDelete.forEach((field) => {
        delete newFormList[field];
      });
      updateForm(newFormList, true);
      setCount(count - 1);
    }
  };

  const emptyButton: ButtonInButtonsBar[] = [
    {
      size: 'xs',
      color: 'primary',
      text: t('add_milestone'),
      onClick: () => {
        addMilestone();
      },
    },
  ];

  useEffect(() => {
    if (formData) {
      setFormValues(formData);
      let tmp: formFieldI[] = [];
      for (const [key, value] of Object.entries(formData)) {
        tmp = [...tmp, { field: key, value, required: false }];
      }
      let arr: formFieldI[] = [];
      for (const [key, value] of Object.entries(formData)) {
        const obj = newFormField({
          field: key,
          value,
          required: false,
        });
        arr = [...arr, obj];
      }
      updateForm(newForm([...arr]));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData]);

  return count === 0 && creation ? (
    <EmptySection
      title='Questa sezione è ancora vuota'
      subtitle='Crea un target di valori degli obiettivi'
      buttons={emptyButton}
    />
  ) : (
    <div>
      <Form
        className={clsx(formDisabled ? 'mt-3 pb-1' : 'mt-4 pb-1')}
        formDisabled={formDisabled}
      >
        {form && (
          <>
            <Form.Row
              className={clsx(
                formDisabled ? disabledFormClass : activeFormClass,
                'mb-4'
              )}
            >
              {form &&
                Object.keys(form).map((row, index) => (
                  <>
                    <Input
                      {...form?.[row]}
                      id={`${form?.[row].field}-${new Date().getTime()}`}
                      col='col-12 col-lg-5'
                      onInputChange={(value, field) => {
                        onInputDataChange(value, field);
                      }}
                      className='pr-lg-4 mb-4'
                      key={index}
                      aria-label={`${form?.[row].field}`}
                    />
                    {creation && row.includes('data') && (
                      <Button
                        className='p-0'
                        icon
                        style={{ minWidth: 'unset', height: '45px' }}
                        onClick={() => removeMilestone(row)}
                      >
                        <Icon
                          className='mr-3'
                          icon='it-delete'
                          color='primary'
                          size='sm'
                          aria-label='delete'
                        ></Icon>
                        {!device.mediaIsDesktop && 'Elimina'}
                      </Button>
                    )}
                  </>
                ))}
            </Form.Row>
            {count < 5 && creation && (
              <Form.Row
                className={clsx(
                  formDisabled ? disabledFormClass : activeFormClass,
                  'mb-4'
                )}
              >
                <Button className='pl-0' icon onClick={() => addMilestone()}>
                  <Icon
                    size='sm'
                    color='primary'
                    icon='it-plus-circle'
                    aria-label={t('add_goal')}
                  />
                  <span
                    className={clsx(
                      'h6',
                      'ml-2',
                      'mb-0',
                      'font-weight-normal',
                      'font-italic'
                    )}
                  >
                    {t('add_goal')}
                  </span>
                </Button>
              </Form.Row>
            )}
          </>
        )}
      </Form>
    </div>
  );
};

export default withFormHandler({ form: form }, TargetDateFormPrograms);

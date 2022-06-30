import clsx from 'clsx';
import { Button, Icon } from 'design-react-kit';
import isEqual from 'lodash.isequal';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { EmptySection, Form, Input } from '../../../components';
import { ButtonInButtonsBar } from '../../../components/ButtonsBar/buttonsBar';
import withFormHandler, {
  withFormHandlerProps,
} from '../../../hoc/withFormHandler';
import { selectProjects } from '../../../redux/features/administrativeArea/administrativeAreaSlice';
import { GetProjectDetail } from '../../../redux/features/administrativeArea/projects/projectsThunk';
import { selectDevice } from '../../../redux/features/app/appSlice';
import { useAppSelector } from '../../../redux/hooks';
import { formFieldI, newForm, newFormField } from '../../../utils/formHelper';
import { RegexpType } from '../../../utils/validator';
import { formForSectionT } from '../formPrograms/targetDateFormPrograms';

interface ProgramInformationI {
  formDisabled?: boolean;
  sendNewValues?: (param?: { [key: string]: formFieldI['value'] }) => void;
  setIsFormValid?: (param: boolean | undefined) => void;
  creation?: boolean;
}

interface TargetDateFormProjectsI
  extends withFormHandlerProps,
    ProgramInformationI {
  formForSection: formForSectionT;
  intoModal?: boolean;
}

const TargetDateFormProjects: React.FC<TargetDateFormProjectsI> = (props) => {
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

  const formDisabled = !!props.formDisabled;

  const projectDetail =
    useAppSelector(selectProjects).detail?.dettagliInfoProgetto;

  const [formData, setFormData] = useState<
    { [key: string]: string } | undefined
  >();

  const dispatch = useDispatch();

  useEffect(() => {
    clearForm();
    setCount(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formForSection]);

  const { t } = useTranslation();

  const device = useAppSelector(selectDevice);

  useEffect(() => {
    if (!creation) {
      dispatch(GetProjectDetail(firstParam || ''));
      const newFormList: formFieldI[] = [];
      newFormList.push(
        newFormField({
          field: `n${formForSection}Target${count + 1}`,
          required: true,
          id: `${intoModal && 'modal-'}${formForSection}-valoreObiettivo${
            count + 1
          }`,
        }),
        newFormField({
          field: `n${formForSection}DataTarget${count + 1}`,
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

  useEffect(() => {
    if (projectDetail && formForSection) {
      setFormData(
        Object.fromEntries(
          Object.keys(projectDetail)
            .filter((key) => key.includes(formForSection) && projectDetail[key])
            .map((key) => [key, projectDetail[key] as string])
        )
      );
    }
  }, [projectDetail, formForSection]);

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
          field: `n${formForSection}Target${count + 1}`,
          required: true,
          id: `${intoModal && 'modal-'}${formForSection}-valoreObiettivo${
            count + 1
          }`,
          label: `valore Obiettivo`,
          order: count + 1,
        }),
        newFormField({
          field: `n${formForSection}DataTarget${count + 1}`,
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

const form = newForm([]);

export default withFormHandler({ form }, TargetDateFormProjects);

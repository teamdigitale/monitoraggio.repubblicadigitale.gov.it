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
export type formForSectionT =
  | 'puntiFacilitazione'
  | 'utentiUnici'
  | 'servizi'
  | 'facilitatori';

interface TargetDateFormProgramsI
  extends withFormHandlerProps,
    ProgramInformationI {
  formForSection: formForSectionT;
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

  const programDetail =
    useAppSelector(selectPrograms).detail?.dettagliInfoProgramma;

  const [formData, setFormData] = useState<
    { [key: string]: string } | undefined
  >();

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
          field: `n${formForSection}Target${count + 1}`,
          required: true,
          type: 'number',
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
    if (programDetail && formForSection) {
      setFormData(
        Object.fromEntries(
          Object.keys(programDetail)
            .filter((key) => key.includes(formForSection) && programDetail[key])
            .map((key) => [key, programDetail[key] as string])
        )
      );
    }
  }, [programDetail, formForSection]);

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

  const disabledFormClass = 'justify-content-between  px-0 px-lg-5 mx-5';
  const activeFormClass = 'justify-content-between px-0 px-lg-5 mx-5';

  const addMilestone = () => {
    setCount(count + 1);
    if (form) {
      const newFormList: formFieldI[] = [];
      newFormList.push(
        newFormField({
          field: `n${formForSection}Target${count + 1}`,
          required: true,
          type: 'number',
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

  const removeMilestone = (row: string[]) => {
    if (form) {
      const newFormList = { ...form };
      row.forEach((field) => {
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

  let rows: string[][] = [];

  if (form) {
    const targets: string[] = [];
    const dates: string[] = [];

    Object.keys(form).forEach((key) =>
      key.includes('Data') ? dates.push(key) : targets.push(key)
    );

    rows = targets.map((target, index) => [target, dates[index]]);
  }

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
            {rows.map((row, index) => (
              <Form.Row
                key={index}
                className={clsx(
                  formDisabled ? disabledFormClass : activeFormClass,
                  'mb-4'
                )}
              >
                <Input
                  {...form?.[row[0]]}
                  id={`${form?.[row[0]].field}-${new Date().getTime()}`}
                  onInputChange={(value, field) => {
                    onInputDataChange(value, field);
                  }}
                  col='col-12 col-lg-5'
                  className='pr-lg-3'
                  key={index}
                  aria-label={`${form?.[row[0]].field}`}
                />
                <Input
                  {...form?.[row[1]]}
                  id={`${form?.[row[1]].field}-${new Date().getTime()}`}
                  onInputChange={(value, field) => {
                    onInputDataChange(value, field);
                  }}
                  col='col-12 col-lg-5'
                  className='pl-lg-3'
                  key={index}
                  aria-label={`${form?.[row[1]].field}`}
                />

                {creation ? (
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
                ) : (
                  <span></span>
                )}
              </Form.Row>
            ))}
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

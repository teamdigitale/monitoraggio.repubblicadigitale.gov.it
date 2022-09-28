import clsx from 'clsx';
import { Button, Icon } from 'design-react-kit';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import withFormHandler, {
  withFormHandlerProps,
} from '../../../../../hoc/withFormHandler';
import { selectDevice } from '../../../../../redux/features/app/appSlice';
import { useAppSelector } from '../../../../../redux/hooks';
import { filterObjectByKey } from '../../../../../utils/common';
import {
  formFieldI,
  FormI,
  newForm,
  newFormField,
} from '../../../../../utils/formHelper';
import { RegexpType } from '../../../../../utils/validator';
import EmptySection from '../../../../EmptySection/emptySection';
import Form from '../../../../Form/form';
import Input from '../../../../Form/input';

interface TargetsFormI extends withFormHandlerProps {
  disabled?: boolean;
  entityDetail?: any;
  sendValues?: (param?: { [key: string]: formFieldI['value'] }) => void;
  setIsFormValid?: (param: boolean | undefined) => void;
  section: SectionT;
  maxTargets?: number;
}

export type SectionT =
  | 'puntiFacilitazione'
  | 'utentiUnici'
  | 'servizi'
  | 'facilitatori';

const TargetsForm = ({
  form,
  disabled = false,
  entityDetail,
  section,
  maxTargets = 5,
  isValidForm,
  setIsFormValid = () => ({}),
  sendValues = () => ({}),
  getFormValues = () => ({}),
  onInputChange,
  updateForm = () => ({}),
}: TargetsFormI) => {
  const [targetsDetails, setTargetsDetails] = useState({});
  const [targetsCount, setTargetsCount] = useState(0);
  const { t } = useTranslation();
  const device = useAppSelector(selectDevice);

  useEffect(() => {
    updateForm(newForm([]), true);
    if (entityDetail) {
      setTargetsDetails(filterObjectByKey(entityDetail, section));
    }
  }, [entityDetail, section]);

  useEffect(() => {
    if (targetsDetails) {
      const currentFormFieldList: formFieldI[] = Object.entries(
        targetsDetails
      ).map(([key, value]) =>
        newFormField({
          field: key,
          regex: key.includes('Data') ? RegexpType.DATE : RegexpType.NUMBER,
          required: true,
          value: value as string,
          type: key.includes('Data') ? 'date' : 'number',
          id: key,
          label: `${key.includes('Data') ? 'Data' : 'Valore'} Obiettivo ${
            key[key.length - 1]
          }`,
          order: key[key.length - 1],
        })
      );

      updateForm(newForm(currentFormFieldList));

      const currentCount = Object.keys(targetsDetails).filter(
        (key) => !key.includes('Data')
      );

      setTargetsCount(currentCount.length);
    }
  }, [targetsDetails]);

  useEffect(() => {
    sendValues(getFormValues());
    setIsFormValid(isValidForm);
  }, [form]);

  const addTarget = () => {
    setTargetsCount((prev) => prev + 1);
    const newFormFieldList: formFieldI[] = [];
    newFormFieldList.push(
      newFormField({
        field: `n${section}Target${targetsCount + 1}`,
        required: true,
        type: 'number',
        id: `n${section}Target${targetsCount + 1}`,
        label: `Valore obiettivo ${targetsCount + 1}`,
      }),
      newFormField({
        field: `n${section}DataTarget${targetsCount + 1}`,
        regex: RegexpType.DATE,
        required: true,
        type: 'date',
        id: `n${section}DataTarget${targetsCount + 1}`,
        label: `Data obiettivo ${targetsCount + 1}`,
        order: targetsCount + 1,
      })
    );
    updateForm(newForm(newFormFieldList));
  };

  const removeTarget = (row: string[]) => {
    if (form) {
      let newFormList = Object.fromEntries(
        Object.entries(form)
          .filter(([key]) => !row.includes(key))
          .sort(
            ([key_a], [key_b]) =>
              parseInt(key_a[key_a.length - 1]) -
              parseInt(key_b[key_b.length - 1])
          )
      );

      const dataTargets = Object.fromEntries(
        Object.entries(newFormList)
          .filter(([key]) => key.includes('Data'))
          .map(([, value], i) => [
            `n${section}DataTarget${i + 1}`,
            {
              ...value,
              field: `n${section}DataTarget${i + 1}`,
              id: `n${section}DataTarget${i + 1}`,
              label: `Data obiettivo ${i + 1}`,
            },
          ])
      );

      const targets = Object.fromEntries(
        Object.entries(newFormList)
          .filter(([key]) => !key.includes('Data'))
          .map(([, value], i) => [
            `n${section}Target${i + 1}`,
            {
              ...value,
              field: `n${section}Target${i + 1}`,
              id: `n${section}Target${i + 1}`,
              label: `Valore obiettivo ${i + 1}`,
            },
          ])
      );

      newFormList = { ...targets, ...dataTargets };

      updateForm(newFormList, true);
      setTargetsCount((prev) => prev - 1);
    }
  };

  const onInputDataChange = (
    value: formFieldI['value'],
    field?: formFieldI['field']
  ) => {
    onInputChange?.(value, field);
    setIsFormValid?.(isValidForm);
  };

  const getRows = (form: FormI) => {
    const targets: string[] = [];
    const dates: string[] = [];

    Object.keys(form).forEach((key) =>
      key.includes('Data') ? dates.push(key) : targets.push(key)
    );

    return targets.map((target, index) => [target, dates[index]]);
  };

  return !targetsCount ? (
    <EmptySection
      title='Questa sezione è ancora vuota'
      subtitle='Crea un target di valori degli obiettivi'
      icon='it-note'
      withIcon
      buttons={
        disabled
          ? []
          : [
              {
                size: 'xs',
                color: 'primary',
                text: t('add_milestone'),
                onClick: () => {
                  addTarget();
                },
              },
            ]
      }
    />
  ) : (
    <Form
      id='form-targets'
      formDisabled={disabled}
      className='pt-5 px-4 pr-lg-5'
    >
      {form && (
        <>
          {getRows(form).map((row, index) => (
            <Form.Row key={index} className='mb-5 mb-lg-0'>
              <Input
                {...form[row[0]]}
                disabled={disabled}
                onInputChange={onInputDataChange}
                type={disabled ? 'text' : 'number'}
                col={clsx('col-12', !disabled ? 'col-lg-5' : 'col-lg-6')}
              />
              <Input
                {...form[row[1]]}
                onInputChange={onInputDataChange}
                disabled={disabled}
                col={clsx('col-12', !disabled ? 'col-lg-5' : 'col-lg-6')}
                className='mb-3'
              />
              <div className='col-12 col-lg-2 d-flex justify-content-lg-center'>
                {!disabled ? (
                  <Button
                    className='p-0'
                    icon
                    style={{ minWidth: 'unset', height: '45px' }}
                    onClick={() => removeTarget(row)}
                  >
                    <Icon
                      className='mr-3'
                      icon='it-less-circle'
                      color='primary'
                      size='sm'
                      aria-label='delete'
                    ></Icon>
                    {!device.mediaIsDesktop && 'Elimina'}
                  </Button>
                ) : null}
              </div>
            </Form.Row>
          ))}
          {targetsCount < maxTargets && !disabled && (
            <div className='row'>
              <Button className='pl-0' icon onClick={() => addTarget()}>
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
            </div>
          )}
        </>
      )}
    </Form>
  );
};

const form: FormI = newForm([]);

export default withFormHandler({ form: form }, TargetsForm);

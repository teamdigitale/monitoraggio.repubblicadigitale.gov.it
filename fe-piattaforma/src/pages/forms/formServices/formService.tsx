import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import {
  selectQuestionarioTemplateServiceCreation,
  selectQuestionarioTemplateSnapshot,
} from '../../../redux/features/administrativeArea/administrativeAreaSlice';
import { GetSurveyTemplateServiceCreation } from '../../../redux/features/administrativeArea/services/servicesThunk';
import { useAppSelector } from '../../../redux/hooks';
import { createStringOfCompiledSurveySection } from '../../../utils/common';
import { formFieldI, FormI } from '../../../utils/formHelper';
import { generateForm } from '../../../utils/jsonFormHelper';
import FormServiceDynamic from './formServiceDynamic';
import FormServiceStatic from './formServiceStatic';

interface FormServiceI {
  creation?: boolean;
  formDisabled?: boolean;
  sendNewFormsValues?: (param?: { [key: string]: formFieldI['value'] }) => void;
  areFormsValid?: (param: boolean) => void;
  getQuestioanarioCompilatoQ3?: (param: string) => void;
}

const FormService: React.FC<FormServiceI> = (props) => {
  const {
    formDisabled,
    creation = false,
    sendNewFormsValues = () => ({}),
    areFormsValid = () => ({}),
    getQuestioanarioCompilatoQ3 = () => ({}),
  } = props;
  const dispatch = useDispatch();
  const sezioniQuestionarioTemplate = useAppSelector(
    selectQuestionarioTemplateSnapshot
  )?.sezioniQuestionarioTemplate;
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const serviceQ3Schema = sezioniQuestionarioTemplate?.[2]?.schema;
  const serviceQ3SchemaCreation = useAppSelector(
    selectQuestionarioTemplateServiceCreation
  )?.[2]?.schema;
  const [dynamicFormQ3, setDynamicFormQ3] = useState<FormI>({});
  const [newFormStaticValues, setNewFormStaticValues] = useState<{
    [key: string]: formFieldI['value'];
  }>({});
  const [isFormStaticValid, setIsFormStaticValid] = useState<boolean>(false);
  const [newFormDynamicValues, setNewFormDynamicValues] = useState<{
    [key: string]: formFieldI['value'];
  }>({});
  const [isFormDynamicValid, setIsFormDynamicValid] = useState<boolean>(false);

  useEffect(() => {
    if (creation) {
      dispatch(GetSurveyTemplateServiceCreation());
    }
  }, []);

  useEffect(() => {
    const schema = serviceQ3SchemaCreation?.json || serviceQ3Schema?.json || '{}';
    if (schema) {
      const formFromSchema = generateForm(
        JSON.parse(schema)
      );
      Object.keys(formFromSchema).forEach((key: string) => {
        formFromSchema[key].label = formFromSchema[key].value?.toString() || '';
        formFromSchema[key].value = '';
        // case durata
        if (key === '23') {
          formFromSchema[key].value = '00:00';
        }
      });
      setDynamicFormQ3(formFromSchema);
    }
  }, [serviceQ3Schema, serviceQ3SchemaCreation]);

  /*
  useEffect(() => {
    if (creation && serviceQ3SchemaCreation) {
      const formFromSchema = generateForm(
        JSON.parse(serviceQ3SchemaCreation.json)
      );
      Object.keys(formFromSchema).forEach((key: string) => {
        formFromSchema[key].label = formFromSchema[key].value?.toString() || '';
        formFromSchema[key].value = '';
      });
      setDynamicFormQ3(formFromSchema);
    }
  }, [serviceQ3SchemaCreation]);
  */

  useEffect(() => {
    areFormsValid(isFormStaticValid && isFormDynamicValid);
    sendNewFormsValues({ ...newFormStaticValues, ...newFormDynamicValues });
  }, [
    isFormStaticValid,
    isFormDynamicValid,
    newFormStaticValues,
    newFormDynamicValues,
  ]);

  useEffect(() => {
    // to create the string of the compiled survey
    getQuestioanarioCompilatoQ3(
      createStringOfCompiledSurveySection(newFormDynamicValues)
    );
  }, [newFormDynamicValues]);

  return (
    <div className='my-5'>
      <FormServiceStatic
        creation={creation}
        formDisabled={!!formDisabled}
        sendNewValues={(newData?: { [key: string]: formFieldI['value'] }) => {
          setNewFormStaticValues({ ...newData });
        }}
        setIsFormValid={(isValid: boolean) => setIsFormStaticValid(isValid)}
      />
      <FormServiceDynamic
        creation={creation}
        formDisabled={!!formDisabled}
        dynamicFormQ3={dynamicFormQ3}
        sendNewValues={(newData?: { [key: string]: formFieldI['value'] }) => {
          setNewFormDynamicValues({ ...newData });
        }}
        setIsFormValid={(isValid: boolean) => setIsFormDynamicValid(isValid)}
      />
    </div>
  );
};

export default FormService;

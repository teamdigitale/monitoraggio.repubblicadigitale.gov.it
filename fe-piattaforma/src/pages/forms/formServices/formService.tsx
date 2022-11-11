import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import {
  selectProjects,
  selectQuestionarioTemplateServiceCreation,
  selectQuestionarioTemplateSnapshot,
} from '../../../redux/features/administrativeArea/administrativeAreaSlice';
//import { GetProjectDetail } from '../../../redux/features/administrativeArea/projects/projectsThunk';
import { GetSurveyTemplateServiceCreation } from '../../../redux/features/administrativeArea/services/servicesThunk';
//import { getUserHeaders } from '../../../redux/features/user/userThunk';
import { useAppSelector } from '../../../redux/hooks';
import {
  createStringOfCompiledSurveySection,
  formatDate,
} from '../../../utils/common';
import { formFieldI, FormI } from '../../../utils/formHelper';
import { generateForm } from '../../../utils/jsonFormHelper';
import { RegexpType } from '../../../utils/validator';
import FormServiceDynamic from './formServiceDynamic';
import FormServiceStatic from './formServiceStatic';

interface FormServiceI {
  creation?: boolean;
  formDisabled?: boolean;
  sendNewFormsValues?: (param?: { [key: string]: formFieldI['value'] }) => void;
  areFormsValid?: (param: boolean) => void;
  getQuestioanarioCompilatoQ3?: (param: string) => void;
  legend?: string | undefined;
}

const FormService: React.FC<FormServiceI> = (props) => {
  const {
    formDisabled,
    creation = false,
    sendNewFormsValues = () => ({}),
    areFormsValid = () => ({}),
    getQuestioanarioCompilatoQ3 = () => ({}),
    legend = '',
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
  //const { idProgetto } = getUserHeaders();
  const projectDetails =
    useAppSelector(selectProjects)?.detail?.dettagliInfoProgetto;
  useEffect(() => {
    if (creation) {
      dispatch(GetSurveyTemplateServiceCreation());
    }
    //dispatch(GetProjectDetail(idProgetto));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const schema =
      serviceQ3SchemaCreation?.json || serviceQ3Schema?.json || '{}';
    if (schema) {
      const formFromSchema = generateForm(JSON.parse(schema));
      Object.keys(formFromSchema).forEach((key: string) => {
        formFromSchema[key].label = formFromSchema[key].value?.toString() || '';
        formFromSchema[key].value = '';
        if (key === '22') {
          // case date
          formFromSchema[key].maximum = formatDate(projectDetails?.dataFine);
          formFromSchema[key].minimum = formatDate(projectDetails?.dataInizio);
        }
        if(key === '23'){ // case duration
          formFromSchema[key].regex = RegexpType.ALPHA_NUMERIC_INPUT;
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
        legend={legend}
      />
      <FormServiceDynamic
        creation={creation}
        formDisabled={!!formDisabled}
        dynamicFormQ3={dynamicFormQ3}
        sendNewValues={(newData?: { [key: string]: formFieldI['value'] }) => {
          setNewFormDynamicValues({ ...newData });
        }}
        setIsFormValid={(isValid: boolean) => setIsFormDynamicValid(isValid)}
        projectDetails={projectDetails}
      />
    </div>
  );
};

export default FormService;

import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { selectResponseSectionsSchema } from '../../../redux/features/administrativeArea/surveys/surveysSlice';
import { GetSurveyInfo } from '../../../redux/features/administrativeArea/surveys/surveysThunk';
import { useAppSelector } from '../../../redux/hooks';
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
  const serviceQ3Schema =
    useAppSelector(selectResponseSectionsSchema)?.filter(
      (section) => section?.id === 'anagraphic-service-section'
    )[0]?.schema || undefined;
  const [dynamicFormQ3, setDynamicFormQ3] = useState<FormI>({});
  const [newFormStaticValues, setNewFormStaticValues] = useState<{
    [key: string]: formFieldI['value'];
  }>({});
  const [isFormStaticValid, setIsFormStaticValid] = useState<boolean>(true);
  const [newFormDynamicValues, setNewFormDynamicValues] = useState<{
    [key: string]: formFieldI['value'];
  }>({});
  const [isFormDynamicValid, setIsFormDynamicValid] = useState<boolean>(true);

  useEffect(() => {
    dispatch(GetSurveyInfo('1')); // TODO: aggiorna con id del questionario di default
  }, []);

  useEffect(() => {
    if (serviceQ3Schema) {
      const formFromSchema = generateForm(JSON.parse(serviceQ3Schema));
      Object.keys(formFromSchema).forEach((key: string) => {
        formFromSchema[key].label = formFromSchema[key].value?.toString() || '';
        formFromSchema[key].value = '';
      });
      setDynamicFormQ3(formFromSchema);
    }
  }, [serviceQ3Schema]);

  useEffect(() => {
    areFormsValid(isFormStaticValid && isFormDynamicValid ? true : false);
    sendNewFormsValues({ ...newFormStaticValues, ...newFormDynamicValues });
  }, [
    isFormStaticValid,
    isFormDynamicValid,
    newFormStaticValues,
    newFormDynamicValues,
  ]);

  useEffect(() => {
    const formattedData = { ...newFormDynamicValues };
    Object.keys(formattedData).forEach((key: string) => {
      if (!Array.isArray(formattedData[key])) {
        const tmp =
          typeof formattedData[key] === 'string'
            ? formattedData[key]?.toString()
            : '';
        tmp ? (formattedData[key] = [tmp]) : null;
      }
    });
    getQuestioanarioCompilatoQ3(JSON.stringify(formattedData));
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

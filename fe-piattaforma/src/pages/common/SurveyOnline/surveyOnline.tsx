import React, { useEffect, useState } from 'react';
import './surveyOnline.scss';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Button, FormGroup, Label } from 'design-react-kit';
import { defaultRedirectUrl } from '../../../routes';
import {
  CompileSurveyOnline,
  GetSurveyOnline,
} from '../../../redux/features/administrativeArea/surveys/surveysThunk';
import { useAppSelector } from '../../../redux/hooks';
import { selectSurveyOnline } from '../../../redux/features/administrativeArea/surveys/surveysSlice';
import {
  closeModal,
  openModal,
} from '../../../redux/features/modal/modalSlice';
import GenericModal from '../../../components/Modals/GenericModal/genericModal';
import Input from '../../../components/Form/input';
import { newForm, newFormField } from '../../../utils/formHelper';
import withFormHandler, {
  withFormHandlerProps,
} from '../../../hoc/withFormHandler';
import JsonFormRender from '../../administrator/AdministrativeArea/Entities/Surveys/components/jsonFormRender';
import { generateForm } from '../../../utils/jsonFormHelper';
import Loader from '../../../components/Loader/loader';
import BigItUserWhite from '/public/assets/img/big-white-it-user.png';
import { convertPayloadSectionInString } from '../../../utils/common';
import BigCheckVerde from '/public/assets/img/green-check-circle.png';

const SurveyOnlineModalId = 'SurveyOnlineModalId';
const SurveyOnlineSuccessModalId = 'SurveyOnlineSuccessModalId';
const SurveyOnlineSectionId = 'content-service-section';

const SurveyOnline: React.FC<withFormHandlerProps> = (props) => {
  const { idQuestionario, token } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [surveySection, setSurveySection] = useState<any>();
  const [compiled, setCompiled] = useState(false);
  const surveyOnline = useAppSelector(selectSurveyOnline) || {};
  const {
    abilitatoConsensoTrattatamentoDatiCittadino = false,
    questionarioTemplate = {},
  } = surveyOnline;
  const {
    form: surveyForm = {},
    updateForm = () => ({}),
    getFormValues = () => ({}),
    onInputChange = () => ({}),
    isValidForm,
  } = props;

  const retrieveSurveyOnline = async () => {
    try {
      if (idQuestionario && token) {
        const res = await dispatch(GetSurveyOnline(idQuestionario, token));
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        if (!res) {
          handleRedirectHome();
        }
      }
    } catch (err) {
      console.log('retrieveSurveyOnline error', err);
      handleRedirectHome();
    }
  };

  useEffect(() => {
    if (idQuestionario && token) {
      retrieveSurveyOnline();
    }
  }, [idQuestionario, token]);

  useEffect(() => {
    if (!abilitatoConsensoTrattatamentoDatiCittadino) {
      dispatch(openModal({ id: SurveyOnlineModalId }));
    }
  }, [abilitatoConsensoTrattatamentoDatiCittadino]);

  const retrieveSurveySection = () => {
    if (questionarioTemplate?.sezioniQuestionarioTemplate?.length) {
      return questionarioTemplate?.sezioniQuestionarioTemplate.find(
        ({ id }: { id: string }) => id === SurveyOnlineSectionId
      );
    }
    return;
  };

  useEffect(() => {
    if (questionarioTemplate?.sezioniQuestionarioTemplate?.length) {
      setSurveySection(retrieveSurveySection());
    }
  }, [questionarioTemplate?.sezioniQuestionarioTemplate?.length]);

  const retrieveSectionSchemaForm = () => {
    if (surveySection?.schema) {
      try {
        return generateForm(
          JSON.parse(surveySection.schema.json || surveySection.schema),
          true
        );
      } catch (err) {
        return surveyForm;
      }
    }
    return surveyForm;
  };

  useEffect(() => {
    if (surveySection?.schema) {
      updateForm(retrieveSectionSchemaForm());
    }
  }, [surveySection?.schema]);

  const handleRedirectHome = () => {
    navigate(defaultRedirectUrl, { replace: true });
  };

  if (!(idQuestionario && token)) {
    handleRedirectHome();
  }

  if (!Object.keys(surveyForm).length) {
    return <Loader />;
  }

  const handleSubmitSurvey = async () => {
    if (!compiled && isValidForm && idQuestionario && token) {
      try {
        const res = await dispatch(
          CompileSurveyOnline(
            idQuestionario,
            token,
            convertPayloadSectionInString(getFormValues(), 3)
          )
        );
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        if (res) {
          setCompiled(true);
          dispatch(openModal({ id: SurveyOnlineSuccessModalId }));
        }
      } catch (err) {
        console.log('err', err);
      }
    }
  };

  const SuccessModal = () => (
    <GenericModal
      id={SurveyOnlineSuccessModalId}
      description='Questionario inviato correttamente!'
      primaryCTA={{
        label: 'Chiudi',
        onClick: handleRedirectHome,
      }}
      icon={BigCheckVerde}
      isSuccesModal
      withIcon
      isSurveyOnline
      centerButtons
      onClose={handleRedirectHome}
    />
  );

  const PrivacyModal = withFormHandler(
    { form: privacyForm },
    (props: withFormHandlerProps) => {
      const { form: formPrivacy, onInputChange, isValidForm } = props;
      return (
        <GenericModal
          id={SurveyOnlineModalId}
          description='Per procedere con la compilazione, conferma il consenso al trattamento dei dati personali'
          primaryCTA={{
            label: 'Avanti',
            disabled: !isValidForm,
            onClick: () => dispatch(closeModal()),
          }}
          secondaryCTA={{ label: 'Annulla' }}
          icon={BigItUserWhite}
          iconColor='white'
          bigIcon
          withIcon
          isSurveyOnline
          centerButtons
          onClose={handleRedirectHome}
        >
          <div className='d-flex justify-content-center mt-5'>
            <FormGroup check>
              <Input
                {...formPrivacy?.privacy}
                aria-label='checkbox-consenso'
                id='checkbox-consenso'
                type='checkbox'
                checked={Boolean(formPrivacy?.privacy?.value)}
                onInputChange={onInputChange}
                withLabel={false}
              />
              <Label check for='checkbox-consenso'>
                Presa visione dell’<a href='/'>informativa privacy</a>
              </Label>
            </FormGroup>
          </div>
        </GenericModal>
      );
    }
  );

  return (
    <div>
      <h1 className='h4 primary-color-a9 mb-4'>Compila il questionario</h1>
      <p className='mt-2 mb-4 text-muted'>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi fermentum
        turpis mauris, sit amet faucibus purus aliquam nec
      </p>
      {!compiled && Object.keys(surveyForm).length ? (
        <div className='my-5 pt-5'>
          <JsonFormRender
            form={surveyForm}
            onInputChange={onInputChange}
            currentStep={4}
          />
          <div className='d-flex justify-content-end pt-4'>
            <Button
              color='primary'
              disabled={!isValidForm}
              onClick={handleSubmitSurvey}
            >
              Invia questionario
            </Button>
          </div>
        </div>
      ) : (
        <h6 className='primary-color-a9 text-center my-5'>
          Hai già compilato il questionario!
        </h6>
      )}
      <PrivacyModal />
      <SuccessModal />
    </div>
  );
};

const privacyForm = newForm([
  newFormField({
    field: 'privacy',
    required: true,
  }),
]);

const surveyForm = newForm([]);

export default withFormHandler({ form: surveyForm }, SurveyOnline);

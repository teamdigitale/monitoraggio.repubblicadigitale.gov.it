import React, { useEffect, useState } from 'react';
import './surveyOnline.scss';
import { useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Button, FormGroup, Label } from 'design-react-kit';
import { redirectUrlSurveyOnline } from '../../../routes';
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
import clsx from 'clsx';
import { selectDevice } from '../../../redux/features/app/appSlice';

const SurveyOnlineModalId = 'SurveyOnlineModalId';
const SurveyOnlineSuccessModalId = 'SurveyOnlineSuccessModalId';
const SurveyOnlineSectionId = 'content-service-section';

const SurveyOnline: React.FC<withFormHandlerProps> = (props) => {
  const { idQuestionario, token } = useParams();
  const dispatch = useDispatch();
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
  const device = useAppSelector(selectDevice);

  const retrieveSurveyOnline = async () => {
    try {
      if (idQuestionario && token) {
        const res = await dispatch(GetSurveyOnline(idQuestionario, token));
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        if (!res) {
          handleRedirectUrl();
        }
      }
    } catch (err) {
      console.log('retrieveSurveyOnline error', err);
      handleRedirectUrl();
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

  const handleRedirectUrl = () => {
    window.location.replace(redirectUrlSurveyOnline);
  };

  if (!(idQuestionario && token)) {
    handleRedirectUrl();
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
        onClick: handleRedirectUrl,
      }}
      icon={BigCheckVerde}
      isSuccesModal
      withIcon
      isSurveyOnline
      centerButtons
      onClose={handleRedirectUrl}
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
          onClose={handleRedirectUrl}
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
    <div className={clsx(!device.mediaIsDesktop && 'container')}>
      <h1 className='h4 primary-color-a9 mb-4'>Compila il questionario</h1>
      <p className='mt-2 mb-4 text-muted'>
        La tua opinione per noi è importante. Rispondi a questo breve
        questionario e aiutaci a offrirti servizi di formazione e facilitazione
        digitale sempre migliori. <br />
        Le domande contrassegnate da asterisco sono obbligatorie.
      </p>
      {!compiled && Object.keys(surveyForm).length ? (
        <div className='my-5'>
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

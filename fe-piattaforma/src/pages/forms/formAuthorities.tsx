import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { EmptySection, Form, Input } from '../../components';
import { ButtonInButtonsBar } from '../../components/ButtonsBar/buttonsBar';
import withFormHandler, {
  withFormHandlerProps,
} from '../../hoc/withFormHandler';
import {
  resetAuthorityDetails,
  selectAuthorities,
} from '../../redux/features/administrativeArea/administrativeAreaSlice';
import {
  GetAuthorityDetail,
  GetAuthorityProgramManagerDetail,
  GetAuthorityProjectManagerDetail,
} from '../../redux/features/administrativeArea/authorities/authoritiesThunk';
import { openModal } from '../../redux/features/modal/modalSlice';
import { useAppSelector } from '../../redux/hooks';
import { formFieldI, newForm, newFormField } from '../../utils/formHelper';
import { formTypes } from '../administrator/AdministrativeArea/Entities/utils';

interface EnteInformationI {
  formDisabled?: boolean;
  sendNewValues?: (param?: { [key: string]: formFieldI['value'] }) => void;
  setIsFormValid?: (param: boolean | undefined) => void;
  creation?: boolean;
  enteType?: string;
}

interface FormEnteGestoreProgettoFullInterface
  extends withFormHandlerProps,
    EnteInformationI {}

const FormAuthorities: React.FC<FormEnteGestoreProgettoFullInterface> = (
  props
) => {
  const {
    setFormValues = () => ({}),
    form,
    onInputChange,
    sendNewValues,
    isValidForm,
    setIsFormValid,
    getFormValues,
    creation = false,
    enteType,
  } = props;

  const formDisabled = !!props.formDisabled;
  const { projectId, entityId, idEnte } = useParams();

  const newGestoreProgetto = () => {
    dispatch(
      openModal({
        id: formTypes.ENTE_GESTORE_PROGRAMMA,
        payload: {
          title: 'Aggiungi Ente gestore di Programma',
        },
      })
    );
  };

  const EmptySectionButton: ButtonInButtonsBar[] = [
    {
      size: 'xs',
      color: 'primary',
      text: 'Aggiungi Ente gestore di Programma',
      onClick: () => newGestoreProgetto(),
    },
  ];

  const formData: { [key: string]: formFieldI['value'] } | undefined =
    useAppSelector(selectAuthorities).detail?.dettagliInfoEnte;
  const dispatch = useDispatch();

  if (formData && !creation) {
    <EmptySection
      title={'Questa sezione è ancora vuota'}
      subtitle={'Per attivare il progetto aggiungi un ente gestore e una sede'}
      buttons={EmptySectionButton}
    />;
  }

  useEffect(() => {
    if (!creation) {
      switch (enteType) {
        case formTypes.ENTE_GESTORE_PROGETTO:
        case formTypes.ENTI_GESTORE_PROGETTO:
          projectId && dispatch(GetAuthorityProjectManagerDetail(projectId));
          break;
        case formTypes.ENTE_PARTNER:
        case formTypes.ENTI_PARTNER:
          //dispatch(GetEntePartnerDetail(secondParam || '', 'prova'));
          dispatch(GetAuthorityDetail(enteType));
          break;
        case formTypes.ENTE_GESTORE_PROGRAMMA:
          entityId && dispatch(GetAuthorityProgramManagerDetail(entityId));
          // dispatch(GetAuthorityDetail(enteType));
          break;
        default:
          //dispatch(GetEnteGestoreProgrammaDetail(firstParam || '', 'prova'));
          idEnte && dispatch(GetAuthorityDetail(idEnte));
          break;
      }
    }
  }, [enteType, creation]);

  useEffect(() => {
    if (formData) {
      setFormValues(formData);
    }
  }, [formData]);

  useEffect(() => {
    if (creation) dispatch(resetAuthorityDetails());
  }, [creation]);

  const onInputDataChange = (
    value: formFieldI['value'],
    field?: formFieldI['field']
  ) => {
    onInputChange?.(value, field);
    setIsFormValid?.(isValidForm);
  };

  useEffect(() => {
    sendNewValues?.(getFormValues?.());
  }, [form]);

  const bootClass = 'justify-content-between px-0 px-lg-5 mx-2';

  return (
    <Form className='mt-5 mb-5' formDisabled={formDisabled}>
      {form && (
        <>
          <Form.Row className={bootClass}>
            <Input
              {...form?.id}
              col='col-12 col-lg-6'
              label='ID'
              onInputChange={(value, field) => {
                onInputDataChange(value, field);
              }}
            />
            <Input
              {...form?.nome}
              label='Nome ente'
              col='col-12 col-lg-6'
              placeholder='Inserisci nome programma'
              onInputChange={(value, field) => {
                onInputDataChange(value, field);
              }}
            />
          </Form.Row>
          <Form.Row className={bootClass}>
            <Input
              {...form?.nomeBreve}
              col='col-12 col-lg-6'
              label='Nome breve'
              placeholder='Inserisci il nome breve'
              onInputChange={(value, field) => {
                onInputDataChange(value, field);
              }}
            />
            <Input
              {...form?.tipologia}
              label='Tipologia'
              col='col-12 col-lg-6'
              placeholder='Inserisci la tipologia'
              onInputChange={(value, field) => {
                onInputDataChange(value, field);
              }}
            />
          </Form.Row>
          {/* <Form.Row className={bootClass}>
          <Input
            {...form?.profilo}
            label='Profilo'
            col='col-12 col-lg-6'
            placeholder='Inserisci il profilo'
            onInputChange={(value, field) => {
              onInputDataChange(value, field);
            }}
          />
          <Input
            {...form?.fiscalCode}
            label='Codice fiscale'
            col='col-12 col-lg-6'
            placeholder='Inserisci il codice fiscale'
            onInputChange={(value, field) => {
              onInputDataChange(value, field);
            }}
          />
        </Form.Row> */}
          <Form.Row className={bootClass}>
            <Input
              col='col-12 col-lg-6'
              {...form?.sedeLegale}
              label='Sede legale'
              placeholder='Inserisci la sede legale'
              onInputChange={(value, field) => {
                onInputDataChange(value, field);
              }}
            />
            <Input
              {...form?.piva}
              label='Partita Iva'
              col='col-12 col-lg-6'
              placeholder='Inserisci la partita iva'
              onInputChange={(value, field) => {
                onInputDataChange(value, field);
              }}
            />
          </Form.Row>
          <Form.Row className={bootClass}>
            <Input
              {...form?.indirizzoPec}
              label='PEC'
              col='col-12 col-lg-6'
              placeholder='Inserisci PEC'
              onInputChange={(value, field) => {
                onInputDataChange(value, field);
              }}
            />
          </Form.Row>
        </>
      )}
    </Form>
  );
};

const form = newForm([
  newFormField({
    field: 'id',
    valid: true,
    id: 'id',
  }),
  newFormField({
    field: 'nome',
    id: 'nome',
  }),
  newFormField({
    field: 'nomeBreve',
    id: 'nomeBreve',
  }),
  newFormField({
    field: 'tipologia',
    id: 'tipologia',
  }),
  /*
  newFormField({
    field: 'profilo',
    id: 'profilo',
  }),
  */
  newFormField({
    field: 'piva',
    id: 'piva',
  }),
  /*
  newFormField({
    field: 'fiscalCode',
    id: 'fiscalCode',
  }),
  */
  newFormField({
    field: 'sedeLegale',
    id: 'sedeLegale',
  }),
  newFormField({
    field: 'indirizzoPec',
    id: 'indirizzoPec',
  }),
]);
export default withFormHandler({ form }, FormAuthorities);

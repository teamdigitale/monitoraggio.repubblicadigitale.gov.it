import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { EmptySection, Form, Input, Select } from '../../components';
import { ButtonInButtonsBar } from '../../components/ButtonsBar/buttonsBar';
import withFormHandler, {
  withFormHandlerProps,
} from '../../hoc/withFormHandler';
import {
  //resetAuthorityDetails,
  selectAuthorities,
} from '../../redux/features/administrativeArea/administrativeAreaSlice';
import {
  GetAuthorityDetail,
  GetAuthorityManagerDetail,
  GetPartnerAuthorityDetail,
} from '../../redux/features/administrativeArea/authorities/authoritiesThunk';
import { openModal } from '../../redux/features/modal/modalSlice';
import { useAppSelector } from '../../redux/hooks';
import {
  CommonFields,
  formFieldI,
  newForm,
  newFormField,
} from '../../utils/formHelper';
import { formTypes } from '../administrator/AdministrativeArea/Entities/utils';

const TipologiaEnteOptions = [
  { label: 'Ente pubblico', value: 'Ente pubblico' },
  {
    label: 'Ente del terzo settore',
    value: 'Ente del terzo settore',
  },
  {
    label: 'Ente privato',
    value: 'Ente privato',
  },
];

interface EnteInformationI {
  formDisabled?: boolean;
  sendNewValues?: (param?: { [key: string]: formFieldI['value'] }) => void;
  setIsFormValid?: (param: boolean | undefined) => void;
  creation?: boolean | undefined;
  noIdField?: boolean | undefined;
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
    sendNewValues = () => ({}),
    isValidForm,
    setIsFormValid = () => ({}),
    getFormValues = () => ({}),
    creation = false,
    noIdField = false,
    enteType,
    updateForm = () => ({}),
    clearForm = () => ({}),
  } = props;

  const formDisabled = !!props.formDisabled;
  const { projectId, entityId, authorityId } = useParams();

  useEffect(() => {
    if (
      form &&
      formDisabled &&
      Object.entries(form).some(([_key, value]) => !value.disabled)
    ) {
      updateForm(
        Object.fromEntries(
          Object.entries(form).map(([key, value]) => [
            key,
            { ...value, disabled: formDisabled },
          ])
        ),
        true
      );
    }
  }, [formDisabled, form]);

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

  useEffect(() => {
    if (
      !creation &&
      form &&
      (enteType === formTypes.ENTE_GESTORE_PROGRAMMA ||
        enteType === formTypes.ENTE_GESTORE_PROGETTO ||
        enteType === formTypes.ENTE_PARTNER)
    ) {
      const profilo = newFormField({
        field: 'profilo',
        id: 'profilo',
        required: true,
      });
      updateForm({ ...form, profilo });
    }
  }, [creation, enteType, formData]);

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
          projectId &&
            dispatch(GetAuthorityManagerDetail(projectId, 'progetto'));
          break;
        case formTypes.ENTE_PARTNER:
        case formTypes.ENTI_PARTNER:
          //dispatch(GetEntePartnerDetail(secondParam || '', 'prova'));
          projectId &&
            authorityId &&
            dispatch(GetPartnerAuthorityDetail(projectId, authorityId));
          break;
        case formTypes.ENTE_GESTORE_PROGRAMMA:
          entityId &&
            dispatch(GetAuthorityManagerDetail(entityId, 'programma'));
          // dispatch(GetAuthorityDetail(enteType));
          break;
        default:
          //dispatch(GetEnteGestoreProgrammaDetail(firstParam || '', 'prova'));
          authorityId && dispatch(GetAuthorityDetail(authorityId));
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
    if (creation) {
      clearForm();
      //dispatch(resetAuthorityDetails());
    }
  }, [creation]);

  const onInputDataChange = (
    value: formFieldI['value'],
    field?: formFieldI['field']
  ) => {
    onInputChange?.(value, field);
    setIsFormValid(isValidForm);
    // sendNewValues?.(getFormValues?.());
  };

  useEffect(() => {
    sendNewValues(getFormValues());
  }, [form]);

  const bootClass = 'justify-content-between px-0 px-lg-5 mx-2';

  return (
    <Form className='mt-5 mb-5' formDisabled={formDisabled}>
      {form && (
        <div>
          {creation || noIdField ? (
            <>
              <Form.Row className={bootClass}>
                <Input
                  {...form?.nome}
                  label='Nome Ente'
                  col='col-12 col-lg-6'
                  // placeholder='Inserisci nome programma'
                  onInputChange={(value, field) => {
                    onInputDataChange(value, field);
                  }}
                />
                <Input
                  {...form?.nomeBreve}
                  required
                  col='col-12 col-lg-6'
                  label='Nome breve'
                  // placeholder='Inserisci il nome breve'
                  onInputChange={(value, field) => {
                    onInputDataChange(value, field);
                  }}
                />
              </Form.Row>
              <Form.Row className={bootClass}>
                {formDisabled ? (
                  <Input
                    {...form?.tipologia}
                    required
                    label='Tipologia'
                    col='col-12 col-lg-6'
                    onInputChange={(value, field) => {
                      onInputDataChange(value, field);
                    }}
                  />
                ) : (
                  <Select
                    {...form?.tipologia}
                    required
                    value={form?.tipologia.value as string}
                    col='col-12 col-lg-6'
                    label='Tipologia'
                    // placeholder='Inserisci la tipologia'
                    options={TipologiaEnteOptions}
                    onInputChange={(value, field) => {
                      onInputDataChange(value, field);
                    }}
                    wrapperClassName='mb-5'
                    aria-label='tipologia'
                  />
                )}
                <Input
                  {...form?.piva}
                  label='Codice Fiscale'
                  col='col-12 col-lg-6'
                  // placeholder='Inserisci il Codice Fiscale'
                  onInputChange={(value, field) => {
                    onInputDataChange(value, field);
                  }}
                />
              </Form.Row>
              <Form.Row className={bootClass}>
                <Input
                  col='col-12 col-lg-6'
                  {...form?.sedeLegale}
                  label='Sede legale'
                  // placeholder='Inserisci la sede legale'
                  onInputChange={(value, field) => {
                    onInputDataChange(value, field);
                  }}
                />
                <Input
                  {...form?.indirizzoPec}
                  label='PEC'
                  col='col-12 col-lg-6'
                  // placeholder='Inserisci PEC'
                  onInputChange={(value, field) => {
                    onInputDataChange(value, field);
                  }}
                />
              </Form.Row>
            </>
          ) : (
            <>
              <Form.Row className={bootClass}>
                <Input {...form?.id} col='col-12 col-lg-6' label='ID' />
                <Input
                  {...form?.nome}
                  label='Nome Ente'
                  col='col-12 col-lg-6'
                  // placeholder='Inserisci nome programma'
                  onInputChange={(value, field) => {
                    onInputDataChange(value, field);
                  }}
                />
              </Form.Row>
              <Form.Row className={bootClass}>
                <Input
                  {...form?.nomeBreve}
                  required
                  col='col-12 col-lg-6'
                  label='Nome breve'
                  // placeholder='Inserisci il nome breve'
                  onInputChange={(value, field) => {
                    onInputDataChange(value, field);
                  }}
                />
                {formDisabled ? (
                  <Input
                    {...form?.tipologia}
                    required
                    label='Tipologia'
                    col='col-12 col-lg-6'
                    onInputChange={(value, field) => {
                      onInputDataChange(value, field);
                    }}
                  />
                ) : (
                  <Select
                    {...form?.tipologia}
                    required
                    value={form?.tipologia.value as string}
                    col='col-12 col-lg-6'
                    label='Tipologia'
                    // placeholder='Inserisci la tipologia'
                    options={TipologiaEnteOptions}
                    onInputChange={(value, field) => {
                      onInputDataChange(value, field);
                    }}
                    wrapperClassName='mb-5'
                    aria-label='tipologia'
                  />
                )}
              </Form.Row>
              <Form.Row className={bootClass}>
                <Input
                  {...form?.piva}
                  label='Codice Fiscale'
                  col='col-12 col-lg-6'
                  // placeholder='Inserisci il Codice Fiscale'
                  onInputChange={(value, field) => {
                    onInputDataChange(value, field);
                  }}
                />
                <Input
                  col='col-12 col-lg-6'
                  {...form?.sedeLegale}
                  label='Sede legale'
                  // placeholder='Inserisci la sede legale'
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
                  // placeholder='Inserisci PEC'
                  onInputChange={(value, field) => {
                    onInputDataChange(value, field);
                  }}
                />
                {form?.profilo && (
                  <Input
                    {...form?.profilo}
                    required
                    label='Profilo'
                    col='col-12 col-lg-6'
                  />
                )}
              </Form.Row>
            </>
          )}
        </div>
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
    required: true,
  }),
  newFormField({
    field: 'nomeBreve',
    id: 'nomeBreve',
    required: true,
  }),
  newFormField({
    field: 'tipologia',
    id: 'tipologia',
    required: true,
  }),
  newFormField({
    ...CommonFields.PIVA,
    field: 'piva',
    id: 'piva',
    required: true,
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
    ...CommonFields.EMAIL,
    field: 'indirizzoPec',
    id: 'indirizzoPec',
  }),
]);
export default withFormHandler({ form }, FormAuthorities);

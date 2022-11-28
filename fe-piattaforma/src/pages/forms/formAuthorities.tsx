import clsx from 'clsx';
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
  legend?: string;
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
    formDisabled = false,
    onInputChange = () => ({}),
    sendNewValues = () => ({}),
    isValidForm,
    setIsFormValid = () => ({}),
    getFormValues = () => ({}),
    creation = false,
    noIdField = false,
    enteType,
    updateForm = () => ({}),
    clearForm = () => ({}),
    legend,
  } = props;

  const { projectId, entityId, authorityId } = useParams();
  const formData: { [key: string]: formFieldI['value'] } | undefined =
    useAppSelector(selectAuthorities).detail?.dettagliInfoEnte;
  const dispatch = useDispatch();

  // useEffect(() => {
  //   if (
  //     form &&
  //     formDisabled &&
  //     Object.entries(form).some(([_key, value]) => !value.disabled)
  //   ) {
  //     updateForm(
  //       Object.fromEntries(
  //         Object.entries(form).map(([key, value]) => [
  //           key,
  //           { ...value, disabled: formDisabled },
  //         ])
  //       )
  //     );
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [formDisabled]);

  useEffect(() => {
    if (formData) {
      setFormValues(formData);
    } else {
      clearForm();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData]);

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
        disabled: true,
      });

      updateForm(
        {
          ...Object.fromEntries(
            Object.entries(form).map(([key, value]) => [
              key,
              { ...value, disabled: formDisabled },
            ])
          ),
          profilo,
        },
        true
      );

      formData && setFormValues(formData);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [creation, enteType, formData, formDisabled]);

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

  if (formData && !creation) {
    <EmptySection
      title='Questa sezione è ancora vuota'
      subtitle='Per attivare il progetto aggiungi un ente gestore e una sede'
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enteType, creation]);

  useEffect(() => {
    if (creation) {
      clearForm();
      //dispatch(resetAuthorityDetails());
      if (form?.profilo) {
        updateForm({
          ...form,
          profilo: {
            ...form.profilo,
            required: !creation,
          },
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [creation]);

  useEffect(() => {
    setIsFormValid(isValidForm);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isValidForm]);

  useEffect(() => {
    sendNewValues(getFormValues());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form]);

  const bootClass = 'justify-content-between px-0 px-lg-5 mx-2';

  return (
    <Form
      id='form-authorities'
      className={clsx(formDisabled ? 'mt-5' : 'mt-3', 'mb-0')}
      formDisabled={formDisabled}
      legend={legend}
      customMargin='mb-3 pb-3 ml-3'
    >
      {creation || noIdField ? (
        <Form.Row className={bootClass}>
          <Input
            {...form?.nome}
            label='Nome Ente'
            col='col-12 col-lg-6'
            onInputChange={onInputChange}
          />
          <Input
            {...form?.nomeBreve}
            col='col-12 col-lg-6'
            label='Nome breve'
            onInputChange={onInputChange}
          />
          {formDisabled ? (
            <Input
              {...form?.tipologia}
              label='Tipologia'
              col='col-12 col-lg-6'
              onInputChange={onInputChange}
            />
          ) : (
            <Select
              {...form?.tipologia}
              value={form?.tipologia.value as string}
              col='col-12 col-lg-6'
              label='Tipologia'
              placeholder='Seleziona la tipologia'
              options={TipologiaEnteOptions}
              onInputChange={onInputChange}
              wrapperClassName='mb-5 pr-lg-3'
              aria-label='tipologia'
            />
          )}
          <Input
            {...form?.piva}
            label='Codice Fiscale'
            col='col-12 col-lg-6'
            onInputChange={onInputChange}
          />
          <Input
            col='col-12 col-lg-6'
            {...form?.sedeLegale}
            label='Sede legale'
            onInputChange={onInputChange}
          />
          <Input
            {...form?.indirizzoPec}
            label='PEC'
            col='col-12 col-lg-6'
            onInputChange={onInputChange}
          />
        </Form.Row>
      ) : (
        <Form.Row className={bootClass}>
          <Input {...form?.id} col='col-12 col-lg-6' label='ID' />
          <Input
            {...form?.nome}
            label='Nome Ente'
            col='col-12 col-lg-6'
            onInputChange={onInputChange}
          />
          <Input
            {...form?.nomeBreve}
            col='col-12 col-lg-6'
            label='Nome breve'
            onInputChange={onInputChange}
          />
          {formDisabled ? (
            <Input
              {...form?.tipologia}
              label='Tipologia'
              col='col-12 col-lg-6'
              onInputChange={onInputChange}
            />
          ) : (
            <Select
              {...form?.tipologia}
              value={form?.tipologia.value as string}
              col='col-12 col-lg-6'
              label='Tipologia'
              placeholder='Seleziona la tipologia'
              options={TipologiaEnteOptions}
              onInputChange={onInputChange}
              wrapperClassName='mb-5 pr-lg-3'
              aria-label='tipologia'
            />
          )}
          <Input
            {...form?.piva}
            label='Codice Fiscale'
            col='col-12 col-lg-6'
            onInputChange={onInputChange}
          />
          <Input
            {...form?.sedeLegale}
            col='col-12 col-lg-6'
            label='Sede legale'
            onInputChange={onInputChange}
          />
          <Input
            {...form?.indirizzoPec}
            label='PEC'
            col='col-12 col-lg-6'
            onInputChange={onInputChange}
          />
          {form?.profilo &&
          (enteType === formTypes.ENTE_GESTORE_PROGRAMMA ||
            enteType === formTypes.ENTE_GESTORE_PROGETTO ||
            enteType === formTypes.ENTE_PARTNER) ? (
            <Input {...form?.profilo} label='Profilo' col='col-12 col-lg-6' />
          ) : (
            <span />
          )}
        </Form.Row>
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
    field: 'profilo',
    id: 'profilo',
    disabled: true,
  }),
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

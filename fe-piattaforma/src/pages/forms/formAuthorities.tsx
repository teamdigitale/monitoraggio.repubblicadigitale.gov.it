import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { EmptySection, Form, Input } from '../../components';
import { ButtonInButtonsBar } from '../../components/ButtonsBar/buttonsBar';
import withFormHandler, {
  withFormHandlerProps,
} from '../../hoc/withFormHandler';
import { selectAuthorities } from '../../redux/features/administrativeArea/administrativeAreaSlice';
import { GetEnteDetail } from '../../redux/features/administrativeArea/authorities/authoritiesThunk';
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
    useAppSelector(selectAuthorities).detail?.info;
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
          dispatch(GetEnteDetail(enteType));
          break;
        case formTypes.ENTE_PARTNER:
        case formTypes.ENTI_PARTNER:
          //dispatch(GetEntePartnerDetail(secondParam || '', 'prova'));
          dispatch(GetEnteDetail(enteType));
          break;
        case formTypes.ENTE_GESTORE_PROGRAMMA:
          //dispatch(GetEnteGestoreProgrammaDetail(firstParam || '', 'prova'));
          dispatch(GetEnteDetail(enteType));
          break;
        default:
          //dispatch(GetEnteGestoreProgrammaDetail(firstParam || '', 'prova'));
          break;
      }
    }
  }, [enteType, creation]);

  useEffect(() => {
    if (formData) {
      setFormValues(formData);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData]);

  const onInputDataChange = (
    value: formFieldI['value'],
    field?: formFieldI['field']
  ) => {
    onInputChange?.(value, field);
    sendNewValues?.(getFormValues?.());
    setIsFormValid?.(isValidForm);
  };

  const bootClass = 'justify-content-between px-0 px-lg-5 mx-5';

  return (
    <Form className='mt-5 mb-5' formDisabled={formDisabled}>
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
            {...form?.name}
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
            {...form?.shortName}
            col='col-12 col-lg-6'
            label='Nome breve'
            placeholder='Inserisci il nome breve'
            onInputChange={(value, field) => {
              onInputDataChange(value, field);
            }}
          />
          <Input
            {...form?.type}
            label='Tipologia'
            col='col-12 col-lg-6'
            placeholder='Inserisci la tipologia'
            onInputChange={(value, field) => {
              onInputDataChange(value, field);
            }}
          />
        </Form.Row>
        <Form.Row className={bootClass}>
          <Input
            {...form?.profile}
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
        </Form.Row>
        <Form.Row className={bootClass}>
          <Input
            col='col-12 col-lg-6'
            {...form?.address}
            label='Sede legale'
            placeholder='Inserisci la sede legale'
            onInputChange={(value, field) => {
              onInputDataChange(value, field);
            }}
          />
          <Input
            {...form?.pec}
            label='PEC'
            col='col-12 col-lg-6'
            placeholder='Inserisci PEC'
            onInputChange={(value, field) => {
              onInputDataChange(value, field);
            }}
          />
        </Form.Row>
      </>
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
    field: 'name',
    id: 'name',
  }),
  newFormField({
    field: 'shortName',
    id: 'shortName',
  }),
  newFormField({
    field: 'type',
    id: 'type',
  }),
  newFormField({
    field: 'profile',
    id: 'profile',
  }),
  newFormField({
    field: 'fiscalCode',
    id: 'fiscalCode',
  }),
  newFormField({
    field: 'address',
    id: 'address',
  }),
  newFormField({
    field: 'pec',
    id: 'pec',
  }),
]);
export default withFormHandler({ form }, FormAuthorities);

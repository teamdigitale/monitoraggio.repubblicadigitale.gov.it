import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { EmptySection, Form, Input, Select } from '../../components';
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
  GetAuthorityManagerDetail,
  GetPartnerAuthorityDetail,
} from '../../redux/features/administrativeArea/authorities/authoritiesThunk';
import { openModal } from '../../redux/features/modal/modalSlice';
import { useAppSelector } from '../../redux/hooks';
import { formFieldI, newForm, newFormField } from '../../utils/formHelper';
import { formTypes } from '../administrator/AdministrativeArea/Entities/utils';
import {RegexpType} from "../../utils/validator";

interface EnteInformationI {
  formDisabled?: boolean;
  sendNewValues?: (param?: { [key: string]: formFieldI['value'] }) => void;
  setIsFormValid?: (param: boolean | undefined) => void;
  creation?: boolean | undefined;
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
  const { projectId, entityId, authorityId } = useParams();

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
    if (creation) dispatch(resetAuthorityDetails());
  }, [creation]);

  const onInputDataChange = (
    value: formFieldI['value'],
    field?: formFieldI['field']
  ) => {
    onInputChange?.(value, field);
    sendNewValues?.(getFormValues?.());
  };

  useEffect(() => {
    setIsFormValid?.(isValidForm);
  }, [form]);

  const bootClass = 'justify-content-between px-0 px-lg-5 mx-2';

  return (
    <Form className='mt-5 mb-5' formDisabled={formDisabled}>
      {form && (
        <>
          <Form.Row className={bootClass}>
            {/* <Input
              {...form?.id}
              col='col-12 col-lg-6'
              label='ID'
              onInputChange={(value, field) => {
                onInputDataChange(value, field);
              }}
            /> */}
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
            {/* <Input
              {...form?.nomeBreve}
              col='col-12 col-lg-6'
              label='Nome breve'
              placeholder='Inserisci il nome breve'
              onInputChange={(value, field) => {
                onInputDataChange(value, field);
              }}
            /> */}
            {/* <Input
              {...form?.tipologia}
              label='Tipologia'
              col='col-12 col-lg-6'
              placeholder='Inserisci la tipologia'
              onInputChange={(value, field) => {
                onInputDataChange(value, field);
              }}
            /> */}
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
                options={[
                  { label: 'Ente pubblico', value: 'Ente pubblico' },
                  {
                    label: 'Ente del terzo settore',
                    value: 'Ente del terzo settore',
                  },
                ]}
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
              required
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
          <Form.Row className={bootClass}>
            <Input
              {...form?.profilo}
              required
              label='Profilo'
              col='col-12 col-lg-6'
              // placeholder='Inserisci profilo'
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
    field: 'profilo',
    id: 'profilo',
    required: true,
  }),
  newFormField({
    field: 'piva',
    id: 'piva',
    required: true,
    regex: RegexpType.PIVA,
    maximum: 11,
    minimum: 11,
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
    required: true,
  }),
]);
export default withFormHandler({ form }, FormAuthorities);

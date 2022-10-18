import clsx from 'clsx';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import ConfirmItemCreation from '../../../../../components/ConfirmItemCreation/confirmItemCreation';
import GenericModal, {
  CallToAction,
} from '../../../../../components/Modals/GenericModal/genericModal';
import { withFormHandlerProps } from '../../../../../hoc/withFormHandler';
import { selectEntityFiltersOptions } from '../../../../../redux/features/administrativeArea/administrativeAreaSlice';
import { CreateItem, GetItemDetail, GetItemsList, UpdateItem } from '../../../../../redux/features/forum/forumThunk';
import { closeModal } from '../../../../../redux/features/modal/modalSlice';
import { selectProfile, selectUser } from '../../../../../redux/features/user/userSlice';
import { useAppSelector } from '../../../../../redux/hooks';
import { formFieldI } from '../../../../../utils/formHelper';
import FormLoadDocument from '../../../../forms/formForum/formLoadDocument';

const modalId = 'documentModal';
interface ManageDocumentFormI {
  formDisabled?: boolean;
  creation?: boolean;
}

interface ManageDocumentI extends withFormHandlerProps, ManageDocumentFormI { }

const ManageDocument: React.FC<ManageDocumentI> = ({
  clearForm,
  formDisabled,
  creation = false,
}) => {
  const [newFormValues, setNewFormValues] = useState<{
    [key: string]: formFieldI['value'];
  }>({});
  const [isFormValid, setIsFormValid] = useState<boolean>(true);
  const [step, setStep] = useState<'form' | 'confirm'>('form');
  const dispatch = useDispatch();
  const { id } = useParams()
  const userProfile = useAppSelector(selectProfile);
  const programsList = useAppSelector(selectEntityFiltersOptions)['programmi'];
  const userId = useAppSelector(selectUser)?.id;

  const handleSaveDoc = async () => {
    if (id) {
      await dispatch(UpdateItem(
        id,
        {
          ...newFormValues,
          program_label: programsList?.find(
            (p) => p.value === parseInt(newFormValues.program as string)
          )?.label,
          entity:
            userProfile?.idProgetto || userProfile?.idProgramma
              ? userProfile.nomeEnte
              : userProfile?.descrizioneRuolo,
          entity_type: userProfile?.idProgetto
            ? 'Ente gestore di progetto'
            : userProfile?.idProgramma
              ? 'Ente gestore di programma'
              : '',
        },
        'document'
      ));
      userId && dispatch(GetItemDetail(id, userId, 'document'))
    } else {
      await dispatch(CreateItem(
        {
          ...newFormValues,
          program_label: programsList?.find(
            (p) => p.value === parseInt(newFormValues.program as string)
          )?.label,
          entity:
            userProfile?.idProgetto || userProfile?.idProgramma
              ? userProfile.nomeEnte
              : userProfile?.descrizioneRuolo,
          entity_type: userProfile?.idProgetto
            ? 'Ente gestore di progetto'
            : userProfile?.idProgramma
              ? 'Ente gestore di programma'
              : '',
        },
        'document'
      ));
      dispatch(GetItemsList('document'))
    }
    setNewFormValues({})
    setStep('confirm')
  }

  let content = <span></span>;

  switch (step) {
    case 'form':
      content = (
        <FormLoadDocument
          creation={creation}
          formDisabled={!!formDisabled}
          sendNewValues={(newData?: { [key: string]: formFieldI['value'] }) =>
            setNewFormValues({ ...newData })
          }
          setIsFormValid={(value: boolean | undefined) =>
            setIsFormValid(!!value)
          }
        />
      );
      break;
    case 'confirm':
      content = (
        <ConfirmItemCreation
          description={`Documento ${creation ? 'caricato' : 'modificato'
            } correttamente!`}
        />
      );
      break;
    default:
      break;
  }

  const stepsCTA = {
    form: {
      title: `${creation ? 'Carica' : 'Modifica'} documento `,
      primaryCTA: {
        disabled: !isFormValid,
        label: creation ? 'Conferma' : 'Salva',
        onClick: () => handleSaveDoc(),
      },
      secondaryCTA: {
        label: 'Annulla',
        onClick: () => {
          clearForm?.();
          dispatch(closeModal());
        },
      },
    },
    confirm: {
      title: null,
      primaryCTA: {
        label: 'Chiudi',
        onClick: () => dispatch(closeModal()),
      },
      secondaryCTA: null,
    },
  };

  return (
    <GenericModal
      id={modalId}
      primaryCTA={stepsCTA[step].primaryCTA}
      secondaryCTA={(stepsCTA[step].secondaryCTA as CallToAction) || null}
      centerButtons
    >
      <p
        className={clsx(
          'd-flex',
          'justify-content-center',
          'my-4',
          'pt-3',
          'h5',
          'primary-color-a10',
          'font-weight-semibold'
        )}
      >
        {stepsCTA[step].title}
      </p>
      {content}
    </GenericModal>
  );
};

export default ManageDocument;

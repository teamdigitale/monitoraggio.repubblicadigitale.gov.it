import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import GenericModal, {
  CallToAction,
} from '../../../../../components/Modals/GenericModal/genericModal';
import { withFormHandlerProps } from '../../../../../hoc/withFormHandler';
import { closeModal } from '../../../../../redux/features/modal/modalSlice';
import { formFieldI } from '../../../../../utils/formHelper';
import FormCreateTopic from '../../../../forms/formForum/formCreateTopic';
import clsx from 'clsx';
import ConfirmItemCreation from '../../../../../components/ConfirmItemCreation/confirmItemCreation';
import { useAppSelector } from '../../../../../redux/hooks';
import { selectProfile, selectUser } from '../../../../../redux/features/user/userSlice';
import { useParams } from 'react-router-dom';
import { CreateItem, GetItemDetail, GetItemsList, UpdateItem } from '../../../../../redux/features/forum/forumThunk';

const modalId = 'topicModal';
interface ManageTopicFormI {
  formDisabled?: boolean;
  creation?: boolean;
}

interface ManageTopicI extends withFormHandlerProps, ManageTopicFormI { }
const ManageTopic: React.FC<ManageTopicI> = ({
  formDisabled,
  creation = false,
  clearForm,
}) => {
  const [newFormValues, setNewFormValues] = useState<{
    [key: string]: formFieldI['value'];
  }>({});
  const [isFormValid, setIsFormValid] = useState<boolean>(true);
  const [step, setStep] = useState<'form' | 'confirm'>('form');
  const userProfile = useAppSelector(selectProfile)
  const dispatch = useDispatch();
  const { id } = useParams()
  const userId = useAppSelector(selectUser)?.id

  const handleSaveTopic = async () => {
    if (id) {
      
      await dispatch(UpdateItem(id, {
        ...newFormValues,
        entity: (userProfile?.idProgetto || userProfile?.idProgramma) ? userProfile.nomeEnte : userProfile?.descrizioneRuolo,
        entity_type: userProfile?.idProgetto ? 'Ente gestore di progetto' : userProfile?.idProgramma ? 'Ente gestore di programma' : '-',
      }, 'community'))
      userId && dispatch(GetItemDetail(id, userId, 'community'))
    } else {

      await dispatch(CreateItem({
        ...newFormValues,
        entity: (userProfile?.idProgetto || userProfile?.idProgramma) ? userProfile.nomeEnte : userProfile?.descrizioneRuolo,
        entity_type: userProfile?.idProgetto ? 'Ente gestore di progetto' : userProfile?.idProgramma ? 'Ente gestore di programma' : '-',
      }, 'community'))
      // TODO this call may be modified
      dispatch(GetItemsList('community'))
    }
    setStep('confirm')
  }

  const stepsCTA = {
    form: {
      title: `${creation ? 'Crea' : 'Modifica'} topic`,
      primaryCTA: {
        disabled: !isFormValid,
        label: creation ? 'Conferma' : 'Salva',
        onClick: () => handleSaveTopic(),
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

  let content = <span></span>;

  switch (step) {
    case 'form':
      content = (
        <FormCreateTopic
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
          description={`Topic ${creation ? 'creato' : 'modificato'
            } correttamente!`}
        />
      );
      break;
    default:
      break;
  }

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

export default ManageTopic;

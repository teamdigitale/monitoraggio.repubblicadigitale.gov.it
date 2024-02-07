import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import GenericModal, {
  CallToAction,
} from '../../../../../components/Modals/GenericModal/genericModal';
import { withFormHandlerProps } from '../../../../../hoc/withFormHandler';
import { closeModal } from '../../../../../redux/features/modal/modalSlice';
import { formFieldI } from '../../../../../utils/formHelper';
import FormCreateTopic from '../../../../forms/formForum/formCreateTopic';
import ConfirmItemCreation from '../../../../../components/ConfirmItemCreation/confirmItemCreation';
import { useAppSelector } from '../../../../../redux/hooks';
import {
  selectProfile,
  selectUser,
} from '../../../../../redux/features/user/userSlice';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ActionTracker,
  CreateItem,
  GetItemDetail,
  UpdateItem,
} from '../../../../../redux/features/forum/forumThunk';
import {
  selectCategoriesList,
  selectTopicDetail,
} from '../../../../../redux/features/forum/forumSlice';

const modalId = 'topicModal';

interface ManageTopicFormI {
  formDisabled?: boolean;
  creation?: boolean;
}

interface ManageTopicI extends withFormHandlerProps, ManageTopicFormI {}

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
  const userProfile = useAppSelector(selectProfile);
  const dispatch = useDispatch();
  const { id } = useParams();
  const userId = useAppSelector(selectUser)?.id;
  const topicDetail: { [key: string]: string | boolean } | undefined =
    useAppSelector(selectTopicDetail);
  const categoriesList = useAppSelector(selectCategoriesList);
  const [newNodeId, setNewNodeId] = useState();
  const navigate = useNavigate();

  const resetModal = () => {
    setStep('form');
    setNewFormValues({});
  };

  const handleSaveTopic = async () => {
    if (isFormValid) {
      if (id) {
        const res = await dispatch(
          UpdateItem(
            id,
            {
              ...newFormValues,
              title: newFormValues.title?.toString(),
              entity:
                userProfile?.idProgetto || userProfile?.idProgramma
                  ? userProfile.nomeEnte
                  : userProfile?.descrizioneRuolo,
              entity_type: userProfile?.idProgetto
                ? 'Ente gestore di progetto'
                : userProfile?.idProgramma
                ? 'Ente gestore di programma'
                : '-',
              attachment:
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                newFormValues?.attachment?.name !==
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                newFormValues?.attachment?.data
                  ? newFormValues?.attachment
                  : undefined,
              removeAttachment:
                topicDetail?.attachment &&
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                newFormValues?.attachment?.name &&
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                !newFormValues?.attachment?.data,
            },
            'forum'
          )
        );
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        if (res) {
          userId && dispatch(GetItemDetail(id, userId, 'community'));
          setNewFormValues({});
          setStep('confirm');
        }
      } else {
        const res = await dispatch(
          CreateItem(
            {
              ...newFormValues,
              entity:
                userProfile?.idProgetto || userProfile?.idProgramma
                  ? userProfile.nomeEnte
                  : userProfile?.descrizioneRuolo,
              entity_type: userProfile?.idProgetto
                ? 'Ente gestore di progetto'
                : userProfile?.idProgramma
                ? 'Ente gestore di programma'
                : '-',
            },
            'forum'
          )
        );
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        if (res) {
          dispatch(
            ActionTracker({
              target: 'tnd',
              action_type: 'CREAZIONE',
              event_type: 'TOPIC',
              category: categoriesList.find(
                (c) => c.id === newFormValues.category
              ).name,
            })
          );
          setNewFormValues({});
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          setNewNodeId(res?.data?.data?.id);
          setStep('confirm');
        }
      }
    }
  };

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
          resetModal();
          dispatch(closeModal());
        },
      },
    },
    confirm: {
      title: null,
      primaryCTA: {
        label: 'Chiudi',
        onClick: () => {
          resetModal();
          dispatch(closeModal());
          newNodeId && navigate(`/forum/${newNodeId}`);
        },
      },
      secondaryCTA: null,
    },
  };

  let content = <span></span>;

  switch (step) {
    case 'form':
      content = (
        <FormCreateTopic
          newFormValues={newFormValues}
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
          description={`Topic ${
            creation ? 'creato' : 'modificato'
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
      onClose={resetModal}
      darkTitle
      title={stepsCTA[step].title as string}
    >
      {content}
    </GenericModal>
  );
};

export default ManageTopic;

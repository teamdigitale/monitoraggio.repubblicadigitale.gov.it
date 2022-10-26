import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import ConfirmItemCreation from '../../../../../components/ConfirmItemCreation/confirmItemCreation';
import GenericModal, {
  CallToAction,
} from '../../../../../components/Modals/GenericModal/genericModal';
import { withFormHandlerProps } from '../../../../../hoc/withFormHandler';
import { selectEntityFiltersOptions } from '../../../../../redux/features/administrativeArea/administrativeAreaSlice';
import {
  ActionTracker,
  CreateItem,
  GetItemDetail,
  UpdateItem,
} from '../../../../../redux/features/forum/forumThunk';
import { closeModal } from '../../../../../redux/features/modal/modalSlice';
import {
  selectProfile,
  selectUser,
} from '../../../../../redux/features/user/userSlice';
import { useAppSelector } from '../../../../../redux/hooks';
import { formFieldI } from '../../../../../utils/formHelper';
import FormLoadDocument from '../../../../forms/formForum/formLoadDocument';
import {
  selectCategoriesList,
  selectDocDetail,
} from '../../../../../redux/features/forum/forumSlice';

const modalId = 'documentModal';
interface ManageDocumentFormI {
  formDisabled?: boolean;
  creation?: boolean;
}

interface ManageDocumentI extends withFormHandlerProps, ManageDocumentFormI {}

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
  const { id } = useParams();
  const userProfile = useAppSelector(selectProfile);
  const programsList = useAppSelector(selectEntityFiltersOptions)['programmi'];
  const userId = useAppSelector(selectUser)?.id;
  const docDetail: { [key: string]: string | boolean } | undefined =
    useAppSelector(selectDocDetail);
  const categoriesList = useAppSelector(selectCategoriesList);
  const [newNodeId, setNewNodeId] = useState();
  const navigate = useNavigate();

  const resetModal = () => {
    setStep('form');
    setNewFormValues({});
  };

  const handleSaveDoc = async () => {
    if (isFormValid) {
      if (id) {
        const res = await dispatch(
          UpdateItem(
            id,
            {
              ...newFormValues,
              program_label:
                newFormValues.program === 'public'
                  ? 'Tutti i programmi'
                  : programsList?.find(
                      (p) =>
                        p.value === parseInt(newFormValues.program as string)
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
              removeAttachment:
                docDetail?.attachment &&
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                newFormValues?.attachment?.name &&
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                !newFormValues?.attachment?.data,
            },
            'document'
          )
        );
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        if (res) {
          userId && dispatch(GetItemDetail(id, userId, 'document'));
          setStep('confirm');
        }
      } else {
        const res = await dispatch(
          CreateItem(
            {
              ...newFormValues,
              program_label:
                newFormValues.program === 'public'
                  ? 'Tutti i programmi'
                  : programsList?.find(
                      (p) =>
                        p.value === parseInt(newFormValues.program as string)
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
          )
        );
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        if (res) {
          dispatch(
            ActionTracker({
              target: 'tnd',
              action_type: 'CREAZIONE',
              event_type: 'DOCUMENTI',
              category: categoriesList.find(
                (c) => c.id === newFormValues.category
              ).name,
            })
          );
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          setNewNodeId(res?.data?.data?.id);
          setStep('confirm');
        }
      }
    }
  };

  let content = <span></span>;

  switch (step) {
    case 'form':
      content = (
        <FormLoadDocument
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
          description={`Documento ${
            creation ? 'caricato' : 'modificato'
          } correttamente!`}
        />
      );
      break;
    default:
      break;
  }

  const stepsCTA = {
    form: {
      title: `${creation ? 'Carica' : 'Modifica'} documento`,
      primaryCTA: {
        disabled: !isFormValid,
        label: creation ? 'Conferma' : 'Salva',
        onClick: () => handleSaveDoc(),
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
          newNodeId && navigate(`/documenti/${newNodeId}`);
        },
      },
      secondaryCTA: null,
    },
  };

  return (
    <GenericModal
      id={modalId}
      title={stepsCTA[step].title as string}
      primaryCTA={stepsCTA[step].primaryCTA}
      secondaryCTA={(stepsCTA[step].secondaryCTA as CallToAction) || null}
      centerButtons
      onClose={resetModal}
      darkTitle
    >
      {content}
    </GenericModal>
  );
};

export default ManageDocument;

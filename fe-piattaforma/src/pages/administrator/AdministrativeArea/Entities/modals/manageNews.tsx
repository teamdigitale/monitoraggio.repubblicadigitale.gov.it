import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import AnteprimaBachecaNews from '../../../../../components/AnteprimaNews/anteprimaNews';
import GenericModal, {
  CallToAction,
} from '../../../../../components/Modals/GenericModal/genericModal';
import { withFormHandlerProps } from '../../../../../hoc/withFormHandler';
import { closeModal } from '../../../../../redux/features/modal/modalSlice';
import { formFieldI } from '../../../../../utils/formHelper';
import FormPublishNews from '../../../../forms/formForum/formPublishNews';
import ConfirmItemCreation from '../../../../../components/ConfirmItemCreation/confirmItemCreation';
import { useAppSelector } from '../../../../../redux/hooks';
import {
  selectCategoriesList,
  selectNewsDetail,
} from '../../../../../redux/features/forum/forumSlice';
import {
  ActionTracker,
  CreateItem,
  GetItemDetail,
  UpdateItem,
} from '../../../../../redux/features/forum/forumThunk';
import { useNavigate, useParams } from 'react-router-dom';
import {
  selectProfile,
  selectUser,
} from '../../../../../redux/features/user/userSlice';
import { selectEntityFiltersOptions } from '../../../../../redux/features/administrativeArea/administrativeAreaSlice';

const modalId = 'newsModal';
interface ManageNewsFormI {
  formDisabled?: boolean;
  creation?: boolean;
}

interface ManageNewsI extends withFormHandlerProps, ManageNewsFormI {}
const ManageNews: React.FC<ManageNewsI> = ({
  formDisabled,
  creation = false,
  clearForm,
}) => {
  const [newFormValues, setNewFormValues] = useState<{
    [key: string]: formFieldI['value'];
  }>({});
  const [isFormValid, setIsFormValid] = useState<boolean>(true);
  const [step, setStep] = useState<'form' | 'preview' | 'confirm'>('form');
  const categoriesList = useAppSelector(selectCategoriesList);
  const { id } = useParams();
  const userId = useAppSelector(selectUser)?.id;
  const programsList = useAppSelector(selectEntityFiltersOptions)['programmi'];
  const userProfile = useAppSelector(selectProfile);
  const newsDetail: { [key: string]: string | boolean } | undefined =
    useAppSelector(selectNewsDetail);
  const [newNodeId, setNewNodeId] = useState();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const resetModal = () => {
    setStep('form');
    setNewFormValues({});
  };

  let content = <span></span>;

  const stepsCTA = {
    form: {
      title: `${creation ? 'Pubblica nuova' : 'Modifica'} news`,
      primaryCTA: {
        disabled: !isFormValid,
        label: creation ? 'Conferma' : 'Salva',
        onClick: () => handleSaveNews(),
      },
      secondaryCTA: {
        label: 'Annulla',
        onClick: () => {
          clearForm?.();
          resetModal();
          dispatch(closeModal());
        },
      },
      tertiaryCTA: null,
    },
    preview: {
      title: 'Anteprima news',
      primaryCTA: {
        label: creation ? 'Crea post' : 'Salva',
        onClick: () => handleSaveNews(),
      },
      secondaryCTA: {
        label: 'Annulla',
        onClick: () => {
          clearForm?.();
          resetModal();
          dispatch(closeModal());
        },
      },
      tertiaryCTA: {
        label: 'Indietro',
        onClick: () => setStep('form'),
      },
    },
    confirm: {
      title: null,
      primaryCTA: {
        label: 'Chiudi',
        onClick: () => {
          resetModal();
          dispatch(closeModal());
          newNodeId && navigate(`/bacheca/${newNodeId}`);
        },
      },
      secondaryCTA: null,
      tertiaryCTA: null,
    },
  };

  const handleSaveNews = async () => {
    if (isFormValid) {
      if (id) {
        const res = await dispatch(
          UpdateItem(
            id,
            {
              ...newFormValues,
              title: newFormValues.title?.toString(),
              program_label:
                newFormValues.program === 'public'
                  ? 'Tutti i programmi'
                  : programsList?.find(
                      (p) =>
                        Number(p.value) ===
                        parseInt(newFormValues.program as string)
                    )?.label,
              entity:
                userProfile?.idProgetto || userProfile?.idProgramma
                  ? userProfile.nomeEnte
                  : userProfile?.descrizioneRuolo,
              entity_type: userProfile?.idProgetto
                ? 'Ente gestore di progetto'
                : userProfile?.idProgramma
                ? 'Ente gestore di programma'
                : '-',
              cover:
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                newFormValues?.cover?.name !==
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                newFormValues?.cover?.data
                  ? newFormValues?.cover
                  : undefined,
              removeCover:
                newsDetail?.cover &&
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                newFormValues?.cover?.name &&
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                !newFormValues?.cover?.data,
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
                newsDetail?.attachment &&
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                newFormValues?.attachment?.name &&
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                !newFormValues?.attachment?.data,
            },
            'board'
          )
        );
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        if (res) {
          userId && dispatch(GetItemDetail(id, userId, 'board'));
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
                        Number(p.value) ===
                        parseInt(newFormValues.program as string)
                    )?.label,
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
            'board'
          )
        );
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        if (res) {
          dispatch(
            ActionTracker({
              target: 'tnd',
              action_type: 'CREAZIONE',
              event_type: 'NEWS',
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

  switch (step) {
    case 'form':
      content = (
        <FormPublishNews
          newFormValues={newFormValues}
          creation={creation}
          formDisabled={!!formDisabled}
          sendNewValues={(newData?: { [key: string]: formFieldI['value'] }) => {
            // console.log('qui passa', newData);
            setNewFormValues({ ...newData });
          }}
          setIsFormValid={(value: boolean | undefined) =>
            setIsFormValid(!!value)
          }
          onPreviewClick={() => setStep('preview')}
        />
      );
      break;
    case 'preview':
      content = (
        <AnteprimaBachecaNews
          {...newFormValues}
          program_label={
            programsList?.find(
              (p) => p.value === parseInt(newFormValues.program as string)
            )?.label
          }
          entity={
            userProfile?.idProgetto || userProfile?.idProgramma
              ? userProfile.nomeEnte
              : userProfile?.descrizioneRuolo
          }
          entity_type={
            userProfile?.idProgetto
              ? 'Ente gestore di progetto'
              : userProfile?.idProgramma
              ? 'Ente gestore di programma'
              : '-'
          }
          category_label={
            categoriesList.find((c) => c.id === newFormValues.category).name
          }
          isModalPreview
        />
      );
      break;
    case 'confirm':
      content = (
        <ConfirmItemCreation
          description={`News ${
            creation ? 'creata' : 'modificata'
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
      primaryCTA={stepsCTA[step].primaryCTA as CallToAction}
      secondaryCTA={(stepsCTA[step].secondaryCTA as CallToAction) || null}
      tertiaryCTA={(stepsCTA[step].tertiaryCTA as CallToAction) || null}
      centerButtons
      onClose={resetModal}
      darkTitle
      title={stepsCTA[step].title as string}
    >
      {content}
    </GenericModal>
  );
};

export default ManageNews;

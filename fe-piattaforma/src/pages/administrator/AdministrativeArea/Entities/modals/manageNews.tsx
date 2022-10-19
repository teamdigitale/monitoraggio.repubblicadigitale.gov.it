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
import clsx from 'clsx';
import ConfirmItemCreation from '../../../../../components/ConfirmItemCreation/confirmItemCreation';
import { useAppSelector } from '../../../../../redux/hooks';
import { selectCategoriesList } from '../../../../../redux/features/forum/forumSlice';
import {
  CreateItem,
  GetItemDetail,
  UpdateItem,
} from '../../../../../redux/features/forum/forumThunk';
import { useParams } from 'react-router-dom';
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
  const categoryList = useAppSelector(selectCategoriesList);
  const { id } = useParams();
  const userId = useAppSelector(selectUser)?.id;
  const programsList = useAppSelector(selectEntityFiltersOptions)['programmi'];
  const userProfile = useAppSelector(selectProfile);
  const dispatch = useDispatch();

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
          dispatch(closeModal());
        },
      },
      tertiaryCTA: null,
    },
    preview: {
      title: 'Anteprima news',
      primaryCTA: {
        label: creation ? 'Crea post' : 'Salva',
        onClick: () => setStep('confirm'),
      },
      secondaryCTA: {
        label: 'Annulla',
        onClick: () => {
          clearForm?.();
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
          setStep('form');
          dispatch(closeModal());
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
                : '-',
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
                : '-',
            },
            'board'
          )
        );
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        if (res) {
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
            categoryList.find((c) => c.id === newFormValues.category).name
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

export default ManageNews;

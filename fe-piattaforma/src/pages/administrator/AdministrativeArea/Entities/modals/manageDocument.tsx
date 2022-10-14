import clsx from 'clsx';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import ConfirmItemCreation from '../../../../../components/ConfirmItemCreation/confirmItemCreation';
import GenericModal, {
  CallToAction,
} from '../../../../../components/Modals/GenericModal/genericModal';
import { withFormHandlerProps } from '../../../../../hoc/withFormHandler';
import { closeModal } from '../../../../../redux/features/modal/modalSlice';
import { formFieldI } from '../../../../../utils/formHelper';
import FormLoadDocument from '../../../../forms/formForum/formLoadDocument';

const id = 'documentModal';
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
      title: `${creation ? 'Carica' : 'Modifica'} documento `,
      primaryCTA: {
        disabled: !isFormValid,
        label: creation ? 'Conferma' : 'Salva',
        onClick: () => {
          setStep('confirm');
          console.log(newFormValues);
        },
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
      id={id}
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

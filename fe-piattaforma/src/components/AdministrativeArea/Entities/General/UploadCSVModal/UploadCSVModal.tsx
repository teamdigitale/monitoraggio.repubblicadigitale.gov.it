import { Button } from 'design-react-kit';
import React, { useState } from 'react';
import { selectModalPayload } from '../../../../../redux/features/modal/modalSlice';
import { useAppSelector } from '../../../../../redux/hooks';
import { downloadCSV } from '../../../../../utils/common';
import FileInput from '../../../../General/FileInput/FileInput';
import GenericModal from '../../../../Modals/GenericModal/genericModal';

const id = 'upload-csv';

interface UploadCSVModalI {
  onConfirm: () => void;
  onClose: () => void;
}

const UploadCSVModal = ({ onConfirm, onClose }: UploadCSVModalI) => {
  const [step, setStep] = useState(0);
  const payload = useAppSelector(selectModalPayload);

  const downloadTemplateHandler = () => {
    downloadCSV(payload?.data, `${payload?.entity}.csv`);
  };

  let content = <span></span>;

  switch (step) {
    case 0:
      content = (
        <div className='d-flex flex-column align-items-center justify-content-center p-5'>
          <p className='py-3'>
            Scarica il template relativo alle entità da caricare.
          </p>
          <Button
            color='primary'
            outline
            onClick={() => downloadTemplateHandler()}
          >
            Scarica template
          </Button>
          <div className='w-100 pt-5'>
            <FileInput />
          </div>
        </div>
      );
      break;
    case 1:
      content = (
        <div className='d-flex justify-content-around align-items-center p-5 text-center'>
          <div>
            <h4>Riusciti</h4>
            <p>12</p>
          </div>
          <div>
            <h4>Falliti</h4>
            <p>2</p>
          </div>
        </div>
      );
      break;
    default:
      break;
  }

  const nextStep = () => {
    switch (step) {
      case 0:
        setStep(1);
        break;
      case 1:
        onConfirm();
        break;
      default:
        break;
    }
  };

  return (
    <GenericModal
      id={id}
      primaryCTA={{
        label: 'Conferma',
        onClick: nextStep,
      }}
      secondaryCTA={{
        label: 'Annulla',
        onClick: onClose,
      }}
      centerButtons
      onClose={onClose}
    >
      {content}
    </GenericModal>
  );
};

export default UploadCSVModal;

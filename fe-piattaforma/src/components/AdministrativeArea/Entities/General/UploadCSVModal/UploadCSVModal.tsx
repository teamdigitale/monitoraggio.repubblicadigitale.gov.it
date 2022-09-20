import { Button } from 'design-react-kit';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import {
  closeModal,
  selectModalPayload,
} from '../../../../../redux/features/modal/modalSlice';
import { useAppSelector } from '../../../../../redux/hooks';
import { downloadCSV, downloadFile } from '../../../../../utils/common';
import FileInput from '../../../../General/FileInput/FileInput';
import GenericModal from '../../../../Modals/GenericModal/genericModal';
import { UploadFile } from '../../../../../redux/features/administrativeArea/administrativeAreaThunk';

const id = 'upload-csv';

interface UploadCSVModalI {
  accept?: string | undefined;
  children?: React.ReactElement;
  onConfirm?: () => void;
  onClose?: () => void;
  onEsito?: (esito: { ok: string; ko: string; list: any[] }) => void;
  template?: any;
  templateName?: string;
}

const UploadCSVModal: React.FC<UploadCSVModalI> = (props) => {
  const {
    accept,
    children,
    onConfirm,
    onClose,
    onEsito,
    template,
    templateName,
  } = props;
  const [step, setStep] = useState(0);
  const payload = useAppSelector(selectModalPayload);
  const [file, setFile] = useState<Blob | null>();
  const [esito, setEsito] = useState({
    ok: '-',
    ko: '-',
    list: [],
  });
  const dispatch = useDispatch();

  useEffect(() => {
    if (onEsito) onEsito(esito);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [esito]);

  const resetModal = () => {
    setStep(0);
    if (onClose) onClose();
    dispatch(closeModal());
  };

  const downloadTemplateHandler = () => {
    if (template) {
      downloadFile(
        template,
        templateName || `${payload?.entity}-template.xlsx`
      );
    } else if (payload?.data) {
      downloadCSV(payload?.data, `${payload?.entity}-template.csv`, true);
    }
  };

  let content = <span></span>;

  switch (step) {
    case 0:
      content = (
        <div className='d-flex flex-column align-items-center justify-content-center p-5'>
          <div id='file-target' />
          <p className='py-3'>
            Scarica il template relativo alle entità da caricare.
          </p>
          <Button color='primary' outline onClick={downloadTemplateHandler}>
            Scarica template
          </Button>
          <div className='w-100 pt-5'>
            <FileInput accept={accept} onFileChange={(file) => setFile(file)} />
          </div>
        </div>
      );
      break;
    case 1: {
      content = (
        <div className='container'>
          <div className='d-flex justify-content-around align-items-center p-5 text-center'>
            <div>
              <h4>Riusciti</h4>
              <p>{esito?.ok}</p>
            </div>
            <div>
              <h4>Falliti</h4>
              <p>{esito?.ko}</p>
            </div>
          </div>
          {children}
        </div>
      );
      break;
    }
    default:
      break;
  }

  const nextStep = async () => {
    switch (step) {
      case 0: {
        try {
          if (payload?.endpoint && file) {
            const formData = new FormData();
            formData.append('file', file);
            const res = await dispatch(
              UploadFile({
                formData,
                endpoint: payload?.endpoint,
              })
            );
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            if (res) {
              console.log('upload response', res);
              setEsito({
                ...esito,
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                ok: (res || []).filter(({ esito }: { esito: string }) =>
                  esito?.toUpperCase().includes('OK')
                ).length,
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                ko: (res || []).filter(({ esito }: { esito: string }) =>
                  esito?.toUpperCase().includes('KO')
                ).length,
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                list: [...res],
              });
              setStep(1);
            }
          } else {
            setStep(1);
          }
        } catch (err) {
          console.log('UploadFile', err);
        }
        break;
      }
      case 1: {
        if (onConfirm) {
          onConfirm();
        }
        resetModal();
        break;
      }
      default:
        break;
    }
  };

  return (
    <GenericModal
      id={id}
      primaryCTA={
        step === 0
          ? {
              label: 'Conferma',
              onClick: nextStep,
              disabled: step === 0 && !file,
            }
          : {
              label: 'Chiudi',
              onClick: resetModal,
            }
      }
      secondaryCTA={
        step === 0
          ? {
              label: 'Annulla',
              onClick: resetModal,
            }
          : undefined
      }
      centerButtons
    >
      {content}
    </GenericModal>
  );
};

export default UploadCSVModal;

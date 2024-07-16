import React, { useCallback, useContext, useState } from 'react';
import fileUploadImg from './../../../public/assets/img/file_upload.png';
import { dispatchNotify } from '../../utils/notifictionHelper';
import itDeletePrimary from '../../../public/assets/img/it-delete-primary.png';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { mapRule } from '../../utils/csvUtils';
import WarningModal from '../FileHandling/WarningModal';
import { closeModal, openModal } from '../../redux/features/modal/modalSlice';
import { selectProfile } from '../../redux/features/user/userSlice';
import { ProjectContext } from '../../contexts/ProjectContext';

function showErrorFormatCSV() {
  dispatchNotify({
    title: 'Caricamento file',
    status: 'error',
    message: `Il file contenente i dati da caricare deve essere in formato CSV. Il sistema non accetta altri tipi di estensione.`,
    closable: true,
    duration: 'slow',
  });
}
type CSVUploaderProps = {
  file: File | undefined;
  saveFile: (file: File) => Promise<void>;
  removeFile: () => void;
};
function showError() {
  dispatchNotify({
    title: 'Caricamento file',
    status: 'error',
    message: 'Errore nel caricamento file',
    closable: true,
    duration: 'slow',
  });
}
//const maxSizeCSV = 531457280;
const acceptedFileTypes = [
  '.csv',
  'text/csv',
  'application/vnd.ms-excel',
  'application/csv',
  'text/x-csv',
  'application/x-csv',
  'text/comma-separated-values',
  'text/x-comma-separated-values',
];

export default function CSVUploader({
  file,
  saveFile,
  removeFile,
}: CSVUploaderProps) {
  const dispatch = useAppDispatch();
  const { codiceRuolo: userRole } = useAppSelector(selectProfile) || {};
  const projectContext = useContext(ProjectContext);
  const [selectedFile, setSelectedFile] = useState<File[] | null>(null);

  const handleFileInput = useCallback(
    (filesToUpload: File[]) => {
      if (
        !file &&
        filesToUpload.length === 1 &&
        //filesToUpload[0].size <= maxSizeCSV &&
        acceptedFileTypes.some((fileType) => fileType === filesToUpload[0].type)
      ) {
        saveFile(filesToUpload[0]).catch(() => {
          showError();
        });
      } else {
        showErrorFormatCSV();
      }
    },
    [file, saveFile]
  );

  const showConfirmDialog = useCallback(
    (file: File[]) => {
      setSelectedFile(file);
      if (userRole !== 'DTD') {
        dispatch(
          openModal({
            id: 'dataUpload',
            payload: {
              title: ``,
            },
          })
        );
      }
    },
    [userRole]
  );

  const handleDrop = useCallback(
    (event) => {
      event.preventDefault();
      showConfirmDialog(event.dataTransfer.files);
    },
    [handleFileInput, showConfirmDialog]
  );

  const handleInput = useCallback(
    (e) => {
      e.preventDefault();
      showConfirmDialog(e.target.files);
    },
    [handleFileInput, showConfirmDialog]
  );

  const handleAccept = useCallback(() => {
    if (selectedFile) {
      handleFileInput(selectedFile);
    }
    dispatch(closeModal());
    setSelectedFile(null);
  }, [selectedFile, handleFileInput]);

  const handleReject = useCallback(() => {  
    dispatch(closeModal());
    setSelectedFile(null);
  }, []);

  return (
    <>
      <WarningModal
        id='dataUpload'
        onClose={handleReject}
        onConfirm={handleAccept}
        confirmLabel='Conferma'
      >
        <div className='text-secondary'>
          <div>
            <p>
              Stai operando in qualità di{' '}
              {userRole ? mapRule.get(userRole) : ''} dell'ente{' '}
              {projectContext?.nomeEnte} per il progetto{' '}
              {projectContext?.nomeBreve}.
            </p>
          </div>
          <div className='mt-2'>
            <p>
              Ricorda: puoi caricare{' '}
              <strong>solo i dati dei servizi effettivamente erogati</strong>{' '}
              presso le sedi del tuo ente e
              <strong> sei responsabile della loro veridicità.</strong>
              <br></br>Confermi di voler procedere?
            </p>
          </div>
        </div>
      </WarningModal>
      <div className={`flex-column min-width-50 ${file ? 'h-auto' : 'h-100'}`}>
        <div
          className={`upload-dragdrop ${
            file ? 'success' : ''
          } py-4 pr-4 w-100 h-100 align-items-start`}
          data-bs-upload-dragdrop
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
        >
          <div className='mx-4 xs-d-none d-block'>
            <img
              className='csv-uploader-img'
              src={fileUploadImg}
              alt='descrizione immagine'
              aria-hidden='true'
            />
          </div>
          <div className='upload-dragdrop-text w-100'>
            {file ? (
              <>
                <p className='font-weight-semibold text-primary file-title-csv'>
                  Il tuo file
                </p>
                <div className='d-flex align-items-center justify-content-between'>
                  <p className='font-weight-semibold text-black'>
                    {file?.name}
                  </p>
                  <button className='btn p-0 ml-4' onClick={handleReject}>
                    <img
                      className='delete-csv-btn-img'
                      src={itDeletePrimary}
                      alt=''
                    />
                  </button>
                </div>
                <hr className='mt-1' />
              </>
            ) : (
              <>
                <h5>Trascina il file dati (CSV)</h5>
                <p>
                  oppure{' '}
                  <input
                    type='file'
                    name='upload7'
                    id='upload7'
                    className='upload-dragdrop-input'
                    value={file}
                    onChange={handleInput}
                    accept='.csv'
                  />
                  <label htmlFor='upload7' className='font-weight-semibold'>
                    selezionalo dal tuo dispositivo
                  </label>
                </p>
                <hr />
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

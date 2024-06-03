import React, { useCallback } from 'react';
import fileUploadImg from './../../../public/assets/img/file_upload.png';
import checkImg from './../../../public/assets/img/icon-check-no-circle.png';
import { dispatchNotify } from '../../utils/notifictionHelper';

function showWarning() {
  dispatchNotify({
    title: 'Caricamento file',
    status: 'warning',
    message: `É possibile inserire un solo file per volta in formato CSV, inoltre la dimensione massima consentitá é di 30 MB.`,
    closable: true,
    duration: 'slow',
  });
}
function showSuccess() {
  dispatchNotify({
    title: 'Caricamento file',
    status: 'success',
    message: 'File correttamente caricato',
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
const maxSizeCSV = 31457280;
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
  const handleFileInput = useCallback(
    (filesToUpload: File[]) => {
      if (
        !file &&
        filesToUpload.length === 1 &&
        filesToUpload[0].size <= maxSizeCSV &&
        acceptedFileTypes.some((fileType) => fileType === filesToUpload[0].type)
      ) {
        saveFile(filesToUpload[0])
          .then(() => {
            showSuccess();
          })
          .catch(() => {
            showError();
          });
      } else {
        showWarning();
      }
    },
    [file, saveFile]
  );

  const handleDrop = useCallback(
    (event) => {
      event.preventDefault();
      handleFileInput(event.dataTransfer.files);
    },
    [handleFileInput]
  );

  const handleInput = useCallback(
    (e) => {
      e.preventDefault();
      handleFileInput(e.target.files);
    },
    [handleFileInput]
  );

  return (
    <div className='flex-column min-width-50'>
      <div
        className={`upload-dragdrop ${file ? 'success' : ''} py-4`}
        data-bs-upload-dragdrop
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
      >
        <div className='upload-dragdrop-image'>
          <img
            src={fileUploadImg}
            alt='descrizione immagine'
            aria-hidden='true'
          />
          <div className='upload-dragdrop-success'>
            <img
              className='csv-upload-success-img'
              src={checkImg}
              alt=''
              width={16}
              height={16}
            />
          </div>
        </div>
        <div className='upload-dragdrop-text'>
          {file ? (
            <>
              <p>{file?.name}</p>
              <div className='mx-auto d-flex align-items-center'>
                <button className='btn btn-secondary' onClick={removeFile}>
                  Rimuovi il file
                </button>
              </div>
            </>
          ) : (
            <>
              <h5>Trascina il file CSV per caricarlo</h5>
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
                <label htmlFor='upload7'>selezionalo dal dispositivo</label>
              </p>
              <hr />
              <p>massimo 30 Mb</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

import React, { useCallback } from 'react';
import fileUploadImg from './../../../public/assets/img/file_upload.png';
import { dispatchNotify } from '../../utils/notifictionHelper';
import itDeletePrimary from '../../../public/assets/img/it-delete-primary.png';

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
                <p className='font-weight-semibold text-black'>{file?.name}</p>
                <button className='btn p-0 ml-4' onClick={removeFile}>
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
              <p>massimo 30 Mb</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

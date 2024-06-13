import React, { useCallback, useContext } from 'react';
import { Spinner } from 'design-react-kit';
import { useCSVProcessor } from '../../hooks/useCSVProcessor';
import { DataUploadContext } from '../../contexts/DataUploadContext';
import { dispatchNotify } from '../../utils/notifictionHelper';
import checkImg from './../../../public/assets/img/icon-check-no-circle.png';

type CSVProcessorProps = {
  file: File | undefined;
};

function showSuccess() {
  dispatchNotify({
    title: 'Elaborazione file',
    status: 'success',
    message: 'Elaborazione del file completata con successo',
    closable: true,
    duration: 'slow',
  });
}

function showError(error: Error) {
  dispatchNotify({
    title: 'Elaborazione file',
    status: 'error',
    message: error.message,
    closable: true,
    duration: 'slow',
  });
}

export default function ProcessFileCsv({ file }: CSVProcessorProps) {
  const { isProcessing, processCSV } = useCSVProcessor(file);
  const dataUploadContext = useContext(DataUploadContext);
  const handleProcessCSV = useCallback(() => {
    processCSV()
      .then((data) => {
        if (dataUploadContext) {
          dataUploadContext.setParsedData(data);
        }
        showSuccess();
      })
      .catch((error) => {
        showError(error);
      });
  }, [processCSV, dataUploadContext]);

  return (
    <>
      <div className='text-center'>
        <p className='font-weight-semibold text-primary'>
          {dataUploadContext?.parsedData ? (
            <div className='d-flex align-items-center justify-content-center gap-2'>
              <div
                className='bg-primary rounded-circle mx-2'
                style={{ width: '32px', height: '32px' }}
              >
                <img src={checkImg} alt='' width={16} height={16} />
              </div>
              File controllato
            </div>
          ) : (
            <>Controlla il file</>
          )}
        </p>
      </div>

      <button
        className='btn btn-secondary w-100'
        onClick={handleProcessCSV}
        disabled={!!dataUploadContext?.parsedData}
      >
        Controlla
      </button>
      {isProcessing && <Spinner active />}
    </>
  );
}

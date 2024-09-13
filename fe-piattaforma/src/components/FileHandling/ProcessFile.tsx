import React, { useCallback, useContext } from 'react';
import { Spinner } from 'design-react-kit';
import { useFileProcessor } from '../../hooks/useFileProcessor';
import { DataUploadContext } from '../../contexts/DataUploadContext';
import { dispatchNotify } from '../../utils/notifictionHelper';
import checkImg from './../../../public/assets/img/icon-check-no-circle.png';

type CSVProcessorProps = {
  file: File | undefined;
};

function showError(error: Error) {
  dispatchNotify({
    title: 'Elaborazione file',
    status: 'error',
    message: error.message,
    closable: true,
    duration: 'slow',
  });
}

export default function ProcessFile({ file }: CSVProcessorProps) {
  const { isProcessing, processFile } = useFileProcessor(file);
  const dataUploadContext = useContext(DataUploadContext);

  const handleProcessFile = useCallback(() => {
    processFile()
      .then((data) => {
        if (dataUploadContext) {
          dataUploadContext.setParsedData(data);
        }
      })
      .catch((error) => {
        showError(error);
      });
  }, [processFile, dataUploadContext]);

  return (
    <>
      <div className='text-center mb-2'>
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
        onClick={handleProcessFile}
        disabled={!!dataUploadContext?.parsedData}
      >
        Controlla
      </button>
      {isProcessing && <Spinner active />}
    </>
  );
}

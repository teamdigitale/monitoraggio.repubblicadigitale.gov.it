import React, { useCallback, useContext } from 'react';
import { Spinner } from 'design-react-kit';
import { useCSVProcessor } from '../../hooks/useCSVProcessor';
import { DataUploadContext } from '../../contexts/DataUploadContext';
import { dispatchNotify } from '../../utils/notifictionHelper';

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

function showError(error:Error) {
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
    processCSV().then(data => {
      if (dataUploadContext){
        dataUploadContext.setParsedData(data);
      }
     showSuccess();
    }).catch(error => {
      showError(error);
    });
  }, [processCSV, dataUploadContext]);


  return (
    <div className='row mb-2'>
      <div className='col'>
        <button
          className='btn btn-secondary w-100'
          onClick={handleProcessCSV}
          disabled={!!dataUploadContext?.parsedData}
        >
          Elabora file
        </button>
      </div>
      <div className='col-auto'>{isProcessing && <Spinner active />}</div>
    </div>
  );
}

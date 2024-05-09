import React, { useCallback, useContext, useState } from 'react';
import CSVUploader from '../../CSVUploader/CSVUploader';
import ProcessFileCsv from '../ProcessFileCsv';
import SubmitFileCsv from '../SubmitFileCsv';
import { DataUploadContext } from '../../../contexts/DataUploadContext';
import { DataUploadContextModel } from '../../../models/DataUploadContext.model';

export default function CSVFileHandler() {
  const [file, setFile] = useState<File | undefined>();
  const dataUploadContext = useContext<DataUploadContextModel | undefined>(
    DataUploadContext
  );

  const saveFile = useCallback((newFile: File): Promise<void> => {
    return new Promise((resolve) => {
      setFile(newFile);
      resolve();
    });
  }, []);

  const removeFile = useCallback(() => {
    setFile(undefined);
    if (dataUploadContext && dataUploadContext.parsedData) {
      dataUploadContext.setParsedData(undefined);
    }
  }, [dataUploadContext]);

  return (
    <div>
      <CSVUploader file={file} saveFile={saveFile} removeFile={removeFile} />
      {file && (
        <>
          <ProcessFileCsv file={file} />
          <SubmitFileCsv clearFile={removeFile} />
        </>
      )}
    </div>
  );
}

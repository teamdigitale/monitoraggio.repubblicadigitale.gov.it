import React, { useCallback, useContext, useState } from 'react';
import CSVUploader from '../../CSVUploader/CSVUploader';
import ProcessFile from '../ProcessFile';
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
    <div className={`csv-uploader-container container h-100`}>
      <CSVUploader file={file} saveFile={saveFile} removeFile={removeFile} />
      <div className={file ? 'd-block' : 'd-none'}>
        <div className='my-2 row'>
          <div className='col-12 col-md-6 d-flex flex-column justify-content-around my-2 px-4'>
            <ProcessFile file={file} removeFile={removeFile} />
          </div>
          <div className='col-12 col-md-6 d-flex flex-column justify-content-around my-2 px-4'>
            <SubmitFileCsv clearFile={removeFile} />
          </div>
        </div>
      </div>
    </div>
  );
}

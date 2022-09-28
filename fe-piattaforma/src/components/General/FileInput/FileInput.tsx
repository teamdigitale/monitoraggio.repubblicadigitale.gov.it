import { Button, Icon } from 'design-react-kit';
import React, { useEffect, useRef, useState } from 'react';

interface FileInputI {
  accept?: string | undefined;
  onFileChange?: (file: Blob | undefined | null) => void;
}

const defaultFormat = 'image/*,.pdf,.doc,.docx,.xls,.xlsx,.csv';

const FileInput: React.FC<FileInputI> = (props) => {
  const { accept = defaultFormat, onFileChange = () => ({}) } = props;
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<Blob | null>();
  const [fileName, setFileName] = useState<string | null>(null);

  useEffect(() => {
    if (onFileChange) onFileChange(file);
  }, [file]);

  const addDocument = () => {
    if (inputRef.current !== null) {
      inputRef.current.click();
    }
  };
  const updateFile = () => {
    const input: HTMLInputElement = document.getElementById(
      'file'
    ) as HTMLInputElement;

    if (input.files?.length) {
      const selectedFile = input.files[0];
      if (selectedFile) {
        setFile(selectedFile);
      }

      const reader = new FileReader();
      reader.readAsDataURL(selectedFile);
      reader.onloadend = () => {
        setFileName(selectedFile.name as string);
      };
    }
  };

  const removeFile = () => {
    const input: HTMLInputElement = document.getElementById(
      'file'
    ) as HTMLInputElement;

    if (input.files?.length) {
      input.value = '';
      setFile(null);
      setFileName(null);
    }
  };

  return (
    <div className='w-100 border-bottom'>
      <input
        type='file'
        id='file'
        accept={accept}
        ref={inputRef}
        className='sr-only'
        capture
        onChange={updateFile}
      />
      <label
        htmlFor='file'
        className='d-flex align-items-center justify-content-between'
      >
        <p className='mt-2' style={{ color: '#4c4c4d' }}>
          {fileName ? (
            <strong>{fileName}</strong>
          ) : (
            'Carica file dal tuo dispositivo'
          )}
        </p>
        {fileName && (
          <Button icon className='p-2' onClick={removeFile}>
            <Icon icon='it-less-circle' size='sm' color='primary' />
          </Button>
        )}
        {fileName === null && (
          <Button outline color='primary' className='p-2' onClick={addDocument}>
            <Icon icon='it-plus' size='sm' color='primary' /> Seleziona file
          </Button>
        )}
      </label>
    </div>
  );
};

export default FileInput;

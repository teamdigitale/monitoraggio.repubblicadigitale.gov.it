import { Button, Icon } from 'design-react-kit';
import React, { useRef, useState } from 'react';

const FileInput = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<string | null>(null);

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
      const reader = new FileReader();
      reader.readAsDataURL(selectedFile);
      reader.onloadend = () => {
        setFile(selectedFile.name as string);
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
    }
  };

  return (
    <div className='w-100 border-bottom'>
      <input
        type='file'
        id='file'
        accept='image/*,.pdf,.doc,.docx,.xls,.xlsx,.csv'
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
          {file ? <strong>{file}</strong> : 'Carica file dal tuo dispositivo'}
        </p>
        {file && (
          <Button icon className='p-2' onClick={removeFile}>
            <Icon icon='it-delete' size='sm' color='primary' />
          </Button>
        )}
        {file === null && (
          <Button outline color='primary' className='p-2' onClick={addDocument}>
            <Icon icon='it-plus' size='sm' color='primary' /> Seleziona file
          </Button>
        )}
      </label>
    </div>
  );
};

export default FileInput;

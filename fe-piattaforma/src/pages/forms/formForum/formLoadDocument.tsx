import React, { useEffect, useRef, useState } from 'react';
import withFormHandler, {
  withFormHandlerProps,
} from '../../../hoc/withFormHandler';
import { Form, Input, Select } from '../../../components';
import {
  //CommonFields,
  formFieldI,
  newForm,
  newFormField,
} from '../../../utils/formHelper';
import { Button, Icon } from 'design-react-kit';
import clsx from 'clsx';
import TextArea from '../../../components/Form/textarea';
import './formForum.scss';

interface uploadDocumentI extends withFormHandlerProps {
  formDisabled?: boolean;
  sendNewValues?: (param?: { [key: string]: formFieldI['value'] }) => void;
  setIsFormValid?: (param: boolean | undefined) => void;
  creation?: boolean;
}

export const documentFormDropdownOptions = {
  intervento: [
    { label: 'RFD', value: 'RFD' },
    { label: 'int2', value: 'int2' },
    { label: 'int3', value: 'int3' },
  ],
  programma: [
    { label: 'Programma 1 nome breve', value: 'Programma 1 nome breve' },
    { label: 'prgm2', value: 'prgm2' },
    { label: 'prgm3', value: 'prgm3' },
  ],
  categoria: [
    { label: 'Brochure', value: 'Brochure' },
    { label: 'ctg2', value: 'ctg2' },
    { label: 'ctg3', value: 'ctg3' },
  ],
};

const FormLoadDocument: React.FC<uploadDocumentI> = (props) => {
  const {
    // setFormValues = () => ({}),
    form,
    isValidForm,
    onInputChange = () => ({}),
    sendNewValues = () => ({}),
    setIsFormValid = () => ({}),
    getFormValues = () => ({}),
  } = props;

  const formDisabled = !!props.formDisabled;
  const onInputDataChange = (
    value: formFieldI['value'],
    field?: formFieldI['field']
  ) => {
    onInputChange?.(value, field);
    sendNewValues?.(getFormValues?.());
  };

  // useEffect(() => {
  //   if (formData) {
  //     setFormValues(formData);
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [formData]);

  useEffect(() => {
    setIsFormValid?.(isValidForm);
    sendNewValues?.(getFormValues?.());
  }, [form]);

  const bootClass = 'justify-content-between px-0 px-lg-5 mx-2';
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<string>('Carica file dal tuo dispositivo');
  const [iconVisible, setIconVisible] = useState<boolean>(false);

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
    setIconVisible(!iconVisible);
  };

  return (
    <Form
      id='form-load-document'
      className='mt-5 mb-0'
      formDisabled={formDisabled}
    >
      <Form.Row className={bootClass}>
        <Input
          {...form?.titolo}
          required
          col='col-lg-12 col-12 mb-0'
          label='Titolo'
          maxLength={55}
          onInputChange={onInputChange}
          aria-describedby='input-help-description'
        />
        <small
          id='input-help-description'
          className={clsx('font-italic', 'form-text', 'text-muted', 'mb-5')}
        >
          massimo 55 caratteri
        </small>
      </Form.Row>
      <Form.Row className={clsx('mb-5', bootClass)}>
        <Select
          {...form?.intervento}
          wrapperClassName='col-12 col-lg-5 mb-0 pb-5'
          onInputChange={onInputDataChange}
          options={documentFormDropdownOptions['intervento']}
          isDisabled={formDisabled}
          placeholder='Seleziona'
        />
        <Select
          {...form?.programma}
          wrapperClassName='col-12 col-lg-5 mb-0 pb-2'
          onInputChange={onInputDataChange}
          options={documentFormDropdownOptions['programma']}
          isDisabled={formDisabled}
          placeholder='Seleziona'
        />
      </Form.Row>
      <Form.Row className={bootClass}>
        <Select
          {...form?.categoria}
          wrapperClassName='col-12 col-lg-5'
          onInputChange={onInputDataChange}
          options={documentFormDropdownOptions['categoria']}
          isDisabled={formDisabled}
          placeholder='Seleziona'
        />
      </Form.Row>
      <Form.Row className={bootClass}>
        <TextArea
          {...form?.descrizione}
          rows={6}
          cols={100}
          maxLength={800}
          className='mb-1 mt-3'
          placeholder=' '
        />
      </Form.Row>
      <Form.Row className={bootClass}>
        <small className='font-italic form-text text-muted'>
          massimo 800 caratteri
        </small>
      </Form.Row>
      <Form.Row className={bootClass}>
        <div className='mt-5 d-flex align-items-center'>
          <strong className='mr-2'>ALLEGA FILE</strong>
          <Icon icon='it-info-circle' size='sm' color='primary' />
        </div>
      </Form.Row>
      <Form.Row className={bootClass}>
        <div className='w-100 border-bottom-box'>
          <input
            type='file'
            id='file'
            accept='image/*,.pdf,.doc,.docx,.xls,.xlsx'
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
              {file}
            </p>
            {!iconVisible ? (
              <Button
                outline
                color='primary'
                className='py-2 px-0 btn-document-modal'
                onClick={addDocument}
              >
                <Icon
                  icon='it-plus'
                  size='sm'
                  color='primary'
                  className='pb-1'
                />{' '}
                Seleziona file
              </Button>
            ) : (
              <Icon
                icon='it-delete'
                color='primary'
                size='sm'
                className='mr-4'
              /> //TODO add function to delete file
            )}
          </label>
        </div>
        <small className='font-italic form-text text-muted'>massimo 5 Mb</small>
      </Form.Row>
      <Form.Row className={bootClass}>
        <div className='mt-5 d-flex align-items-center'>
          <strong className='mr-2'>INSERISCI URL</strong>
          <Icon icon='it-info-circle' size='sm' color='primary' />
        </div>
      </Form.Row>
      <Form.Row className={bootClass}>
        <Input
          {...form?.inserisciUrl}
          placeholder='Inserisci il link a un contenuto esterno'
          col='col-lg-12 col-12 px-0 mb-5'
          className='px-0'
        />
      </Form.Row>
    </Form>
  );
};
const form = newForm([
  newFormField({
    //..CommonFields?
    field: 'titolo',
    id: 'titolo',
    required: true,
  }),
  newFormField({
    field: 'intervento',
    id: 'intervento',
    label: 'Intervento',
    type: 'select',
    required: true,
  }),
  newFormField({
    field: 'programma',
    id: 'programma',
    label: 'Programma',
    type: 'select',
    required: true,
  }),
  newFormField({
    field: 'categoria',
    id: 'categoria',
    label: 'Categoria',
    type: 'select',
    required: true,
  }),
  newFormField({
    field: 'descrizione',
    id: 'descrizione',
    label: 'Descrizione',
    required: true,
    type: 'textarea',
  }),
  newFormField({
    field: 'allegaFile',
    id: 'allegaFile',
    type: 'file',
  }),
  newFormField({
    field: 'inserisciUrl',
    id: 'inserisciUrl',
    type: 'url',
  }),
]);
export default withFormHandler({ form }, FormLoadDocument);

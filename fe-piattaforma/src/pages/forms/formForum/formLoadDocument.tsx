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
import { useDispatch } from 'react-redux';
import { useAppSelector } from '../../../redux/hooks';
import {
  selectCategoriesList,
  selectDocDetail,
} from '../../../redux/features/forum/forumSlice';
import {
  selectEntityFiltersOptions,
  setEntityFilters,
} from '../../../redux/features/administrativeArea/administrativeAreaSlice';
import { GetEntityFilterValues } from '../../../redux/features/administrativeArea/administrativeAreaThunk';
import { GetCategoriesList } from '../../../redux/features/forum/categories/categoriesThunk';
import { uploadFile } from '../../../utils/common';
import { selectDevice } from '../../../redux/features/app/appSlice';

interface uploadDocumentI extends withFormHandlerProps {
  formDisabled?: boolean;
  newFormValues: { [key: string]: formFieldI['value'] };
  sendNewValues?: (param?: { [key: string]: formFieldI['value'] }) => void;
  setIsFormValid?: (param: boolean | undefined) => void;
  creation?: boolean;
}

const entity = 'progetto';

const defaultDocument = {
  name: 'Carica documenti, foto ecc.',
};

const FormLoadDocument: React.FC<uploadDocumentI> = (props) => {
  const {
    newFormValues,
    form,
    isValidForm,
    creation,
    updateForm = () => ({}),
    onInputChange = () => ({}),
    sendNewValues = () => ({}),
    setIsFormValid = () => ({}),
    getFormValues = () => ({}),
  } = props;

  const formDisabled = !!props.formDisabled;
  const bootClass = 'justify-content-between px-0 px-lg-5 mx-2';
  const inputRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<{ name?: string; data?: string | File }>(
    defaultDocument
  );
  const dispatch = useDispatch();
  const categoriesList = useAppSelector(selectCategoriesList);
  const programsList = useAppSelector(selectEntityFiltersOptions)['programmi'];
  const policiesList = useAppSelector(selectEntityFiltersOptions)['policies'];
  const [programDropdownOptions, setProgramDropdownOptions] = useState(
    programsList || []
  );
  const [interventionsDropdownOptions, setInterventionsDropdownOptions] =
    useState(programsList || []);
  const docDetail: { [key: string]: string | boolean } | undefined =
    useAppSelector(selectDocDetail);
  const device = useAppSelector(selectDevice);

  const getInterventionsList = () => {
    dispatch(GetEntityFilterValues({ entity, dropdownType: 'policies' }));
  };

  useEffect(() => {
    const newInterventionsDropdownOptions = [];
    if ((policiesList || [])?.length > 1) {
      newInterventionsDropdownOptions.push({
        label: 'Tutti gli interventi',
        value: 'public',
      });
    } else {
      onInputChange(policiesList?.[0].value, form?.intervention?.field);
    }
    setInterventionsDropdownOptions([
      ...newInterventionsDropdownOptions,
      ...(policiesList || []),
    ]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [policiesList]);

  useEffect(() => {
    setProgramDropdownOptions([
      { label: 'Tutti i programmi', value: 'public' },
      ...(programsList || []),
    ]);
  }, [programsList]);

  useEffect(() => {
    if (form?.program?.value) {
      onInputChange('', form?.intervention?.field);
      dispatch(
        setEntityFilters({
          filtroIdsProgrammi: [
            {
              value:
                form?.program?.value === 'public'
                  ? undefined
                  : form?.program?.value,
            },
          ],
        })
      );
      getInterventionsList();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form?.program?.value]);

  useEffect(() => {
    dispatch(GetEntityFilterValues({ entity, dropdownType: 'programmi' }));
    dispatch(GetCategoriesList({ type: 'document_categories' }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    onInputChange(files, 'attachment');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [files?.data]);

  useEffect(() => {
    if (!creation) {
      if (docDetail?.attachment_file_name) {
        setFiles({
          data: docDetail?.attachment_file_name?.toString(),
          name: docDetail.attachment_file_name?.toString(),
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [creation, docDetail, newFormValues?.intervention]);

  useEffect(() => {
    if (
      interventionsDropdownOptions?.length &&
      !newFormValues?.intervention &&
      docDetail?.intervention
    ) {
      onInputChange(docDetail.intervention, form?.intervention?.field);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    interventionsDropdownOptions,
    newFormValues?.intervention,
    docDetail?.intervention,
  ]);

  useEffect(() => {
    if (docDetail && !creation) {
      if (form) {
        const populatedForm: formFieldI[] = Object.entries(docDetail).map(
          ([key, value]) =>
            newFormField({
              ...form[key],
              value: value,
            })
        );

        updateForm(newForm(populatedForm));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [docDetail]);

  useEffect(() => {
    setIsFormValid(isValidForm);
    sendNewValues({
      ...getFormValues(),
      program: getFormValues().program?.toString(),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form]);

  const removeDocument = (e: any) => {
    setFiles(defaultDocument);
    e.preventDefault();
  };

  const addDocument = () => {
    if (inputRef.current !== null) {
      inputRef.current.click();
    }
  };

  const updateFile = () => {
    uploadFile('file', (file: any) => {
      setFiles(file);
    });
  };

  return (
    <Form
      id='form-load-document'
      className='mt-5 mb-0'
      formDisabled={formDisabled}
    >
      <Form.Row className={clsx(bootClass, !device.mediaIsDesktop && 'mb-5')}>
        <Input
          {...form?.title}
          required
          col='col-lg-12 col-12 mb-0'
          label='Titolo'
          maxLength={55}
          onInputChange={onInputChange}
          aria-describedby='input-help-description'
        />
        <small
          id='input-help-description'
          className={clsx(
            'font-italic',
            'form-text',
            'text-muted',
            'pl-2',
            'ml-1',
            device.mediaIsDesktop && 'mb-5'
          )}
        >
          massimo 55 caratteri
        </small>
      </Form.Row>
      <Form.Row className={bootClass}>
        <Select
          {...form?.program}
          wrapperClassName='col-12 col-lg-6'
          onInputChange={onInputChange}
          options={programDropdownOptions?.map((opt) => ({
            label: opt.label,
            value: opt.value as number,
          }))}
          isDisabled={formDisabled}
          placeholder='Seleziona'
          maxMenuHeight={200}
        />
        <Select
          {...form?.intervention}
          wrapperClassName='col-12 col-lg-6'
          onInputChange={onInputChange}
          options={interventionsDropdownOptions?.map((opt) => ({
            label: opt.label,
            value: opt.value as string,
          }))}
          isDisabled={
            !form?.program?.value ||
            interventionsDropdownOptions?.length <= 1 ||
            formDisabled
          }
          placeholder='Seleziona'
          maxMenuHeight={200}
        />
      </Form.Row>
      <Form.Row className={bootClass}>
        <Select
          {...form?.category}
          wrapperClassName='col-12 col-lg-6'
          onInputChange={onInputChange}
          options={categoriesList?.map((opt) => ({
            label: opt.name,
            value: opt.id,
          }))}
          isDisabled={formDisabled}
          placeholder='Seleziona'
          maxMenuHeight={200}
        />
      </Form.Row>
      <Form.Row className={bootClass}>
        <TextArea
          {...form?.description}
          rows={6}
          cols={100}
          maxLength={800}
          className='mb-1 mt-3'
          onInputChange={onInputChange}
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
              {files?.name}
            </p>
            {!files.data ? (
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
                />
                Seleziona file
              </Button>
            ) : (
              <Icon
                icon='it-delete'
                color='primary'
                size='sm'
                className='mr-4'
                onClick={removeDocument}
              />
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
          {...form?.external_link}
          onInputChange={onInputChange}
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
    field: 'title',
    id: 'title',
    required: true,
  }),
  newFormField({
    field: 'intervention',
    id: 'intervention',
    label: 'Intervento',
    type: 'select',
    required: true,
  }),
  newFormField({
    field: 'program',
    id: 'program',
    label: 'Programma',
    type: 'select',
    required: true,
  }),
  newFormField({
    field: 'category',
    id: 'category',
    label: 'Categoria',
    type: 'select',
    required: true,
  }),
  newFormField({
    field: 'description',
    id: 'description',
    label: 'Descrizione *',
    required: true,
    type: 'textarea',
  }),
  newFormField({
    field: 'attachment',
    id: 'attachment',
    type: 'file',
  }),
  newFormField({
    field: 'external_link',
    id: 'external_link',
    type: 'url',
  }),
]);
export default withFormHandler({ form }, FormLoadDocument);

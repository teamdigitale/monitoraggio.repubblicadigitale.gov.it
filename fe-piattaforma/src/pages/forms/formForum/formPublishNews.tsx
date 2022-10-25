import clsx from 'clsx';
import { Button, FormGroup, Icon, Toggle } from 'design-react-kit';
import _ from 'lodash';
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Form, Input, Select } from '../../../components';
import TextEditor from '../../../components/General/TextEditor/TextEditor';
import PreviewCard from '../../../components/PreviewCard/PreviewCard';
import withFormHandler, {
  withFormHandlerProps,
} from '../../../hoc/withFormHandler';
import {
  selectEntityFiltersOptions,
  setEntityFilters,
} from '../../../redux/features/administrativeArea/administrativeAreaSlice';
import { GetEntityFilterValues } from '../../../redux/features/administrativeArea/administrativeAreaThunk';
import { GetCategoriesList } from '../../../redux/features/forum/categories/categoriesThunk';
import {
  selectCategoriesList,
  selectNewsDetail,
} from '../../../redux/features/forum/forumSlice';
import { useAppSelector } from '../../../redux/hooks';
import { formFieldI, newForm, newFormField } from '../../../utils/formHelper';
import { uploadFile } from '../../../utils/common';

interface publishNewsI extends withFormHandlerProps {
  formDisabled?: boolean;
  newFormValues: { [key: string]: formFieldI['value'] };
  sendNewValues?: (param?: { [key: string]: formFieldI['value'] }) => void;
  setIsFormValid?: (param: boolean | undefined) => void;
  creation?: boolean;
  onPreviewClick: () => void;
}

const entity = 'progetto';

const defaultCover = {
  name: 'Carica immagine di copertina',
};
const defaultDocument = {
  name: 'Carica documenti, foto ecc.',
};

const FormPublishNews: React.FC<publishNewsI> = (props) => {
  const {
    creation,
    form,
    isValidForm,
    newFormValues,
    updateForm = () => ({}),
    onInputChange = () => ({}),
    sendNewValues = () => ({}),
    setIsFormValid = () => ({}),
    getFormValues = () => ({}),
    // clearForm = () => ({}),
    onPreviewClick,
  } = props;

  const dispatch = useDispatch();
  const inputRef = useRef<HTMLInputElement>(null);
  const inputRefImg = useRef<HTMLInputElement>(null);
  const [image, setImage] = useState<{ name?: string; data?: string | File }>(
    defaultCover
  );
  const [files, setFiles] = useState<{ name?: string; data?: string | File }>(
    defaultDocument
  );
  const [editorText, setEditorText] = useState('<p></p>');
  const [highlighted, setHighlighted] = useState(false);
  const [enableComments, setEnableComments] = useState(false);
  const formDisabled = !!props.formDisabled;
  const newsDetail: { [key: string]: string | boolean } | undefined =
    useAppSelector(selectNewsDetail);
  const programsList = useAppSelector(selectEntityFiltersOptions)['programmi'];
  const policiesList = useAppSelector(selectEntityFiltersOptions)['policies'];
  const categoriesList = useAppSelector(selectCategoriesList);
  const [programDropdownOptions, setProgramDropdownOptions] = useState(
    programsList || []
  );
  const [interventionsDropdownOptions, setInterventionsDropdownOptions] =
    useState(programsList || []);

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    onInputChange(image, 'cover');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [image?.data]);

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    onInputChange(files, 'attachment');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [files?.data]);

  useEffect(() => {
    if (!creation) {
      if (newsDetail?.cover_file_name) {
        setImage({
          data: newsDetail?.cover_file_name?.toString(),
          name: newsDetail.cover_file_name?.toString(),
        });
      }
      if (newsDetail?.attachment_file_name) {
        setFiles({
          data: newsDetail?.attachment_file_name?.toString(),
          name: newsDetail.attachment_file_name?.toString(),
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [creation, newsDetail, newFormValues?.intervention]);

  const getInterventionsList = () => {
    dispatch(GetEntityFilterValues({ entity, dropdownType: 'policies' }));
  };

  useEffect(() => {
    if (
      interventionsDropdownOptions?.length &&
      !newFormValues?.intervention &&
      newsDetail?.intervention
    ) {
      onInputChange(newsDetail.intervention, form?.intervention?.field);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    interventionsDropdownOptions,
    newFormValues?.intervention,
    newsDetail?.intervention,
  ]);

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
    if (newFormValues) {
      if (form) {
        const populatedForm: formFieldI[] = Object.entries(newFormValues).map(
          ([key, value]) =>
            newFormField({
              ...form[key],
              value: value || '',
            })
        );

        updateForm(newForm(populatedForm));
      }
      dispatch(GetEntityFilterValues({ entity, dropdownType: 'programmi' }));
      dispatch(GetCategoriesList({ type: 'board_categories' }));
      setEnableComments((newFormValues.enable_comments as boolean) || false);
      setHighlighted((newFormValues.highlighted as boolean) || false);
      setEditorText((newFormValues.description as string) || '');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (newsDetail && !creation && _.isEmpty(newFormValues)) {
      if (form) {
        const populatedForm: formFieldI[] = Object.entries(newsDetail).map(
          ([key, value]) =>
            newFormField({
              ...form[key],
              value: value,
            })
        );

        updateForm(newForm(populatedForm));
      }
      setEnableComments(!!newsDetail.enable_comments);
      setHighlighted(!!newsDetail.highlighted);
      setEditorText(newsDetail.description as string);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [newsDetail]);

  useEffect(() => {
    setIsFormValid(isValidForm && editorText.trim() !== '<p></p>');

    sendNewValues({
      ...getFormValues(),
      program: getFormValues().program?.toString(),
      description: editorText,
      highlighted: highlighted,
      enable_comments: enableComments,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form, highlighted, enableComments, editorText]);

  const removePicture = (e: any) => {
    setImage(defaultCover);
    e.preventDefault();
  };

  const addPicture = () => {
    if (inputRefImg.current !== null) {
      inputRefImg.current.click();
    }
  };

  const removeDocument = (e: any) => {
    setFiles(defaultDocument);
    e.preventDefault();
  };

  const addDocument = () => {
    if (inputRef.current !== null) {
      inputRef.current.click();
    }
  };

  const updateImage = async () => {
    uploadFile('Img-file', (file: any) => {
      setImage(file);
    });
  };

  const updateAttachment = () => {
    uploadFile('file', (file: any) => {
      setFiles(file);
    });
  };

  const bootClass = 'justify-content-between px-0 px-lg-5 mx-2';

  return (
    <Form
      id='form-load-document'
      className='mt-5 mb-0'
      formDisabled={formDisabled}
    >
      <Form.Row className={bootClass}>
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
            'mb-5',
            'pl-2',
            'ml-1'
          )}
        >
          massimo 55 caratteri
        </small>
      </Form.Row>
      <Form.Row className={clsx(bootClass)}>
        <Select
          {...form?.program}
          label='Programma'
          wrapperClassName='col-12 col-lg-6'
          onInputChange={onInputChange}
          options={programDropdownOptions?.map((opt) => ({
            label: opt.label,
            value: opt.value as number,
          }))}
          isDisabled={formDisabled}
          placeholder='Seleziona'
        />
        <Select
          {...form?.intervention}
          label='Intervento'
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
        />
      </Form.Row>
      <Form.Row className={bootClass}>
        <Select
          {...form?.category}
          label='Categoria'
          wrapperClassName='col-12 col-lg-6'
          onInputChange={onInputChange}
          options={categoriesList?.map((opt) => ({
            label: opt.name,
            value: opt.id,
          }))}
          isDisabled={formDisabled}
          placeholder='Seleziona'
        />
      </Form.Row>
      <Form.Row className={clsx(bootClass, 'align-items-center')}>
        <label
          htmlFor='text-editor'
          className='label-text-editor font-weight-semibold mb-0 pl-3'
        >
          Testo *
        </label>
        <small className='font-italic text-muted'>massimo 1500 caratteri</small>
      </Form.Row>
      <Form.Row className={bootClass}>
        <TextEditor
          text={editorText}
          onChange={(t: string) => setEditorText(t)}
        />
      </Form.Row>
      <Form.Row className={bootClass}>
        <div className='mt-5 d-flex align-items-center'>
          <strong className='mr-2'>AGGIUNGI IMMAGINE</strong>
          <Icon icon='it-info-circle' size='sm' color='primary' />
        </div>
      </Form.Row>
      <Form.Row className={bootClass}>
        <div className='w-100 border-bottom-box'>
          <input
            type='file'
            id='Img-file'
            accept='image/*, .png, .jpeg, .jpg'
            ref={inputRefImg}
            className='sr-only'
            capture
            onChange={updateImage}
          />

          <label
            htmlFor='Img-file'
            className='d-flex align-items-center justify-content-between'
          >
            <p className='mt-2' style={{ color: '#4c4c4d' }}>
              {image?.name}
            </p>
            {!image.data ? (
              <Button
                outline
                color='primary'
                className='py-2 px-0 btn-news-modal'
                onClick={addPicture}
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
                onClick={removePicture}
              /> //TODO add function to delete file
            )}
          </label>
        </div>
        <small className='font-italic form-text text-muted'>massimo 1 Mb</small>
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
            onChange={updateAttachment}
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
                className='py-2 px-0 btn-news-modal'
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
              /> //TODO add function to delete file
            )}
          </label>
        </div>
        <small className='font-italic form-text text-muted'>massimo 5 Mb</small>
      </Form.Row>
      <Form.Row className={bootClass}>
        <div className='d-flex flex-row w-75 align-items-center pt-5 pb-3'>
          <FormGroup check className='form-check-group'>
            <Toggle
              // defaultChecked={!!enableComments}
              checked={enableComments}
              onChange={() => setEnableComments((prev) => !prev)}
              label='Abilita commenti'
            />
          </FormGroup>
          <FormGroup check className='form-check-group'>
            <Toggle
              checked={highlighted}
              onChange={() => setHighlighted((prev) => !prev)}
              label='News in evidenza'
            />
          </FormGroup>
        </div>
      </Form.Row>
      <Form.Row className={bootClass}>
        <PreviewCard disabled={!isValidForm} onClick={onPreviewClick} />
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
    maximum: 55,
    minimum: 2,
  }),
  newFormField({
    field: 'intervention',
    id: 'intervention',
    type: 'select',
    required: true,
  }),
  newFormField({
    field: 'program',
    id: 'program',
    type: 'select',
    required: true,
  }),
  newFormField({
    field: 'category',
    id: 'category',
    type: 'select',
    required: true,
  }),
  /*newFormField({
   field: 'description',
   id: 'description',
   type: 'text',
   required: true,
 }),*/
  newFormField({
    field: 'attachment',
    id: 'attachment',
    type: 'file',
  }),
  newFormField({
    field: 'cover',
    id: 'cover',
    type: 'file',
  }),
]);
export default withFormHandler({ form }, FormPublishNews);

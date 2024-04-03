import clsx from 'clsx';
import {
  Button,
  Chip,
  ChipLabel,
  Icon,
  UncontrolledTooltip,
} from 'design-react-kit';
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Form, Input, Select } from '../../../components';
import TextArea from '../../../components/Form/textarea';
import withFormHandler, {
  withFormHandlerProps,
} from '../../../hoc/withFormHandler';
// import { selectDevice } from '../../../redux/features/app/appSlice';
import { GetCategoriesList } from '../../../redux/features/forum/categories/categoriesThunk';
import {
  selectCategoriesList,
  selectTagsList,
  selectTopicDetail,
} from '../../../redux/features/forum/forumSlice';
import { GetTagsList } from '../../../redux/features/forum/forumThunk';
import { useAppSelector } from '../../../redux/hooks';
import { formFieldI, newForm, newFormField } from '../../../utils/formHelper';
import { uploadFile } from '../../../utils/common';
import TagsSelect from '../../../components/General/TagsSelect/TagsSelect';
import { useInfiniteScrollCategories } from '../../../hooks/useInfiniteScrollCategories';

interface createTopicI extends withFormHandlerProps {
  formDisabled?: boolean;
  newFormValues: { [key: string]: formFieldI['value'] };
  sendNewValues?: (param?: { [key: string]: formFieldI['value'] }) => void;
  setIsFormValid?: (param: boolean | undefined) => void;
  creation?: boolean;
}

const defaultDocument = {
  name: 'Carica documenti, foto ecc.',
};

const FormCreateTopic: React.FC<createTopicI> = (props) => {
  const {
    // setFormValues = () => ({}),
    form,
    newFormValues,
    isValidForm,
    creation,
    updateForm = () => ({}),
    onInputChange = () => ({}),
    sendNewValues = () => ({}),
    setIsFormValid = () => ({}),
    getFormValues = () => ({}),
  } = props;

  const bootClass = 'justify-content-between px-0 px-lg-5 mx-2';
  const inputRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<{ name?: string; data?: string | File }>(
    defaultDocument
  );
  const tagsList = useAppSelector(selectTagsList);
  const [tags, setTags] = useState<string[]>([]);
  const formDisabled = !!props.formDisabled;
  const dispatch = useDispatch();
  const categoriesList = useAppSelector(selectCategoriesList);
  const topicDetail: { [key: string]: string | boolean } | undefined =
    useAppSelector(selectTopicDetail);
  const {handleScrollToBottom} = useInfiniteScrollCategories('community_categories')
  useEffect(() => {
    dispatch(GetCategoriesList({ type: 'community_categories' }));
    dispatch(GetTagsList());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignorex
    onInputChange(files, 'attachment');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [files?.data]);

  useEffect(() => {
    if (!creation) {
      if (topicDetail?.attachment_file_name) {
        setFiles({
          data: topicDetail?.attachment_file_name?.toString(),
          name: topicDetail.attachment_file_name?.toString(),
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [creation, topicDetail, newFormValues?.intervention]);

  useEffect(() => {
    if (topicDetail && !creation) {
      if (form) {
        const populatedForm: formFieldI[] = Object.entries(topicDetail).map(
          ([key, value]) =>
            newFormField({
              ...form[key],
              value: value,
            })
        );
        const tagsString = topicDetail.tags as string;
        if (tagsString) setTags(tagsString.split(';'));
        updateForm(newForm(populatedForm));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [topicDetail]);

  useEffect(() => {
    setIsFormValid(isValidForm);
    //console.log(getFormValues());

    sendNewValues({
      ...getFormValues(),
      tags: tags,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form, tags]);

  const removeDocument = (e: any) => {
    setFiles(defaultDocument);
    if (inputRef.current !== null) {
      inputRef.current.value = '';
    }
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

  const handleOnSubmit = (searchValues: string) => {
    const newTags = [...tags, searchValues];
    setTags(newTags);
  };

  const handleOnDelete = () => {
    const newTags = [...tags];
    newTags.pop();
    setTags(newTags);
  };

  return (
    <Form
      id='form-create-topic'
      className='mt-3 mb-2'
      formDisabled={formDisabled}
      customMargin='mb-3 pb-3 ml-3'
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
      <Form.Row className={bootClass}>
        <Select
          {...form?.category}
          wrapperClassName='col-12 col-lg-6'
          onInputChange={onInputChange}
          onMenuScrollToBottom={handleScrollToBottom}
          options={categoriesList?.map((opt) => ({
            label: opt.name,
            value: opt.id,
          }))}
          isDisabled={formDisabled}
          placeholder='Seleziona'
          maxMenuHeight={250}
        />
      </Form.Row>
      <Form.Row className={bootClass}>
        <TextArea
          {...form?.description}
          rows={6}
          cols={100}
          maximum={1500}
          onInputChange={onInputChange}
          className='mb-1 mt-3'
          placeholder=' '
        />
      </Form.Row>
      <Form.Row className={bootClass}>
        <small className='font-italic form-text text-muted'>
          massimo 1500 caratteri
        </small>
      </Form.Row>
      <Form.Row className={bootClass}>
        <div className='mt-5 d-flex align-items-center'>
          <strong className='mr-2'>AGGIUNGI TAG</strong>
          <div id='tooltip-aggiungi-tag'>
            <Icon
              icon='it-info-circle'
              size='sm'
              color='primary'
              aria-label='Aggiungi tag'
              aria-hidden
            />
          </div>
          <UncontrolledTooltip placement='bottom' target='tooltip-aggiungi-tag'>
            Puoi cercare e inserire tag già esistenti utilizzando il
            completamento automatico oppure creare un nuovo tag digitando la
            nuova parola chiave nel campo di testo e dando Invio
          </UncontrolledTooltip>
        </div>
      </Form.Row>
      <Form.Row className={bootClass}>
        <TagsSelect
          id='topic-tags'
          selectedTags={tags}
          tags={tagsList.map((opt) => ({
            label: opt.name,
            value: opt.name,
          }))}
          addTag={handleOnSubmit}
        />
        {/* <Select
          onChange={(e: any) => console.log(e.target.value)}
          options={tagsList
            .filter((t) => !tags.includes(t.name))
            .map((opt) => ({
              label: opt.name,
              value: opt.name,
            }))}
          wrapperClassName={clsx('col-12', 'px-0', device.mediaIsDesktop && 'mb-0', !device.mediaIsDesktop && 'mb-4')}
          onInputChange={(value) => handleOnSubmit(value as string)}
          placeholder='Digita la parola chiave e utilizza il completamento automatico per evitare errori di digitazione.'
          isSearchable
        /> */}
      </Form.Row>
      {tags.length ? (
        <Form.Row className={bootClass}>
          <div>
            {tags.map((item, id) => (
              <Chip key={id} className='mr-2 rounded-pill forum-chip-tag'>
                <ChipLabel className='mx-1 my-1'>{item}</ChipLabel>
                <Button
                  close
                  onClick={handleOnDelete}
                  style={{ minWidth: '8px' }}
                >
                  <Icon
                    icon='it-close'
                    aria-label='Elimina tag'
                    className='chip-closer'
                  />
                </Button>
              </Chip>
            ))}
          </div>
        </Form.Row>
      ) : (
        <span />
      )}
      <Form.Row className={bootClass}>
        <div className='mt-5 d-flex align-items-center'>
          <strong className='mr-2'>ALLEGA FILE</strong>
          <div id='tooltip-allega-file'>
            <Icon
              icon='it-info-circle'
              size='sm'
              color='primary'
              aria-label='Informazioni'
              aria-hidden
            />
          </div>
          <UncontrolledTooltip placement='bottom' target='tooltip-allega-file'>
            - Formati supportati: .txt, .rtf, .odt, .zip, .exe, .docx, .doc,
            .ppt, .pptx, .pdf, .jpg, .png, .gif, .xls, .xlsx, .csv, .mpg, .wmv,
            .pdf
            <br />- Peso: max 10 MB
            <br />- Nome: non deve contenere altri punti
            &quot;&nbsp;.&nbsp;&quot; oltre a quello che precede
            l&apos;estensione
          </UncontrolledTooltip>
        </div>
      </Form.Row>
      <Form.Row className={clsx(bootClass, 'mb-4')}>
        <div className='w-100 border-bottom-box'>
          <input
            type='file'
            id='file'
            accept='.txt, .rtf, .odt, .zip, .exe, .docx, .doc, .ppt, .pptx, .pdf, .jpg, .png, .gif, .xls, .xlsx, .csv, .mpg, .wmv'
            ref={inputRef}
            className='sr-only'
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
                className='py-2 px-0 btn-topic-modal'
                onClick={addDocument}
              >
                <Icon
                  icon='it-plus'
                  size='sm'
                  color='primary'
                  className='pb-1'
                  aria-label='Seleziona file'
                  aria-hidden
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
                aria-label='Elimina'
              />
            )}
          </label>
        </div>
        {/*<small className='font-italic form-text text-muted'>massimo 5 Mb</small>*/}
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
    field: 'category',
    id: 'category',
    label: 'Categoria',
    type: 'select',
    required: true,
  }),
  newFormField({
    field: 'description',
    id: 'description',
    label: 'Testo',
    required: true,
    type: 'textarea',
  }),
  newFormField({
    field: 'attachment',
    id: 'attachment',
    type: 'file',
  }),
  // newFormField({
  //   field: 'aggiungiTag',
  //   id: 'aggiungiTag',
  //   type: 'search',
  // }),
]);
export default withFormHandler({ form }, FormCreateTopic);

import clsx from 'clsx';
import { Button, Chip, ChipLabel, Icon } from 'design-react-kit';
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

interface createTopicI extends withFormHandlerProps {
  formDisabled?: boolean;
  sendNewValues?: (param?: { [key: string]: formFieldI['value'] }) => void;
  setIsFormValid?: (param: boolean | undefined) => void;
  creation?: boolean;
}

const FormCreateTopic: React.FC<createTopicI> = (props) => {
  const {
    // setFormValues = () => ({}),
    form,
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
  const [files, setFiles] = useState<{ name?: string; data?: File }>({
    name: 'Carica documenti, foto ecc.',
  });
  const [iconVisible, setIconVisible] = useState<boolean>(false);
  // const device = useAppSelector(selectDevice);
  const tagsList = useAppSelector(selectTagsList);
  const [tags, setTags] = useState<string[]>([]);
  const formDisabled = !!props.formDisabled;
  const dispatch = useDispatch();
  const categoriesList = useAppSelector(selectCategoriesList);
  const topicDetail: { [key: string]: string | boolean } | undefined =
    useAppSelector(selectTopicDetail);

  useEffect(() => {
    dispatch(GetCategoriesList({ type: 'community_categories' }));
    dispatch(GetTagsList());
  }, []);

  useEffect(() => {
    if (files?.data) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignorex
      onInputChange(files, 'attachment');
    }
  }, [files?.data]);

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
        setTags(tagsString.split(';'));
        updateForm(newForm(populatedForm));
      }
    }
  }, [topicDetail]);

  useEffect(() => {
    setIsFormValid(isValidForm);
    //console.log(getFormValues());

    sendNewValues({
      ...getFormValues(),
      tags: tags,
    });
  }, [form, tags]);

  const addDocument = () => {
    if (inputRef.current !== null) {
      inputRef.current.click();
    }
  };

  const updateFile = () => {
    uploadFile('file', (file: any) => {
      setFiles(file);
    });
    setIconVisible(!iconVisible);
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
          className={clsx('font-italic', 'form-text', 'text-muted', 'mb-5', 'pl-2', 'ml-1')}
        >
          massimo 55 caratteri
        </small>
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
        />
      </Form.Row>
      <Form.Row className={bootClass}>
        <TextArea
          {...form?.description}
          rows={6}
          cols={100}
          maxLength={1500}
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
          <Icon icon='it-info-circle' size='sm' color='primary' />
        </div>
      </Form.Row>
      <Form.Row className={bootClass}>
        <TagsSelect
          selectedTags={tags}
          tags={tagsList.map(opt => ({
            label: opt.name,
            value: opt.name
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
      <Form.Row className={bootClass}>
        {tags.length ? (
          <div>
            {tags.map((item, id) => (
              <Chip key={id} className='mr-2 rounded-pill'>
                <ChipLabel className='mx-1 my-1'>{item}</ChipLabel>
                <Button
                  close
                  onClick={handleOnDelete}
                  style={{ minWidth: '8px' }}
                >
                  <Icon icon='it-close' aria-label='Chiudi chip' />
                </Button>
              </Chip>
            ))}
          </div>
        ) : (
          <span></span>
        )}
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
            {!iconVisible ? (
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

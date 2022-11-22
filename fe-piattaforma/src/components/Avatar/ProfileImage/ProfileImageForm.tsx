import { Button, Icon } from 'design-react-kit';
import React, { /* useEffect, */ useRef } from 'react';
import { withFormHandlerProps } from '../../../hoc/withFormHandler';
import { formFieldI } from '../../../utils/formHelper';
import Form from '../../Form/form';

interface ProfilePictureI extends withFormHandlerProps {
  formDisabled?: boolean;
  newFormValues?: { [key: string]: formFieldI['value'] };
  sendNewValues?: (param?: { [key: string]: formFieldI['value'] }) => void;
  setIsFormValid?: (param: boolean | undefined) => void;
  creation?: boolean;
  profilePic?: string | File | undefined;
  image?: {
    name?: string | undefined;
    data?: string | File | undefined;
  };
  setImage?: (image: {
    name?: string | undefined;
    data?: string | File | undefined;
  }) => void;
  setSelectedImage?: (value: File | string) => void;
}

const ProfileImageForm: React.FC<ProfilePictureI> = (props) => {
  const {
    setSelectedImage = () => ({}),
    setImage = () => ({}),
    image = { name: 'Seleziona immagine profilo', data: '' },
    setIsFormValid = () => ({}),
  } = props;
  const bootClass = 'justify-content-between px-0 px-lg-5 mx-2';
  const inputRef = useRef<HTMLInputElement>(null);

  const removeImage = (e: any) => {
    setImage({ name: 'Carica foto profilo', data: '' });
    setSelectedImage('');
    setIsFormValid(true);
    if (inputRef.current !== null) {
      inputRef.current.value = "";
    }
    e.preventDefault();
  };

  const addImage = () => {
    if (inputRef.current !== null) {
      inputRef.current.click();
    }
  };

  const updateImage = async () => {
    const input: HTMLInputElement = document.getElementById(
      'profile_pic'
    ) as HTMLInputElement;

    if (input.files?.length) {
      const selectedImage = input.files[0];
      const reader = new FileReader();
      reader.readAsDataURL(selectedImage);
      reader.onloadend = () => {
        setImage({ name: selectedImage.name, data: reader.result as string });
        setSelectedImage(selectedImage);
        setIsFormValid(true);
      };
    }
  };

  return (
    <Form id='profile-picture-form' className='w-100 py-5'>
      <Form.Row className={bootClass}>
        <div className='w-100 border-bottom-box'>
          <input
            type='file'
            id='profile_pic'
            accept='.png, .jpeg, .jpg'
            ref={inputRef}
            className='sr-only'
            capture
            onChange={updateImage}
          />
          <label
            htmlFor='file'
            className='d-flex align-items-center justify-content-between'
          >
            <p className='mt-2' style={{ color: '#4c4c4d' }}>
              {image?.name}
            </p>

            {!image?.data ? (
              <Button
                outline
                color='primary'
                className='py-2 px-0 btn-document-modal'
                onClick={addImage}
              >
                <Icon
                  icon='it-plus'
                  size='sm'
                  color='primary'
                  className='pb-1'
                  aria-label='seleziona'
                  aria-hidden
                />
                Seleziona immagine
              </Button>
            ) : (
              <Icon
                icon='it-delete'
                color='primary'
                size='sm'
                onClick={removeImage}
                aria-label='Elimina'
              />
            )}
          </label>
        </div>
        <small className='font-italic form-text text-muted'>
          massimo 10 Mb
        </small>
      </Form.Row>
    </Form>
  );
};

export default ProfileImageForm;

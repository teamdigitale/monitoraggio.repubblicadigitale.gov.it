import clsx from 'clsx';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { AvatarSizes } from '../../../../../components/Avatar/AvatarInitials/avatarInitials';
import ProfileImageForm from '../../../../../components/Avatar/ProfileImage/ProfileImageForm';
import UserAvatar from '../../../../../components/Avatar/UserAvatar/UserAvatar';
import GenericModal from '../../../../../components/Modals/GenericModal/genericModal';
import { withFormHandlerProps } from '../../../../../hoc/withFormHandler';
import { closeModal } from '../../../../../redux/features/modal/modalSlice';
import { selectImmagineProfilo } from '../../../../../redux/features/user/userSlice';
import {
  RemoveUserPic,
  UploadUserPic,
} from '../../../../../redux/features/user/userThunk';
import { useAppSelector } from '../../../../../redux/hooks';

interface ManageProfilePicFormI {
  formDisabled?: boolean;
  creation?: boolean;
  isPreview?: boolean;
}

interface ManageProfilePic
  extends withFormHandlerProps,
    ManageProfilePicFormI {}

const id = 'update-profile-pic-modal';

const ManageProfilePic: React.FC<ManageProfilePic> = (props) => {
  const {
    clearForm = () => ({}),
    formDisabled,
    creation = false,
    isPreview = false,
  } = props;
  const dispatch = useDispatch();
  const profilePic = useAppSelector(selectImmagineProfilo);
  const defaultProfilePic = { name: 'Immagine profilo', data: profilePic };
  const [image, setImage] = useState<{
    name?: string | undefined;
    data?: string | File | undefined;
  }>(defaultProfilePic);
  const [selectedImage, setSelectedImage] = useState<File | string>();
  const [isFormValid, setIsFormValid] = useState<boolean>(false);
  const resetModal = (toClose = true) => {
    clearForm();
    setImage(defaultProfilePic);
    setIsFormValid(false);
    if (toClose) dispatch(closeModal());
  };

  const handleSavePic = async () => {
    if (selectedImage) {
      const res = await dispatch(UploadUserPic(selectedImage));
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      if (res) {
        // TODO reload is temporary
        window.location.reload();
        setImage({ name: 'Immagine profilo', data: selectedImage });
      }
    } else if (!selectedImage || '') {
      const res = await dispatch(RemoveUserPic());
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      if (res) {
        window.location.reload();
        setImage({ name: 'Seleziona immagine profilo', data: '' });
      }
    }
  };

  return (
    <GenericModal
      id={id}
      primaryCTA={{
        disabled: !isFormValid,
        label: creation ? 'Conferma' : 'Salva',
        onClick: handleSavePic,
      }}
      secondaryCTA={{
        label: 'Annulla',
        onClick: resetModal,
      }}
      centerButtons
    >
      <div className='d-flex flex-column align-items-center pt-2'>
        <p
          className={clsx(
            'text-start',
            'w-100',
            'px-lg-5',
            'px-3',
            'px-md-4',
            'mb-4'
          )}
        >
          Puoi caricare un file .jpg, .jpeg o .png di massimo 10 MB. Verifica
          che il nome del file non contenga altri punti &quot;.&quot; oltre a
          quello che precede l’estensione
        </p>
        <UserAvatar
          avatarImage={image.data !== '' ? image.data : ''}
          size={AvatarSizes.Preview}
          isPreview={isPreview}
        />
        <ProfileImageForm
          creation={creation}
          formDisabled={!!formDisabled}
          setIsFormValid={(value: boolean | undefined) =>
            setIsFormValid(!!value)
          }
          image={image}
          setImage={(image) => setImage(image)}
          setSelectedImage={(value: File | string) => setSelectedImage(value)}
        />
      </div>
    </GenericModal>
  );
};

export default ManageProfilePic;

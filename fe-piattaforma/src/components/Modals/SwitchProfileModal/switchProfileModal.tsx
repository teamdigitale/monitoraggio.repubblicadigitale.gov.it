import clsx from 'clsx';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import isEqual from 'lodash.isequal';
import { selectDevice } from '../../../redux/features/app/appSlice';
import { useAppSelector } from '../../../redux/hooks';
import { focusId } from '../../../utils/common';
// import { focusId } from '../../../utils/common';
import CardProfile from '../../CardProfile/cardProfile';
import GenericModal from '../GenericModal/genericModal';
import './switchProfileModal.scss';
import { selectUser } from '../../../redux/features/user/userSlice';
import { SelectUserRole } from '../../../redux/features/user/userThunk';
import {
  closeModal,
  selectModalPayload,
} from '../../../redux/features/modal/modalSlice';
import { getSessionValues } from '../../../utils/sessionHelper';
import { useNavigate } from 'react-router-dom';

const id = 'switchProfileModal';

/*interface ProfileI {
  name: string;
  programName: string;
}*/

interface SwitchProfileModalI {
  //profiles?: ProfileI[];
  isRoleManaging?: boolean;
  isOnboarding?: boolean;
  profilePicture?: string;
}

const SwitchProfileModal: React.FC<SwitchProfileModalI> = ({
  isOnboarding = false,
  profilePicture = '',
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useAppSelector(selectUser) || {};
  const modal = useAppSelector(selectModalPayload);
  const { profiliUtente: profiles } = user;
  const [profileSelected, setProfileSelected] = useState(
    JSON.parse(getSessionValues('profile'))
  );
  const [elementToFocus, setElementToFocus] = useState('utente-0');

  const resetModal = () => {
    setProfileSelected(JSON.parse(getSessionValues('profile')));
    dispatch(closeModal());
  };

  const handleSwitchProfile = async () => {
    const res = await dispatch(SelectUserRole(profileSelected, true));
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    if (res) {
      if (modal?.onSubmit) {
        modal.onSubmit();
      } else {
        dispatch(closeModal());
        navigate('/');
      }
    }
  };

  const { t } = useTranslation();

  const device = useAppSelector(selectDevice);

  useEffect(() => {
    focusId(elementToFocus, false);
  }, [elementToFocus]);

  const manageKeyEvent = (
    e: React.KeyboardEvent<HTMLLIElement>,
    name: string,
    index: number
  ) => {
    switch (e.key) {
      case ' ': {
        setProfileSelected(name);
        break;
      }
      case 'ArrowDown': {
        e.preventDefault();
        setElementToFocus(`utente-${index + 1}`);
        break;
      }
      case 'ArrowUp': {
        e.preventDefault();
        setElementToFocus(`utente-${index - 1}`);
        break;
      }
      default:
        break;
    }
  };

  return (
    <GenericModal
      id={id}
      primaryCTA={{
        label: 'Conferma',
        onClick: handleSwitchProfile,
        disabled: !Object.keys(profileSelected)?.length,
      }}
      secondaryCTA={
        isOnboarding
          ? undefined
          : {
              label: 'Annulla',
              onClick: resetModal,
            }
      }
      title='Scegli il ruolo'
      noSpaceAfterTitle
      centerButtons
      isRoleManaging
      closableKey={isOnboarding ? 'unclosable' : undefined}
    >
      <div
        className={clsx(
          'd-flex',
          'flex-column',
          'align-items-center',
          'justify-content-around'
        )}
      >
        <p className={clsx('text-center', 'mb-5', 'px-3')}>
          {t('select_profile_to_log_with')}
        </p>
        <ul
          id='listProfileSwitch'
          role='listbox'
          aria-label='lista-seleziona-profilo'
          className={clsx(
            device.mediaIsPhone
              ? 'switch-profile-modal__list w-75'
              : 'switch-profile-modal__list'
          )}
          tabIndex={-1}
        >
          {profiles?.map((profile: any, index: number) => (
            <li
              key={index}
              role='option'
              aria-selected={profile.name === profileSelected}
              onClick={() => setProfileSelected(profile)}
              onKeyDown={(event) => manageKeyEvent(event, profile.name, index)}
              tabIndex={profile.name === profileSelected ? 0 : -1}
              id={`utente-${index}`}
              className='switch-profile-modal__pointer'
            >
              <CardProfile
                profile={profile}
                activeProfile={isEqual(profile, profileSelected)}
                className='mb-2'
                user={user}
                profilePicture={profilePicture}
              />
            </li>
          ))}
        </ul>
      </div>
    </GenericModal>
  );
};

export default SwitchProfileModal;

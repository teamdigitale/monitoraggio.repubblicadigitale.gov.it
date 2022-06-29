import clsx from 'clsx';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { selectDevice } from '../../../redux/features/app/appSlice';
import { useAppSelector } from '../../../redux/hooks';
import { focusId } from '../../../utils/common';
// import { focusId } from '../../../utils/common';
import CardProfile from '../../CardProfile/cardProfile';
import GenericModal from '../GenericModal/genericModal';
import './switchProfileModal.scss';

const id = 'switchProfileModal';

interface ProfileI {
  name: string;
  programName: string;
}

interface SwitchProfileModalI {
  profiles?: ProfileI[];
  currentProfile: string;
}

const SwitchProfileModal: React.FC<SwitchProfileModalI> = ({
  profiles,
  currentProfile,
}) => {
  const [profileSelected, setProfileSelected] = useState(currentProfile);
  const [elementToFocus, setElementToFocus] = useState('utente-0');
  const handleSwitchProfile = () => {
    console.log('switch profile');
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
      }}
      secondaryCTA={{
        label: 'Annulla',
        //onClick: () => clearForm?.(),
      }}
      title={'Scegli il profilo'}
      noSpaceAfterTitle
      centerButtons
    >
      <div
        className={clsx(
          'd-flex',
          'flex-column',
          'align-items-center',
          'justify-content-around'
        )}
      >
        <p className='px-5 text-align-center mb-5'>
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
          {profiles?.map((profile, index) => (
            <li
              key={index}
              role='option'
              aria-selected={profile.name === profileSelected ? true : false}
              onClick={() => setProfileSelected(profile.name)}
              onKeyDown={(event) => manageKeyEvent(event, profile.name, index)}
              tabIndex={profile.name === profileSelected ? 0 : -1}
              id={`utente-${index}`}
            >
              <CardProfile
                name={profile.name}
                program={profile.programName}
                activeProfile={profile.name === profileSelected}
                className='mb-2'
                user={{ name: 'Mario', surname: 'Rossi', role: '' }}
              />
            </li>
          ))}
        </ul>
      </div>
    </GenericModal>
  );
};

export default SwitchProfileModal;

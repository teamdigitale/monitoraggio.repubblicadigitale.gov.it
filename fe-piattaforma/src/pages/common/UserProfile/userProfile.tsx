import React, { useEffect, useState } from 'react';
import DetailLayout from '../../../components/DetailLayout/detailLayout';
/* import { selectUsers } from '../../../redux/features/administrativeArea/administrativeAreaSlice';
import { useAppSelector } from '../../../redux/hooks'; */
import FormOnboarding from '../../facilitator/Onboarding/formOnboarding';
import { ButtonInButtonsBar } from '../../../components/ButtonsBar/buttonsBar';
import { useDispatch } from 'react-redux';
import { openModal } from '../../../redux/features/modal/modalSlice';
import { formTypes } from '../../administrator/AdministrativeArea/Entities/utils';
import { updateBreadcrumb } from '../../../redux/features/app/appSlice';
import { useAppSelector } from '../../../redux/hooks';
import ManageProfile from '../../administrator/AdministrativeArea/Entities/modals/manageProfile';
import { selectUser } from '../../../redux/features/user/userSlice';

const UserProfile = () => {
  /* const userInfo = useAppSelector(selectUsers)?.detail?.info; */
  const [currentForm, setCurrentForm] = useState<React.ReactElement>();
  const dispatch = useDispatch();
  const user = useAppSelector(selectUser);

  useEffect(() => {
    dispatch(
      updateBreadcrumb([
        {
          label: 'Area Personale',
          url: '/area-personale',
          link: false,
        },
      ])
    );
  }, []);

  useEffect(() => {
    setCurrentForm(<FormOnboarding formDisabled />);
  }, []);

  const correctButtons: ButtonInButtonsBar[] = [
    {
      size: 'xs',
      text: 'Modifica',
      color: 'primary',
      onClick: () =>
        dispatch(
          openModal({
            id: formTypes.PROFILE,
            payload: { title: 'Aggiorna Profilo' },
          })
        ),
    },
  ];

  return (
    <div className='container'>
      <DetailLayout
        titleInfo={{
          title: `${user?.nome}${user?.cognome}`,
          status: 'ATTIVO',
          upperTitle: { icon: 'it-user', text: 'UTENTE' },
          iconAvatar: true,
          name: user?.nome,
          surname: user?.cognome,
          headingRole: false,
        }}
        goBackPath='/'
        buttonsPosition='BOTTOM'
        formButtons={correctButtons}
      >
        {currentForm}
      </DetailLayout>
      <ManageProfile />
    </div>
  );
};

export default UserProfile;

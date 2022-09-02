import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import clsx from 'clsx';
import DetailLayout from '../../../components/DetailLayout/detailLayout';
import FormOnboarding from '../../facilitator/Onboarding/formOnboarding';
import { ButtonInButtonsBar } from '../../../components/ButtonsBar/buttonsBar';
import { openModal } from '../../../redux/features/modal/modalSlice';
import {
  formTypes,
  userRoles,
} from '../../administrator/AdministrativeArea/Entities/utils';
import { updateBreadcrumb } from '../../../redux/features/app/appSlice';
import { useAppSelector } from '../../../redux/hooks';
import ManageProfile from '../../administrator/AdministrativeArea/Entities/modals/manageProfile';
import { selectUser } from '../../../redux/features/user/userSlice';
import useGuard from '../../../hooks/guard';
import { CRUDActionTypes } from '../../../utils/common';
import { CardStatusAction } from '../../../components';
import { getSessionValues } from '../../../utils/sessionHelper';

interface UserProfileI {
  isUserProfile?: boolean;
  activeRole?: boolean;
}

const UserProfile: React.FC<UserProfileI> = ({
  isUserProfile = true /* activeRole= true */,
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { hasUserPermission } = useGuard();
  const user = useAppSelector(selectUser);
  const userRole = JSON.parse(getSessionValues('profile'));

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const correctButtons: ButtonInButtonsBar[] = hasUserPermission([
    'upd.card.utenti',
  ])
    ? [
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
      ]
    : [];

  return (
    <div className='container'>
      <DetailLayout
        titleInfo={{
          title: `${user?.nome} ${user?.cognome}`,
          status: 'ATTIVO',
          upperTitle: { icon: 'it-user', text: 'UTENTE' },
          iconAvatar: true,
          name: user?.nome,
          surname: user?.cognome,
          headingRole: false,
        }}
        isUserProfile={isUserProfile}
        goBackPath='/'
        buttonsPosition='BOTTOM'
        formButtons={correctButtons}
      >
        <FormOnboarding formDisabled />
      </DetailLayout>
      <div className='my-5'>
        <div className='w-100'>
          <h5 className={clsx('primary-color', 'mb-4')}>Ruoli</h5>
        </div>
        {user?.profiliUtente?.map((role: any) => {
          let roleActions = {};
          if (role?.idProgramma) {
            roleActions = {
              [CRUDActionTypes.VIEW]: () =>
                navigate(
                  `/area-amministrativa/programmi/${role.idProgramma}/info`
                ),
            };
          }
          /*else {
            roleActions = hasUserPermission(['add.del.ruolo.utente'])
              ? {
                  [CRUDActionTypes.DELETE]: () => {
                    dispatch(
                      openModal({
                        id: 'delete-entity',
                        payload: {
                          entity: 'role',
                          text: 'Confermi di volere eliminare questo ruolo?',
                          role: role.codiceRuolo || role.descrizioneRuolo,
                        },
                      })
                    );
                  },
                }
              : {};
          }*/
          return (
            <CardStatusAction
              key={`${role.idProgramma}${role.idProgetto}${role.codiceRuolo}`}
              id={`${role.idProgramma}${role.idProgetto}${role.codiceRuolo}`}
              //status={role.}
              title={
                role.nomeProgramma ||
                role.nomeEnte ||
                role.descrizioneRuoloCompleta ||
                role.descrizioneRuolo
              }
              fullInfo={
                role.codiceRuolo !== userRoles.DTD &&
                role.codiceRuolo !== userRoles.DSCU
                  ? { ruoli: role.descrizioneRuolo }
                  : undefined
              }
              onActionClick={roleActions}
              activeRole={
                role.codiceRuolo === userRole.codiceRuolo &&
                role.idProgramma === userRole.idProgramma &&
                role.idProgetto === userRole.idProgetto
              }
            />
          );
        })}
      </div>
      <ManageProfile />
    </div>
  );
};

export default UserProfile;

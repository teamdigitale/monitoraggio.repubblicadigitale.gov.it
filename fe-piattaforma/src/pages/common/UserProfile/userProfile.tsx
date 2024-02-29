import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import clsx from 'clsx';
import DetailLayout from '../../../components/DetailLayout/detailLayout';
import FormOnboarding from '../../facilitator/Onboarding/formRegistrazione';
import { ButtonInButtonsBar } from '../../../components/ButtonsBar/buttonsBar';
import { openModal } from '../../../redux/features/modal/modalSlice';
import {
  formTypes,
  userRoles,
} from '../../administrator/AdministrativeArea/Entities/utils';
import { updateCustomBreadcrumb } from '../../../redux/features/app/appSlice';
import { useAppSelector } from '../../../redux/hooks';
import ManageProfile from '../../administrator/AdministrativeArea/Entities/modals/manageProfile';
import { selectUser } from '../../../redux/features/user/userSlice';
import useGuard from '../../../hooks/guard';
import { CRUDActionTypes } from '../../../utils/common';
import { CardStatusAction } from '../../../components';
import { getSessionValues } from '../../../utils/sessionHelper';
import { GetUserDetails } from '../../../redux/features/administrativeArea/user/userThunk';
import { selectUsers } from '../../../redux/features/administrativeArea/administrativeAreaSlice';

interface RoleI {
  id: string;
  idEnte?: string;
  codiceRuolo: string;
  nome: string;
  stato: string;
  statoP: string;
  ruolo: string;
  nomeBreveEnte: string;
  nomeEnte: string;
  associatoAUtente: boolean;
}

const UserProfile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { hasUserPermission } = useGuard();
  const user = useAppSelector(selectUser);
  const userRoleList =
    useAppSelector(selectUsers)?.detail?.dettaglioRuolo || [];
  const userRole = JSON.parse(getSessionValues('profile'));

  useEffect(() => {
    dispatch(
      updateCustomBreadcrumb([
        {
          label: 'Il mio profilo',
          url: '/area-personale',
          link: false,
        },
      ])
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (user?.id) dispatch(GetUserDetails(user?.id));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

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

  const isActiveRole = (role: RoleI) => {
    if (role.codiceRuolo === userRole.codiceRuolo) {
      if (role.idEnte) {
        return role.idEnte.toString() === userRole.idEnte?.toString();
      } else {
        return true;
      }
    }
    return false;
  };

  return (
    <div className='container mt-5'>
      <DetailLayout
        titleInfo={{
          title: `${user?.cognome} ${user?.nome} `,
          status: 'ATTIVO',
          upperTitle: { icon: 'it-user', text: 'UTENTE' },
          iconAvatar: true,
          name: user?.nome,
          surname: user?.cognome,
          headingRole: false,
        }}
        showGoBack={false}
        isUserProfile={user?.id}
        buttonsPosition='BOTTOM'
        formButtons={correctButtons}
        profilePicture={user?.immagineProfilo}
      >
        <FormOnboarding isProfile formDisabled />
      </DetailLayout>
      {userRoleList?.length ? (
        <div className='my-5 container'>
          <div className='w-100'>
            <h1 className={clsx('primary-color', 'mb-4', 'h4', 'ml-3')}>
              Ruoli
            </h1>
          </div>
          {userRoleList.map((role: RoleI) => {
            let roleActions = {};
            if (role.id) {
              roleActions = {
                [CRUDActionTypes.VIEW]: role.associatoAUtente
                  ? () =>
                      navigate(
                        `/area-amministrativa/${
                          role?.codiceRuolo === userRoles.VOL ||
                          role?.codiceRuolo === userRoles.FAC ||
                          role?.codiceRuolo === userRoles.REGP ||
                          role?.codiceRuolo === userRoles.DEGP ||
                          role?.codiceRuolo === userRoles.REPP ||
                          role?.codiceRuolo === userRoles.DEPP
                            ? 'progetti'
                            : 'programmi'
                        }/${role?.id}`,
                        {
                          replace: true,
                        }
                      )
                  : undefined,
              };
            }
            return (
              <CardStatusAction
                key={`${role.id}${role.codiceRuolo}`}
                id={`${role.id}${role.codiceRuolo}`}
                status={role.statoP}
                title={
                  role.codiceRuolo !== userRoles.REG &&
                  role.codiceRuolo !== userRoles.DEG &&
                  role.codiceRuolo !== userRoles.REGP &&
                  role.codiceRuolo !== userRoles.DEGP &&
                  role.codiceRuolo !== userRoles.VOL &&
                  role.codiceRuolo !== userRoles.FAC &&
                  role.codiceRuolo !== userRoles.REPP &&
                  role.codiceRuolo !== userRoles.DEPP
                    ? role.nome
                    : undefined
                }
                fullInfo={
                  role.codiceRuolo !== userRoles.DTD &&
                  role.codiceRuolo !== userRoles.DSCU
                    ? {
                        programma:
                          role.codiceRuolo === userRoles.REG ||
                          role.codiceRuolo === userRoles.DEG
                            ? role.nome
                            : undefined,
                        progetto:
                          role.codiceRuolo === userRoles.REGP ||
                          role.codiceRuolo === userRoles.DEGP ||
                          role.codiceRuolo === userRoles.VOL ||
                          role.codiceRuolo === userRoles.FAC ||
                          role.codiceRuolo === userRoles.REPP ||
                          role.codiceRuolo === userRoles.DEPP
                            ? role.nome
                            : undefined,
                        ruoli: role.ruolo,
                        ente: role.nomeBreveEnte || role.nomeEnte,
                      }
                    : undefined
                }
                onActionClick={roleActions}
                activeRole={isActiveRole(role)}
              />
            );
          })}
        </div>
      ) : null}
      <ManageProfile />
    </div>
  );
};

export default UserProfile;

/*
const activeRole={
  role.codiceRuolo === userRole.codiceRuolo && !!role.idEnte
    ? role.idEnte?.toString() === userRole.idEnte?.toString() &&
    (role.id?.toString() ===
      userRole.idProgramma?.toString() ||
      role.id?.toString() === userRole.idProgetto?.toString())
    : (role.codiceRuolo === userRole.codiceRuolo &&
      role.id?.toString() ===
      userRole.idProgramma?.toString()) ||
    role.id?.toString() === userRole.idProgetto?.toString()
};
*/

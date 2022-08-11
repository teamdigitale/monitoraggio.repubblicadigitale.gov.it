import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../../../redux/hooks';
import {
  selectLogged,
  selectProfile,
  selectUser,
} from '../../../redux/features/user/userSlice';
import { Loader } from '../../../components';
import { userRoles } from '../../administrator/AdministrativeArea/Entities/utils';

const AuthRedirect = () => {
  const isLogged = useAppSelector(selectLogged);
  const user = useAppSelector(selectUser);
  const profile = useAppSelector(selectProfile);
  const navigate = useNavigate();

  console.log('passa')

  const redirectTo = (to: string, replace = true) => {
    navigate(to, { replace });
  };

  const getRedirectUrlByRole = () => {
    if (profile?.codiceRuolo) {
      const { codiceRuolo, idProgramma, idProgetto } = profile;
      switch (codiceRuolo) {
        case userRoles.FAC:
        case userRoles.VOL:
        case userRoles.REG:
        case userRoles.REGP: {
          if (idProgetto && idProgramma) {
            redirectTo(
              `/area-amministrativa/programmi/${idProgramma}/progetti/${idProgetto}/info`
            );
          } else if (idProgramma) {
            redirectTo(`/area-amministrativa/programmi/${idProgramma}/info`);
          }
          break;
        }
        case userRoles.DTD:
        case userRoles.DSCU: {
          redirectTo('/area-amministrativa');
          break;
        }
        default:
      }
    }
  };

  const handleRedirectUser = () => {
    if (!isLogged) {
      navigate('/auth', { replace: true });
    } else if (user && profile) {
      getRedirectUrlByRole();
    }
  };

  useEffect(() => {
    handleRedirectUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLogged]);

  return <Loader />;
};

export default AuthRedirect;

import React, { useEffect, useState } from 'react';
import API from '../../../utils/apiHelper';
import { useDispatch } from 'react-redux';
import { hideLoader, showLoader } from '../../../redux/features/app/appSlice';
import { getUserHeaders } from '../../../redux/features/user/userThunk';
import { GetProgramDetail } from '../../../redux/features/administrativeArea/programs/programsThunk';
import { GetProjectDetail } from '../../../redux/features/administrativeArea/projects/projectsThunk';
import { useAppSelector } from '../../../redux/hooks';
import {
  selectPrograms,
  selectProjects,
} from '../../../redux/features/administrativeArea/administrativeAreaSlice';
import { userRoles } from '../AdministrativeArea/Entities/utils';
import PageTitle from '../../../components/PageTitle/pageTitle';

/*
const baseFrameURL =
  'https://oceddloir7.execute-api.eu-central-1.amazonaws.com/test/anonymous-embed-sample?mode=getUrl';
// OLD'https://hnmhsi4ogf.execute-api.eu-central-1.amazonaws.com/test/anonymous-embed-sample';
*/

const dashboardBaseURL = process.env.REACT_APP_DASHBOARD_BASE_URL;

const dashboardRoles: {
  [key: string]: {
    append?: string;
    endpoint: string;
  };
} = {
  DTD: {
    endpoint: 'vw-monitoraggio',
  },
  DSCU: {
    endpoint: 'vw-monitoraggio-dscu',
  },
  REG: {
    endpoint: 'vw-ente-gestore-programma',
  },
  REGP: {
    endpoint: 'vw-ente-gestore-progetto',
  },
  CITTADINO: {
    endpoint: 'vw-cittadino',
  },
};

const Dashboard = () => {
  const dispatch = useDispatch();
  const [frameUrl, setFrameUrl] = useState('');
  const user = getUserHeaders();
  const { dettagliInfoProgramma: program } =
    useAppSelector(selectPrograms).detail;
  const { dettagliInfoProgetto: project } =
    useAppSelector(selectProjects).detail;

  const calcEndpoint = () => {
    let requestURL = dashboardBaseURL;
    switch (user?.codiceRuolo) {
      case userRoles.DTD:
      case userRoles.DSCU: {
        requestURL = `${requestURL}/${
          dashboardRoles[user.codiceRuolo].endpoint
        }`;
        break;
      }
      case userRoles.REG: {
        if (program?.policy) {
          requestURL = `${requestURL}/${
            dashboardRoles.REG.endpoint
          }-${program.policy.toLowerCase()}`;
        } else {
          return null;
        }
        break;
      }
      case userRoles.REGP: {
        if (project?.policy) {
          requestURL = `${requestURL}/${
            dashboardRoles.REGP.endpoint
          }-${project.policy.toLowerCase()}`;
        } else {
          return null;
        }
        break;
      }
      default: {
        requestURL = `${requestURL}/${dashboardRoles.CITTADINO.endpoint}`;
        break;
      }
    }
    return `${requestURL}?mode=getUrl`;
  };

  const getDashboardURL = async () => {
    try {
      dispatch(showLoader());
      const endpoint = calcEndpoint();
      if (endpoint) {
        const res = await API.get(endpoint);
        if (res?.data?.EmbedUrl) {
          setFrameUrl(
            `${res.data.EmbedUrl}&locale=it-IT${
              user?.idProgetto && project?.id
                ? `&progetto=${user.idProgetto}`
                : user?.idProgramma && program?.codice
                ? `&programma=${user.idProgramma}`
                : ''
            }`
          );
        }
      }
    } catch (error) {
      console.log('getDashboardURL error', error);
    } finally {
      dispatch(hideLoader());
    }
  };

  useEffect(() => {
    if (user?.idProgramma) {
      dispatch(GetProgramDetail(user.idProgramma));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.idProgramma]);

  useEffect(() => {
    if (user?.idProgetto) {
      dispatch(GetProjectDetail(user.idProgetto));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.idProgetto]);

  useEffect(() => {
    getDashboardURL();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.codiceRuolo, program?.codice, project?.id]);

  return (
    <div className='container dashboard-container my-5'>
      <PageTitle
        title='La mia dashboard'
        subtitle='Consulta le statistiche rappresentate in questa pagina, oppure accedi allo strumento di Business Intelligence per consultare, configurare e scaricare in autonomia i dati a tua disposizione'
        cta={{
          action: () => console.log('go to BI'),
          label: 'Vai a Business intelligence',
        }}
      />
      <div className='dashboard-container__frame w-100 mt-5'>
        <iframe
          frameBorder='0'
          src={frameUrl}
          title='quick sight dashboard'
          height='100%'
          width='100%'
        />
      </div>
    </div>
  );
};

export default Dashboard;

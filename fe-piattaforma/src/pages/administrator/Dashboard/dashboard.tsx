import React, { useEffect, useState } from 'react';
import API from '../../../utils/apiHelper';
import { useDispatch } from 'react-redux';
import {
  hideLoader,
  selectDevice,
  showLoader,
} from '../../../redux/features/app/appSlice';
import { GetProgramDetail } from '../../../redux/features/administrativeArea/programs/programsThunk';
import { GetProjectDetail } from '../../../redux/features/administrativeArea/projects/projectsThunk';
import { useAppSelector } from '../../../redux/hooks';
import {
  selectPrograms,
  selectProjects,
} from '../../../redux/features/administrativeArea/administrativeAreaSlice';
import { userRoles } from '../AdministrativeArea/Entities/utils';
import PageTitle from '../../../components/PageTitle/pageTitle';
import useGuard from '../../../hooks/guard';
import { selectProfile } from '../../../redux/features/user/userSlice';
import { getMediaQueryDevice } from '../../../utils/common';

/*
const baseFrameURL =
  'https://oceddloir7.execute-api.eu-central-1.amazonaws.com/test/anonymous-embed-sample?mode=getUrl';
// OLD'https://hnmhsi4ogf.execute-api.eu-central-1.amazonaws.com/test/anonymous-embed-sample';
*/

const dashboardBaseURL =
  process.env.REACT_APP_DASHBOARD_BASE_URL ||
  'https://backend.facilitazione-dev.mitd.technology/dashboard_dev';

const dashboard_BI_URL =
  process.env.REACT_APP_DASHBOARD_BI_URL ||
  'https://137642333557.signin.aws.amazon.com/console';

const dashboardRoles: {
  [key: string]: {
    append?: string;
    endpoint?: string;
    rfd?: string;
    scd?: string;
  };
} = {
  DTD: {
    endpoint: 'vw-monitoraggio',
  },
  DSCU: {
    endpoint: 'vw-monitoraggio-dscu',
  },
  REG: {
    rfd: 'vw-ente-gestore-programma-rfd',
    scd: 'ente-gest-programma-scd',
  },
  REGP: {
    rfd: 'vw-ente-gestore-progetto-rfd',
    scd: 'ente-gest-progetto-scd',
  },
  CITTADINO: {
    endpoint: 'vw-cittadino',
  },
};

const publicContents = {
  title: 'Servizi di facilitazione e formazione per i cittadini',
  subtitle:
    'Rappresentazione dei dati relativi ai servizi di facilitazione e formazione erogati ai cittadini',
};

const authContents = {
  title: 'La mia dashboard',
  subtitle:
    'Consulta le statistiche rappresentate in questa pagina, oppure accedi allo strumento di Business Intelligence per consultare, configurare e scaricare in autonomia i dati a tua disposizione',
};

const authContentsShort = {
  title: 'I miei report',
  subtitle: 'Consulta le statistiche rappresentate in questa pagina',
};

/*
HEIGHT IFRAME REPORT DATI
         RUOLO                 ---      DESKTOP       ---        MOBILE      ---       TABLET
> DELEGATO REGIONE PIEMONTE    ---      1836px        ---        660px       ---       1080px
> DELEGATO COMUNE CATANZARO    ---      1900px        ---        680px       ---       1100px
> DTD AMMINISTRATORE           ---      2040px        ---        780px       ---       1220px
> REFERENTE REGIONE PIEMONTE   ---      1836px        ---        660px       ---       1080px
> GUEST                        ---      3040px        ---        2830px       ---      4770px
* */

const iframeHeightByRole = {
  DTD: {
    mobile: '960px',
    tablet: '1480px',
    desktop: '3820px',
  },
  DSCU: {
    mobile: '860px',
    tablet: '1220px',
    desktop: '2340px',
  },
  REG: {
    mobile: '860px',
    tablet: '1200px',
    desktop: '2140px',
  },
  REGP: {
    mobile: '860px',
    tablet: '1200px',
    desktop: '2140px',
  },
  GUEST: {
    mobile: '2830px',
    tablet: '4770px',
    desktop: '3140px',
  },
};

const Dashboard = () => {
  const dispatch = useDispatch();
  const device = useAppSelector(selectDevice);
  const [frameUrl, setFrameUrl] = useState('');
  const [frameHeight, setFrameHeight] = useState('100%');
  const user = useAppSelector(selectProfile);
  const { hasUserPermission } = useGuard();
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
      case userRoles.REG:
      case userRoles.DEG: {
        if (program?.policy?.toLowerCase() === 'rfd') {
          requestURL = `${requestURL}/${dashboardRoles.REG.rfd}`;
        } else if (program?.policy?.toLowerCase() === 'scd') {
          requestURL = `${requestURL}/${dashboardRoles.REG.scd}`;
        } else {
          return null;
        }
        break;
      }
      case userRoles.REGP:
      case userRoles.DEGP: {
        if (project?.policy?.toLowerCase() === 'rfd') {
          requestURL = `${requestURL}/${dashboardRoles.REGP.rfd}`;
        } else if (project?.policy?.toLowerCase() === 'scd') {
          requestURL = `${requestURL}/${dashboardRoles.REGP.scd}`;
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

  const calcFrameHeight = () => {
    let heightToSet = frameHeight;
    switch (user?.codiceRuolo) {
      case userRoles.DTD: {
        heightToSet = iframeHeightByRole.DTD[getMediaQueryDevice(device)];
        break;
      }
      case userRoles.DSCU: {
        heightToSet = iframeHeightByRole.DSCU[getMediaQueryDevice(device)];
        break;
      }
      case userRoles.REG:
      case userRoles.DEG: {
        heightToSet = iframeHeightByRole.REG[getMediaQueryDevice(device)];
        break;
      }
      case userRoles.REGP:
      case userRoles.DEGP: {
        heightToSet = iframeHeightByRole.REGP[getMediaQueryDevice(device)];
        break;
      }
      default: {
        heightToSet = iframeHeightByRole.GUEST[getMediaQueryDevice(device)];
        break;
      }
    }
    return heightToSet;
  };

  useEffect(() => {
    setFrameHeight(calcFrameHeight());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.codiceRuolo, device]);

  const contents = user?.codiceRuolo
    ? hasUserPermission(['acc.self.dshb'])
      ? authContents
      : authContentsShort
    : publicContents;

  return (
    <div className='container dashboard-container my-5'>
      <PageTitle
        title={contents?.title}
        subtitle={contents?.subtitle}
        cta={
          hasUserPermission(['acc.self.dshb'])
            ? {
                action: () => {
                  console.log('go to BI', dashboard_BI_URL);
                  window.open(dashboard_BI_URL, '_blank');
                },
                label: 'Vai a Business intelligence',
              }
            : undefined
        }
      />
      <div className='dashboard-container__frame w-100 mt-5'>
        <iframe
          frameBorder='0'
          src={frameUrl}
          title='quick sight dashboard'
          height={frameHeight}
          width='100%'
        />
      </div>
    </div>
  );
};

export default Dashboard;

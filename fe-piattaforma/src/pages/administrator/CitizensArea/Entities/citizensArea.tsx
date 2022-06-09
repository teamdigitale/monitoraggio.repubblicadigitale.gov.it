import React, { useEffect, useState } from 'react';
import PageTitle from '../../../../components/PageTitle/pageTitle';
import { Container } from 'design-react-kit';
import { Outlet, Route, useLocation } from 'react-router-dom';
import Citizens from './Citizens/citizens';
import CitizensDetail from './Citizens/citizensDetail';
import { useAppSelector } from '../../../../redux/hooks';
import { selectDevice } from '../../../../redux/features/app/appSlice';
import clsx from 'clsx';

const locations = {
  events: 'eventi',
  citizens: 'cittadini',
};

const arrayBreadcrumb = [
  {
    label: 'Home',
    url: '/',
  },
  {
    label: 'Area cittadini',
  },
];

const PageTitleMock: {
  [key: string]: {
    title: string;
    subtitle: string;
    textCta: string;
    iconCta: string;
  };
} = {
  cittadini: {
    title: 'Area Cittadini',
    subtitle:
      'Qui puoi consultare la lista dei cittadini e i questionari da compilare e già completati',
    textCta: 'Compila un nuovo questionario',
    iconCta: 'it-plus',
  },
  eventi: {
    title: 'Lista Eventi',
    subtitle: "Inserisci l'identificativo o il nome dell'evento ",
    textCta: 'Crea evento',
    iconCta: 'it-plus',
  },
};

const CitizensArea = () => {
  const device = useAppSelector(selectDevice);
  const { pathname } = useLocation();
  const [correctPageTitle, setCorrectPageTitle] = useState<{
    title: string;
    subtitle: string;
    textCta: string;
    iconCta: string;
  }>();

  useEffect(() => {
    if (pathname.includes(locations.events)) {
      setCorrectPageTitle(PageTitleMock.eventi);
    } else {
      setCorrectPageTitle(PageTitleMock.cittadini);
    }
  }, []);
  return (
    <>
      <PageTitle breadcrumb={arrayBreadcrumb} {...correctPageTitle} />
      <Container className={clsx(device.mediaIsPhone && 'px-3')}>
        <Outlet />
      </Container>
    </>
  );
};

export default CitizensArea;

export const AreaCittadiniRoutes = [
  <Route key='area-cittadini' element={<Citizens />} path='/area-cittadini' />,
  <Route
    key='area-cittadini-dettaglio'
    element={<CitizensDetail />}
    path='/area-cittadini/:codFiscale'
  />,
];

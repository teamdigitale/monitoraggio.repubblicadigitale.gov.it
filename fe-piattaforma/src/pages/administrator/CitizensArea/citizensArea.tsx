import React, { lazy, useEffect, useState } from 'react';
import PageTitle from '../../../components/PageTitle/pageTitle';
import { Container } from 'design-react-kit';
import { Route, Routes, useLocation } from 'react-router-dom';
import { useAppSelector } from '../../../redux/hooks';
import { selectDevice } from '../../../redux/features/app/appSlice';
import clsx from 'clsx';
const Citizens = lazy(() => import('./Entities/Citizens/citizens'));
const CitizensDetail = lazy(() => import('./Entities/Citizens/citizensDetail'));

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
    title?: string;
    subtitle?: string;
    textCta?: string;
    iconCta?: string;
  }>();

  useEffect(() => {
    if (pathname.includes(locations.events)) {
      setCorrectPageTitle(PageTitleMock.eventi);
    }
  }, []);
  return (
    <>
      <PageTitle breadcrumb={arrayBreadcrumb} {...correctPageTitle} />
      <Container className={clsx(device.mediaIsPhone && 'px-3')}>
        <Routes>{AreaCittadiniRoutes}</Routes>
      </Container>
    </>
  );
};

export default CitizensArea;

export const AreaCittadiniRoutes = [
  <Route key='area-cittadini' element={<Citizens />} path='/' />,
  <Route
    key='area-cittadini-dettaglio'
    element={<CitizensDetail />}
    path='/:codFiscale'
  />,
];

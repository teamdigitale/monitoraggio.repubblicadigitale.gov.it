import React from 'react';
import PageTitle from '../../../components/PageTitle/pageTitle';
import { Container } from 'design-react-kit';
import { Outlet, Route } from 'react-router-dom';
import Citizens from './Entities/Citizens/citizens';
import CitizensDetail from './Entities/Citizens/citizensDetail';
import { useAppSelector } from '../../../redux/hooks';
import { selectDevice } from '../../../redux/features/app/appSlice';
import clsx from 'clsx';

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
  title: string;
  subtitle: string;
  textCta: string;
  iconCta: string;
} = {
  title: 'Area Cittadini',
  subtitle:
    'Qui puoi consultare la lista dei cittadini e i questionari da compilare e già completati',
  textCta: 'Compila un nuovo questionario',
  iconCta: 'it-plus',
};

const CitizensArea = () => {
  const device = useAppSelector(selectDevice);
  return (
    <>
      <PageTitle breadcrumb={arrayBreadcrumb} {...PageTitleMock} />
      <Container className={clsx(device.mediaIsPhone && 'px-3')}>
        <Outlet />
      </Container>
    </>
  );
};

export default CitizensArea;

export const AreaCittadiniRoutes = [
  <Route key='area-cittadini' element={<Citizens />} path='' />,
  <Route
    key='area-cittadini'
    element={<CitizensDetail />}
    path='/area-cittadini/:codFiscale'
  />,
];

import React, { memo } from 'react';
import { Col, Container, Row } from 'design-react-kit';
import PageTitle from '../../../components/PageTitle/pageTitle';
import FiltersAside from '../../../components/FiltersAside/filtersAside';
import CardDocument from '../../../components/CardDocument/cardDocument';

const PageTitleMock = {
  title: 'Documenti',
  subtitle:
    'Qui potrai cercare i documenti condivisi e accedere al workspace per lavorare con gli altri.',
  textCta: 'Workspace',
  iconCta: 'it-external-link',
};

const SurveyFiltersOptionsMock = [
  { label: 'Progetto 1', key: 'project', value: 'project1' },
  { label: 'Progetto 2', key: 'project', value: 'project2' },
  { label: 'Progetto 3', key: 'project', value: 'project3' },
];

const FiltersAsideMock = {
  title: 'Filtra per progetto',
  multiFilter: false,
  type: 'checkbox',
  filterOptions: SurveyFiltersOptionsMock,
};

const DocumentCardMock = {
  title:
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor…',
  description:
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. ',
  fileType: 'PDF',
};

const DocumentsMock = [DocumentCardMock, DocumentCardMock, DocumentCardMock];

const arrayBreadcrumb = [
  {
    label: 'Home',
    url: '/',
  },
  {
    label: 'Onboarding',
    url: '/onboarding',
  },
  {
    label: 'Survey',
    url: '/survey',
  },
];

const Documents = () => {

  return (
    <div>
      <PageTitle
        breadcrumb={arrayBreadcrumb} // TODO da rendere dinamico
        {...PageTitleMock}
      />
      <Container>
        <Row>
          <Col md={3}>
            <FiltersAside {...FiltersAsideMock} />
          </Col>
          <Col md={8}>
            {DocumentsMock?.length ? (
              <>
                {DocumentsMock.map((doc, i) => (
                  <CardDocument
                    // TODO update key with a unique value
                    key={i}
                    {...doc}
                  />
                ))}
              </>
            ) : (
              <div className='my-4'>Non ci sono documenti</div>
            )}
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default memo(Documents);

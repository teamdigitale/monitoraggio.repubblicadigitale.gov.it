import React, { memo } from 'react';
import { Col, Container } from 'design-react-kit';
import PageTitle from '../../../components/PageTitle/pageTitle';
import FiltersAside from '../../../components/FiltersAside/filtersAside';
// import CardCommunity from '../../../components/CardCommunity/cardCommunity';
import { CardStatusAction, SearchBar } from '../../../components';
import API from '../../../utils/apiHelper';

const PageTitleMock = {
  title: 'Questionari',
  subtitle:
    'Qui puoi trovari tutti i questionari che hai cominciato a compilare e quelli già completati.',
  textCta: 'Compila questionario',
  iconCta: 'it-plus',
};

const SurveyFiltersOptionsMock = [
  { label: 'Progetto 1', key: 'project', value: 'project1' },
  { label: 'Progetto 2', key: 'project', value: 'project2' },
  { label: 'Progetto 3', key: 'project', value: 'project3' },
];

const FiltersAsideMock = {
  title: 'Filtra per progetto',
  multiFilter: true,
  type: 'checkbox',
  filterOptions: SurveyFiltersOptionsMock,
  colWidth: 3,
};

const arrayBreadcrumb = [
  {
    label: 'Home',
    url: '/',
  },
  {
    label: 'Registrazione',
    url: '/registrazione',
  },
  {
    label: 'Survey',
    url: '/survey',
  },
];

// const CommunityPropsMock = {
//   title: 'SPID',
//   community: 'Servizi online',
//   text: 'Ciao e benvenuti nella sezione di SPID!',
//   date: 'FEB 2022',
//   likes: '21.4 K',
//   commentsTot: 484,
//   fullCard: true,
//   comments: [
//     {
//       user: 'Mte90',
//       picture: '',
//       commmentText:
//         'La domanda è: dove hai preso questo documento per verificare? Sai com’é dal titolo mi aspettavo un link e non uno screen.',
//       commentDate: "gen '19",
//     },
//   ],
// };

const SurveyCardMock = {
  title: 'Mario Rossi',
  subtitle: '12/11/2021',
  status: 'COMPLETED',
  actionView: true,
};

const mock = [
  { label: 'prova', value: 'prova' },
  { label: 'pippo', value: 'pippo' },
  { label: 'mario', value: 'mario' },
];
const filterOptions = async (inputValue: string) => {
  if (!inputValue) return [];
  await API.get('https://cat-fact.herokuapp.com/facts');
  return mock.filter((i) =>
    i.label.toLowerCase().includes(inputValue.toLowerCase())
  );
};

const Survey = () => {
  return (
    <div>
      <PageTitle breadcrumb={arrayBreadcrumb} {...PageTitleMock} />
      <Container>
        <SearchBar
          filterOptions={filterOptions}
          onInputChange={(newValue) => console.log('survey newValue', newValue)}
          placeholder='Cerca nel sito'
          isClearable
          title='Cerca fra gli argomenti'
          id='search-survey'
        />
        <div className='d-flex flex-row'>
          <Col md={3}>
            <FiltersAside {...FiltersAsideMock} />
          </Col>
          <Col md={9} className='ml-5'>
            <CardStatusAction {...SurveyCardMock} />
          </Col>
        </div>
        {/* <CardCommunity {...CommunityPropsMock} /> */} 
      </Container>
    </div>
  );
};

export default memo(Survey);

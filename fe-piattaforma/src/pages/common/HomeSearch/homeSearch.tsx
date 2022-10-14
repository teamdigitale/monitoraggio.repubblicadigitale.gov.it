import clsx from 'clsx';
import { Container } from 'design-react-kit';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import {
  Accordion,
  CardCommunity,
  EmptySection,
  SearchBar,
} from '../../../components';
import CardDocument from '../../../components/CardDocument/cardDocument';
import CardShowcase from '../../../components/CardShowcase/cardShowcase';
import PageTitle from '../../../components/PageTitle/pageTitle';
import { selectDevice } from '../../../redux/features/app/appSlice';
import {
  selectDocsList,
  selectNewsList,
  selectTopicsList,
} from '../../../redux/features/forum/forumSlice';
import { GetItemsBySearch } from '../../../redux/features/forum/forumThunk';
import { useAppSelector } from '../../../redux/hooks';
import './homeSearch.scss';

const PageTitleDesktopMock = {
  title: 'Cerca su bacheca, community e documenti',
};
const PageTitleMobileMock = {
  title: 'Cerca',
};

const HomeSearch = () => {
  const [visibleSearch, setVisibleSearch] = useState<boolean>(false);
  const newsList = useAppSelector(selectNewsList);
  const topicsList = useAppSelector(selectTopicsList);
  const docsList = useAppSelector(selectDocsList);
  const device = useAppSelector(selectDevice);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(GetItemsBySearch('search'));
  }, []);

  const handleSearch = () => {
    console.log('Cerca');
    setVisibleSearch(true);
  };
  return (
    <div>
      {!device.mediaIsPhone ? (
        <PageTitle {...PageTitleDesktopMock} />
      ) : (
        <div className='pl-4'>
          <PageTitle {...PageTitleMobileMock} />
        </div>
      )}
      <Container className='pb-5'>
        <SearchBar
          onInputChange={(newValue) =>
            console.log('home-search newValue', newValue)
          }
          placeholder='Lorem ipsum dolor sit amet lorem ipsum dolor sit'
          isClearable
          id='home-search'
          className={clsx('w-75', device.mediaIsPhone && 'w-100 pl-3')}
          onSubmit={handleSearch}
        />
        {!visibleSearch ? (
          <div style={{ height: '379px' }}></div>
        ) : (
          <>
            <h1
              className={clsx(
                'h4',
                'primary-color-a10',
                'py-5',
                device.mediaIsPhone && 'd-flex justify-content-center'
              )}
            >
              RISULTATI DELLA RICERCA
            </h1>
            <Accordion
              title='Bacheca'
              totElem={newsList.length}
              iconLeft={false}
            >
              <div className='row'>
                {newsList.length ? (
                  newsList.map((showCaseElement, i) => (
                    <div
                      key={i}
                      className={clsx(
                        'col-12',
                        'col-md-6',
                        'col-lg-4',
                        'my-2',
                        'align-cards'
                      )}
                    >
                      <CardShowcase {...showCaseElement} />
                    </div>
                  ))
                ) : (
                  <EmptySection title='Non ci sono news' />
                )}
              </div>
            </Accordion>
            <Accordion
              title='Community'
              totElem={topicsList.length}
              iconLeft={false}
            >
              <div className='row'>
                {topicsList.length ? (
                  topicsList.map((communityElement, i) => (
                    <div
                      key={i}
                      className={clsx(
                        'col-12',
                        'col-md-6',
                        'col-lg-4',
                        'my-2',
                        'align-cards'
                      )}
                    >
                      <CardCommunity {...communityElement} />
                    </div>
                  ))
                ) : (
                  <EmptySection title='Non ci sono topic' />
                )}
              </div>
            </Accordion>
            <Accordion
              title='Documenti'
              totElem={docsList.length}
              iconLeft={false}
            >
              <div className='row'>
                {docsList.length ? (
                  docsList.map((doc, i) => (
                    <div
                      key={i}
                      className={clsx(
                        'col-12',
                        'col-md-6',
                        'col-lg-4',
                        'my-2',
                        'align-cards'
                      )}
                    >
                      <CardDocument {...doc} />
                    </div>
                  ))
                ) : (
                  <EmptySection title='Non ci sono documenti' />
                )}
              </div>
            </Accordion>
          </>
        )}
      </Container>
    </div>
  );
};

export default HomeSearch;

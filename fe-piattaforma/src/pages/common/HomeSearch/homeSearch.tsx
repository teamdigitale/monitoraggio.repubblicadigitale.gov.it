import clsx from 'clsx';
import { Container } from 'design-react-kit';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Accordion, CardCommunity, EmptySection, SearchBar } from '../../../components';
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

const PageTitleMock = {
  title: 'Cerca su bacheca, forum e documenti',
};
/* const PageTitleMobileMock = {
  title: 'Cerca',
}; */

const searchMinLength = 2;

const HomeSearch = () => {
  const [visibleSearch, setVisibleSearch] = useState<boolean>(false);
  const newsList = useAppSelector(selectNewsList);
  const topicsList = useAppSelector(selectTopicsList);
  const docsList = useAppSelector(selectDocsList);
  const device = useAppSelector(selectDevice);
  const dispatch = useDispatch();

  const resetSearch = () => {
    setVisibleSearch(false);
  };

  const handleSearch = (value: string) => {
    if (value?.length >= searchMinLength) {
      setVisibleSearch(true);
      dispatch(GetItemsBySearch(value));
    }
  };
  return (
    <div>
      <PageTitle {...PageTitleMock} />
      <Container className='pb-5'>
        <SearchBar
          placeholder='Cerca'
          isClearable
          id='home-search'
          className={clsx('w-75', device.mediaIsPhone && 'w-100 pl-2')}
          onSubmit={handleSearch}
          minLength={searchMinLength}
          onReset={resetSearch}
        />
        {!visibleSearch ? (
          <div style={{ height: '379px' }} />
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
                  <EmptySection title='Non ci sono annunci' />
                )}
              </div>
            </Accordion>
            <Accordion
              title='Forum'
              totElem={topicsList.length}
              iconLeft={false}
            >
              <div className='row'>
                {topicsList.length ? (
                  topicsList.map((forumElement, i) => (
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
                      <CardCommunity {...forumElement} />
                    </div>
                  ))
                ) : (
                  <EmptySection title='Non ci sono argomenti' />
                )}
              </div>
            </Accordion>
            <Accordion
              title='Documenti'
              totElem={docsList.length}
              iconLeft={false}
            >
              <div
                className={clsx(
                  'row',
                  device.mediaIsPhone
                    ? 'justify-content-center'
                    : 'justify-content-start'
                )}
              >
                {docsList.length ? (
                  docsList.map((doc, i) => (
                    <div
                      key={i}
                      className={clsx(
                        'my-2',
                        !device.mediaIsPhone && 'mx-1',
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

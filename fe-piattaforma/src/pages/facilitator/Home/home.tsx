import React, { useState } from 'react';
import clsx from 'clsx';
import { Container } from 'design-react-kit';
import HeroHome from './components/HeroHome/HeroHome';
import BachecaDigitaleWidget from './components/BachecaDigitaleWidget/bachecaDigitaleWidget';
import CardsWrapper from './components/CardsWrapper/cardsWrapper';
import CardCommunity from '../../../components/CardCommunity/cardCommunity';
import { Card } from '../../../components';
import DashboardCard from './components/DashboardCard/dashboardCard';

const CommunityPropsMock = {
  title: 'SPID',
  community: 'Servizi online',
  text: 'Ciao e benvenuti nella sezione di SPID!',
  date: 'FEB 2022',
  likes: '21.4 K',
  commentsTot: 484,
  fullCard: false,
};
const CommunityMock = [
  CommunityPropsMock,
  CommunityPropsMock,
  CommunityPropsMock,
];

const DocumentiPropsMock = {
  category: 'Brochure',
  small: true,
  text: 'Tutte le informazioni e i documenti necessari per partecipare.',
  title: 'Brochure istituzionale',
};
const DocumentiMock = [
  DocumentiPropsMock,
  DocumentiPropsMock,
  DocumentiPropsMock,
];

const DashboardPropsMock = {
  icon: 'it-user',
  title: 'Cittadini incontrati',
  value: 64,
  ariaLabel: 'cittadino',
};
const DashboardMock = [
  DashboardPropsMock,
  DashboardPropsMock,
  DashboardPropsMock,
];

const Home: React.FC = () => {
  const [community] = useState(CommunityMock);
  const [dashboard] = useState(DashboardMock);
  const [documenti] = useState(DocumentiMock);

  return (
    <>
      <section aria-label='Home' className='lightgrey-bg-c1'>
        <HeroHome />
      </section>
      {community?.length ? (
        <section aria-label='Community' className='lightgrey-bg-c1'>
          <Container>
            <CardsWrapper
              title='Community'
              wrapperClassName={clsx(
                'flex-lg-row',
                'flex-column',
                'community__cards-wrapper',
                'justify-content-around'
              )}
            >
              {community.map((communityElement, i) => (
                <CardCommunity
                  // TODO update key with a unique value
                  key={i}
                  {...communityElement}
                />
              ))}
            </CardsWrapper>
          </Container>
        </section>
      ) : null}
      <section aria-label='Bacheca digitale'>
        <Container>
          <BachecaDigitaleWidget />
        </Container>
      </section>
      <section aria-label='Dashboard' className='lightgrey-bg-c1'>
        <Container>
          <CardsWrapper
            title='Report dati'
            wrapperClassName={clsx(
              dashboard?.length && 'd-flex',
              'flex-column',
              'flex-lg-row',
              'align-items-center',
              'gx-3',
              'dashboard__cards-wrapper'
            )}
          >
            {dashboard?.length ? (
              <>
                {dashboard.map((dashboardElement, i) => (
                  <DashboardCard
                    // TODO update key with a unique value
                    key={i}
                    {...dashboardElement}
                  />
                ))}
              </>
            ) : (
              <div className='my-4'>Non ci sono documenti</div>
            )}
          </CardsWrapper>
        </Container>
      </section>
      <section aria-label='Documenti'>
        <Container>
          <CardsWrapper
            title='Documenti'
            wrapperClassName={clsx(documenti?.length && 'd-flex')}
          >
            {documenti?.length ? (
              <>
                {documenti.map((doc, i) => (
                  <Card
                    // TODO update key with a unique value
                    key={i}
                    {...doc}
                    wrapperClassName={i < documenti.length - 1 ? 'mr-4' : ''}
                  />
                ))}
              </>
            ) : (
              <div className='my-4'>Non ci sono documenti</div>
            )}
          </CardsWrapper>
        </Container>
      </section>
    </>
  );
};

export default Home;

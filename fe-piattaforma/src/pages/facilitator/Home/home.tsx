import React from 'react';
import HeroHome from './components/HeroHome/HeroHome';
import BachecaDigitaleWidget from './components/BachecaDigitaleWidget/bachecaDigitaleWidget';
import CommunityWidget from './components/CommunityWidget/communityWidget';
import DocumentsWidget from './components/DocumentiWidget/documentiWidget';
import { Container } from 'design-react-kit';
import useGuard from '../../../hooks/guard';

const Home: React.FC = () => {
  const { hasUserPermission } = useGuard();
  return (
    <>
      <section aria-label='Home' >
        <HeroHome />
      </section>
      {hasUserPermission(['list.news']) ? (
        <section aria-label='Bacheca digitale' >
          <Container>
            <BachecaDigitaleWidget />
          </Container>
        </section>
      ) : null}
      {hasUserPermission(['list.topic']) ? (
      <section aria-label='Community' className='lightgrey-bg-b4'>
        <Container>
          <CommunityWidget />
        </Container>
      </section>
        ) : null}
      {hasUserPermission(['list.doc']) ? (
        <section aria-label='Documenti' >
          <Container>
            <DocumentsWidget />
          </Container>
        </section>
      ) : null}
    </>
  );
};

export default Home;

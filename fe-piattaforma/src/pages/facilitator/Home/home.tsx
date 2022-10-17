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
      <section aria-label='Home' className='lightgrey-bg-c1'>
        <HeroHome />
      </section>
      {hasUserPermission(['tab.bach']) ? (
        <section aria-label='Bacheca digitale' className='lightgrey-bg-c1'>
          <Container>
            <BachecaDigitaleWidget />
          </Container>
        </section>
      ) : null}
      <section aria-label='Community' className='lightgrey-bg-b4'>
        <Container>
          <CommunityWidget />
        </Container>
      </section>
      {hasUserPermission(['tab.doc']) ? (
        <section aria-label='Documenti' className='lightgrey-bg-c1'>
          <Container>
            <DocumentsWidget />
          </Container>
        </section>
      ) : null}
    </>
  );
};

export default Home;

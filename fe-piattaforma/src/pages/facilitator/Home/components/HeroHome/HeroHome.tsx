import React, { memo } from 'react';
import { Hero, HeroBackground, HeroBody, HeroTitle } from 'design-react-kit';
import heroHomeBackgroundImg from '../../../../../../public/assets/img/hero-home-background.png';

const HeroHome = () => {
  return (
    <Hero overlay='dark' small>
      <HeroBackground
        src={heroHomeBackgroundImg}
        title='image title'
        alt='imagealt'
      />
      <HeroBody>
        <HeroTitle
          tag='h2'
          className='text-white'
          role='heading'
          aria-level={1}
        >
          {'ti diamo il benvenuto su Facilita'.toUpperCase()}
        </HeroTitle>
        <p className='d-lg-block mt-5'>
          La piattaforma dei servizi di facilitazione e formazione digitale:
          gestisci le iniziative, monitora i risultati e interagisci con la
          community
        </p>
      </HeroBody>
    </Hero>
  );
};

export default memo(HeroHome);
